import React, {useEffect} from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Table, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { Loader } from '../Components/Loader'
import { Message } from '../Components/Message'
import { listItems, deleteItem, createItem } from '../Actions/ItemActions'
import {  useNavigate, useSearchParams } from 'react-router-dom'
import { ITEM_CREATE_RESET } from '../Constants/ItemConstants'
import { Paginate } from '../Components/Paginate'

export const SellerProductList = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const itemList = useSelector(state => state.itemList)
    const {error, loading, items, pages, page} = itemList;

    const customerDetails = useSelector((state) => state.customerDetails);
    const { loading: customerLoading, customer } = customerDetails;

    const itemDelete = useSelector(state => state.itemDelete)
    const {error: errorDelete, loading: deleteLoading, success} = itemDelete;

    const itemCreate = useSelector(state => state.itemCreate)
    const {error: errorCreate, loading: createLoading, success: createSuccess, item: createdItem} = itemCreate;

    const [searchParams, setSearchParams] = useSearchParams();
    let queryString = '';
    if(searchParams.size){
        queryString = '?'+searchParams.toString();
    }

    useEffect(()=>{
        dispatch({type: ITEM_CREATE_RESET});

        if(createSuccess){
            navigate(`../seller/product/${createdItem.item_id}/edit`);
        }else{
            if(!customerLoading && (!customer || !customer.isSeller)){
                navigate('../login');
            }else{
                dispatch(listItems(queryString));
            }
        }
    },[dispatch, success, createSuccess, createdItem, customer, customerLoading, searchParams])

    const deleteItemHandler = (id) =>{
        if(window.confirm('Are you sure you want to delete this item?')){
            dispatch(deleteItem(id));
        }
    }

    const createItemHandler = (item) =>{
        dispatch(createItem());
    }

  return (
    <div>
        <Row className='align-items-center'>
            <Col>
                <h1>Products</h1>
            </Col>
            <Col md={2} className='text-right'>
                <Button className='my-3 form-control'  onClick={createItemHandler}>
                    {createLoading && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>}
                    {createLoading ? "Creating" : (<div><i className='fas fa-plus'></i>Add Product</div>)}
                </Button>
            </Col>
        </Row>

        {deleteLoading && <Loader />}
        {errorDelete && <Message variant='danger'>{errorDelete}</Message>}

        {createLoading && <Loader />}
        {errorCreate && <Message variant='danger'>{errorCreate}</Message>}
        {loading ?
        <Loader />
        : error ?
        <Message variant='danger'>{error}</Message>
        :(
            <div>
                <Table striped bordered hover responsive className='table-sm'>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>NAME</th>
                            <th>PRICE</th>
                            <th>CATEGORIES</th>
                            <th></th>
                        </tr>
                    </thead>

                    <tbody>
                        {items.map((item)=>(
                            <tr key={item.item_id}>
                                <td>{item.item_id}</td>
                                <td>{item.item_name}</td>
                                <td>${item.item_price}</td>
                                <td>{item.categories.map((category) =>(
                                    <i key={category.category_id}>{category.category_name}{', '}</i>
                                ))}</td>
                                <td>
                                    <LinkContainer to={`../seller/product/${item.item_id}/edit`}>
                                        <Button variant='light' className='btn-sm'>
                                            <i className='fas fa-edit'></i>
                                        </Button>
                                    </LinkContainer>
                                    <Button variant='danger' className='btn-sm' onClick={() => deleteItemHandler(item.item_id)}>
                                        <i className='fas fa-trash'></i>
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                <Paginate pages={pages} page={page} isAdmin={true} />
            </div>
        )}
    </div>
  )
}

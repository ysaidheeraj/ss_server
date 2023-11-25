import React, {useEffect, useState} from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Table, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { Loader } from '../Components/Loader'
import { Message } from '../Components/Message'
import { listItems, deleteItem } from '../Actions/ItemActions'
import { Link, useNavigate } from 'react-router-dom'

export const SellerProductList = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const itemList = useSelector(state => state.itemList)
    const {error, loading, items} = itemList;

    const customerLogin = useSelector((state) => state.customerLogin);
    const { customerInfo } = customerLogin;

    const itemDelete = useSelector(state => state.itemDelete)
    const {error: errorDelete, loading: deleteLoading, success} = itemDelete;

    useEffect(()=>{
        if(customerInfo && customerInfo.isSeller){
            dispatch(listItems());
        }else{
            navigate('/login');
        }
    },[dispatch, customerInfo, success])

    const deleteItemHandler = (id) =>{
        if(window.confirm('Are you sure you want to delete this item?')){
            dispatch(deleteItem(id));
        }
    }

    const createItemHandler = (item) =>{

    }

  return (
    <div>
        <Row className='align-items-center'>
            <Col>
                <h1>Products</h1>
            </Col>
            <Col md={2} className='text-right'>
                <Button className='my-3 form-control'  onClick={createItemHandler}>
                    <i className='fas fa-plus'></i>Add Product
                </Button>
            </Col>
        </Row>

        {deleteLoading && <Loader />}
        {errorDelete && <Message variant='danger'>{errorDelete}</Message>}
        {loading ?
        <Loader />
        : error ?
        <Message variant='danger'>{error}</Message>
        :(
            <Table striped bordered hover responsive className='table-sm'>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>NAME</th>
                        <th>PRICE</th>
                        <th>CATEGORY</th>
                        <th></th>
                    </tr>
                </thead>

                <tbody>
                    {items.map((item)=>(
                        <tr key={item.item_id}>
                            <td>{item.item_id}</td>
                            <td>{item.item_name}</td>
                            <td>${item.item_price}</td>
                            <td>{}</td>
                            <td>
                                <LinkContainer to={`/seller/product/${item.item_id}/edit`}>
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
        )}
    </div>
  )
}
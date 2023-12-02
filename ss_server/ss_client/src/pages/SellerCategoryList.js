import React, {useEffect} from 'react'
import { Row, Col, Table, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { listCategories } from '../Actions/CategoriesActions';
import { Loader } from '../Components/Loader';
import { Message } from '../Components/Message';
import { createCategory, deleteCategory } from '../Actions/CategoriesActions';
import { CATEGORIES_CREATE_RESET } from '../Constants/CategoriesConstants';

export const SellerCategoryList = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const customerDetails = useSelector((state) => state.customerDetails);
    const { loading: customerLoading, customer } = customerDetails;

    const categoriesList = useSelector((state) => state.categoriesList);
    const {loading, categories, error } = categoriesList;

    const categoryCreate = useSelector(state => state.categoryCreate)
    const {error: errorCreate, loading: createLoading, success: createSuccess, category} = categoryCreate;

    const categoryDelete = useSelector(state => state.categoryDelete)
    const {error: errorDelete, loading: deleteLoading, success: deleteSuccess} = categoryDelete;
    
    useEffect(() =>{
        if(createSuccess){
            dispatch({type: CATEGORIES_CREATE_RESET})
            navigate(`/seller/category/${category.category_id}/edit`);
        }else{
          if(!customerLoading && (!customer || !customer.isSeller)){
            navigate('/login');
          }else{
            dispatch(listCategories());
          }
        }
    },[dispatch, createSuccess, category, deleteSuccess, customer, customerLoading])

    const createCategoryHandler = () =>{
        dispatch(createCategory());
    }
    const deleteCategoryHandler = (id) =>{
        if(window.confirm('Are you sure you want to delete this category?')){
            dispatch(deleteCategory(id));
        }
    }
    
  return (
    <Row>
        <Row className='align-items-center'>
            <Col>
                <h1>Categories</h1>
            </Col>
            <Col md={2} className='text-right'>
                <Button className='my-3 form-control'  onClick={createCategoryHandler}>
                    {createLoading && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>}
                    {createLoading ? "Creating" : (<div><i className='fas fa-plus'></i>Add Category</div>)}   
                </Button>
            </Col>
            {errorCreate && <Message variant='danger'>{errorCreate}</Message>}
            {errorDelete && <Message variant='danger'>{errorDelete}</Message>}
        </Row>
      <Col>
        {loading ?
        (<Loader />)
      : error ? (
        <Message variant='danger'>{error}</Message>
      ):(
        <Table striped responsive className='table-sm'>
          <thead>
            <tr>
              <th>Category Name</th>
              <th>Items</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.category_id}>
                <td>{category.category_name}</td>
                <td>{category.items.length}</td>
                <td>
                    <LinkContainer to={`/seller/category/${category.category_id}/edit`}>
                        <Button variant='light' className='btn-sm'>
                            <i className='fas fa-edit'></i>
                        </Button>
                    </LinkContainer>
                    <Button variant='danger' className='btn-sm' disabled={deleteLoading} onClick={() => deleteCategoryHandler(category.category_id)}>
                        <i className='fas fa-trash'></i>
                    </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      </Col>
    </Row>
  )
}

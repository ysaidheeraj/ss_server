import React, {useEffect} from 'react'
import { Row, Col, Table, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { listCategories } from '../Actions/CategoriesActions';
import { Loader } from '../Components/Loader';
import { Message } from '../Components/Message';

export const SellerCategoryList = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const customerDetails = useSelector((state) => state.customerDetails);
    const { customer } = customerDetails;

    if(!customer || !customer.isSeller){
        navigate('/login');
    }

    const categoriesList = useSelector((state) => state.categoriesList);
    const {loading, categories, error } = categoriesList;
    useEffect(() =>{
        if(!categories || !categories.length){
            dispatch(listCategories());
        }
    },[dispatch])

    const createCategoryHandler = () =>{

    }
    
  return (
    <Row>
        <Row className='align-items-center'>
            <Col>
                <h1>Categories</h1>
            </Col>
            {/* <Col md={2} className='text-right'>
                <Button className='my-3 form-control'  onClick={createCategoryHandler}>
                    <i className='fas fa-plus'></i>Add Category
                </Button>
            </Col> */}
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
              {/* <th></th> */}
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.category_id}>
                <td>{category.category_name}</td>
                <td>{category.items.length}</td>
                {/* <td>
                    <LinkContainer to={`/seller/category/${category.category_id}`}>
                        <Button className='btn-sm'>
                        Details
                        </Button>
                  </LinkContainer>
                </td> */}
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      </Col>
    </Row>
  )
}

import React, { useEffect } from 'react'
import { listStoreOrders } from '../Actions/OrderActions'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Form, Button, Row, Col, Table } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { Loader } from '../Components/Loader'
import { Message } from '../Components/Message'

export const StoreOrdersPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const customerLogin = useSelector((state) => state.customerLogin);
  const { customerInfo } = customerLogin;

  const sellerOrdersList = useSelector((state) => state.sellerOrdersList);
  const {loading, error, orders} = sellerOrdersList;

  useEffect(() =>{
    if (!customerInfo) {
      navigate("/login");
    }else{
      dispatch(listStoreOrders());
    }
  },[])
  return (
    <Row>
      <Col>
        <h2>Orders</h2>
        {loading ?
        (<Loader />)
      : error ? (
        <Message variant='danger'>{error}</Message>
      ):(
        <Table striped responsive className='table-sm'>
          <thead>
            <tr>
              <th>ID</th>
              <th>Ordered By</th>
              <th>Ordered On</th>
              <th>Total</th>
              <th>Paid</th>
              <th>Delivered</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.order_id}>
                <td>
                  {order.order_id}
                </td>
                <td>{order.customer.first_name}</td>
                <td>{order.order_created_time.substring(0,10)}</td>
                <td>${order.total_price}</td>
                <td>{order.order_paid_time ? (<i className="fa fa-check" aria-hidden="true" style={{'color': 'green'}}></i>) : (<i className="fa fa-times" aria-hidden="true" style={{'color': 'red'}}></i>)}</td>
                <td>{Number(order.order_status) >= 4  ? (<i className="fa fa-check" aria-hidden="true" style={{'color': 'green'}}></i>) : (<i className="fa fa-times" aria-hidden="true" style={{'color': 'red'}}></i>)}</td>
                <td>
                    <LinkContainer to={`/order/${order.order_id}`}>
                        <Button className='btn-sm'>
                        Details
                        </Button>
                  </LinkContainer>
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

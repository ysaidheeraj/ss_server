import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import {  Button, Row, Col, ListGroup, Image, Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Message } from '../Components/Message'
import { getOrderDetails, updateOrderDetails } from '../Actions/OrderActions'
import { Loader } from '../Components/Loader'
import { useNavigate } from 'react-router-dom'
export const OrderDetailsPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id: orderId } = useParams();

    const customerDetails = useSelector((state) => state.customerDetails);
    const { loading:customerLoading, customer } = customerDetails;

    useEffect(() => {
        if(!customerLoading){
            if(!customer || !customer.first_name){
                navigate(`/login`)
            }
        }
    }, [customerLoading, customer])

    const orderDetails = useSelector(state => state.orderDetails)
    const {error, loading, order} = orderDetails;

    const orderUpdate = useSelector(state => state.orderUpdate)
    const {loading: updating} = orderUpdate
    
    useEffect(() =>{
        if(!order || order.order_id !== Number(orderId)){
            dispatch(getOrderDetails(orderId))
        }
       
    },[dispatch, order, orderId])

    const updateOrderStatus = (status, warn, warnMessage) =>{
        if(warn && window.confirm(warnMessage)){
            dispatch(updateOrderDetails(orderId, {'order_status': status}));
        }else if(!warn){
            dispatch(updateOrderDetails(orderId, {'order_status': status}));
        }
    }
  return loading ? 
    (<Loader/>) 
    : error ? (<Message variant='danger'>{error}</Message>)
    : !customer || !customer.first_name ? (<Message variant='danger'>Please <a href={`/login`}>Login</a> to view order details.</Message>)
    :(
    <div>
        <h1>Order: {order.order_id}</h1>
        <Row>
            <Col md={8}>
                <ListGroup variant='flush'>
                    <ListGroup.Item>
                        <h2>Shipping</h2>
                        <p><strong>Name: {customer.first_name}{' '}{customer.last_name}</strong></p>
                        <p><strong>Email: <a href={`mailto:${customer.email}`}>{customer.email}</a></strong></p>
                        <p>
                            <strong>Shipping: </strong>
                            {order.shipping_address.address}, {order.shipping_address.city}
                            {' '}
                            {order.shipping_address.postalCode},
                            {' '}
                            {order.shipping_address.country}
                        </p>

                        {Number(order.order_status) >= 4 ?
                            (<Message variant='success'>Delivered</Message>)
                            :(<Message variant='warning'>Not Delivered</Message>)
                        }
                    </ListGroup.Item>

                    <ListGroup.Item>
                        <h2>Payment Method</h2>

                        <p>
                            <strong>Method: </strong>
                            {Number(order.payment_method) === 0 ? 'Cash on delivery' : 'Paypal'}
                        </p>

                        {Number(order.order_status) >= 4 ?
                            (<Message variant='success'>Paid on {order.order_paid_time.substring(0,10)}</Message>)
                            :(<Message variant='warning'>Not Paid</Message>)
                        }
                    </ListGroup.Item>

                    <ListGroup.Item>
                        <h2>Order Items</h2>

                        {order.order_items.length === 0 ? <Message variant='info'>Order is empty</Message>
                        : (
                            <ListGroup variant='flush'>
                                {order.order_items.map((item, ind) => (
                                    <ListGroup.Item key={item.order_item_id}>
                                        <Row>
                                            <Col md={1}>
                                                <Image src={item.Item.item_image} alt={item.Item.item_name} fluid rounded/>
                                            </Col>

                                            <Col>
                                                <Link to={`/product/${item.Item.item_id}`}>{item.Item.item_name}</Link>
                                            </Col>

                                            <Col md={4}>
                                                {item.item_quantity} x ${item.item_price} = ${(item.item_quantity * item.item_price).toFixed(2)}
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        )}
                    </ListGroup.Item>
                </ListGroup>
            </Col>

            <Col md={4}>
                <Card>
                    <ListGroup variant='flush'>
                        <ListGroup.Item>
                            <h2>Order Summary</h2>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <Row>
                                <Col>
                                    Item:
                                </Col>
                                <Col>${order.items_price}</Col>
                            </Row>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <Row>
                                <Col>
                                    Shipping:
                                </Col>
                                <Col>${order.shipping_price}</Col>
                            </Row>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <Row>
                                <Col>
                                    Tax:
                                </Col>
                                <Col>${order.tax_price}</Col>
                            </Row>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <Row>
                                <Col>
                                    Total:
                                </Col>
                                <Col>${order.total_price}</Col>
                            </Row>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <Row>
                                <Col>
                                {Number(order.order_status) === 3 ? (
                                        <Message variant='danger'>Cancelled</Message>
                                )
                                :customer.isSeller 
                                ?(
                                    Number(order.order_status) <= 1 ? (
                                        <Button variant='primary' className='form-control' onClick={() => updateOrderStatus(2, false)}>
                                            {updating && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>}
                                            {updating ? "Processing" : "Mark As Shipped"}
                                        </Button>
                                    ) : (
                                        <Message variant='success'>Shipped</Message>
                                    ) 
                                )
                                :(
                                    Number(order.order_status) <= 2 ? (
                                        <Button variant='danger' className='form-control' onClick={() => updateOrderStatus(3, true, 
                                        'Are you sure you want to cancel your order? This action is irreversible, and your order will be cancelled.')}>
                                            {updating && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>}
                                            {updating ? "Processing" : "Cancel Order"}
                                        </Button>
                                    ) : Number(order.order_status) === 4 ?(
                                        <Button variant='danger' className='form-control' onClick={() => updateOrderStatus(5, true, 
                                        'Are you sure you want to return your order?')}>
                                            {updating && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>}
                                            {updating ? "Processing" : "Return Order"}
                                        </Button>
                                    ): Number(order.order_status) === 5 ? (
                                        <Message variant='info'>Returned</Message>
                                    ): (
                                        <Message variant='info'>Refund Granted</Message>
                                    )
                                )}
                                {}
                                </Col>
                            </Row>
                        </ListGroup.Item>
                        {customer.isSeller &&  Number(order.order_status) === 2 && (
                                <ListGroup.Item>
                                        <Button variant='info' className='form-control' onClick={() => updateOrderStatus(4, false)}>
                                            {updating && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>}
                                            {updating ? "Processing" : "Mark As Delivered"}
                                        </Button>
                                </ListGroup.Item>
                        )}
                        {customer.isSeller && Number(order.order_status) === 4 &&(
                                <ListGroup.Item>
                                    <Message variant='success'>Delivered</Message>
                                </ListGroup.Item>
                        )}
                        {customer.isSeller && Number(order.order_status) === 5 &&(
                                <ListGroup.Item>
                                        <Button variant='info' className='form-control' onClick={() => updateOrderStatus(6, false)}>
                                            {updating && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>}
                                            {updating ? "Processing" : "Mark As Received"}
                                        </Button>
                                </ListGroup.Item>
                        )}
                    </ListGroup>
                </Card>
            </Col>
        </Row>
    </div>
  )
}

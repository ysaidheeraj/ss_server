import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {  Button, Row, Col, ListGroup, Image, Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Message } from '../Components/Message'
import { getOrderDetails } from '../Actions/OrderActions'
import { Loader } from '../Components/Loader'
export const OrderDetailsPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id: orderId } = useParams();

    const customerDetails = useSelector((state) => state.customerDetails);
    const { customer } = customerDetails;

    const orderDetails = useSelector(state => state.orderDetails)
    const {error, loading, order} = orderDetails;
    
    useEffect(() =>{
        if(!order || order.order_id !== Number(orderId)){
            dispatch(getOrderDetails(orderId))
        }
       
    },[order, orderId])
  return loading ? 
    (<Loader/>) 
    : error ? (<Message variant='danger'>{error}</Message>)
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

                        {Number(order.order_status) >= 2 ?
                            (<Message variant='success'>Delivered {order.order_paid_time}</Message>)
                            :(<Message variant='warning'>Not Delivered</Message>)
                        }
                    </ListGroup.Item>

                    <ListGroup.Item>
                        <h2>Payment Method</h2>

                        <p>
                            <strong>Method: </strong>
                            {Number(order.payment_method) === 0 ? 'Cash on delivery' : 'Paypal'}
                        </p>

                        {Number(order.order_status) >= 2 ?
                            (<Message variant='success'>Paid on {order.order_paid_time}</Message>)
                            :(<Message variant='warning'>Payment on delivery</Message>)
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
                        
                    </ListGroup>
                </Card>
            </Col>
        </Row>
    </div>
  )
}

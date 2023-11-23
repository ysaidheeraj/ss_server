import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {  Button, Row, Col, ListGroup, Image, Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { CheckoutStages } from '../Components/CheckoutStages'
import { Message } from '../Components/Message'
export const PlaceOrderPage = () => {
    const cart = useSelector(state => state.cart);

    cart.itemsPrice = cart.cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2)

    cart.shippingPrice = (cart.itemsPrice > 100 ? 0 : 10).toFixed(2); //If cardt value is greater that 100, then free
    cart.taxPrice = ((0.074) * cart.itemsPrice).toFixed(2);
    cart.totalPrice = (Number(cart.itemsPrice) + Number(cart.shippingPrice) + Number(cart.taxPrice)).toFixed(2);
      
    const placeOrder = () => {
        console.log('Place order');
    }
  return (
    <div>
        <CheckoutStages step1 step2 step3 step4/>
        <Row>
            <Col md={8}>
                <ListGroup variant='flush'>
                    <ListGroup.Item>
                        <h2>Shipping</h2>

                        <p>
                            <strong>Shipping: </strong>
                            {cart.shippingAddress.address}, {cart.shippingAddress.city}
                            {' '}
                            {cart.shippingAddress.pinCode},
                            {' '}
                            {cart.shippingAddress.country}
                        </p>
                    </ListGroup.Item>

                    <ListGroup.Item>
                        <h2>Payment Method</h2>

                        <p>
                            <strong>Method: </strong>
                            {cart.paymentMethod}
                        </p>
                    </ListGroup.Item>

                    <ListGroup.Item>
                        <h2>Order Items</h2>

                        {cart.cartItems.length === 0 ? <Message variant='info'>Your cart is empty</Message>
                        : (
                            <ListGroup variant='flush'>
                                {cart.cartItems.map((item, ind) => (
                                    <ListGroup.Item key={item.item}>
                                        <Row>
                                            <Col md={1}>
                                                <Image src={item.image} alt={item.name} fluid rounded/>
                                            </Col>

                                            <Col>
                                                <Link to={`/product/${item.item}`}>{item.name}</Link>
                                            </Col>

                                            <Col md={4}>
                                                {item.quantity} x ${item.price} = ${(item.quantity * item.price).toFixed(2)}
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
                                <Col>${cart.itemsPrice}</Col>
                            </Row>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <Row>
                                <Col>
                                    Shipping:
                                </Col>
                                <Col>${cart.shippingPrice}</Col>
                            </Row>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <Row>
                                <Col>
                                    Tax:
                                </Col>
                                <Col>${cart.taxPrice}</Col>
                            </Row>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <Row>
                                <Col>
                                    Total:
                                </Col>
                                <Col>${cart.totalPrice}</Col>
                            </Row>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <Button
                                type='button'
                                className='btn-block form-control'
                                disabled={cart.cartItems === 0}
                                onClick={placeOrder}
                            >Place Order</Button>
                        </ListGroup.Item>
                    </ListGroup>
                </Card>
            </Col>
        </Row>
    </div>
  )
}

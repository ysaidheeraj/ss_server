import React, { useEffect, useState } from 'react'
import { Link, useParams, useSearchParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, ListGroup, Image, Form, Button, Card } from 'react-bootstrap'
import { Message } from '../Components/Message'
import { addToCart, removeFromCart } from '../Actions/CartActions'

export const CartPage = () => {
    const { id: itemId } = useParams();
    const [searchParams] = useSearchParams();
    const [loggedIn, setLoggedIn] = useState(false);
    const quantity = searchParams.get('qty');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const cart = useSelector(state => state.cart);
    const {cartItems} = cart;
    
    const customerDetails = useSelector((state) => state.customerDetails);
    const { loading, customer } = customerDetails;

    useEffect(() => {
        if(!loading){
            if(customer && customer.isSeller){
                navigate('../');
            }else if (customer && customer.first_name){
                setLoggedIn(true);
            }else{
                navigate('../login')
            }
        }
    }, [loading])

    useEffect(() =>{
        if(itemId && loggedIn){
            dispatch(addToCart(itemId, quantity))
        }
    }, [dispatch, itemId, quantity, loggedIn]);

    const removeFromCartHandler = (id) =>{
        dispatch(removeFromCart(id));
    }

    const checkoutHandler = () =>{
        navigate('../login?redirect=shipping')
    }
  return (
    <Row>
        <h1>Shopping Cart</h1>
        <Col md={8}>
            {cartItems.length === 0 ? (
                <Message variant='light'>
                    Your cart is empty <Link to='../'>Back to Home</Link>
                </Message>
            ) : (
                <ListGroup variant='flush'>
                    {cartItems.map(item => (
                        <ListGroup.Item key={item.item}>
                            <Row>
                                <Col md={2}>
                                    <Image src={item.image} alt={item.name} fluid rounded/>
                                </Col>
                                <Col md={3}>
                                    <Link to={`../product/${item.item}`}>{item.name}</Link>
                                </Col>
                                <Col md={2}>
                                    ${item.price}
                                </Col>
                                <Col md={3}>
                                    <Form.Control
                                        as="select"
                                        className='form-select'
                                        value={item.quantity}
                                        onChange={(e) => dispatch(addToCart(item.item, Number(e.target.value)))}>
                                            {
                                                [...Array(item.available_count).keys()].map((x) => (
                                                    <option key={x + 1} value={x + 1}>
                                                    {x + 1}
                                                    </option>
                                                ))
                                            }
                                    </Form.Control>
                                </Col>
                                <Col md={1}>
                                    <Button
                                        type='button'
                                        variant='light'
                                        onClick={() => removeFromCartHandler(item.item)}
                                    >
                                        <i className='fas fa-trash'></i>
                                    </Button>
                                </Col>
                            </Row>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            )}
        </Col>

        <Col md={4}>
            <Card>
                <ListGroup variant='flush'>
                    <ListGroup.Item>
                        <h2>
                            Subtotal ({cartItems.reduce((acc, item) => acc + Number(item.quantity), 0)}) items
                        </h2>
                        ${cartItems.reduce((acc, item) => acc+item.quantity * item.price, 0).toFixed(2)}
                    </ListGroup.Item>

                    <ListGroup.Item>
                        <Button
                            type='button'
                            className='btn-dark form-control'
                            disabled={cartItems.length === 0}
                            onClick={checkoutHandler}
                        >
                            Proceed To Checkout
                        </Button>
                    </ListGroup.Item>
                </ListGroup>

                
            </Card>
        </Col>
    </Row>
  )
}

import React from 'react'
import { useState, useEffect } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { Form, Row, Col, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { Loader } from '../Components/Loader'
import { Message } from '../Components/Message'
import { FormContainer } from '../Components/FormContainer'
import { customer_details, customer_login } from '../Actions/UserActions'

export const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const loginSubmitHandler = (e) => {
        e.preventDefault();
        dispatch(customer_login(email, password));
    }
    const [searchParams] = useSearchParams();
    const redirect = searchParams.get('redirect') ? searchParams.get('redirect') : '/';

    const customerLogin = useSelector(state => state.customerLogin)
    const {error, loading, customerInfo} = customerLogin;

    const customerDetails = useSelector((state) => state.customerDetails);
    const { customer } = customerDetails;

    useEffect(() => {
        if (customer && customer.first_name){
            navigate(redirect);
        }
    }, [customer])
  return (
    <FormContainer>
        <h1>Login</h1>
        {error && <Message variant='danger'>{error}</Message>}
        {loading && <Loader />}
        <Form onSubmit={loginSubmitHandler}>
            <Form.Group controlId='email'>
                <Form.Label>Email Address:</Form.Label>
                <Form.Control
                    className='mb-3'
                    type='email'
                    placeholder='Enter your email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                ></Form.Control>
            </Form.Group>
            
            
            <Form.Group controlId='password'>
                <Form.Label>Password:</Form.Label>
                <Form.Control
                    className='mb-3'
                    type='password'
                    placeholder='Enter your password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                ></Form.Control>
            </Form.Group>

            <Button
                type="submit"
                variant='primary'
                className='form-control'
            >Login</Button>
        </Form>

        <Row className='py-3'>
            <Col>
                Don't have an account? <Link to={redirect ? `/register?redirect=${redirect}` : '/register'}>Register</Link>
            </Col>
        </Row>
    </FormContainer>
  )
}
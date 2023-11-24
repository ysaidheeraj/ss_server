import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { Loader } from '../Components/Loader'
import { Message } from '../Components/Message'
import { FormContainer } from '../Components/FormContainer'
import { customer_register } from '../Actions/UserActions'

export const RegisterPage = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [info, setInfo] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [searchParams] = useSearchParams();
    const redirect = searchParams.get('redirect') ? searchParams.get('redirect') : '/';

    const customerRegister = useSelector(state => state.customerRegister)
    const {error, loading, customerInfo} = customerRegister;

    useEffect(() => {
        if (customerInfo){
            navigate(redirect);
        }
    }, [customerInfo, redirect])

    const registerSubmitHandler = (e) => {
        e.preventDefault();
        if (password !== confirmPassword){
            setInfo('Passwords do not match');
        }else{
            setInfo('');
            dispatch(customer_register(firstName, lastName, email, password))
        }
    }
  return (
    <FormContainer>
        <h1>Register</h1>
        {info && <Message variant='danger'>{info}</Message>}
        {error && <Message variant='danger'>{error}</Message>}
        {loading && <Loader />}
        <Form onSubmit={registerSubmitHandler}>
            <Form.Group controlId='first_name'>
            
                <Form.Label>First Name:</Form.Label>
                    <Form.Control
                        required
                        className='mb-3'
                        type='text'
                        placeholder='Enter your first name'
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    ></Form.Control>
            </Form.Group>

            <Form.Group controlId='last_name'>
                <Form.Label>Last Name:</Form.Label>
                    <Form.Control
                        required
                        className='mb-3'
                        type='text'
                        placeholder='Enter your last name'
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    ></Form.Control>
            </Form.Group>
            
            
            <Form.Group controlId='email'>
                <Form.Label>Email Address:</Form.Label>
                <Form.Control
                    required
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
                    required
                    className='mb-3'
                    type='password'
                    placeholder='Enter your password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                ></Form.Control>
            </Form.Group>

            <Form.Group controlId='reenter_password'>
                <Form.Label>Confirm Password:</Form.Label>
                <Form.Control
                    required
                    className='mb-3'
                    type='password'
                    placeholder='Confirm your password'
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                ></Form.Control>
            </Form.Group>

            <Button
                type="submit"
                variant='primary'
                className='form-control'
            >Register</Button>

            <Row className='py-3'>
                <Col>
                    Already have an account? <Link to={redirect ? `/login?redirect=${redirect}` : '/login'}>Login</Link>
                </Col>
            </Row>
        </Form>
    </FormContainer>
  )
}

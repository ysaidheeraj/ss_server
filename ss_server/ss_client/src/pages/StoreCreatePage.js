import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { Loader } from '../Components/Loader'
import { Message } from '../Components/Message'
import { FormContainer } from '../Components/FormContainer'
import { create_store } from '../Actions/StoreActions'
import { SSHeader } from '../Components/SSHeader';
import { STORE_CREATE_RESET } from '../Constants/StoreConstants'

export const StoreCreatePage = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [searchParams] = useSearchParams();
    const redirect = searchParams.get('redirect') ? searchParams.get('redirect') : '/';

    const createStore = useSelector((state) => state.createStore);
    const { store, loading, error, success } = createStore;

    const sellerDetails = useSelector((state) => state.sellerDetails);
    const { seller, loading:sellerLoading } = sellerDetails;

    useEffect(() => {
        if (!sellerLoading && (!seller || !seller.first_name)){
            navigate(redirect);
        }else if(!loading && success){
            dispatch({type: STORE_CREATE_RESET});
            navigate(redirect);
        }
    }, [seller,sellerLoading, redirect, store, loading, success])

    const registerSubmitHandler = (e) => {
        e.preventDefault();
        dispatch(create_store(name, description));
    }
  return (
    <>
        <SSHeader seller={seller}/>
        <FormContainer>
            <h1>Create Store</h1>
            {error && <Message variant='danger'>{error}</Message>}
            {loading && <Loader />}
            <Form onSubmit={registerSubmitHandler}>
                <Form.Group controlId='name'>
                
                    <Form.Label>Store Name:</Form.Label>
                        <Form.Control
                            required
                            className='mb-3'
                            type='text'
                            placeholder='Enter store name'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        ></Form.Control>
                </Form.Group>

                <Form.Group controlId='description'>
                    <Form.Label>Description:</Form.Label>
                        <Form.Control
                            required
                            className='mb-3'
                            type='text'
                            as='textarea'
                            rows='5'
                            placeholder='Enter description'
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        ></Form.Control>
                </Form.Group>

                <Button
                    type="submit"
                    variant='primary'
                    className='form-control'
                >Create</Button>

            </Form>
        </FormContainer>
    </>
  )
}



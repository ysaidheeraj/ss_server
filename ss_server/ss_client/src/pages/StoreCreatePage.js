import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { Loader } from '../Components/Loader'
import { Message } from '../Components/Message'
import { FormContainer } from '../Components/FormContainer'
import { create_store, update_store } from '../Actions/StoreActions'
import { SSHeader } from '../Components/SSHeader';
import { STORE_CREATE_RESET } from '../Constants/StoreConstants'

export const StoreCreatePage = ({update=false}) => {
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

    const customerDetails = useSelector((state) => state.customerDetails);
    const { customer } = customerDetails;

    const storeDetails = useSelector((state) => state.storeDetails);
    const { store: currentStore } = storeDetails;

    useEffect(() => {
        if(currentStore.store_name){
            setName(currentStore.store_name);
            setDescription(currentStore.store_description ? currentStore.store_description : '');
        }
        if(update){
            if(!customer.first_name){
                navigate('../login');
            }
        }else{
            if (!sellerLoading && (!seller || !seller.first_name)){
                navigate(redirect);
            }else if(!loading && success){
                dispatch({type: STORE_CREATE_RESET});
            }
        }
    }, [seller,sellerLoading, redirect, store, loading, success, customer, currentStore, update])

    const registerSubmitHandler = (e) => {
        e.preventDefault();
        if(update){
            dispatch(update_store({
                'store_name': name,
                'store_description' : description
            }));
        }else{
            dispatch(create_store(name, description));
        }
    }
  return (
    <>
        {!update && <SSHeader seller={seller}/>}
        <FormContainer>
            <h1>{!update ? "Create" : "Update"} Store</h1>
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
                    className='w-100'
                >{update ? "Update" : "Create"}</Button>
            </Form>
        </FormContainer>
    </>
  )
}



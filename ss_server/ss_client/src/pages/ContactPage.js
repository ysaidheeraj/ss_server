import React, {useEffect, useState} from 'react'
import { FloatingLabel, Form, Button } from 'react-bootstrap';
import { FormContainer } from '../Components/FormContainer';
import { createStoreTicket } from '../Actions/StoreActions';
import { useDispatch, useSelector } from 'react-redux';
import Notification from "../Components/Notification";
import { STORE_CREATE_TICKET_RESET } from '../Constants/StoreConstants';

export const ContactPage = () => {
    const dispatch = useDispatch();
    const [subject, setSubject] = useState('');
    const [description, setDescription] = useState('');

    const createTicket = useSelector((state) => state.createTicket);
    const { success, error, loading, ticket } = createTicket;

    useEffect(() =>{
        if(success){
            dispatch({type: STORE_CREATE_TICKET_RESET});
            setSubject('');
            setDescription('');
            Notification.success("Issue reported successfully");
        }else if(error){
            Notification.error(error);
        }
    }, [dispatch, success, error])

    const submitContactForm = () =>{
        dispatch(createStoreTicket(subject, description));
    }
  return (
    <FormContainer>
        <h1>Contact us</h1>
        <p>If you have any issues, please feel free to write to us.</p>
        {/* {error && <Message variant='danger'>{error}</Message>}
        {loading && <Loader />} */}
        <Form onSubmit={submitContactForm}>
            <Form.Group controlId='Subject'>
                <FloatingLabel
                    controlId="floatingSubject"
                    label="Subject: "
                    className="mb-3"
                >
                    <Form.Control
                        className='mb-3'
                        type='text'
                        placeholder='Enter the subject'
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                    ></Form.Control>
                </FloatingLabel>
            </Form.Group>
            
            
            <Form.Group controlId='Description'>
                <FloatingLabel
                    controlId="floatingDescription"
                    label="Description:"
                    className="mb-3"
                >
                    <Form.Control
                        className='mb-3'
                        as='textarea'
                        rows='10'
                        placeholder='Enter description'
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        style={{ height: '200px', resize: 'vertical' }}
                    ></Form.Control>
                </FloatingLabel>
            </Form.Group>

            <Button
                type="submit"
                variant='primary'
                className='w-100'
            >
                {loading && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>}
                {loading ? "Processing" : "Submit"}
            </Button>
        </Form>
    </FormContainer>
  )
}

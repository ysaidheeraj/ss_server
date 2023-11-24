import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Form, Button, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { FormContainer } from '../Components/FormContainer'
import { savePaymentMethod } from '../Actions/CartActions'
import { CheckoutStages } from '../Components/CheckoutStages'

export const PaymentPage = () => {
  const navigate = useNavigate();
  const cart = useSelector(state => state.cart)
  const {shippingAddress} = cart;

  const dispatch = useDispatch();

  //If shipping address is missing, redirect to shipping
  if(!shippingAddress.address){
    navigate('/shipping');
  }

  const [paymentMethod, setPaymentMethod] = useState('COD')
  const submitHandler = (e) =>{
    e.preventDefault()
    dispatch(savePaymentMethod(paymentMethod))
    navigate('/placeorder');
  }
  return (
    <FormContainer>
      <CheckoutStages step1 step2 step3/>
      <Form onSubmit={submitHandler}>
        <Form.Group>
          <Form.Label as='legend'>Select Method</Form.Label>
          <Col className='mb-3'>
            <Form.Check
              type='radio'
              label='Cash On Delivery'
              id='COD'
              name='paymentMethod'
              checked
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
             
            </Form.Check>
          </Col>
        </Form.Group>
        <Button
          type='submit'
          variant='primary'
        >
          Continue
        </Button>
      </Form>
    </FormContainer>
  )
}

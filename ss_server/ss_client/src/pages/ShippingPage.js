import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { FormContainer } from '../Components/FormContainer'
import { saveShippingAddress } from '../Actions/CartActions'
import { CheckoutStages } from '../Components/CheckoutStages'

export const ShippingPage = ({}) => {
  const cart = useSelector(state => state.cart)
  const {shippingAddress} = cart;
  const dispatch = useDispatch();
  
  const navigate = useNavigate();
  const [address, setAddress] = useState(shippingAddress ? shippingAddress.address : '');
  const [city, setCity] = useState(shippingAddress ? shippingAddress.city : '');
  const [pinCode, setPinCode] = useState(shippingAddress ? shippingAddress.pinCode : '');
  const [country, setCountry] = useState(shippingAddress ? shippingAddress.country : '');

  const submitHandler =(e) =>{
    e.preventDefault();
    dispatch(saveShippingAddress({
      address,
      city,
      pinCode,
      country
    }));
    navigate('/payment')
  }

  return (
    <FormContainer>
      <CheckoutStages step1 step2/>
      <h1>Shipping</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group controlId='address'> 
          <Form.Label>Address:</Form.Label>
              <Form.Control
                  required
                  className='mb-3'
                  type='text'
                  placeholder='Enter Address'
                  value={address ? address : ''}
                  onChange={(e) => setAddress(e.target.value)}
              ></Form.Control>
          </Form.Group>

          <Form.Group controlId='city'> 
          <Form.Label>City:</Form.Label>
              <Form.Control
                  required
                  className='mb-3'
                  type='text'
                  placeholder='Enter City'
                  value={city ? city : ''}
                  onChange={(e) => setCity(e.target.value)}
              ></Form.Control>
          </Form.Group>

          <Form.Group controlId='pin_code'> 
          <Form.Label>Postal Code:</Form.Label>
              <Form.Control
                  required
                  className='mb-3'
                  type='text'
                  placeholder='Enter Postal Code'
                  value={pinCode ? pinCode : ''}
                  onChange={(e) => setPinCode(e.target.value)}
              ></Form.Control>
          </Form.Group>

          <Form.Group controlId='country'> 
          <Form.Label>Country:</Form.Label>
              <Form.Control
                  required
                  className='mb-3'
                  type='text'
                  placeholder='Enter Country'
                  value={country ? country : ''}
                  onChange={(e) => setCountry(e.target.value)}
              ></Form.Control>
          </Form.Group>

          <Button
            type='submit'
            variant='primary'
          >Continue</Button>

      </Form>
    </FormContainer>
  )
}

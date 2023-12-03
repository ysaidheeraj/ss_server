import React from 'react'
import { Button } from "react-bootstrap";
import { useDispatch, useSelector } from 'react-redux';
import { Loader } from '../Components/Loader';
import { useNavigate } from 'react-router-dom';
import { SSHeader } from '../Components/SSHeader';

export const SSHomePage = () => {
  const navigate = useNavigate();

  const sellerDetails = useSelector((state) => state.sellerDetails);
  const { loading, seller } = sellerDetails;

  const navigateToRegister = () =>{
    navigate('/register');
  }
  const navigateToCreateStore = () => {
    navigate('/createstore');
  }
  const navigateToStore = () =>{
    navigate(`/store/${seller.store_id}`)
  }
  return (
    <>
    {loading ? (<Loader />) :(
      <>
        <SSHeader seller={seller}/>
        <div>
          <h1>Welcome to Sell Smart</h1>
          <h2>Your one stop solution to start your business online</h2>
          <p>With Sell Smart, you can set up your online store, handle orders and view analytics!</p>
          {!seller ? (
            <>
            <h2>Ready to get started?</h2>
            <Button style={{background: 'black'}} onClick={(e) => navigateToRegister()}>
              Get Started
            </Button>
            </>
          ): !seller.store_id ? (
            <>
            <h2>Hi {seller.first_name}!</h2>
            <h3>Create your store now!</h3>
            <Button style={{background: 'black'}} onClick={(e) => navigateToCreateStore()}>Create Store</Button>
            </>
          ): (
            <>
            <h2>Hi {seller.first_name}!</h2>
            <Button style={{background: 'black'}} onClick={(e) => navigateToStore()}>Access Store</Button>
            </>
          )}
          
        </div>
      </>
    )}
     </> 
    
  )
}

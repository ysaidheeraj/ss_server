import React, { useEffect, useState } from "react";
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { customer_logout, customer_details } from "../Actions/UserActions";
import { SearchBox } from "./SearchBox";
import { useParams } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { Message } from "./Message";
import { Loader } from "./Loader";
import { listStoreDetails } from "../Actions/StoreActions";
import { RESET_ALL_DATA } from "../Constants/StoreConstants";

export const Header = () => {

  const { storeId } = useParams();
  const [resettingData, setResettingData] = useState(true);

  const dispatch = useDispatch();
  const [loadingData, setLoadingData] = useState(true);

  const storeDetails = useSelector((state) => state.storeDetails);
  const { error: storeError, loading: storeLoading, store } = storeDetails;

  const customerDetails = useSelector((state) => state.customerDetails);
  const { error, loading, customer } = customerDetails;

  useEffect(() =>{
    setResettingData(false);
    setLoadingData(true)
    dispatch({type: RESET_ALL_DATA})
  }, [storeId])

  useEffect(() => {
    if(!resettingData){
      if(!store.store_name && !storeLoading){
        setLoadingData(true);
        dispatch(listStoreDetails(storeId));
      }else if(store.store_name && !loading && !error && !customer.user_id){
        setLoadingData(true);
        document.title = store.store_name
        dispatch(customer_details());
      }else if(store.store_name && (error || customer.user_id)){
        setLoadingData(false);
      }
      if(error === "Login Expired"){
        // If the login expires, we need to relogin
        dispatch(customer_logout());
      }
    }
  }, [dispatch, store, error, storeLoading, loading, resettingData]);

  const customerLogoutHandler = () =>{
    dispatch(customer_logout());
  }
  return (
    <>
    {loadingData ? (<Loader />): (
      <>
      <header>
        <Navbar expand="lg" bg="dark" variant="dark" collapseOnSelect className="fixed-top">
          <Container>
            <LinkContainer to="">
              <Navbar.Brand className='text-white'>{store.store_name}</Navbar.Brand>
            </LinkContainer>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <SearchBox />
              <Nav className="ms-auto">
                {customer.first_name && !customer.isSeller && (
                  <LinkContainer to={{pathname: 'login', search: '?redirect=cart'}}>
                    <Nav.Link >
                      <i className="fas fa-shopping-cart" style={{paddingRight: "3px"}}></i>Cart
                    </Nav.Link>
                  </LinkContainer>
                )}

                {customer && customer.isSeller && (
                  <NavDropdown title={"Manage"} id='manage'>
                    <LinkContainer to='seller/customers'>
                      <NavDropdown.Item>Customers</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to='seller/products'>
                      <NavDropdown.Item>Products</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to='seller/orders'>
                      <NavDropdown.Item>Orders</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to='seller/categories'>
                      <NavDropdown.Item>Categories</NavDropdown.Item>
                    </LinkContainer>
                  </NavDropdown>
                )}
                {customer.first_name && !customer.isSeller && (
                  <LinkContainer to="contact">
                    <Nav.Link>
                    <i className="fa fa-question-circle" style={{paddingRight: "3px"}} aria-hidden="true"></i>Help
                    </Nav.Link>
                  </LinkContainer>
                )}
                {customer && customer.isSeller ? (
                  <NavDropdown title={customer.first_name} id='userName'>
                    <LinkContainer to='profile'>
                      <NavDropdown.Item>Profile</NavDropdown.Item>
                    </LinkContainer>
                    <NavDropdown.Item onClick={customerLogoutHandler}>Logout</NavDropdown.Item>
                  </NavDropdown>
                ): customer.first_name ? (
                  <NavDropdown title={customer.first_name} id='userName'>
                    <LinkContainer to='profile'>
                      <NavDropdown.Item>Profile</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to='myorders'>
                      <NavDropdown.Item>Orders</NavDropdown.Item>
                    </LinkContainer>
                    <NavDropdown.Item onClick={customerLogoutHandler}>Logout</NavDropdown.Item>
                  </NavDropdown>
                )
                :(
                  <LinkContainer to="login">
                    <Nav.Link>
                      <i className="fas fa-user text-white"></i>LOGIN
                    </Nav.Link>
                  </LinkContainer>
                )}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </header>
      {customer.first_name && !customer.isConfirmed && (
        <Message variant='warning'>Your account is not confirmed. Please check your email and confirm your account!</Message>
      )}
      <Container>
        <Outlet />
      </Container>
      </>
    )}
    </>
  );
};

import React, { useEffect } from "react";
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { customer_logout } from "../Actions/UserActions";
import { SearchBox } from "./SearchBox";
import { Outlet } from "react-router-dom";

export const Header = () => {
  const dispatch = useDispatch();

  const customerDetails = useSelector((state) => state.customerDetails);
  const { customer } = customerDetails;

  const storeDetails = useSelector((state) => state.storeDetails);
  const { store } = storeDetails;

  useEffect(() =>{
    document.title = store.store_name
  },[])

  const customerLogoutHandler = () =>{
    dispatch(customer_logout());
  }
  return (
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
                {customer && !customer.isSeller && (
                  <LinkContainer to={{pathname: 'login', search: '?redirect=cart'}}>
                    <Nav.Link >
                      <i className="fas fa-shopping-cart text-white"></i>CART
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

                {customer && customer.isSeller ? (
                  <NavDropdown title={customer.first_name} id='userName'>
                    <LinkContainer to='profile'>
                      <NavDropdown.Item>Profile</NavDropdown.Item>
                    </LinkContainer>
                    <NavDropdown.Item onClick={customerLogoutHandler}>Logout</NavDropdown.Item>
                  </NavDropdown>
                ): customer ? (
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
                {customer && !customer.isSeller && (
                  <LinkContainer to="contact">
                    <Nav.Link>
                    <i className="fa fa-envelope" aria-hidden="true"></i>Contact Us
                    </Nav.Link>
                  </LinkContainer>
                )}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </header>
      <Outlet />
    </>
  );
};

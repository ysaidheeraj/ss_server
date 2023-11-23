import React, { useEffect } from "react";
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { customer_logout, customer_details } from "../Actions/UserActions";

export const Header = () => {
  const dispatch = useDispatch();

  const customerDetails = useSelector((state) => state.customerDetails);
  const { error, customer } = customerDetails;

  useEffect(() => {
    if(!customer && !error){
      dispatch(customer_details());
    }
  }, []);

  const customerLogoutHandler = () =>{
    dispatch(customer_logout());
  }
  return (
    <header>
      <Navbar expand="lg" bg="dark" variant="dark" collapseOnSelect>
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand>SellSmart</Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <LinkContainer to="/cart">
                <Nav.Link>
                  <i className="fas fa-shopping-cart"></i>CART
                </Nav.Link>
              </LinkContainer>

              {customer ? (
                <NavDropdown title={customer.first_name} id='userName'>
                  <LinkContainer to='/profile'>
                    <NavDropdown.Item>Profile</NavDropdown.Item>
                  </LinkContainer>
                  <NavDropdown.Item onClick={customerLogoutHandler}>Logout</NavDropdown.Item>
                </NavDropdown>
              ):(
                <LinkContainer to="/login">
                  <Nav.Link>
                    <i className="fas fa-user"></i>LOGIN
                  </Nav.Link>
                </LinkContainer>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};
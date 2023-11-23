import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Loader } from "../Components/Loader";
import { Message } from "../Components/Message";
import { customer_details, update_customer_details } from "../Actions/UserActions";
import { CUSTOMER_UPDATE_RESET } from "../Constants/UserConstants";

export const ProfilePage = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [info, setInfo] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect")
    ? searchParams.get("redirect")
    : "/";

  const customerDetails = useSelector((state) => state.customerDetails);
  const { error, loading, customer } = customerDetails;

  const customerLogin = useSelector((state) => state.customerLogin);
  const { customerInfo } = customerLogin;

  const customerUpdate = useSelector((state) => state.customerUpdateProfile);
  const { success } = customerUpdate; //Checking if update is success

  useEffect(() => {
    if (!customerInfo) {
      navigate("/login");
    } else {
      if (!customer || success) {
        //Resetting the profile data on successful update
        dispatch({
            type: CUSTOMER_UPDATE_RESET
        })
        dispatch(customer_details());
      } else {
        setFirstName(customer.first_name);
        setLastName(customer.last_name);
        setEmail(customer.email);
      }
    }
  }, [dispatch, customer, customerInfo, success, navigate]);

  const registerSubmitHandler = (e) => {
    e.preventDefault();
    if(password !== confirmPassword){
        setInfo('Passwords do not match');
    }else{
        setInfo('');
        let customerUpdateObject = {
            'first_name': firstName,
            'last_name': lastName
        }
        if(password){
            customerUpdateObject.password = password
        }
        dispatch(update_customer_details(customerUpdateObject));
    }
  };
  return (
    <Row>
      <Col md={3}>
        <h2>Profile</h2>
        {info && <Message variant="danger">{info}</Message>}
        {error && <Message variant="danger">{error}</Message>}
        {loading && <Loader />}
        <Form onSubmit={registerSubmitHandler}>
          <Form.Group controlId="first_name">
            <Form.Label>First Name:</Form.Label>
            <Form.Control
              required
              className="mb-3"
              type="text"
              placeholder="Enter your first name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="last_name">
            <Form.Label>Last Name:</Form.Label>
            <Form.Control
              required
              className="mb-3"
              type="text"
              placeholder="Enter your last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="email">
            <Form.Label>Email Address:</Form.Label>
            <Form.Control
              required
              className="mb-3"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="password">
            <Form.Label>Password:</Form.Label>
            <Form.Control
              className="mb-3"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="reenter_password">
            <Form.Label>Confirm Password:</Form.Label>
            <Form.Control
              className="mb-3"
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Button type="submit" variant="primary" className="form-control">
            Update Profile
          </Button>
        </Form>
      </Col>

      <Col md={9}>
        <h2>Orders</h2>
      </Col>
    </Row>
  );
};

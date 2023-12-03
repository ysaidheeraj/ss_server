import React, {useEffect} from 'react'
import { Navbar, Container, Button } from "react-bootstrap";
import { LinkContainer } from 'react-router-bootstrap';
import { seller_logout } from '../Actions/UserActions';
import { useDispatch, useSelector } from 'react-redux';
import { seller_details } from '../Actions/UserActions';

export const SSHeader = () => {
    const dispatch = useDispatch();
    const sellerLogoutHandler = () =>{
        dispatch(seller_logout());
    }

    const sellerDetails = useSelector((state) => state.sellerDetails);
    const { error, loading, seller } = sellerDetails;

    useEffect(() =>{
        if(!seller && !error){
            dispatch(seller_details());
        }
    }, [seller])
  return (
    <header>
        <Navbar expand="lg" bg="dark" variant="dark" collapseOnSelect className="fixed-top">
            <Container>
                <LinkContainer to="/">
                    <Navbar.Brand className='text-white'>SellSmart</Navbar.Brand>
                </LinkContainer>
                {seller && seller.first_name && (
                    <Button onClick={(e) => sellerLogoutHandler()}>
                        Logout
                    </Button>
                )}
            </Container>
        </Navbar>
    </header>
  )
}

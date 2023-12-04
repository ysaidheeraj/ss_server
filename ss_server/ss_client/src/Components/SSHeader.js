import React, {useEffect} from 'react'
import { Navbar, Container, Button } from "react-bootstrap";
import { LinkContainer } from 'react-router-bootstrap';
import { seller_logout } from '../Actions/UserActions';
import { useDispatch, useSelector } from 'react-redux';
import { seller_details } from '../Actions/UserActions';
import { RESET_ALL_DATA } from '../Constants/StoreConstants';

export const SSHeader = () => {
    const dispatch = useDispatch();
    const sellerLogoutHandler = () =>{
        dispatch(seller_logout());
    }

    const sellerDetails = useSelector((state) => state.sellerDetails);
    const { error, loading, seller } = sellerDetails;

    const storeDetails = useSelector((state) => state.storeDetails);
    const { store } = storeDetails;

    useEffect(() =>{
        if(store.store_name){
            dispatch({type: RESET_ALL_DATA});
            document.title = "SellSmart";
        }
        if(!seller && !error){
            dispatch(seller_details());
        }
    }, [seller])

    useEffect(() => {
        // Create a script element
        const script = document.createElement('script');
  
        // Set the script source to your JavaScript file
        script.src = '/static/Home/js/main.js';
  
        // Append the script to the document body
        document.body.appendChild(script);
  
        // Optional: Clean up the script when the component unmounts
        return () => {
          document.body.removeChild(script);
        };
      },[]);
  return (
    // <header>
    //     <Navbar expand="lg" bg="dark" variant="dark" collapseOnSelect className="fixed-top">
    //         <Container>
    //             <LinkContainer to="/">
    //                 <Navbar.Brand className='text-white'>SellSmart</Navbar.Brand>
    //             </LinkContainer>
    //             {seller && seller.first_name && (
    //                 <Button onClick={(e) => sellerLogoutHandler()}>
    //                     Logout
    //                 </Button>
    //             )}
    //         </Container>
    //     </Navbar>
    // </header>
    <header className='fixed-top'>
        {/* Spinner Start */}
      <div id="spinner" className="show position-fixed translate-middle w-100 vh-100 top-50 start-50 d-flex align-items-center justify-content-center">
        <div className="spinner-grow text-primary" role="status"></div>
      </div>
      {/* Spinner End */}

      {/* Topbar Start */}
      <div className="container-fluid bg-dark py-2 d-none d-md-flex">
        <div className="container">
          <div className="d-flex justify-content-between topbar">
            <div className="top-info">
              <small className="me-3 text-white-50"><a href="#"><i className="fas fa-map-marker-alt me-2 text-secondary"></i></a>Cleveland</small>
              <small className="me-3 text-white-50"><a href="#"><i className="fas fa-envelope me-2 text-secondary"></i></a>sellsmart443@gmail.com</small>
            </div>
          </div>
        </div>
      </div>
      {/* Topbar End */}

      <div className="container-fluid bg-primary">
        <div className="container">
          <nav className="navbar navbar-dark navbar-expand-lg py-0">
            <a href="/" className="navbar-brand">
              <h1 className="text-white fw-bold d-block">Sell<span className="text-secondary">Smart</span> </h1>
            </a>
            <button type="button" className="navbar-toggler me-0" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
              <span className="navbar-toggler-icon"></span>
            </button>
            {seller && seller.first_name && (
               <div className="ms-auto d-flex align-items-center">
                <h2 className="text-white fw-bold d-block me-3">Hi {seller.first_name}!</h2>
                <Button style={{ background: "black" }} onClick={(e) => sellerLogoutHandler()}>
                    Logout
                </Button>
                </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}

import React, {useEffect} from 'react'
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
    <SSHeader seller={seller}/>
      {/* <!-- Carousel Start --> */}
        <div className="container-fluid px-0">
            <div id="carouselId" className="carousel slide" data-bs-ride="carousel">
                <ol className="carousel-indicators">
                    <li data-bs-target="#carouselId" data-bs-slide-to="0" className="active" aria-current="true" aria-label="First slide"></li>
                    <li data-bs-target="#carouselId" data-bs-slide-to="1" aria-label="Second slide"></li>
                </ol>
                <div className="carousel-inner" role="listbox">
                    <div className="carousel-item active">
                        <img src="/static/Home/img/carousel-1.jpg" className="img-fluid" alt="First slide" />
                        <div className="carousel-caption">
                            <div className="container carousel-content">
                                <h6 className="text-secondary h4 animated fadeInUp">SellSmart</h6>
                                <h1 className="text-white display-1 mb-4 animated fadeInRight">A simple ecommerce platform to run your business online</h1>
                                <p className="mb-4 text-white fs-5 animated fadeInDown">With SellSmart you can have a broader reach for your business</p>
                            </div>
                        </div>
                    </div>
                    <div className="carousel-item">
                        <img src="/static/Home/img/carousel-2.jpg" className="img-fluid" alt="Second slide" />
                        <div className="carousel-caption">
                            <div className="container carousel-content">
                                <h6 className="text-secondary h4 animated fadeInUp">SellSmart</h6>
                                <h1 className="text-white display-1 mb-4 animated fadeInLeft">Control of your business at your fingertips!</h1>
                                <p className="mb-4 text-white fs-5 animated fadeInDown">With SellSmart you can manage all aspects of your business all in one place.</p>
                            </div>
                        </div>
                    </div>
                </div>
                <button className="carousel-control-prev" type="button" data-bs-target="#carouselId" data-bs-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Previous</span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#carouselId" data-bs-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Next</span>
                </button>
            </div>
        </div>
        {/* <!-- Carousel End --> */}

        {/* <!-- Team Start --> */}
        <div className="container-fluid py-5 mb-5 team">
            <div className="container">
                <div className="text-center mx-auto pb-5 wow fadeIn" data-wow-delay=".3s" style={{maxWidth: "600px"}}>
                    <h5 className="text-primary">Our Team</h5>
                    <h1>Meet our team</h1>
                </div>
                <div className="owl-carousel team-carousel wow fadeIn" data-wow-delay=".5s">
                    <div className="rounded team-item">
                        <div className="team-content">
                            <div className="team-img-icon">
                                <div className="team-img rounded-circle">
                                    <img src="/static/Home/img/team-1.png" className="img-fluid w-100 rounded-circle" alt="" />
                                </div>
                                <div className="team-name text-center py-3">
                                    <h4 className="">Sai Dheeraj</h4>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="rounded team-item">
                        <div className="team-content">
                            <div className="team-img-icon">
                                <div className="team-img rounded-circle">
                                    <img src="/static/Home/img/team-2.png" className="img-fluid w-100 rounded-circle" alt="" />
                                </div>
                                <div className="team-name text-center py-3">
                                    <h4 className="">Amulya Pophale</h4>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="rounded team-item">
                        <div className="team-content">
                            <div className="team-img-icon">
                                <div className="team-img rounded-circle">
                                    <img src="/static/Home/img/team-3.jpeg" className="img-fluid w-100 rounded-circle" alt="" />
                                </div>
                                <div className="team-name text-center py-3">
                                    <h4 className="">Manish</h4>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="rounded team-item">
                        <div className="team-content">
                            <div className="team-img-icon">
                                <div className="team-img rounded-circle">
                                    <img src="/static/Home/img/team-4.jpg" className="img-fluid w-100 rounded-circle" alt="" />
                                </div>
                                <div className="team-name text-center py-3">
                                    <h4 className="">Akhil</h4>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        {/* <!-- Team End --> */}


        {/* <!-- About Start --> */}
        <div className="container-fluid py-5 my-5">
            <div className="container pt-5">
                <div className="row g-5">
                    <div className="col-lg-5 col-md-6 col-sm-12 wow fadeIn" data-wow-delay=".3s">
                        <div className="h-100 position-relative">
                            <img src="/static/Home/img/about-1.png" className="img-fluid w-75 rounded" alt="" style={{marginBottom: "25%"}} />
                            <div className="position-absolute w-75" style={{top: "25%", left: "25%"}}>
                                <img src="/static/Home/img/about-2.webp" className="img-fluid w-100 rounded" alt="" />
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-7 col-md-6 col-sm-12 wow fadeIn" data-wow-delay=".5s">
                        <h5 className="text-primary">Our Tech Stack</h5>
                        <h1 className="mb-4">Frameworks used for developing SellSmart</h1>
                        <p>Frontend: ReactJs, Redux, Bootstrap</p>
                        <p className="mb-4">Backend: Django</p>
                        <p className="mb-4">Database: MySQL</p>
                    </div>
                </div>
            </div>
        </div>
        {/* <!-- About End --> */}


        {/* <!-- Services Start --> */}
        <div className="container-fluid services py-5 mb-5">
            <div className="container">
                <div className="text-center mx-auto pb-5 wow fadeIn" data-wow-delay=".3s" style={{maxWidth : "600px"}}>
                    <h5 className="text-primary">Our Services</h5>
                    <h1>Services Built Specifically For Your Business</h1>
                </div>
                <div className="row g-5 services-inner">
                <div className="col-md-6 col-lg-4 wow fadeIn" data-wow-delay=".3s">
                        <div className="services-item bg-light">
                            <div className="p-4 text-center services-content">
                                <div className="services-content-icon">
                                    <i className="fa fa-user fa-7x mb-4 text-primary"></i>
                                    <h4 className="mb-3">Customer Management</h4>
                                    <p className="mb-4">
                                        View details of customers.<br />
                                        Customer analytics at a glance. <br/>
                                    </p>
                                </div>
                                
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-4 wow fadeIn" data-wow-delay=".5s">
                        <div className="services-item bg-light">
                            <div className="p-4 text-center services-content">
                                <div className="services-content-icon">
                                    <i className="fa fa-envelope-open fa-7x mb-4 text-primary"></i>
                                    <h4 className="mb-3">Customer Notifications</h4>
                                    <p className="mb-4">
                                        Customers are notified about order updates<br />
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-4 wow fadeIn" data-wow-delay=".7s">
                        <div className="services-item bg-light">
                            <div className="p-4 text-center services-content">
                                <div className="services-content-icon">
                                    <i className="fas fa-question-circle fa-7x mb-4 text-primary"></i>
                                    <h4 className="mb-3">Support</h4>
                                    <p className="mb-4">Customers can raise issues and notify the sellers</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-4 wow fadeIn" data-wow-delay=".3s">
                        <div className="services-item bg-light">
                            <div className="p-4 text-center services-content">
                                <div className="services-content-icon">
                                    <i className="fa fa-list-alt fa-7x mb-4 text-primary"></i>
                                    <h4 className="mb-3">Inventory Management</h4>
                                    <p className="mb-4">
                                        Add products to inventory.<br />
                                        Manage product details. <br/>
                                        Manage product stock. <br />
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-4 wow fadeIn" data-wow-delay=".5s">
                        <div className="services-item bg-light">
                            <div className="p-4 text-center services-content">
                                <div className="services-content-icon">
                                    <i className="fa fa-list-alt fa-7x mb-4 text-primary"></i>
                                    <h4 className="mb-3">Order Management</h4>
                                    <p className="mb-4">
                                        View customer orders.<br />
                                        Update order status. <br/>
                                        Manage order payments. <br />
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-4 wow fadeIn" data-wow-delay=".7s">
                        <div className="services-item bg-light">
                            <div className="p-4 text-center services-content">
                                <div className="services-content-icon">
                                    <i className="fa fa-list-alt fa-7x mb-4 text-primary"></i>
                                    <h4 className="mb-3">Category Management</h4>
                                    <p className="mb-4">
                                        Create product categories.<br />
                                        Organize products into categories. <br/>
                                        Update or delete categories. <br />
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className='text-center'>
          {!seller ? (
              <>
              <h2>Ready to get started?</h2>
              <Button className='btn-black' onClick={(e) => navigateToRegister()}>
                Get Started
              </Button>
              </>
            ): !seller.store_id ? (
              <>
              <h2>Hi {seller.first_name}!</h2>
              <h3>Create your store now!</h3>
              <Button className='btn-black' onClick={(e) => navigateToCreateStore()}>Create Store</Button>
              </>
            ): (
              <>
              <h2>Hi {seller.first_name}!</h2>
              <Button className='btn-black' onClick={(e) => navigateToStore()}>Access Store</Button>
              </>
            )}
        </div>
    </>
    // <>
    // {loading ? (<Loader />) :(
    //   <>
    //     <SSHeader seller={seller}/>
    //     <div>
    //       <h1>Welcome to Sell Smart</h1>
    //       <h2>Your one stop solution to start your business online</h2>
    //       <p>With Sell Smart, you can set up your online store, handle orders and view analytics!</p>
    //       {!seller ? (
    //         <>
    //         <h2>Ready to get started?</h2>
    //         <Button style={{background: 'black'}} onClick={(e) => navigateToRegister()}>
    //           Get Started
    //         </Button>
    //         </>
    //       ): !seller.store_id ? (
    //         <>
    //         <h2>Hi {seller.first_name}!</h2>
    //         <h3>Create your store now!</h3>
    //         <Button style={{background: 'black'}} onClick={(e) => navigateToCreateStore()}>Create Store</Button>
    //         </>
    //       ): (
    //         <>
    //         <h2>Hi {seller.first_name}!</h2>
    //         <Button style={{background: 'black'}} onClick={(e) => navigateToStore()}>Access Store</Button>
    //         </>
    //       )}
          
    //     </div>
    //   </>
    // )}
    //  </> 
    
  )
}

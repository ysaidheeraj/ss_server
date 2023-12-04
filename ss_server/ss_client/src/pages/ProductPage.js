import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Row, Col, Image, ListGroup, Button, Card, Form } from "react-bootstrap";
import { Rating } from "../Components/Rating";
import { Loader } from "../Components/Loader";
import { Message } from "../Components/Message";
import { useDispatch, useSelector } from "react-redux";
import { listItemDetails } from "../Actions/ItemActions";
import { create_item_review } from "../Actions/ItemActions";
import { ITEM_CREATE_REVIEW_RESET } from "../Constants/ItemConstants";

export const ProductPage = () => {
  const [quantity, setQuantity] = useState(1);
  const { id: productId } = useParams();
  const itemDetails = useSelector((state) => state.itemDetails);
  const { loading, error, item } = itemDetails;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const customerDetails = useSelector((state) => state.customerDetails);
  const { customer } = customerDetails;

  const itemCreateReview = useSelector((state) => state.itemCreateReview);
  const { loading: createReviewLoading, error: createReviewError, success } = itemCreateReview;
  
  useEffect(() => {
    if(success){
      setRating(0);
      setComment('');
      dispatch({type: ITEM_CREATE_REVIEW_RESET})
    }
    dispatch(listItemDetails(productId));
  }, [dispatch, success]);

  const addToCartHandler = () => {
    navigate(`../cart/${productId}?qty=${quantity}`)
  }

  const createReviewHandler = (e) =>{
    e.preventDefault();
    dispatch(create_item_review({
      'review_rating': rating,
      'review_text': comment,
      'name': customer.first_name+' '+customer.last_name
    }, productId))
  }

  return (
    <div>
      <Link to="../" className="btn btn-dark btn-primary my-3">
        <i className="fa fa-arrow-left" aria-hidden="true"></i>
      </Link>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <div>
          <Row>
            <Col md={6}>
              <Image src={item.item_image + "?_=" + item.item_updated_time} alt={item.item_name} fluid rounded/>
            </Col>

            <Col md={3}>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h3>{item.item_name}</h3>
                </ListGroup.Item>

                <ListGroup.Item>
                  <Rating
                    value={item.rating}
                    text={`${item.num_reviews} reviews`}
                    color={"#f8e825"}
                  />
                </ListGroup.Item>

                <ListGroup.Item>Price: ${item.item_price}</ListGroup.Item>

                <ListGroup.Item>
                  Description: {item.item_description}
                </ListGroup.Item>
              </ListGroup>
            </Col>

            <Col md={3}>
              <Card>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <Row>
                      <Col>Price:</Col>
                      <Col>
                        <strong>${item.item_price}</strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Status:</Col>
                      <Col>
                        {item.item_available_count > 0
                          ? "In Stock"
                          : "Out of Stock"}
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  {customer && !customer.isSeller && item.item_available_count > 0 && (
                      <ListGroup.Item>
                          <Row>
                              <Col>Quantity:</Col>
                              <Col xs='auto' className="my-1">
                                  <Form.Control
                                      as="select"
                                      className="form-select"
                                      value={quantity}
                                      onChange={(e) => setQuantity(e.target.value)}>
                                          {
                                              [...Array(item.item_available_count).keys()].map((x) => (
                                                  <option key={x + 1} value={x + 1}>
                                                    {x + 1}
                                                  </option>
                                              ))
                                          }
                                  </Form.Control>
                              </Col>
                          </Row>
                      </ListGroup.Item>
                  ) && (
                  <ListGroup.Item>
                    <Button
                      onClick={addToCartHandler}
                      className="btn-dark w-100"
                      type="button"
                      disabled={item.item_available_count === 0}
                    >
                      Add To Cart
                    </Button>
                  </ListGroup.Item>)}
                </ListGroup>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <h4>Reviews</h4>
              {item.reviews.length === 0 && <Message variant='info'>No Reviews</Message>}
              <ListGroup variant="flush">
                {item.reviews.map((review) => (
                  <ListGroup.Item key={review.review_id}>
                    <strong>{review.name}</strong>
                    <Rating value={review.review_rating} color='#f8e825' />
                    <p>{review.review_text}</p>
                  </ListGroup.Item>
                ))}

                {customer && item.canReview && (
                  <ListGroup.Item>
                    <h4>Write a review</h4>

                    {createReviewLoading && <Loader />}
                    {success && <Message variant='success'> Review Submitted Successfully</Message>}
                    {createReviewError && <Message variant='danger'>{createReviewError}</Message>}
                    <Form onSubmit={createReviewHandler}>
                      <Form.Group controlId="rating">
                        <Form.Label>Rating</Form.Label>
                        <Form.Control
                          as='select'
                          value={rating}
                          className="form-select"
                          onChange={(e) => setRating(e.target.value)}
                        >
                          <option value=''>Select...</option>
                          <option value='1'>1 - Poor</option>
                          <option value='2'>2 - Fair</option>
                          <option value='3'>3 - Good</option>
                          <option value='4'>4 - Very Good</option>
                          <option value='5'>5 - Excellent</option>
                        </Form.Control>
                      </Form.Group>
                      <Form.Group controlId="comment">
                        <Form.Label>Review</Form.Label>
                        <Form.Control
                          as='textarea'
                          rows='5'
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                        ></Form.Control>
                      </Form.Group>
                      <Button
                        disabled={createReviewLoading}
                        type="submit"
                        variant="primary"
                        className="mt-3"
                      >
                        Submit
                      </Button>
                    </Form>
                  </ListGroup.Item>
                )}
              </ListGroup>
            </Col>
          </Row>
        </div>
      )}
    </div>
  );
};

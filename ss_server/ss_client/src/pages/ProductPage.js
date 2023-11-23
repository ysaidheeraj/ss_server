import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Row, Col, Image, ListGroup, Button, Card, Form } from "react-bootstrap";
import { Rating } from "../Components/Rating";
import { Loader } from "../Components/Loader";
import { Message } from "../Components/Message";
import { useDispatch, useSelector } from "react-redux";
import { listItemDetails } from "../Actions/ItemActions";

export const ProductPage = () => {
  const [quantity, setQuantity] = useState(1);
  const { id: productId } = useParams();
  const itemDetails = useSelector((state) => state.itemDetails);
  const { loading, error, item } = itemDetails;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  useEffect(() => {
    dispatch(listItemDetails(productId));
  }, [dispatch]);

  const addToCartHandler = () => {
    navigate(`/cart/${productId}?qty=${quantity}`)
  }

  return (
    <div>
      <Link to="/" className="btn btn-primary my-3">
        <i class="fa fa-arrow-left" aria-hidden="true"></i>
      </Link>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Row>
          <Col md={6}>
            <Image src={item.item_image} alt={item.item_name} fluid rounded/>
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
                
                {item.item_available_count > 0 && (
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
                )}

                <ListGroup.Item>
                  <Button
                    onClick={addToCartHandler}
                    className="btn-dark form-control"
                    type="button"
                    disabled={item.item_available_count === 0}
                  >
                    Add To Cart
                  </Button>
                </ListGroup.Item>
              </ListGroup>
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
};

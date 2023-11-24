import React, { useEffect} from "react";
import { Row, Col } from "react-bootstrap";
import { Product } from "../Components/Product";
import { useDispatch, useSelector } from "react-redux";
import { listItems } from "../Actions/ItemActions";
import { Loader } from "../Components/Loader";
import { Message } from "../Components/Message";
export const HomePage = () => {

  const dispatch = useDispatch();
  const ItemsList = useSelector(state => state.itemList);
  const {error, loading, items} = ItemsList;
    useEffect(() => {
        dispatch(listItems());
    }, [dispatch]);

  return (
    <div>
      <h1>Latest Products</h1>
      {loading ? <Loader />
                : error ? <Message variant='danger'>{error}</Message>
                :<Row>
                  {items.map((product) => (
                    <Col key={product.item_id} sm={12} md={6} lg={4} xl={3}>
                      <Product product={product}/>
                    </Col>
                  ))}
                </Row>
      }
    </div>
  );
};

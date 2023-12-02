import React, { useEffect, useState} from "react";
import { Row, Col } from "react-bootstrap";
import { Product } from "../Components/Product";
import { useDispatch, useSelector } from "react-redux";
import { listItems } from "../Actions/ItemActions";
import { Loader } from "../Components/Loader";
import { Message } from "../Components/Message";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Paginate } from "../Components/Paginate";
import { CategoriesNavbar } from "../Components/CategoriesNavbar";
import Notification from "../Components/Notification";
export const HomePage = () => {
  const dispatch = useDispatch();
  const ItemsList = useSelector(state => state.itemList);
  const {error, loading, items, page, pages} = ItemsList;

  const [searchParams, setSearchParams] = useSearchParams();
  const [searchCategory, setSearchCategory] = useState(searchParams.get('category') ? searchParams.get('category') : '');
  let queryString = '';
  if(searchParams.size){
    queryString = '?'+searchParams.toString();
  }
    useEffect(() => {
      if(!loading && !error){
        dispatch(listItems(queryString));
      }
    }, [dispatch, searchParams, error]);

    useEffect(() =>{
      if(error){
        Notification.error(error);
      }
    }, [error])


  return (
    <div className="mt-6">
      <CategoriesNavbar selectedCategoryLink=''/>
      <hr className="border border-secondry border-3 opacity-75"></hr>
      {loading ? <Loader />
        : error ? <Message variant='danger'>{error}</Message>
        :<div>
        <Row className="row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 g-3">
          {items.length === 0 ? (
            <Message variant='info'>No products to list</Message>
          ) : (
            items.map((product) => (
              <Col key={product.item_id}>
                <div style={{ height: '420px' }} className="d-flex justify-content-center align-items-stretch">
                  {/* Ensure consistent dimensions for the product */}
                  <div className="card mb-3 w-100">
                    <Product product={product} />
                  </div>
                </div>
              </Col>
            ))
          )}
        </Row>
        <Paginate page={page} pages={pages} search={searchParams.get('search')}/>
      </div>
      }
    </div>
  );
};

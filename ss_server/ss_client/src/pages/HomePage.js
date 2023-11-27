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
        dispatch(listItems(queryString));
    }, [dispatch, searchParams]);

  return (
    <div>
      <br></br>
      <CategoriesNavbar selectedCategoryLink='/'/>
      <hr className="border border-secondry border-3 opacity-75"></hr>
      {loading ? <Loader />
        : error ? <Message variant='danger'>{error}</Message>
        :<div><Row>
          {items.length === 0 ? (
            <Message variant='info'>No products to list</Message>
          ): (
            items.map((product) => (
              <Col key={product.item_id} sm={12} md={6} lg={4} xl={3}>
                <Product product={product}/>
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

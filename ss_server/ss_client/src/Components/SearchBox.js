import React, { useState } from 'react'
import { Button, Form, Row, Col, InputGroup } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import {useSearchParams} from 'react-router-dom';
import { useSelector } from 'react-redux';

export const SearchBox = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchString, setSearchString] = useState(searchParams.get('search') ? searchParams.get('search') : '');
    const navigate = useNavigate();

    const storeDetails = useSelector((state) => state.storeDetails);
    const { store } = storeDetails;


    const searchHandler = (e) => {
        e.preventDefault();
        searchParams.set('page', '1');
        if(searchString){
          searchParams.set('search', searchString);
          navigate(`/store/${store.store_id}/?${searchParams.toString()}`);
        }else{
            const param = searchParams.get('search');
            if (param) {
                // 👇️ delete each query param
                searchParams.delete('search');

                // 👇️ update state after
                setSearchParams(searchParams);
            }
        }
    }

  return (
    <Form onSubmit={searchHandler}>
      <Row className="align-items-center">
        <Col xs="auto">
          <Form.Label htmlFor="inlineFormInput" visuallyHidden>
            Search
          </Form.Label>
          <Form.Control
            id="inlineFormInput"
            placeholder="Search Product"
            value={searchString}
            onChange={(e) => setSearchString(e.target.value)}
          />
        </Col>
        <Col xs="auto">
          <Button type="submit">
            Search
          </Button>
        </Col>
      </Row>
    </Form>
  )
}

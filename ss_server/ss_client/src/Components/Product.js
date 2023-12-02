import React from 'react';
import { Card } from 'react-bootstrap';
import { Rating } from './Rating';
import { Link } from 'react-router-dom';

export const Product = ({ product }) => {
  return (
    <Card className='container h-100 rounded mb-md-4 shadow'>
      <Link to={`product/${product.item_id}`}>
        <div className='mt-3 product-list-image'>
          <Card.Img
            src={`${product.item_image}?_=${product.item_updated_time}`}
            className='img-fluid '
            style={{ height: '100%', width: 'auto', objectFit: 'cover' }}
            alt={product.item_name}
          />
        </div>
      </Link>

      <Card.Body>
        <Link to={`product/${product.item_id}`}>
          <Card.Title as="div" style={{ height: '3rem', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            <strong className='text-dark no-underline' style={{ fontSize: '1.2rem', lineHeight: '1.2' }}>
              {product.item_name}
            </strong>
          </Card.Title>
        </Link>
        <Card.Text as="div">
          <div className='my-3 justify-content-md-center' style={{ fontSize: '1rem' }}>
            <Rating value={product.rating} text={`${product.num_reviews} reviews`} color={'#f8e825'} />
          </div>
        </Card.Text>

        <Card.Text as="h3" style={{ fontSize: '1.3rem' }}>
          ${product.item_price}
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

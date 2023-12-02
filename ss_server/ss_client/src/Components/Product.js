import React from 'react'
import { Card, Col } from 'react-bootstrap'; 
import { Rating } from './Rating'
import { Link } from 'react-router-dom'

export const Product = ({product}) => {
  return (
    
    <Card className=' container h-100 rounded mb-md-4 shadow '>
        <Link to={`/product/${product.item_id}`}>
            <Card.Img src={product.item_image + '?_=' + product.item_updated_time} className='mt-3 mb-3 ml-3 mr-3 img-fluid' />
        </Link>

        <Card.Body>
            <Col xs={8} md={8} lg={9}>
            <Link to={`/product/${product.item_id}`}>
                <Card.Title className='text-dark no-underline' >
                {product.item_name}
                </Card.Title>
            </Link>
            <Card.Text as="div">
                <div className='my-3 justify-content-md-center'>
                    <Rating value={product.rating} text={`${product.num_reviews} reviews`} color={'#f8e825'}/>
                </div>
            </Card.Text>

            <Card.Text as="h3">
                ${product.item_price}
            </Card.Text>
            </Col>
        </Card.Body>
    </Card>
    
  )
}

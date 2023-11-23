import React from 'react'
import { Card } from 'react-bootstrap'
import { Rating } from './Rating'
import { Link } from 'react-router-dom'

export const Product = ({product}) => {
  return (
    <Card className='my-3 p-3 rounded'>
        <Link to={`/product/${product.item_id}`}>
            <Card.Img src={product.item_image}/>
        </Link>

        <Card.Body>
            <Link to={`/product/${product.item_id}`}>
                <Card.Title as="div">
                    <strong>{product.item_name}</strong>
                </Card.Title>
            </Link>
            <Card.Text as="div">
                <div className='my-3'>
                    <Rating value={product.rating} text={`${product.num_reviews} reviews`} color={'#f8e825'}/>
                </div>
            </Card.Text>

            <Card.Text as="h3">
                ${product.item_price}
            </Card.Text>
        </Card.Body>
    </Card>
  )
}

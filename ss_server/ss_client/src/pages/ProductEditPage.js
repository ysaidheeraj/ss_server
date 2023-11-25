import React,{useState, useEffect} from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Form, Button, Row, Col, Image, Container } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { Loader } from '../Components/Loader'
import { Message } from '../Components/Message'
import { listItemDetails, update_item_details } from '../Actions/ItemActions'
import { ITEM_UPDATE_RESET } from '../Constants/ItemConstants'


export const ProductEditPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { id: itemId } = useParams();

    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [quantity, setQuantity] = useState(0);
    const [description, setDescription] = useState('');

    const itemDetails = useSelector((state) => state.itemDetails);
    const { loading, error, item } = itemDetails;

    const itemUpdate = useSelector((state) => state.itemUpdate);
    const {error:updateError, loading:updateLoading, success:updateSuccess} = itemUpdate;

    const [selectedImage, setSelectedImage] = useState(null);
    const [imageSrc, setImageSrc] = useState('');

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // You can use the FileReader API to preview the selected image
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result);
            };
            reader.readAsDataURL(file);

            dispatch(update_item_details({
                'item_image': file
            }, itemId));
        }
    };

    useEffect(() => {
        if(updateSuccess){
            dispatch({type: ITEM_UPDATE_RESET});
            navigate('/seller/products');
        }else{
            if(!item.item_name || item.item_id !== Number(itemId)){
                dispatch(listItemDetails(itemId))
            }else{
                setName(item.item_name);
                setPrice(item.item_price);
                setQuantity(item.item_available_count);
                setImageSrc(item.item_image)
                setDescription(item.item_description)
            }
        }
    },[dispatch, item, loading, updateSuccess])

    const productUpdateHandler = (e) =>{
        e.preventDefault();
        dispatch(update_item_details({
            'item_name': name,
            'item_available_count': quantity,
            'item_price': price,
            'item_description': description
        }, itemId));
    }

  return (
    <Container>
        <Link to="/seller/products" className="btn btn-primary my-3">
            <i className="fa fa-arrow-left" aria-hidden="true"></i>
        </Link>
        <Row>
        <h2>Edit Product</h2>
        {updateError && <Message variant='danger'>{updateError}</Message>}
        {error && <Message variant="danger">{error}</Message>}
        {loading && <Loader />}
        <Col md={4}>
            <Image src={selectedImage || imageSrc} alt={name} fluid rounded />
            <Row className="mt-3">
            <Col>
                <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} ref={(input) => input && input.setAttribute('accept', 'image/*')} />
                <Button className="form-control" onClick={() => document.querySelector('input[type="file"]').click()}>
                <i className="fa fa-pencil" aria-hidden="true"></i>
                {'   '}
                Edit
                </Button>
            </Col>
            </Row>
        </Col>
        <Col md={8}>
            <Form onSubmit={productUpdateHandler}>
            <Form.Group controlId="name">
                <Form.Label>Product Name:</Form.Label>
                <Form.Control
                required
                className="mb-3"
                type="text"
                placeholder="Enter product name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                ></Form.Control>
            </Form.Group>

            <Form.Group controlId="price">
                <Form.Label>Price:</Form.Label>
                <Form.Control
                required
                className="mb-3"
                type="text"
                placeholder="Enter price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                ></Form.Control>
            </Form.Group>

            <Form.Group controlId="quantity">
                <Form.Label>Available Quantity</Form.Label>
                <Form.Control
                required
                className="mb-3"
                type="number"
                placeholder="Enter available quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                ></Form.Control>
            </Form.Group>

            <Form.Group controlId="description">
                <Form.Label>Product Description</Form.Label>
                <Form.Control
                required
                className="mb-3"
                type="text"
                placeholder="Enter product description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                ></Form.Control>
            </Form.Group>

            <Button type="submit" variant="primary" className="form-control">
                {updateLoading && <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>}
                {updateLoading ? "Processing" : "Update Product Details"}
            </Button>
            </Form>
        </Col>
        </Row>
    </Container>
  )
}

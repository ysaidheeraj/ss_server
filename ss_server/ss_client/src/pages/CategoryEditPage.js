import React,{useState, useEffect} from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Form, Button, Row, Col, Image, Container } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { Loader } from '../Components/Loader'
import { Message } from '../Components/Message'
import { listCategoryDetails, updateCategory } from '../Actions/CategoriesActions'
import { CATEGORY_UPDATE_RESET } from '../Constants/CategoriesConstants'

export const CategoryEditPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { id: categoryId } = useParams();

    const customerDetails = useSelector((state) => state.customerDetails);
    const { customer } = customerDetails;

    useEffect(() =>{
        if(!customer || !customer.isSeller){
            navigate('../login');
        }
    }, [])

    const [name, setName] = useState('');

    const categoryDetails = useSelector((state) => state.categoryDetails);
    const { loading, error, category } = categoryDetails;

    const categoryUpdate = useSelector((state) => state.categoryUpdate);
    const {error:updateError, loading:updateLoading, success:updateSuccess} = categoryUpdate;

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

            dispatch(updateCategory({
                'category_picture': file
            }, categoryId));
        }
    };

    useEffect(() => {
        if(updateSuccess){
            dispatch({type: CATEGORY_UPDATE_RESET});
        }else{
            if(!loading){
                if(!category.category_name || category.category_id !== Number(categoryId)){
                    dispatch(listCategoryDetails(categoryId))
                }else{
                    setName(category.category_name);
                    setImageSrc(category.category_picture + "?_=" +category.category_last_updated_time)
                }
            }
        }
    },[dispatch, category, loading, updateSuccess])

    const categoryUpdateHandler = (e) =>{
        e.preventDefault();
        dispatch(updateCategory({
            'category_name': name
        }, categoryId));
    }

  return (
    <Container>
        <Link to="../seller/categories" className="btn btn-primary my-3">
            <i className="fa fa-arrow-left" aria-hidden="true"></i>
        </Link>
        <Row>
        <h2>Edit Category</h2>
        {updateError && <Message variant='danger'>{updateError}</Message>}
        {error && <Message variant="danger">{error}</Message>}
        {loading && <Loader />}
        <Col md={4}>
            <Image src={selectedImage || imageSrc} alt={name} fluid rounded />
            <Row className="mt-3">
            <Col>
                <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} ref={(input) => input && input.setAttribute('accept', 'image/*')} />
                <Button className="w-100" onClick={() => document.querySelector('input[type="file"]').click()}>
                <i className="fa fa-pencil" aria-hidden="true"></i>
                {'   '}
                Edit
                </Button>
            </Col>
            </Row>
        </Col>
        <Col md={8}>
            <Form onSubmit={categoryUpdateHandler}>
            <Form.Group controlId="name">
                <Form.Label>Category Name:</Form.Label>
                <Form.Control
                required
                className="mb-3"
                type="text"
                placeholder="Enter product name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                ></Form.Control>
            </Form.Group>


            <Button type="submit" variant="primary">
                {updateLoading && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>}
                {updateLoading ? "Processing" : "Update"}
            </Button>
            </Form>
        </Col>
        </Row>
    </Container>
  )
}

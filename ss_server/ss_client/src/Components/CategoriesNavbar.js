import React, {useEffect, useState} from 'react'
import { listCategories } from "../Actions/CategoriesActions";
import { Nav } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Loader } from './Loader';
import { useSearchParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export const CategoriesNavbar = ({selectedCategoryLink}) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [currentCategory, setCurrentCategory] = useState(searchParams.get('category') ? searchParams.get('category') : "-1");


    const categoriesList = useSelector((state) => state.categoriesList);
    const {loading, categories, error } = categoriesList;
    useEffect(() =>{
        if(!categories || !categories.length){
            dispatch(listCategories());
        }
    },[dispatch])
    
    const changeCategoryHandler = (categoryId) =>{
        setCurrentCategory(categoryId);
        searchParams.set('category', categoryId)
        setSearchParams(searchParams);
        navigate(`/?${searchParams.toString()}`);
    }
  return (
    <div>
        {loading ? (<Loader />)
        : categories.length > 0 ? (
            <Nav fill variant="tabs" activeKey={currentCategory} onSelect={changeCategoryHandler}>
                <Nav.Item>
                    <Nav.Link eventKey="-1">All</Nav.Link>
                </Nav.Item>
                {categories.map((category) =>(
                    <Nav.Item key={category.category_id}>
                        <Nav.Link eventKey={`${category.category_id}`}>{category.category_name}</Nav.Link>
                    </Nav.Item>
                ))}
            </Nav>
        ): (
            <Nav variant="tabs" activeKey='-1'>
                <Nav.Item>
                    <Nav.Link eventKey='-1'>All</Nav.Link>
                </Nav.Item>
            </Nav>
        )}
    </div>
  )
}

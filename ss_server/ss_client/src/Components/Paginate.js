import React from 'react'
import { Pagination } from 'react-bootstrap'
import { useSearchParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

export const Paginate = ({pages, page, search='', isAdmin=false}) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    // const searchParamsString = searchParams.size ? `/?${searchParams.toString()}&`: '/?';
    const pathName = isAdmin ? '/seller/products' : '/';

    const handleClick = (e, pageNum) =>{
        e.preventDefault();
        searchParams.set('page', pageNum);
        setSearchParams(searchParams);
    }

  return (
    pages > 1 && (
        <Pagination className='mt-2'>
            {[...Array(pages).keys()].map((pageNum) =>(
                <Pagination.Item 
                    key={pageNum+1}
                    as='link' 
                    active={pageNum + 1 === page}
                    onClick={(e) => handleClick(e, pageNum+1)}
                    // href={pathName + `page=${pageNum+1}`}
                >
                    {pageNum+1}
                </Pagination.Item>
            ))}
        </Pagination>
    )
  )
}

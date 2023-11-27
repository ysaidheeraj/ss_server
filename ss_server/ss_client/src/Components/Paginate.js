import React from 'react'
import { Pagination } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'

export const Paginate = ({pages, page, search='', isAdmin=false}) => {
    const searchParams = search && search.length ? `?search=${search}&`: '?';
    const pathName = isAdmin ? '/seller/products'+searchParams : '/'+searchParams;

  return (
    pages > 1 && (
        <Pagination className='mt-2'>
            {[...Array(pages).keys()].map((pageNum) =>(
                <Pagination.Item 
                    key={pageNum+1}
                    as='link' 
                    active={pageNum + 1 === page}
                    href={pathName + `page=${pageNum+1}`}
                >
                    {pageNum+1}
                </Pagination.Item>
            ))}
        </Pagination>
    )
  )
}

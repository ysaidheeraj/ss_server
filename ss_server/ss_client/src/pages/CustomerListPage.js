import { list_store_customers } from '../Actions/UserActions'
import { Loader } from '../Components/Loader'
import { Message } from '../Components/Message'
import { Table, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export const CustomerListPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const customerList = useSelector(state => state.customerList)
    const {loading, error, customers} = customerList;

    //Calling the list users
    useEffect(()=>{
        dispatch(list_store_customers());
    },[dispatch])

    const customerDetails = useSelector((state) => state.customerDetails);
    const { customer } = customerDetails;

    if(!customer || !customer.isSeller){
        navigate('/login');
    }


  return (
    <div>
        <h1>Customers</h1>
        {loading ?
        <Loader />
        : error ?
        <Message variant='danger'>{error}</Message>
        :(
            <Table striped bordered hover responsive className='table-sm'>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>EMAIL</th>
                        <th>NAME</th>
                        <th>ORDERS</th>
                        <th>FULFILLED</th>
                        <th>IN PROGRESS</th>
                        <th>CANCELLED/RETURNED</th>
                        <th>SALES</th>
                    </tr>
                </thead>

                <tbody>
                    {customers.map((customer)=>(
                        <tr key={customer.user_id}>
                            <td>{customer.user_id}</td>
                            <td>{customer.email}</td>
                            <td>{customer.first_name}{' '}{customer.last_name}</td>
                            <td>{customer.num_orders}</td>
                            <td>{customer.fulfilled_orders}</td>
                            <td>{customer.inprogress_orders}</td>
                            <td>{customer.unfulfilled_orders}</td>
                            <td>${customer.total_sales}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        )}
    </div>
  )
}

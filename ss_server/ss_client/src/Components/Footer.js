import React from 'react';
import { Container, Row, Col } from 'react-bootstrap'
import { useSelector } from 'react-redux';

export const Footer = () => {
    const storeDetails = useSelector((state) => state.storeDetails);
  const { store } = storeDetails;
  return (
        <footer>
            <Container>
                <Row>
                    <Col className='text-center py-3'>
                        Copyright &copy; {store ? store.store_name : "SellSmart"}
                    </Col>
                </Row>
            </Container>
        </footer>
  )
}

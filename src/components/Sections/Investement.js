import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';

import Circles from '../../assets/images/sm-planet.png'
import BigCircles from '../../assets/images/investment-vectores.png'

const Investement = () => {
    return (
        <div className='investement text-capitalize position-relative'>
            <Container>
                <div className="investement-inner">
                    <img src={Circles} className='investement-circles' alt="investement circles" />
                    <img src={BigCircles} className='investement-circles-big' alt="investement circles" />
                    <Row>
                        <Col lg={7}>
                            <h2 className='mb-3'>Investment protection</h2>
                            <h3>Rising floor price</h3>
                            <p>The TAU treasury will increase in value through a series of strategic investments thus increasing the backed price.</p>
                        </Col>
                    </Row>
                </div>
            </Container>
        </div>
    );
};

export default Investement;
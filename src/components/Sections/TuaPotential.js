import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';

import Tree from '../../assets/images/home-desktop-tree.png';
import Step1 from '../../assets/images/step1.png';
import Step2 from '../../assets/images/step2.png';
import Step3 from '../../assets/images/step3.png';
import Step4 from '../../assets/images/step4.png';
import Shape from '../../assets/images/shape1.png';

const TuaPotential = () => {
    return (
        <div className='tua-potential text-capitalize'>
            <Container fluid="lg">
                <Row className='text-center position-relative text-uppercase z-2 justify-content-center'>
                    <Col>
                        <h2>TAU protocol mechanics</h2>
                    </Col>
                </Row>

                <div className="tua-list">
                    <img src={Tree} alt="tree" className='img-fluid d-md-block d-none' />

                    <div className="tua-list-content tua-list-content-1">
                        <div className="h3">Gasless transaction</div>
                        <p>Benefit DEX users by crediting TAU tokens equal to the exchange swap fees paid during the transaction.</p>
                    </div>

                    <div className="tua-list-image tua-list-image-1 d-md-none">
                        <img src={Step1} className='img-fluid' alt="step" />
                    </div>
                    
                    <div className="tua-list-content tua-list-content-3">
                        <div className="h3">Bond and LP fees</div>
                        <p>Bond Sales and LP Fees increase treasury revenue and in turn help stabilize TAU's purchase power.</p>
                    </div>

                    <div className="tua-list-image tua-list-image-2 d-md-none">
                        <img src={Shape} className='img-fluid' alt="step" />
                    </div>

                    <div className="tua-list-content tua-list-content-2">
                        <div className="h3">Decentralized VC fund</div>
                        <p>VC Fund help increase floor price consistently and regulate purchase power.</p>
                    </div>

                    <div className="tua-list-image tua-list-image-3 d-md-none">
                        <img src={Step2} className='img-fluid' alt="step" />
                    </div>
                    
                    <div className="tua-list-content tua-list-content-4">
                        <div className="h3">Staking rewards</div>
                        <p>Long term holders benefit staking to maximize their purchase power.</p>
                    </div>
                    <div className="tua-list-image tua-list-image-4 d-md-none">
                        <img src={Step3} className='img-fluid' alt="step" />
                    </div>
                    <div className="tua-list-content tua-list-content-5">
                        <div className="h3">Profit sharing</div>
                        <p>Distributes a portion of treasury balance to all the DAO holders yearly.</p>
                    </div>
                    <div className="tua-list-image tua-list-image-5 d-md-none">
                        <img src={Step4} className='img-fluid' alt="step" />
                    </div>
                </div>
            </Container>
        </div>
    );
};

export default TuaPotential;
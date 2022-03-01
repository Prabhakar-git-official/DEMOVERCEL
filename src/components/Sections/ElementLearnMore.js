import React from 'react';
import { Col, Row } from 'react-bootstrap';

import Icon1 from '../../assets/images/learnMore-icon1.png';
import Icon2 from '../../assets/images/learnMore-icon2.png';
import Icon3 from '../../assets/images/learnMore-icon3.png';
import Icon4 from '../../assets/images/learnMore-icon4.png';
import learnCircle from '../../assets/images/learn-more-circle.png';
import { Link } from 'react-router-dom';

const ElementLearnMore = () => {
    return (
        <div>
            <Row className='text-center mb-60 element-protocol-heading'>
                <Col sm={12}>
                    <h2 className='mb-0'>Learn More</h2>
                </Col>
            </Row>

            <Row>
                <Col md={6} lg={3} className="mb-lg-0 mb-4">
                    <div className="learn-card">
                        <img src={learnCircle} className="learn-circle" alt="learn Circle" />
                        <div className="learn-card-icon">
                            <img src={Icon1} alt="icon" />
                        </div>

                        <h4 className='d-flex align-items-start justify-content-between'>
                            <span>Algorithimic Stable coin</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-arrow-right" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
                            </svg>
                        </h4>
                        <p>TAU is minted by burning ELEM or taking out a liquidation-free loan from the Money Market platform. TAU can be traded for other...</p>

                        <Link to="/" className="btn btn-secondary">Learn More</Link>
                    </div>
                </Col>
                <Col md={6} lg={3} className="mb-lg-0 mb-4">
                    <div className="learn-card">
                        <img src={learnCircle} className="learn-circle" alt="learn Circle" />
                        <div className="learn-card-icon">
                            <img src={Icon2} alt="icon" />
                        </div>

                        <h4 className='d-flex align-items-start justify-content-between'>
                            <span>Decentralized reserved currency</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-arrow-right" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
                            </svg>
                        </h4>
                        <p>ELEM is the first decentralized liquidity owned algorithmic currency on the Algorand... </p>

                        <Link to="/" className="btn btn-secondary">Learn More</Link>
                    </div>
                </Col>
                <Col md={6} lg={3} className="mb-lg-0 mb-4">
                    <div className="learn-card">
                        <img src={learnCircle} className="learn-circle" alt="learn Circle" />
                        <div className="learn-card-icon">
                            <img src={Icon3} alt="icon" />
                        </div>

                        <h4 className='d-flex align-items-start justify-content-between'>
                            <span>Collateral banking redefined</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-arrow-right" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
                            </svg>
                        </h4>
                        <p>A new kind of "Self-Paying" DEFI Lending Protocol with yield based risk derivatives POWERED BY ELEMENT PROTOCOL</p>
                    </div>
                </Col>
                <Col md={6} lg={3} className="mb-lg-0 mb-4">
                    <div className="learn-card">
                        <img src={learnCircle} className="learn-circle" alt="learn Circle" />
                        <div className="learn-card-icon">
                            <img src={Icon4} alt="icon" />
                        </div>

                        <h4 className='d-flex align-items-start justify-content-between'>
                            <span>Magical risk free loans that pays itself</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-arrow-right" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
                            </svg>
                        </h4>
                        <p>Imagine a bank. You can deposit money, and the bank pays you 10-15% interest. There's a...</p>

                        <Link to="/" className="btn btn-secondary">Learn More</Link>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default ElementLearnMore;
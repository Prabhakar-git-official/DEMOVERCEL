import React from 'react';
import { Button, Col, Container, Modal, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Layout from './Layout';

import Logo from '../../assets/images/modal-logo.png';
import Arrow from '../../assets/images/arrow-tr.svg';
import ModalSquareLogo from '../../assets/images/modal-square-logo.png';


const Bond = () => {
    const [show, setShow] = React.useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    return (
        <Layout>
            <Container fluid="lg">
                <div className="note mb-60 d-flex justify-content-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi ms-2 bi-info-circle" viewBox="0 0 16 16">
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                        <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                    </svg>
                    <p>TAU is currently migrating to improved contracts. Please note that during this time, frontend metrics may be inaccurate.</p>
                </div>

                <div className="card-bond">
                    <div className="card-bond-inner">
                        <div className="d-flex align-items-center justify-content-between mb-60">
                            <div className="h3 mb-0">Bond (1,1,1)</div>
                            <Link className='h5 mb-0 text-white' to="/">v1Bond <img src={Arrow} style={{width: '10px'}} className='ms-1' alt="arrow" /></Link>
                        </div>

                        <Row className='text-center mb-20'>
                            <Col className='mb-3'>
                                <p className='mb-1'>Treasury Balance</p>
                                <h6 className='mb-0'>$1,953,403,446</h6>
                            </Col>
                            <Col className='mb-3'>
                                <p className='mb-1'>TAU Price</p>
                                <h6 className='mb-0'>$249.08</h6>
                            </Col>
                        </Row>

                        <div className="table-group-outer table-group-bond mb-30">
                            <div className="table-group-head">
                                <div className="table-group-tr">
                                    <div className="table-group-th" style={{minWidth: '85px', width: '85px'}}></div>
                                    <div className="table-group-th">Band</div>
                                    <div className="table-group-th">Price</div>
                                    <div className="table-group-th">ROI</div>
                                    <div className="table-group-th">Duration</div>
                                    <div className="table-group-th"></div>
                                </div>
                            </div>
                            <div className="table-group-body">
                                <div className="table-group-tr">
                                    <div className="table-group-td" style={{minWidth: '85px', width: '85px'}}>
                                        <div className="d-flex align-items-center td-cell">
                                            <img src={ModalSquareLogo} alt='icon' />
                                        </div>
                                    </div>
                                    <div className="table-group-td">
                                        USDC
                                    </div>
                                    <div className="table-group-td">$195.19</div>
                                    <div className="table-group-td">0.11%</div>
                                    <div className="table-group-td">14 days</div>
                                    <div className="table-group-td text-end"><Button variant='grad' onClick={handleShow} className='py-2'>Bond</Button></div>
                                </div>
                                <div className="table-group-tr">
                                    <div className="table-group-td" style={{minWidth: '85px', width: '85px'}}>
                                        <div className="d-flex align-items-center td-cell">
                                            <img src={ModalSquareLogo} alt='icon' />
                                            <img src={ModalSquareLogo} alt='icon' />
                                        </div>
                                    </div>
                                    <div className="table-group-td">
                                        TAU-USDC LP
                                    </div>
                                    <div className="table-group-td">$195.19</div>
                                    <div className="table-group-td">0.11%</div>
                                    <div className="table-group-td">14 days</div>
                                    <div className="table-group-td text-end"><Button variant='grad' onClick={handleShow} className='py-2'>Bond</Button></div>
                                </div>
                            </div>
                        </div>

                        <Row className='justify-content-center text-center'>
                            <Col md={8}>
                                <p>Important: New bonds are auto-staked and no longer vest linearly. Simply claim as sOHM or gOHM at the end of the term.   </p>
                            </Col>
                        </Row>
                    </div>
                </div>
            </Container>


            <Modal
                show={show}
                size={'lg'}
                centered={true}
                onHide={handleClose}
                keyboard={false}
            >

                <Modal.Body>
                    <Button className='modal-close' onClick={handleClose} variant='reset'>
                    <svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g opacity="0.3">
                        <path d="M17.5004 32.0832C9.44597 32.0832 2.91699 25.5542 2.91699 17.4998C2.91699 9.44546 9.44597 2.9165 17.5004 2.9165C25.5548 2.9165 32.0837 9.44546 32.0837 17.4998C32.0837 25.5542 25.5548 32.0832 17.5004 32.0832ZM17.5004 29.1665C20.5946 29.1665 23.562 27.9373 25.75 25.7494C27.9379 23.5615 29.1671 20.594 29.1671 17.4998C29.1671 14.4056 27.9379 11.4382 25.75 9.25026C23.562 7.06233 20.5946 5.83317 17.5004 5.83317C14.4062 5.83317 11.4387 7.06233 9.25076 9.25026C7.06283 11.4382 5.83367 14.4056 5.83367 17.4998C5.83367 20.594 7.06283 23.5615 9.25076 25.7494C11.4387 27.9373 14.4062 29.1665 17.5004 29.1665ZM17.5004 15.4378L21.6245 11.3121L23.6881 13.3757L19.5625 17.4998L23.6881 21.624L21.6245 23.6875L17.5004 19.5619L13.3762 23.6875L11.3126 21.624L15.4383 17.4998L11.3126 13.3757L13.3762 11.3121L17.5004 15.4378Z" fill="white"/>
                        </g>
                    </svg>
                    </Button>
                
                    <div className="d-flex mb-20 flex-wrap align-items-start justify-content-between">
                        <div className="d-flex align-items-center mb-md-4 flex-wrap modal-head">
                            <img src={Logo} alt="logo" />

                            <Button variant='grad' className='py-1'>opt-in app</Button>

                            <span>(opt-in only one time)</span>
                        </div>
                    </div>

                    <div className="d-flex mb-20 flex-wrap align-items-start justify-content-between">
                        <div>
                            <strong>Time left to claim</strong>
                            <div className="h3 mb-0">0d:0h:0m:0s</div>
                        </div>
                    </div>

                    <div className="mb-20 d-flex justify-content-center flex-wrap">
                        <div className='mb-3 w-100 text-center'>
                            <Button variant='grad'>Exchange</Button>
                        </div>
                        <Button variant='grad' className='mx-sm-2 mx-1 mb-3'>opt-in asset</Button>
                        <Button variant='grad' className='mx-sm-2 mx-1 mb-3'>Claim</Button>
                    </div>

                    <div className="d-flex flex-wrap align-items-start justify-content-between">
                        <div className='d-flex pe-2 mb-3 flex-column'>
                            <strong>Bond Total</strong>
                            <div className="h3 mb-0">NaN</div>
                        </div>
                        <div className='d-flex pe-2 mb-3 flex-column'>
                            <strong>Bond yet to claim</strong>
                            <div className="h3 mb-0">NaN</div>
                        </div>
                        <div className='d-flex mb-3 flex-column'>
                            <strong>Bond claimed</strong>
                            <div className="h3 mb-0">NaN</div>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </Layout>
    );
};

export default Bond;
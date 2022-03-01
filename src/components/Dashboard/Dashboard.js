import React from 'react';
import { Container, Row, Col, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Layout from './Layout';

import Arrow from '../../assets/images/arrow-tr.svg';
import TotalValueDepositedChart from './Snippets/TotalValueDepositedChart';
import MarketValueTreasuryAssets from './Snippets/MarketValueTreasuryAssets';
import RiskFreeValueTreasuryAsset from './Snippets/RiskFreeValueTreasuryAsset';
import SLPTreasury from './Snippets/SLPTreasury';
import TAUStaked from './Snippets/TAUStaked';
import RunwayAvailable from './Snippets/RunwayAvailable';

const Dashboard = () => {
    return (
        <Layout>
            <Container fluid="lg">
                <Row>
                    <Col md="4" sm="6" lg="3" className="mb-3">
                        <div className="value-card flex-column p-3 d-flex align-items-center justify-content-center">
                            <span>Market Cap</span>
                            <strong>$1,953,403,446</strong>
                        </div>
                    </Col>
                    <Col md="4" sm="6" lg="3" className="mb-3">
                        <div className="value-card flex-column p-3 d-flex align-items-center justify-content-center">
                            <span>TAU Price</span>
                            <strong>$249.08</strong>
                        </div>
                    </Col>
                    <Col md="4" sm="6" lg="3" className="mb-3">
                        <div className="value-card flex-column p-3 d-flex align-items-center justify-content-center">
                            <span>Fiduciary Treasury 
                            <OverlayTrigger
                                placement="top"
                                overlay={
                                    <Tooltip id={`tooltip-top`}>
                                        annualized
                                    </Tooltip>
                                }
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi ms-2 bi-info-circle" viewBox="0 0 16 16">
                                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                                        <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                                    </svg>
                                </OverlayTrigger>
                            </span>
                            <strong>$1,953,403,446</strong>
                        </div>
                    </Col>
                    <Col md="4" sm="6" lg="3" className="mb-3">
                        <div className="value-card flex-column p-3 d-flex align-items-center justify-content-center">
                            <span>ELEM PRICE</span>
                            <strong>$249.08</strong>
                        </div>
                    </Col>
                    <Col md="4" sm="6" lg="3" className="mb-3">
                        <div className="value-card flex-column p-3 d-flex align-items-center justify-content-center">
                            <span>Circulating Supply (total)</span>
                            <strong>7851190 / 8704038</strong>
                        </div>
                    </Col>
                    <Col md="4" sm="6" lg="3" className="mb-3">
                        <div className="value-card flex-column p-3 d-flex align-items-center justify-content-center">
                            <span>Backing per TAU</span>
                            <strong>$76.13</strong>
                        </div>
                    </Col>
                    <Col md="4" sm="6" lg="3" className="mb-3">
                        <div className="value-card flex-column p-3 d-flex align-items-center justify-content-center">
                            <span>Current Index
                            <OverlayTrigger
                                placement="top"
                                overlay={
                                    <Tooltip id={`tooltip-top`}>
                                        annualized
                                    </Tooltip>
                                }
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi ms-2 bi-info-circle" viewBox="0 0 16 16">
                                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                                        <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                                    </svg>
                                </OverlayTrigger>
                            </span>
                            <strong>61.91 sTAU</strong>
                        </div>
                    </Col>
                    <Col md="4" sm="6" lg="3" className="mb-3">
                        <div className="value-card flex-column p-3 d-flex align-items-center justify-content-center">
                            <span>ELEM MARKET CAP</span>
                            <strong>$1,953,403,446</strong>
                        </div>
                    </Col>
                </Row>

                <div className="note mb-40 d-flex justify-content-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi ms-2 bi-info-circle" viewBox="0 0 16 16">
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                        <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                    </svg>
                    <p>TAU is currently migrating to improved contracts. Please note that during this time, frontend metrics may be inaccurate.</p>
                </div>

                <Row>
                    <Col md="6" className='mb-4'>
                        <div className="card-graph">
                            <div className="card-graph-header d-flex align-items-center justify-content-between">
                                <div className='pe-5'>
                                    <p className='mb-1'>Total Value Deposited 
                                    <OverlayTrigger
                                        placement="top"
                                        overlay={
                                            <Tooltip id={`tooltip-top`}>
                                                Total Value Deposited
                                            </Tooltip>
                                        }
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi ms-2 bi-info-circle" viewBox="0 0 16 16">
                                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                                                <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                                            </svg>
                                        </OverlayTrigger>
                                    </p>
                                    <h6><strong>$1,703,470,900</strong> Today</h6>
                                </div>
                                <Link to="/"><img src={Arrow} className='d-block' alt="arrow" /></Link>
                            </div>
                            <TotalValueDepositedChart />
                        </div>
                    </Col>
                    <Col md="6" className='mb-4'>
                        <div className="card-graph">
                            <div className="card-graph-header d-flex align-items-center justify-content-between">
                                <div className='pe-5'>
                                    <p className='mb-1'>Market Value of Treasury Assets 
                                    <OverlayTrigger
                                        placement="top"
                                        overlay={
                                            <Tooltip id={`tooltip-top`}>
                                                Market Value of Treasury Assets
                                            </Tooltip>
                                        }
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi ms-2 bi-info-circle" viewBox="0 0 16 16">
                                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                                                <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                                            </svg>
                                        </OverlayTrigger>
                                    </p>
                                    <h6><strong>$560,925,646</strong> Today</h6>
                                </div>
                                <Link to="/"><img src={Arrow} className='d-block' alt="arrow" /></Link>
                            </div>
                            <MarketValueTreasuryAssets />
                        </div>
                    </Col>
                    <Col md="6" className='mb-4'>
                        <div className="card-graph">
                            <div className="card-graph-header d-flex align-items-center justify-content-between">
                                <div className='pe-5'>
                                    <p className='mb-1'>Risk Free Value of Treasury Asset 
                                    <OverlayTrigger
                                        placement="top"
                                        overlay={
                                            <Tooltip id={`tooltip-top`}>
                                                Risk Free Value of Treasury Asset
                                            </Tooltip>
                                        }
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi ms-2 bi-info-circle" viewBox="0 0 16 16">
                                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                                                <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                                            </svg>
                                        </OverlayTrigger>
                                    </p>
                                    <h6><strong>$215,380,370</strong> Today</h6>
                                </div>
                                <Link to="/"><img src={Arrow} className='d-block' alt="arrow" /></Link>
                            </div>
                            <RiskFreeValueTreasuryAsset />
                        </div>
                    </Col>
                    <Col md="6" className='mb-4'>
                        <div className="card-graph">
                            <div className="card-graph-header d-flex align-items-center justify-content-between">
                                <div className='pe-5'>
                                    <p className='mb-1'>Protocol Owned Liquidity TAU-USDC 
                                    <OverlayTrigger
                                        placement="top"
                                        overlay={
                                            <Tooltip id={`tooltip-top`}>
                                                Protocol Owned Liquidity TAU-USDC
                                            </Tooltip>
                                        }
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi ms-2 bi-info-circle" viewBox="0 0 16 16">
                                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                                                <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                                            </svg>
                                        </OverlayTrigger>
                                    </p>
                                    <h6><strong>99.99%</strong> Today</h6>
                                </div>
                                <Link to="/"><img src={Arrow} className='d-block' alt="arrow" /></Link>
                            </div>
                            <SLPTreasury />
                        </div>
                    </Col>
                    <Col md="6" className='mb-4'>
                        <div className="card-graph">
                            <div className="card-graph-header d-flex align-items-center justify-content-between">
                                <div className='pe-5'>
                                    <p className='mb-1'>TAU Staked 
                                    <OverlayTrigger
                                        placement="top"
                                        overlay={
                                            <Tooltip id={`tooltip-top`}>
                                                TAU Staked
                                            </Tooltip>
                                        }
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi ms-2 bi-info-circle" viewBox="0 0 16 16">
                                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                                                <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                                            </svg>
                                        </OverlayTrigger>
                                    </p>
                                    <h6><strong>88.95%</strong> Today</h6>
                                </div>
                                <Link to="/"><img src={Arrow} className='d-block' alt="arrow" /></Link>
                            </div>
                            <TAUStaked />
                        </div>
                    </Col>
                    <Col md="6" className='mb-4'>
                        <div className="card-graph">
                            <div className="card-graph-header d-flex align-items-center justify-content-between">
                                <div className='pe-5'>
                                    <p className='mb-1'>Runway Available 
                                    <OverlayTrigger
                                        placement="top"
                                        overlay={
                                            <Tooltip id={`tooltip-top`}>
                                                Runway Available
                                            </Tooltip>
                                        }
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi ms-2 bi-info-circle" viewBox="0 0 16 16">
                                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                                                <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                                            </svg>
                                        </OverlayTrigger>
                                    </p>
                                    <h6><strong>357.9 Days</strong></h6>
                                </div>
                                <Link to="/"><img src={Arrow} className='d-block' alt="arrow" /></Link>
                            </div>
                            <RunwayAvailable />
                        </div>
                    </Col>
                </Row>
            </Container>
        </Layout>
    );
};

export default Dashboard;
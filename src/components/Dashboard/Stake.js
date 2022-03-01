import React, {useState, useEffect} from 'react';
import { Col, Container, OverlayTrigger, Row, Tooltip, Modal, Form, Button } from 'react-bootstrap';
import { Link, useHistory } from 'react-router-dom';
import Layout from './Layout';
import ReactDomServer from 'react-dom/server';
import Arrow from '../../assets/images/arrow-tr.svg';
import Clock from '../../assets/images/Clock.svg';
import ModalSquareLogo from '../../assets/images/modal-square-logo.png';
import { ToastContainer, Toast, Zoom, Bounce, Flip, Slide, toast} from 'react-toastify';
import "../../components/toast-style-override.css"


import { contracts } from '../contractaddress';
import { token1, stakehelper,stakingcontract} from './Abi';
import web3 from '../../web3';

const Dashboard = () => {

    const [show, setShow] = React.useState(true);
    const [showStake, setShowStake] = React.useState(false);

    const handleCloseStake = () => setShowStake(false);
    const handleShowStake = () => setShowStake(true);

    const [showUnstake, setShowUnstake] = React.useState(false);
    const[time,settime]= useState("");
    const handleCloseUnstake = () => setShowUnstake(false);
    const handleShowUnstake = () => setShowUnstake(true);
    const [algoPrice, setAlgoPrice] = useState([]);
    const [usdtPrice, setUsdtPrice] = useState([]);
    const handle = () => setShow(!show);
    const[day,setTime4]= useState("");
    const[hour,setTim1]= useState("");
    const[min,setTim2]= useState("");
    const[sec,setTim3]= useState("");
    const[lock,setlock]= useState(""); 
    const [s1, sets1] = useState("");
    const [s2, sets2] = useState("");
    const [ilt, setilt] = useState("");
    const [elemMint, setElemMint] = useState("");
    const [val1, setVal1] = useState("");
    const [val2, setVal2] = useState("");
    const [rebaseTime, setRebaseTime] = useState("");
    function sleep(delay) {
        var start = new Date().getTime();
        while (new Date().getTime() < start + delay);
    }


    let [activeTab, setActiveTab] = useState("Deposit");
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [dropdownOpen1, setDropdownOpen1] = useState(false);
    const [multiple, setMultiple] = useState(false);
    const[stakeenddate,setStakeendDate]=useState('');
    var[datestake,setDatestake]=useState([]);
    var [time2, settime2]=useState("");
    var [date1, setdate1]=useState("");
    var [time1, settime1]=useState("");
    const[ap1,setAP] = useState("");
    const [discal ,setdistance]=useState("");
    const [lock1 ,setlock1]=useState("");
    const[stakelock,setStakeLock]=useState("");
    const toggleDropDown = () => setDropdownOpen(!dropdownOpen);
    const toggle1 = () => setDropdownOpen1(!dropdownOpen1);
    let history = useHistory();
    const [isOpen, setIsOpen] = useState(false);
    const [isOpens, setIsOpens] = useState(false);
    var[dis,setDis] = useState("");
    const [isOpennew, setIsOpennew] = useState(false);
    const [isOpennewpro, setIsOpennewpro] = useState(false);
    const[datasendhere,datasethere] = useState("");
    const[tid1,setId1] = useState("");
    // const [show, setShow] = React.useState(false);

    // const handleClose = () => setShow(false);
    // const handleShow = () => setShow(true);
    const[token1balance,settoken1balance] = useState([]);
    
    const[stakedbalance,setStakedBalance] = useState([]);
    const[rewardamountbalance,setrewardBalance] = useState([]);
    const[globaltime,setGlobalTime] = useState('');
    const[globalstake,setGlobalStake] = useState('');
    const[totalsul,settotalsul] = useState('');
    const[totalslatelock,settotalslatelock] = useState('');
    const[usertime,setusertime] = useState('');
    const[rewardcalc,setrewardcalculation]=useState('');
    const[stakeamount,setstakedamount] = useState("");
    const[unstakeamount,setunstakedamount] = useState("");
    const [accounts, setaccount] = useState("");

    const[totalstake,setTotalStake]=useState("");
    const[nextRebase,setRebase]=useState("");
    const[prices1,setS1]=useState("");
    const[prices2,setS2]=useState("");
    const[price,setprice]=useState("");
    const[totalreward,setTotalreward]=useState("");
    const[totalrewardallocated,setTotalrewardallocated]=useState("");
    const[rewardleft,setRewardleft]=useState("");
    const[totalclaimed,setTotalclaim]=useState("");
    const[totallock,setTotallock]=useState("");
    let address=localStorage.getItem("walletAddress");
    const timecontract = new web3.eth.Contract(token1, contracts.Token1.address);
    const stakehelpercontract = new web3.eth.Contract(stakehelper, contracts.StakingHelper.address);
    const Stakingcontract = new web3.eth.Contract(stakingcontract, contracts.StakingContract.address);
    const first1 = async () => {
      const accounts =  await web3.eth.getAccounts();
      var nextRebase = await Stakingcontract.methods.epoch().call();
      
      //setRebase(await Stakingcontract.methods.epoch[3].call());
      //const stakingReward = epoch.methods.distribute;
      
      //const currentIndex = await Stakingcontract.index();
    //   const nextRebase = parseInt(epoch);
      console.log("nextRebase",nextRebase[3]);
      settoken1balance(await timecontract.methods.balanceOf(accounts[0]).call());
    }

    useEffect(() => {first1()},[token1balance,nextRebase])
    const approve = async() => {
      let account = await web3.eth.getAccounts();
      let amount = 1000000000000000000 +"000000000000000000"; 
      await timecontract.methods.approve(contracts.StakingHelper.address,amount).send({from:account[0]});
     
      toast.success(`Approve  Success `);
     
  }
  
//stake

  const deposit = async(event) => {
    event.preventDefault();
    const accounts =  await web3.eth.getAccounts();
    var valu = document.getElementById("tid1").value;
    var value = valu * 1000000000;
    console.log("stake0");
    // var value = val * 1000000000;
     //var stakelimitamount=1000000000000000-staked[0];
    
console.log("stake1");
    if(parseInt(value)<=parseInt(token1balance)){
      console.log("stake2");
            await stakehelpercontract.methods.stake(web3.utils.toBN(value),accounts[0]).send({from:accounts[0]});
            console.log("stake3");
            toast.success(`staked  Success `);
            first1();
      
}
else{
   
    toast.error(`staking Failed`);
}
  }

//unstake
const withdraw = async(event) => {
    event.preventDefault();
    const accounts =  await web3.eth.getAccounts();
    var valu = document.getElementById("tid2").value;
    // let x = new BigNumber(valu).times(1000000000000000000);
    // console.log("value",x.toNumber());
    // var value = x.toNumber();
    var value = valu * 1000000000;
    // var value = val * 1000000000;
    
        await Stakingcontract.methods.unstake(web3.utils.toBN(value),true).send({from:accounts[0]});
     
        first1()
    
   
  }  
    





    


   


    

    const first = async () => {
        var nextRebase = await Stakingcontract.methods.epoch().call();
      
        
        console.log("nextRebase",nextRebase[3]);
   
     //let rebaseT = parseInt(localStorage.getItem("rebaseTime"));
      var us= nextRebase[3] + 300;
      var ff=new Date(us);
  // setdate(ff.toDateString());
  var hours = ff.getHours();
    var minutes = ff.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    settime( hours + ':' + minutes + ' ' + ampm);
  //settime(lock);
  var countDowndate   =us * 1000;
  //console.log(countDowndate);
  // var countDownDate = new Date().getTime() + (lock * 1000) ;
  //alert(time);
      var x = setInterval(function() {
         var now = new Date().getTime();
        var distance = countDowndate - now ;
      //   console.log("-------------------now", distance);
       // console.log(now);
        // Time calculations for days, hours, minutes and seconds
       var days = Math.floor(distance / (1000 * 60 * 60 * 24));
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);
          
      //   console.log("date e", day);
      //   console.log("hour e", hour);
      //   console.log("min e", minutes);
      //   console.log("sec e", seconds);
  
        // Output the result in an element with id="demo"
       // document.getElementById("demo").innerHTML = hours + "h "
       // + minutes + "m " + seconds + "s ";
      setTime4(days);
      setTim1(hours);
      setTim2(minutes);
      setTim3(seconds);
  
  
      
      
      
      
        // If the count down is over, write some text 
        if (distance < 0) {
              clearInterval(x);
              setlock(false);
  
             // console.log('CountDown Finished');
          }
          else{
           setlock(true);
          }
  
      
        
      }, 1000);
     
  
  }
useEffect(async() => {
      await first()
  }, [sec, lock]);





    


    return (
        <Layout>
            <><ToastContainer position='top-center' draggable = {true} transition={Slide} autoClose={8000} closeOnClick = {false}/></>
            <Container fluid="lg">
            <Modal show={showStake} centered onHide={handleCloseStake}>
                <Modal.Header class="btn-close btn-close-white" closeButton />
                <Modal.Body>
                    <div className="pb-4 px-3">
                  
                        {/* <img src={SLogo} width="80" className="mx-auto mb-1 d-block" alt="icon" /> */}
                        <h5 className="mb-1 text-center">Element</h5>
                        <p className="mb-4 pb-3 text-center"></p>

                        <Form className='form-area'>
                        <Form.Group className="mb-4">
                            <center><Form.Label><h3>Stake</h3></Form.Label></center> <br/>
                            <Form.Control type="number" placeholder="Enter Amount" id="tid1"/>
                        </Form.Group>
                            <Button variant="grad" size="lg" className='w-100' onClick={deposit}>
                                Stake
                            </Button>
                        </Form>
                    </div>
                </Modal.Body>
            </Modal>
            <Modal show={showUnstake} centered onHide={handleCloseUnstake}>
                <Modal.Header class="btn-close btn-close-white" closeButton />
                <Modal.Body>
                    <div className="pb-4 px-3">
                  
                        {/* <img src={SLogo} width="80" className="mx-auto mb-1 d-block" alt="icon" /> */}
                        <h5 className="mb-1 text-center">Element</h5>
                        <p className="mb-4 pb-3 text-center"></p>

                        <Form className='form-area'>
                        <Form.Group className="mb-4" >
                            <center><Form.Label><h3>Unstake</h3></Form.Label></center> <br/>
                            <Form.Control type="number" placeholder="Enter Amount" id="tid2"/>
                        </Form.Group>
                            <Button variant="grad" size="lg" className='w-100' onClick={withdraw}>
                            Unstake
                            </Button>
                        </Form>
                    </div>
                </Modal.Body>
            </Modal>
                <div className="card-stack mb-30">
                    <div className="card-stack-inner pb-2">
                        <div className="card-stack-header flex-sm-row flex-column d-flex align-items-center justify-content-sm-between justify-content-center">
                            <div className='mb-sm-0 mb-4 text-sm-start text-center'>
                                <div className="h3 mb-sm-3 mb-2">Single stake(3,3)</div>                      

                                <p><small>{lock == true ? (<>{hour}h:{min}m:{sec}s</>):(<>{0}d:{0}h:{0}m:{0}s</>)} to next rebase</small></p>
                            </div>
                            {/* <button  className='btn m-2 px-sm-5 btn-outline-white'>REBASE</button> */}

                            <div className="clock d-flex align-items-center justify-content-center flex-column">
                                <img src={Clock} className='clock-circle' alt="Clock" />

                                <svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M14 7.59041V8.41262C14 8.51027 13.9779 8.60793 13.9653 8.70874C13.8211 10.1601 13.2212 11.5286 12.2516 12.6182C11.2079 13.8247 9.77661 14.63 8.20359 14.8958C7.94212 14.943 7.67436 14.9682 7.40974 15.0029H6.58753L6.45522 14.9808C6.1402 14.9367 5.82518 14.9115 5.53851 14.8454C3.8984 14.5089 2.44015 13.5789 1.44322 12.2338C0.823699 11.4422 0.38762 10.523 0.166445 9.54238C-0.0547308 8.5618 -0.0554882 7.54435 0.164227 6.56344C0.488479 4.90971 1.41732 3.43615 2.76946 2.43035C4.17144 1.3399 5.94392 0.840255 7.70901 1.03795C9.16385 1.17244 10.5363 1.77356 11.6216 2.75167C12.8245 3.79603 13.6274 5.2258 13.8929 6.79655C13.937 7.05802 13.9653 7.32579 14 7.59041ZM13.0549 8.00309C13.0549 6.80206 12.6987 5.62802 12.0312 4.62953C11.3638 3.63104 10.4151 2.85298 9.30534 2.3938C8.19555 1.93462 6.9745 1.81496 5.79669 2.04995C4.61887 2.28495 3.53723 2.86405 2.68864 3.71396C1.84005 4.56388 1.26263 5.64642 1.02947 6.8246C0.79631 8.00278 0.917875 9.22365 1.37878 10.3327C1.83969 11.4418 2.61923 12.3892 3.61876 13.0551C4.61829 13.721 5.79288 14.0754 6.99391 14.0736C8.60342 14.0711 10.1463 13.4308 11.2847 12.293C12.4231 11.1552 13.0642 9.6126 13.0675 8.00309H13.0549Z" fill="#CF92FF"/>
                                    <path d="M6.53434 8.42469V3.58595C6.52091 3.46939 6.55162 3.35202 6.62042 3.25698C6.68923 3.16193 6.79113 3.0961 6.90606 3.07246C6.97094 3.05878 7.038 3.0592 7.10271 3.07367C7.16741 3.08815 7.22826 3.11635 7.28112 3.15637C7.33399 3.19639 7.37764 3.2473 7.40913 3.30565C7.44062 3.364 7.45921 3.42844 7.46365 3.49459C7.46365 3.54185 7.46365 3.59225 7.46365 3.64265V7.48592H7.62746H10.3902C10.5091 7.469 10.6301 7.49801 10.7284 7.56706C10.8267 7.63611 10.895 7.74002 10.9194 7.85765C10.9324 7.91662 10.9335 7.97757 10.9227 8.03697C10.912 8.09638 10.8895 8.15306 10.8567 8.20374C10.8239 8.25442 10.7814 8.29809 10.7316 8.33223C10.6818 8.36637 10.6257 8.3903 10.5666 8.40264C10.508 8.40901 10.4488 8.40901 10.3902 8.40264C9.14902 8.40264 7.90573 8.40264 6.66035 8.40264L6.53434 8.42469Z" fill="#CF92FF"/>
                                </svg>
                                <p>Next <br />Seigniorage</p>
                                <p>{lock == true ? (<>{hour}h:{min}m:{sec}s</>):(<>{0}h:{0}m:{0}s</>)}</p>
                            </div>
                        </div>
                        <Row className='text-center'>
                            <Col className='mb-3'>
                                <p className='mb-1'>APY</p>
                                <h6 className='mb-0'>523%</h6>
                            </Col>
                            <Col className='mb-3'>
                                <p className='mb-1'>Total Value Deposited</p>
                                <h6 className='mb-0'>{parseInt(totalstake/1000000)} ELEM</h6>
                            </Col>
                            <Col className='mb-3'>
                                <p className='mb-1'>Current Index 
                                <OverlayTrigger
                                    placement="top"
                                    overlay={
                                        <Tooltip id={`tooltip-top`}>
                                            Current Index
                                        </Tooltip>
                                    }
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi ms-2 bi-info-circle" viewBox="0 0 16 16">
                                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                                            <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                                        </svg>
                                </OverlayTrigger>
                                </p>
                                <h6 className='mb-0'>{localStorage.getItem("rebaseCountStake")}</h6>
                            </Col>
                        </Row>
                    </div>
                </div>

                <div className="card-stack mb-30">
                    <div className="card-stack-inner">
                        <div className="text-center py-md-5 py-4">
                            <button onClick={handleShowStake} className='btn m-2 px-sm-5 btn-noshadow btn-grad'>STAKE</button>
                            <button onClick={handleShowUnstake} className='btn m-2 px-sm-5 btn-outline-white'>UNSTAKE</button>
                        </div>

                        <div className="d-flex align-items-center justify-content-between mb-3">
                            <p className=' pe-3'>First time staking ELEM? <br />Please approve APP to use your ELEM for staking.</p>
                            <button  className='btn m-2 px-sm-5 btn-grad' onClick={approve} >Approve</button>
                        </div>

                        {/* <div className="strip mb-60 d-flex">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4 3H20C20.2652 3 20.5196 3.10536 20.7071 3.29289C20.8946 3.48043 21 3.73478 21 4V20C21 20.2652 20.8946 20.5196 20.7071 20.7071C20.5196 20.8946 20.2652 21 20 21H4C3.73478 21 3.48043 20.8946 3.29289 20.7071C3.10536 20.5196 3 20.2652 3 20V4C3 3.73478 3.10536 3.48043 3.29289 3.29289C3.48043 3.10536 3.73478 3 4 3ZM5 5V19H19V5H5ZM11.003 16L6.76 11.757L8.174 10.343L11.003 13.172L16.659 7.515L18.074 8.929L11.003 16Z" fill="white"/>
                            </svg>

                            <p>STAKING ELEM</p>
                        </div> */}

                        {/* <div className="mb-2">
                            <div className="d-flex text-uppercase justify-content-between align-items-center">
                                <h6 className='mb-1 pe-3'>Unstaked Balance</h6>
                                <h6 className='mb-1 text-end'>0.0000 ELEM</h6>
                            </div>
                        </div> */}
                        <div className="mb-2">
                            <div className="d-flex mb-2 text-uppercase justify-content-between align-items-center">
                                <h6 className='mb-1 pe-3 d-flex align-items-center text-nowrap'>Staked Balance
                                {/* <svg width="14" height="8" viewBox="0 0 14 8" className='ms-3' fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6.95384 5.172L2.00384 0.222L0.589844 1.636L6.95384 8L13.3178 1.636L11.9038 0.222L6.95384 5.172Z" fill="white"/>
                                </svg> */}
                                </h6>
                                <h6 className='mb-1 text-end'>{stakedbalance/1000000} ELEM</h6>
                            </div>
                            {/* <div className="px-2 mb-1 d-flex justify-content-between align-items-center">
                                <p className='mb-1 pe-3'>Single Staking</p>
                                <p className='mb-1 text-end'>0.0000sELEM</p>
                            </div>
                            <div className="px-2 mb-1 d-flex justify-content-between align-items-center">
                                <p className='mb-1 pe-3'>Wrapped Balance</p>
                                <p className='mb-1 text-end'>0.0000 gELEM</p>
                            </div> */}
                        </div>

                        <hr />

                        <div className="mb-2">
                            <div className="d-flex text-uppercase justify-content-between align-items-center">
                                <h6 className='mb-1 pe-3'>Reward Amount </h6>
                                <h6 className='mb-1 text-end'>{rewardcalc} ELEM</h6>
                            </div>
                        </div>
                        {/* <div className="mb-2">
                            <div className="d-flex text-uppercase justify-content-between align-items-center">
                                <h6 className='mb-1 pe-3'>Next Reward Yield </h6>
                                <h6 className='mb-1 text-end'>0.3654%</h6>
                            </div>
                        </div>
                        <div className="mb-2">
                            <div className="d-flex text-uppercase justify-content-between align-items-center">
                                <h6 className='mb-1 pe-3'>ROI (5-Day Rate) </h6>
                                <h6 className='mb-1 text-end'>5.6240%</h6>
                            </div>
                        </div> */}
                        {/* <center>
                        <button  className='btn m-2 px-sm-5 btn-noshadow btn-grad'>CLAIM REWARD</button>
                        </center> */}
                    </div>
                </div>
            </Container>
        </Layout>
    );
};

export default Dashboard;
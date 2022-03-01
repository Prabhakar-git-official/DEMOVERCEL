import React from 'react';
import {Container, Navbar, Nav, Badge, Dropdown} from 'react-bootstrap';
import {
    NavLink as Link
  } from "react-router-dom";
import { useState } from "react";
import axios from "axios"
import { useEffect } from "react";
import Logo from '../../assets/images/logo.png';
import colorLogo from '../../assets/images/sidebar-logo.png'
import url from "../../configurl"
//import web3 from '/web3';
import web3 from '../../web3';


function Header() {
    const[walletconnect,setwalletconnect]=useState();
    const [isOpen, setIsOpen] = useState(false);
    var[dis,setDis] = useState("");
    console.log("checkwalletconnect",walletconnect);
    var s = localStorage.getItem("walletAddress");
    if(s === 'undefined'){
        localStorage.setItem("walletAddress","");
    }
    console.log("storage",s)
    const connectWallet = async () => {
        try {
            const networkid=await web3.eth.getChainId();
            console.log("network id",networkid);
            if(networkid!=4){
            setIsOpen(true);
            setDis("Connected to Wrong Network,Please connect to Binance Mainnet");
            }else{
    
            
            window.ethereum.enable();  
            
            let accounts=await web3.eth.getAccounts();
           // web3.eth.getChainId().then(console.log);
           // const networkid=await web3.eth.getChainId();
           // console.log("network id",networkid);
            await web3.eth.getAccounts().then(()=>{          
                console.log("acc Binance",accounts[0])
                setwalletconnect(accounts[0])
                window.wallet=accounts[0];
               
               localStorage.setItem("walletAddress",accounts[0])
               //sessionStorage.setItem("wallet", accounts[0]);
              }).then(()=>{
                  window.location.reload()
              })
            console.log(accounts);
            }  
        } catch (err) {
          console.error(err);
        }
      };
      const [showButton, setShowButton] = useState(true);
      let walletAddress = localStorage.getItem("walletAddress");
      const wallet = async() => {
        let v = localStorage.getItem("walletAddress");
        if(v){
          setShowButton(false)
        }
        else{
          setShowButton(true)
        }
      }
      useEffect(() =>{wallet()},[localStorage.getItem("walletAddress"),showButton])
    
     
    
      const Disconnect = async() => {
        localStorage.setItem("walletAddress","")
        window.location.reload()
         
        setShowButton(true)
      }

    return (
        <>
            <header className="header">
                <Navbar expand="xl" className='p-0'>
                    <Container fluid="lg">
                        <Navbar.Brand href="/" className='d-xl-none'><img src={colorLogo} alt="logo" /></Navbar.Brand>
                        <Navbar.Toggle aria-controls="basic-navbar-nav">
                            <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M16.9214 18.6127V20.6127H5.92139V18.6127H16.9214ZM21.9214 11.6127V13.6127H3.92139V11.6127H21.9214ZM19.9214 4.61267V6.61267H8.92139V4.61267H19.9214Z" fill="white"/>
                            </svg>
                        </Navbar.Toggle>
                        <Navbar.Collapse id="basic-navbar-nav">
                            <div className="d-flex mb-4 d-xl-none align-items-center justify-content-between">
                                <Navbar.Brand href="/"><img src={colorLogo} alt="logo" /></Navbar.Brand>

                                <Navbar.Toggle aria-controls="basic-navbar-nav">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="#fff" class="bi bi-x-lg" viewBox="0 0 16 16">
                                        <path fill-rule="evenodd" d="M13.854 2.146a.5.5 0 0 1 0 .708l-11 11a.5.5 0 0 1-.708-.708l11-11a.5.5 0 0 1 .708 0Z"/>
                                        <path fill-rule="evenodd" d="M2.146 2.146a.5.5 0 0 0 0 .708l11 11a.5.5 0 0 0 .708-.708l-11-11a.5.5 0 0 0-.708 0Z"/>
                                    </svg>
                                </Navbar.Toggle>
                            </div>
                            <div className="navbar-controls ms-lg-auto order-xl-2 d-flex align-items-center">

                                { showButton ? 
                                <button className='btn me-3 btn-grad' onClick={()=>connectWallet()}>Connect wallet</button>
                                : <>
                                {/* <button className='btn me-3 btn-grad' onClick={()=>connectWallet()}>{(localStorage.getItem("walletAddress")).substring(0, 4)}...{(localStorage.getItem("walletAddress")).substring((localStorage.getItem("walletAddress")).length -4, (localStorage.getItem("walletAddress")).length)}</button><br /> */}
                                {/* <button className='btn me-3 btn-grad' onClick={() =>Disconnect()}>Disconnect</button> */}
                            
                                <Dropdown>
                                    <Dropdown.Toggle variant="grad" className='dropdown-noarrow' id="dropdown-basic">
                                    {(localStorage.getItem("walletAddress")).substring(0, 4)}...{(localStorage.getItem("walletAddress")).substring((localStorage.getItem("walletAddress")).length -4, (localStorage.getItem("walletAddress")).length)}
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu className="dropdown-menu-end dropdown-menu-setting p-3">
                                        <div className="dropdown-menu-header mb-3">
                                            <h6 className='mb-0'>{(localStorage.getItem("walletAddress")).substring(0, 4)}...{(localStorage.getItem("walletAddress")).substring((localStorage.getItem("walletAddress")).length -4, (localStorage.getItem("walletAddress")).length)}</h6>
                                            <p className='text-gray'><small>17 assets</small></p>
                                        </div>

                                        <div className="card p-2 dropdown-menu-card mb-3">
                                            <Link to="/" className="d-flex align-items-center">
                                                <svg width="31" height="30" viewBox="0 0 31 30" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="30.1212" height="30" rx="15" fill="#FA84B5"></rect><path d="M21.943 11.2538C21.4418 12.1245 20.965 12.8983 20.5494 13.6964C20.4394 13.914 20.3905 14.2284 20.4516 14.4582C21.1117 16.9612 21.7963 19.4642 22.4686 21.9671C22.5053 22.1122 22.542 22.2694 22.5909 22.4871C21.8452 22.4871 21.1728 22.5113 20.4883 22.4629C20.366 22.4508 20.1826 22.2211 20.146 22.0518C19.6937 20.4678 19.278 18.8837 18.8379 17.2997C18.8013 17.1788 18.7646 17.0579 18.7035 16.8644C18.5446 17.1304 18.4223 17.3239 18.3001 17.5295C17.4077 19.0651 16.5031 20.5887 15.6107 22.1364C15.464 22.3904 15.3051 22.4992 14.9994 22.4871C14.2904 22.4629 13.5814 22.475 12.7746 22.475C12.8968 22.2453 12.9824 22.076 13.0802 21.9067C14.596 19.307 16.0997 16.7193 17.6277 14.1317C17.7989 13.8415 17.8478 13.5997 17.75 13.2732C17.5055 12.463 17.2977 11.6287 17.0409 10.6976C16.9065 10.9274 16.8087 11.0725 16.7231 11.2176C14.6083 14.833 12.5056 18.4364 10.403 22.0639C10.2197 22.3904 10.0118 22.5113 9.63289 22.4992C8.96054 22.4629 8.27597 22.4871 7.53027 22.4871C7.64029 22.2694 7.72587 22.1122 7.81144 21.9671C10.5375 17.2997 13.2636 12.6444 15.9652 7.97698C16.173 7.61423 16.393 7.46913 16.8087 7.50541C17.2488 7.54168 17.6888 7.52959 18.1289 7.50541C18.4345 7.49331 18.5812 7.57796 18.6668 7.90443C18.9113 8.88387 19.2047 9.8633 19.4614 10.8427C19.5347 11.145 19.6692 11.2659 19.9871 11.2538C20.5983 11.2297 21.2217 11.2538 21.943 11.2538Z" fill="black"></path></svg>
                                                <span className='ms-2'>
                                                    <h6 className='m-0'>ETH</h6>
                                                    <p className='text-gray'><small>$eth</small></p>
                                                </span>
                                            </Link>
                                            <Link to="/" className="d-flex align-items-center">
                                                <svg width="31" height="30" viewBox="0 0 31 30" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="30.1212" height="30" rx="15" fill="#FA84B5"></rect><path d="M21.943 11.2538C21.4418 12.1245 20.965 12.8983 20.5494 13.6964C20.4394 13.914 20.3905 14.2284 20.4516 14.4582C21.1117 16.9612 21.7963 19.4642 22.4686 21.9671C22.5053 22.1122 22.542 22.2694 22.5909 22.4871C21.8452 22.4871 21.1728 22.5113 20.4883 22.4629C20.366 22.4508 20.1826 22.2211 20.146 22.0518C19.6937 20.4678 19.278 18.8837 18.8379 17.2997C18.8013 17.1788 18.7646 17.0579 18.7035 16.8644C18.5446 17.1304 18.4223 17.3239 18.3001 17.5295C17.4077 19.0651 16.5031 20.5887 15.6107 22.1364C15.464 22.3904 15.3051 22.4992 14.9994 22.4871C14.2904 22.4629 13.5814 22.475 12.7746 22.475C12.8968 22.2453 12.9824 22.076 13.0802 21.9067C14.596 19.307 16.0997 16.7193 17.6277 14.1317C17.7989 13.8415 17.8478 13.5997 17.75 13.2732C17.5055 12.463 17.2977 11.6287 17.0409 10.6976C16.9065 10.9274 16.8087 11.0725 16.7231 11.2176C14.6083 14.833 12.5056 18.4364 10.403 22.0639C10.2197 22.3904 10.0118 22.5113 9.63289 22.4992C8.96054 22.4629 8.27597 22.4871 7.53027 22.4871C7.64029 22.2694 7.72587 22.1122 7.81144 21.9671C10.5375 17.2997 13.2636 12.6444 15.9652 7.97698C16.173 7.61423 16.393 7.46913 16.8087 7.50541C17.2488 7.54168 17.6888 7.52959 18.1289 7.50541C18.4345 7.49331 18.5812 7.57796 18.6668 7.90443C18.9113 8.88387 19.2047 9.8633 19.4614 10.8427C19.5347 11.145 19.6692 11.2659 19.9871 11.2538C20.5983 11.2297 21.2217 11.2538 21.943 11.2538Z" fill="black"></path></svg>
                                                <span className='ms-2'>
                                                    <h6 className='m-0'>ETH</h6>
                                                    <p className='text-gray'><small>$ALGO</small></p>
                                                </span>
                                            </Link>
                                            <Link to="/" className="d-flex align-items-center">
                                                <svg width="31" height="30" viewBox="0 0 31 30" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="30.1212" height="30" rx="15" fill="#FA84B5"></rect><path d="M21.943 11.2538C21.4418 12.1245 20.965 12.8983 20.5494 13.6964C20.4394 13.914 20.3905 14.2284 20.4516 14.4582C21.1117 16.9612 21.7963 19.4642 22.4686 21.9671C22.5053 22.1122 22.542 22.2694 22.5909 22.4871C21.8452 22.4871 21.1728 22.5113 20.4883 22.4629C20.366 22.4508 20.1826 22.2211 20.146 22.0518C19.6937 20.4678 19.278 18.8837 18.8379 17.2997C18.8013 17.1788 18.7646 17.0579 18.7035 16.8644C18.5446 17.1304 18.4223 17.3239 18.3001 17.5295C17.4077 19.0651 16.5031 20.5887 15.6107 22.1364C15.464 22.3904 15.3051 22.4992 14.9994 22.4871C14.2904 22.4629 13.5814 22.475 12.7746 22.475C12.8968 22.2453 12.9824 22.076 13.0802 21.9067C14.596 19.307 16.0997 16.7193 17.6277 14.1317C17.7989 13.8415 17.8478 13.5997 17.75 13.2732C17.5055 12.463 17.2977 11.6287 17.0409 10.6976C16.9065 10.9274 16.8087 11.0725 16.7231 11.2176C14.6083 14.833 12.5056 18.4364 10.403 22.0639C10.2197 22.3904 10.0118 22.5113 9.63289 22.4992C8.96054 22.4629 8.27597 22.4871 7.53027 22.4871C7.64029 22.2694 7.72587 22.1122 7.81144 21.9671C10.5375 17.2997 13.2636 12.6444 15.9652 7.97698C16.173 7.61423 16.393 7.46913 16.8087 7.50541C17.2488 7.54168 17.6888 7.52959 18.1289 7.50541C18.4345 7.49331 18.5812 7.57796 18.6668 7.90443C18.9113 8.88387 19.2047 9.8633 19.4614 10.8427C19.5347 11.145 19.6692 11.2659 19.9871 11.2538C20.5983 11.2297 21.2217 11.2538 21.943 11.2538Z" fill="black"></path></svg>
                                                <span className='ms-2'>
                                                    <h6 className='m-0'>ETH</h6>
                                                    <p className='text-gray'><small>$eth</small></p>
                                                </span>
                                            </Link>
                                           
                                        </div>
                                        <Dropdown.Item className='d-flex align-items-center p-2 rounded' href="#"> 
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi me-2 bi-download" viewBox="0 0 16 16">
                                                <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                                                <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
                                            </svg>
                                            Redeem excess amounts</Dropdown.Item>
                                        <Dropdown.Item className='d-flex align-items-center p-2 rounded' href="#/action-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi me-2 bi-person" viewBox="0 0 16 16">
                                                <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/>
                                            </svg>
                                            Account</Dropdown.Item>
                                        <Dropdown.Item className='d-flex align-items-center p-2 rounded' href="#/action-3" onClick={() =>Disconnect()}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi me-2 bi-box-arrow-right" viewBox="0 0 16 16">
                                                <path fill-rule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"/>
                                                <path fill-rule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/>
                                            </svg>
                                            Disconnect
                                        </Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                                </>
                                }
                            </div>

                            <Nav className="mx-auto d-lg-none">
                                <Link className='nav-link' to="/dashboard" activeClassName="active">
                                    <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M13 21.5V11.5H21V21.5H13ZM3 13.5V3.5H11V13.5H3ZM9 11.5V5.5H5V11.5H9ZM3 21.5V15.5H11V21.5H3ZM5 19.5H9V17.5H5V19.5ZM15 19.5H19V13.5H15V19.5ZM13 3.5H21V9.5H13V3.5ZM15 5.5V7.5H19V5.5H15Z" fill="white"/>
                                    </svg>
                                    Dashboard
                                </Link>
                                <Link className='nav-link' to="/bond" activeClassName="active">
                                    <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12 2.5C17.523 2.5 22 6.977 22 12.5C22 18.023 17.523 22.5 12 22.5C6.477 22.5 2 18.023 2 12.5C2 6.977 6.477 2.5 12 2.5ZM12 4.5C9.87827 4.5 7.84344 5.34285 6.34315 6.84315C4.84285 8.34344 4 10.3783 4 12.5C4 14.6217 4.84285 16.6566 6.34315 18.1569C7.84344 19.6571 9.87827 20.5 12 20.5C14.1217 20.5 16.1566 19.6571 17.6569 18.1569C19.1571 16.6566 20 14.6217 20 12.5C20 10.3783 19.1571 8.34344 17.6569 6.84315C16.1566 5.34285 14.1217 4.5 12 4.5ZM16 13.5V15.5H8V13.5H16ZM16 9.5V11.5H8V9.5H16Z" fill="white"/>
                                    </svg>
                                    Bond
                                </Link>
                                <Link className='nav-link' to="/single-stake" activeClassName="active">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M20.0829 15.1998L21.2849 15.9208C21.359 15.9652 21.4204 16.0281 21.463 16.1033C21.5056 16.1784 21.528 16.2634 21.528 16.3498C21.528 16.4363 21.5056 16.5212 21.463 16.5964C21.4204 16.6716 21.359 16.7344 21.2849 16.7788L12.5149 22.0408C12.3593 22.1343 12.1813 22.1836 11.9999 22.1836C11.8184 22.1836 11.6404 22.1343 11.4849 22.0408L2.71485 16.7788C2.6407 16.7344 2.57932 16.6716 2.5367 16.5964C2.49408 16.5212 2.47168 16.4363 2.47168 16.3498C2.47168 16.2634 2.49408 16.1784 2.5367 16.1033C2.57932 16.0281 2.6407 15.9652 2.71485 15.9208L3.91685 15.1998L11.9999 20.0498L20.0829 15.1998ZM20.0829 10.4998L21.2849 11.2208C21.359 11.2652 21.4204 11.3281 21.463 11.4033C21.5056 11.4784 21.528 11.5634 21.528 11.6498C21.528 11.7363 21.5056 11.8212 21.463 11.8964C21.4204 11.9716 21.359 12.0344 21.2849 12.0788L11.9999 17.6498L2.71485 12.0788C2.6407 12.0344 2.57932 11.9716 2.5367 11.8964C2.49408 11.8212 2.47168 11.7363 2.47168 11.6498C2.47168 11.5634 2.49408 11.4784 2.5367 11.4033C2.57932 11.3281 2.6407 11.2652 2.71485 11.2208L3.91685 10.4998L11.9999 15.3498L20.0829 10.4998ZM12.5139 1.30883L21.2849 6.57083C21.359 6.61522 21.4204 6.67807 21.463 6.75326C21.5056 6.82845 21.528 6.9134 21.528 6.99983C21.528 7.08625 21.5056 7.1712 21.463 7.24639C21.4204 7.32158 21.359 7.38443 21.2849 7.42883L11.9999 12.9998L2.71485 7.42883C2.6407 7.38443 2.57932 7.32158 2.5367 7.24639C2.49408 7.1712 2.47168 7.08625 2.47168 6.99983C2.47168 6.9134 2.49408 6.82845 2.5367 6.75326C2.57932 6.67807 2.6407 6.61522 2.71485 6.57083L11.4849 1.30883C11.6404 1.21538 11.8184 1.16602 11.9999 1.16602C12.1813 1.16602 12.3593 1.21538 12.5149 1.30883H12.5139ZM11.9999 3.33183L5.88685 6.99983L11.9999 10.6678L18.1129 6.99983L11.9999 3.33183Z" fill="white"/>
                                    </svg>
                                    Stake
                                </Link>
                                <Link className='nav-link' to="/forum" activeClassName="active">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M6.455 19L2 22.5V4C2 3.73478 2.10536 3.48043 2.29289 3.29289C2.48043 3.10536 2.73478 3 3 3H21C21.2652 3 21.5196 3.10536 21.7071 3.29289C21.8946 3.48043 22 3.73478 22 4V18C22 18.2652 21.8946 18.5196 21.7071 18.7071C21.5196 18.8946 21.2652 19 21 19H6.455ZM5.763 17H20V5H4V18.385L5.763 17ZM8 10H16V12H8V10Z" fill="white"/>
                                    </svg>
                                    Forum
                                </Link>
                                <Link className='nav-link' to="/governance" activeClassName="active">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M14 14.252V16.342C13.0949 16.022 12.1263 15.9239 11.1754 16.0558C10.2245 16.1877 9.3192 16.5459 8.53543 17.1002C7.75166 17.6545 7.11234 18.3888 6.67116 19.2414C6.22998 20.094 5.99982 21.04 6 22L4 21.999C3.99969 20.7779 4.27892 19.5729 4.8163 18.4764C5.35368 17.3799 6.13494 16.4209 7.10022 15.673C8.0655 14.9251 9.18918 14.4081 10.3852 14.1616C11.5811 13.9152 12.8177 13.9457 14 14.251V14.252ZM12 13C8.685 13 6 10.315 6 7C6 3.685 8.685 1 12 1C15.315 1 18 3.685 18 7C18 10.315 15.315 13 12 13ZM12 11C14.21 11 16 9.21 16 7C16 4.79 14.21 3 12 3C9.79 3 8 4.79 8 7C8 9.21 9.79 11 12 11ZM18 17V14H20V17H23V19H20V22H18V19H15V17H18Z" fill="white"/>
                                    </svg>
                                    Governance</Link>
                                <Link className='nav-link' to="/docs" activeClassName="active">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M9.00002 2.003V2H19.998C20.55 2 21 2.455 21 2.992V21.008C20.9998 21.2712 20.895 21.5235 20.7088 21.7095C20.5226 21.8955 20.2702 22 20.007 22H3.99302C3.8617 21.9991 3.73185 21.9723 3.61087 21.9212C3.48989 21.8701 3.38017 21.7957 3.28796 21.7022C3.19575 21.6087 3.12286 21.4979 3.07346 21.3762C3.02406 21.2545 2.9991 21.1243 3.00002 20.993V8L9.00002 2.003ZM5.83002 8H9.00002V4.83L5.83002 8ZM11 4V9C11 9.26522 10.8947 9.51957 10.7071 9.70711C10.5196 9.89464 10.2652 10 10 10H5.00002V20H19V4H11Z" fill="white"/>
                                    </svg>
                                    Docs
                                </Link>
                                <Link className='nav-link' to="/bug-bounty" activeClassName="active">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M10.562 4.14787C11.5104 3.94967 12.4896 3.94967 13.438 4.14787L15.121 2.46387L16.536 3.87887L15.486 4.92887C16.7223 5.64066 17.7129 6.71175 18.326 7.99987H21V9.99987H18.93C18.976 10.3269 19 10.6599 19 10.9999V11.9999H21V13.9999H19V14.9999C19 15.3399 18.976 15.6729 18.93 15.9999H21V17.9999H18.326C17.7586 19.1975 16.8629 20.2095 15.7431 20.9181C14.6232 21.6267 13.3252 22.0029 12 22.0029C10.6748 22.0029 9.37677 21.6267 8.25692 20.9181C7.13707 20.2095 6.24138 19.1975 5.674 17.9999H3V15.9999H5.07C5.023 15.6686 4.99961 15.3344 5 14.9999V13.9999H3V11.9999H5V10.9999C5 10.6599 5.024 10.3269 5.07 9.99987H3V7.99987H5.674C6.28697 6.71138 7.27751 5.63993 8.514 4.92787L7.464 3.87787L8.88 2.46487L10.563 4.14887L10.562 4.14787ZM12 5.99987C10.6739 5.99987 9.40215 6.52665 8.46447 7.46433C7.52678 8.40202 7 9.67379 7 10.9999V14.9999C7 16.3259 7.52678 17.5977 8.46447 18.5354C9.40215 19.4731 10.6739 19.9999 12 19.9999C13.3261 19.9999 14.5979 19.4731 15.5355 18.5354C16.4732 17.5977 17 16.3259 17 14.9999V10.9999C17 9.67379 16.4732 8.40202 15.5355 7.46433C14.5979 6.52665 13.3261 5.99987 12 5.99987ZM9 13.9999H15V15.9999H9V13.9999ZM9 9.99987H15V11.9999H9V9.99987Z" fill="white"/>
                                    </svg>
                                    Bug Bounty
                                </Link>
                            </Nav>
                        </Navbar.Collapse>
                    </Container>
                    </Navbar>
            </header>
        </>
    );
}

export default Header;
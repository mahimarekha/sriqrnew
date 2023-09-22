import React, { useState } from "react";
import { Grid, CircularProgress, Typography,Tabs,Tab,TextField,Fade,} from "@material-ui/core";
import {Button} from "@material-ui/core";
import { loginUser } from "../../context/UserContext";
import { withRouter } from "react-router-dom";
import useStyles from "./styles";
import SRI from './images/SRI.jpg';
import Footer from "../../pages/home/Footer"
import CachedIcon from '@material-ui/icons/Cached';
import PhonelinkLockIcon from '@material-ui/icons/PhonelinkLock';
import PaymentIcon from '@material-ui/icons/Payment';
// import PaymentsIcon from '@material-ui/icons/Payments';
// import CleaningServicesIcon from '@material-ui/icons/CleaningServices';
import AcUnitIcon from '@material-ui/icons/AcUnit';
import phone from './images/phone.png';
import {Link} from "react-router-dom";
import { useUserDispatch,  } from "../../context/UserContext";
import './styles/bootstrap.min.css';
import './styles/animate.css';

import './styles/tiny-slider.css';

import './styles/glightbox.min.css';
import './styles/main.css';



function Header(props) {

  var classes = useStyles();
  var userDispatch = useUserDispatch();
  var [isLoading, setIsLoading] = useState(false);
  var [error, setError] = useState(null);
  var [activeTabId, setActiveTabId] = useState(0);
  var [loginValue, setLoginValue] = useState("");
  var [passwordValue, setPasswordValue] = useState("");
  var [roleValue, setRoleValue] = useState("");
  const [isOpen, setIsOpen] = React.useState(false);
  const toggleNavbar = () => {
    
    setIsOpen(!isOpen);
  };
  const handleOpen = () => {
    props.history.push('/sriqr/login') 
};
const handleChange=()=>{
    props.history.push('/sriqr/profileregistration') 
}
  return (
  
    <>
    <header class="header navbar-area sticky">
        <div class="container">
            <div class="row align-items-center">
                <div class="col-lg-12">
                    <div class="nav-inner">
                       
                        <nav class="navbar navbar-expand-lg">
                            <a class="navbar-brand" href="index.html">
                                {/* <img src="assets/images/logo/white-logo.svg" alt="Logo"/> */}
                                <img src={SRI} alt="some example image" style={{height:"70px", width:"70px"}}/>
                                {/* <img src="home/images/SRIQR.COM LOGO JPG.jpg" alt="Sriqr.com"/> */}

                            </a>
                            <button class="navbar-toggler mobile-menu-btn" onClick={toggleNavbar} type="button" data-bs-toggle="collapse"
                                data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                                aria-expanded="false" aria-label="Toggle navigation">
                                <span class="toggler-icon"></span>
                                <span class="toggler-icon"></span>
                                <span class="toggler-icon"></span>
                            </button>
                            {isOpen? <div class=" navbar-collapse sub-menu-bar" id="navbarSupportedContent">
                                        <ul id="nav" class="navbar-nav ms-auto">
                                            <li class="nav-item">
                                                <a href="#home" class="page-scroll active"
                                                    aria-label="Toggle navigation">Home</a>
                                            </li>
                                            <li class="nav-item">
                                <a href="javascript:void(0)" onClick={handleOpen} class="page-scroll active"> Admin Login</a>
                            </li>
                            <li class="nav-item">
                                                <a href="javascript:void(0)" onClick={handleChange}  class="page-scroll active"
                                                    aria-label="Toggle navigation">Profile Registration</a>
                                            </li>
                            
                                        </ul>
                                    </div>:<div class="collapse navbar-collapse sub-menu-bar" id="navbarSupportedContent">
                                        <ul id="nav" class="navbar-nav ms-auto">
                                            <div class="nav-item">
                                                <a href="#home" class="page-scroll active"
                                                    aria-label="Toggle navigation">Home</a>
                                            </div>
                                            <div class="nav-item">
                                            <a href="javascript:void(0)" onClick={handleOpen} class="page-scroll active"> Admin Login</a>
                                            </div>
                                            <div class="nav-item">
                                                <a href="javascript:void(0)" onClick={handleChange} class="page-scroll active"
                                                    aria-label="Toggle navigation">Profile Registration</a>
                                            </div>
                                        </ul>
                                    </div>}
                            {/* <div class="button add-list-button">
                                <a href="javascript:void(0)" onClick={handleOpen} class="btn">gg Admin Login</a>
                            </div> */}
                        </nav>
                        
                    </div>
                </div>
            </div> 
        </div> 
    </header>
    </>
  );
}

export default withRouter(Header);
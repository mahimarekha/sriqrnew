import React, { useState } from "react";
import { Grid, CircularProgress, Typography,Tabs,Tab,TextField,Fade,} from "@material-ui/core";
import {Button} from "@material-ui/core";
import { loginUser } from "../../context/UserContext";
import { withRouter } from "react-router-dom";
import useStyles from "./styles";
import SRI from './images/SRI.jpg';
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



function Footer(props) {

  var classes = useStyles();
  var userDispatch = useUserDispatch();
  var [isLoading, setIsLoading] = useState(false);
  var [error, setError] = useState(null);
  var [activeTabId, setActiveTabId] = useState(0);
  var [loginValue, setLoginValue] = useState("");
  var [passwordValue, setPasswordValue] = useState("");
  var [roleValue, setRoleValue] = useState("");
  const handleOpen = () => {
    props.history.push('/app/studentregistration/add') 
};
  return (
  
    <>
    
    <footer class="footer">
      
        <div class="footer-top">
            <div class="container">
            <p style={{textAlign: "center"}}>Copyright © 2012 - 2029 SriQR.com All rights reserved.</p>
            </div>
        </div>
       
    </footer>
    </>
  );
}

export default withRouter(Footer);

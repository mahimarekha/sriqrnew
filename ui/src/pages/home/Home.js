import React, { useState } from "react";
import { Grid, CircularProgress, Typography, Tabs, Tab, TextField, Fade, } from "@material-ui/core";
import { Button } from "@material-ui/core";
import { loginUser } from "../../context/UserContext";
import { withRouter } from "react-router-dom";
// import useStyles from "./styles";
import {  makeStyles } from '@material-ui/core/styles';
import Footer from "../../pages/home/Footer"
import MailIcon from '@material-ui/icons/Mail';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, InputLabel, MenuItem,
    TableRow, Table,
    TableHead,
    TableBody,
    TableCell
  } from "@material-ui/core";
import ParkService from "../dashboard/Locality/Service/parkService";
  import { Card, Box, Select } from "@material-ui/core";
import PhoneIcon from '@material-ui/icons/Phone';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import SRI from './images/SRI.jpg';
import CachedIcon from '@material-ui/icons/Cached';
import PhonelinkLockIcon from '@material-ui/icons/PhonelinkLock';
import PaymentIcon from '@material-ui/icons/Payment';
// import PaymentsIcon from '@material-ui/icons/Payments';
// import CleaningServicesIcon from '@material-ui/icons/CleaningServices';
import AcUnitIcon from '@material-ui/icons/AcUnit';
import home from './images/home.jpg';
import { Link } from "react-router-dom";
import { useUserDispatch, } from "../../context/UserContext";
import './styles/bootstrap.min.css';
import './styles/animate.css';
import { useContext, useEffect } from 'react';
import './styles/tiny-slider.css';

import './styles/glightbox.min.css';
import './styles/main.css';
const useStyles = makeStyles((theme) => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 200,
    },
}));


function Home(props) {
    const [age, setAge] = React.useState('');
    var classes = useStyles();
    var userDispatch = useUserDispatch();
    const [parkList, setParkList] = useState([]);
    const [parkId, setParkId] = useState("");
    var [isLoading, setIsLoading] = useState(false); 
    var [error, setError] = useState(null);
    var [activeTabId, setActiveTabId] = useState(0);
    var [loginValue, setLoginValue] = useState("");
    var [passwordValue, setPasswordValue] = useState("");
    var [roleValue, setRoleValue] = useState("");
    const handleOpen = () => {
        props.history.push('/sriqr/login')
    };
    useEffect(() => {
         getParkList();
        return () => {
            setParkList([]);
        }
    }, []);
    const getParkList = () => {
        ParkService.getAllPark().then((res) => {
            setParkList(res);
            
        }).catch((err) => {
            // setError(err.message);
        });
    }
    const handleRedirect = () => {
        debugger
        props.history.push("ticketbooking/"+parkId)    
      };
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
                                        <img src={SRI} alt="some example image" style={{ height: "70px", width: "70px" }} />
                                        {/* <img src="home/images/SRIQR.COM LOGO JPG.jpg" alt="Sriqr.com"/> */}

                                    </a>
                                    <button class="navbar-toggler mobile-menu-btn" type="button" data-bs-toggle="collapse"
                                        data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                                        aria-expanded="false" aria-label="Toggle navigation">
                                        <span class="toggler-icon"></span>
                                        <span class="toggler-icon"></span>
                                        <span class="toggler-icon"></span>
                                    </button>
                                    <div class="collapse navbar-collapse sub-menu-bar" id="navbarSupportedContent">
                                        <ul id="nav" class="navbar-nav ms-auto">
                                            <li class="nav-item">
                                                <a href="#home" class="page-scroll active"
                                                    aria-label="Toggle navigation">Home</a>
                                            </li>
                                            {/* <li class="nav-item">
                                        <a href="#features" class="page-scroll"
                                            aria-label="Toggle navigation">Features</a>
                                    </li> */}
                                            {/* <li class="nav-item">
                                                <a href="javascript:void(0)" aria-label="Toggle navigation">Ticket Booking</a>
                                            </li> */}
                                            {/* <li class="nav-item">
                                        <a href="#pricing" class="page-scroll"
                                            aria-label="Toggle navigation">Pricing</a>
                                    </li> */}
                                            {/* <li class="nav-item">
                                        <a href="javascript:void(0)" aria-label="Toggle navigation">Team</a>
                                    </li>
                                    <li class="nav-item">
                                        <a class="dd-menu collapsed" href="javascript:void(0)" data-bs-toggle="collapse"
                                            data-bs-target="#submenu-1-4" aria-controls="navbarSupportedContent"
                                            aria-expanded="false" aria-label="Toggle navigation">Blog</a>
                                        <ul class="sub-menu collapse" id="submenu-1-4">
                                            <li class="nav-item"><a href="javascript:void(0)">Blog Grid Sidebar</a>
                                            </li>
                                            <li class="nav-item"><a href="javascript:void(0)">Blog Single</a></li>
                                            <li class="nav-item"><a href="javascript:void(0)">Blog Single
                                                    Sibebar</a></li>
                                        </ul>
                                    </li>
                                    <li class="nav-item">
                                        <a href="javascript:void(0)"  aria-label="Toggle navigation">Contact</a>
                                    </li> */}
                                        </ul>
                                    </div>
                                    <div class="button add-list-button">
                                        <a href="javascript:void(0)" onClick={handleOpen} class="btn">Admin Login</a>
                                    </div>
                                </nav>

                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <section id="home" class="hero-area">
                <div class="container">
                    <div class="row align-items-center">
                        <div class="col-lg-5 col-md-12 col-12">
                            <div class="hero-content">
                                <h1 class="wow fadeInLeft" data-wow-delay=".4s">SriQR.com</h1>
                                <p class="wow fadeInLeft" data-wow-delay=".6s">No Que With QR Code.</p>
                                 <Grid item xs={6}>
                                    <div style={{ width: 370 }}>
                                        <FormControl className={classes.formControl} fullWidth="true"
                                        >
                                            <InputLabel id="demo-simple-select-label">Select Park</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                name="parkId"
                                                label="Select Park"
                                                // value={formik.values.parkId}
                                                onChange={(e) => setParkId(e.target.value)}
                                                
                                                // error={formik.touched.parkId && Boolean(formik.errors.parkId)}
                                                // helperText={formik.touched.parkId && formik.errors.parkId}
                                            >
                                                <MenuItem value="">
                                                    <em>None</em>
                                                </MenuItem>

                                                {parkList.map(({ _id, parkName }) => (
                                    <MenuItem key={_id} value={_id}>{parkName}
                                        
                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </div>
                                </Grid> 
                                <div class="button wow fadeInLeft" data-wow-delay=".8s">
                                   
                                    <a href="javascript:void(0)" class="btn" onClick={handleRedirect}><i class="lni lni-apple"></i> Book Your Ticket</a>
                                    {/* <a href="javascript:void(0)" class="btn btn-alt"><i class="lni lni-play-store"></i> Google
                                Play</a> */}
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-7 col-md-12 col-12">
                            <div class="hero-image wow fadeInRight" data-wow-delay=".4s">
                                {/* <img src="assets/images/hero/phone.png" alt="#"/> */}
                                <img src={home} alt="some example image" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section id="features" class="features section">
                <div class="container">
                    <div class="row">
                        <div class="col-12">
                            <div class="section-title">
                                <h3 class="wow zoomIn" data-wow-delay=".2s">Digitalization</h3>
                                {/* <h2 class="wow fadeInUp" data-wow-delay=".4s">Your Experience Gets Better And Better Over Time.
                        </h2> */}
                                <p class="wow fadeInUp" data-wow-delay=".6s">
                                    Sriqr.com makes it a simple, process of entry into parks, events, parking, Cloakrooms process, Diagnostic centre, gym management. Besides reports, Analytics, feedback and consultancy for upgrading services are also provided.</p>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        {/* <div class="col-lg-4 col-md-6 col-12">
                   
                    <div class="single-feature wow fadeInUp" data-wow-delay=".2s">
                        <i class="lni lni-cloud-upload"></i>
                        <h3>Introduction</h3>
                        <p>Sriqr.com makes it a simple, process of entry into parks, events, parking, Cloakrooms process, Diagnostic centre, gym management. Besides reports, Analytics, feedback and consultancy for upgrading services are also provided.</p>
                    </div>
                   
                </div> */}
                        <div class="col-lg-6 col-md-6 col-12">

                            <div class="single-feature wow fadeInUp" data-wow-delay=".4s">


                                <i class="lni lni-lock"><CachedIcon /></i>
                                <h3>How To Works</h3>
                                <p>Unique QR code for every client’s business, on scanning QR code by client/Customer related page of business opens, client enters details, same is processed and calculates amount to be paid. Client proceeds for payment process, once payment received QR code generated with details of services availed by client.</p>
                            </div>

                        </div>
                        <div class="col-lg-6 col-md-6 col-12">

                            <div class="single-feature wow fadeInUp" data-wow-delay=".6s">
                                <i class="lni lni-reload"><PhonelinkLockIcon /></i>
                                <h3>Authorization</h3>
                                <p>QR code received by client is scanned by authorised person of business entity to know services availed by client same is delivered. Once scanned QR code it becomes invalid.
                                    Simple process, any business can register online, Paytm team will reach and process merchant registration.
                                </p>
                            </div>

                        </div>
                        <div class="col-lg-6 col-md-6 col-12">

                            <div class="single-feature wow fadeInUp" data-wow-delay=".2s">
                                <i class="lni lni-shield"><AcUnitIcon /></i>
                                <h3>Services </h3>
                                <p>All services availed, price paid by client stored in database for generation of MIS and analytics.
                                    “Get QR” option also in application in case QR not received by user after successful payment, user enters mobile number which entered while processing, if payment done successfully, QR will be downloaded with details.
                                </p>
                            </div>

                        </div>
                        {/* <div class="col-lg-4 col-md-6 col-12">
                  
                    <div class="single-feature wow fadeInUp" data-wow-delay=".4s">
                        <i class="lni lni-cog"></i>
                        <h3>Process</h3>
                        <p>Simple process, any business can register online, Paytm team will reach and process merchant registration.</p>
                    </div>
                   
                </div> */}
                        <div class="col-lg-6 col-md-6 col-12">

                            <div class="single-feature wow fadeInUp" data-wow-delay=".6s">
                                <i class="lni lni-layers"><PaymentIcon /></i>
                                <h3>Payments </h3>
                                <p>All payments processed are transferred by Paytm, into business entity’s bank account next day.
                                    Paytm business app updates each transaction as it receives payment. Authorised Person can view each transaction, for any technical or internet issue, client not received QR code, it can be confirmed with this app.
                                </p>
                            </div>

                        </div>
                    </div>
                </div>
            </section>

            <section class="our-achievement section">
                <div class="container">
                    <div class="row">
                        <div class="col-lg-10 offset-lg-1 col-md-12 col-12">
                            <div class="title">
                                <h2>Trusted by users from over India</h2>
                                <p>Simple process, any business can register online, Paytm team will reach and process merchant registration.</p>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-lg-8 offset-lg-2 col-md-12 col-12">
                            <div class="row">
                                <div class="col-lg-4 col-md-4 col-12">
                                    <div class="single-achievement wow fadeInUp" data-wow-delay=".2s">
                                        <h3 class="counter"><span id="secondo1" class="countup" cup-end="100">100</span>%</h3>
                                        <p>digital</p>
                                    </div>
                                </div>
                                <div class="col-lg-4 col-md-4 col-12">
                                    <div class="single-achievement wow fadeInUp" data-wow-delay=".4s">
                                        <h3 class="counter"><span id="secondo2" class="countup" cup-end="120">120</span>K</h3>
                                        <p>Happy Users</p>
                                    </div>
                                </div>
                                <div class="col-lg-4 col-md-4 col-12">
                                    <div class="single-achievement wow fadeInUp" data-wow-delay=".6s">
                                        <h3 class="counter"><span id="secondo3" class="countup" cup-end="125">100</span>%</h3>
                                        <p>secure</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="pricing" class="pricing-table section">
                <div class="container">
                    <div class="row">
                        <div class="col-12">
                            <div class="section-title">
                                {/* <h3 class="wow zoomIn" data-wow-delay=".2s">pricing</h3> */}
                                <h2 class="wow fadeInUp" data-wow-delay=".4s">Features</h2>
                                {/* <p class="wow fadeInUp" data-wow-delay=".6s">There are many variations of passages of Lorem
                                    Ipsum available, but the majority have suffered alteration in some form.</p> */}
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-lg-3 col-md-6 col-12">

                            <div class="single-table wow fadeInUp" data-wow-delay=".2s">

                                <div class="table-head">
                                    <h4 class="title">Park </h4>
                                    {/* <p>All the basics for starting a new business</p> */}
                                    {/* <div class="price">
                                <h2 class="amount">$12<span class="duration">/mo</span></h2>
                            </div> */}
                                    <div class="table-content">
                                        <h4 class="middle-title">What's Included</h4>
                                        <ul class="table-list">
                                            <li><i class="lni lni-checkmark-circle"></i> Cras justo odio.</li>
                                            <li><i class="lni lni-checkmark-circle"></i> Dapibus ac facilisis in.</li>
                                            <li><i class="lni lni-checkmark-circle"></i> Morbi leo risus.</li>
                                            <li><i class="lni lni-checkmark-circle"></i> Potenti felis, in cras ligula.</li>
                                        </ul>
                                    </div>
                                    <div class="button">
                                        <a href="javascript:void(0)" class="btn">Click Here</a>
                                    </div>
                                </div>


                            </div>
                        </div>
                        <div class="col-lg-3 col-md-6 col-12">
                            <div class="single-table wow fadeInUp" data-wow-delay=".4s">
                                <div class="table-head">
                                    <h4 class="title">Parking </h4>
                                    {/* <p>All the basics for starting a new business</p> */}
                                    {/* <div class="price">
                                <h2 class="amount">$24<span class="duration">/mo</span></h2>
                            </div> */}
                                    <div class="table-content">
                                        <h4 class="middle-title">What's Included</h4>
                                        <ul class="table-list">
                                            <li><i class="lni lni-checkmark-circle"></i> Cras justo odio.</li>
                                            <li><i class="lni lni-checkmark-circle"></i> Dapibus ac facilisis in.</li>
                                            <li><i class="lni lni-checkmark-circle"></i> Morbi leo risus.</li>
                                            <li><i class="lni lni-checkmark-circle"></i> Potenti felis, in cras ligula.</li>
                                        </ul>
                                    </div>
                                    <div class="button">
                                        <a href="javascript:void(0)" class="btn">Click Here</a>
                                    </div>
                                </div>


                            </div>
                        </div>
                        <div class="col-lg-3 col-md-6 col-12">
                            <div class="single-table wow fadeInUp" data-wow-delay=".6s">
                                <div class="table-head">
                                    <h4 class="title">Cloak room</h4>
                                    {/* <p>All the basics for starting a new business</p> */}
                                    {/* <div class="price">
                                <h2 class="amount">$32<span class="duration">/mo</span></h2>
                            </div> */}
                                    <div class="table-content">
                                        <h4 class="middle-title">What's Included</h4>
                                        <ul class="table-list">
                                            <li><i class="lni lni-checkmark-circle"></i> Cras justo odio.</li>
                                            <li><i class="lni lni-checkmark-circle"></i> Dapibus ac facilisis in.</li>
                                            <li><i class="lni lni-checkmark-circle"></i> Morbi leo risus.</li>
                                            <li><i class="lni lni-checkmark-circle"></i> Potenti felis, in cras ligula.</li>
                                        </ul>
                                    </div>
                                    <div class="button">
                                        <a href="javascript:void(0)" class="btn">Click Here</a>
                                    </div>
                                </div>

                            </div>
                        </div>
                        <div class="col-lg-3 col-md-6 col-12">
                            <div class="single-table wow fadeInUp" data-wow-delay=".8s">
                                <div class="table-head">
                                    <h4 class="title">Museum</h4>
                                    {/* <p>All the basics for starting a new business</p> */}
                                    {/* <div class="price">
                                <h2 class="amount">$48<span class="duration">/mo</span></h2>
                            </div> */}
                                    <div class="table-content">
                                        <h4 class="middle-title">What's Included</h4>
                                        <ul class="table-list">
                                            <li><i class="lni lni-checkmark-circle"></i> Cras justo odio.</li>
                                            <li><i class="lni lni-checkmark-circle"></i> Dapibus ac facilisis in.</li>
                                            <li><i class="lni lni-checkmark-circle"></i> Morbi leo risus.</li>
                                            <li><i class="lni lni-checkmark-circle"></i> Potenti felis, in cras ligula.</li>
                                        </ul>
                                    </div>
                                    <div class="button">
                                        <a href="javascript:void(0)" class="btn">Click Here</a>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-lg-4 col-md-6 col-12">

                            <div class="single-table wow fadeInUp" data-wow-delay=".2s">

                                <div class="table-head">
                                    <h4 class="title">Gym centre  </h4>
                                    {/* <p>All the basics for starting a new business</p> */}
                                    {/* <div class="price">
                                <h2 class="amount">$12<span class="duration">/mo</span></h2>
                            </div> */}
                                    <div class="table-content">
                                        <h4 class="middle-title">What's Included</h4>
                                        <ul class="table-list">
                                            <li><i class="lni lni-checkmark-circle"></i> Cras justo odio.</li>
                                            <li><i class="lni lni-checkmark-circle"></i> Dapibus ac facilisis in.</li>
                                            <li><i class="lni lni-checkmark-circle"></i> Morbi leo risus.</li>
                                            <li><i class="lni lni-checkmark-circle"></i> Potenti felis, in cras ligula.</li>
                                        </ul>
                                    </div>
                                    <div class="button">
                                        <a href="javascript:void(0)" class="btn">Click Here</a>
                                    </div>
                                </div>


                            </div>
                        </div>
                        <div class="col-lg-4 col-md-6 col-12">
                            <div class="single-table wow fadeInUp" data-wow-delay=".4s">
                                <div class="table-head">
                                    <h4 class="title">Coaching centre  </h4>
                                    {/* <p>All the basics for starting a new business</p> */}
                                    {/* <div class="price">
                                <h2 class="amount">$24<span class="duration">/mo</span></h2>
                            </div> */}
                                    <div class="table-content">
                                        <h4 class="middle-title">What's Included</h4>
                                        <ul class="table-list">
                                            <li><i class="lni lni-checkmark-circle"></i> Cras justo odio.</li>
                                            <li><i class="lni lni-checkmark-circle"></i> Dapibus ac facilisis in.</li>
                                            <li><i class="lni lni-checkmark-circle"></i> Morbi leo risus.</li>
                                            <li><i class="lni lni-checkmark-circle"></i> Potenti felis, in cras ligula.</li>
                                        </ul>
                                    </div>
                                    <div class="button">
                                        <a href="javascript:void(0)" class="btn">Click Here</a>
                                    </div>
                                </div>


                            </div>
                        </div>
                        <div class="col-lg-4 col-md-6 col-12">
                            <div class="single-table wow fadeInUp" data-wow-delay=".6s">
                                <div class="table-head">
                                    <h4 class="title">Diagnostic centre </h4>
                                    {/* <p>All the basics for starting a new business</p> */}
                                    {/* <div class="price">
                                <h2 class="amount">$32<span class="duration">/mo</span></h2>
                            </div> */}
                                    <div class="table-content">
                                        <h4 class="middle-title">What's Included</h4>
                                        <ul class="table-list">
                                            <li><i class="lni lni-checkmark-circle"></i> Cras justo odio.</li>
                                            <li><i class="lni lni-checkmark-circle"></i> Dapibus ac facilisis in.</li>
                                            <li><i class="lni lni-checkmark-circle"></i> Morbi leo risus.</li>
                                            <li><i class="lni lni-checkmark-circle"></i> Potenti felis, in cras ligula.</li>
                                        </ul>
                                    </div>
                                    <div class="button">
                                        <a href="javascript:void(0)" class="btn">Click Here</a>
                                    </div>
                                </div>

                            </div>
                        </div>

                    </div>
                </div>
            </section>


            <section class="section call-action">
                <div class="container">
                    <div class="row">
                        {/* <div class="col-lg-8 offset-lg-2 col-md-12 col-12"> */}
                        <div class="cta-content">
                            <h2 class="wow fadeInUp" data-wow-delay=".2s">Contact us
                            </h2>
                            <section id="pricing" class="pricing-table section">
                                <div class="container">

                                    <div class="row">
                                        <div class="col-lg-4 col-md-6 col-12">

                                            <div class="single-table wow fadeInUp" data-wow-delay=".2s">
                                                <div class="table-head">

                                                    <  MailIcon />


                                                    <div class="table-head">
                                                        <h4 class="title">Email Us </h4>
                                                        <p style={{ color: "black" }}>sriqr@gmail.com Interactively grow empowered for process-centric total linkage in Digitalization.</p>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-lg-4 col-md-6 col-12">
                                            <div class="single-table wow fadeInUp" data-wow-delay=".2s">
                                                <div class="table-head">
                                                    <  PhoneIcon />

                                                    <div class="table-head">
                                                        <h4 class="title">Call Us  </h4>
                                                        <p style={{ color: "black" }}>029-00124667 Distinctively disseminate focused solutions clicks-and-mortar ministate.</p>
                                                    </div>
                                                </div>


                                            </div>
                                        </div>
                                        <div class="col-lg-4 col-md-6 col-12">
                                            <div class="single-table wow fadeInUp" data-wow-delay=".2s">
                                                <div class="table-head">
                                                    <LocationOnIcon />
                                                    <div class="table-head">
                                                        <h4 class="title">Location </h4>
                                                        <p style={{ color: "black" }}>
                                                            Srshta Tech Solutions Pvt Ltd #110, Snehapuri, Nacharam, Hyderabad-17 Telagana , INDIA</p>
                                                    </div>

                                                </div>

                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </section>

                        </div>
                        {/* </div> */}
                    </div>
                </div>
            </section>
            <Footer color="primary" className={classes.copyright}>
                © 2014-{new Date().getFullYear()} <a style={{ textDecoration: 'none', color: 'inherit' }} href="https://flatlogic.com" rel="noopener noreferrer" target="_blank">Flatlogic</a>, LLC. All rights reserved.
            </Footer>
        </>
    );
}

export default withRouter(Home);

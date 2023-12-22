import React, { useState } from "react";
import { Button, Card, Box } from "@material-ui/core";
import CoachingService from "./Locality/Service/coachingService";
import { Grid, TextField } from "@material-ui/core";
import CardContent from '@material-ui/core/CardContent';
import { useFormik } from 'formik';
import { useEffect } from 'react';
import RemoveIcon from '@material-ui/icons/RemoveCircleOutlineRounded';
import AddIcon from '@material-ui/icons/AddCircleOutlineRounded';
import PageTitle from "../../components/PageTitle/PageTitle";
import { useParams } from "react-router-dom";
import CoachingBookingService from "./Locality/Service/coachingService";
import Avatar from '@material-ui/core/Avatar';
import CardHeader from '@material-ui/core/CardHeader';
import FavoriteIcon from '@material-ui/icons/Favorite';
import { makeStyles } from '@material-ui/core/styles';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import ConfirmationNumberIcon from '@material-ui/icons/ConfirmationNumber';
import PaymentIcon from '@material-ui/icons/Payment';
import Loader from './Loader';
const useStyles = makeStyles({
    root: {
        minWidth: 275,
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        fontSize: 20,
        color: 'rgb(255, 107, 129)',
        fontWeight: 'bold'
    },
    pos: {
        marginBottom: 12,
    },
});
export default function CoachingBooking(props) {
    const classes = useStyles();
    const [loading, setLoading] = useState(true);
    const [coachingBooking, setCoachingBooking] = useState({
        coachingName: '',
    });
    const { coachingId } = useParams();
    const [mobile, setMobile] = useState('');
    const [email, setEmail] = useState('');
    const [coachingBookingList, setCoachingBookingList] = useState([]);
    const [profileRegistrationId, setProfileRegistrationId] = useState('');
    var [error, setError] = useState(null);
    const [items, setItems] = useState([
        { id: 1, price: 50, quantity: 0 },
        // { id: 2, price: 15, quantity: 0 },
        // { id: 3, price: 20, quantity: 0 },
    ]);
    const [fee, setFee] = useState({});


    const getDay = () => {
        const currentDate = new Date();
        const currentDayNumber = currentDate.getDay();

        const daysOfWeek = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
        const currentDayName = daysOfWeek[currentDayNumber];
        return currentDayName;
    }
    const handleOpen = () => {
        props.history.push('/app/studentregistration/add')
    };
    const handleOpens = () => {
        props.history.push(`/getqr/${coachingId}`)
    };



    const Item = ({ name, price, quantity, onIncrement, onDecrement }) => {
        return (
            <>
                {loading && <Loader />}
                <Grid item xs={4}>

                    <div>
                        <h4 style={{
                            'overflow': 'hidden',
                            'text-transform': 'uppercase',
                            'text-overflow': 'ellipsis',
                            'white-space': 'break-spaces'
                        }}>{name}</h4>

                    </div>
                    <div>
                        <span> &#x20b9;{price}</span>
                    </div>
                </Grid>
                <Grid item xs={4}>
                    <div style={{ textAlign: 'center' }}>
                        <RemoveIcon style={{ cursor: 'pointer', width: "18px", height: "18px", }} onClick={onDecrement} />
                        <span style={{ fontSize: '16px', padding: '5px' }}>{quantity}</span>
                        <AddIcon style={{ cursor: 'pointer', width: "18px", height: "18px", }} onClick={onIncrement} />
                    </div>

                    {/* <div>
            <h4> &#x20b9;{price * quantity}</h4>
          </div> */}
                </Grid>
                <Grid item xs={4}>


                    <div style={{ textAlign: 'end' }}>
                        <h4> &#x20b9;{price * quantity}</h4>
                    </div>
                </Grid>
            </>



        );
    };
    const pricePerItem = 10;
    useEffect(() => {
        getByIdList();
        //  sumOfTotal();

        return () => {

        }
    }, []);
    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    // const getProfileIdList = () => {

    //   const userDetails = JSON.parse(localStorage.getItem("userDetail"));
    //   console.log(userDetails.role)

    //   const result = userDetails.role === "admin" ? null : userDetails.profileId;
    //   console.log(result)
    //   
    //   TicketBookingService.getAllProfileId({ profileRegistrationId: result }).then((res) => {

    //     setTicketBookingList(res);

    //   }).catch((err) => {
    //     // setError(err.message);
    //   });
    // }
    function isDate(val) {
        // Cross realm comptatible
        return Object.prototype.toString.call(val) === '[object Date]'
    }
    function isObj(val) {
        return typeof val === 'object'
    }
    function stringifyValue(val) {
        if (isObj(val) && !isDate(val)) {
            return JSON.stringify(val)
        } else {
            return val
        }
    }
    function buildForm({ action, params }) {
        const form = document.createElement('form')
        form.setAttribute('method', 'post')
        form.setAttribute('action', action)

        Object.keys(params).forEach(key => {
            const input = document.createElement('input')
            input.setAttribute('type', 'hidden')
            input.setAttribute('name', key)
            input.setAttribute('value', stringifyValue(params[key]))
            form.appendChild(input)
        })

        return form
    }
    function post(details) {
        const form = buildForm(details)
        document.body.appendChild(form)
        form.submit()
        form.remove()
    }
    const payment = (values) => {
        CoachingBookingService.paymentProcess(values).then((response) => {
            var information = {
                action: "https://securegw-stage.paytm.in/order/process",
                params: response
            }
            post(information)
        })
    }
    const bookTickets = () => {


        const day = getDay();
        const phoneNumberRegex = /^\d{10}$/;


        if (!mobile) {
            alert("Please enter mobile number");
            return
        }
        if (!phoneNumberRegex.test(mobile)) {
            alert("Please enter valid mobile number");
            return
        }
        // if (coachingBooking.holidayDays && coachingBooking.holidayDays.includes(day)) {
        //     alert("You cant procced to book the ticket. today is holiday ");
        //     return
        // }


        const ticketDetails = {
            // totalAmount: totalSum,
            coachingId: coachingId,
            coachingName: coachingBooking.coachingName,
            mobile: mobile,
            paymentStatus: "pending",
            profileRegistrationId: profileRegistrationId,
        }
       
        CoachingBookingService.creteCoaching(ticketDetails).then((res) => {

            setMobile('');
            // payment({ amount: totalSum, mobile: mobile, id: res.id })
            //getByIdList();




            // setProfileRegistrationId();
            // getTicketBookingList();
            // resetForm();
            // handleClose();
            // getProfileIdList();
            // alert(" TicketBooking Added Successfully.");

            //   if(res){
            //     const base64Data = res.image.replace(/^data:image\/\w+;base64,/, '');
            //     const imageBuffer = Buffer.from(base64Data, 'base64');

            //     // Create a blob URL for the binary buffer
            //     const blob = new Blob([imageBuffer]);
            //     const blobUrl = URL.createObjectURL(blob);

            //     // Create a link element and trigger the download
            //     const link = document.createElement('a');
            //     link.href = blobUrl;
            //     link.download = mobile+'.png'; // Change the file name and extension
            //     link.click();

            //     // Clean up the blob URL
            //     URL.revokeObjectURL(blobUrl);

            // }
        })
            .catch((err) => {

                alert(err.response.data.message)
            })
    }

    const updateMobile = (event) => {
        setMobile(event.target.value)
    }
    const updateEmail = (event) => {
        setEmail(event.target.value)
    }
    const dateAndTime = (date) => {

        const systemDate = new Date(date);
        const formattedDateTime = systemDate.toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            // hour: 'numeric',
            // minute: 'numeric',
            // second: 'numeric',
            // hour12: true,

        });
        return formattedDateTime;
    }
    const getByIdList = () => {

        CoachingService.getCoachingById(coachingId).then((res) => {
            const coaching = [];
            if (res) {

                setLoading(false);
                // date: dateAndTime(item.createdAt)
                res.startDate = dateAndTime(res.startDate)
                res.endDate = dateAndTime(res.endDate)
                //  res.startTime = dateAndTime(res.startTime)
                //  res.endTime = dateAndTime(res.endTime)
                setFee(res);
                // setTicketBooking(res);

            }



        }).catch((err) => {
            setError(err.message);
        });
    }

    const formik = useFormik({
        initialValues: coachingBooking,
        enableReinitialize: true,
        // validationSchema: validationSchema,
        onSubmit: (values, { resetForm }) => {
            //   SchooleRegistrationService.creteSchooleRegistration(values).then((res) => {

            //     alert(" Registration Successfully.");
            //     props.history.push('/montessori/login');
            //   })
            //     .catch((err) => {
            //       alert(err.response.data.message);
            //     })
        },
    });

    // const totalSum = gst.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <>



            <Box   >
                <Grid container
                    spacing={0}
                    direction="column"
                    alignItems="center"

                    style={{ minHeight: '100vh' }}>
                    <form onSubmit={formik.handleSubmit} style={{ width: '70%' }} >
                        <div >
                            <Card >
                                <CardHeader
                                    avatar={

                                        <LocationOnIcon style={{ color: 'rgb(255, 107, 129)', fontSize: 25 }} />

                                    }


                                    // action={
                                    //   <IconButton aria-label="settings">

                                    //   </IconButton>
                                    // }
                                    // titleTypographyProps={{variant:'h6' }}

                                    classes={{
                                        title: classes.title
                                    }}
                                    title="Booking For"

                                />
                                {/* <Grid item xs={12}>
                    <PageTitle title="Ticket Booking" />
                  </Grid> */}
                                <CardContent>
                                    {(coachingBooking?.isCloakRoom || coachingBooking?.isHolidays || coachingBooking?.holidayDays) ? <Grid item xs={12}>
                                        <h4> Note: <span style={{
                                            'color': "#0a88e4",
                                            'font-size': "13px"
                                        }}>
                                            {coachingBooking?.isCloakRoom ? <span>1.Cloak room Avilable</span> : ''},{coachingBooking?.isHolidays ? <span>2.Holidays on {coachingBooking?.holidayDays}</span> : ''}
                                        </span></h4>

                                    </Grid> : ''}

                                    <Grid item xs={12} >
                                        <TextField
                                            autoFocus
                                            margin="dense"
                                            id="studentName"
                                            name="studentName"
                                            value={coachingBooking.studentName}
                                            label="Name Of The Student"
                                            type="text"
                                            variant="outlined"
                                            style={{ width: '100%' }}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            style={{ width: '100%' }}
                                            margin="dense"
                                            id="mobile"
                                            name="mobile"
                                            value={mobile}
                                            onChange={updateMobile}
                                            label="Enter Mobile Number"
                                            type="text"
                                            variant="outlined"

                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            style={{ width: '100%' }}
                                            margin="dense"
                                            id="email"
                                            name="email"
                                            label="Email ID "
                                            type="Email ID"
                                            value={email}
                                            onChange={updateEmail}
                                            variant="outlined"

                                        />
                                    </Grid>
                                </CardContent>


                            </Card>
                        </div>
                        <div style={{ marginTop: "2%" }}>
                            <Card >

                                <CardHeader
                                    avatar={

                                        <ConfirmationNumberIcon style={{ color: 'rgb(255, 107, 129)', fontSize: 25 }} />

                                    }
                                    classes={{
                                        title: classes.title
                                    }}
                                    title="Timings"

                                />
                                <CardContent>
                                    <Grid container spacing={3}>
                                        <Grid item xs={4}>

                                            <div>
                                                <h6>Batch Number:{fee?.batchName}</h6>
                                                <div>
                                                <h6 style={{
                                                    'overflow': 'hidden',
                                                    
                                                    'text-overflow': 'ellipsis',
                                                    'white-space': 'break-spaces'
                                                }}>Start Date:{fee?.startDate}</h6>
</div>
                                            </div>
                                            <div>
                                                <h6>End Date:{fee?.endDate}</h6> 
                                            </div>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <h6>Start Timings:{fee?.startTime}</h6>
                                            

                                            {/* <div>
<h4> &#x20b9;{price * quantity}</h4>
</div> */}
                                        </Grid>
                                        <Grid item xs={4}>


                                            <div style={{ textAlign: 'end' }}>
                                            <h6>End Timings:{fee?.endTime}</h6>
                                            </div>
                                        </Grid>
                                    </Grid>
                                </CardContent>


                            </Card>
                        </div>
                        <div style={{ marginTop: "2%" }}>
                            <Card >

                                <CardHeader
                                    avatar={

                                        <PaymentIcon style={{ color: 'rgb(255, 107, 129)', fontSize: 25 }} />

                                    }
                                    classes={{
                                        title: classes.title
                                    }}
                                    title="Summary"

                                />
                                <CardContent>
                                    <Grid container spacing={3}>
                                        <Grid item xs={6}>
                                            <h4> GST:</h4>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <div style={{ textAlign: 'end' }}>
                                                <h3>{fee?.fee}  &#x20b9;  00</h3>
                                            </div>

                                        </Grid>
                                    </Grid>



                                </CardContent>
                            </Card>
                        </div>
                        <div style={{ marginTop: "2%" }}>
                            <Grid item xs={12}>
                                <div style={{ textAlign: 'left' }}>
                                    {/* <a href="javascript:void(0)" class="btn" ><i class="lni lni-apple"></i> Book More Tickets</a> */}
                                    {/* <PublicRoute path="/ticketbooking/:parkId" component={TicketBooking} /> */}

                                    <a style={{ fontWeight: 'bold', color: '#ff6b81', fontSize: 'large' }} href="javascript:void(0)" onClick={handleOpens} class="page-scroll active"> Get QR</a>
                                </div>
                            </Grid>
                        </div>

                        <div style={{ marginTop: "2%" }}>
                            <Grid item xs={12}>
                                <div style={{ textAlign: 'center' }}>
                                    <Button style={{ backgroundColor: 'rgb(255, 107, 129)', color: 'white', marginBottom: '20px' }} onClick={bookTickets} variant="contained" >Book</Button>
                                </div>
                            </Grid>
                        </div>
                    </form>
                </Grid>
            </Box>





        </>
    );
}



import React, { useState } from "react";
import {
    LinearProgress,
    OutlinedInput,
} from "@material-ui/core";
import VisibilityIcon from '@material-ui/icons/Visibility';
import {
    Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, InputLabel, MenuItem,
    TableRow, Table,
    TableHead,
    TableBody,
    TableCell
} from "@material-ui/core";
import ParkService from "./Locality/Service/parkService";

import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import ProfileRegistrationService from "./Locality/Service/profileRegistrationService"
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import { Grid, Card, Box, Select, TextField } from "@material-ui/core";
import { useFormik } from 'formik';
import { useContext, useEffect } from 'react';
import { useParams } from "react-router-dom";

// styles
// import useStyles from "./styles";
import Alert from '@material-ui/lab/Alert';
import Loader from './Loader';

import mock from "./mock";
import Widget from "../../components/Widget/Widget";
import PageTitle from "../../components/PageTitle/PageTitle";
import { Typography } from "../../components/Wrappers/Wrappers";
import Dot from "../../components/Sidebar/components/Dot";
import BigStat from "./components/BigStat/BigStat";
import { withStyles } from '@material-ui/core/styles';
import TicketBookingService from "./Locality/Service/ticketBookingService";
// const useStyles = makeStyles((theme) => ({
//     root: {
//       width: '100%',
//       '& > * + *': {
//         marginTop: theme.spacing(2),
//       },
//     },
//   }));
export default function Getqr(props) {
    // const classes = useStyles();
    const { bookingId, parkId } = useParams();
    const [loading, setLoading] = useState(true);
    var [error, setError] = useState(null);
    const [mobile, setMobile] = useState('');
    const [ticketDetails, setTicketDetails] = useState({ ticketDetails: [], message: '', status: false });
    const [ticketBooking, setTicketBookingList] = useState({
        "status": 'info',
        "image": "",
        "message": "",
        "id": ""
    });

    useEffect(() => {


        return () => {
        }
    }, []);
    const getQr = () => {
        console.log(mobile)

    }
    const updateMobile = (event) => {
        setMobile(event.target.value)
    }
    const handleRedirect = () => {

        props.history.push("/ticketbooking/" + parkId)
    };
    const getByMobileList = () => {
        const phoneNumberRegex = /^\d{10}$/;

        if (!mobile) {
            alert("mobile number required");
            return
        }
          if(!phoneNumberRegex.test(mobile)){
            alert("Please enter valid mobile number");
            return
          }
        TicketBookingService.getQRcodeByMobile({ mobile: mobile, parkId:parkId }).then((res) => {
            res.status = true;
            setTicketDetails(res);

            // setTicketBooking(res);

        }).catch((err) => {
            setError(err.message);
        });
    }
    const getByIdList = () => {

        ParkService.getQRcodebyById({ bookingId: bookingId }).then((res) => {


            if (res) {
                if (res.status) {
                    res.status = 'success';
                    setTicketBookingList(res);

                    // const base64Data = res.image.replace(/^data:image\/\w+;base64,/, '');
                    // const imageBuffer = Buffer.from(base64Data, 'base64');

                    // // Create a blob URL for the binary buffer
                    // const blob = new Blob([imageBuffer]);
                    // const blobUrl = URL.createObjectURL(blob);

                    // // Create a link element and trigger the download
                    // const link = document.createElement('a');
                    // link.href = blobUrl;
                    // link.download = mobile+'.png'; // Change the file name and extension
                    // link.click();

                    // // Clean up the blob URL
                    // URL.revokeObjectURL(blobUrl);


                } else {
                    setTicketBookingList({
                        "status": 'error',
                        "image": "",
                        "message": res.message,
                        "id": ""
                    })
                }


            } else {
                setTicketBookingList({
                    "status": 'error',
                    "image": "",
                    "message": res.message,
                    "id": ""
                })
            }



        }).catch((err) => {
            // setError(err.message);
        });
    }
    return (

        <>
            <Box   >
                <Grid container
                    spacing={0}
                    direction="column"
                    alignItems="center"

                    style={{ minHeight: '100vh' }}>
                    <form style={{ width: '70%' }} >
                        <div >
                            <Card >
                                <CardHeader />

                                <CardContent>

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
                                    {ticketDetails.ticketDetails.length ? <Grid container spacing={3}>

                                        {ticketDetails.ticketDetails.map(({ image }) => (

                                            <Grid item xs={4}>
                                                <div style={{textAlign:"center"}}>


                                                    <div >
                                                        <img src={image} />
                                                    </div>
                                                    <div>
                                                        <a href={image} download>Download</a>
                                                    </div>
                                                    </div>
                                            </Grid>

                                        ))}
                                    </Grid> : ticketDetails.status ? <Alert severity="info">{ticketDetails.message}</Alert> : ""
                                    }


                                </CardContent>

                                <div style={{ marginTop: "2%" }}>
                                    <Grid item xs={12}>
                                        <div style={{ textAlign: 'center' }}>   
   
                                            <Button style={{ backgroundColor: 'rgb(255, 107, 129)', color: 'white', marginBottom: '20px' }} onClick={getByMobileList} variant="contained" >Get QR</Button>
                                        </div>
                                    </Grid>
                                </div>
                            </Card>
                        </div>


                    </form>
                </Grid>
            </Box>

        </>
    );
}



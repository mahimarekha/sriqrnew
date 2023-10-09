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

// components
import mock from "./mock";
import Widget from "../../components/Widget/Widget";
import PageTitle from "../../components/PageTitle/PageTitle";
import { Typography } from "../../components/Wrappers/Wrappers";
import Dot from "../../components/Sidebar/components/Dot";
import BigStat from "./components/BigStat/BigStat";
import { withStyles } from '@material-ui/core/styles';
// const useStyles = makeStyles((theme) => ({
//     root: {
//       width: '100%',
//       '& > * + *': {
//         marginTop: theme.spacing(2),
//       },
//     },
//   }));
export default function Success(props) {
    // const classes = useStyles();
    const { bookingId,parkId } = useParams();
    const [ticketBooking, setTicketBookingList] = useState({ "status": 'info',
    "image": "",
    "message": "",
    "id": ""});
 
  useEffect(() => {
    getByIdList();
    return () => {
    }
}, []);
const handleRedirect = () => {
        
    props.history.push("/ticketbooking/" + parkId)
};
const getByIdList = () => {

    ParkService.getQRcodebyById({bookingId:bookingId}).then((res) => {
     
      if (res) {
        if(res.status){
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

    
        }else{
            setTicketBookingList( { "status": 'error',
            "image": "",
            "message": res.message,
            "id": ""})
        }
        

      }else{
        setTicketBookingList( { "status": 'error',
    "image": "",
    "message": res.message,
    "id": ""})
      }



    }).catch((err) => {
     // setError(err.message);
    });
  }
  return (

    <>
<div >
<Grid  container  spacing={3}
  direction="column"
  alignItems="center">
<Card >

<CardHeader
  
 
  

/>
<CardContent>
   <div style={{
    'text-align': 'center'
}}>
   <Alert severity={ticketBooking.status}>{ticketBooking.message}</Alert>
   <div>
    <img src={ticketBooking.image}/>
   </div>
   {ticketBooking.status === 'success'? <div>    <a href={ticketBooking.image} download>Download</a>
</div>:''}
  
<div class="button wow fadeInLeft" data-wow-delay=".8s">

<a href="javascript:void(0)" class="btn" onClick={handleRedirect}><i class="lni lni-apple"></i> Book More Tickets</a>
{/* <a href="javascript:void(0)" class="btn btn-alt"><i class="lni lni-play-store"></i> Google
Play</a> */}
</div>
   </div>

  
  
</CardContent>


</Card>
</Grid>


    </div>
          
    </>
  );
}



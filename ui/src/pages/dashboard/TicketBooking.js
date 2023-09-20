import React, { useState } from "react";
import { Button, Card, Box } from "@material-ui/core";
import ParkService from "./Locality/Service/parkService";
import { Grid, TextField } from "@material-ui/core";
import CardContent from '@material-ui/core/CardContent';
import { useFormik } from 'formik';
import { useEffect } from 'react';
import RemoveIcon from '@material-ui/icons/RemoveCircleOutlineRounded';
import AddIcon from '@material-ui/icons/AddCircleOutlineRounded';
import PageTitle from "../../components/PageTitle/PageTitle";
import { useParams } from "react-router-dom";
import TicketBookingService from "./Locality/Service/ticketBookingService";
import Avatar from '@material-ui/core/Avatar';
import CardHeader from '@material-ui/core/CardHeader';
import FavoriteIcon from '@material-ui/icons/Favorite';
import { makeStyles } from '@material-ui/core/styles';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import ConfirmationNumberIcon from '@material-ui/icons/ConfirmationNumber';
import PaymentIcon from '@material-ui/icons/Payment';
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
export default function TicketBooking(props) {
  const classes = useStyles();

  const [ticketBooking, setTicketBooking] = useState({
    parkName: '',
  });
  const { parkId } = useParams();
  const [mobile, setMobile] = useState('');
  const [ticketBookingList, setTicketBookingList] = useState([]);
  const [profileRegistrationId, setProfileRegistrationId] = useState('');
  var [error, setError] = useState(null);
  const [items, setItems] = useState([
    { id: 1, price: 50, quantity: 0 },
    // { id: 2, price: 15, quantity: 0 },
    // { id: 3, price: 20, quantity: 0 },
  ]);
  const [fee, setFee] = useState([]);
  const handleIncrement = (id) => {
    setFee(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, quantity: item.quantity + 1, totalprice: (item.price * (item.quantity + 1)) } : item
      )
    );
    // sumOfTotal();
  };
  const handleDecrement = (id) => {
    setFee(prevItems =>
      prevItems.map(item =>
        item.id === id && item.quantity > 0
          ? { ...item, quantity: item.quantity - 1, totalprice: (item.price * (item.quantity - 1)) }
          : item
      )
    );

  };
  const handleOpen = () => {
    props.history.push('/app/studentregistration/add')
  };
  const sumOfTotal = () => {
    console.log(JSON.stringify(fee));
    const totalPrice = fee.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    console.log(totalPrice)
  }


  const Item = ({ name, price, quantity, onIncrement, onDecrement }) => {
    return (
      <>
        <Grid item xs={4}>

          <div>
            <h4 style={{ 'overflow': 'hidden',
                'text-transform': 'uppercase',
    'text-overflow': 'ellipsis',
    'white-space': 'break-spaces'}}>{name}</h4>

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
  const getProfileIdList = () => {
    const userDetails = JSON.parse(localStorage.getItem("userDetail"));
    console.log(userDetails.role)

    const result = userDetails.role === "admin" ? null : userDetails.profileId;
    console.log(result)

    TicketBookingService.getAllProfileId({ profileRegistrationId: result }).then((res) => {
      setTicketBookingList(res);
      debugger
    }).catch((err) => {
      // setError(err.message);
    });
  }
  const bookTickets = () => {

    console.log(fee)
    const getBookedDetails = fee.filter(feeDetails => feeDetails.quantity > 0);
    const totalSum = getBookedDetails.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const ticketDetails = {
      fee: getBookedDetails,
      totalAmount: totalSum,
      parkId: parkId,
      mobile: mobile,
      paymentStatus: "pending",
      profileRegistrationId: profileRegistrationId,
    }

    TicketBookingService.creteTicketBooking(ticketDetails).then((res) => {

      setMobile('');
      getByIdList();
      // setProfileRegistrationId();
      // getTicketBookingList();
      // resetForm();
      // handleClose();
      getProfileIdList();
      alert(" TicketBooking Added Successfully.");

    })
      .catch((err) => {

        alert(err.response.data.message)
      })
  }

  const updateMobile = (event) => {
    setMobile(event.target.value)
  }

  const getByIdList = () => {

    ParkService.getParkById(parkId).then((res) => {
      const park = [];
      if (res) {
        setProfileRegistrationId(res.profileRegistrationId);
        {
          Object.keys(res).map(key => {
            if (key === "seniorCitizen" && res[key]) {
              park.push(
                { id: getRandomInt(1000, 10000), price: Number(res['seniorCitizenFee']), quantity: 0, name: 'Senior Citizen' },
              )
            } else if (key === "women" && res[key]) {
              park.push(
                { id: getRandomInt(1000, 10000), price: Number(res['womenFee']), quantity: 0, name: 'Women' },
              )
            } else if (key === "physicallyChallenged" && res[key]) {
              park.push(
                { id: getRandomInt(1000, 10000), price: Number(res['physicallyChallengedFee']), quantity: 0, name: 'Physically Challenged' },
              )
            } else if (key === "camera" && res[key]) {
              park.push(
                { id: getRandomInt(1000, 10000), price: Number(res['cameraFee']), quantity: 0, name: 'Camera' },
              )
            }
            else if (key === "photography" && res[key]) {
              park.push(
                { id: getRandomInt(1000, 10000), price: Number(res['photographyFee']), quantity: 0, name: 'Photography' },
              )
            } else if (key === "shooting" && res[key]) {
              park.push(
                { id: getRandomInt(1000, 10000), price: Number(res['shootingFee']), quantity: 0, name: 'shooting' },
              )
            }
            else if (key === "walker" && res[key]) {
              park.push(
                { id: getRandomInt(1000, 10000), price: Number(res['walkerFee']), quantity: 0, name: 'walker' },
              )
            } else if (key === "adult" && res[key]) {
              park.push(
                { id: getRandomInt(1000, 10000), price: Number(res['adultFee']), quantity: 0, name: 'adult' },
              )
            } else if (key === "child" && res[key]) {
              park.push(
                { id: getRandomInt(1000, 10000), price: Number(res['childFee']), quantity: 0, name: 'child' },
              )
            }

          }



          )
        }
        setFee(park);
        setTicketBooking(res);

      }



    }).catch((err) => {
      setError(err.message);
    });
  }

  const formik = useFormik({
    initialValues: ticketBooking,
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

  const totalSum = fee.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <>



      <Box   >
        <Grid container
  spacing={0}
  direction="column"
  alignItems="center"
 
  style={{ minHeight: '100vh' }}>
          <form onSubmit={formik.handleSubmit} style={{    width: '70%'}} >
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
                 {(ticketBooking?.isCloakRoom || ticketBooking?.isHolidays || ticketBooking?.holidayDays ) ? <Grid item xs={12}>
                    <h4> Note: <span style={{
                      'color': "#0a88e4",
                      'font-size': "13px"
                    }}>
                      {ticketBooking?.isCloakRoom ? <span>1.Cloak room Avilable</span> : ''},{ticketBooking?.isHolidays ? <span>2.Holidays on {ticketBooking?.holidayDays}</span> : ''}
                    </span></h4>

                  </Grid> : '' } 

                  <Grid item xs={12} >
                    <TextField 
                      autoFocus
                      margin="dense"
                      id="parkName"
                      name="parkName"
                      value={ticketBooking.parkName}
                      label="Name Of The Park"
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
                  title="Entry Tickets"

                />
                <CardContent>
                  <Grid container spacing={3}>
                    {fee.map(item => (
                      <Item
                        key={item.id}
                        name={item.name}
                        price={item.price}
                        quantity={item.quantity}
                        onIncrement={() => handleIncrement(item.id)}
                        onDecrement={() => handleDecrement(item.id)}
                      />
                    ))}
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
                      <h4> Sub Total:</h4>
                    </Grid>
                    <Grid item xs={6}>
                      <div style={{ textAlign: 'end' }}>
                        <h3>  &#x20b9;  {totalSum}.00</h3>
                      </div>

                    </Grid>
                  </Grid>



                </CardContent>
              </Card>
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



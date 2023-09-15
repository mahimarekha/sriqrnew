import React, { useState } from "react";
import { Button,  Card, Box} from "@material-ui/core";
import ParkService from "./Locality/Service/parkService";
import { Grid, TextField } from "@material-ui/core";
import { useFormik } from 'formik';
import { useEffect } from 'react';
import RemoveIcon from '@material-ui/icons/RemoveCircleOutlineRounded';
import AddIcon from '@material-ui/icons/AddCircleOutlineRounded';
import PageTitle from "../../components/PageTitle/PageTitle";
import { useParams } from "react-router-dom";
import TicketBookingService from "./Locality/Service/ticketBookingService";
export default function TicketBooking(props) {
    const [ticketBooking, setTicketBooking] = useState({
        parkName: '',
      });
      const { parkId } = useParams();
      const [mobile,setMobile] = useState('');
      const [ticketBookingList, setTicketBookingList] = useState([]);
      const [profileRegistrationId, setProfileRegistrationId] =useState('');
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
            item.id === id ? { ...item, quantity: item.quantity + 1,totalprice:(item.price * (item.quantity + 1)) } : item
          )
        );
       // sumOfTotal();
      };
      const handleDecrement = (id) => {
        setFee(prevItems =>
          prevItems.map(item =>
            item.id === id && item.quantity > 0
              ? { ...item, quantity: item.quantity - 1 ,totalprice:(item.price * (item.quantity - 1))}
              : item
          )
        );
       
      };
      const handleOpen = () => {
        props.history.push('/app/studentregistration/add') 
    };
     const sumOfTotal = ()=>{
console.log(JSON.stringify(fee));
const totalPrice = fee.reduce((sum, item) => sum + (item.price * item.quantity), 0);
console.log(totalPrice)
      }


      const Item = ({ name, price, quantity, onIncrement, onDecrement }) => {
        return (
         <>
          <Grid item xs={6}>
         
          <div>
          <h4>{name}</h4>
          </div>
          <div>
            <span> &#x20b9;{price}</span>
          </div>
        </Grid>
        <Grid item xs={6}>
          <div>
          <RemoveIcon style={{ cursor: 'pointer', width: "18px", height: "18px", }} onClick={onDecrement} />
               <span style={{ fontSize: '16px' }}>{quantity}</span>
               <AddIcon style={{ cursor: 'pointer', width: "18px", height: "18px", }} onClick={onIncrement} />
          </div>
       <div>
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
    const getProfileIdList = ()=>{
      const userDetails = JSON.parse(localStorage.getItem("userDetail"));
console.log(userDetails.role)

 const result = userDetails.role==="admin" ? null:userDetails.profileId;
 console.log(result)

 TicketBookingService.getAllProfileId({profileRegistrationId:result }).then((res) => {
          setTicketBookingList(res);
          debugger
  }).catch((err) => {
      // setError(err.message);
  });
}
    const bookTickets = ()=>{

      console.log(fee)
      const getBookedDetails = fee.filter(feeDetails=>feeDetails.quantity>0);
      const totalSum = getBookedDetails.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const ticketDetails = {
        fee:getBookedDetails,
        totalAmount: totalSum,
        parkId:parkId,
        mobile:mobile,
        paymentStatus:"pending",
        profileRegistrationId:profileRegistrationId,
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

    const updateMobile = (event)=>{
      setMobile(event.target.value)
    }

      const getByIdList = () => {
        
        ParkService.getParkById(parkId).then((res) => {
          const park =[];
          if(res){
            setProfileRegistrationId(res.profileRegistrationId);
            {Object.keys(res).map(key => 
              {
                if(key==="seniorCitizen" && res[key]){ 
                  park.push(
                    { id: getRandomInt(1000,10000), price:Number(res['seniorCitizenFee']), quantity: 0,name: 'Senior Citizen'},
                  )
                }else if(key==="women" && res[key]){ 
                  park.push(
                    { id: getRandomInt(1000,10000), price:Number(res['womenFee']), quantity: 0,name: 'Women'},
                  )
                }else if(key==="physicallyChallenged" && res[key]){ 
                  park.push(
                    { id: getRandomInt(1000,10000), price:Number(res['physicallyChallengedFee']), quantity: 0,name: 'Physically Challenged'},
                  )
                }else if(key==="camera" && res[key]){ 
                  park.push(
                    { id: getRandomInt(1000,10000), price:Number(res['cameraFee']), quantity: 0,name: 'Camera'},
                  )
                }
                else if(key==="photography" && res[key]){ 
                  park.push(
                    { id: getRandomInt(1000,10000), price:Number(res['photographyFee']), quantity: 0,name: 'Photography'},
                  )
                }else if(key==="shooting" && res[key]){ 
                  park.push(
                    { id: getRandomInt(1000,10000), price:Number(res['shootingFee']), quantity: 0,name: 'shooting'},
                  )
                }
                else if(key==="walker" && res[key]){ 
                  park.push(
                    { id: getRandomInt(1000,10000), price:Number(res['walkerFee']), quantity: 0,name: 'walker'},
                  )
                } else if(key==="adult" && res[key]){ 
                  park.push(
                    { id: getRandomInt(1000,10000), price:Number(res['adultFee']), quantity: 0,name: 'adult'},
                  )
                } else if(key==="child" && res[key]){ 
                  park.push(
                    { id: getRandomInt(1000,10000), price:Number(res['childFee']), quantity: 0,name: 'child'},
                  )
                }
               
              }
             
                
              
            )}
            setFee(park);
            setTicketBooking(res);

          }
          

            
        }).catch((err) => {
            setError(err.message);
        });
    }

    const formik = useFormik({
        initialValues:  ticketBooking,
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
       <Card sx={{ maxWidth: 345 }}>
        <Box   >
          <div style={{ marginLeft: "7%" }}>
            <form onSubmit={formik.handleSubmit} >
              <Grid container spacing={2} columns={12} >
                <Grid item xs={12}>
                <PageTitle title="Ticket Booking"  />



                  {/* <PageTitle InputProps={{ style: { color: '#10b680' } }} title=" Ticket Booking" ></PageTitle> */}
                </Grid>
                <Grid item xs={12}>
                 <h4> Note: <span style={{'color': "#0a88e4",
    'font-size': "13px"}}>
                  {ticketBooking?.isCloakRoom ?  <span>1.Cloak room Avilable</span>:'' },{ticketBooking?.isHolidays ?  <span>2.Holidays on {ticketBooking?.holidayDays}</span>:'' }
                  </span></h4>
        
                </Grid>
                <Grid item xs={6}>
                  <TextField InputProps={{ style: { width: 370 } }}
                  autoFocus
                    margin="dense"
                    id="parkName"
                    name="parkName"
                     value={ticketBooking.parkName}
                    label="Name Of The Park"
                    type="text"
                    variant="outlined"
                    
                  />
                </Grid> 
                <Grid item xs={12}>
                  <TextField InputProps={{ style: { width: 370 } }}
                  
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
                <Grid item xs={6}>
                <h4> Sub Total:</h4>
                </Grid> 
               
                <Grid item xs={6}>
              <h3>  &#x20b9;  {totalSum}.00</h3>
                </Grid> 
                <Grid item xs={12}>
                <div style={{ textAlign: 'center' }}>
                <Button style={{ backgroundColor: '#ff6b81', color:'white', marginBottom: '20px' }}  onClick={bookTickets} variant="contained" >Pay</Button>
              </div>
                </Grid>
              </Grid>
            

            </form>
          </div>
        </Box>

      </Card>
        </>
    );
                                
}



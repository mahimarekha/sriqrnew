import React, { useState } from "react";
import {
  LinearProgress,
  OutlinedInput,
} from "@material-ui/core";
import VisibilityIcon from '@material-ui/icons/Visibility';
import {
  Grid, Button,  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, FormControl, InputLabel, Select, MenuItem,
  TableRow, Table,
  TableHead,
  TableBody,
  TableCell
} from "@material-ui/core";
import CityServices from "../../services/CityServices";
import { useContext, useEffect } from 'react';
import { useTheme } from "@material-ui/styles";
import {
  ResponsiveContainer,
  ComposedChart,
  AreaChart,
  LineChart,
  Line,
  Area,
  PieChart,
  Pie,
  Cell,
  YAxis,
  XAxis,
} from "recharts";

// styles
import useStyles from "./styles";

// components
import mock from "./mock";
import Widget from "../../components/Widget";
import PageTitle from "../../components/PageTitle";
import { Typography } from "../../components/Wrappers";
import Dot from "../../components/Sidebar/components/Dot";

import BigStat from "./components/BigStat/BigStat";
import { withStyles } from '@material-ui/core/styles';
const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: "#536dfe",
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);


const mainChartData = getMainChartData();


export default function Dashboard(props) {
   const tableHeaders = ['Order ID','Sub Total', 'Discount', 'Status', 'View' ];
  var classes = useStyles();
  var theme = useTheme();

  // local
  var [mainChartState, setMainChartState] = useState("monthly");
  const [vendorOrdersList, setVendorOrdersList] = useState({totalPendingOrder:{count:'' }, todayOrder:[]});
  const[cartList, setCartList]=useState([]);
  const [open, setOpen] = React.useState(false);
  useEffect(() => {
    getvendorordersList();
    return () => {
      setVendorOrdersList({})
    };
  }, []);

  const getvendorordersList = () => {
    const userDetails = JSON.parse(localStorage.getItem("userDetail"));
    CityServices.createVendorOrdersById({"vendorId":userDetails._id}).then((res) => {
console.log(res);
      setVendorOrdersList(res);

    }).catch((err) => {
      // setError(err.message);
    });
  }
  const handleOpen = (cartList) => {

    setCartList(cartList.cart);
    setOpen(true);
 
  }
  const handleClose = () => setOpen(false);
  return (
    <>
      <PageTitle title="Dashboard"  />
      <Grid container spacing={4}>
        <Grid item lg={4} md={4} sm={6} xs={12}>
          <Widget
            title="Total Order"
            upperTitle
            bodyClass={classes.fullHeightBody}
            className={classes.card}
          >
            <div className={classes.visitsNumberContainer}>
              <Grid container item alignItems={"center"}>
                <Grid item xs={6}>
              <Typography size="xl" weight="medium" noWrap>
              {vendorOrdersList.totalOrder}
              </Typography>
                </Grid>
               
              </Grid>
            </div>
          
          </Widget>
        </Grid>
        <Grid item lg={4} md={4} sm={6} xs={12}>
          <Widget
            title="Pending Order"
            upperTitle
            className={classes.card}
            bodyClass={classes.fullHeightBody}
          >
            <div className={classes.visitsNumberContainer}>
              <Grid container item alignItems={"center"}>
                <Grid item xs={6}>
              <Typography size="xl" weight="medium" noWrap>
              {vendorOrdersList.totalPendingOrder.count}
              </Typography>
                </Grid>
               
              </Grid>
            </div>
           
          </Widget>
        </Grid>
        <Grid item lg={4} md={4} sm={6} xs={12}>
          <Widget
            title="Processing Order"
            upperTitle
            className={classes.card}
            bodyClass={classes.fullHeightBody}
          >
            <div className={classes.visitsNumberContainer}>
              <Grid container item alignItems={"center"}>
                <Grid item xs={6}>
              <Typography size="xl" weight="medium" noWrap>
              {vendorOrdersList.totalProcessingOrder}
              </Typography>
                </Grid>
               
              </Grid>
            </div>
          </Widget>
        </Grid>
        <Grid item lg={4} md={4} sm={6} xs={12}>
          <Widget title="Deliverd Order" upperTitle className={classes.card}>
          <div className={classes.visitsNumberContainer}>
              <Grid container item alignItems={"center"}>
                <Grid item xs={6}>
              <Typography size="xl" weight="medium" noWrap>
              {vendorOrdersList.totalDeliveredOrder}
              </Typography>
                </Grid>
               
              </Grid>
            </div>
          </Widget>
        </Grid>
        <Grid item lg={4} md={4} sm={6} xs={12}>
          <Widget
            title="Totel Amount"
            upperTitle
            className={classes.card}
            bodyClass={classes.fullHeightBody}
          >
            <div className={classes.visitsNumberContainer}>
              <Grid container item alignItems={"center"}>
                <Grid item xs={6}>
              <Typography size="xl" weight="medium" noWrap>
              {vendorOrdersList.totalAmount}
              </Typography>
                </Grid>
               
              </Grid>
            </div>
          </Widget>
        </Grid>
        <Grid item lg={4} md={4} sm={6} xs={12}>
          <Widget
            title="Total Amount Of This Month"
            upperTitle
            className={classes.card}
            bodyClass={classes.fullHeightBody}
          >
            <div className={classes.visitsNumberContainer}>
              <Grid container item alignItems={"center"}>
                <Grid item xs={6}>
              <Typography size="xl" weight="medium" noWrap>
              {vendorOrdersList.totalAmountOfThisMonth}
              </Typography>
                </Grid>
               
              </Grid>
            </div>
          </Widget>
        </Grid>
        <Grid item lg={4} md={4} sm={6} xs={12}>
          <Widget
            title="Rejected Orders"
            upperTitle
            className={classes.card}
            bodyClass={classes.fullHeightBody}
          >
            <div className={classes.visitsNumberContainer}>
              <Grid container item alignItems={"center"}>
                <Grid item xs={6}>
              <Typography size="xl" weight="medium" noWrap>
              {vendorOrdersList.rejectedOrder}
              </Typography>
                </Grid>
               
              </Grid>
            </div>
          </Widget>
        </Grid>
        <Grid item lg={4} md={4} sm={6} xs={12}>
          <Widget
            title="Complete Orders"
            upperTitle
            className={classes.card}
            bodyClass={classes.fullHeightBody}
          >
            <div className={classes.visitsNumberContainer}>
              <Grid container item alignItems={"center"}>
                <Grid item xs={6}>
              <Typography size="xl" weight="medium" noWrap>
              {vendorOrdersList.completOrder}
              </Typography>
                </Grid>
               
              </Grid>
            </div>
          </Widget>
        </Grid>
        <Grid item lg={4} md={4} sm={6} xs={12}>
          <Widget
            title="Accepted Order"
            upperTitle
            className={classes.card}
            bodyClass={classes.fullHeightBody}
          >
            <div className={classes.visitsNumberContainer}>
              <Grid container item alignItems={"center"}>
                <Grid item xs={6}>
              <Typography size="xl" weight="medium" noWrap>
              {vendorOrdersList.acceptedOrder}
              </Typography>
                </Grid>
               
              </Grid>
            </div>
          </Widget>
        </Grid>
        
        <Grid item xs={12}>
       
            
        
        </Grid>
      
     
      </Grid>



      <Grid container spacing={4}>



        <Grid item xs={12}>
          


            <Table className="mb-0">
              <TableHead>
                <TableRow>
                  {tableHeaders.map(key => (
                    <StyledTableCell key={key}>{key}</StyledTableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                            {vendorOrdersList.todayOrder.map((todayOrder) => (
                                <TableRow >
                                  <TableCell className="pl-3 fw-normal" >
                                        {todayOrder.orderInvoice}
                                    </TableCell>
                                    <TableCell className="pl-3 fw-normal" >
                                        {todayOrder.subTotal}
                                    </TableCell>
                                    <TableCell className="pl-3 fw-normal" >
                                        {todayOrder.discount}
                                    </TableCell>
                                    
                                    <TableCell className="pl-3 fw-normal" >
                                        {todayOrder.status}
                                    </TableCell>
                                    <TableCell>
                                            <VisibilityIcon style={{ cursor: 'pointer' }}  onClick={()=>handleOpen(todayOrder)}>

                                            </VisibilityIcon >
                                        </TableCell>
                                                                    
                                </TableRow>
                            ))}
                        </TableBody>
            </Table>
         
        </Grid>
      </Grid>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle  >Orders Detailes</DialogTitle>
        <DialogContent>
        <Table className="mb-0">
        <TableHead>
                <TableRow>
                <StyledTableCell >Order Name</StyledTableCell>
                <StyledTableCell >Quantity</StyledTableCell>
                <StyledTableCell >Original Price</StyledTableCell>
                <StyledTableCell >Final Price</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
             
                            {cartList.map((vendorOrderDetails) => (
                                <TableRow >
                                    <TableCell className="pl-3 fw-normal" >
                                        {vendorOrderDetails.title}
                                    </TableCell>
                                    <TableCell className="pl-3 fw-normal" >
                                        {vendorOrderDetails.quantity}
                                    </TableCell>
                                    <TableCell className="pl-3 fw-normal" >
                                        {vendorOrderDetails.originalPrice}
                                    </TableCell>
                                    <TableCell className="pl-3 fw-normal" >
                                        {vendorOrderDetails.price}
                                    </TableCell>


                                  
                                   
                                </TableRow>
                            ))}
                        </TableBody>
            </Table>




        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} >Cancel</Button>
          
        </DialogActions>
      </Dialog>
    </>
  );
}

// #######################################################################
function getRandomData(length, min, max, multiplier = 10, maxDiff = 10) {
  var array = new Array(length).fill();
  let lastValue;

  return array.map((item, index) => {
    let randomValue = Math.floor(Math.random() * multiplier + 1);

    while (
      randomValue <= min ||
      randomValue >= max ||
      (lastValue && randomValue - lastValue > maxDiff)
    ) {
      randomValue = Math.floor(Math.random() * multiplier + 1);
    }

    lastValue = randomValue;

    return { value: randomValue };
  });
}

function getMainChartData() {
  var resultArray = [];
  var tablet = getRandomData(31, 3500, 6500, 7500, 1000);
  var desktop = getRandomData(31, 1500, 7500, 7500, 1500);
  var mobile = getRandomData(31, 1500, 7500, 7500, 1500);

  for (let i = 0; i < tablet.length; i++) {
    resultArray.push({
      tablet: tablet[i].value,
      desktop: desktop[i].value,
      mobile: mobile[i].value,
    });
  }

  return resultArray;
}

import React from "react";
import VendorListServices from "../../../../services/VendorListServices";
import { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { useFormik } from 'formik';
import {
    Table,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
    Chip
} from "@material-ui/core";
import LocalityServices from "../../../../services/LocalityServices";
import CityServices from "../../../../services/CityServices";

import { withStyles } from '@material-ui/core/styles';
import { makeStyles } from "@material-ui/styles";
import Widget from "../../../../components/Widget/Widget";
import { Grid, Button, Dialog, Typography, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, FormControl, InputLabel, Select, MenuItem } from "@material-ui/core";
const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: "#536dfe",
        color: theme.palette.common.white,
    },
    body: {
        fontSize: 14,
    },
}))(TableCell);
const useStyles = makeStyles(theme => ({
    tableOverflow: {
        overflow: 'auto'
    }
}))
export default function VendorList() {
    const tableHeaders = ['Menu Item', 'Quantity', 'Price', 'Client'];
    const tableVendorHeaders = ['Invoice', 'User Name', 'Client', 'Total', 'Delivery Date', 'Delivery Status'];
    const [ordersList, setOrdersList] = useState([]);
    const [cityList, setCityList] = useState([]);
    const [isDisable, setButtonDiable] = useState("true");
    const [error, setError] = useState('');
    const [localityList, setLocalityList] = useState([]);
    const [vendorOrderById, setVendorOrderById] = useState([]);
    const [orderById, setOrderById] = useState({ cart: [] });
    const [tempOrderById, setTempOrderById] = useState({ cart: [] });

    useEffect(() => {
        getOrdersList();
        getCityList();
        return () => {
            setOrdersList([])
            setLocalityList([]);
            setOrderById([])
            setCityList([]);
        }
    }, []);
    const getCityList = () => {
        CityServices.getAllCity().then((res) => {

            setCityList(res);

        }).catch((err) => {
            setError(err.message);
        });
    }

    const getVendorOrderById = (orderId) => {
        VendorListServices.getVendorOrderById(orderId).then((res) => {
            if(res){
                setVendorOrderById(res)
            }
          
        }).catch((err) => {
            // setError(err.message);
        });
    }
   
    const updateOrderDetails = (orderId)=>{
        const orderDetails = orderById;
        const orderDetailsJSON = {
            id:orderId,
            cart:orderDetails.cart,
            isOrderAssign:true, 
            status:"Processing" , 
        }
        VendorListServices.upadeOrderDetails(orderDetailsJSON).then((res) => {
           console.log('order details updated')
        }).catch((err) => {

        });
    }


    const getLocalityList = (event) => {
        LocalityServices.getLocalityByCityId({ cityId: event.target.value }).then((res) => {

            setLocalityList(res);

        }).catch((err) => {
            setError(err.message);
        });
    }
    function groupBy(objectArray, property) {
        return objectArray.reduce((acc, obj) => {
            const key = obj[property];
            if (!acc[key]) {
                acc[key] = [];
            }
            // Add object to list for given key's value
            acc[key].push(obj);
            return acc;
        }, {});
    }
    const createVendorOrders = () => {
        const vendorOrderList = [];
        const result = groupBy(orderById.cart, 'selectedVendorId');
        let count = 0;
        const orderId = orderById._id;
        for (const key in result) {
            if (result.hasOwnProperty(key)) {
                count++;
                const cartDetails = result[key];
                const totalAmount = cartDetails.reduce(function (sum, tax) {
                    return sum + tax.itemTotal;
                }, 0);

            const taxAmount = totalAmount/100*5;
            const finalAmount = totalAmount + taxAmount;
                const orderDetails = {
                    ...orderById, ...{
                        vendorId: key,
                        orderId: orderId,
                        cart: cartDetails,
                        status: 'Pending',
                        subTotal: totalAmount,
                        shippingCost: 0,
                        total: finalAmount,
                        tax:taxAmount,
                        discount : 0,
                        orderInvoice: `${orderById.invoice}-CL${count}`
                    }
                };
                delete orderDetails._id;
                delete orderById.invoice;
                vendorOrderList.push(orderDetails);
            }
        }

        VendorListServices.createVendorOrders(vendorOrderList).then((res) => {
            alert("Clint Order placed successfully");
            setButtonDiable("true")
            getVendorOrderById(orderId);

            updateOrderDetails(orderId);
        }).catch((err) => {

        });
    }
    const getOrdersList = () => {
        VendorListServices.getAllOrders().then((res) => {

            setOrdersList(res.orders);

        }).catch((err) => {
            // setError(err.message);
        });
    }

    const getOrderById = (event) => {
        
        VendorListServices.getOrderById(event.target.value).then((res) => {
            setOrderById(res);
            setTempOrderById(res);
            
            if(res.isOrderAssign){
                setButtonDiable("true")
            }else{
                setButtonDiable("false")
            }

        }).catch((err) => {

        });
        getVendorOrderById(event.target.value)
    }
    const vendorOrders = (event, index) => {
        const vendorDetails = tempOrderById.cart[index].vendorDetails.find(vendor => {
            return vendor._id === event.target.value;
        })
        
        tempOrderById.cart[index].selectedVendorId = vendorDetails._id;
        tempOrderById.cart[index].selectedVendor = {
            id: vendorDetails._id, orgName: vendorDetails.orgName,
            fullName: vendorDetails.fullName
        };
        console.log(tempOrderById)
        setOrderById(tempOrderById);
        // const orderDetails = {...tempOrderById,...{cart:tempOrderById.cart}};
        // setOrderById(orderDetails);
    }
    const getOrderFilterByLocality = (event) => {

        if (event.target.value) {
            const filtered2 = tempOrderById.cart.map(employee => {
                const vendorList = employee.vendorDetails.filter(vendor => vendor.localityId._id === event.target.value);
                return { ...employee, ...{ vendorDetails: vendorList } };
            });
            const orderDetails = { ...tempOrderById, ...{ cart: filtered2 } };
            setOrderById(orderDetails);
        } else {
            const orderDetails = { ...tempOrderById, ...{ cart: tempOrderById.cart } };
            setOrderById(orderDetails);
        }

    }
    const classes = useStyles();
    const formik = useFormik({
        initialValues: {
            ordersId: '',

        },
        enableReinitialize: true,

    })
    return (

        <>
            <form  >
                <Grid container spacing={2} columns={12} >
                    <Grid item xs={3}>
                        <FormControl variant="standard" fullWidth="true" style={{ width: '200px' }}>
                            <InputLabel id="demo-simple-select-standard-label">Orders</InputLabel>
                            <Select
                                labelId="demo-simple-select-standard-label"
                                id="ordersId"
                                name="ordersId"
                                label="Orders"
                                onChange={e => { getOrderById(e) }}
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                {ordersList.map(({ _id, invoice }) => (
                                    <MenuItem key={_id} value={_id}>{invoice}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={3}>
                        <FormControl variant="standard" fullWidth="true" style={{ width: '200px' }}>
                            <InputLabel id="demo-simple-select-standard-label">City Name</InputLabel>
                            <Select
                                labelId="demo-simple-select-standard-label"
                                id="cityId"
                                name="cityId"
                                label="City Name"
                                value={formik.values.cityId}
                                onChange={e => { formik.handleChange(e); getLocalityList(e) }}

                                error={formik.touched.cityId && Boolean(formik.errors.cityId)}
                                helperText={formik.touched.cityId && formik.errors.cityId}
                            >


                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>


                                {cityList.map(({ _id, cityName }) => (
                                    <MenuItem key={_id} value={_id}>{cityName}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={3}>
                        <FormControl variant="standard" fullWidth="true" style={{ width: '200px' }}>
                            <InputLabel id="demo-simple-select-standard-label">Locality</InputLabel>
                            <Select
                                labelId="demo-simple-select-standard-label"
                                id="localityId"
                                name="localityId"
                                value={formik.values.localityId}
                                onChange={e => { getOrderFilterByLocality(e) }}

                                label="Locality"
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>

                                {localityList.map(({ _id, area }) => (
                                    <MenuItem key={_id} value={_id}>{area}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            </form>

            <Grid item xs={12}>
                <Widget title="" upperTitle noBodyPadding bodyClass={classes.tableOverflow}>
                    <Table className="mb-0">
                        <TableHead>
                            <TableRow>
                                {tableHeaders.map(key => (
                                    <StyledTableCell key={key}>{key}</StyledTableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {(orderById.cart || []).map((orderDetails, index) => (
                                <TableRow >

                                    <TableCell className="pl-3 fw-normal" >
                                        {orderDetails.title}
                                    </TableCell>
                                    <TableCell className="pl-3 fw-normal" >
                                        {orderDetails.quantity}
                                    </TableCell>
                                    <TableCell className="pl-3 fw-normal" >
                                        &#8377; {orderDetails.itemTotal}
                                    </TableCell>

                                    <TableCell className="pl-3 fw-normal" >
                                        <FormControl variant="standard" fullWidth="true" style={{ width: '200px' }}>
                                            <InputLabel id="demo-simple-select-standard-label"></InputLabel>
                                            <Select
                                                labelId="demo-simple-select-standard-label"
                                                id="client"
                                                name="client"
                                                label="Client"

                                                onChange={e => { vendorOrders(e, index) }}


                                            >
                                                <MenuItem value="">
                                                    <em>None</em>
                                                </MenuItem>
                                                {(orderDetails.vendorDetails || []).map(({ _id, orgName }) => (
                                                    <MenuItem key={_id} value={_id}>{orgName}</MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Widget>
            </Grid>
            <div style={{ textAlign: 'right', margin: '29px' }}>    
            
                <Button onClick={createVendorOrders} disabled={isDisable == 'true'}  variant="contained" type="button" style={{ backgroundColor: 'rgb(255, 92, 147)', color: 'white' }}>place order</Button>
            </div>
            <Grid item xs={12}>
                <Widget title="" upperTitle noBodyPadding bodyClass={classes.tableOverflow}>
                    <Table className="mb-0">
                        <TableHead>


                            <TableRow>
                                {tableVendorHeaders.map(key => (
                                    <StyledTableCell key={key}>{key}</StyledTableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {(vendorOrderById || []).map((vendorOrderDetails) => (
                                <TableRow >
                                    <TableCell className="pl-3 fw-normal" >
                                        {vendorOrderDetails.orderInvoice}
                                    </TableCell>
                                    <TableCell className="pl-3 fw-normal" >
                                        {vendorOrderDetails.user.name}
                                    </TableCell>
                                    <TableCell className="pl-3 fw-normal" >
                                        {vendorOrderDetails.vendorId.orgName}
                                    </TableCell>
                                    <TableCell className="pl-3 fw-normal" >
                                        {vendorOrderDetails.total}
                                    </TableCell>


                                    <TableCell className="pl-3 fw-normal" >
                                        {vendorOrderDetails.orderId.deliveryDate}
                                    </TableCell>
                                    <TableCell className="pl-3 fw-normal" >
                                        {vendorOrderDetails.status}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>





                </Widget>



            </Grid>


        </>
    )
}


import React from "react";
import {
    Grid, Button, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, FormControl, InputLabel, Select, MenuItem, Table,
    TableRow,
    TableHead,
    TableBody,
    TableCell
} from "@material-ui/core";
import { useFormik } from 'formik';
import CategoryServices from "../../../../services/CategoryServices";
import { useForm, Controller } from 'react-hook-form';
import { withStyles } from '@material-ui/core/styles';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useContext, useEffect, useState } from 'react';
import CityServices from "../../../../services/CityServices";
// components
import PageTitle from "../../../../components/PageTitle";
import Widget from "../../../../components/Widget";
// import Table from "../dashboard/components/Table/Table";
import EditIcon from '@material-ui/icons/Edit';

import DeleteIcon from '@material-ui/icons/Delete';
import { makeStyles } from "@material-ui/styles";
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

const useStyles = makeStyles({
    table: {
        minWidth: 700,
    },
});
export default function DiscountCoupon() {
    const tableHeaders = ['Title', 'Coupon Code', 'Start Time', 'End Time', 'Discount Percentage', 'Product Type', 'Status', 'Edit', 'Delete'];
    const [age, setAge] = React.useState('');
    const [categoryList, setCategoryList] = useState([]);
    const [data, setData] = useState({});
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [cityList, setCityList] = useState([]);
    const [couponList, setCouponList] = useState([]);
    const [coupon, setCoupon] = useState({

        title: '',
        couponCode: '',
        startTime: '',
        endTime: '',
        discountPercentage: '',
        productType: [],
        status: '',

    });

    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                width: 250,
            },
        },
    };

    const handleClickOpen = () => {
        setCoupon({
            title: '',
            couponCode: '',
            startTime: '',
            endTime: '',
            discountPercentage: '',
            productType: [],
            status: '',
        })
        setOpen(true);
    };
    useEffect(() => {
        getCategoryList();
        getCouponList();

        return () => {

            setCategoryList([])
            setCouponList();
        };
    }, []);
    const validationSchema = Yup.object().shape({
        title: Yup.string().required('Title is required'),
        couponCode: Yup.string().required('Coupon Code is required'),
        startTime: Yup.string().required('Start Time is required'),
        endTime: Yup.string().required('End Time is required'),
        discountPercentage: Yup.string().required('Discount Percentage is required'),
        minimumAmount: Yup.string().required('Discount Percentage is required'),
        productType: Yup.array().required('productType is required'),
        status: Yup.string().required('Status is required'),

    });


    const getCategoryList = () => {
        CategoryServices.getAllCategory().then((res) => {

            setCategoryList(res);

        }).catch((err) => {
            // setError(err.message);
        });
    }
    const getCouponList = () => {
        CityServices.getAllCoupon().then((res) => {

            setCouponList(res);

        }).catch((err) => {
            setError(err.message);
        });
    }



    const handleChange = (event) => {
        setAge(event.target.value);
    };
    // const handleClickOpen = (city) => {

    //     if (city && city._id) {
    //         setCityForm({
    //             cityName: city.cityName,
    //             status: city.status,
    //             id: city._id
    //         })
    //     } else {
    //         formReset();
    //     }
    //     setOpen(true);
    // };

    const handleClose = () => {
        setOpen(false);
    };

    // const cityName = (event) => {

    //     const citySelectData = {
    //         cityName: event.target.value,

    //         status: cityForm.status,
    //         id: cityForm.id
    //     }
    //     setCityForm(citySelectData)

    // }


    // const selectStatus = (event) => {

    //     const citySelectData = {
    //         cityName: cityForm.cityName,
    //         status: event.target.value,
    //         id: cityForm.id
    //     }
    //     setCityForm(citySelectData)

    // }

    const onSubmit = data => {

        console.log(JSON.stringify(data, null, 2));

    };
    // const formReset = () => {
    //     const areaSelectData = {
    //         cityName: '',
    //         status: '',
    //         id: ''
    //     }
    //     setCityForm(areaSelectData)
    // }
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => {
        setOpen(true);
    };
    const onclick = () => {
        //  setData(childdata);
        setOpen(true);
    }

    const deleteCoupon = (locality) => {
        
        if (locality) {
            CityServices.deleteCoupon(locality).then((res) => {
                getCouponList();
            }).catch((err) => {

            });
        }

    };

    let editCoupon = (product) => {
        
        const couponUpdate = {...product,startTime:new Date(product.startTime).toISOString().slice(0, 10),endTime:new Date(product.endTime).toISOString().slice(0, 10),productType:product.productType.map(res=>res._id)};
        setCoupon(couponUpdate);
        setOpen(true);
    }
    const selectedCate = (selected) => {

        const cateSelected = selected.map(res => categoryList.find(catList => catList._id === res));

        return cateSelected.map(result => result.parent)

    }
    const formik = useFormik({
        initialValues: coupon,
        enableReinitialize: true,
        validationSchema: validationSchema,
        onSubmit: (values, { resetForm }) => {
            console.log(values)
            if (coupon._id) {

                values.id = coupon._id;

                CityServices.upadeCoupon(values).then((res) => {
                    handleClose();
                    getCouponList();
                    resetForm()
                }).catch((err) => {

                });
            } else {

                CityServices.creteCoupon(values).then((res) => {
                    handleClose();
                    getCouponList()
                    resetForm()
                })
                    .catch((err) => {


                    })
            }


        },
    })

    return (
        <>
            <PageTitle title="Coupons" button={<Button
                variant="contained" onClick={handleClickOpen}
                size="medium"
                color="secondary"

            >
                create Coupon
            </Button>}
            />

            <Grid container spacing={4}>



                <Grid item xs={12}>
                    <Widget title="" upperTitle noBodyPadding >


                        <Table className="mb-0">
                            <TableHead >
                                <TableRow>
                                    {tableHeaders.map(key => (
                                        <StyledTableCell key={key}>{key}</StyledTableCell>
                                    ))}
                                </TableRow>

                            </TableHead>
                            <TableBody>

                                {couponList.map((coupon) => (
                                    <TableRow key={coupon._id}>

                                        <TableCell className="pl-3 fw-normal" >{coupon.title}</TableCell>
                                        <TableCell className="pl-3 fw-normal" >{coupon.couponCode}</TableCell>
                                        <TableCell className="pl-3 fw-normal" >{coupon.startTime}</TableCell>
                                        <TableCell className="pl-3 fw-normal" >{coupon.endTime}</TableCell>
                                        <TableCell className="pl-3 fw-normal" >{coupon.discountPercentage}</TableCell>
                                        <TableCell className="pl-3 fw-normal" >{(coupon.productType || []).map((result) => (<span>{result.parent} </span>))}</TableCell>
                                        <TableCell> {coupon.status ? 'Active' : 'In Active'}</TableCell>

                                        <TableCell>
                                            <EditIcon style={{ cursor: 'pointer' }} onClick={() => editCoupon(coupon)} />
                                        </TableCell>
                                        <TableCell>
                                            <DeleteIcon style={{ cursor: 'pointer' }} onClick={() => deleteCoupon(coupon)} />
                                        </TableCell>

                                        {/* <TableCell>
                      <EditIcon style={{ cursor: 'pointer' }} onClick={() => editCoupon(coupon)} >

                      </EditIcon >
                    </TableCell>
                    <TableCell>
                      <DeleteIcon style={{ cursor: 'pointer' }} onClick={() => deleteCoupon(coupon)} />
                    </TableCell> */}

                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Widget>
                </Grid>
            </Grid>
            <Dialog open={open} onClose={handleClose} >
                <DialogTitle  >Coupons</DialogTitle>
                <form onSubmit={formik.handleSubmit} >
                    <DialogContent style={{ maxWidth: 440 }}>

                        <TextField InputProps={{ style: { width: 370 } }}
                            onChange={formik.handleChange}
                            margin="dense"
                            id="title"
                            name="title"
                            label="Title"
                            type="text"
                            variant="standard"
                            value={formik.values.title}
                            error={formik.touched.title && Boolean(formik.errors.title)}
                            helperText={formik.touched.title && formik.errors.title}
                        />

                        <TextField InputProps={{ style: { width: 370 } }}
                            onChange={formik.handleChange}
                            margin="dense"
                            id="couponCode"
                            name="couponCode"
                            label="Coupon Code "
                            type="text"
                            variant="standard"
                            value={formik.values.couponCode}
                            error={formik.touched.couponCode && Boolean(formik.errors.couponCode)}
                            helperText={formik.touched.couponCode && formik.errors.couponCode}
                        />

                        <TextField InputProps={{ style: { width: 370 } }}
                            onChange={formik.handleChange}
                            id="startTime"
                            name="startTime"
                            label="Start Date"
                            type="date"
                            sx={{ width: 250 }}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            value={formik.values.startTime}
                            error={formik.touched.startTime && Boolean(formik.errors.startTime)}
                            helperText={formik.touched.startTime && formik.errors.startTime}
                        />
                        <TextField InputProps={{ style: { width: 370 } }}
                            onChange={formik.handleChange}
                            id="endTime"
                            name="endTime"
                            label="End Date"
                            type="date"
                            sx={{ width: 250 }}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            value={formik.values.endTime}
                            error={formik.touched.endTime && Boolean(formik.errors.endTime)}
                            helperText={formik.touched.endTime && formik.errors.endTime}
                        />
                        <TextField InputProps={{ style: { width: 370 } }}
                            onChange={formik.handleChange}
                            margin="dense"
                            id="discountPercentage"
                            name="discountPercentage"
                            label="Discount Percentage "
                            type="text"
                            variant="standard"
                            value={formik.values.discountPercentage}
                            error={formik.touched.discountPercentage && Boolean(formik.errors.discountPercentage)}
                            helperText={formik.touched.discountPercentage && formik.errors.discountPercentage}
                        />
                        <TextField InputProps={{ style: { width: 370 } }}
                            onChange={formik.handleChange}
                            margin="dense"
                            id="minimumAmount"
                            name="minimumAmount"
                            label="Minimum Amount "
                            type="text"
                            variant="standard"
                            value={formik.values.minimumAmount}
                            error={formik.touched.minimumAmount && Boolean(formik.errors.minimumAmount)}
                            helperText={formik.touched.minimumAmount && formik.errors.minimumAmount}
                        />
                        <FormControl variant="standard" style={{ width: 370 }} >

                            <InputLabel id="demo-simple-select-standard-label">Category</InputLabel>
                            {/* <Select
                                labelId="demo-simple-select-standard-label"
                                id="productType"
                                name="productType"
                                label="Category"
                                onChange={formik.handleChange}
                                value={formik.values.productType}
                            error={formik.touched.productType && Boolean(formik.errors.productType)}
                            helperText={formik.touched.productType && formik.errors.productType}
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>

                                {categoryList.map(({ _id, parent }) => (
                                    <MenuItem key={_id} value={_id}>{parent}

                                    </MenuItem>
                                ))}
                            </Select> */}
                            <Select
                                labelId="demo-simple-select-standard-label"
                                id="productType"
                                multiple
                                name="productType"

                                renderValue={(selected) => selectedCate(selected).join(", ")}
                                MenuProps={MenuProps}
                                label="Category"

                                value={formik.values.productType}
                                onChange={formik.handleChange}
                                error={formik.touched.productType && Boolean(formik.errors.productType)}
                                helperText={formik.touched.productType && formik.errors.productType}
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>

                                {categoryList.map(({ _id, parent }) => (
                                    <MenuItem key={_id} value={_id}>
                                        {/* <Checkbox checked={formik.values.categoryId.indexOf(parent) > -1} /> */}
                                        {parent}
                                    </MenuItem>
                                ))}
                            </Select>
                            <FormControl variant="standard" fullWidth>
                                <InputLabel id="demo-simple-select-standard-label">Status</InputLabel>
                                <Select
                                    labelId="demo-simple-select-standard-label"
                                    id="status"

                                    label="Status"
                                    name="status"
                                    onChange={formik.handleChange}
                                    value={formik.values.status}
                                    error={formik.touched.status && Boolean(formik.errors.status)}
                                    helperText={formik.touched.status && formik.errors.status}

                                >
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    <MenuItem value={true}>Active</MenuItem>
                                    <MenuItem value={false}>In Active</MenuItem>

                                </Select>
                            </FormControl>
                        </FormControl>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} >Cancel</Button>
                        <Button type="submit" >Add</Button>
                    </DialogActions>
                </form>

            </Dialog>
        </>
    );
}

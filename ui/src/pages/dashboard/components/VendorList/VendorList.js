import React from "react";
import { Grid, Button, Dialog, Typography, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, FormControl, InputLabel, Select, MenuItem } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import MUIDataTable from "mui-datatables";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useParams,
    useRouteMatch
} from "react-router-dom";
import { useFormik } from 'formik';
import EditIcon from '@material-ui/icons/Edit';
import VisibilityIcon from '@material-ui/icons/Visibility';
import DeleteIcon from '@material-ui/icons/Delete';
import {
    Table,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
    Chip
} from "@material-ui/core";
import { useContext, useEffect, useState } from 'react';
import SearchIcon from '@material-ui/icons/Search';
// components
import PageTitle from "../../../../components/PageTitle";
import Widget from "../../../../components/Widget";
//import Table from "../dashboard/components/Table/Table";
import { withStyles } from '@material-ui/core/styles';
import CityServices from "../../../../services/CityServices";
import LocalityServices from "../../../../services/LocalityServices";
import CategoryServices from "../../../../services/CategoryServices";
import VendorRegistrationServices from "../../../../services/VendorRegistrationServices";
import VendorListServices from "../../../../services/VendorListServices";
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


const useStyles = makeStyles(theme => ({
    tableOverflow: {
        overflow: 'auto'
    }
}))

export default function VendorList(props) {
    const tableHeaders = ['Orgnization Name ', 'Category', 'Full Name', 'Mobile Number', 'Area', 'Status', 'View'];

    const [open, setOpen] = React.useState(false);
    const [error, setError] = useState('');
    const [vendorRegistrationList, setVendorRegistrationList] = useState([]);
    const [cityList, setCityList] = useState([]);
    const [localityList, setLocalityList] = useState([]);
    const [categoryList, setCategoryList] = useState([]);

    useEffect(() => {
        getVendorRegistrationList();

        getCityList();
        getCategoryList();


        return () => {
            setVendorRegistrationList([])
            setLocalityList([]);
            setCityList([]);
        };
    }, []);

    // const deleteVendorRegistration = (vendorRegistration) => {
    //   if (vendorRegistration) {
    //     LocalityServices.deleteVendorRegistration(vendorRegistration).then((res) => {
    //       getVendorRegistrationList();
    //     }).catch((err) => {

    //     });
    //   }

    // };

    const getCityList = () => {
        CityServices.getAllCity().then((res) => {

            setCityList(res);

        }).catch((err) => {
            setError(err.message);
        });
    }
    const getCategoryList = () => {
        CategoryServices.getAllCategory().then((res) => {

            setCategoryList(res);

        }).catch((err) => {
            // setError(err.message);
        });
    }




    const getLocalityList = (event) => {
        LocalityServices.getLocalityByCityId({ cityId: event.target.value }).then((res) => {

            setLocalityList(res);

        }).catch((err) => {
            setError(err.message);
        });
    }
    const getVendorRegistrationList = () => {
        VendorRegistrationServices.getAllVendorRegistration().then((res) => {

            setVendorRegistrationList(res);

        }).catch((err) => {
            // setError(err.message);
        });
    }


    const classes = useStyles();
    const formik = useFormik({
        initialValues: {
            cityId: '',
            localityId: '',
            categoryId: ''
        },
        enableReinitialize: true,
        onSubmit: (values, { resetForm }) => {
           
            VendorListServices.findVendorList({
                "localityId": values.localityId,
                "categoryId": values.categoryId
            }).then((res) => {
                setVendorRegistrationList(res)
            })
        }
    })
    const selectedCate = (selected) => {

        const cateSelected = selected.map(res => categoryList.find(catList => catList._id === res));

        return cateSelected.map(result => result.parent)

    }
    return (

        <>
            <form onSubmit={formik.handleSubmit} >
                <Grid container spacing={2} columns={12} >
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
                                onChange={e => { formik.handleChange(e) }}

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
                    <Grid item xs={3}>

                        <FormControl variant="standard" fullWidth="true" style={{ width: '200px' }}>
                            <InputLabel id="demo-simple-select-standard-label">Category</InputLabel>
                            <Select
                                labelId="demo-simple-select-standard-label"
                                id="categoryId"
                                name="categoryId"
                                value={formik.values.categoryId}
                                label="Category"
                                onChange={e => { formik.handleChange(e) }}
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>

                                {categoryList.map(({ _id, parent }) => (
                                    <MenuItem key={_id} value={_id}>{parent}
                                        {/* <Checkbox checked={formik.values.categoryId.indexOf(parent) > -1} /> */}

                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <div style={{ textAlign: 'right', margin: '29px' }}>
                        <Button style={{ backgroundColor: 'rgb(255, 92, 147)', color: 'white' }} type="submit">submit</Button>
                    </div>


                </Grid>
            </form>
            <Grid container spacing={4}>




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


                                {vendorRegistrationList.map((vendorRegistration) => (
                                    <TableRow key={vendorRegistration._id}>
                                        <TableCell className="pl-3 fw-normal" >{vendorRegistration.orgName}</TableCell>

                                        <TableCell className="pl-3 fw-normal" >  {vendorRegistration.categoryId.map(key => (
                                            <span>{key.parent}</span>
                                        ))}</TableCell>
                                        <TableCell className="pl-3 fw-normal" >{vendorRegistration.fullName}</TableCell>
                                        <TableCell className="pl-3 fw-normal" >{vendorRegistration.mobileNumber}</TableCell>
                                        <TableCell className="pl-3 fw-normal" >{vendorRegistration.localityId.area}</TableCell>
                                        <TableCell>

                                            {vendorRegistration.status ? 'Active' : 'In Active'}
                                        </TableCell>
                                        <TableCell>
                                            <VisibilityIcon style={{ cursor: 'pointer' }}   >

                                            </VisibilityIcon >
                                        </TableCell>

                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Widget>
                </Grid>
            </Grid>

        </>
    )
}


import React, { useState } from "react";
import {
    Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem,
    TableRow, Table, List, ListItem, Checkbox, FormControlLabel,
    TableHead,
    TableBody, Card,
    TableCell,
    FormLabel, FormGroup, FormHelperText
} from "@material-ui/core";
import ParkService from "./Locality/Service/parkService";
import * as Yup from 'yup';
import TicketBookingService from "./Locality/Service/ticketBookingService";
import { Typography } from "../../components/Wrappers/Wrappers";
import TablePagination from '@material-ui/core/TablePagination';
import { Grid, Select, TextField } from "@material-ui/core";
import { useFormik } from 'formik';
import { useEffect } from 'react';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import Widget from "../../components/Widget/Widget";
import PageTitle from "../../components/PageTitle/PageTitle";
import { withStyles, makeStyles } from '@material-ui/core/styles';
const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: "rgb(255, 107, 129)",
        color: theme.palette.common.white,
    },
    body: {
        fontSize: 14,
    },
}))(TableCell);
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
export default function Park() {
    const tableHeaders = ['Park Name', 'Location', 'Adult', 'Child', 'Senior Citizen Fee', 'Women Fee',
        'Physically Challenged Fee', 'Camera Fee', , 'Photography Fee',
         'Shooting Fee', 'Walker Fee', 'Edit', 'Delete', 'QR-Code'];
    const classes = useStyles();
    const [parkList, setParkList] = useState([]);
    const [getParksList, setParks] = useState([]);
    const [qrCode, setQrCode] = useState([]);
    const [open, setOpen] = React.useState(false);
    const [pg, setpg] = React.useState(0);
    const [rpg, setrpg] = React.useState(5);
    const [ticketBookingList, setTicketBookingList] = useState([]);
    const [state, setState] = React.useState({
        checkedA: true,
        checkedB: true,
        checkedF: true,
        checkedG: true,
    });
    const [park, setPark] = useState({
        parkName: '',
        location: '',
        adult: false,
        child: false,
        adultFee: '',
        childFee: '',
        seniorCitizen: false,
        seniorCitizenFee: '',
        women: false,
        womenFee: '',
        physicallyChallenged: false,
        physicallyChallengedFee: '',
        camera: false,
        cameraFee: '',
        photography: false,
        photographyFee: '',
        shooting: false,
        shootingFee: '',
        walker: false,
        walkerFee: '',
        startTiming: '',
        endTiming: '',
        note: '',
    });
    const [holidays, setHolidaysState] = React.useState({
        mon: false,
        tue: false,
        wed: false,
        thu: false,
        fri: false,
        sat: false,
        sun: false,
    });
    const [checkboxes, setCheckboxes] = useState({
        adult: false,
        child: false,
        seniorCitizen: false,
        women: false,
        physicallyChallenged: false,
        camera: false,
        photography: false,
        shooting: false,
        isCloakRoom: false,
        isHolidays: false
    });
    const validationSchema = Yup.object().shape({
        parkName: Yup.string().required('park name is required'),
        location: Yup.string().required('location is required'),
        adult: Yup.boolean(),
        child: Yup.boolean(),
        adultFee: Yup.string(),
        childFee: Yup.string(),
        seniorCitizen: Yup.boolean(),
        seniorCitizenFee: Yup.string(),
        women: Yup.boolean(),
        womenFee: Yup.string(),
        physicallyChallenged: Yup.boolean(),
        physicallyChallengedFee: Yup.string(),
        camera: Yup.boolean(),
        cameraFee: Yup.string(),
        photography: Yup.boolean(),
        photographyFee: Yup.string(),
        shooting: Yup.boolean(),
        shootingFee: Yup.string(),
        isCloakRoom: Yup.boolean(),
        isHolidays: Yup.boolean(),
        startTiming: Yup.string(),
        endTiming: Yup.string(),
        node: Yup.string(),
    });
    const handleChangePage = (event, newpage) => {
        setpg(newpage);
    }
    const handleCheckboxChange = (event) => {
        const { name, checked } = event.target;
        setCheckboxes((prevCheckboxes) => ({
            ...prevCheckboxes,
            [name]: checked,
        }));
    };

    const handleHolidaysChange = (event) => {
        setHolidaysState({
            ...holidays,
            [event.target.name]: event.target.checked,
        });
    };
    const handleChangeRowsPerPage = (event) => {
        setrpg(parseInt(event.target.value, 10));
        setpg(0);
    }
    useEffect(() => {
       // getParkList();
    //    getParks();
       getProfileId();
       // getQrCode()
        return () => {
            setParkList([]);
            setQrCode([]);
           
        }
    }, []);
    const getTicketBookingList = () => {
        TicketBookingService.getAllTicketBooking().then((res) => {
            setTicketBookingList(res);
        }).catch((err) => {
            // setError(err.message);
        });
    }
  
 
    const getProfileId = ()=>{
        const userDetails = JSON.parse(localStorage.getItem("userDetail"));
console.log(userDetails.role)

   const result = userDetails.role==="admin" ? null:userDetails.profileId;
   console.log(result)
        ParkService.addAllProfileId({profileRegistrationId:result }).then((res) => {
            setParkList(res);
    }).catch((err) => {
        // setError(err.message);
    });
}
    const getQrCode = (data) => {
       
        ParkService.qrCode(data._id).then((res) => {
            
            if(res){
                const base64Data = res.image.replace(/^data:image\/\w+;base64,/, '');
                const imageBuffer = Buffer.from(base64Data, 'base64');

                // Create a blob URL for the binary buffer
                const blob = new Blob([imageBuffer]);
                const blobUrl = URL.createObjectURL(blob);
            
                // Create a link element and trigger the download
                const link = document.createElement('a');
                link.href = blobUrl;
                link.download = data.parkName+'.png'; // Change the file name and extension
                link.click();
            
                // Clean up the blob URL
                URL.revokeObjectURL(blobUrl);

            }
        }).catch((err) => {
            // setError(err.message);
        });
    }
    const handleOpen = () => {
        setOpen(true);
    };
    const onclick = () => {
        setOpen(true);
    }
    const handleClose = () => {
        setOpen(false);
    };
    const onSubmit = data => {
        console.log(JSON.stringify(data, null, 2));
    };
    const editPark = (park) => {
        setPark(park);
        handleOpen();
    }
    const deletePark = (parkdelete) => {
        if (parkdelete) {
            ParkService.deletePark(parkdelete).then((res) => {
                //getParkList();
                getProfileId()
            }).catch((err) => {
            });
        }
    };

    const formik = useFormik({
        initialValues: park,
        enableReinitialize: true,
        validationSchema: validationSchema,
        onSubmit: (values, { resetForm }) => {
            const userDetails = JSON.parse(localStorage.getItem("userDetail"));
            values.profileRegistrationId = userDetails.profileId;
           
            if (park._id) {
                ParkService.upadePark(values).then((res) => {
                    handleClose();
                  //  getParkList();
                  getProfileId();
                    resetForm()
                    alert("Park Updated Successfully.");
                }).catch((err) => {
                });
            }
            else {
                
                console.log(values)
                // values.holidayDays = holidays;
                const objectData = Object.keys(holidays).map(key => {
                    return holidays[key] ? key : '';
                })
                values.holidayDays = objectData.filter(item => item !== "").toString();

                ParkService.cretePark(values).then((res) => {
                    //getParkList();
                    getProfileId();
                    resetForm();
                    handleClose();
                    alert(" Park Added Successfully.");
                    // props.history.push('/app/vendor');
                })
                    .catch((err) => {
                        alert(err.response.data.message)
                    })
            }

        },
    });
    return (
        <>
        
            <PageTitle title="Park" button={<Button
                variant="contained" onClick={handleOpen}
                size="medium"
                color="secondary" style={{ backgroundColor: '#ff6b81' }}> Add Park
            </Button>} />
            <Grid container spacing={4}>
                <Grid item xs={12}>
                    <Widget title="" upperTitle noBodyPadding bodyClass={classes.tableOverflow}>
                        <Table className="mb-0">
                            <TableHead >
                                <TableRow>
                                    {tableHeaders.map(key => (
                                        <StyledTableCell key={key}>{key}</StyledTableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {parkList.slice(pg * rpg, pg * rpg + rpg).map((park) => (
                                    <TableRow key={park._id}>
                                        <TableCell className="pl-3 fw-normal" >{park.parkName}</TableCell>
                                        <TableCell className="pl-3 fw-normal" >{park.location}</TableCell>
                                        <TableCell className="pl-3 fw-normal" >{park.adultFee}</TableCell>
                                        <TableCell className="pl-3 fw-normal" >{park.childFee}</TableCell>
                                        <TableCell className="pl-3 fw-normal" >{park.seniorCitizenFee}</TableCell>
                                        <TableCell className="pl-3 fw-normal" >{park.womenFee}</TableCell>
                                        <TableCell className="pl-3 fw-normal" >{park.physicallyChallengedFee}</TableCell>
                                        <TableCell className="pl-3 fw-normal" >{park.cameraFee}</TableCell>
                                        <TableCell className="pl-3 fw-normal" >{park.photographyFee}</TableCell>
                                        <TableCell className="pl-3 fw-normal" >{park.shootingFee}</TableCell>
                                        <TableCell className="pl-3 fw-normal" >{park.walkerFee}</TableCell>
                                       
                                        <TableCell>
                                            <EditIcon style={{ cursor: 'pointer' }} onClick={() => editPark(park)} >
                                            </EditIcon >
                                        </TableCell>
                                        <TableCell>
                                            <DeleteIcon style={{ cursor: 'pointer' }} onClick={() => deletePark(park)} />
                                        </TableCell>
                                        <TableCell>
                                        <Button variant="contained" onClick={() => getQrCode(park)} size="medium" color="secondary" 
                                        style={{ backgroundColor: '#ff6b81' }}> Download </Button>
                                            {/* <QrCodeIcon style={{ cursor: 'pointer' }} onClick={() => getQrCode(park)} /> */}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <TablePagination
                            component="div"
                            rowsPerPageOptions={[5, 100, 1000]}
                            count={parkList.length}
                            page={pg}
                            onPageChange={handleChangePage}
                            rowsPerPage={rpg}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </Widget>
                </Grid>
            </Grid>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Add Park</DialogTitle>
                <form onSubmit={formik.handleSubmit} >
                    <DialogContent style={{ width: 650 }}>
                        <TextField
                            style={{ width: 600 }}
                            id="parkName"
                            name="parkName"
                            label="Park Name"
                            type="text"
                            onChange={formik.handleChange}
                            value={formik.values.parkName}
                            error={formik.touched.parkName && Boolean(formik.errors.parkName)}
                            helperText={formik.touched.parkName && formik.errors.parkName}
                        />
                        <TextField
                            style={{ width: 600 }}
                            id="location"
                            name="location"
                            label="Location"
                            type="text"
                            onChange={formik.handleChange}
                            value={formik.values.location}
                            error={formik.touched.location && Boolean(formik.errors.location)}
                            helperText={formik.touched.location && formik.errors.location}
                        />
                        {/* <TextField
                            style={{ width: 600 }}
                            id="adult"
                            name="adult"
                            label="Adult"
                            type="text"
                            onChange={formik.handleChange}
                            value={formik.values.adult}
                            error={formik.touched.adult && Boolean(formik.errors.adult)}
                            helperText={formik.touched.adult && formik.errors.adult}
                        /> */}
                        {/* <TextField
                            style={{ width: 600 }}
                            id="child"
                            name="child"
                            label="Child"
                            type="text"
                            onChange={formik.handleChange}
                            value={formik.values.child}
                            error={formik.touched.child && Boolean(formik.errors.child)}
                            helperText={formik.touched.child && formik.errors.child}
                        /> */}
                        <Grid container alignContent="center" alignItems="center" direction="row" xs={12}>
                            <Grid item xs="auto" >
                                <FormControlLabel style={{ width: 250 }}
                                    control={<Checkbox

                                        onChange={formik.handleChange}
                                        value={formik.values.adult}
                                        checked={formik.values.adult} name="adult" />}
                                    label="adult"
                                />
                            </Grid>

                            <Grid item xs>
                                <TextField
                                    style={{ width: 344 }}
                                    id="adultFee"
                                    name="adultFee"
                                    label="adult Fee"
                                    type="text"
                                    disabled={!formik.values.adult}
                                    onChange={formik.handleChange}
                                    value={formik.values.adultFee}
                                    error={formik.touched.adultFee && Boolean(formik.errors.adultFee)}
                                    helperText={formik.touched.adultFee && formik.errors.adultFee}
                                />
                            </Grid>
                        </Grid>
                        <Grid container alignContent="center" alignItems="center" direction="row" xs={12}>
                            <Grid item xs="auto" >
                                <FormControlLabel style={{ width: 250 }}
                                    control={<Checkbox
                                        onChange={formik.handleChange}
                                        value={formik.values.child}
                                        checked={formik.values.child}
                                        name="child" />}
                                    label="Child "
                                />
                            </Grid>

                            <Grid item xs>
                                <TextField
                                    style={{ width: 344 }}
                                    id="childFee"
                                    name="childFee"
                                    label="Child Fee"
                                    type="text"
                                    disabled={!formik.values.child}
                                    onChange={formik.handleChange}
                                    value={formik.values.childFee}
                                    error={formik.touched.childFee && Boolean(formik.errors.childFee)}
                                    helperText={formik.touched.childFee && formik.errors.childFee}
                                />
                            </Grid>
                        </Grid>
                        <Grid container alignContent="center" alignItems="center" direction="row" xs={12}>
                            <Grid item xs="auto" >
                                <FormControlLabel style={{ width: 250 }}
                                    control={<Checkbox
                                        onChange={formik.handleChange}
                                        value={formik.values.seniorCitizen}
                                        checked={formik.values.seniorCitizen}
                                        name="seniorCitizen" />}
                                    label="Senior Citizen"
                                />
                            </Grid>

                            <Grid item xs>
                                <TextField
                                    style={{ width: 344 }}
                                    id="seniorCitizenFee"
                                    name="seniorCitizenFee"
                                    label="Senior Citizen Fee"
                                    type="text"
                                    disabled={!formik.values.seniorCitizen}
                                    onChange={formik.handleChange}
                                    value={formik.values.seniorCitizenFee}
                                    error={formik.touched.seniorCitizenFee && Boolean(formik.errors.seniorCitizenFee)}
                                    helperText={formik.touched.seniorCitizenFee && formik.errors.seniorCitizenFee}
                                />
                            </Grid>
                        </Grid>
                        <Grid container alignContent="center" alignItems="center" direction="row" xs={12}>
                            <Grid item xs="auto" >
                                <FormControlLabel style={{ width: 250 }}
                                    control={<Checkbox
                                        onChange={formik.handleChange}
                                        value={formik.values.women}
                                        checked={formik.values.women}
                                        name="women" />}
                                    label="Women"
                                />
                            </Grid>

                            <Grid item xs>
                                <TextField style={{ width: 344 }}
                                    id="womenFee"
                                    name="womenFee"
                                    label="Women Fee"
                                    disabled={!formik.values.women}
                                    type="text"
                                    onChange={formik.handleChange}
                                    value={formik.values.womenFee}
                                    error={formik.touched.womenFee && Boolean(formik.errors.womenFee)}
                                    helperText={formik.touched.womenFee && formik.errors.womenFee}
                                />
                            </Grid>
                        </Grid>
                        <Grid container alignContent="center" alignItems="center" direction="row" xs={12}>
                            <Grid item xs="auto">
                                <FormControlLabel style={{ width: 250 }}
                                    control={<Checkbox
                                        onChange={formik.handleChange}
                                        value={formik.values.physicallyChallenged}
                                        checked={formik.values.physicallyChallenged}
                                        name="physicallyChallenged" />}
                                    label="Physically Challenged"
                                />
                            </Grid>

                            <Grid item xs>
                                <TextField style={{ width: 344 }}
                                    id="physicallyChallengedFee"
                                    name="physicallyChallengedFee"
                                    label="Physically Challenged Fee"
                                    type="text"
                                    disabled={!formik.values.physicallyChallenged}
                                    onChange={formik.handleChange}
                                    value={formik.values.physicallyChallengedFee}
                                    error={formik.touched.physicallyChallengedFee && Boolean(formik.errors.physicallyChallengedFee)}
                                    helperText={formik.touched.physicallyChallengedFee && formik.errors.physicallyChallengedFee}
                                />
                            </Grid>
                        </Grid>
                        <Grid container alignContent="center" alignItems="center" direction="row" xs={12}>
                            <Grid item xs="auto">
                                <FormControlLabel style={{ width: 250 }}
                                    control={<Checkbox

                                        onChange={formik.handleChange}
                                        value={formik.values.camera}
                                        checked={formik.values.camera}
                                        name="camera" />}
                                    label="Video Camera"
                                />

                            </Grid>

                            <Grid item xs>
                                <TextField style={{ width: 344 }}
                                    id="cameraFee"
                                    name="cameraFee"
                                    label="Camera Fee"
                                    type="text"
                                    disabled={!formik.values.camera}
                                    onChange={formik.handleChange}
                                    value={formik.values.cameraFee}
                                    error={formik.touched.cameraFee && Boolean(formik.errors.cameraFee)}
                                    helperText={formik.touched.cameraFee && formik.errors.cameraFee}
                                />
                            </Grid>
                        </Grid>
                        <Grid container alignContent="center" alignItems="center" direction="row" xs={12}>
                            <Grid item xs="auto">
                                <FormControlLabel style={{ width: 250 }}
                                    control={<Checkbox
                                        onChange={formik.handleChange}
                                        value={formik.values.photography}
                                        checked={formik.values.photography}
                                        name="photography" />}
                                    label="Photography"
                                />

                            </Grid>

                            <Grid item xs>
                                <TextField style={{ width: 344 }}
                                    id="photographyFee"
                                    name="photographyFee"
                                    label="Photography Fee"
                                    type="text"
                                    disabled={!formik.values.photography}
                                    onChange={formik.handleChange}
                                    value={formik.values.photographyFee}
                                    error={formik.touched.photographyFee && Boolean(formik.errors.photographyFee)}
                                    helperText={formik.touched.photographyFee && formik.errors.photographyFee}
                                />
                            </Grid>
                        </Grid>

                        <Grid container alignContent="center" alignItems="center" direction="row" xs={12}>
                            <Grid item xs="auto">
                                <FormControlLabel style={{ width: 250 }}
                                    control={<Checkbox
                                        onChange={formik.handleChange}
                                        value={formik.values.shooting}
                                        checked={formik.values.shooting}
                                        name="shooting" />}
                                    label="Shooting"
                                />
                            </Grid>

                            <Grid item xs>
                                <TextField style={{ width: 344 }}
                                    id="shootingFee"
                                    name="shootingFee"
                                    label="Shooting Fee"
                                    disabled={!formik.values.shooting}
                                    type="text"
                                    onChange={formik.handleChange}
                                    value={formik.values.shootingFee}
                                    error={formik.touched.shootingFee && Boolean(formik.errors.shootingFee)}
                                    helperText={formik.touched.shootingFee && formik.errors.shootingFee}
                                />
                            </Grid>
                        </Grid>
                        <Grid container alignContent="center" alignItems="center" direction="row" xs={12}>
                            <Grid item xs="auto">
                                <FormControlLabel style={{ width: 250 }}
                                    control={<Checkbox
                                        onChange={formik.handleChange}
                                        value={formik.values.walker}
                                        checked={formik.values.walker}
                                        name="walker" />}
                                    label="Walker"
                                />
                            </Grid>

                            <Grid item xs>
                                <TextField style={{ width: 344 }}
                                    id="walkerFee"
                                    name="walkerFee"
                                    label="walker Fee"
                                    disabled={!formik.values.walker}
                                    type="text"
                                    onChange={formik.handleChange}
                                    value={formik.values.walkerFee}
                                    error={formik.touched.walkerFee && Boolean(formik.errors.walkerFee)}
                                    helperText={formik.touched.walkerFee && formik.errors.walkerFee}
                                />
                            </Grid>
                        </Grid>

                        <Grid container alignContent="center" alignItems="center" direction="row" xs={12}>
                            <Grid item xs="auto">
                                <FormControlLabel style={{ width: 250 }}
                                    control={<Checkbox
                                        onChange={formik.handleChange}
                                        value={formik.values.isCloakRoom}
                                        checked={formik.values.isCloakRoom}
                                        name="isCloakRoom" />}
                                    label="Cloak Room Available"
                                />
                            </Grid>
                        </Grid>

                        <Grid container alignContent="center" alignItems="center" direction="row" xs={12}>
                            <Grid item xs="auto">
                                <FormControlLabel style={{ width: 250 }}
                                    control={<Checkbox
                                        onChange={formik.handleChange}
                                        value={formik.values.isHolidays}
                                        checked={formik.values.isHolidays}
                                        name="isHolidays" />}
                                    label="Holidays"
                                />
                            </Grid>
                        </Grid>
                        {formik.values.isHolidays ? (<Grid container alignContent="center" alignItems="center" direction="row" xs={12}>
                            <Grid item xs="auto">
                                {/* <FormControlLabel style={{ width: 250 }}
                                    control={<Checkbox checked={checkboxes.isHolidays} onChange={handleCheckboxChange} name="isHolidays" />}
                                    label="Holidays"
                                /> */}
                                <FormControl
                                    required

                                    component="fieldset"
                                    sx={{ m: 3 }}
                                    variant="standard"
                                >
                                    <FormLabel component="legend">Selecte Holiday</FormLabel>
                                    <FormGroup>
                                        <FormControlLabel
                                            control={
                                                <Checkbox checked={holidays.mon} onChange={handleHolidaysChange} name="mon" />
                                            }
                                            label="Mon"
                                        />
                                        <FormControlLabel
                                            control={
                                                <Checkbox checked={holidays.tue} onChange={handleHolidaysChange} name="tue" />
                                            }
                                            label="Tue"
                                        />
                                        <FormControlLabel
                                            control={
                                                <Checkbox checked={holidays.wed} onChange={handleHolidaysChange} name="wed" />
                                            }
                                            label="Wed"
                                        />
                                        <FormControlLabel
                                            control={
                                                <Checkbox checked={holidays.thu} onChange={handleHolidaysChange} name="thu" />
                                            }
                                            label="Thu"
                                        />
                                        <FormControlLabel
                                            control={
                                                <Checkbox checked={holidays.fri} onChange={handleHolidaysChange} name="fri" />
                                            }
                                            label="Fri"
                                        />
                                        <FormControlLabel
                                            control={
                                                <Checkbox checked={holidays.sat} onChange={handleHolidaysChange} name="sat" />
                                            }
                                            label="Sat"
                                        />
                                        <FormControlLabel
                                            control={
                                                <Checkbox checked={holidays.sun} onChange={handleHolidaysChange} name="sun" />
                                            }
                                            label="Sun"
                                        />
                                    </FormGroup>

                                </FormControl>
                            </Grid>


                        </Grid>) : ''}
                        <Grid container alignContent="center" alignItems="center" direction="row" xs={12}>
                        <Grid item xs="auto">
                            <form className={classes.container} noValidate>
                                <TextField
                                    id="startTiming"
                                    label=" Park Start Timing"
                                    type="time"
                                    defaultValue="07:30"
                                    className={classes.textField}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    inputProps={{
                                        step: 300, // 5 min
                                    }}
                                />
                            </form>
                        </Grid>
                        <Grid item xs>
                        <form className={classes.container} noValidate>
                                <TextField
                                    id="endTiming"
                                    label="Park End Timing"
                                    type="time"
                                    defaultValue="07:30"
                                    className={classes.textField}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    inputProps={{
                                        step: 300, // 5 min
                                    }}
                                />
                            </form>
                        </Grid>
                        </Grid>
                        <TextField
                            style={{ width: 427 }}
                            id="note"
                            name="note"
                            label="Note"
                            type="text"
                            onChange={formik.handleChange}
                            value={formik.values.note}
                            error={formik.touched.note && Boolean(formik.errors.note)}
                            helperText={formik.touched.note && formik.errors.note}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button type="submit" >Add</Button>
                    </DialogActions>
                </form>
            </Dialog>
        </>
    );

}



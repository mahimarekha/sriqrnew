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
        backgroundColor: "#857e7ef7",
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
export default function BookingReport() {
    const tableHeaders = ['Park Name', 'Booking Details', 'Total', 'Mobile'];
    const classes = useStyles();
    const [ticketBooking, setTicketBooking] = useState([]);
    const [parkList, setParkList] = useState([]);
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
        // getTicketBookingList();
        getProfileIdList();
        // getQrCode()
        return () => {
              setTicketBookingList([]);
        }
    }, []);

    const getTicketBookingList = () => {
        TicketBookingService.getAllTicketBooking().then((res) => {
            setTicketBookingList(res);
        }).catch((err) => {
            // setError(err.message);
        });
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
    return (
        <>
            <PageTitle title="Booking Reports" />
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
                                {ticketBookingList.slice(pg * rpg, pg * rpg + rpg).map((ticketBooking, bookingReport) => (
                                    <TableRow key={ticketBooking._id}>
                                        <TableCell className="pl-3 fw-normal" >{ticketBooking.parkId?.parkName}</TableCell>
                                        <TableCell>
                                            <TableBody>
                                                {ticketBooking.fee.map((item, subIndex) => (
                                                    <TableRow>
                                                        <TableCell className="pl-3 fw-normal">
                                                            <span >{item.name}</span>
                                                        </TableCell>
                                                        <TableCell className="pl-3 fw-normal">
                                                            <span >{item.price}</span>
                                                        </TableCell>
                                                        <TableCell className="pl-3 fw-normal">
                                                            <span  >{item.quantity}</span>
                                                        </TableCell>
                                                        <TableCell className="pl-3 fw-normal">
                                                            <span  >{item.totalprice}</span>
                                                        </TableCell>
                                                    </TableRow>

                                                ))

                                                }

                                            </TableBody>
                                        </TableCell>
                                        <TableCell className="pl-3 fw-normal" >{ticketBooking.totalAmount}</TableCell>
                                        <TableCell className="pl-3 fw-normal" >{ticketBooking.mobile}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <TablePagination
                            component="div"
                            rowsPerPageOptions={[5, 100, 1000]}
                            count={ticketBookingList.length}
                            page={pg}
                            onPageChange={handleChangePage}
                            rowsPerPage={rpg}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </Widget>
                </Grid>
            </Grid>

        </>
    );

}



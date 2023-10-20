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
import CoachingService from "./Locality/Service/coachingService";
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
export default function Coaching() {
    const tableHeaders = ['Batch Number', 'Start Date', 'End Date', 'Start Time', 
    'End Time', 'Fee', 'In Take','Edit','Delete','Download'];
    const classes = useStyles();
    const [coachingList, setCoachingList] = useState([]);
    const [getParksList, setParks] = useState([]);
    const [qrCode, setQrCode] = useState([]);
    const [open, setOpen] = React.useState(false);
    const [pg, setpg] = React.useState(0);
    const [rpg, setrpg] = React.useState(5);
    const [ticketBookingList, setTicketBookingList] = useState([]);
    const [coaching, setCoaching] = useState({
        batchName: '',
        startDate: '',
        endDate: '',
        startTime: '',
        endTime: '',
        fee: '',
        inTake: '',
        
    });
  
    const validationSchema = Yup.object().shape({
        batchName: Yup.string().required('batch name is required'),
        startDate: Yup.string().required('start date is required'),
        endDate: Yup.string().required('end date is required'),
        startTime: Yup.string().required('start time is required'),
        endTime: Yup.string().required('end time is required'),
        fee: Yup.string().required('fee is required'),
        inTake: Yup.string().required('in take is required'),
       
    });
    const handleChangePage = (event, newpage) => {
        setpg(newpage);
    }
    const handleCheckboxChange = (event) => {
        const { name, checked } = event.target;
    };

    const handleHolidaysChange = (event) => {
      
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
            setCoachingList([]);
            setQrCode([]);
           
        }
    }, []);
    
    // const getTicketBookingList = () => {
    //     TicketBookingService.getAllTicketBooking().then((res) => {
    //         setTicketBookingList(res);
    //     }).catch((err) => {
    //         // setError(err.message);
    //     });
    // }
  
 
    const getProfileId = ()=>{
        const userDetails = JSON.parse(localStorage.getItem("userDetail"));
console.log(userDetails.role)

   const result = userDetails.role==="admin" ? null:userDetails.profileId;
   console.log(result)
   CoachingService.addAllProfileId({profileRegistrationId:result }).then((res) => {
    const updatedData = res.map(item => {
        return { ...item, uistartDate: dateAndTime(item.startDate),
            uiendDate:dateAndTime(item.endDate) };
    });
            setCoachingList(updatedData);
    }).catch((err) => {
        // setError(err.message);
    });
}
const dateAndTime = (date) => {

    const systemDate = new Date(date);
    const formattedDateTime = systemDate.toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',

    });
    return formattedDateTime;
}
    const getQrCode = (data) => {
       
        CoachingService.qrCode(data._id).then((res) => {
            
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
    
    const editCoaching = (coaching) => {
        coaching.startDate=new Date(coaching.startDate);
        debugger
        setCoaching(coaching);
        handleOpen();
    

    }
 
    const deleteCoaching = (coachingdelete) => {
        if (coachingdelete) {
            CoachingService.deleteCoaching(coachingdelete).then((res) => {
                //getParkList();
                getProfileId()
                onSubmit()
            }).catch((err) => {
            });
        }
    };

    const formik = useFormik({
        initialValues: coaching,
        enableReinitialize: true,
        validationSchema: validationSchema,
        onSubmit: (values, { resetForm }) => {
            const userDetails = JSON.parse(localStorage.getItem("userDetail"));
           
            values.profileRegistrationId = userDetails.profileId;
            if (coaching._id) {
                CoachingService.upadeCoaching(values).then((res) => {
                    handleClose();
                  //  getParkList();
                  getProfileId();
                    resetForm()
                    alert("Coaching Updated Successfully.");
                }).catch((err) => {
                });
            }
            else {
                
                console.log(values)
                // values.holidayDays = holidays;
                            

                CoachingService.creteCoaching(values).then((res) => {
                    //getParkList();
                    getProfileId();
                    resetForm();
                    handleClose();
                    alert(" Coaching Added Successfully.");
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
        
            <PageTitle title="Batches" button={<Button
                variant="contained" onClick={handleOpen}
                size="medium"
                color="secondary" style={{ backgroundColor: '#ff6b81' }}> Add Batches
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
                                {coachingList.slice(pg * rpg, pg * rpg + rpg).map((coaching) => (
                                    <TableRow key={coaching._id}>
                                        <TableCell className="pl-3 fw-normal" >{coaching.batchName}</TableCell>
                                        <TableCell className="pl-3 fw-normal" >{coaching.uistartDate}</TableCell>
                                        <TableCell className="pl-3 fw-normal" >{coaching.uiendDate}</TableCell>
                                        <TableCell className="pl-3 fw-normal" >{coaching.startTime}</TableCell>
                                        <TableCell className="pl-3 fw-normal" >{coaching.endTime}</TableCell>
                                        <TableCell className="pl-3 fw-normal" >{coaching.fee}</TableCell>
                                        <TableCell className="pl-3 fw-normal" >{coaching.inTake}</TableCell>
                                        
                                       
                                        <TableCell>
                                            <EditIcon style={{ cursor: 'pointer' }} onClick={() => editCoaching(coaching)} >
                                            </EditIcon >
                                        </TableCell>
                                        <TableCell>
                                            <DeleteIcon style={{ cursor: 'pointer' }} onClick={() => deleteCoaching(coaching)} />
                                        </TableCell>
                                        <TableCell>
                                        <Button variant="contained" onClick={() => getQrCode(coaching)} size="medium" color="secondary" 
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
                            count={coachingList.length}
                            page={pg}
                            onPageChange={handleChangePage}
                            rowsPerPage={rpg}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </Widget>
                </Grid>
            </Grid>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Add orgnaization</DialogTitle>
                <form onSubmit={formik.handleSubmit} >
                    <DialogContent style={{ width: 519 }}>
                        <TextField
                        
                            style={{ width: 423 }}
                            id="batchName"
                            name="batchName"
                            label="Batch Number"
                            type="text"
                            onChange={formik.handleChange}
                            value={formik.values.batchName}
                            error={formik.touched.batchName && Boolean(formik.errors.batchName)}
                            helperText={formik.touched.batchName && formik.errors.batchName}
                        />
                       <TextField
                        style={{ width: 198 }}
                        //  InputProps={{ style: { width: 198 } }}
                                            id="startDate"
                                            name="startDate"
                                            label="Start Date"
                                            type="date"
                                           
                                            value={formik.values.startDate}
                                            onChange={formik.handleChange}
                                            error={formik.touched.startDate && Boolean(formik.errors.startDate)}
                            helperText={formik.touched.startDate && formik.errors.startDate}
                                            className={classes.textField}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                        />
                                         <TextField
                                         style={{ width: 198 }}
                                        //  InputProps={{ style: { width: 198 } }}
                                            id="endDate"
                                            name="endDate"
                                            label="End Date"
                                            type="date"
                                          
                                            value={formik.values.endDate}
                                            onChange={formik.handleChange}
                                            error={formik.touched.endDate && Boolean(formik.errors.endDate)}
                            helperText={formik.touched.endDate && formik.errors.endDate}
                                            className={classes.textField}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                        />
                    
                        <Grid container alignContent="center" alignItems="center" direction="row" xs={12}>
                        <Grid item xs="auto">
                            <form className={classes.container} noValidate>
                                <TextField
                                    id="startTime"
                                    name="startTime"
                                    label=" Start Timing"
                                    type="time"
                                    value={formik.values.startTime}
                                    onChange={formik.handleChange}
                                    error={formik.touched.startTime && Boolean(formik.errors.startTime)}
                    helperText={formik.touched.startTime && formik.errors.startTime}
                                   
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
                                    id="endTime"
                                    name="endTime"
                                    label=" End Timing"
                                    type="time"
                                    value={formik.values.endTime}
                                    onChange={formik.handleChange}
                                    error={formik.touched.endTime && Boolean(formik.errors.endTime)}
                    helperText={formik.touched.endTime && formik.errors.endTime}
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
                            id="fee"
                            name="fee"
                            label="GST"
                            type="text"
                            onChange={formik.handleChange}
                            value={formik.values.fee}
                            error={formik.touched.note && Boolean(formik.errors.fee)}
                            helperText={formik.touched.fee && formik.errors.fee}
                        />
                        <TextField
                            style={{ width: 427 }}
                            id="inTake"
                            name="inTake"
                            label="No. of student intake"
                            type="text"
                            onChange={formik.handleChange}
                            value={formik.values.inTake}
                            error={formik.touched.inTake && Boolean(formik.errors.inTake)}
                            helperText={formik.touched.inTake && formik.errors.inTake}
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



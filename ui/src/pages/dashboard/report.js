import React, { useState } from "react";
import {
    Button, FormControl, InputLabel, MenuItem, TableRow, Table, TableHead,
    TableBody, TableCell
} from "@material-ui/core";
import ParkService from "../dashboard/Locality/Service/parkService";
import { Grid, Card, Box, Select, TextField } from "@material-ui/core";
import { useEffect } from 'react';
import ticketBookingService from "./Locality/Service/ticketBookingService";
import TablePagination from '@material-ui/core/TablePagination';
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
export default function Report() {
    //const tableHeaders = [ 'Date'];
    const [tableHeaders, settableHeaders] = useState(['Date']);
    const classes = useStyles();
    const [parkId, setParkId] = useState("");
    const [result, setResult] = useState([]);
    const [reportList, setReportList] = useState([]);
    const [pg, setpg] = React.useState(0);
    const [parkList, setParkList] = useState([]);
    const [rpg, setrpg] = React.useState(5);
    const [startDate1, setStartDate1] = useState('');
    const [endDate1, setEndDate1] = useState('');
    const [age, setAge] = React.useState('');
    const [getReport, setGetReport] = useState([]);
    const [open, setOpen] = React.useState(false);
    const current = new Date();
    const date = `${current.getFullYear()}-0${current.getMonth() + 1}-${current.getDate()}`;
    const [activity, setActivity] = useState({
        classId: '',
        startDate: '',
        endDate: '',
        description: '',
        activityName: '',
        status: '',
    });

    useEffect(() => {
        // getParkList();
        getProfileId();
        return () => {
            setReportList([]);
            // setParkList([]);
            setGetReport([]);
        }
    }, []);
    const handleChangeRowsPerPage = (event) => {
        setrpg(parseInt(event.target.value, 10));
        setpg(0);
    }
    const getProfileId = () => {
        const userDetails = JSON.parse(localStorage.getItem("userDetail"));
        console.log(userDetails.role)

        const result = userDetails.role === "admin" ? null : userDetails.profileId;
        console.log(result)
        ParkService.addAllProfileId({ profileRegistrationId: result }).then((res) => {
            if (res.length > 0) {
                setParkList(res);
                const firstValue = res[0];
                setParkId(firstValue._id);
                onSubmit(firstValue._id);
            } else {
                setParkList(res);
            }
        }).catch((err) => {
            // setError(err.message);
        });
    }
    const sumFee = (data) => {
        const mergedFeeDetails = {};
        data.forEach((document) => {
            // Iterate through the fee array of each document
            document.fee.forEach((feeDetail) => {
                const name = feeDetail.name;
                const price = feeDetail.price;
                const qty = feeDetail.quantity;
                if (!mergedFeeDetails[name + ' amount']) {
                    // If the name doesn't exist in the merged object, create it
                    // mergedFeeDetails[name] = price;
                    mergedFeeDetails[name + ' amount'] = price;
                    mergedFeeDetails[name + ' Count'] = qty;
                } else {
                    // If the name already exists, add the price to the existing sum
                    mergedFeeDetails[name + ' amount'] += price;
                    mergedFeeDetails[name + ' Count'] += qty;
                    //  mergedFeeDetails[name] += price;
                }
            });
        });
        return mergedFeeDetails;
    }
    const totalSum = (data) => {
        const mergedFeeDetails = {};
        data.forEach((document) => {
            // Iterate through the fee array of each document
            document.fee.forEach((feeDetail) => {
                const name = feeDetail.name;
                const price = feeDetail.price;
                const qty = feeDetail.quantity;
                if (!mergedFeeDetails[name + ' amount']) {
                    // If the name doesn't exist in the merged object, create it
                    // mergedFeeDetails[name] = price;
                    mergedFeeDetails[name + ' amount'] = price;
                } else {
                    // If the name already exists, add the price to the existing sum
                    mergedFeeDetails[name + ' amount'] += price;
                    //  mergedFeeDetails[name] += price;
                }
            });
        });
        const values = Object.values(mergedFeeDetails); // Extract the values into an array
        const sum = values.reduce((acc, currentValue) => acc + currentValue, 0); // Calculate the sum
        return sum;
    }
    const onSubmit = data => {
        const report = JSON.parse(localStorage.getItem("userDetail"));
        let newstartDate1 = startDate1 ? startDate1 : null;
        let newendDate1 = endDate1 ? endDate1 : null;

        const keys = { "parkId": data ? data : parkId, "startDate": newstartDate1, "endDate": `${newendDate1}T23:59:00.000Z` }
        ticketBookingService.getTicketBookingList(keys).then((res) => {
            if (res.length) {
                const result = res.map(result => {
                    return {
                        Date: result.createdAt,
                        ...sumFee(result.documents),
                        'Total Amount': `₹ ${totalSum(result.documents)}`,
                    }
                });
                const headerDetails = Object.keys(result[0]).map(key => key);
                settableHeaders(headerDetails);
                // excelExport(res);
              
                setGetReport(result);
            } else {
                setGetReport([]);
            }

            // setResult(result);
        }).catch((err) => {
        });
    };

    // const getStudentList = (event, obj) => {
    //     const userDetails = JSON.parse(localStorage.getItem("userDetail"));
    //     StudentService.getAllStudentById(userDetails.schoolId,

    //     ).then((res) => {
    //         const studentDetails = res.map(res => {
    //             return { _id: res._id, studentName: `${res.firstName} ${res.lastName}`, status: true };
    //         })
    //         setStudentList(studentDetails);

    //         if (obj) {
    //             setActivity(obj);
    //         }
    //     }).catch((err) => {
    //         // setError(err.message);
    //     });
    // }

    const getParkList = () => {
        ParkService.getAllPark().then((res) => {

            setParkList(res);

        }).catch((err) => {
            // setError(err.message);
        });
    }
    const handleChangePage = (event, newpage) => {
        setpg(newpage);
    }
    return (
        <>
            <PageTitle title="Reports" />
            <Card sx={{ maxWidth: 345 }}>
                <Box   >
                    <div >
                        <form >
                            <Grid container spacing={2} columns={12} style={{ margin: 10 }}  >
                                <Grid item xs={6} sm={6} md={3} >
                                    <FormControl className={classes.formControl} fullWidth="true"
                                    >
                                        <InputLabel id="demo-simple-select-label">Select Park</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            name="parkId"
                                            label="Select Park"
                                            value={parkId}
                                            onChange={(e) => setParkId(e.target.value)}

                                        // error={formik.touched.parkId && Boolean(formik.errors.parkId)}
                                        // helperText={formik.touched.parkId && formik.errors.parkId}
                                        >
                                            <MenuItem value="">
                                                <em>None</em>
                                            </MenuItem>

                                            {parkList.map(({ _id, parkName }) => (
                                                <MenuItem key={_id} value={_id}>{parkName}

                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={6} sm={6} md={3}>
                                    <form className={classes.container} noValidate>
                                        <TextField InputProps={{ style: { width: 150 } }}
                                            id="dob"
                                            name="dob"
                                            label="Start Date"
                                            type="date"
                                            min="2016-11-10"
                                            max="2022-11-10"
                                            value={startDate1}
                                            onChange={e => { getParkList(e.target.value); setStartDate1(e.target.value) }}
                                            className={classes.textField}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                        />
                                    </form>
                                </Grid>
                                <Grid item xs={6} sm={6} md={3} >
                                    <TextField InputProps={{ style: { width: 120 } }}
                                        id="dob"
                                        name="dob"
                                        label="End Date"
                                        type="date"
                                        min="2016-11-10"
                                        max="2022-11-10"
                                        value={endDate1}
                                        onChange={e => { setEndDate1(e.target.value) }}
                                        // defaultValue="2017-05-24"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6} sm={6} md={3} >
                                    <Button style={{ backgroundColor: 'rgb(255 107 129)', color: 'white' }}
                                        type="button" onClick={() => onSubmit()} variant="contained" >
                                        Search</Button>
                                </Grid>
                                {/* <Grid item xs={6} sm={6} md={3}  >
                                <ExportExcel   excelData={result} fileName={'Student Activity'} />
                                </Grid> */}
                            </Grid>
                        </form>
                    </div>
                </Box>
            </Card>
            <Grid container spacing={4}>
                <Grid item xs={12}>
                    <Widget title="" upperTitle noBodyPadding bodyClass={classes.tableOverflow}>
                        {getReport.length > 0 ? (
                            <Table className="mb-0">
                                <TableHead >
                                    <TableRow>
                                        {tableHeaders.map(key => (
                                            <StyledTableCell key={key}>{key}</StyledTableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>

                                    {getReport.slice(pg * rpg, pg * rpg + rpg).map((report) => (
                                        <TableRow key={report._id}>

                                            {tableHeaders.map(key => (
                                                <TableCell className="pl-3 fw-normal" >{report[key] ? report[key] : 0}</TableCell>
                                            ))}

                                           
                                        </TableRow>

                                    ))}
                                    {/* ))} */}
                                </TableBody>
                            </Table>
                        ) : (
                            <p style={{ textAlign: "center" }}> No data to display.</p>
                        )}

                        <TablePagination
                            component="div"
                            rowsPerPageOptions={[5, 50, 100, 500, 1000]}
                            count={reportList.length}
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



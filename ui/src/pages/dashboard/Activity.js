import React, { useState } from "react";
import {
    Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem,
    TableRow, Table,
    TableHead,
    TableBody,
    TableCell
} from "@material-ui/core";

import {  Card, Box } from "@material-ui/core";
import ActivityService from "./Locality/Service/activityService";
import ActivityTabelService from "./Locality/Service/activityTabelService";
import SubActivityService from "./Locality/Service/subActivityService";
import StudentService from "./Locality/Service/studentService"
import SuperActivityService from "./Locality/Service/superActivityService"
import * as Yup from 'yup';
import { Grid, Select, TextField } from "@material-ui/core";
import { useFormik } from 'formik';
import { useEffect } from 'react';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import TablePagination from '@material-ui/core/TablePagination';
import Widget from "../../components/Widget/Widget";
import PageTitle from "../../components/PageTitle/PageTitle";
import { withStyles, makeStyles } from '@material-ui/core/styles';
import AddClassService from "./Locality/Service/addClassService";
const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: "#6c0f0e",
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
export default function ActivityExpected() {
    const tableHeaders = [ 'Student Name', 'Area Of Work', 'List Of Activities','Exercise','Date','Edit', 'Delete'];
    const classes = useStyles();
    const [activityList, setActivityList] = useState([]);
    const [studentList, setStudentList] = useState([]);
    const [subActivityList, setSubActivityList] = useState([]);
    const [classNameList, setClassNameList] = useState([]);
    const [age, setAge] = React.useState('');
    var [error, setError] = useState(null);
    const [activityIdList, setActivityIdList] = useState([]);
    const [open, setOpen] = React.useState(false);
    const [addClassList, setAddClassList] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    var [studentId, setStudentId] = useState("");
    const [subActivityIdList, setSubActivityIdList] = useState([]);
    const [addActivityList, setAddActivityList] = useState([]);
    const [addSuperActivityList, setAddSuperActivityList] = useState([]);
    const today = new Date();

    const getWeekStartEnd = (date) => {
        const startOfWeek = new Date(date);
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
        const endOfWeek = new Date(date);
        endOfWeek.setDate(endOfWeek.getDate() + (5 - endOfWeek.getDay()));

        let startDay = startOfWeek.getDate();
        let startMonth = startOfWeek.getMonth()+1;
        let startYear = startOfWeek.getFullYear();
        if (startDay < 10) {
            startDay = '0' + startDay;
        }
        
        if (startMonth < 10) {
            startMonth = `0${startMonth}`;
        }
        let format = startYear  + "-" + startMonth + "-" + startDay;

        let endDay = endOfWeek.getDate();
        let endMonth = endOfWeek.getMonth()+1;
        let endYear = endOfWeek.getFullYear();
        if (endDay < 10) {
            endDay = '0' + endDay;
        }
        
        if (endMonth < 10) {
            endMonth = `0${endMonth}`;
        }
      
        let format1 = endYear + "-" + endMonth + "-" + endDay;
        
        return { start: format, end: format1 };
    }
    const date = new Date();
const week = getWeekStartEnd(date);
    const [pg, setpg] = React.useState(0);
    const [rpg, setrpg] = React.useState(5);
  const year = today.getFullYear();
//   const today = dayjs();
    const [activity, setActivity] = useState({
        // classId: '',
        sfd:'',
        studentId:'',
        superActivityId:'',
        activityId: '',
        subActivityId:'',
        remarks:'',
    });
    const handleChangePage=(event, newpage) =>{
        setpg(newpage);
    }
  
    const handleChangeRowsPerPage=(event)=> {
        setrpg(parseInt(event.target.value, 10));
        setpg(0);
    }
    const validationSchema = Yup.object().shape({
        // classId: Yup.string().required('Class Name is required'),
        studentId:Yup.string().required('Student Name is required'),
        activityId: Yup.string().required('ActivityName is required'),
        subActivityId:Yup.string().required('Sub ActivityName is required'),
        // academicYear:Yup.string(),
        remarks:Yup.string(),
        planning:Yup.string(),
        sfd:Yup.string(),
    });
    useEffect(() => {
        getActivityList();
        getAddClassList();
       // getStudentActivityList();
        getStudentList()
        getSuperActivityList();
        setStartDate(week.start);
        setEndDate(week.end);
        
        onSubmit();
        return () => {
            setSubActivityList([]);
            setActivityIdList([]);
            setActivityList([]);
            setAddClassList([]);
            setStudentList([]);
            setAddSuperActivityList([]);
            // setClassNameList([]);
        }
    }, []);
    
    const getSuperActivityList = () => {
        const userDetails = JSON.parse(localStorage.getItem("userDetail"));
        SuperActivityService.getAllSuperActivity(userDetails.schoolId).then((res) => {
            setAddSuperActivityList(res);
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
    const handleChange = (event) => {
        setAge(event.target.value);
    };
    const onSubmit = data => {
        const userDetails = JSON.parse(localStorage.getItem("userDetail"));
        const newstartDate = startDate ? startDate : week.start;
        const newendDate = endDate ? endDate : week.end;

        const keys = {  "schooleId": userDetails.schoolId, "studentId": studentId, "startDate":newstartDate,"endDate":newendDate  }
        ActivityService.findActivityList(keys).then((res) => {
            // setClassValue("");
            setActivityList(res);
           // setStudentList(res);
        }).catch((err) => {
            // setError(err.message);
        });
        
    };
    const getActivityList = () => {
        const userDetails = JSON.parse(localStorage.getItem("userDetail"));
        ActivityTabelService.getAllActivityTabel(userDetails.schoolId).then((res) => {
            setAddActivityList(res);
        }).catch((err) => {
            // setError(err.message);
        });
    }
    const getStudentList = (event,obj) => {
        const userDetails = JSON.parse(localStorage.getItem("userDetail"));
        StudentService.getAllStudentById(userDetails.schoolId,
            //  { classId: event }
            
             ).then((res) => {
            const studentDetails = res.map(res => {
                return { _id: res._id, studentName: res.studentName, status: true };
            })
            setStudentList(studentDetails);
            
if(obj){
    setActivity(obj);
}
        }).catch((err) => {
            // setError(err.message);
        });
    }
    
    const getStudentActivityList = () => {
        const userDetails = JSON.parse(localStorage.getItem("userDetail"));
        ActivityTabelService.getStudentActivity(userDetails.schoolId,true).then((res) => {

            setActivityList(res);
        }).catch((err) => {
            // setError(err.message);
        });
    }
    const getSubActivityList = (event, obj) => {
        const userDetails = JSON.parse(localStorage.getItem("userDetail"));
        const getsubActList = {schooleId:userDetails.schoolId, activityId:event.target.value};
        SubActivityService.getAllSubActivityByActivityId(getsubActList).then((res) => {
            setSubActivityList(res);
            if(obj){
                setActivity(obj);
            }
        }).catch((err) => {
            // setError(err.message);
        });
    }
    const getAddClassList = () => {
        const userDetails = JSON.parse(localStorage.getItem("userDetail"));
        AddClassService.getAllAddClass(userDetails.schoolId).then((res) => {
            setAddClassList(res);
        }).catch((err) => {
            // setError(err.message);
        });
    }
    const getClassNameList = (event) => {
        AddClassService.getAddClassNameById({ className: event.target.value }).then((res) => {
            setClassNameList(res);
        }).catch((err) => {
            setError(err.message);
        });
    }
    const editActivity = (useractivitys) => {
       const obj = JSON.parse(JSON.stringify(useractivitys));
    //    obj.classId = useractivitys.classId ? useractivitys.classId._id : '';
       obj.studentId = useractivitys.studentId ? useractivitys.studentId._id : '';
       obj.superActivityId = useractivitys.superActivityId ? useractivitys.superActivityId._id : '';
       obj.activityId = useractivitys.activityId ? useractivitys.activityId._id : '';
       obj.subActivityId = useractivitys.subActivityId ? useractivitys.subActivityId._id  : '';
        getStudentList(
            // obj.classId,
            obj);
       
       getSubActivityList({target:{value:obj.activityId}},obj);
        
        //getStudentActivityList(useractivitys.classId);

setActivity(obj);
       
        handleOpen()
    }
    const deleteActivity = (activitydelete) => {
        if (activitydelete) {
            ActivityService.deleteActivity(activitydelete).then((res) => {
                
                onSubmit()
            }).catch((err) => {
            });
        }
    };
    const formik = useFormik({
        initialValues: activity,
        enableReinitialize: true,
        validationSchema: validationSchema,
        onSubmit: (values, { resetForm }) => {
            const userDetails = JSON.parse(localStorage.getItem("userDetail"));
            values.schooleId = userDetails.schoolId;
            values.authorizedPerson=userDetails.email
            values.isFuturePlanning=true;
            values.key="Future Plane"
            if (activity._id) {
                ActivityService.upadeActivity(values).then((res) => {
                    handleClose();
                    // getActivityList();
                    onSubmit()
                    resetForm()
                    alert("Activity Updated Successfully.");
                }).catch((err) => {
                });
            }


            else {
                let currentYear = new Date().getFullYear();
                let nextYear = new Date().getFullYear() + 1;
                console.log(currentYear + "-" + nextYear);
                values['academicYear'] = currentYear + "-" + nextYear;
                ActivityService.creteActivity(values).then((res) => {
                    
                    // getActivityList();
                    onSubmit()
                    
                    resetForm();
                    handleClose();
                    alert(" Activity Added Successfully.");
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
            <PageTitle title=" Master" button={<Button
                variant="contained" onClick={handleOpen}
                size="medium"
                color="secondary" style={{ backgroundColor: '#6c0f0e' }}> Add Master
            </Button>} />
            <Card sx={{ maxWidth: 345 }}>
            <Box   >
            <div >
                        <form
                        // onSubmit={formik.handleSubmit} 
                        >
                           
            <Grid container spacing={2} columns={12}>
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

                                {activityList.slice(pg * rpg, pg * rpg + rpg).map((activitydetails) => (
                                    <TableRow key={activitydetails._id}>

                                        {/* <TableCell className="pl-3 fw-normal" >{activitydetails.classId ? activitydetails.classId.className : ''}</TableCell> */}
                                        
                                        <TableCell className="pl-3 fw-normal" >{activitydetails.studentId.studentName}</TableCell>
                                        <TableCell className="pl-3 fw-normal" >{activitydetails.superActivityId ? activitydetails.superActivityId.superActivityName : ''}</TableCell>
                                        <TableCell className="pl-3 fw-normal" >{activitydetails.activityId ? activitydetails.activityId.activityName : ''}</TableCell>
                                        <TableCell className="pl-3 fw-normal" >{activitydetails.subActivityId ? activitydetails.subActivityId.subActivityName : ''}</TableCell>     
                                        <TableCell className="pl-3 fw-normal" >{activitydetails.sfd}</TableCell>                                   
                                        <TableCell>
                                            <EditIcon style={{ cursor: 'pointer' }} onClick={() => editActivity(activitydetails)} >
                                            </EditIcon >
                                        </TableCell>
                                        <TableCell>
                                            <DeleteIcon style={{ cursor: 'pointer' }} onClick={() => deleteActivity(activitydetails._id)} />
                                        </TableCell>
                                       

                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <TablePagination
                            component="div"
                            rowsPerPageOptions={[5, 25, 50, 100, 200, 500, 700, 1000 ]}
                            count={activityList.length}
                            page={pg}
                            onPageChange={handleChangePage}
                            rowsPerPage={rpg}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </Widget>
                </Grid>
            </Grid>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Add Activity</DialogTitle>
                <form onSubmit={formik.handleSubmit} >
                    <DialogContent style={{ width: 308 }}>     
                    <TextField InputProps={{ style: { width: 253 } }}
                                            id="sfd"
                                            name="sfd"
                                            autoFocus
                                            label="Select Future Date"
                                            type="date"
                                            value={formik.values.sfd}
                                            onChange={formik.handleChange}
                                            error={formik.touched.sfd && Boolean(formik.errors.sfd)}
                                            helperText={formik.touched.sfd && formik.errors.sfd}
                                            className={classes.textField}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                        />
                        <FormControl variant="standard" fullWidth>
                            <InputLabel id="studentName">Student Name</InputLabel>
                            <Select
                                labelId="studentName"
                                id="studentName"
                                label="Student Name"
                                name="studentId"
                                value={formik.values.studentId}
                                onChange={e => { formik.handleChange(e);
                                     getStudentList(e.target.value)
                                    }}
                                // onChange={formik.handleChange}
                                error={formik.touched.studentId && Boolean(formik.errors.studentId)}
                                helperText={formik.touched.studentId && formik.errors.studentId}
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                {studentList.map(({index,_id, studentName}) => (
                                    <MenuItem key={index} value={_id}>{studentName}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl variant="standard" fullWidth>
                            <InputLabel id="demo-simple-select-standard-label">Area Of Work</InputLabel>
                            <Select
                                labelId="demo-simple-select-standard-label"
                                id="superActivityName"
                                label="Area Of Work "
                                name="superActivityId"
                                onChange={e => { formik.handleChange(e); getActivityList(e) }}
                                value={formik.values.superActivityId}
                                error={formik.touched.superActivityId && Boolean(formik.errors.superActivityId)}
                                helperText={formik.touched.superActivityId && formik.errors.superActivityId}
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                {addSuperActivityList.map(({ _id, superActivityName }) => (
                                    
                                    <MenuItem key={_id} value={_id}>{superActivityName}
                                        {/* <Checkbox checked={formik.values.categoryId.indexOf(parent) > -1} /> */}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl variant="standard" fullWidth>
                            <InputLabel id="demo-simple-select-standard-label">List Of Activities</InputLabel>
                            <Select
                                labelId="demo-simple-select-standard-label"
                                id="activityName"
                                label="List Of Activities"
                                name="activityId"
                                onChange={e => { formik.handleChange(e); getSubActivityList(e) }}
                                value={formik.values.activityId}
                                error={formik.touched.activityId && Boolean(formik.errors.activityId)}
                                helperText={formik.touched.activityId && formik.errors.activityId}
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                {addActivityList.map(({ _id, activityName }) => (
                                    
                                    <MenuItem key={_id} value={_id}>{activityName}
                                        {/* <Checkbox checked={formik.values.categoryId.indexOf(parent) > -1} /> */}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl variant="standard" fullWidth>
                            <InputLabel id="subActivityName">Exercise</InputLabel>
                            <Select
                                labelId="subActivityName"
                                id="subActivityId"
                                label="Exercise"
                                name="subActivityId"
                                value={formik.values.subActivityId}
                                onChange={formik.handleChange}
                                error={formik.touched.subActivityId && Boolean(formik.errors.subActivityId)}
                                helperText={formik.touched.subActivityId && formik.errors.subActivityId}
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                {subActivityList.map(({ _id, subActivityName }) => (
                                    <MenuItem key={_id} value={_id}>{subActivityName}
                                        {/* <Checkbox checked={formik.values.categoryId.indexOf(parent) > -1} /> */}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <TextField InputProps={{ style: { width: 258 } }}
                            margin="dense"
                            id="remarks"
                            name="remarks"
                            label="Notes"
                            type="text"
                            variant="standard"
                            value={formik.values.remarks}
                            onChange={formik.handleChange}
                            error={formik.touched.remarks && Boolean(formik.errors.remarks)}
                            helperText={formik.touched.remarks && formik.errors.remarks}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button type="submit">Add</Button>
                    </DialogActions>
                </form>
            </Dialog>
            </form>
            </div>
            </Box>
            </Card>
        </>
    );
}



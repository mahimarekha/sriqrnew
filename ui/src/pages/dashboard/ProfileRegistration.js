import React, { useState } from "react";
import {
  LinearProgress,
  OutlinedInput,
} from "@material-ui/core";
import VisibilityIcon from '@material-ui/icons/Visibility';
import {
  Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, InputLabel, MenuItem,
  TableRow, Table,
  TableHead,
  TableBody,
  TableCell
} from "@material-ui/core";
import ProfileRegistrationService from "./Locality/Service/profileRegistrationService"
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import { Grid, Card, Box, Select, TextField } from "@material-ui/core";
import { useFormik } from 'formik';
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
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
// styles
import useStyles from "./styles";

// components
import mock from "./mock";
import Widget from "../../components/Widget/Widget";
import PageTitle from "../../components/PageTitle/PageTitle";
import { Typography } from "../../components/Wrappers/Wrappers";
import Dot from "../../components/Sidebar/components/Dot";
import BigStat from "./components/BigStat/BigStat";
import { withStyles } from '@material-ui/core/styles';
export default function ProfileSRegistration(props) {
  const classes = useStyles();
  const [age, setAge] = React.useState('');

  var [error, setError] = useState(null);
  const [constituencyList, setConstituencyList] = useState([]);
  const [partyList, setPartyList] = useState([]);
  const [profileRegistrationList, setProfileRegistrationList] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [districtList, setDistrictList] = useState([]);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [profileRegistration, setProfileRegistration] = useState({
    location: '',
    name: '',
    email: '',
    mobileNumber1: '',
    mobileNumber2: '',
    password: '',
  });
  const handleChange = (event) => {
    setAge(event.target.value);
};
  const validationSchema = Yup.object().shape({
    location: Yup.string().required('location  is required'),
    name: Yup.string().required('name is required'),
    email: Yup.string().required('email is required'),
    mobileNumber1: Yup.string().required()
      .matches(/^[0-9]+$/, "Must be only digits")
      .min(10, 'Must be exactly 10 digits')
      .max(10, 'Must be exactly 10 digits'),
      mobileNumber2: Yup.string()
      .matches(/^[0-9]+$/, "Must be only digits")
      .min(10, 'Must be exactly 10 digits')
      .max(10, 'Must be exactly 10 digits'),
      password: Yup.string().required('password is required'),
  });
  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

 

  const handleFormSubmit = (event) => {
    event.preventDefault();

  };
  const getProfileRegistrationList = () => {
    ProfileRegistrationService.getAllProfileRegistration().then((res) => {
      setProfileRegistrationList(res);
    }).catch((err) => {
      setError(err.message);
    });
  }
  const handleOpen = () => {
    setOpen(true);
  };
  useEffect(() => {
   
    return () => {
        

    }
}, []);

  const formik = useFormik({
    initialValues: profileRegistration,
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: (values, { resetForm }) => {
        ProfileRegistrationService.creteProfileRegistration(values).then((res) => {

        alert(" Registration Successfully.");
         props.history.push('/home');
      })
        .catch((err) => {
          alert(err.response.data.message)
        })
    },
  });


  return (

    <>
        <Grid item xs={12}>
          <Card sx={{ maxWidth: 345 }}>
            <Box   >
              <div style={{ marginLeft: "7%" }}>
                <form onSubmit={formik.handleSubmit} >
                  <Grid container spacing={2} columns={12} >
                    <Grid item xs={12}>
                      <PageTitle InputProps={{ style: { color: '#10b680' } }} title="Profile Registration" >aaaaa</PageTitle>
                    </Grid>
                    <Grid item xs={12} sm={12} md={6}>
                      <TextField
                        InputProps={{ style: { width: 370 } }}
                        margin="dense"
                        id="name"
                        name="name"
                        label="Name of the business entity "
                        type="text"
                        variant="standard"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        error={formik.touched.name && Boolean(formik.errors.name)}
                        helperText={formik.touched.name && formik.errors.name}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6}>
                      <TextField
                        InputProps={{ style: { width: 370 } }}
                        margin="dense"
                        id="location"
                        name="location"
                        label="Location"
                        type="text"
                        variant="standard"
                        value={formik.values.location}
                        onChange={formik.handleChange}
                        error={formik.touched.location && Boolean(formik.errors.location)}
                        helperText={formik.touched.location && formik.errors.location}
                      />
                    </Grid>
                 
                    <Grid item xs={12} sm={12} md={6}>
                      <TextField
                        InputProps={{ style: { width: 370 } }}

                        margin="dense"
                        id="mobileNumber1"
                        name="mobileNumber1"
                        label="Mobile Number-1"
                        type="text"
                        variant="standard"
                        value={formik.values.mobileNumber1}
                        onChange={formik.handleChange}
                        error={formik.touched.mobileNumber1 && Boolean(formik.errors.mobileNumber1)}
                        helperText={formik.touched.mobileNumber1 && formik.errors.mobileNumber1}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6}>
                      <TextField
                        InputProps={{ style: { width: 370 } }}

                        margin="dense"
                        id="mobileNumber2"
                        name="mobileNumber2"
                        label="Mobile Number-2"
                        type="text"
                        variant="standard"
                        value={formik.values.mobileNumber2}
                        onChange={formik.handleChange}
                        error={formik.touched.mobileNumber2 && Boolean(formik.errors.mobileNumber2)}
                        helperText={formik.touched.mobileNumber2 && formik.errors.mobileNumber2}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6}>
                      <TextField
                        InputProps={{ style: { width: 370 } }}
                        margin="dense"
                        id="email"
                        name="email"
                        label="Email ID "
                        type="Email ID"
                        variant="standard"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        error={formik.touched.email && Boolean(formik.errors.email)}
                        helperText={formik.touched.email && formik.errors.email}
                      />
                    </Grid>
                  
                    <Grid item xs={12} sm={12} md={6}>
                      <TextField
                        id="password"
                        InputProps={{ style: { width: 370 } }}
                        margin="normal"
                        label="Password  "
                        // placeholder="Password"
                        type="password"
                        name="password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        error={formik.touched.password && Boolean(formik.errors.password)}
                        helperText={formik.touched.password && formik.errors.password}
                      />
                    </Grid>
                  
                  </Grid>
                  <Grid item xs={6} style={{ textAlign: 'right', margin: '29px' }}>
                    <Button style={{ backgroundColor: '#ff6b81', color: 'white' }} type="submit" variant="contained" >Submit</Button>
                    </Grid>

                </form>
              </div>
            </Box>

          </Card>
       
      </Grid>
    </>
  );
}



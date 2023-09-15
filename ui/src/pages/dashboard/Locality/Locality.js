import React from "react";
import { Grid, Button, Dialog, Typography, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, FormControl, InputLabel, Select, MenuItem } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { useForm, Controller } from 'react-hook-form';
import MUIDataTable from "mui-datatables";
import InputAdornment from "@material-ui/core/InputAdornment";
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import {
  Table,
  TableRow,
  TableHead,TableContainer,
  TableBody,
  TableCell,
  Chip,
} from "@material-ui/core";
import LocalityServices from "../../../services/LocalityServices";
import { useContext, useEffect, useState } from 'react';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
// components
import PageTitle from "../../../components/PageTitle/PageTitle";
import Widget from "../../../components/Widget/Widget";
// import Table from "../../tables/Tables";
import { withStyles } from '@material-ui/core/styles';

// // data
import mock from "../../dashboard/mock";

import CityServices from "../../../services/CityServices";



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

export default function Locality() {
  
  const tableHeaders = ['Name', 'City Name', 'Status', 'Edit', 'Delete'];
  const [age, setAge] = React.useState('');
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [localityList, setLocalityList] = useState([]);
  const [error, setError] = useState('');
  const [cityList, setCityList] = useState([]);

  const [areaForm, setAreaForm] = useState({
    id: '',
    cityName: '',
    area: '',
    status: '',
    geo:'',

  });

  const validationSchema = Yup.object().shape({
    cityName: Yup.string().required('City Name is required'),
    area: Yup.string().required('Area is required'),
    status: Yup.string().required('status is required'),
    geo: Yup.string().required('Geo Location is required'),
  });
  const {
    register,
    control,
    handleSubmit,
    formState: { errors }, reset
  } = useForm({
    resolver: yupResolver(validationSchema),
  });
  useEffect(() => {
    getLocalityList();
    getCityList();
    
    return () => {
      setLocalityList([]);
      setCityList([]);
    };
  }, []);

  const getCityList = () => {
    CityServices.getAllCity().then((res) => {
      setAreaForm({
        cityName: res[0]._id,
        area: '',
        status: '',
        id: '',
        geo:'',
      })
      setCityList(res);

    }).catch((err) => {
      setError(err.message);
    });
  }

  const getLocalityList = () => {
    LocalityServices.getAllLocality().then((res) => {

      setLocalityList(res);

    }).catch((err) => {
      setError(err.message);
    });
  }

  const onSubmit = data => {

    const createObjectLocality = {
      cityId: data.cityName,
      area: data.area,
      status: data.status,
      geo:data.geo
    }

    if (areaForm.id) {
      createObjectLocality.id = areaForm.id;
      LocalityServices.upadeLocality(createObjectLocality).then((res) => {
        handleClose();
        getLocalityList();
        formReset();
      }).catch((err) => {
        setLoading(false);
        setError(err.message);
      });
    } else {
      LocalityServices.creteLocality(createObjectLocality).then((res) => {
        handleClose();
        getLocalityList();
        formReset();
      })
        .catch((err) => {
          setLoading(false);
          setError(err.message);
        });
    }


  };

  const deleteLocality = (locality) => {
    if (locality) {
      LocalityServices.deleteLocality(locality).then((res) => {
        getLocalityList();
      }).catch((err) => {

      });
    }

  };


  const handleClickOpen = (locality) => {

    if (locality && locality.cityId) {
      setAreaForm({
        cityName: locality.cityId._id,
        area: locality.area,
        status: locality.status,
        id: locality._id,
        geo:locality.geo
      })
    } else {
      formReset();
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const selectCity = (event) => {
    const areaSelectData = {
      cityName: event.target.value,
      area: areaForm.area,
      status: areaForm.status,
      id: areaForm.id,
      geo:areaForm.geo
    }
    setAreaForm(areaSelectData)

  }

  const selectStatus = (event) => {

    const areaSelectData = {
      cityName: areaForm.cityName,
      area: areaForm.area,
      status: event.target.value,
      id: areaForm.id,
      geo:areaForm.geo
    }
    setAreaForm(areaSelectData)

  }

  const areaName = (event) => {

    const areaSelectData = {
      cityName: areaForm.cityName,
      area: event.target.value,
      status: areaForm.status,
      id: areaForm.id,
      geo:areaForm.geo
    }
    setAreaForm(areaSelectData)

  }

  const geoLocation = (event) => {

    const areaSelectData = {
      cityName: areaForm.cityName,
      area: areaForm.area,
      status: areaForm.status,
      id: areaForm.id,
      geo:event.target.value
    }
    setAreaForm(areaSelectData)

  }

  const formReset = () => {
    const areaSelectData = {
      cityName: '',
      area: '',
      status: '',
      id: '',
      geo:'',
    }
    setAreaForm(areaSelectData)
  }
  const classes = useStyles();
  var keys = Object.keys(mock.locality[0]).map(i => i.toUpperCase());
  keys.shift();
  return (
    <>
      <PageTitle title="Area" button={<Button
        variant="contained" onClick={handleClickOpen}
        size="medium"
        color="secondary"

      >
        Add Area
      </Button>} />

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


                {localityList.map((locality) => (
                  <TableRow key={locality._id}>
                    <TableCell className="pl-3 fw-normal" >{locality.area}</TableCell>
                    <TableCell className="pl-3 fw-normal" >{locality.cityId.cityName}</TableCell>
                    <TableCell>

                      {locality.status ? 'Active' : 'In Active'}
                    </TableCell>
                    <TableCell>
                      <EditIcon style={{ cursor: 'pointer' }} onClick={() => handleClickOpen(locality)} />
                    </TableCell>
                    <TableCell>
                      <DeleteIcon style={{ cursor: 'pointer' }} onClick={() => deleteLocality(locality)} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Widget>
        </Grid>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Add Area</DialogTitle>
          <DialogContent>
            {/* <DialogContentText>
            To subscribe to this website, please enter your email address here. We
            will send updates occasionally.
          </DialogContentText> */}



            <FormControl variant="standard" fullWidth="true" >
              <InputLabel id="demo-simple-select-standard-label">City</InputLabel>
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                name="cityName"
                value={areaForm.cityName}
                label="Status"


                {...register('cityName')}
                error={errors.cityName ? true : false}
                onChange={selectCity}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>

                {cityList.map(({ _id, cityName }) => (
                  <MenuItem key={_id} value={_id}>{cityName}</MenuItem>
                ))}







              </Select>
            </FormControl>
            <div>
              <Typography variant="inherit" color="textSecondary">
                {errors.cityName?.message}
              </Typography>
            </div>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Area"
              type="name"
              fullWidth

              value={areaForm.area}

              variant="standard"
              {...register('area')}

              error={errors.area ? true : false}
              onChange={areaName}
            />
            <div>
              <Typography variant="inherit" color="textSecondary">
                {errors.area?.message}
              </Typography>
            </div>

            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Geo Location"
              type="text"
              fullWidth

              value={areaForm.geo}

              variant="standard"
              {...register('geo')}

              error={errors.geo ? true : false}
              onChange={geoLocation}
            />
            <div>
              <Typography variant="inherit" color="textSecondary">
                {errors.geo?.message}
              </Typography>
            </div>



            <FormControl variant="standard" fullWidth="true" >
              <InputLabel id="demo-simple-select-standard-label">Status</InputLabel>
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                value={areaForm.status}
                label="Status"
                {...register('status')}
                onChange={selectStatus}
                error={errors.status ? true : false}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value={true}>Active</MenuItem>
                <MenuItem value={false}>In Active</MenuItem>

              </Select>
            </FormControl>
            <div>
              <Typography variant="inherit" color="textSecondary">
                {errors.status?.message}
              </Typography>
            </div>
          </DialogContent>

          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleSubmit(onSubmit)}>Add</Button>
          </DialogActions>
        </Dialog>
      </Grid>

    </>
  );
}

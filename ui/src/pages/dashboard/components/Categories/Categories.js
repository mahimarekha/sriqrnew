import React from "react";
import { Grid, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, FormControl, InputLabel, Select, MenuItem } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { withStyles } from '@material-ui/core/styles';
import httpServices from '../../../../services/httpServices';
import MUIDataTable from "mui-datatables";
import InputAdornment from "@material-ui/core/InputAdornment";
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useForm, Controller } from 'react-hook-form';
// import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
// components
import PageTitle from "../../../../components/PageTitle"
import Widget from "../../../../components/Widget/Widget";
import {
  Table,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Chip
} from "@material-ui/core";

import EditIcon from '@material-ui/icons/Edit';
import { useContext, useEffect, useState } from 'react';
// data
import mock from "../../../dashboard/mock";
import CategoryServices from "../../../../services/CategoryServices";

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

export default function Categories({ props }) {
  const [age, setAge] = React.useState('');
  const [categoryList, setCategoryList] = useState([]);
  const [image, setImage] = useState('');
  const [category, setCategory] = useState({
    parent: '',
    status: '',
    icon: ''
  });

  const tableHeaders = ['Icon', 'Name', 'Status', 'Edit', 'Delete'];
  useEffect(() => {
    getCategoryList();
    return () => {
      setCategoryList([])
    };
  }, []); 
   const validationSchema = Yup.object().shape({
    parent: Yup.string().required('Category Name is required'),
    icon: Yup.string(),
    status: Yup.string().required('Status Name is required'),
  });


  const handleChange = (event) => {
    setAge(event.target.value);
  };


  const onSubmit = data => {

    console.log(JSON.stringify(data, null, 2));

  };
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setCategory({
      parent: '',
    status: '',
    icon: ''
    })
    setOpen(true);
  };
  const onclick = () => {

    setOpen(true);
  }
  const deleteCategory = (categorydelete) => {

    if (categorydelete) {
      CategoryServices.deleteCategory(categorydelete).then((res) => {
        getCategoryList();
      }).catch((err) => {

      });
    }

  };
  const getCategoryList = () => {
    CategoryServices.getAllCategory().then((res) => {

      setCategoryList(res);

    }).catch((err) => {
      // setError(err.message);
    });
  }
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };
  const classes = useStyles();
  const editCategory = (category) => {

    setCategory(category)
    handleOpen()
  }

  const imageUploaded = () => {

  }
  const handleChangeImage = (evt) => {
    console.log("Uploading");

    var reader = new FileReader();
    var file = evt.target.files[0];



    let data = new FormData();
    data.append('image', file);
    CategoryServices.uploadImage(data).then((res) => {
      const url = httpServices.baseURL()
      const image =res.filename
      const final =`${url}/image/download/${image}`
      setImage(final)
     
    })


    // reader.onload = function (upload) {
    //   console.log(upload.target.result)
    //   setImage(upload.target.result)
    // };
    // reader.readAsDataURL(file);

    console.log("Uploaded");
  }
  const formik = useFormik({
    initialValues: category,
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: (values, { resetForm }) => {

      if (category._id) {

        values.id = category._id;
        if (image && image != "") {
          values.icon = image;
        }else{
          values.icon = category.icon;
        }
        CategoryServices.upadeCategory(values).then((res) => {
          handleClose();
          getCategoryList();
          resetForm()
        }).catch((err) => {

        });
      } else {
        if (image) {
          values.icon = image;
        }
        CategoryServices.creteCategory(values).then((res) => {
          handleClose();
          getCategoryList()
          resetForm()
        })
          .catch((err) => {


          })
      }


    },
  })

  return (
    <>

      <PageTitle title="Categories" button={<Button
        variant="contained" onClick={handleOpen}
        size="medium"
        color="secondary"

      >
        Add Food Categories
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


                {categoryList.map((category) => (
                  <TableRow key={category._id}>
                    <TableCell className="pl-3 fw-normal" >
                      <div>
                        <img
                          src={category.icon}
                          alt="car" style={{ 'height': '25px', 'width': '25px' }}
                        />
                      </div>


                    </TableCell>
                    <TableCell className="pl-3 fw-normal" >{category.parent}</TableCell>

                    <TableCell>

                      {category.status ? 'Active' : 'In Active'}
                    </TableCell>



                    <TableCell>
                      <EditIcon style={{ cursor: 'pointer' }} onClick={() => editCategory(category)} >

                      </EditIcon >
                    </TableCell>
                    <TableCell>
                      <DeleteIcon style={{ cursor: 'pointer' }} onClick={() => deleteCategory(category)} />
                    </TableCell>
                    {/* <TableCell>
      <EditIcon   onClick={() => editVendor(category._id)} >
      
      </EditIcon >
    </TableCell> */}
                    {/* <TableCell>
      <DeleteIcon onClick={() => deleteVendorRister(vendorRegistration)} />
    </TableCell> */}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Widget>
        </Grid>
      </Grid>
      <Dialog open={open} onClose={handleClose} fullWidth={false}  maxWidth="sm">
        <DialogTitle>Add Categories</DialogTitle>

        <form onSubmit={formik.handleSubmit} >
          <DialogContent>
            {/* <DialogContentText>
            To subscribe to this website, please enter your email address here. We
            will send updates occasionally.
          </DialogContentText> */}

            <TextField
            InputProps={{ style: { width: 370 } }}
              autoFocus
              margin="dense"
              id="parent"
              label="Category Name"
              type="Category Name"
              variant="standard"
              value={formik.values.parent}
              onChange={formik.handleChange}
              error={formik.touched.parent && Boolean(formik.errors.parent)}
              helperText={formik.touched.parent && formik.errors.parent}
            />
            <div style={{marginTop:16}} >
              
              <lable >Image Upload</lable> 
              <div>
              <input style={{marginTop:7}}
                accept="image/*"
                className={classes.input}
                id="raised-button-file"
                multiple
                type="file"
                onChange={handleChangeImage}
              />
              </div>

            </div>
            <FormControl variant="standard" fullWidth>
              <InputLabel id="demo-simple-select-standard-label">Status</InputLabel>
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"

                label="status"
                name="status"
                value={formik.values.status}
                onChange={formik.handleChange}
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
          </DialogContent>

          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit">Add</Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}

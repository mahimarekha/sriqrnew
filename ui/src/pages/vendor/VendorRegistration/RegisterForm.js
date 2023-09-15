import React from "react";
import { useForm } from 'react-hook-form';
import { Grid, Card, Box, FormControl, Button, MenuItem, Select, InputLabel, TextField } from "@material-ui/core";
import PageTitle from "../../../components/PageTitle";
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import {  useEffect, useState } from 'react';
import { useFormik } from 'formik';
// import Autocomplete from "react-google-autocomplete";
// import {useLocation} from "react-router-dom";
// import Widget from "../../../components/Widget";

// import mock from "../../dashboard/mock";
import CategoryServices from "../../../services/CategoryServices";
import CityServices from "../../../services/CityServices";
import LocalityServices from "../../../services/LocalityServices";
import VendorRegistrationServices from "../../../services/VendorRegistrationServices";
import {
  useParams
} from "react-router-dom";
// import { Update } from "@material-ui/icons";
export default function RegistrationForm({props,vendorData}) {

  const [age, setAge] = React.useState('');
  const [localityList, setLocalityList] = useState([]);
  const[categoryList, setCategoryList]=useState([]);
  
  const [cityList, setCityList] = useState([]);
  const [error, setError] = useState('');
  const [vendor, setVendor] = useState(null);
  
  
  const handleChange = (event) => {
    setAge(event.target.value);
  };
  const validationSchema = Yup.object().shape({
    orgName: Yup.string().required('Organization Name is required'),
    fullName: Yup.string().required('Full Name is required'),

    mobileNumber: Yup.string().required()
    .matches(/^[0-9]+$/, "Must be only digits")
    .min(10, 'Must be exactly 10 digits')
    .max(10, 'Must be exactly 10 digits'),
      altMobileNumber: Yup.string()
      .matches(/^[0-9]+$/, "Must be only digits")
      .min(10, 'Must be exactly 10 digits')
      .max(10, 'Must be exactly 10 digits'),
      address: Yup.string().required('address is required'),
      pincode: Yup.string().required()
      .matches(/^[0-9]+$/, "Must be only digits")
      .min(6, 'Must be exactly 6 digits')
      .max(6, 'Must be exactly 6 digits'),
     

      geoLocation: Yup.string().required('geoLocation is required'),
      cityId: Yup.string().required('city is required'),
      localityId: Yup.string().required('locality is required'),
      categoryId: Yup.array(),
      gst: Yup.string().required('GST is required'),
      pan: Yup.string().required()
      .matches(/^[0-9a-zA-Z]+$/)
      .min(10, 'Must be exactly 10 digits')
      .max(10, 'Must be exactly 10 digits'),
      accName: Yup.string().required('Account Name is required'),
      accNumber: Yup.number().typeError('Account Number must be a number')
      .required('Account Number is required')
    ,
    bankName: Yup.string().required('bankName Number is required'),
    branch: Yup.string().required('branch  is required'),
    ifsc: Yup.string().required()
    .matches(/^[0-9a-zA-Z]+$/)
    .min(11, 'Must be exactly 11 digits')
      .max(11, 'Must be exactly 11 digits'),
      status:Yup.string().required('Status is required')
  });
  const { id } = useParams();
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
  useEffect(() => {
    getCityList();   
   // getLocalityList();
   getCategoryList();
    if(id !== 'create'){
        getByjhnjbjhb();
    } 
  
    
    return () => {
      setCityList([]);
      setLocalityList([]);
     
    };
  }, []);
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });
  const onSubmit = data => {
    
    console.log(JSON.stringify(data, null, 2));
  };
  const getCategoryList = () => {
    CategoryServices.getAllCategory().then((res) => {

      setCategoryList(res);

    }).catch((err) => {
      // setError(err.message);
    });
  }
  const getCityList = () => {
    CityServices.getAllCity().then((res) => {
      setCityList(res);

    }).catch((err) => {
      setError(err.message);
    });
  }
  

  const getByjhnjbjhb = () => {
    VendorRegistrationServices.getByIdVendorRegistration(id).then((res) => {
      setVendor(res);

getLocalityList({target:{value:res.cityId}});
    }).catch((err) => {
      setError(err.message);
    });
  }


  
 

  
 
  const getLocalityList = (event) => {
    
    LocalityServices.getLocalityByCityId({cityId:event.target.value}).then((res) => {

      setLocalityList(res);

    }).catch((err) => {
      setError(err.message);
    });
  }


  
const selectedCate =(selected)=>{

const cateSelected = selected.map(res=>categoryList.find(catList=>catList._id === res));

return cateSelected.map(result=>result.parent)

}

  const formik = useFormik({
    initialValues: vendorData,
    enableReinitialize:true,
    validationSchema: validationSchema,
    onSubmit: (values,{resetForm}) => {
        if(vendorData._id){

            values.id = vendorData._id;
            VendorRegistrationServices.upadeVendorRegistration(values).then((res) => {
                alert("Vendor Updated Successfully.");
                props.history.push('/app/vendor');
              }).catch((err) => {
               
              });
        }else{
            VendorRegistrationServices.creteVendorRegistration(values).then((res) => {
        
                alert("Vendor Register Successfully.");
                props.history.push('/app/vendor');
              })
                .catch((err) => {
                  
                  setError(err.message);
                })
        }
 

    },
  });
  return (

    <>
      <Card sx={{ maxWidth: 345 }}>
        <Box   >
          <div style={{ marginLeft: "7%" }}>
          <form onSubmit={formik.handleSubmit} >
            <Grid container spacing={2} columns={12} >
              <Grid item xs={12}>
                <PageTitle title="Vendor Registration"></PageTitle>
              </Grid>
            

              <Grid item xs={6}>
                <TextField InputProps={{ style: { width: 370 } }}  
                margin="dense"
                 id="orgName"
                 name="orgName"
                 label="Name Of The organization"
                  type="Name Of The organization" variant="standard"
                  value={formik.values.orgName}
                  onChange={formik.handleChange}
                  error={formik.touched.orgName && Boolean(formik.errors.orgName)}
                  helperText={formik.touched.orgName && formik.errors.orgName}
                  
                 />
                

              </Grid>
              <Grid item xs={6}>
                <TextField
                  InputProps={{ style: { width: 370 } }}
                  autoFocus
                  margin="dense"
                  id="fullName"
                  name="fullName"
                  label="Full Name "
                  type="Full Name "
                  variant="standard"
                  value={formik.values.fullName}
                  onChange={formik.handleChange}
                  error={formik.touched.fullName && Boolean(formik.errors.fullName)}
                  helperText={formik.touched.fullName && formik.errors.fullName}
                />
             

              </Grid>

              <Grid item xs={6}>
                <TextField InputProps={{ style: { width: 370 } }}
                  autoFocus
                  margin="dense"
                  id="mobileNumber"
                  name="mobileNumber"
                  label="Mobile Number "
                  type="Mobile Number"
                  variant="standard"
                  value={formik.values.mobileNumber}
                  onChange={formik.handleChange}
                  error={formik.touched.mobileNumber && Boolean(formik.errors.mobileNumber)}
                  helperText={formik.touched.mobileNumber && formik.errors.mobileNumber}
                />
              
              </Grid>
              <Grid item xs={6}>
                <TextField InputProps={{ style: { width: 370 } }}
                  autoFocus
                  margin="dense"
                  id="altMobileNumber"
                  name="altMobileNumber"
                  label="Alternative Mobile Number "
                  type="Alternative Mobile Number "
                  variant="standard"
                  value={formik.values.altMobileNumber}
                  onChange={formik.handleChange}
                  error={formik.touched.altMobileNumber && Boolean(formik.errors.altMobileNumber)}
                  helperText={formik.touched.altMobileNumber && formik.errors.altMobileNumber}
                />
              
              </Grid>



              <Grid item xs={12} style={{ marginTop: '30px' }}>
                <span style={{ fontSize: '17px', color: 'rgb(83 109 254' }} >Address:</span>
              </Grid>

              <Grid item xs={6}>
                <TextField
                  InputProps={{ style: { width: 370 } }}
                  autoFocus
                  margin="dense"
                  id="address"
                  name="address"
                  label="Address "
                  type="Address"
                  variant="standard"
                  value={formik.values.address}
                 
                  onChange={formik.handleChange}
                  error={formik.touched.address && Boolean(formik.errors.address)}
                  helperText={formik.touched.address && formik.errors.address}
                />
               

              </Grid>


              <Grid item xs={6}>
                <TextField InputProps={{ style: { width: 370 } }}
                  autoFocus
                  margin="dense"
                  id="pincode"
                  name="pincode"
                  label="PIN Number "
                  type="PIN Number"
                  variant="standard"
                    value={formik.values.pincode}
                  onChange={formik.handleChange}
                  error={formik.touched.pincode && Boolean(formik.errors.pincode)}
                  helperText={formik.touched.pincode && formik.errors.pincode}
                />
               
              </Grid>

              {/* <Grid item xs={6}>
              <Autocomplete
  apiKey={YOUR_GOOGLE_MAPS_API_KEY}
  onPlaceSelected={(place) => {
    console.log(place);
  }}
/>;





             
              
              </Grid> */}

              <Grid item xs={6}>
              <div style={{ width: 370 }}>
                  <FormControl variant="standard" fullWidth="true" >
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
                 </div>
               
              </Grid>
              <Grid item xs={6}>
                <div style={{ width: 370, marginTop: '18px' }}>

                  <FormControl variant="standard" fullWidth="true" >
                    <InputLabel id="demo-simple-select-standard-label">Locality</InputLabel>
                    <Select
                      labelId="demo-simple-select-standard-label"
                      id="localityId"
                      name="localityId"
                      label="Locality"
                      value={formik.values.localityId}
                      onChange={formik.handleChange}
                      error={formik.touched.localityId && Boolean(formik.errors.localityId)}
                      helperText={formik.touched.localityId && formik.errors.localityId}
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>

                      {localityList.map(({ _id, area }) => (
                  <MenuItem key={_id} value={_id}>{area}</MenuItem>
                  ))}
                    </Select>
                  </FormControl>
                </div>
               
              </Grid>

              <Grid item xs={6}>
                <div style={{ width: 370, marginTop: '18px' }}>

                  <FormControl variant="standard" fullWidth="true" >
                    <InputLabel id="demo-simple-select-standard-label">Category</InputLabel>
                    <Select
                      labelId="demo-simple-select-standard-label"
                      id="categoryId"
                      multiple
                      name="categoryId"
                    
                     renderValue={(selected) => selectedCate(selected).join(", ")}
                     MenuProps ={MenuProps }
                      label="Category"
                      
                      value={formik.values.categoryId}
                      onChange={formik.handleChange}
                      error={formik.touched.categoryId && Boolean(formik.errors.categoryId)}
                      helperText={formik.touched.categoryId && formik.errors.categoryId}
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
                  </FormControl>
                </div>
               
              </Grid>

              <Grid item xs={6}>
                <TextField InputProps={{ style: { width: 370 } }}
                  autoFocus
                  margin="dense"
                  id="gst"
                  name="gst"
                  label="GST "
                  type="GST "
                  variant="standard"
                  value={formik.values.gst}
                  onChange={formik.handleChange}
                  error={formik.touched.gst && Boolean(formik.errors.gst)}
                  helperText={formik.touched.gst && formik.errors.gst}
                />
               
              </Grid>
              <Grid item xs={6}>
                <TextField InputProps={{ style: { width: 370 } }}
                  autoFocus
                  margin="dense"
                  id="pan"
                  name="pan"
                  label="PAN Number "
                  type="PAN Number "
                  variant="standard"
                  value={formik.values.pan}
                  onChange={formik.handleChange}
                  error={formik.touched.pan && Boolean(formik.errors.pan)}
                  helperText={formik.touched.pan && formik.errors.pan}
                />
                
              </Grid>
              <Grid item xs={12} style={{ marginTop: '30px' }}>

                <Grid item xs={12}>
                  <span style={{ fontSize: '17px', color: 'rgb(83 109 254)' }}>Bank Account Detailes:
                  </span>
                </Grid>
              </Grid>

              <Grid item xs={6}>
                <TextField InputProps={{ style: { width: 370 } }}
                  autoFocus
                  margin="dense"
                  id="accName"
                  name="accName"
                  label="Account Name "
                  type="Account Name"
                  variant="standard"
                  value={formik.values.accName}
                  onChange={formik.handleChange}
                  error={formik.touched.accName && Boolean(formik.errors.accName)}
                  helperText={formik.touched.accName && formik.errors.accName}
                />
                
              </Grid>
              <Grid item xs={6}>
                <TextField InputProps={{ style: { width: 370 } }}
                  autoFocus
                  margin="dense"
                  id="accNumber"
                  name="accNumber"
                  label="Account Number "

                  variant="standard"
                  value={formik.values.accNumber}
                  onChange={formik.handleChange}
                  error={formik.touched.accNumber && Boolean(formik.errors.accNumber)}
                  helperText={formik.touched.accNumber && formik.errors.accNumber}
                />
               
              </Grid>
              <Grid item xs={6}>
                <TextField InputProps={{ style: { width: 370 } }}
                  autoFocus
                  margin="dense"
                  id="bankName"
                  name="bankName"
                  label="Bank  Name "
                  type="Bank  Name"
                  variant="standard"
                  value={formik.values.bankName}
                  onChange={formik.handleChange}
                  error={formik.touched.bankName && Boolean(formik.errors.bankName)}
                  helperText={formik.touched.bankName && formik.errors.bankName}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField InputProps={{ style: { width: 370 } }}
                  autoFocus
                  margin="dense"
                  id="branch"
                  name="branch"
                  label="Branch "
                  type="Branch"
                  variant="standard"
                  value={formik.values.branch}
                  onChange={formik.handleChange}
                  error={formik.touched.branch && Boolean(formik.errors.branch)}
                  helperText={formik.touched.branch && formik.errors.branch}
                />
              
              </Grid>
              <Grid item xs={6}>
                <TextField InputProps={{ style: { width: 370 } }}
                  autoFocus
                  margin="dense"
                  id="ifsc"
                  name="ifsc"
                  label="IFSC Code "
                  type="IFSC Code"
                  variant="standard"
                  value={formik.values.ifsc}
                  onChange={formik.handleChange}
                  error={formik.touched.ifsc && Boolean(formik.errors.ifsc)}
                  helperText={formik.touched.ifsc && formik.errors.ifsc}
                />
               
              </Grid>

              <Grid item xs={6}>
              <FormControl variant="standard" fullWidth="true"  style={{ width: 370}}>
              <InputLabel id="demo-simple-select-standard-label">Status</InputLabel>
              <Select
                labelId="demo-simple-select-standard-label"
                id="status"
                name="status"
                value={formik.values.status}
                label="Status"
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
            </Grid>
            </Grid>
       
            <div style={{ textAlign: 'right', margin: '29px' }}>
              <Button style={{ backgroundColor: 'rgb(255, 92, 147)', color: 'white' }} type="submit" variant="contained">{vendorData._id ? 'Update':'Save'}</Button>
            </div>
            </form>
          </div>
        </Box>

      </Card>

    </>



  )
}


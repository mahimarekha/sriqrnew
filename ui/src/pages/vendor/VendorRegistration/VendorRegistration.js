import React from "react";

import {  useEffect, useState } from 'react';
import RegistrationForm from "./RegisterForm";
// import Widget from "../../../components/Widget";

// import mock from "../../dashboard/mock";


import VendorRegistrationServices from "../../../services/VendorRegistrationServices";
import {
  useParams
} from "react-router-dom";
export default function VendorRegistration(props) {


  const [vendor, setVendor] = useState({
    orgName: '',
    fullName:'',
    mobileNumber:'',
    altMobileNumber:'',
    address:'',
    pincode:'',
    geoLocation:'',
    cityId:'',
    localityId:'',
    categoryId:[],
    gst:'',
    pan:'',
    accName:'',
    accNumber:'',
    bankName:'',
    branch:'',
    ifsc:'',
    status:'',
});
  

  const { id } = useParams();

  useEffect(() => {
  
    getByjhnjbjhb();
    return () => {
      setVendor([]);
     
    };
  }, []);



  

  const getByjhnjbjhb = () => {
    VendorRegistrationServices.getByIdVendorRegistration(id).then((res) => {
      setVendor(res);

    }).catch((err) => {
   
    });
  }


  
 

  
 

console.log(vendor)

  return (

    <>
     <RegistrationForm props={props} vendorData={vendor}/>

    </>



  )
}


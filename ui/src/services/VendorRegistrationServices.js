import requests from './httpServices';

const VendorRegistrationServices = {




  getAllVendorRegistration() {
    return requests.get('/vendor');
  },


  
  getByIdVendorRegistration(id) {
    return requests.get(`/vendor/${id}` );
  },
  upadeVendorRegistration(body) {
    return requests.put(`/vendor/${body.id}`,body); 
  },
  creteVendorRegistration(body){
    return requests.post('/vendor/add',body); 
  },
  deleteVendorRegistration(body){
    return requests.delete(`/vendor/${body._id}`); 
  }
};

export default VendorRegistrationServices;

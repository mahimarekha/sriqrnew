import requests from './httpServices';

const CityServices = {
  getAllCity() {
    return requests.get('/city');
  },
  upadeCity(body) {
    return requests.put(`/city/${body.id}`,body); 
  },
  creteCity(body){
    return requests.post('/city/add',body); 
  },
  deleteCity(body){
    return requests.delete(`/city/${body._id}`); 
  },
  getAllCoupon() {
    return requests.get('/coupon');
  },
  upadeCoupon(body) {
    return requests.put(`/coupon/${body.id}`,body); 
  },
  creteCoupon(body){
    return requests.post('/coupon/add',body); 
  },
  deleteCoupon(body){
    return requests.delete(`/coupon/${body._id}`); 
  },
  createVendorOrdersById(body){
    return requests.post('/orders/getvendororders',body); 
  },

  getAllVendorList() {
    return requests.get('/vendorlist');
  },






};

export default CityServices;

import requests from './httpServices';

const VendorListServices = {
  getAllOrders(){
    return requests.get('/orders');
  },
  getOrderById(id){
    return requests.get(`/orders/${id}`);
  },
  getAllVendorList() {
    return requests.get('/vendorlist');
  },
  getByIdVendorList(id) {
    return requests.get(`/vendor/${id}` );
  },
  upadeVendorList(body) {
    return requests.put(`/vendor/${body.id}`,body); 
  },
  upadeOrderDetails(body) {
    return requests.put(`/orders/orderdetails/${body.id}`,body); 
  },
  creteVendorList(body){
    return requests.post('/vendor/add',body); 
  },
  deleteVendorList(body){
    return requests.delete(`/vendor/${body._id}`); 
  },
  findVendorList(body){
    return requests.post(`/vendor/find`, body); 
  },

  createVendorOrders(body){
    return requests.post('/orders/addvendororders',body); 
  },
  getVendorOrderById(orderId){
    return requests.get('/orders/vendororder/'+orderId); 
  },


};

export default VendorListServices;

import requests from './httpService';
const ActivityTabelService = {
  getAllActivityTabel(id) {
    
    return requests.get(`/activitytabel/list/${id}`);
  },
  getStudentActivity(id,status) {
    return requests.get(`/activity/list/${id}/${status}`);
  },
  getAllSuperActivity(id) {
    return requests.get(`/superactivity/list/${id}`);
  },
  creteActivityTabel(body){
    return requests.post('/activitytabel/add',body); 
  },
  deleteActivityTabel(body){
    return requests.delete(`/activitytabel/${body._id}`); 
  },

  // getAllSubActivityByActivityId(body) {
  //   return requests.post(`/subactivity/listbyactivityid`,body);
  // },



  getAllActivityTabeBySuperActivityId(body) {
    return requests.post(`/activitytabel/listbysuperactivityid`,body);
  },





  
//   getAllCoupon() {
//     return requests.get('/coupon');
//   },
getAllAddClass() {
  return requests.get('/addclass');
},
  upadeActivityTabel(body) {
    return requests.put(`/activitytabel/${body._id}`,body); 
  },
//   creteCoupon(body){
//     return requests.post('/coupon/add',body); 
//   },
//   deleteCoupon(body){
//     return requests.delete(`/coupon/${body._id}`); 
//   },
//   createVendorOrdersById(body){
//     return requests.post('/orders/getvendororders',body); 
//   },

//   getAllVendorList() {
//     return requests.get('/vendorlist');
//   },

};

export default ActivityTabelService;

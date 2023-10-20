import requests from './httpService';
const CoachingService = {
  getAllCoaching() {
    return requests.get(`/coaching/list`);
  },
  getCoaching(body){
    return requests.post('/coaching/get',body); 
  },
  creteCoaching(body){
    return requests.post('/coaching/add',body); 
  },
  getAllCoachingById(id,body){
    return requests.post(`/coaching/list/${id}`,body); 
  },
  deleteCoaching(body){
    return requests.delete(`/coaching/${body._id}`); 
    
  },
  getCoachingById(id) {
    return requests.get(`/coaching/${id}` );
  },
  getQRcodebyById(body) {
    return requests.post(`/ticketbooking/getqrcodebystatus`,body );
  },

  qrCode(id) {
    return requests.get(`/coaching/qr/${id}` );
  },
  findCoachingList(body){
    return requests.post(`/coaching/find`,body); 
  },
  upadeCoaching(body) {
    return requests.put(`/coaching/${body._id}`,body); 
  }, 
  addAllProfileId(body) {
    return requests.post(`/coaching/get`,body);
  },
  

};

export default CoachingService;

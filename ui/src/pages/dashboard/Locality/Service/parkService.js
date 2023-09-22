import requests from './httpService';
const ParkService = {
  getAllPark() {
    return requests.get(`/park/list`);
  },
  getParks(body){
    return requests.post('/park/get',body); 
  },
  cretePark(body){
    return requests.post('/park/add',body); 
  },
  getAllParkById(id,body){
    return requests.post(`/park/list/${id}`,body); 
  },
  deletePark(body){
    return requests.delete(`/park/${body._id}`); 
    
  },
  getParkById(id) {
    return requests.get(`/park/${id}` );
  },

  qrCode(id) {
    return requests.get(`/park/qr/${id}` );
  },
  findParkList(body){
    return requests.post(`/park/find`,body); 
  },
  upadePark(body) {
    return requests.put(`/park/${body._id}`,body); 
  }, 
  addAllProfileId(body) {
    return requests.post(`/park/listbyprofileid`,body);
  },
  

};

export default ParkService;

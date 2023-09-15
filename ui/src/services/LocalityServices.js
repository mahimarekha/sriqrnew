import requests from './httpServices';

const LocalityServices = {
  getAllLocality() {
    return requests.get('/locality');
  },
  upadeLocality(body) {
    return requests.put(`/locality/${body.id}`,body); 
  },
  creteLocality(body){
    return requests.post('/locality/add',body); 
  },
  getLocalityByCityId(body){
    return requests.post('/locality/getLocalityByCityId',body); 
  },
  deleteLocality(body){
    return requests.delete(`/locality/${body._id}`); 
  }
};

export default LocalityServices;

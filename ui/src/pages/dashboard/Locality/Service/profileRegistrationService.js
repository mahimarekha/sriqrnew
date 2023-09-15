import requests from './httpService';
const ProfileRegistrationService = {
  getAllProfileRegistration() {
    return requests.get('/profileregistration/list');
  },
  creteProfileRegistration(body){
    return requests.post('/profileregistration/add',body); 
  },
  loginProfileRegistration(body){ 
    return requests.post('/profileregistration/login', body);
  }
};

export default ProfileRegistrationService;

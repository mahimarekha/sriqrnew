import requests from './httpServices';

const CategoryServices = {
  getAllCategory() {
    return requests.get('/category');
  },
  getByIdCategory(id) {
    return requests.get(`/category/${id}`);
  },
  upadeCategory(body) {
    return requests.put(`/category/${body.id}`,body); 
  },
  creteCategory(body){
    return requests.post('/category/add',body); 
  },
  //post method for login
  creteUserLogin(body){ 
    let url = '/profileregistration/login';
    // if(body.role==="BOOTH"){
    //   url = '/booth/login';
    // }
    // else if(body.role==="SCHOOLE"){
    //   url = '/profileregistration/login';
    // }
    // else if(body.role ==="TEACHER"){
    //   url = '/teacher/login';
    // }
    
    return requests.post(url,body);
  },
  deleteCategory(body){
    return requests.delete(`/category/${body._id}`); 
  },
  uploadImage(body){
    return requests.post('/image/upload',body); 
  },
  getUserDetails(){
    return JSON.parse(localStorage.getItem("userDetail")) || {};
  }
};
export default CategoryServices;

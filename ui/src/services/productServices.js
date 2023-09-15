import requests from './httpServices';

const ProductServices = {
  getAllProduct() {
    return requests.get('/products');
  },
  upadeProduct(body) {
    return requests.put(`/products/${body.id}`,body); 
  },
  creteProduct(body){
    return requests.post('/products/add',body); 
  },
  getProductByCityId(body){
    return requests.post('/products/getproductByCityId',body); 
  },
  deleteProduct(body){
    return requests.delete(`/products/${body._id}`); 
  }
};

export default ProductServices;

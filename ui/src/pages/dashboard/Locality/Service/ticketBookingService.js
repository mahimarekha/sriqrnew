import requests from './httpService';
const TicketBookingService = {
  getAllTicketBooking() {
    return requests.get(`/ticketbooking/list`);
  },
  creteTicketBooking(body){
    return requests.post('/ticketbooking/add',body); 
  },
  getAllTicketBookingById(id,body){
    return requests.post(`/ticketbooking/list/${id}`,body); 
  },
  deleteTicketBooking(body){
    return requests.delete(`/ticketbooking/${body._id}`); 
    
  },
  getTicketBookingById(id) {
    return requests.get(`/ticketbooking/${id}` );
  },

  findTicketBookingList(body){
    return requests.post(`/ticketbooking/find`,body); 
  },
  upadeTicketBooking(body) {
    return requests.put(`/ticketbooking/${body._id}`,body); 
  },
  getAllProfileId(body) {
    return requests.post(`/ticketbooking/profileid`,body);
  },
  // router.post('/report', getTicketBookingList);
  getTicketBookingList(body){
    return requests.post(`/ticketbooking/report`,body);
  },
  paymentProcess(body){
    return requests.post(`/ticketbooking/payment`,body);
  },
  getQRcodeByMobile(body) {
    return requests.post(`/ticketbooking/getqrcodebymobile`,body );
  },

};

export default TicketBookingService;

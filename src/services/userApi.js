
import fileDownload from "js-file-download";
import api from "./api"

class userApi{
  
 getAllUser = async (pageCount,userAllFilterData) => {
  let { searchUser, status, sortfield,startDate,endDate } = userAllFilterData;
  if (searchUser == "") {
    searchUser = undefined;
  } 
   if (status == "") {
    status = undefined;
  } 
   if (sortfield == "") {
    sortfield = undefined;
  }
   if (startDate == "") {
    startDate = undefined;
  }
   if (endDate == "") {
    endDate = undefined;
  }

  const response = await api.get(`/users`, {
    params: {
      limit: 10,
      page :pageCount,
      sortfield,
      sortDirection: "desc",
      status,
      searchUser,
      startDate,
      endDate,
      
    }
  });
  console.log("res ===>", response.data)
  return response.data;
 };

 getSpecificUser = async (userid) => {

  const response = await api.get(`/users/${userid}`, {
    
  });
  console.log("user data res ===>", response.data)
  return response.data;
 };


 getuserStudioBooking = async (userId,pageCount) => {
  

  const response = await api.get(`/bookings/user/${userId}`, {
    params: {
    
      source: "website",
      limit: 10,
      page :pageCount,
      // active: active
    }
  });
  console.log(" user service data res ===>", response)
  return response;
 };


 getUserServiceBooking = async (userId,pageCount) => {
  

  const response = await api.get(`/bookings/services/${userId}`, {
    params: {
    
      source: "website",
      limit: 10,
      page :pageCount,
      // active: active
    }
  });
  console.log(" user service data res ===>", response)
  return response;
 };


 getUserServiceBooking = async (userId,pageCount) => {
  

  const response = await api.get(`/bookings/services`, {
    params: {
      userId: userId,
      limit: 10,
      page :pageCount,
      // active: active
    }
  });
  console.log(" user service data res ===>", response.data)
  return response.data;
 };

 

//  getServices = async (limit, Type, active ,pageCount) => {
//     const response = await api.get(`/services`,{ 
//         params: {
//             limit: limit,
//             serviceType: Type,
//             active: active,
//             page:pageCount,
//         }
//     });
//     const {status} = response.data
//     console.log("res ===>", response.data)
//     return response.data;
//    };

 



}






export default new userApi();


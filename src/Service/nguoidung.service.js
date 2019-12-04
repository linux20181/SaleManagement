import ServiceBase from './ServiceBase';
import axios from "axios";
import * as Constant from "../Constant/constant"
export default class UserService extends ServiceBase {
constructor(){
  super();
  this.endpoint = "nguoidungs";
}
async registerUser(data){
  axios.defaults.headers.common['Authorization'] = 'AUTH_TOKEN';
  axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
  return axios({
    url: `${Constant.URL_HOST}/register/${this.endpoint}`,
    method: `${Constant.METHOD.POST}`,
    data: data,
  })
}
async authenUser(data) {
  axios.defaults.headers.common['Authorization'] = 'AUTH_TOKEN';
  axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
  return axios({
      url: `${Constant.URL_HOST}/api/${this.endpoint}`,
      method: `${Constant.METHOD.POST}`,
      data: data,
  })
}
getUserCurrent(){
 return JSON.parse(localStorage.getItem('User'));
}
getGroupUserCurrent(){
return JSON.parse(localStorage.getItem('User')).GroupOfUser;
}
} 

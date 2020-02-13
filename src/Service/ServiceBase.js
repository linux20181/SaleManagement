import axios from "axios";
import * as Constant from "../Constant/constant"
function parseDate(date){
    var stringDate = date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate() + " " + date.toLocaleTimeString().substring(0, date.toLocaleTimeString().length -2);
    return stringDate
  }
  function convertTime(date) {
    var stringDate = date.getFullYear() + "-" + JSON.stringify(parseInt(date.getMonth()) + 1) + "-" + date.getDate()  + " " + date.toLocaleTimeString().substring(0, date.toLocaleTimeString().length -2) ;
    return stringDate
  }  
export default class ServiceBase {
    constructor(endpoint) {
        this.endpoint = endpoint;
    }
    async getAll(query){
        axios.defaults.headers.common['Authorization'] = 'AUTH_TOKEN';
        axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
        return axios({
            url: `${Constant.URL_HOST}/${this.endpoint}/all/?${query}`,
            method: `${Constant.METHOD.GET}`,
        })
    }
    async getItems(query) {
        axios.defaults.headers.common['Authorization'] = 'AUTH_TOKEN';
        axios.defaults.headers['Content-Type'] = 'application/json; charset=utf-8';
        return axios({
            url: `${Constant.URL_HOST}/${this.endpoint}?${query}`,
            method: `${Constant.METHOD.GET}`,
        })
    }
    async getItem(id) {
        // axios.defaults.headers.common['Authorization'] = 'AUTH_TOKEN';
        // axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
        return axios({
            url: `${Constant.URL_HOST}/${this.endpoint}/${id}`,
            method: `${Constant.METHOD.GET}`,
            // data :data,
        })
    }
    async saveItem(data) {
        data.NgayTao = convertTime(new Date());
        if(!data.Author){
        data.Author = JSON.parse(localStorage.getItem("User")).Email ;
        }
       // axios.defaults.headers.common['Authorization'] = 'AUTH_TOKEN';
        // axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
        return axios({
            url: `${Constant.URL_HOST}/api/${this.endpoint}`,
            method: `${Constant.METHOD.POST}`,
            data: data,
        })
    }
    async updateItem(data) {
       // axios.defaults.headers.common['Authorization'] = 'AUTH_TOKEN';
       // axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
        return axios({
            url: `${Constant.URL_HOST}/api/${this.endpoint}/${data.id}`,
            method: `${Constant.METHOD.PUT}`,
            data: data,
        })
    }
    async deleteItem(id) {
       // axios.defaults.headers.common['Authorization'] = 'AUTH_TOKEN';
      //  axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
        return axios({
            url: `${Constant.URL_HOST}/${this.endpoint}/${id}`,
            method: `${Constant.METHOD.DELETE}`,
        })
    }
 
}



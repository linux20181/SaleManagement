import React from 'react';
import { Form, Input, Row, Col, Select, Table, Button, notification ,Icon,Dropdown ,Menu } from 'antd';
import { Tabs } from 'antd';
import _ from 'lodash';
import '../../Asset/Css/common.css';
import nguoidungService from '../../Service/nguoidung.service';
const { TabPane } = Tabs;
export default class DetailHuman extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            currUser:null,
            childUser:null,
        }
        this.nguoidungService = new nguoidungService();
    }
    componentDidMount(){
        var _this = this;
        this.nguoidungService.getItem(this.props.match.params.id).then(function(data){
            return data;
        })
        .then(function(data){
        _this.setState({
            currUser : data.data[0], 
        })   
        _this.nguoidungService.getItems().then(function(_data){
            _this.setState({
            childUser:_.filter(_data.data,function(i){
                return i.QuanLy === data.ID;
            })
            })
        })
        })
    }
    render(){
        const menu = [];
        return(
            <div>
                <h1 className = "form-head" style={{ textTransform:"uppercase", color: "#1890ff" }}>ID : <span> {this.state.currUser ? this.state.currUser.HoTen : null}</span> <span style = {{color:"black", width:"10px"}}></span><span style={{float:"right" , width:"20px"}}> 
                    <Dropdown overlay={menu} trigger={['click']}>
                     <a style = {{color : "#534e4e"}}><Icon style={{ fontSize: '25px' }} type="more" /></a>
                     </Dropdown></span> </h1> 
                     <Tabs>
                        <TabPane tab={<span><Icon type="folder-open" /> Thông tin người dùng </span>} key="112">
                <div style={{ backgroundColor: "rgb(246, 240, 241) ", border: "solid", fontFamily: "Segoe UI", borderWidth: "10px", borderColor: "rgb(246, 240, 241)", marginBottom: "10px" }}>Thông tin chung</div>
                </TabPane>
                        </Tabs>
            </div>
        ) 
    }
} 
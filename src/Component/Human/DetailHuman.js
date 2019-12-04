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
            allUser:null
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
                allUser: _data.data,
            childUser:_.filter(_data.data,function(i){
                return i.QuanLy === data.ID;
            })
            })
        })
        })
        if(this.state){
            console.log(this.state);

        }
    }
    getQuanLy = (id) =>{
        var tmp = _.filter(this.state.allUser,function(data){
            return data.ID === id;
        })
        if(tmp.length > 0){
            return tmp[0].HoTen
        }
        return null;
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
                <Form >
          <div>
            
            <div style={{ border: "solid", borderWidth: "1px", borderColor: "rgb(246, 240, 241) ", borderRadius: "5px" }}>
              <div style={{ marginLeft: "50px", marginTop: "15px" }}>
                <Row>
                  <Col span={12}>
                    <Form.Item >
                      <Col span={3}>
                        Họ Tên :
              </Col>
                        <span>
                            { this.state.currUser ?this.state.currUser.HoTen:null} 
                            </span>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item > 
                      <Col span={3}>
                        Địa chỉ:
            </Col>
            <span>
                            { this.state.currUser ? this.state.currUser.DiaChi:null}
                            </span>
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <Form.Item >
                      <Col span={3}>
                        Tuổi :
              </Col>
              <span>
                            { this.state.currUser ?this.state.currUser.Tuoi:null}
                            </span>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item >
                      <Col span={3}>
                        Phone:
            </Col>
            <span>
                            { this.state.currUser ?this.state.currUser.Phone:null}
                            </span>
                    </Form.Item>
                  </Col>
                </Row>
              </div>
            </div>
            <div style={{ backgroundColor: "rgb(246, 240, 241) ", border: "solid", fontFamily: "Segoe UI", borderWidth: "10px", borderColor: "rgb(246, 240, 241)", marginBottom: "10px", marginTop: "10px" }}>Thông tin hệ thống</div>
            <div style={{ border: "solid", borderWidth: "1px", borderColor: "rgb(246, 240, 241) ", borderRadius: "5px" }}>
              <div style={{ marginLeft: "50px", marginTop: "15px" }}>
                <Row>
                  <Col span={12}>
                    <Form.Item >
                      <Col span={3}>
                        Email :
              </Col>
              <span>
                            { this.state.currUser ?this.state.currUser.Email:null}
                            </span>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                  <Form.Item >
                      <Col span={3}>
                        Vị trí :
              </Col>
              <span>
                            { this.state.currUser ?this.state.currUser.ViTri:null}
                            </span>
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                  <Form.Item >
                      <Col span={3}>
                        Quản lý:
            </Col>
                      <span>
                      { this.state.currUser ? this.getQuanLy(this.state.currUser.QuanLy) : null  }
                      </span>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item >
                      <Col span={3}>
                        Group:
            </Col>
            { this.state.currUser ? this.state.currUser.Group : null  }
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <Form.Item >
                      <Col span={3}>
                        Cấp:
            </Col>
                      <span>
                      { this.state.currUser ? this.state.currUser.Cap : null  }
                      </span>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                 
                  </Col>
                </Row>
              </div>
            </div>
          </div>
        </Form>
                </TabPane>
                        </Tabs>
            </div>
        ) 
    }
} 
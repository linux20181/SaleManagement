import React from 'react';
import { Form, Card, Input, Row, Col,Avatar, Button, notification ,Icon,Dropdown} from 'antd';
import { Tabs } from 'antd';
import _ from 'lodash';
import '../../Asset/Css/common.css';
import nguoidungService from '../../Service/nguoidung.service';
import { FaInstagram } from "react-icons/fa";
import { FaFacebookF } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { IoIosEye } from "react-icons/io";
const { TabPane } = Tabs;
const {Meta} = Card;
export default class DetailHuman extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            currUser:null,
            childUser:null,
            allUser:null,
            dataHumanUpdate : {},
            DiaChi : null,
            Phone : null,
            Tuoi : null,
            current:1,
        }
        this.nguoidungService = new nguoidungService();
        this.viewDetail = this.viewDetail.bind(this);
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
                return i.QuanLy === data.data[0].ID;
            })
            })
        })
        })
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
    onChange = (event)=>{
      var name = event.target.name;
      var value = event.target.value;
      var _this =this;
      this.setState({    
        [name]:value,
      })
      if(this.state.DiaChi){
        this.state.currUser.DiaChi = this.state.DiaChi;
      }
      if(this.state.DiaChi){
        this.state.currUser.Phone = this.state.Phone;
      }
      if(this.state.DiaChi){
        this.state.currUser.Tuoi = this.state.Tuoi;
      }
      this.setState({
        currUser : _this.state.currUser,
      })
    }
    updateItem = ()=>{
      console.log(this.state.currUser);
      this.nguoidungService.registerUser(this.state.currUser).then(function(){
        notification.success({
          defaultValue: "topRight",
          message: "Thêm nhân sự thành công",
          duration: 4,
      })
      })
    }
    isAuthor =() =>{
      if(  this.nguoidungService.getUserCurrent() && this.state.currUser){
       return this.nguoidungService.getUserCurrent().ID === this.state.currUser.ID;
      }
      return false;
    }
    viewDetail(id){
      if(id){
        window.location.replace("/nhansu/chitiet/" + id);
      }else{
        window.location.replace("/nhansu/sodonhansu");
      }
  }
    render(){
        const menu = [];
        var _this = this ;
        console.log(this.state.childUser);
        var allCard = _.map(this.state.childUser,function(data){
          return(
              <div>
              <Col span={5} style={{margin: "10px 5px 10px 25px" }}>     
              <Card  bordered={true}
              style={{fontFamily:"Times New Roman"}}
               cover={<img alt="example" style={{width:"150px",marginLeft:"65px",marginTop:"10px", border:"solid",borderWidth:"1px",borderColor:"#eeeeee",borderRadius:"50%"}} src="https://galileo-camps.com/wp-content/themes/galileo-learning/library/img/default-person.png" />}
               actions={[
                  <Icon type="setting" key="setting" />,
                  <IoIosEye size="25px"  onClick={_this.viewDetail.bind(this,data.ID)}/>,
                  <Icon type="ellipsis" key="ellipsis" />,
                ]}
             >
                  <Meta avatar={<Avatar />} title={data.HoTen} description={data.ViTri} />
          <p style={{marginLeft:"47px",marginTop:"10px",marginBottom:"10px"}}>{data.PhongBan}</p>
              <div style={{marginLeft:"47px",marginTop:"10px",marginBottom:"10px"}}>
              <span > <FaInstagram size="20px" /> </span>
              <span > <FaFacebookF size="20px" /> </span>
              <span > <FaTwitter size="20px" /> </span>
              </div>
              </Card>
              </Col>                 
              </div>
          )
      })
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
                        <Col span={8}>
                          <span>
                        {this.isAuthor() ? <span> <Input style={{width:"500px"}} name="DiaChi" type="text" defaultValue={this.state.currUser.DiaChi}  onChange={this.onChange}/> </span> : <span> { this.state.currUser ? this.state.currUser.DiaChi:null} </span> }
                            </span>
                            </Col>
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
              {this.isAuthor() ? <span> <Input style={{width:"500px"}} name="Tuoi" type="text" defaultValue={this.state.currUser.Tuoi}  onChange={this.onChange}/> </span> : <span> { this.state.currUser ? this.state.currUser.Tuoi:null} </span> }
                            </span>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item >
                      <Col span={3}>
                        Phone:
            </Col>
            <span>
            {this.isAuthor() ? <span> <Input style={{width:"500px"}} name="Phone" type="text" defaultValue={this.state.currUser.Phone}  onChange={this.onChange}/> </span> : <span> { this.state.currUser ? this.state.currUser.Phone:null} </span> }
                            </span>
                    </Form.Item>
                  </Col>
                </Row>
              </div>
            </div>
            {
              this.isAuthor()
              ?
              <div>
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
                :null
                }
        </div>
        </Form>
        { this.isAuthor()
        ?
             <div>
                <Button type="primary" icon="save" size="default" onClick={this.updateItem}>
                                        Cập nhật
                </Button>
              </div>
              :null
         }
                </TabPane>
                <TabPane tab={<span><Icon type="folder-open" /> Quản lý </span>} key="114">
                <div>
                  {allCard}
                  </div>
                </TabPane>
                        </Tabs>
            </div>
        ) 
    }
} 
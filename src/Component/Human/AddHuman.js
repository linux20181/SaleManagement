import React from 'react';
import 'antd/dist/antd.css';
import { Form, Input, Button, Row, Col ,notification, message ,Select} from 'antd';
import nguoidungService from '../../Service/nguoidung.service';
import { Tabs } from 'antd';
import _ from 'lodash';
import * as CONSTANT from '../../Constant/constant';
const {Option} = Select;
const { TabPane } = Tabs;
class AddHuman extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      HoTen: null,
      Tuoi: null,
      ViTri: null,
      Phone: null,
      GroupOfUser: null,
      PhongBan: null,
      Cap: null,
      DiaChi: null,
      Email: null,
      MatKhau: null,
      validateData:null,
      dataSourceQuanLy:null,
    };
    this.nguoidungService = new nguoidungService();
    this.onChangeQuanLy = this.onChangeQuanLy.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  // thu esit file roi pull ve may xem co duoc k hihi 
  validateFields(data){
    var validates= [];
    if(data){
      if(!data.HoTen){
        validates.push("Họ tên là trường bắt buộc");
      }
      if(!data.Tuoi){
        validates.push("Tuổi là trường bắt buộc");
      }
      if(!data.Email){
        validates.push("Email là trường bắt buộc");
      }
      if(!data.MatKhau){
        validates.push("Mật khẩu là trường bắt buộc");
      }
      if(!data.GroupOfUser){
        validates.push("Group là trường bắt buộc");
      }
      if(!data.PhongBan){
        validates.push("Phòng ban là trường bắt buộc");
      }
      return validates;
    }
      return null;
  }

  canNotAccess = ()=>{
    notification.error(
        {
            message: "Bạn không có quyền truy cập",
            defaultValue: "topRight",
            duration: 1,
        }
    )
    this.props.history.push("/home")
  //  return;
}
isAdmin = ()=>{
    var tmp = CONSTANT.GROUP.ADMIN;
    
  if(this.nguoidungService.getGroupUserCurrent() === tmp){
    return true;
  }
  return false;
  }
  isThuThu = ()=>{
    var tmp = CONSTANT.GROUP.THUTHU;
    if(this.nguoidungService.getGroupUserCurrent() === tmp){
      return true;
    }
    return false;
  }
  isNhanVien =()=>{
    var tmp = CONSTANT.GROUP.NHANVIEN;
    if(this.nguoidungService.getGroupUserCurrent() === tmp){
      return true;
    }
    return false;
  }
  isQuanLy = ()=>{
    var tmp = CONSTANT.GROUP.QUANLY;
    if(this.nguoidungService.getGroupUserCurrent() === tmp){
      return true;
    }
    return false;
  }
  isLanhDao = ()=>{
    var tmp = CONSTANT.GROUP.LANHDAO;
    if(this.nguoidungService.getGroupUserCurrent() === tmp){
      return true;
    }
    return false;
  }

  handleSubmit() {
    var _this = this;
    var data = this.props.form.getFieldsValue()
        data.Cap = parseInt(data.Cap);
        data.Phone = parseInt(data.Phone);
        data.Tuoi  = parseInt(data.Tuoi);
        data.QuanLy = parseInt(data.manage);
        if(this.validateFields(data).length > 0){
          _this.setState({
            validateData : this.validateFields(data),
          })
          return ;
        }
        if(data.MatKhau !== data.XacThucMatKhau){
          var messages = "Mật khẩu không trùng khớp. ";
            message.warning(messages);
            return;
        }
    this.nguoidungService.registerUser(data)
      .then(function () {
           notification.success({
          defaultValue: "topRight",
          message: "Thêm nhân sự thành công",
          duration: 4,
      })
      setTimeout(function(){
        window.location.reload();
      },5000)
      }).catch(function(){
        notification.error(
          {
              message: "Có lỗi xảy ra !",
              defaultValue: "topRight",
              duration: 4,
          }
      )
      })
  }
  componentDidMount() {
    if(!this.isAdmin()){
      this.canNotAccess();
      return;
    }
    }
  onChangeQuanLy(event){
    var _this = this;
    this.nguoidungService.getItems().then(function(data){
      _this.setState({
        dataSourceQuanLy:_.filter(data.data,function(i){
          return i.Cap === parseInt(event) - 1 ;
        })
      })
    })
  }  
  render() {
    const { getFieldDecorator } = this.props.form;
    if(this.state.dataSourceQuanLy){

      var optionQuanLy = this.state.dataSourceQuanLy.map(function (i) {
        return (
          <Option key={i.ID} value={i.ID}>{i.HoTen}</Option>
          )
        })
      }
    var optionCap = [
      <Option value="1">1</Option>,
      <Option value="2">2</Option>,
      <Option value="3">3</Option>,
      <Option value="4">4</Option>,

  ]
  const optionGroup = [
    <Option value="SM_LanhDao">SM_LanhDao</Option>,
      <Option value="SM_Admin">SM_Admin</Option>,
      <Option value="SM_ThuThu">SM_ThuThu</Option>,
      <Option value="SM_QuanLy">SM_QuanLy</Option>,
      <Option value="SM_NhanVien">SM_NhanVien</Option>,

  ]
    if (this.state.validateData){
      var validInput = this.state.validateData.map(function(item){
        return (
          <h4>{item}</h4>
        )
      })
    } 
    return (
      <div>
         <Tabs>
    <TabPane tab="Bổ sung nhân sự" key="1">
    <div style = {{backgroundColor:"#f3eeee",width:"400px"}}>
            {this.state.validateData ? validInput :null }
            </div>
        <div>
        <Row>
          {/* <p style={{ fontSize: "20px" }}>Bổ sung nhân sự <Button style={{ float: "right" }}>Lưu lại</Button></p> */}
        </Row>  
        <Form >
          <div>
            <div style={{ backgroundColor: "rgb(246, 240, 241) ", border: "solid", fontFamily: "Segoe UI", borderWidth: "10px", borderColor: "rgb(246, 240, 241)", marginBottom: "10px" }}>Thông tin chung</div>
            <div style={{ border: "solid", borderWidth: "1px", borderColor: "rgb(246, 240, 241) ", borderRadius: "5px" }}>
              <div style={{ marginLeft: "50px", marginTop: "15px" }}>
                <Row>
                  <Col span={12}>
                    <Form.Item >
                      <Col span={3}>
                        Họ Tên :
              </Col>
                      <span>
                        {getFieldDecorator('HoTen', {
                          rules: [{ required: true, message: 'Please input your name!' }],
                        })(
                          <Input
                            style={{ width: '400px' }}
                          />,
                        )}
                      </span>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item >
                      <Col span={3}>
                        Địa chỉ:
            </Col>
                      <span>
                        {getFieldDecorator('DiaChi', {
                        })(
                          <Input
                            style={{ width: '400px' }}
                          />,
                        )}
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
                        {getFieldDecorator('Tuoi', {
                          rules: [{ required: true, message: 'Please input your age!' }],
                        })(
                          <Input type="number"
                            style={{ width: '400px' }}
                          />,
                        )}
                      </span>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item >
                      <Col span={3}>
                        Phone:
            </Col>
                      <span>
                        {getFieldDecorator('Phone', {
                        })(
                          <Input type = "number"
                            style={{ width: '400px' }}
                          />,
                        )}
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
                        {getFieldDecorator('Email', {
                          rules: [{ required: true, message: 'Please input your email!' }],
                        })(
                          <Input 
                            type="email"
                            style={{ width: '400px' }}
                          />,
                        )}
                      </span>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item >
                      <Col span={3}>
                        Mật khẩu:
            </Col>
                      <span>
                        {getFieldDecorator('MatKhau', {
                        })(
                          <Input type="password"
                            style={{ width: '400px' }}
                          />,
                        )}
                      </span>
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                <Form.Item >
                      <Col span={3}>
                        Xác thực MK:
            </Col>
                      <span>
                        {getFieldDecorator('XacThucMatKhau', {
                        })(
                          <Input type="password"
                            style={{ width: '400px' }}
                          />,
                        )}
                      </span>
                    </Form.Item>
                    </Col>
                    <Col span={12}>
                <Form.Item >
                      <Col span={3}>
                        Phòng ban:
            </Col>
                      <span>
                        {getFieldDecorator('PhongBan', {
                          rules: [{ required: true, message: 'Please input your PhongBan!' }],
                        })(
                          <Input
                            style={{ width: '400px' }}
                          />,
                        )}
                      </span>
                    </Form.Item>
                    </Col>
                  </Row>
                <Row>
                  <Col span={12}>
                    <Form.Item >
                      <Col span={3}>
                        Vị trí :
              </Col>
                      <span>
                        {getFieldDecorator('ViTri', {
                        })(
                          <Input
                            style={{ width: '400px' }}
                          />,
                        )}
                      </span>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item >
                      <Col span={3}>
                        Group:
            </Col>
                      <span>
                        {getFieldDecorator('GroupOfUser', {
                          rules: [{ required: true, message: 'Please input your group!' }],
                        })(
                          <Select style={{ width: '400px' }}>
                                  {optionGroup}
                                </Select>,
                        )}
                      </span>
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
                        {getFieldDecorator('Cap', {
                          rules: [{ required: true, message: 'Please input your email!' }],
                        })(
                          <Select style={{ width: '400px' }} onChange={this.onChangeQuanLy}>
                                  {optionCap}
                                </Select>,
                        )}
                      </span>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item >
                      <Col span={3}>
                        Quản lý:
            </Col>
                      <span>
                        {getFieldDecorator('manage', {
                          rules: [{ required: true, message: 'Please input your manage!' }],
                        })(
                          <Select style={{ width: '400px' }}>
                          {optionQuanLy}
                        </Select>,
                        )}
                      </span>
                    </Form.Item>
                  </Col>
                </Row>
              </div>
            </div>
          </div>
        </Form>
        <div style ={{marginTop:"10px"}}>
        <Button type="primary" onClick={this.handleSubmit} className="login-form-button">
            Thêm nhân sự
          </Button>
          </div>
          </div>
          </TabPane>
      </Tabs>
      </div>
    )
  }
}
export default Form.create({})(AddHuman)



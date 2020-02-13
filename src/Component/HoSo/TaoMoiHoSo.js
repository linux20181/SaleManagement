import React from 'react';
import 'antd/dist/antd.css';
import { Form, Input, Row, Col, Select,notification, Button ,message} from 'antd';
import { Tabs } from 'antd';
import _ from 'lodash';
import nguoidungService from '../../Service/nguoidung.service';
import loaihosoService from '../../Service/loaihoso.service';
import donviService from '../../Service/donvi.service';
import vungService from '../../Service/vung.service';
import khoService from '../../Service/kho.service';
import phongbanService from '../../Service/phongban.service';
import hosotailieuService from '../../Service/hosotailieu.service';
import tuService from '../../Service/tu.service';
import * as CONSTANT from '../../Constant/constant';
import logService from '../../Service/log.service';
const { TabPane } = Tabs;
const { Option } = Select;
class TaoMoiHoSo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      DonViId: null,
      VungId: null,
      dataSourceLoaiHoSo: [],
      dataSourceDonVi: [],
      dataSourceVung: [],
      dataSourceKho: [],
      dataSourcePhongBan: [],
      dataSourceHoSoTaiLieu:[],
      dataSourceTu : [],
      validateData : null,
    };
    this.tuService = new tuService();
    this.nguoidungService = new nguoidungService();
    this.khoService = new khoService();
    this.vungService = new vungService();
    this.donviService = new donviService();
    this.loaihosoService = new loaihosoService();
    this.phongbanService = new phongbanService();
    this.hosotailieuService = new hosotailieuService();
    this.logService = new logService();
    this.saveItem = this.saveItem.bind(this);
    this.onChangeVung = this.onChangeVung.bind(this);
    this.onChangeDonVi = this.onChangeDonVi.bind(this);
    this.onChangeKho = this.onChangeKho.bind(this);
  }
  convert1Time(date) {
    var stringDate = date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate() + " " + date.toLocaleTimeString().substring(0, date.toLocaleTimeString().length - 2);
    return stringDate
  }
  validateFields(data){
    var validates= [];
    if(data){
      if(!data.SoHieuHoSo){
        validates.push("Số hiệu hồ sơ là trường bắt buộc");
      }
      if(!data.TenHoSo){
        validates.push("Tên hồ sơ là trường bắt buộc");
      }
      if(!data.MasterData){
        validates.push("Dạng văn bản là trường bắt buộc");
      }
      if(!data.LoaiHoSoId){
        validates.push("Loại hồ sơ là trường bắt buộc");
      }
      if(!data.DonViSoHuuId){
        validates.push("Đơn vị sở hữu là trường bắt buộc");
      }
      if(!data.PhongBanSoHuuId){
        validates.push("Phòng ban sở hữu là trường bắt buộc");
      }
      if(!data.NamHoSo){
        validates.push("Năm hồ sơ là trường bắt buộc");
      }
      if(!data.VungId){
        validates.push("Vùng là trường bắt buộc");
      }
      if(!data.KhoId){
        validates.push("Kho là trường bắt buộc");
      }
      if(!data.TuId){
        validates.push("Tủ là trường bắt buộc");
      }
      if(!data.SoHieuHoSo){
        validates.push("Số hiệu hồ sơ là trường bắt buộc");
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
  saveItem() {
    var _this =this;
    var SoHieuHoSos = _.map(_this.state.dataSourceHoSoTaiLieu,function(hs){
      return hs.SoHieuHoSo;
    })
    var data = this.props.form.getFieldsValue();
    data.id = Math.floor(Math.random() * 10000000);
    data.TinhTrangMuonTra = "Lưu kho";
    if(this.validateFields(data).length > 0){
      _this.setState({
        validateData : this.validateFields(data),
      })
      return ;
    }
    if(_.indexOf(SoHieuHoSos,data.SoHieuHoSo) !== -1 ){
      var messages = "Vui lòng nhập đủ trường thông tin";
      message.warning(messages);
      return;
    }
    else{
      this.hosotailieuService.saveItem(data).then(function(){    
        notification.success({
          defaultValue: "topRight",
          message: "Thêm hồ sơ thành công",
          duration: 4,
      }
      );
        var log = {
          NoiDung : "Tạo mới hồ sơ ",
          GuidId:data.id,
        }
        return _this.logService.saveItem(log)
      }).then(function(){       
         _this.props.history.push("/hosotailieu/" + data.id);
      })
      .catch(function(error){
        notification.error(
          {
              message: "Có lỗi xảy ra !",
              defaultValue: "topRight",
              duration: 4,
          }
      )
      })
    }
  }
  onChangeVung(event) {
    console.log(event);
    var _this = this
    this.khoService.getItems("").then(function (data) {
      _this.setState({
        dataSourceKho: _.filter(data.data, function (d) {
          return d.IdVung === event;
        })
      })
    })
  }
  onChangeKho(event) {
    console.log(event);
    var _this = this
    this.tuService.getItems("").then(function (data) {
      _this.setState({
        dataSourceTu: _.filter(data.data, function (d) {
          return d.IdKho === event;
        })
      })
    })
  }
  onChangeDonVi(event) {
    var _this = this
    this.phongbanService.getItems("").then(function (data) {
      _this.setState({
        dataSourcePhongBan: _.filter(data.data, function (d) {
          return d.IdDonVi === event;
        })
      })
    })
  }
  componentDidMount() {
    console.log(this.props.location);
    var _this = this;
    if(!this.isThuThu() &&  !this.isAdmin()){
      this.canNotAccess();
      return;
    }
    var promises = [_this.loaihosoService.getItems(""), _this.donviService.getItems(""), _this.vungService.getItems(""),_this.hosotailieuService.getItems("")];
    Promise.all(promises).then(function (data) {
      _this.setState({
        dataSourceLoaiHoSo: data[0].data,
        dataSourceDonVi: data[1].data,
        dataSourceVung: data[2].data,
        dataSourceHoSoTaiLieu:data[3].data,
      })
    })
  }
  render() {
    const { getFieldDecorator } = this.props.form;
   if (this.state.validateData){
     var validInput = this.state.validateData.map(function(item){
       return (
         <h4>{item}</h4>
       )
     })
   } 
    var optionLoaiHoSo = this.state.dataSourceLoaiHoSo.map(function (lhs) {
      return (
        <Option key={lhs.IdLoaiHoSo} value={lhs.IdLoaiHoSo}>{lhs.TenLoaiHoSo}</Option>
      )
    })
    var optionDonVi = this.state.dataSourceDonVi.map(function (dv) {
      return (
        <Option key={dv.IdDonVi} value={dv.IdDonVi}>{dv.TenDonVi}</Option>
      )
    })
    var optionVung = this.state.dataSourceVung.map(function (vung) {
      return (
        <Option key={vung.IdVung} value={vung.IdVung}>{vung.TenVung}</Option>
      )
    })
    var optionKho = this.state.dataSourceKho.map(function (kho) {
      return (
        <Option key={kho.IdKho} value={kho.IdKho}>{kho.TenKho}</Option>
      )
    })
    var optionTu = this.state.dataSourceTu.map(function (tu) {
      return (
          <Option key={tu.IdTu} value={tu.IdTu}>{tu.TenTu}</Option>
      )
  })
    var optionPhongBan = this.state.dataSourcePhongBan.map(function (pb) {
      return (
        <Option key={pb.IdPhongBan} value={pb.IdPhongBan}>{pb.TenPhongBan}</Option>
      )
    })
    return (
      <div>
        <Tabs>
          <TabPane tab="Tạo mới hồ sơ" key="1">
            <div style = {{backgroundColor:"#f3eeee",width:"400px"}}>
            {this.state.validateData ? validInput :null }
            </div>
            <div>
              <Row>
              </Row>
              <Form >
                <div>
                  <div style={{ backgroundColor: "rgb(246, 240, 241) ", border: "solid", fontFamily: "Segoe UI", borderWidth: "10px", borderColor: "rgb(246, 240, 241)", marginBottom: "10px" }}>Thông tin chung</div>
                  <div style={{ border: "solid", borderWidth: "1px", borderColor: "rgb(246, 240, 241) ", borderRadius: "5px" }}>
                    <div style={{ marginLeft: "50px", marginTop: "15px" }}>
                      <Row>
                        <Col span={12}>
                          <Form.Item >
                            <Col span={5}>
                              Số hiệu hồ sơ:
              </Col>
                            <span>
                              {getFieldDecorator('SoHieuHoSo', {
                                rules: [{ required: true, message: ' Số hiệu hồ sơ là trường bắt buộc !' }],
                              })(
                                <Input
                                  style={{ width: '400px' }}
                                />,
                              )}
                            </span>
                          </Form.Item>
                        </Col>
                        <Col span={12}>
              
                        </Col>
                      </Row>
                      <Row>
                        <Col span={12}>
                          <Form.Item >
                            <Col span={5}>
                              Tên hồ sơ:
            </Col>
                            <span>
                              {getFieldDecorator('TenHoSo', {
                                rules: [{ required: true, message: 'Tên hồ sơ là trường bắt buộc' }],
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
                            <Col span={5}>
                              Loại hồ sơ:
            </Col>
                            <span>
                              {getFieldDecorator('LoaiHoSoId', {
                              })(
                                <Select style={{ width: '400px' }}>
                                  {optionLoaiHoSo}
                                </Select>,
                              )}
                            </span>
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row>
                        <Col span={12}>
                          <Form.Item >
                            <Col span={5}>
                              Dạng văn bản :
              </Col>
                            <span>
                              {getFieldDecorator('MasterData', {
                                rules: [{ required: true, message: 'Dạng văn bản' }],
                              })(
                                <Input style={{ width: '400px' }} />


                              )}
                            </span>
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item >
                            <Col span={5}>
                              Đơn vị sở hữu :
            </Col>
                            <span>
                              {getFieldDecorator('DonViSoHuuId', {
                                rules: [{ required: true, message: 'Đơn vị là trường bắt buộc' }],
                              })(
                                <Select style={{ width: '400px' }} onChange={this.onChangeDonVi}>
                                  {optionDonVi}
                                </Select>,
                              )}
                            </span>
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row>
                        <Col span={12}>
                          <Form.Item >
                            <Col span={5}>
                              Phòng ban sở hữu :
              </Col>
                            <span>
                              {getFieldDecorator('PhongBanSoHuuId', {
                                rules: [{ required: true, message: 'Phòng ban sỡ hữu là trường bắt buộc' }],
                              })(
                                <Select style={{ width: '400px' }}>
                                  {optionPhongBan}
                                </Select>,
                              )}
                            </span>
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item >
                            <Col span={5}>
                              Năm hồ sơ:
            </Col>
                            <span>
                              {getFieldDecorator('NamHoSo', {
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
                            <Col span={5}>
                              Ghi chú:
              </Col>
                            <span>
                              {getFieldDecorator('GhiChu', {
                              })(
                                <Input.TextArea style={{ width: "400px" }}></Input.TextArea>,
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
                            <Col span={5}>
                              Vùng :
              </Col>
                            <span>
                              {getFieldDecorator('VungId', {
                                rules: [{ required: true, message: 'Vùng là trường bắt buộc' }],
                              })(
                                <Select style={{ width: '400px' }} onChange={this.onChangeVung}>
                                  {optionVung}
                                </Select>,
                              )}
                            </span>
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item >
                            <Col span={5}>
                              Kho:
            </Col>
                            <span>
                              {getFieldDecorator('KhoId', {
                                rules: [{ required: true, message: 'Kho là trường bắt buộc' }],
                              })(
                                <Select style={{ width: '400px' }} onChange={this.onChangeKho}>
                                  {optionKho}
                                </Select>,
                              )}
                            </span>
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row>
                        <Col span={12}>
                          <Form.Item >
                            <Col span={5}>
                              Tủ :
              </Col>
                            <span>
                              {getFieldDecorator('TuId', {
                                rules: [{ required: true, message: 'Tủ là trường bắt buộc' }],
                              })(
                                <Select style={{ width: '400px' }}>
                                  {optionTu}
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
              <Row style={{ marginTop: "10px" }}>
                <Button type="primary" icon="save" size="default" onClick={this.saveItem}>
                  Lưu lại
        </Button>
              </Row>
            </div>
          </TabPane>
        </Tabs>
      </div>
    )
  }
}
export default Form.create({})(TaoMoiHoSo)



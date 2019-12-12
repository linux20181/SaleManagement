import React from 'react';
import { Form, Input, Row, Col,DatePicker ,Button, Select,notification,Tabs} from 'antd';
import { IoMdSend } from "react-icons/io";
import nguoidungService from '../../Service/nguoidung.service';
import phieunghiService from '../../Service/phieunghi.service';
import Status from '../Common/Status/Status';
import '../../Asset/Css/common.css';
const { Option } = Select;
const { TabPane } = Tabs;
const {TextArea} = Input;
function randomMaPhieu(currUser){
  var date = new Date();
    if(currUser){
      var stringDate = "PN-" + date.getFullYear() + JSON.stringify(parseInt(date.getMonth()) + 1)+ date.getDate() + currUser.ID;
      return stringDate;
    }
    return null;
}
class DetailPhieu extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            phieunghi:null,
        }
        this.nguoidungService = new nguoidungService();
        this.phieunghiService = new phieunghiService();
        this.acceptDocument = this.acceptDocument.bind(this);
    }
    isPheDuyet = ()=>{
            if(this.state.phieunghi){
                return this.nguoidungService.getUserCurrent().ID === this.state.phieunghi.NguoiPheDuyet;
            }
        
        
    }
    convertTime(date) {
        var stringDate = date.getFullYear() + "-" + JSON.stringify(parseInt(date.getMonth()) + 1) + "-" + date.getDate() + " " + date.toLocaleTimeString().substring(0, date.toLocaleTimeString().length - 2);
        return stringDate
      }
    convertDateViewPhieu(date) {
        var stringDate = date.getFullYear() + "/" + JSON.stringify(parseInt(date.getMonth()) + 1) + "/" + (date.getDate()+1);
        return stringDate
      }
      sendRequest = ()=>{
        var _this =this;
        var data = this.props.form.getFieldsValue();
        data.MaPhieuNghi = randomMaPhieu(this.nguoidungService.getUserCurrent());
        data.TenNguoiDangKy = this.nguoidungService.getUserCurrent().HoTen;
        data.IdNguoiDangKy = this.nguoidungService.getUserCurrent().ID;
        data.ThoiGianNghi = this.convertDateViewPhieu(new Date());
        data.ThoiGianKetThuc = this.convertTime(data.ThoiGianKetThuc._d);
        data.NguoiPheDuyet = this.nguoidungService.getUserCurrent().QuanLy;
        data.TrangThaiPhieuNghi = "Chờ xử lý";
        this.phieunghiService.saveItem(data).then(function(){
          notification.success({
            defaultValue: "topRight",
            message: "Đã gửi đăng ký.",
            duration: 4,
        }
        ); 
      })
      
      }

      componentDidMount(){
          var _this = this;
          this.phieunghiService.getItem(_this.props.match.params.id).then(function(data){
            _this.setState({
                phieunghi:data.data[0],
            })
          })
      }
      acceptDocument(){
        var _this = this;
        var data = null;  
          if(_this.state.phieunghi){
              data = _this.state.phieunghi;
          }
        data.TrangThaiPhieuNghi = "Đã phê duyệt";
        data.ThoiGianNghi = this.convertTime(new Date(data.ThoiGianNghi));
        data.ThoiGianKetThuc = this.convertTime(new Date(data.ThoiGianKetThuc));
        _this.phieunghiService.saveItem(data).then(function(){
            notification.success({
                defaultValue: "topRight",
                message: "Đã phê duyệt.",
                duration: 2,
            }
            );
        _this.componentDidMount();   
        })
    }
    render(){
        const { getFieldDecorator } = this.props.form;
        var today = new Date();
        return(
            <div>
                <div style={{marginBottom:"7px"}}>
                <h1 className = "form-head" style={{ textTransform:"uppercase", color: "#1890ff" }}>Chi tiết phiếu nghỉ</h1><span><Status status ={ this.state.phieunghi ? this.state.phieunghi.TrangThaiPhieuNghi : null}/></span>
                </div>
                
                <div>
                <Form>
                            <div>
                                <div style={{ backgroundColor: "rgb(246, 240, 241) ", border: "solid", fontFamily: "Segoe UI", borderWidth: "10px", borderColor: "rgb(246, 240, 241)", marginBottom: "10px" }}>Phiếu đăng ký</div>
                                <div style={{ border: "solid", borderWidth: "1px", borderColor: "rgb(246, 240, 241) ", borderRadius: "5px" }}>
                                    <div style={{ marginLeft: "50px", marginTop: "15px" }}>
                                    <Row>
                        <Col span={12}>
                          <Form.Item >
                            <Col span={5}>
                              Mã phiếu nghỉ:
              </Col>
                            <span>
                             {this.state.phieunghi?this.state.phieunghi.MaPhieuNghi:null}
                            </span>
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                        {/* <Form.Item >
                            <Col span={5}>
                              Tên Phiếu Mượn:
              </Col>
                            <span>
                              {getFieldDecorator('TenPhieuMuon', {
                                rules: [{ required: true, message: ' Tên phiếu là trường bắt buộc !' }],
                              })(
                                <Input
                                  style={{ width: '400px' }}
                                />,
                              )}
                            </span>
                          </Form.Item> */}
                        </Col>
                      </Row>
                      <Row>
                        {/* <Col span={12}>
                          <Form.Item >
                            <Col span={5}>
                              ID:
              </Col>
                            <span>
                              {getFieldDecorator('MaPhieuMuon', {
                                rules: [{ required: true, message: ' Mã phiếu là trường bắt buộc !' }],
                              })(
                                <Input
                                  style={{ width: '400px' }}
                                />,
                              )}
                            </span>
                          </Form.Item>
                        </Col> */}
                        <Col span={12}>
                        <Form.Item >
                            <Col span={5}>
                              Tên người đăng ký:
              </Col>
                            <span>
                             {this.state.phieunghi ? this.state.phieunghi.TenNguoiDangKy :null}
                            </span>
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row>
                        <Col span={12}>
                        <Form.Item >
                            <Col span={5}>
                              Thời gian bắt đầu:
              </Col>
                            <span>
                                {this.convertDateViewPhieu(new Date())}
                              {/* {getFieldDecorator('ThoiGianMuon', {
                                rules: [{ required: true, message: 'Ngày tạo là trường bắt buộc !' }],
                              })(
                                <DatePicker  format = "YYYY/MM/DD"/>,
                              )} */}
                            </span>
                          </Form.Item>
                       
                        </Col>
                        <Col span={12}>
                        <Form.Item >
                            <Col span={5}>
                              Thời gian kết thúc:
              </Col>
                            <span>
                              {/* {getFieldDecorator('ThoiGianKetThuc', {
                                rules: [{ required: true, message: 'Thời gian kết thúc là trường bắt buộc !' }],
                              })(
                                <DatePicker format = "YYYY/MM/DD"/>,
                              )} */}
                              {this.state.phieunghi? this.convertDateViewPhieu(new Date(this.state.phieunghi.ThoiGianKetThuc)):null}
                            </span>
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row>
                        <Col span={12}>
                          <Form.Item >
                            <Col span={5}>
                              Lý do:
              </Col>
                            <span>
                              {/* {getFieldDecorator('MucDichMuon', {
                                rules: [{ required: false }],
                              })(
                                <TextArea
                                  style={{ width: '400px' }}
                                />,
                              )} */}
                              {this.state.phieunghi ? this.state.phieunghi.LyDo :null}
                            </span>
                          </Form.Item>
                        </Col>
                      </Row>
                                    </div>
                                </div>
                            </div>  
                                                
                        </Form>
                        {
                            this.state.phieunghi ? 
                            <div>
                            { this.isPheDuyet() && this.state.phieunghi.TrangThaiPhieuNghi !== "Đã phê duyệt" ?
                                <div style = {{marginTop:"10px"}}>
                        <Button  size="default" onClick={this.acceptDocument} >
                            <div style={{color:"#1890ff"}}>
                          <IoMdSend  size="15"/> <span>Phê duyệt</span>
                          </div>
                        </Button>
                        </div>
                        :
                        null
                        }
                        </div>
                        :null
                            }
                </div>
            </div>
        )
    }
}
export default Form.create({})(DetailPhieu);
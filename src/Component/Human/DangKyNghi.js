import React from 'react';
import { Form, Input, Row, Col,DatePicker ,Button, Select,notification,Tabs,message} from 'antd';
import nguoidungService from '../../Service/nguoidung.service';
import phieunghiService from '../../Service/phieunghi.service';
import '../../Asset/Css/common.css';
import { IoMdSend } from "react-icons/io";
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
class DangKyNghi extends React.Component {
    constructor(props){
        super(props);
        this.nguoidungService = new nguoidungService();
        this.phieunghiService = new phieunghiService();
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
        var data = this.props.form.getFieldsValue();
        data.MaPhieuNghi = randomMaPhieu(this.nguoidungService.getUserCurrent());
        data.TenNguoiDangKy = this.nguoidungService.getUserCurrent().HoTen;
        data.IdNguoiDangKy = this.nguoidungService.getUserCurrent().ID;
        data.ThoiGianNghi = this.convertDateViewPhieu(new Date());
        data.NguoiPheDuyet = this.nguoidungService.getUserCurrent().QuanLy;
        data.TrangThaiPhieuNghi = "Chờ xử lý";
        if(!data.ThoiGianKetThuc){
          var messages = "Thời gian kết thúc là trường bắt buộc !";
          message.warning(messages);
          return;
        }
        data.ThoiGianKetThuc = this.convertTime(data.ThoiGianKetThuc._d);
        this.phieunghiService.saveItem(data).then(function(){
          notification.success({
            defaultValue: "topRight",
            message: "Đã gửi đăng ký.",
            duration: 4,
        }
        ); 

        })
      }
    render(){
        const { getFieldDecorator } = this.props.form;
        var today = new Date();
        console.log(today);
        return(
            <div>
                <div>
                <h1 className = "form-head" style={{ textTransform:"uppercase", color: "#1890ff" }}>Đăng ký nghỉ</h1>
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
                             {randomMaPhieu(this.nguoidungService.getUserCurrent())}
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
                             {this.nguoidungService.getUserCurrent().HoTen}
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
                              {getFieldDecorator('ThoiGianKetThuc', {
                                rules: [{ required: true, message: 'Thời gian kết thúc là trường bắt buộc !' }],
                              })(
                                <DatePicker format = "YYYY/MM/DD"/>,
                              )}
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
                              {getFieldDecorator('LyDo', {
                                rules: [{ required: false }],
                              })(
                                <TextArea
                                  style={{ width: '400px' }}
                                />,
                              )}
                            </span>
                          </Form.Item>
                        </Col>
                      </Row>
                                    </div>
                                </div>
                            </div>  
                                                
                        </Form>
                        <div style = {{marginTop:"10px"}}>
                        <Button  size="default" onClick={this.sendRequest} >
                            <div style={{color:"#1890ff"}}>
                          <IoMdSend  size="15"/> <span>Đăng ký </span>
                          </div>
                        </Button>
                        </div>
                </div>
            </div>
        )
    }
}
export default Form.create({})(DangKyNghi)
import React from 'react';
import { Form, Input, Row, Col,DatePicker ,Button, Select,notification,Tabs} from 'antd';
import '../../Asset/Css/common.css';
const { Option } = Select;
const { TabPane } = Tabs;
const {TextArea} = Input;
class DangKyNghi extends React.Component {
    constructor(props){
        super(props);
    }
    convertTime(date) {
        var stringDate = date.getFullYear() + "-" + JSON.stringify(parseInt(date.getMonth()) + 1) + "-" + date.getDate() + " " + date.toLocaleTimeString().substring(0, date.toLocaleTimeString().length - 2);
        return stringDate
      }
    convertDateViewPhieu(date) {
        var stringDate = date.getFullYear() + "/" + JSON.stringify(parseInt(date.getMonth()) + 1) + "/" + (date.getDate()+1);
        return stringDate
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
                              {getFieldDecorator('MaPhieuMuon', {
                                rules: [{ required: true, message: ' Mã phiếu là trường bắt buộc !' }],
                              })(
                                <Input
                                  style={{ width: '400px' }}
                                />,
                              )}
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
                        <Col span={12}>
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
                        </Col>
                        <Col span={12}>
                        <Form.Item >
                            <Col span={5}>
                              Tên người đăng ký:
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
                              {getFieldDecorator('ThoiGianTra', {
                                rules: [{ required: true, message: 'Thời gian trả là trường bắt buộc !' }],
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
                              {getFieldDecorator('MucDichMuon', {
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
                </div>
            </div>
        )
    }
}
export default Form.create({})(DangKyNghi)
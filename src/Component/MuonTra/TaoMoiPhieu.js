import React from 'react';
import 'antd/dist/antd.css';
import { Form, Input, Row, Col,DatePicker ,Button, Select,notification,Tabs} from 'antd';
import { IoMdSend } from "react-icons/io";
import _ from 'lodash';
import hosotailieuService from '../../Service/hosotailieu.service';
import phieumuonService from '../../Service/phieumuon.service';
const { Option } = Select;
const { TabPane } = Tabs;
const {TextArea} = Input;
 class TaoMoiPhieu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          dataSourceHoSo:[],
        }
        this.hosotailieuService = new hosotailieuService();
        this.phieumuonService = new phieumuonService();
        this.sendRequest = this.sendRequest.bind(this);
    }
    convertTime(date) {
      var stringDate = date.getFullYear() + "-" + JSON.stringify(parseInt(date.getMonth()) + 1) + "-" + date.getDate() + " " + date.toLocaleTimeString().substring(0, date.toLocaleTimeString().length - 2);
      return stringDate
    }
    sendRequest(){
      var _this = this;
      var HoSoDaChoMuon = null;
      var data = this.props.form.getFieldsValue();
      data.ThoiGianTra = this.convertTime(data.ThoiGianTra._d);
      data.ThoiGianMuon = this.convertTime(data.ThoiGianMuon._d);
      data.TrangThai = "Chờ xử lý";
      if(data.TenHoSoMuonId){
        HoSoDaChoMuon = _.filter(_this.state.dataSourceHoSo,function(i){
          return i.IdHoSo === data.TenHoSoMuonId;
        })[0];
        data.TenHoSoDaChoMuon = HoSoDaChoMuon.TenHoSo;
      }
      
      this.phieumuonService.saveItem(data).then(function(){
        notification.success({
          defaultValue: "topRight",
          message: "Thêm hồ sơ thành công",
          duration: 4,
      }
      );        
      _this.props.form.setFieldsValue({
        TenPhieuMuon : null,
        MaPhieuMuon : null,
        ThoiGianMuon:null,
        ThoiGianTra:null,
        MucDichMuon:null,
        TenHoSoMuonId :null,
        
      })
      HoSoDaChoMuon.TinhTrangMuonTra = "Đã cho mượn";
      _this.hosotailieuService.saveItem(HoSoDaChoMuon).then(function(){

      })
      })
    }
    componentDidMount(){
      var _this = this;
      this.hosotailieuService.getItems().then(function(data){
        _this.setState({
          dataSourceHoSo:_.filter(data.data,function(i){
            return i.TinhTrangMuonTra ==="Lưu kho";
          }),
        })
      })
    }
    render() {

        const { getFieldDecorator } = this.props.form;
        var optionHoSo = this.state.dataSourceHoSo.map(function (hs) {
          return (
            <Option key={hs.IdHoSo} value={hs.IdHoSo}>{hs.TenHoSo}</Option>
          )
        })
        return (
            <div>
                <Tabs >
                    <TabPane tab="Tạo mới phiếu">
                        <Form>
                            <div>
                                <div style={{ backgroundColor: "rgb(246, 240, 241) ", border: "solid", fontFamily: "Segoe UI", borderWidth: "10px", borderColor: "rgb(246, 240, 241)", marginBottom: "10px" }}>Thông tin chung</div>
                                <div style={{ border: "solid", borderWidth: "1px", borderColor: "rgb(246, 240, 241) ", borderRadius: "5px" }}>
                                    <div style={{ marginLeft: "50px", marginTop: "15px" }}>
                                    <Row>
                        <Col span={12}>
                          <Form.Item >
                            <Col span={5}>
                              Mã Phiếu Mượn:
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
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row>
                        <Col span={12}>
                        <Form.Item >
                            <Col span={5}>
                              Thời gian mượn :
              </Col>
                            <span>
                              {getFieldDecorator('ThoiGianMuon', {
                                rules: [{ required: true, message: 'Ngày tạo là trường bắt buộc !' }],
                              })(
                                <DatePicker format = "YYYY/MM/DD"/>,
                              )}
                            </span>
                          </Form.Item>
                       
                        </Col>
                        <Col span={12}>
                        <Form.Item >
                            <Col span={5}>
                              Thời gian trả :
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
                              Mục địch:
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
                        <Col span={12}>
                          <Form.Item >
                            <Col span={5}>
                              Hồ sơ mượn:
              </Col>
                            <span>
                              {getFieldDecorator('TenHoSoMuonId', {
                                rules: [{ required: false }],
                              })(
                                <Select  style={{ width: '400px' }} showSearch
                                filterOption={(input, option) =>
                                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                                >
                                  {optionHoSo}
                                  </Select>
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
                        </TabPane>
                </Tabs>
            </div >
        )
    }
}
export default Form.create({})(TaoMoiPhieu)
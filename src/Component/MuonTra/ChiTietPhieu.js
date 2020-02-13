import React from 'react';
import * as CONSTANT from '../../Constant/constant';
import 'antd/dist/antd.css';
import { Form,Row, Col,Button,notification} from 'antd';
import _ from 'lodash';
import '../../Asset/Css/common.css';
import phieumuonService from '../../Service/phieumuon.service';
import hosotailieuService from '../../Service/hosotailieu.service';
import nguoidungService from '../../Service/nguoidung.service';
import Status from '../Common/Status/Status';
export default class ChiTietPhieu extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            dataPhieuMuon:null,
            dataHoSo:null
        }
        this.phieumuonService = new phieumuonService();
        this.hosotailieuService = new hosotailieuService();
        this.nguoidungService = new nguoidungService();
        this.isAdmin = this.isAdmin.bind(this);
        this.acceptDocument = this.acceptDocument.bind(this);
        this.getStatus = this.getStatus.bind(this);
    }
     isAdmin(){
       var tmp = CONSTANT.GROUP.ADMIN;
     if(this.nguoidungService.getGroupUserCurrent() === tmp){
       return true;
     }
     return false;
     }
    
     acceptDocument(){
      var data = null;
      var _this = this;
      var tmp = this.state.dataPhieuMuon
      data = {
        IdPhieuMuon : tmp.IdPhieuMuon,
        TenPhieuMuon:tmp.TenPhieuMuon,
        Author: tmp.Author,
        ThoiGianMuon:this.convertTime(new Date(tmp.ThoiGianMuon)),
        ThoiGianTra:this.convertTime(new Date(tmp.ThoiGianTra)),
        TrangThai:"Đã phê duyệt",
        TenHoSoMuonId: tmp.TenHoSoMuonId,
        MucDichMuon: tmp.MucDichMuon,
        MaPhieuMuon:tmp.MaPhieuMuon,
      }
      this.phieumuonService.saveItem(data).then(function(){
        notification.success({
          defaultValue: "topRight",
          message: "Phiếu đã được phê duyệt !",
          duration: 4,
      }
      );
      var convertHoSo = null
      if(_this.state.dataHoSo){
        var convertHoSo = _this.state.dataHoSo;
        convertHoSo.TinhTrangMuonTra = "Đã cho mượn";
      }
      
      _this.hosotailieuService.saveItem(convertHoSo).then(function(){
        _this.componentDidMount();
      })
      }).catch(function(err){
        notification.error({
          defaultValue: "topRight",
          message: " Có lỗi xảy ra !",
          duration: 4,
        })
      })
     }
     componentDidMount (){
       this.isAdmin();
        var _this = this;
        var id = this.props.match.params.id;
        this.phieumuonService.getItem(id).then((data)=>{
        this.setState({
            dataPhieuMuon:data.data[0],
        })
        return _this.hosotailieuService.getItems("").then(function(_data){
          // _this.componentDidMount();
            _this.setState({
                dataHoSo:_.filter(_data.data,function(i){
                    return i.IdHoSo = data.data[0].TenHoSoMuonId;
                })[0],
            })
        });
        })
    }
    convertTime(date) {
        var stringDate = date.getFullYear() + "-" + JSON.stringify(parseInt(date.getMonth()) + 1) + "-" + date.getDate() + " " + date.toLocaleTimeString().substring(0, date.toLocaleTimeString().length - 2);
        return stringDate
      }
    getStatus(){
        if(this.state.dataPhieuMuon.TrangThai === CONSTANT.TRANGTHAI.HETHAN){
          return "Hết hạn";
        }
        if(this.state.dataPhieuMuon.TrangThai === CONSTANT.TRANGTHAI.DAPHEDUYET){
          return "Đã phê duyệt";
        }
        if(this.state.dataPhieuMuon.TrangThai === CONSTANT.TRANGTHAI.CHOXULY){
          return "Chờ xử lý";
        }
    }
    acceptPay = ()=>{
      var data = null;
      var _this = this;
      var tmp = this.state.dataPhieuMuon
      data = {
        IdPhieuMuon : tmp.IdPhieuMuon,
        TenPhieuMuon:tmp.TenPhieuMuon,
        Author: tmp.Author,
        ThoiGianMuon:this.convertTime(new Date(tmp.ThoiGianMuon)),
        ThoiGianTra:this.convertTime(new Date(tmp.ThoiGianTra)),
        TrangThai:"Lưu kho",
        TenHoSoMuonId: tmp.TenHoSoMuonId,
        MucDichMuon: tmp.MucDichMuon,
        MaPhieuMuon:tmp.MaPhieuMuon,
      }
      this.phieumuonService.deleteItem(data.IdPhieuMuon).then(function(){
        notification.success({
          defaultValue: "topRight",
          message: "Xác nhận trả thành công !",
          duration: 4,
      }
      );
      var convertHoSo = null
      if(_this.state.dataHoSo){
        var convertHoSo = _this.state.dataHoSo;
        convertHoSo.TinhTrangMuonTra = "Lưu kho";
        convertHoSo.TenHoSoMuonId = null;
      }
      _this.hosotailieuService.saveItem(convertHoSo).then(function(){
        _this.props.history.push("/phieumuon/danhsach");
      })
      }).catch(function(err){
        notification.error({
          defaultValue: "topRight",
          message: " Có lỗi xảy ra !",
          duration: 4,
        })
      })
    }
    componentDidUpdate(){
    }
    render(){
        return(
            <div>
                <div>
                <Row>
        <Col span={12}><h1 className = "title-head" style={{ textTransform:"uppercase", color: "#1890ff" }}> Phiếu mượn  : { this.state.dataPhieuMuon ?this.state.dataPhieuMuon.MaPhieuMuon : null}  </h1> <span><Status status ={ this.state.dataPhieuMuon ? this.state.dataPhieuMuon.TrangThai : null}/></span> </Col>
                  { this.state.dataPhieuMuon ?
                  <div>
                <Col span={12} style={{textAlign:"right"}}>
                 { this.isAdmin() && (this.state.dataPhieuMuon.TrangThai !=="Hết hạn" && this.state.dataPhieuMuon .TrangThai !=="Đã phê duyệt") ?
                <div >                 
                <Button style={{marginRight:"2px"}} type = "primary" onClick={this.acceptDocument}> Phê duyệt </Button>
                <Button type = "danger"> Từ chối </Button>
                </div>
                : null
              }   
                </Col>
                <Col span={12} style={{textAlign:"right"}}>
                {
                  this.isAdmin() && this.state.dataPhieuMuon.TrangThai === "Đã phê duyệt"
                  ?
                  <div>
                    <Button  style={{marginRight:"2px"}} type = "primary" onClick={this.acceptPay}> Xác nhận trả </Button>
                    </div>
                  :
                  null
                }
                </Col>
                 </div>
                 :null
                }
                </Row>
                <div style = {{marginTop:"8px",borderWidth:"0.5px",borderBottom:'solid',borderColor:"#fff9f9"}}></div>
                </div>
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
                       { this.state.dataPhieuMuon ? this.state.dataPhieuMuon.MaPhieuMuon : null}
                   </span>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                    <Form.Item >
                        <Col span={5}>
                          Tên Phiếu Mượn:
          </Col>
                    <span>
                    { this.state.dataPhieuMuon ? this.state.dataPhieuMuon.TenPhieuMuon : null}
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
          { this.state.dataPhieuMuon ? this.convertTime (new Date(this.state.dataPhieuMuon.ThoiGianMuon)) : null}
                      </Form.Item>
                   
                    </Col>
                    <Col span={12}>
                    <Form.Item >
                        <Col span={5}>
                          Thời gian trả :
          </Col>
                        <span>
                        { this.state.dataPhieuMuon ? this.convertTime (new Date(this.state.dataPhieuMuon.ThoiGianTra)) : null}
                        </span>
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={12}>
                      <Form.Item >
                        <Col span={5}>
                          Mục đích:
          </Col>
                        <span>
                        { this.state.dataPhieuMuon ? this.state.dataPhieuMuon.MucDich : null}
                        </span>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item >
                        <Col span={5}>
                          Hồ sơ mượn:
          </Col>
                        <span>
                        { this.state.dataHoSo ? this.state.dataHoSo.TenHoSo  : null}
                        </span>
                      </Form.Item>
                    </Col>
                  </Row>
                                </div>
                            </div>
                        </div>  
                                            
                    </Form>
        </div >
        )
    }
}
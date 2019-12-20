import React from 'react';
import 'antd/dist/antd.css';
import { Form, Input,Row, Col, Select, Table, Button, notification, Icon, Dropdown, Menu,  DatePicker, Modal } from 'antd';
import loaihosoService from '../../../Service/loaihoso.service';
import donviService from '../../../Service/donvi.service';
import vungService from '../../../Service/vung.service';
import khoService from '../../../Service/kho.service';
import phongbanService from '../../../Service/phongban.service';
import hosotailieuService from '../../../Service/hosotailieu.service';
import tailieuService from '../../../Service/tailieu.service';
import logService from '../../../Service/log.service';
import tuService from '../../../Service/tu.service';
import _ from 'lodash';
const { Option } = Select;
const {TextArea} = Input;
export default class ModalTaiLieu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            TenTaiLieu: "",
            SoHieuTaiLieu:"",
            LoaiTaiLieuId: null,
            TenLoaiHoSo: "",
            TenDonViBanHanh : "",
            DangVanBan:"",
            NgayBanHanh: null,
            NgayHetHan:null,
            PhongBanPheDuyetId:null,
            DonViBanHanhId:null,
            SoTrang:null,
            TinhTrangMuonTra:"",
            CapMatTL:null,
            GhiChu:"",
            HoSoTaiLieuId : this.props.id,
            open: true,
            TenPhongBanPheDuyet : "",
            dataSourceLoaiHoSo: [],
            dataSourceDonVi: [],
            dataSourceVung: [],
            dataSourceKho: [],
            dataSourcePhongBan: [],
            dataSourceTu: [],
            dataSourceLog: [],
            dataSourceHoSoTaiLieu: [],
            dataSourceTL: [],
            HoSoTaiLieus: {},
        };
        this.khoService = new khoService();
        this.tailieuService = new tailieuService();
        this.vungService = new vungService();
        this.donviService = new donviService();
        this.loaihosoService = new loaihosoService();
        this.phongbanService = new phongbanService();
        this.hosotailieuService = new hosotailieuService();
        this.logService = new logService();
        this.tuService = new tuService();
        this.onCancel = this.onCancel.bind(this);
        this.onOk = this.onOk.bind(this);
        this.change = this.change.bind(this);
        this.saveItem = this.saveItem.bind(this);
        this.removeItem = this.removeItem.bind(this);
    }
    convert1Time(date) {
        var stringDate = date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate() + " " + date.toLocaleTimeString().substring(0, date.toLocaleTimeString().length - 2);
        return stringDate
      }
    componentDidMount(){
        var _this = this;
        console.log(this.state);
        console.log(this.props.record);
        var promise = [_this.loaihosoService.getItems(""),_this.donviService.getItems(""),_this.phongbanService.getItems("")]
       
        Promise.all(promise).then(function(data){
            _this.setState({
                dataSourceLoaiHoSo:data[0].data,
                dataSourceDonVi:data[1].data,
                dataSourcePhongBan:data[2].data,
            })
            if(_this.props.record){
            var LoaiHoSos = _.filter(data[0].data,function(i){
                return i.IdLoaiHoSo === _this.props.record.LoaiTaiLieuId;
            });
               if(LoaiHoSos.length>0){
                   _this.setState({
                       TenLoaiHoSo:LoaiHoSos[0].TenLoaiHoSo,
                    })
                }  
                var DonViBanHanhs = _.filter(data[1].data,function(i){
                    return i.IdDonVi === _this.props.record.DonViBanHanhId;
                });
                   if(DonViBanHanhs.length>0){
                       _this.setState({
                           TenDonViBanHanh:DonViBanHanhs[0].TenDonVi,
                        })
                    }
                 var PhongBans = _.filter(data[2].data,function(i){
                    return i.IdPhongBan === _this.props.record.PhongBanPheDuyetId;
                });
                   if(PhongBans.length>0){
                       _this.setState({
                           TenPhongBanPheDuyet:PhongBans[0].TenPhongBan,
                        })
                    } 
                }         
        })
    
    }
    saveItem() {
        var _this = this ;
        var data  = {};
        if(this.props.record){
           this.props.record.TenTaiLieu = this.state.TenTaiLieu;
           data = this.props.record;
        }else{
        data = {
            SoHieuTaiLieu :this.state.SoHieuTaiLieu,
            TenTaiLieu:this.state.TenTaiLieu,
            HoSoTaiLieuId:this.state.HoSoTaiLieuId,
            LoaiTaiLieuId:this.state.LoaiTaiLieuId,
            DonViBanHanhId:this.state.DonViBanHanhId,
            PhongBanPheDuyetId:this.state.PhongBanPheDuyetId,
            DangVanBan:this.state.DangVanBan,
            NgayBanHanh:this.state.NgayBanHanh,
            NgayHetHan:this.state.NgayHetHan,
            SoTrang:this.state.SoTrang,  
            TinhTrangMuonTra:this.state.TinhTrangMuonTra,
            CapMatTL:this.state.CapMatTL,
            GhiChu:this.state.GhiChu,         
        }
    }
        this.tailieuService.saveItem(data).then(function(){
            notification.success({
                defaultValue: "topRight",
                message: "Thêm hồ sơ thành công",
                duration: 4,
            })
            if(data.IdTaiLieu){
                var log = {
                    NoiDung : "Sửa thông tin tài liệu " + data.SoHieuTaiLieu,
                    GuidId:_this.props.IdLog,
                  }
            }
            var log = {
                NoiDung : "Tạo mới tài liệu " + data.SoHieuTaiLieu,
                GuidId:_this.props.IdLog,
              }
              _this.logService.saveItem(log).then(function(){

              })
            _this.setState({
                open: false,
            })
        }).catch(function(err){
            notification.error(
                {
                    message: "Có lỗi xảy ra !",
                    defaultValue: "topRight",
                    duration: 4,
                }
            )
        })
    }
    onOk() {

    }
    submit() {
    }
    onCancel() {
        var _this = this;
        _this.setState({
            open: false,
        })
    }
    _onChange1  = (date, dateString)=>{
       this.setState({
           NgayBanHanh : dateString,
       })
    }
    _onChange2  = (date, dateString)=>{
        this.setState({
            NgayHetHan : dateString,
        })     
    }
    change(event) {
        var _this = this;
        var name = event.target.name;
        var value = event.target.value;
        this.setState({
            [name]: value,
        })
        console.log(this.state);
    }
    removeItem(){
        var _this = this ;
        Modal.confirm({
            title: 'Bạn có muốn xóa không ?',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                _this.tailieuService.deleteItem(_this.props.record.IdTaiLieu)
                    .then(function () {
                        notification.success({
                            message: "Xóa thành công !",
                            defaultValue: "topRight",
                            duration: 2,
                        }                     
                        );
                        var log = {
                            NoiDung : "Xóa tài liệu " + _this.props.record.SoHieuTaiLieu,
                            GuidId:_this.props.IdLog,
                          }
                          _this.logService.saveItem(log).then(function(){
            
                          })
                        _this.setState({
                            open:false,
                        })
                        _this.componentDidMount();
                    })
                    .catch(function (err) {
                        notification.error(
                            {
                                message: "Có lỗi xảy ra !",
                                defaultValue: "topRight",
                                duration: 4,
                            }
                        )
                    }).finally(function () {

                    })
            },
            onCancel() {
            },
        });
    }
    render() {
        var _this = this;
        var optionLoaiHoSo = this.state.dataSourceLoaiHoSo.map(function (lhs) {
            return (
              <Option key={lhs.IdLoaiHoSo} value={lhs.IdLoaiHoSo}>{lhs.TenLoaiHoSo}</Option>
            )
          })
          var optionDonViXuatBan = this.state.dataSourceDonVi.map(function (dv) {
            return (
              <Option key={dv.IdDonVi} value={dv.IdDonVi}>{dv.TenDonVi}</Option>
            )
          })
          var optionPhongBanPheDuyet = this.state.dataSourcePhongBan.map(function (pb) {
            return (
              <Option key={pb.IdPhongBan} value={pb.IdPhongBan}>{pb.TenPhongBan}</Option>
            )
          })
        return (
            <div>
                <Modal 
                                   
                    title={this.props.title}
                    visible={this.props.visible && this.state.open}                 
                    width="1700px"
                    onCancel = {this.onCancel}
                    afterClose={this.props.afterModal}
                    footer={[
                        <Button type = "danger" onClick = {this.removeItem} >
                          Xóa
                        </Button>,    
                         <Button type="primary" onClick = {this.saveItem} >
                         Lưu lại
                       </Button>,
                        <Button onClick = {this.onCancel} >
                        Đóng
                      </Button>,                   
                      ]}
                >
                    <div style={{marginTop : "30px"}}>
                        <Form onChange={this.change}>
                            <Row style = {{marginBottom:"25px"}}>
                                <Col span={12}>
                                    <Col span ={4}>
                                    Số hiệu tài liệu:                                       
                                    </Col>
                                    <Col span = {18}>
                                   {this.props.record ? this.props.record.SoHieuTaiLieu :<Input name="SoHieuTaiLieu" onChange={_this.change} />}
                                    </Col>
                                </Col>
                               
                            </Row >
                            <Row style = {{marginBottom:"25px"}}>
                                <Col span={12}>
                                    <Col span={4}>
                                        Tên tài liêu:
                                </Col>
                                    <Col span={18}>
                              {this.props.record ? <Input name="TenTaiLieu" type="text" defaultValue={this.props.record.TenTaiLieu} onChange={_this.change} />: <Input name="TenTaiLieu" onChange={_this.change} /> }
                                    </Col>
                                </Col>
                                <Col span={12}>
                                    <Col span={4}>
                                        Loại tài liêu:
                                 </Col>
                                    <Col span={18}>
                                        {
                                            this.props.record ? this.state.TenLoaiHoSo:
                                        <Select name="LoaiTaiLieuId" onChange={(value) => { this.setState({ LoaiHoSoId: value }) }}>
                                           {optionLoaiHoSo}
                                        </Select>
                                        }
                                    </Col>
                                </Col>
                            </Row>                        
                            <Row style = {{marginBottom:"25px"}}>
                                <Col span={12}>
                                    <Col span ={4}>
                                    Đơn vị ban hành :
                                    </Col>
                                    <Col span = {18}>
                                        {
                                            this.props.record ? this.state.TenDonViBanHanh :
                                    <Select name="DonViBanHanhId" onChange={(value) => { this.setState({ DonViBanHanhId: value }) }}>
                                            {optionDonViXuatBan}
                                        </Select>
                                        }
                                    </Col>
                                </Col>
                                <Col span={12}>
                                    <Col span ={4}>
                                        Phòng ban PD:
                                    </Col>
                                    <Col span = {18}>
                                        {_this.props.record ? this.state.TenPhongBanPheDuyet:
                                    <Select name="PhongBanPheDuyetId" onChange={(value) => { this.setState({ PhongBanPheDuyetId: value }) }}>
                                           {optionPhongBanPheDuyet}
                                        </Select>
                                        }
                                    </Col>
                                </Col>
                            </Row>
                            <Row style = {{marginBottom:"25px"}}>
                                <Col span={12} >
                                    <Col span ={4}>
                                        Dạng văn bản :
                                    </Col>
                                    <Col span = {18}>
                                        {
                                            this.props.record ? this.props.record.DangVanBan
                                            :
                                            <Input name ="DangVanBan" onChange={_this.change} />
                                        }
                                    </Col>
                                </Col>
                                <Col span={12}>
                                    <Col span ={4}>
                                        Số trang:
                                    </Col>
                                    <Col span = {18}>
                                        { this.props.record ? this.props.record.SoTrang 
                                            :
                                            <Input type="number" name="SoTrang" onChange={_this.change}/>
                                        }
                                    </Col>
                                </Col>
                            </Row>
                            <Row style = {{marginBottom:"25px"}}>
                                <Col span={12}>
                                    <Col span ={4}>
                                        Ngày ban hành:
                                    </Col>
                                    <Col span = {18}>
                                        {
                                            this.props.record ? this.props.record.NgayBanHanh :
                                            <DatePicker name="NgayBanHanh"  onChange={this._onChange1}/>
                                        }
                                    </Col>
                                </Col>
                                <Col span={12}>
                                    <Col span ={4}>
                                        Ngày hết hạn:
                                    </Col>
                                    <Col span = {18}>
                                        {
                                            this.props.record ? this.props.record.NgayHetHan :
                                            <DatePicker name = "NgayHetHan"  onChange={this._onChange2}/>
                                        }
                                    </Col>
                                </Col>
                            </Row>
                            <Row style = {{marginBottom:"25px"}}>
                                <Col span={12}>
                                    <Col span ={4}>
                                        Tình trạng mượn trả:
                                    </Col>
                                    <Col span = {18}>
                                        {
                                            this.props.record ? this.props.record.TinhTrangMuongTra :
                                            <Input name = "TinhTrangMuonTra" onChange={_this.change} />
                                        }
                                    </Col>
                                </Col>
                                <Col span={12}>
                                    <Col span ={4}>
                                        Cấp mật :
                                    </Col>
                                    <Col span = {18}>
                                        {
                                            this.props.record ? this.props.record.CapMatTL :
                                            <Input name = "CapMatTL" type = "number"  onChange={_this.change} />
                                        }
                                    </Col>
                                </Col>
                            </Row>
                            <Row style = {{marginBottom:"25px"}}>
                                <Col span={12}>
                                    <Col span ={4}>
                                        Ghi chú :
                                    </Col>
                                    <Col span = {18}>
                                        {
                                            this.props.record  ? this.props.record.GhiChu :   
                                            <TextArea name = " GhiChu"  onChange={_this.change} />
                                        }
                                    </Col>
                                </Col>
                                <Col span={12}>
                                    <Col span ={4}>
                                    </Col>
                                    <Col span = {18}>
                                    </Col>
                                </Col>
                            </Row>
                        </Form>
                    </div>
                </Modal>
            </div>
        )
    }
}
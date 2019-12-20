import React from 'react';
import 'antd/dist/antd.css';
import { Form, Input, Row, Col, Select, Table, Button, notification ,Icon,Dropdown ,Menu ,Modal} from 'antd';
import { Tabs } from 'antd';
import _ from 'lodash';
import loaihosoService from '../../Service/loaihoso.service';
import donviService from '../../Service/donvi.service';
import vungService from '../../Service/vung.service';
import khoService from '../../Service/kho.service';
import phongbanService from '../../Service/phongban.service';
import hosotailieuService from '../../Service/hosotailieu.service';
import tailieuService from '../../Service/tailieu.service';
import logService from '../../Service/log.service';
import tuService from '../../Service/tu.service';
import '../../Asset/Css/common.css'
import ModalTaiLieu from '../TaiLieu/modal/ModalTaiLieu'
import FormTaiLieu from '../TaiLieu/FormTaiLieu';
const { TabPane } = Tabs;
const { Option } = Select;
class ChiTietHoSo extends React.Component {
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
            dataSourceTu: [],
            dataSourceLog: [],
            dataSourceHoSoTaiLieu: [],
            dataSourceTL: [],
            HoSoTaiLieus: {},
            visible : false ,
            ID: null,
            validateData: null,
            blocking: true,
            record:null,
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
        this.saveItem = this.saveItem.bind(this);
        this.onChangeVung = this.onChangeVung.bind(this);
        this.onChangeDonVi = this.onChangeDonVi.bind(this);
        this.showModal = this.showModal.bind(this);
        this.cancelDoc = this.cancelDoc.bind(this);
        this.addDoc = this.addDoc.bind(this);
        this.afterModal = this.afterModal.bind(this);
        this.removeItem = this.removeItem.bind(this);
    }
    convertDate(date) {
        var date = new Date(date);
        if (typeof (date) === "object") {
            var stringDate = date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate();
            return stringDate
        }
        return null;
    }
    validateFields(data) {
        var validates = [];
        if (data) {
            if (!data.MasterData) {
                validates.push("Dạng văn bản là trường bắt buộc");
            }
            if (!data.LoaiHoSoId) {
                validates.push("Loại hồ sơ là trường bắt buộc");
            }
            if (!data.DonViSoHuuId) {
                validates.push("Đơn vị sở hữu là trường bắt buộc");
            }
            if (!data.PhongBanSoHuuId) {
                validates.push("Phòng ban sở hữu là trường bắt buộc");
            }
            if (!data.NamHoSo) {
                validates.push("Năm hồ sơ là trường bắt buộc");
            }
            if (!data.VungId) {
                validates.push("Vùng là trường bắt buộc");
            }
            if (!data.KhoId) {
                validates.push("Kho là trường bắt buộc");
            }
            return validates;
        }
        return null;
    }
    saveItem(e) {
        var _this = this;
        var SoHieuHoSos = _.map(_this.state.dataSourceHoSoTaiLieu, function (hs) {
            return hs.SoHieuHoSo;
        })
        var data = this.props.form.getFieldsValue();
        if (this.validateFields(data).length > 0) {
            _this.setState({
                validateData: this.validateFields(data),
            })
            return;
        }
        if (typeof (data.LoaiHoSoId) === "string") {
            var tmp = _.filter(_this.state.dataSourceLoaiHoSo, function (i) {
                return i.TenLoaiHoSo === data.LoaiHoSoId;
            })
            data.LoaiHoSoId = tmp[0].IdLoaiHoSo;
        }
        if (typeof (data.DonViSoHuuId) === "string") {
            var tmp = _.filter(_this.state.dataSourceDonVi, function (i) {
                return i.TenDonVi === data.DonViSoHuuId;
            })
            data.DonViSoHuuId = tmp[0].IdDonVi;
        }
        if (typeof (data.PhongBanSoHuuId) === "string") {
            var tmp = _.filter(_this.state.dataSourcePhongBan, function (i) {
                return i.TenPhongBan === data.PhongBanSoHuuId;
            })
            data.PhongBanSoHuuId = tmp[0].IdPhongBan;
        }
        if (typeof (data.VungId) === "string") {
            var tmp = _.filter(_this.state.dataSourceVung, function (i) {
                return i.TenVung === data.VungId;
            })
            data.VungId = tmp[0].IdVung;
        }
        if (typeof (data.KhoId) === "string") {
            var tmp = _.filter(_this.state.dataSourceKho, function (i) {
                return i.TenKho === data.KhoId;
            })
            data.KhoId = tmp[0].IdKho;
        }
     
         if (typeof (data.TuId) === "string") {
             var tmp = _.filter(_this.state.dataSourceTu, function (i) {
                 return i.TenTu === data.TuId;
            })
            data.TuId = tmp[0].IdTu;
        }
        data.IdHoSo = this.state.ID;
        this.hosotailieuService.saveItem(data).then(function () {
            notification.success({
                defaultValue: "topRight",
                message: "Lưu thành công",
                duration: 2,
            })
            setTimeout(function () {
                window.location.reload();
            }, 3000);
        }).then(function () {
            var log = {
                NoiDung: "Sửa thông tin hồ sơ ",
                GuidId: _this.props.match.params.id,
            }
            _this.logService.saveItem(log).then(function () {

            })
        })
            .catch(function (err) {
                console.log(err);
                notification.error(
                    {
                        message: "Có lỗi xảy ra !",
                        defaultValue: "topRight",
                        duration: 4,
                    }
                )
            })
    }
    onChangeVung(event) {
        console.log(event);
        var _this = this
        this.khoService.getItems().then(function (data) {
            _this.setState({
                dataSourceKho: _.filter(data.data, function (d) {
                    return d.IdVung === event;
                })
            })
        })
    }
    onChangeDonVi(event) {
        var _this = this
        this.phongbanService.getItems().then(function (data) {
            _this.setState({
                dataSourcePhongBan: _.filter(data.data, function (d) {
                    return d.IdDonVi === event;
                })
            })
        })
    }
    showModal(record){
        var convertRecord = null;
        if(record.IdTaiLieu){
            convertRecord = _.cloneDeep(record);
        }
                this.setState({
                    visible : true,
                    record: convertRecord,
                })
    }
    afterModal(){
        this.setState({
            visible:false,
        })
        this.componentDidMount();
    }
    addDoc(){
        this.setState({
            visible:true,
        })
    }
    cancelDoc(){
        this.setState({
            visible:false,
        })
    }
    componentDidMount() {
        var _this = this;
        var promise = [_this.donviService.getItems(""), _this.khoService.getItems(""), _this.loaihosoService.getItems(""), _this.phongbanService.getItems(""), _this.vungService.getItems(), _this.tuService.getItems(""), _this.logService.getItems(""), _this.hosotailieuService.getItems(""),_this.tailieuService.getItems("")]
        console.log(this.props.match.params);
        var id = this.props.match.params.id;
        this.hosotailieuService.getItem(id).then(function (data) {
            _this.setState({
                ID: data.data[0].IdHoSo,
                HoSoTaiLieus: data.data[0],
            })
        })
            .then(function () {
                Promise.all(promise).then(function (data) {
                   _.forEach(data[8].data,function(i){
                        i.NgayBanHanh = _this.convertDate(i.NgayBanHanh);
                        i.NgayHetHan = _this.convertDate(i.NgayHetHan);
                    })
                    console.log(data[8].data);
                    _this.setState({
                        dataSourceDonVi: data[0].data,
                        dataSourceKho: data[1].data,
                        dataSourceLoaiHoSo: data[2].data,
                        dataSourcePhongBan: data[3].data,
                        dataSourceVung: data[4].data,
                        dataSourceTu: data[5].data,
                        
                        dataSourceLog: _.filter(data[6].data, function (i) {
                            return i.GuidId === parseInt(_this.props.match.params.id);
                        }),
                        dataSourceHoSoTaiLieu: data[7].data,
                        dataSourceTL:_.filter(data[8].data,function(i){
                            return i.HoSoTaiLieuId === _this.state.HoSoTaiLieus.IdHoSo;
                        }),
                    })
                })
            }).catch(function (err) {
                console.log(err);
            })
    }
    componentWillMount(){
        var objj =this.state.dataSourceTL[0];
        console.log("component will mout");
        if(objj){
            console.log(objj.NgayBanHanh.slice(0,10));
        }
    }
    removeItem (){
        var _this = this ;
        Modal.confirm({
            title: 'Bạn có muốn xóa không ?',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                _this.hosotailieuService.deleteItem(_this.state.HoSoTaiLieus.IdHoSo)
                    .then(function () {
                        notification.success({
                            message: "Xóa thành công !",
                            defaultValue: "topRight",
                            duration: 2,
                        }                     
                        );
                        _this.props.history.push("/hoso/danhsach");
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
        const menu = (
            <Menu>
              <Menu.Item>
                <a onClick={this.removeItem}>
                 Xóa hồ sơ
                </a>
              </Menu.Item>
              <Menu.Item>
                <a target="_blank" rel="noopener noreferrer" href="http://www.taobao.com/">
                  In PDF
                </a>
              </Menu.Item>
              <Menu.Item>
                <a target="_blank" rel="noopener noreferrer" href="http://www.tmall.com/">
                  Quét mã QRCode
                </a>
              </Menu.Item>
            </Menu>
          );
        const { getFieldDecorator } = this.props.form;
        var _this = this;
        var TenLoaiHoSo = "";
        var TenDonVi = "";
        var TenPhongBan = "";
        var TenVung = "";
        var TenKho = "";
        var TenTu = "";
        if (this.state.validateData) {
            var validInput = this.state.validateData.map(function (item) {
                return (
                    <h4>{item}</h4>
                )
            })
        }
        var LoaiHoSos = _.filter(this.state.dataSourceLoaiHoSo, function (lhs) {
            return lhs.IdLoaiHoSo == _this.state.HoSoTaiLieus.LoaiHoSoId;
        });
        var DonVis = _.filter(this.state.dataSourceDonVi, function (dv) {
            return dv.IdDonVi == _this.state.HoSoTaiLieus.DonViSoHuuId;
        });
        var Khos = _.filter(this.state.dataSourceKho, function (kho) {
            return kho.IdKho == _this.state.HoSoTaiLieus.KhoId;
        });
        var PhongBans = _.filter(this.state.dataSourcePhongBan, function (pb) {
            return pb.IdPhongBan == _this.state.HoSoTaiLieus.PhongBanSoHuuId;
        });
        var Vungs = _.filter(this.state.dataSourceVung, function (vung) {
            return vung.IdVung == _this.state.HoSoTaiLieus.VungId;
        });
        var Tus = _.filter(this.state.dataSourceTu, function (tu) {
            return tu.IdTu == _this.state.HoSoTaiLieus.TuId;
        });

        if (LoaiHoSos[0]) {
            var ObjLhs = LoaiHoSos[0];
            var TenLoaiHoSo = ObjLhs.TenLoaiHoSo;
        }
        if (DonVis[0]) {
            var ObjDv = DonVis[0];
            var TenDonVi = ObjDv.TenDonVi;
        }
        if (PhongBans[0]) {
            var ObjPb = PhongBans[0];
            var TenPhongBan = ObjPb.TenPhongBan;
        }
        if (Vungs[0]) {
            var ObjVung = Vungs[0];
            var TenVung = ObjVung.TenVung;
        }
        if (Khos[0]) {
            var ObjKho = Khos[0];
            var TenKho = ObjKho.TenKho;
        }
        if (Tus[0]) {
            var ObjTu = Tus[0];
            var TenTu = ObjTu.TenTu;
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
        var columns = [
            {
                title: "Thời gian",
                dataIndex: 'NgayTao',
                key: 'NgayTao'
            },
            {
                title: "Người tạo",
                dataIndex: 'Author',
                key: 'Author'
            },
            {
                title: "Nội dung",
                dataIndex: 'NoiDung',
                key: 'NoiDung'
            }
        ]
        var columnsTL = [
            {
                title: "Số hiệu tài liệu",
                dataIndex: 'SoHieuTaiLieu',
                key: 'SoHieuTaiLieu',
                render :(SoHieuTaiLieu ,record) =>{
                    return (
                        <div>
                            <a onClick = {this.showModal.bind(this,record)}>{SoHieuTaiLieu}</a>
                        </div>
                    )
                }
            },
            {
                title: "Tên tài liệu",
                dataIndex: 'TenTaiLieu',
                key: 'TenTaiLieu'
            },
            {
                title: "Mã tài liệu văn thư",
                dataIndex: 'MaTaiLieuVanThu',
                key: 'MaTaiLieuVanThu'
            },
            {
                title: "Ngày ban hành",
                dataIndex: 'NgayBanHanh',
                key: 'NgayBanHanh'
             
            },
            {
                title: "Ngày hết hạn",
                dataIndex: 'NgayHetHan',
                key: 'NgayHetHan'
             
            },
            {
                title: "Loại hồ sơ",
                dataIndex: 'LoaiTaiLieuId',
                key: 'LoaiTaiLieuId',
                render:(LoaiTaiLieuId) =>{
                    return(                                           
                        <div>
                            { LoaiTaiLieuId ? _.filter(this.state.dataSourceLoaiHoSo,function(i){
                                return i.IdLoaiHoSo === LoaiTaiLieuId;
                            })[0].TenLoaiHoSo : null}
                            </div>
                    )
                }
             
            },
            {
                title: "Đơn vị ban hành",
                dataIndex: 'DonViBanHanhId',
                key: 'DonViBanHanhId',
                render:(DonViBanHanhId) =>{
                    return(                                           
                        <div>
                            { DonViBanHanhId ? _.filter(this.state.dataSourceDonVi,function(i){
                                return i.IdDonVi === DonViBanHanhId;
                            })[0].TenDonVi : null}
                            </div>
                    )
                }
             
            },
            {
                title: "Phòng ban phê duyệt",
                dataIndex: 'PhongBanPheDuyetId',
                key: 'PhongBanPheDuyetId',
                render:(PhongBanPheDuyetId) =>{
                    return(                                           
                        <div>
                            { PhongBanPheDuyetId ? _.filter(this.state.dataSourcePhongBan,function(i){
                                return i.IdPhongBan === PhongBanPheDuyetId;
                            })[0].TenPhongBan : null}
                            </div>
                    )
                }
            },
            {
                title: "Số trang",
                dataIndex: 'SoTrang',
                key: 'SoTrang'
             
            },
            {
                title: "Dạng văn bản",
                dataIndex: 'DangVanBan',
                key: 'DangVanBan'
             
            },
            {
                title: "Ghi chú",
                dataIndex: 'GhiChu',
                key: 'GhiChu'
             
            },
            {
                title: "Tình trạng mượn trả",
                dataIndex: 'TinhTrangMuonTra',
                key: 'TinhTrangMuonTra'
             
            },
        ]
        return (
            <div>
                <div>
                    <h1 className = "form-head" style={{ textTransform:"uppercase", color: "#1890ff" }}>Hồ sơ : <span> {this.state.HoSoTaiLieus ? this.state.HoSoTaiLieus.TenHoSo : null}</span> <span style = {{color:"black", width:"10px"}}></span><span style={{float:"right" , width:"20px"}}> 
                    <Dropdown overlay={menu} trigger={['click']}>
                     <a style = {{color : "#534e4e"}}><Icon style={{ fontSize: '25px' }} type="more" /></a>
                     </Dropdown></span> </h1> 
                    <Tabs>
                        <TabPane tab={<span><Icon type="folder-open" /> Thông tin hồ sơ </span>} key="112">
                            <div style={{ backgroundColor: "#f3eeee", width: "400px" }}>
                                {this.state.validateData ? validInput : null}
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
                                                                {this.state.HoSoTaiLieus.SoHieuHoSo}
                                                            </span>
                                                        </Form.Item>
                                                    </Col>
                                                    <Col span={12}>
                                                        <Form.Item >
                                                            {
                                                                this.HoSoTaiLieus !== {} ?
                                                                    <div>
                                                                        <Col span={5}>
                                                                            Ngày tạo :
              </Col>
                                                                        <span>
                                                                            {this.convertDate(this.state.HoSoTaiLieus.NgayTao)}
                                                                        </span>
                                                                    </div>
                                                                    : null
                                                            }
                                                        </Form.Item>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col span={12}>
                                                        <Form.Item >
                                                            <Col span={5}>
                                                                Tên hồ sơ:
            </Col>
                                                            <span>
                                                                {this.state.HoSoTaiLieus.TenHoSo}
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
                                                                    initialValue: TenLoaiHoSo,
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
                                                                    rules: [{ required: true, message: 'Dạng văn bản' }], initialValue: this.state.HoSoTaiLieus.MasterData
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
                                                                    rules: [{ required: true, message: 'Đơn vị là trường bắt buộc' }], initialValue: TenDonVi
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
                                                                    rules: [{ required: true, message: 'Phòng ban sỡ hữu là trường bắt buộc' }], initialValue: TenPhongBan
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
                                                                    initialValue: this.state.HoSoTaiLieus.NamHoSo
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
                                                                    initialValue: this.state.HoSoTaiLieus.GhiChu
                                                                })(
                                                                    <Input.TextArea style={{ width: "400px" }}></Input.TextArea>,
                                                                )}
                                                            </span>
                                                        </Form.Item>
                                                    </Col>
                                                </Row>
                                            </div>
                                        </div>
                                        <div style={{ backgroundColor: "rgb(246, 240, 241) ", border: "solid", fontFamily: "Segoe UI", borderWidth: "10px", borderColor: "rgb(246, 240, 241)", marginBottom: "10px", marginTop: "10px" }}>Thông tin lưu trữ</div>
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
                                                                    rules: [{ required: true, message: 'Vùng là trường bắt buộc' }], initialValue: TenVung
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
                                                                    rules: [{ required: true, message: 'Kho là trường bắt buộc' }], initialValue: TenKho
                                                                })(
                                                                    <Select style={{ width: '400px' }}>
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
                                                                    rules: [{ required: true, message: 'Tủ là trường bắt buộc' }], initialValue: TenTu
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
                                        Cập nhật
        </Button>
                                </Row>
                            </div>
                        </TabPane>
                        <TabPane tab = { <span><Icon type="bars" /> Danh sách tài liệu </span>} key = "113">
                            <div style= {{marginBottom:"10px" , marginLeft: "1240px"}} >
                            <Button type = "primary" icon="plus" onClick = {this.showModal}> Thêm tài liệu</Button>
                                                                { this.state.visible ?   <ModalTaiLieu id={ _this.state.HoSoTaiLieus.IdHoSo} IdLog = {this.state.HoSoTaiLieus.id} record = {this.state.record} title = {this.state.record ? this.state.record.SoHieuTaiLieu : "Thêm mới tài liệu"} visible ={this.state.visible} afterModal = {this.afterModal}/> : null }
                            </div>
                        <Table bordered rowKey="" columns={columnsTL} dataSource = {this.state.dataSourceTL} pagination={{ pageSize: 25 }} scroll={{ x: 2300 , y:1300 }} />
                            </TabPane>
                        <TabPane tab={<span><Icon type="history" />Lịch sử </span>} key="111">
                            <Table bordered rowKey="" columns={columns} dataSource={this.state.dataSourceLog} />
                        </TabPane>
                    </Tabs>

                </div>
            </div>
        )
    }
}
export default Form.create({})(ChiTietHoSo)



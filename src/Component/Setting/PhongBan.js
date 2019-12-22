import React from 'react';
import 'antd/dist/antd.css';
import { Form, Menu, Input, Button, notification, message, Modal, Table, Icon, Select, Row } from 'antd';
import phongbanService from '../../Service/phongban.service';
import donviService from '../../Service/donvi.service';
import hosoService from '../../Service/hosotailieu.service';
import tailieuService from '../../Service/tailieu.service';
import nguoidungService from '../../Service/nguoidung.service';
import ExportExel from '../Common/Export/ExportExel';
import * as CONSTANT from '../../Constant/constant';
import _ from 'lodash';
const { Option } = Select;
const { Search } = Input;
export default class PhongBan extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            IdPhongBan: null,
            TenPhongBan: null,
            MaPhongBan: null,
            DonViId: null,
            visible: false,
            dataPhongBans: [],
            dataDonVis: [],
            dataHoSos:[],
            dataTLs:[],
            count: 1,
        };
        this.nguoidungService = new nguoidungService();
        this.hosoService = new hosoService();
        this.tailieuService = new tailieuService();
        this.phongbanService = new phongbanService();
        this.donviService = new donviService();
        this.handChange = this.handChange.bind(this);
        this.removeItem = this.removeItem.bind(this);
        this.showModal = this.showModal.bind(this);
        this.save = this.save.bind(this);
        this.cancel = this.cancel.bind(this);
        this.isEditting = this.isEditting.bind(this);
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
    cancel() {
        this.setState({ visible: false });
    }
    save() {
        var _this = this;
        var data  = {};
        var dataSource = _.cloneDeep(_this.state.dataKhos);
        if (this.state.IdPhongBan === null) {
         data = {
                TenPhongBan: this.state.TenPhongBan,
                MaPhongBan: this.state.MaPhongBan,
                DonViId: this.state.DonViId,
            }
        } else {
         data = {
                IdPhongBan: this.state.IdPhongBan,
                TenPhongBan: this.state.TenPhongBan,
                MaPhongBan: this.state.MaPhongBan,
                DonViId: this.state.DonViId
            }
            _.remove(dataSource, function (i) {
                return i.IdPhongBan === data.IdPhongBan;
            })
        }
        var TenPhongBans = _.map(dataSource, function (i) { return i.TenPhongBan });
        var MaPhongBans = _.map(dataSource, function (i) { return i.MaPhongBan});
        // _.remove(TenLoaiHoSos,function(name){
        //     return name == _this.state.TenLoaiHoSo;
        // })
        // _.remove(MaLoaiHoSos,function(ma){
        //     return ma == _this.state.MaLoaiHoSo;
        // })
        if (this.state.TenPhongBan === "" || this.state.MaPhongBan === "") {
            var messages = "Vui lòng nhập đủ trường thông tin ";
            message.warning(messages);
            return;
        }
        if ((_.indexOf(TenPhongBans, data.TenPhongBan) !== -1)) {
            var messages = "Tên loại hồ sơ không hợp lệ. ";
            message.warning(messages);
            return;
        }
        if ((_.indexOf(MaPhongBans, data.MaPhongBan) !== -1)) {
            var messages = "Mã hồ sơ không hợp lệ. ";
            message.warning(messages);
            return;
        }
        else {
            this.phongbanService.saveItem(data)
                .then(function () {
                    notification.success({
                        defaultValue: "topRight",
                        message: "Thêm thành công",
                        duration: 4,
                    }
                    );
                    _this.setState({
                        visible: false,
                        IdPhongBan: null,
                        TenPhongBan: null,
                        MaPhongBan: null,
                        DonViId: null,
                        count: 1,
                    })
                    _this.componentDidMount();
                })
                .catch(function (err) {
                    notification.error(
                        {
                            message: "Có lỗi xảy ra",
                            description: "Xin vui lòng thử lại hoặc liên hệ với quản trị viên.",
                            defaultValue: "topRight",
                            duration: 4,
                        }
                    )
                })
        }

    }

    canDelete = (record)=>{
        //dataTLs
        if((_.indexOf(this.state.dataHoSos,record.IdPhongBan) !==-1)||(_.indexOf(this.state.dataTLs,record.IdPhongBan) !==-1)){   
            return false;
        }
        return true;
    }

    removeItem(record) {
        var _this = this;
        Modal.confirm({
            title: 'Bạn có muốn xóa không ?',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                if(!_this.canDelete(record)){
                    notification.error(
                        {
                            message: "Có lỗi xảy ra !",
                            defaultValue: "topRight",
                            description:"Dữ liệu đang được liên kết."
                        }
                    )
                    return;
                }
                _this.phongbanService.deleteItem(record.IdPhongBan)
                    .then(function () {
                        notification.success({
                            message: "Xóa thành công !",
                            defaultValue: "topRight",
                            duration: 2,
                        }
                        );
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
    handChange(event) {
        var name = event.target.name;
        var value = event.target.value;
        this.setState({
            [name]: value,
        })
    }
    searchItem = (query)=>{
        var _query = "AND TenPhongBan Like "+"'"+query+"%'";    
        var _this = this;
        var query = "";
        _this.donviService.getItems(query).
            then(function (data) {
                console.log(data)
                _this.setState({
                    dataDonVis: data.data,
                })
                return _this.phongbanService.getItems(_query);
            })
            .then(function (data) {
                var element = {
                    TenPhongBan: <Input name="TenPhongBan" type="text" onChange={_this.handChange} />,
                    MaPhongBan: <Input name="MaPhongBan" type="text" onChange={_this.handChange} />,
                    isCreate: true,
                };
                data.data.push(element);
                _this.setState({
                    dataPhongBans: data.data,
                })

            })
            _this.hosoService.getItems(query).then(function(data){
                _this.setState({
                    dataHoSos:_.map(data.data,"PhongBanSoHuuId")
                })
            })
            _this.tailieuService.getItems(query).then(function(data){
                _this.setState({
                    dataTLs:_.map(data.data,"PhongBanPheDuyetId")
                })
            })
    }   
    componentDidMount() {
        var _this = this;
        if(!this.isThuThu() && !this.isAdmin()){
            this.canNotAccess();
            return;
          }
        var query = "";
        _this.donviService.getItems(query).
            then(function (data) {
                console.log(data)
                _this.setState({
                    dataDonVis: data.data,
                })
                return _this.phongbanService.getItems(query);
            })
            .then(function (data) {
                var element = {
                    TenPhongBan: <Input name="TenPhongBan" type="text" onChange={_this.handChange} />,
                    MaPhongBan: <Input name="MaPhongBan" type="text" onChange={_this.handChange} />,
                    isCreate: true,
                };
                data.data.push(element);
                _this.setState({
                    dataPhongBans: data.data,
                })

            })
            _this.hosoService.getItems(query).then(function(data){
                _this.setState({
                    dataHoSos:_.map(data.data,"PhongBanSoHuuId")
                })
            })
            _this.tailieuService.getItems(query).then(function(data){
                _this.setState({
                    dataTLs:_.map(data.data,"PhongBanPheDuyetId")
                })
            })
            
    }
    isEditting(record) {
        var _this = this;
        var number = this.state.count;
        record.isEdit = true;
        this.setState({
            count: number + 1,
        })

        if (this.state.count > 1) {
            record.isEdit = false;
            message.warning("Không được phép sửa 2 bản ghi một lúc !")
            return;
        } else {
            this.setState({
                IdKho: record.IdKho,
                TenKho: record.TenKho,
                MaKho: record.MaKho,
                VungId: record.VungId,
            })
        }
    }
    showModal() {
        this.setState({
            TenVung: null,
            MaVung: null,
            visible: true,
        });
    }
    searchItem(value) {
        console.log(value);
    }
    render() {
        var _this = this;
        var menu = (
            <Menu.Item>
                Import
                </Menu.Item>
        )
        var dataset = _.map(this.state.dataPhongBans, function (data) {
            return { 'TenPhongBan': data.TenPhongBan, 'MaPhongBan': data.MaPhongBan, 'TenDonVi': data.TenDonVi };
        })
        dataset.pop();
        dataset.unshift({ TenPhongBan: 'Tên phòng ban', MaPhongBan: 'Mã phòng ban', TenDonVi: 'Tên đơn vị' })
        console.log(dataset);
        var option_ = _this.state.dataDonVis.map(function(donvi){
            return(
                <Option key = {donvi.IdDonVi} value={donvi.IdDonVi}>{donvi.TenDonVi}</Option>
            )
        })
        const columns = [
            {
                title: 'Tên phòng ban',
                dataIndex: 'TenPhongBan',
                key: "TenPhongBan",
                render: (TenPhongBan, record) => {
                    return (
                        <div>
                            {record.isEdit ? <Input name="TenPhongBan" type="text" value={_this.state.TenPhongBan} onChange={_this.handChange} /> : TenPhongBan}
                        </div>
                    )
                }
            },
            {
                title: 'Mã',
                dataIndex: 'MaPhongBan',
                key: "MaPhongBan",
                render: (MaPhongBan, record) => {
                    return (
                        <div>
                            {record.isEdit ? <Input name="MaPhongBan" type="text" value={_this.state.MaPhongBan} onChange={_this.handChange} /> : MaPhongBan}
                        </div>
                    )
                }
            },
            {
                title: 'Vùng ',
                dataIndex: 'TenDonVi',
                key: "TenDonVi",
                render: (TenDonVi, record) => {
                    return (
                        <div>
                            {record.isEdit ?
                                <Select defaultValue={null} onChange={(value) => this.setState({ DonViId: value })} value={this.state.DonViId} style={{ width: 220 }} >
                                    {option_}
                                </Select>
                                :
                                <div>
                                    {TenDonVi ? TenDonVi : <Select defaultValue={null} onChange={(value) => this.setState({ DonViId: value })} style={{ width: 220 }} >
                                        {option_}
                                    </Select>}
                                </div>
                            }
                        </div>
                    )
                }
            },

            {
                render: (record) => {
                    return (
                        <div>

                            {
                                record.isCreate ? <Button onClick={this.save} >  <Icon type="plus"></Icon></Button>
                                    :
                                    <div>
                                        <Button style={{ backgroundColor: "  #69c0ff" }} onClick={this.isEditting.bind(this, record)} hidden={record.isEdit}><Icon type="edit" />Edit</Button>
                                        <Button style={{ marginLeft: "5px", backgroundColor: "#ff4d4f", color: " #fff1f0" }} onClick={this.removeItem.bind(this, record)}><Icon type="delete" />Delete</Button>
                                        <Button onClick={this.save} hidden={!record.isEdit}>  <Icon type="save" ></Icon>  Save</Button>
                                    </div>
                            }


                        </div>
                    )
                },

            },


        ];
        var nameFile = " Phòng ban " + new Date();
        return (
            <div>
                <div style={{ marginTop: '10px', textAlign: "right" }}>
                    <Search
                        placeholder="Tìm kiếm ..."
                        onSearch={value => _this.searchItem(value)}
                        style={{ width: 400 }}
                    />
                    <span>
                        <ExportExel dataSet={dataset} filename = {nameFile}/>
                    </span>
                </div>
                <br />
                <Table rowKey="" columns={columns} dataSource={this.state.dataPhongBans} />
                <Row />
                <Modal
                    title="Tạo mới vùng"
                    visible={this.state.visible}
                    onOk={this.save}
                    onCancel={this.cancel}
                    okText="Create "
                    width="720px"

                // afterClose={this.testModal}
                // getContainer={document.body}
                // onOk={this.handleOk}
                // onCancel={this.handleCancel}
                >
                    <Form>
                        <br />
                        <Input name="TenVung" placeholder="Tên vùng" type="text" value={this.state.TenVung} onChange={this.handChange} />
                        <br />
                        <br />
                        <Input name="MaVung" type="text" placeholder="Mã vùng" value={this.state.MaVung} onChange={this.handChange} />
                        <br />
                        <br />
                        <br />
                        <br />
                        <Form.Item>
                            {/* <Button type="primary" htmlType="submit">
                            Add
                  </Button> */}
                        </Form.Item>
                    </Form>

                </Modal>
                <div>
                </div>
            </div>
        );
    }
}


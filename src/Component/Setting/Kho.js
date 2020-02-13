import React from 'react';
import 'antd/dist/antd.css';
import { Form, Menu, Input, Button, notification, message, Modal, Table, Icon, Select, Row } from 'antd';
import khoService from '../../Service/kho.service';
import vungService from '../../Service/vung.service';
import tuService from '../../Service/tu.service';
import hosoService from '../../Service/hosotailieu.service';
import tailieuService from'../../Service/tailieu.service';
import nguoidungService from '../../Service/nguoidung.service';
import ExportExel from '../Common/Export/ExportExel';
import * as CONSTANT from '../../Constant/constant';
import _ from 'lodash';
const { Option } = Select;
const { Search } = Input;
export default class LoaiHoSo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            IdKho: null,
            TenKho: null,
            MaKho: null,
            VungId: null,
            visible: false,
            dataKhos: [],
            dataVungs: [],
            dataTus:[],
            count: 1,
        };
        this.nguoidungService = new nguoidungService();
        this.hosoService = new hosoService();
        this.tailieuService = new tailieuService();
        this.khoService = new khoService();
        this.tuService = new tuService();
        this.vungService = new vungService();
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
        var data = {};
        var dataSource = _.cloneDeep(_this.state.dataKhos);
        if (this.state.IdKho === null) {
             data = {
                TenKho: this.state.TenKho,
                MaKho: this.state.MaKho,
                VungId: this.state.VungId,
            }
        } else {
             data = {
                IdKho: this.state.IdKho,
                TenKho: this.state.TenKho,
                MaKho: this.state.MaKho,
                VungId: this.state.VungId
            }
            _.remove(dataSource, function (i) {
                return i.IdKho === data.IdKho;
            })
        }
        var TenKhos = _.map(dataSource, function (i) { return i.TenKho });
        var MaKhos = _.map(dataSource, function (i) { return i.MaKho });
        // _.remove(TenLoaiHoSos,function(name){
        //     return name == _this.state.TenLoaiHoSo;
        // })
        // _.remove(MaLoaiHoSos,function(ma){
        //     return ma == _this.state.MaLoaiHoSo;
        // })
        if (this.state.TenKho === "" || this.state.MaKho === "") {
            var messages = "Vui lòng nhập đủ trường thông tin ";
            message.warning(messages);
            return;
        }
        if ((_.indexOf(TenKhos, data.TenKho) !== -1)) {
            var messages = "Tên loại hồ sơ không hợp lệ. ";
            message.warning(messages);
            return;
        }
        if ((_.indexOf(MaKhos, data.MaKho) !== -1)) {
            var messages = "Mã hồ sơ không hợp lệ. ";
            message.warning(messages);
            return;
        }
        else {
            this.khoService.saveItem(data)
                .then(function () {
                    notification.success({
                        defaultValue: "topRight",
                        message: "Thêm thành công",
                        duration: 4,
                    }
                    );
                    _this.setState({
                        visible: false,
                        IdKho: null,
                        TenKho: null,
                        MaKho: null,
                        VungId: null,
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
                _this.khoService.deleteItem(record.IdKho)
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
    canDelete = (record)=>{
        if((_.indexOf(this.state.dataTus,record.IdKho) !==-1)||(_.indexOf(this.state.dataHoSos,record.IdKho) !==-1)){   
            return false;
        }
        return true;
    }
    componentDidMount() {
        var _this = this;
        if(!this.isThuThu() && !this.isAdmin()){
            this.canNotAccess();
            return;
          }
        var query = "";
        _this.vungService.getItems(query).
            then(function (data) {
                console.log(data)
                _this.setState({
                    dataVungs: data.data,
                })
                return _this.khoService.getItems(query);
            })
            .then(function (data) {
                var element = {
                    TenKho: <Input name="TenKho" type="text" onChange={_this.handChange} />,
                    MaKho: <Input name="MaKho" type="text" onChange={_this.handChange} />,
                    isCreate: true,
                };
                data.data.push(element);
                _this.setState({
                    dataKhos: data.data,
                })
            })
        _this.tuService.getItems(query).then(function(data){
            _this.setState({
                dataTus:_.map(data.data,"IdKho"),
            })
        })    
        _this.hosoService.getItems(query).then(function(data){
            _this.setState({
                dataHoSos:_.map(data.data,"KhoId")
            })
        })
        // _this.tailieuService.getItems("").then(function(data){
        //     _this.setState({
        //         dataTLs:_.map(data.data,"PhongBanPheDuyetId")
        //     })
        // })
    }
    isEditting(record) {
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
    searchItem = (query)=>{
        var _query = "AND TenKho Like "+"'"+query+"%'";    
        var _this = this ;
        _this.khoService.getItems(_query).then(function(data){
            var element = {
                TenKho: <Input name="TenKho" type="text" onChange={_this.handChange} />,
                MaKho: <Input name="MaKho" type="text" onChange={_this.handChange} />,
                isCreate: true,
            };
            data.data.push(element);
            _this.setState({
                dataKhos: data.data,
            })
        })
    }
    render() {
        var _this = this;
        var menu = (
            <Menu.Item>
                Import
                </Menu.Item>
        )
        var dataset = _.map(this.state.dataKhos, function (data) {
            return { 'TenKho': data.TenKho, 'MaKho': data.MaKho, 'TenVung': data.TenVung };
        })
        dataset.pop();
        dataset.unshift({ TenKho: 'Tên kho', MaKho: 'Mã kho', TenVung: 'Tên vùng' })
        console.log(dataset);
        var option_ = _this.state.dataVungs.map(function(vung){
            return(
                <Option key = {vung.IdVung} value={vung.IdVung}>{vung.TenVung}</Option>
            )
        })
        const columns = [
            {
                title: 'Tên kho',
                dataIndex: 'TenKho',
                key: "TenKho",        
                render: (TenKho, record) => {
                    return (
                        <div>
                            {record.isEdit ? <Input name="TenKho" type="text" value={_this.state.TenKho} onChange={_this.handChange} /> : TenKho}
                        </div>
                    )
                }
            },
            {
                title: 'Mã',
                dataIndex: 'MaKho',
                key: "MaKho",
                render: (MaKho, record) => {
                    return (
                        <div>
                            {record.isEdit ? <Input name="MaKho" type="text" value={_this.state.MaKho} onChange={_this.handChange} /> : MaKho}
                        </div>
                    )
                }
            },
            {
                title: 'Vùng ',
                dataIndex: 'TenVung',
                key: "TenVung",
                render: (TenVung, record) => {
                    return (
                        <div>
                            {record.isEdit ?
                                <Select defaultValue={null} onChange={(value) => this.setState({ VungId: value })} value={this.state.VungId} style={{ width: 220 }} >
                                    {option_}
                                </Select>
                                :
                                <div>
                                    {TenVung ? TenVung : <Select defaultValue={null} onChange={(value) => this.setState({ VungId: value })} style={{ width: 220 }} >
                                        {option_}
                                    </Select>}
                                </div>
                            }
                        </div>
                    )
                }
            },  
            {   width : "250px",
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

        return (
            <div>
                <div style={{ marginTop: '10px', textAlign: "right" }}>
                    <Search
                        placeholder="Tìm kiếm ..."
                        onSearch={value => _this.searchItem(value)}
                        style={{ width: 400 }}
                    />
                    <span>
                        <ExportExel dataSet={dataset} />
                    </span>
                </div>
                <br />
                <Table rowKey="" columns={columns} dataSource={this.state.dataKhos} pagination={{ pageSize: 25 }}  />
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


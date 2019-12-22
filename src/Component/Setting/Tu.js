import React from 'react';
import 'antd/dist/antd.css';
import { Form, Menu, Input, Button, notification, message, Modal, Table, Icon, Select, Row } from 'antd';
import khoService from '../../Service/kho.service';
import tuService from '../../Service/tu.service';
import hosoService from '../../Service/hosotailieu.service';
import nguoidungService from '../../Service/nguoidung.service';
import ExportExel from '../Common/Export/ExportExel';
import * as CONSTANT from '../../Constant/constant';
import _ from 'lodash';
const { Option } = Select;
const { Search } = Input;
export default class Tu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            IdTu: null,
            TeTu: null,
            MaTu: null,
            KhoId: null,
            visible: false,
            dataTus: [],
            dataKhos: [],
            count: 1,
        };
        this.nguoidungService = new nguoidungService();
        this.hosoService = new hosoService();
        this.tuService = new tuService();
        this.khoService = new khoService();
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
        var dataSource = _.cloneDeep(_this.state.dataTus);
        if (this.state.IdTu === null) {
          data = {
                TenTu: this.state.TenTu,
                MaTu: this.state.MaTu,
                KhoId: this.state.KhoId,
            }
        } else {
         data = {
                IdTu: this.state.IdTu,
                TenTu: this.state.TenTu,
                MaTu: this.state.MaTu,
                KhoId: this.state.KhoId
            }
            _.remove(dataSource, function (i) {
                return i.IdTu === data.IdTu;
            })
        }
        var TenTus = _.map(dataSource, function (i) { return i.TenTu });
        var MaTus = _.map(dataSource, function (i) { return i.MaTu});    
        if (this.state.TenTu === null || this.state.MaTu === null) {
            var messages = "Vui lòng nhập đủ trường thông tin ";
            message.warning(messages);
            return;
        }
        if ((_.indexOf(TenTus, data.TenTu) !== -1)) {
            var messages = "Tên loại hồ sơ không hợp lệ. ";
            message.warning(messages);
            return;
        }
        if ((_.indexOf(MaTus, data.MaTu) !== -1)) {
            var messages = "Mã hồ sơ không hợp lệ. ";
            message.warning(messages);
            return;
        }
        else {
            this.tuService.saveItem(data)
                .then(function () {
                    notification.success({
                        defaultValue: "topRight",
                        message: "Thêm thành công",
                        duration: 4,
                    }
                    );
                    _this.setState({
                        visible: false,
                        IdTu: null,
                        TenTu: null,
                        MaTu: null,
                        KhoId: null,
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
    searchItem = (query)=>{
        var _query = "AND TenTu Like "+"'"+query+"%'";    
        var _this = this;
        _this.khoService.getItems("").
            then(function (data) {
                _this.setState({
                    dataKhos: data.data,
                })
                return _this.tuService.getItems(_query);
            })
            .then(function (data) {
                var element = {
                    TenTu: <Input name="TenTu" type="text" onChange={_this.handChange} />,
                    MaTu: <Input name="MaTu" type="text" onChange={_this.handChange} />,
                    isCreate: true,
                };
                data.data.push(element);
                _this.setState({
                    dataTus: data.data,
                })

            })
            _this.hosoService.getItems("").then(function(data){
                _this.setState({
                    dataHoSos:_.map(data.data,"TuId")
                })
            })
    }
    canDelete = (record)=>{
        if((_.indexOf(this.state.dataHoSos,record.IdTu) !==-1)){   
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
                _this.tuService.deleteItem(record.IdTu)
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
    componentDidMount() {
        var _this = this;
        if(!this.isThuThu() && !this.isAdmin()){
            this.canNotAccess();
            return;
          }
        var query = "";
        _this.khoService.getItems(query).
            then(function (data) {
                _this.setState({
                    dataKhos: data.data,
                })
                return _this.tuService.getItems(query);
            })
            .then(function (data) {
                var element = {
                    TenTu: <Input name="TenTu" type="text" onChange={_this.handChange} />,
                    MaTu: <Input name="MaTu" type="text" onChange={_this.handChange} />,
                    isCreate: true,
                };
                data.data.push(element);
                _this.setState({
                    dataTus: data.data,
                })

            })
            _this.hosoService.getItems(query).then(function(data){
                _this.setState({
                    dataHoSos:_.map(data.data,"TuId")
                })
            })
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
                IdTu: record.IdTu,
                TenTu: record.TenTu,
                MaTu: record.MaTu,
                KhoId: record.KhoId,
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
    render() {
        var _this = this;
        var menu = (
            <Menu.Item>
                Import
                </Menu.Item>
        )
        var dataset = _.map(this.state.dataTus, function (data) {
            return { 'TenTu': data.TenTu, 'MaTu': data.MaTu, 'TenKho': data.TenKho };
        })
        dataset.pop();
        dataset.unshift({ TenTu: 'Tên tủ', MaTu: 'Mã tủ', TenKho: 'Tên kho' })
        console.log(dataset);
        var option_ = _this.state.dataKhos.map(function(Kho){
            return(
                <Option key = {Kho.IdKho} value={Kho.IdKho}>{Kho.TenKho}</Option>
            )
        })
        const columns = [
            {
                title: 'Tên tủ',
                dataIndex: 'TenTu',
                key: "TenTu",
                render: (TenTu, record) => {
                    return (
                        <div>
                            {record.isEdit ? <Input name="TenTu" type="text" value={_this.state.TenTu} onChange={_this.handChange} /> : TenTu}
                        </div>
                    )
                }
            },
            {
                title: 'Mã',
                dataIndex: 'MaTu',
                key: "MaTu",
                render: (MaTu, record) => {
                    return (
                        <div>
                            {record.isEdit ? <Input name="MaTu" type="text" value={_this.state.MaTu} onChange={_this.handChange} /> : MaTu}
                        </div>
                    )
                }
            },
            {
                title: 'Kho',
                dataIndex: 'TenKho',
                key: "TenKho",
                render: (TenKho, record) => {
                    return (
                        <div>
                            {record.isEdit ?
                                <Select defaultValue={null} onChange={(value) => this.setState({ KhoId: value })} value={this.state.KhoId} style={{ width: 220 }} >
                                    {option_}
                                </Select>
                                :
                                <div>
                                    {TenKho ? TenKho : <Select defaultValue={null} onChange={(value) => this.setState({ KhoId: value })} style={{ width: 220 }} >
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
        var nameFile = "Tủ " + new Date();

        console.log(nameFile);
            return (
            <div>
                <div style={{ marginTop: '10px', textAlign: "right" }}>
                    <Search
                        placeholder="Tìm kiếm ..."
                        onSearch={value => _this.searchItem(value)}
                        style={{ width: 400 }}
                    />
                    <span>
                        <ExportExel dataSet={dataset} filename = {nameFile} />
                    </span>
                </div>
                <br />
                <Table rowKey="" columns={columns} dataSource={this.state.dataTus} />
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


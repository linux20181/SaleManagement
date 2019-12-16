import React from 'react';
import 'antd/dist/antd.css';
import { Form, Menu,Input, Button, notification, message, Modal, Table, Icon, Row } from 'antd';
import donviService from '../../Service/donvi.service';
import phongbanService from '../../Service/phongban.service';
import ExportExel from '../Common/Export/ExportExel';
import _ from 'lodash';
const { Search } = Input;

export default class DonVi extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            IdDonVi: null,
            TenDonVi: null,
            MaDonVi: null,
            visible: false,
            dataDonVis: [],
            dataPhongBans:[],
            count: 1,
        };
        this.phongbanService = new phongbanService();
        this.donviService = new donviService();
        this.handChange = this.handChange.bind(this);
        this.removeItem = this.removeItem.bind(this);
        this.showModal = this.showModal.bind(this);
        this.save = this.save.bind(this);
        this.cancel = this.cancel.bind(this);
        this.isEditting = this.isEditting.bind(this);
    }
    cancel() {
        this.setState({ visible: false });
    }
    save() {
        var _this = this;
        var data = {};
        var dataSource = _.cloneDeep(_this.state.dataDonVis);
        if (this.state.IdDonVi === null) {
       data = {
                TenDonVi: this.state.TenDonVi,
                MaDonVi: this.state.MaDonVi,
            }
        } else {
     data = {
                IdDonVi: this.state.IdDonVi,
                TenDonVi: this.state.TenDonVi,
                MaDonVi: this.state.MaDonVi,
            }
            _.remove(dataSource, function (i) {
                return i.IdDonVi === data.IdDonVi;
            })
        }
        var TenDonVis = _.map(dataSource, function (i) { return i.TenDonVi });
        var MaDonVis = _.map(dataSource, function (i) { return i.MaDonVi });
        if (this.state.TenDonVi === null || this.state.MaDonVi === null) {
            var messages = "Vui lòng nhập đủ trường thông tin ";
            message.warning(messages);
            return;
        }
        if ((_.indexOf(TenDonVis, data.TenDonVi) !== -1)) {
            var messages = "Tên loại hồ sơ không hợp lệ. ";
            message.warning(messages);
            return;
        }
        if ((_.indexOf(MaDonVis, data.MaDonVi) !== -1)) {
            var messages = "Mã hồ sơ không hợp lệ. ";
            message.warning(messages);
            return;
        }
        else {
            this.donviService.saveItem(data)
                .then(function () {
                    notification.success({
                        defaultValue: "topRight",
                        message: "Thêm thành công",
                        duration: 4,
                    }
                    );
                    _this.setState({
                        visible: false,
                        IdDonVi: null,
                        TenDonVi: null,
                        MaDonVi: null,
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
        if(_.indexOf(this.state.dataPhongBans,record.IdDonVi) !==-1){   
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
                _this.donviService.deleteItem(record.IdDonVi)
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
        var query = "";
        _this.donviService.getItems(query)
            .then(function (data) {
                var element = {
                    TenDonVi: <Input name="TenDonVi" type="text" onChange={_this.handChange} />,
                    MaDonVi: <Input name="MaDonVi" type="text" onChange={_this.handChange} />,
                    isCreate: true,
                };
                data.data.push(element);
                _this.setState({
                    dataDonVis: data.data,
                })
            })
        _this.phongbanService.getItems(query)
            .then(function(data){
                _this.setState({
                    dataPhongBans:_.map(data.data,"IdDonVi"),
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
                IdDonVi: record.IdDonVi,
                TenDonVi: record.TenDonVi,
                MaDonVi: record.MaDonVi,
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
    searchItem(value){
        console.log(value);
    }
    render() {
        var _this = this;
        var menu = (
            <Menu.Item>
                Import
                </Menu.Item>
        )
        var dataset = _.map(this.state.dataDonVis, function (data) {
            return { 'TenDonVi': data.TenDonVi, 'MaDonVi': data.MaDonVi};
        })
        dataset.pop();
        dataset.unshift({TenDonVi:'Tên đơn vị',MaDonVi:'Mã đơn vị'})
        const columns = [
            {
                title: 'Tên đơn vị',
                dataIndex: 'TenDonVi',
                key: "TenDonVi",
                render: (TenDonVi, record) => {
                    return (
                        <div>
                            {record.isEdit ? <Input name="TenDonVi" type="text" value={_this.state.TenDonVi} onChange={_this.handChange} /> : TenDonVi}
                        </div>
                    )
                }
            },
            {
                title: 'Mã',
                dataIndex: 'MaDonVi',
                key: "MaDonVi",
                render: (MaDonVi, record) => {
                    return (
                        <div>
                            {record.isEdit ? <Input name="MaDonVi" type="text" value={_this.state.MaDonVi} onChange={_this.handChange} /> : MaDonVi}
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

        return (
            <div>
                <div style={{ marginTop: '10px', textAlign: "right" }}>
                    <Search
                        placeholder="Tìm kiếm ..."
                        onSearch={value => _this.searchItem(value)}
                        style={{ width: 400 }}
                    />
                    <span>                  
                    <ExportExel dataSet = {dataset} filename="Đơn vị"/>
                    </span>
                </div>
                <br />
                <Table rowKey="" columns={columns} dataSource={this.state.dataDonVis} />
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


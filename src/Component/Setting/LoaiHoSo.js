import React from 'react';
import 'antd/dist/antd.css';
import { Form, Menu,Input, Button, notification, message, Modal, Table, Icon, Select, Row} from 'antd';
import loaihosoService from '../../Service/loaihoso.service';
import ExportExel from '../Common/Export/ExportExel';
import _ from 'lodash';
const { Option } = Select;
const { Search } = Input;
export default class LoaiHoSo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            IdLoaiHoSo: null,
            TenLoaiHoSo: null,
            MaLoaiHoSo: null,
            Cap: null,
            visible: false,
            dataLoaiHoSos: [],
            count: 1,
        };
        this.loaihosoService = new loaihosoService();
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
        var dataSource = _.cloneDeep(_this.state.dataLoaiHoSos);
        if (this.state.IdLoaiHoSo === null) {
        data = {
                TenLoaiHoSo: this.state.TenLoaiHoSo,
                MaLoaiHoSo: this.state.MaLoaiHoSo,
                Cap: this.state.Cap,
            }
        } else {
         data = {
                IdLoaiHoSo: this.state.IdLoaiHoSo,
                TenLoaiHoSo: this.state.TenLoaiHoSo,
                MaLoaiHoSo: this.state.MaLoaiHoSo,
                Cap: this.state.Cap
            }
            _.remove(dataSource, function (i) {
                return i.IdLoaiHoSo === data.IdLoaiHoSo;
            })
        }
        var TenLoaiHoSos = _.map(dataSource, function (lhs) { return lhs.TenLoaiHoSo });
        var MaLoaiHoSos = _.map(dataSource, function (lhs) { return lhs.MaLoaiHoSo });      
        if (this.state.TenLoaiHoSo === "" || this.state.MaLoaiHoSo === "") {
            var messages = "Vui lòng nhập đủ trường thông tin ";
            message.warning(messages);
            return;
        }
        if ((_.indexOf(TenLoaiHoSos, data.TenLoaiHoSo) !== -1)) {
            var messages = "Tên loại hồ sơ không hợp lệ. ";
            message.warning(messages);
            return;
        }
        if ((_.indexOf(MaLoaiHoSos, data.MaLoaiHoSo) !== -1)) {
            var messages = "Mã hồ sơ không hợp lệ. ";
            message.warning(messages);
            return;
        }
        else {
            this.loaihosoService.saveItem(data)
                .then(function (data) {
                    notification.success({
                        defaultValue: "topRight",
                        message: "Thêm thành công",
                        duration: 4,
                    }
                    );
                    _this.setState({
                        visible: false,
                        IdLoaiHoSo: null,
                        TenLoaiHoSo: null,
                        MaLoaiHoSo: null,
                        Cap: null,
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
                _this.loaihosoService.deleteItem(record.IdLoaiHoSo)
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
        _this.loaihosoService.getItems(query)
            .then(function (data) {
                var element = {
                    TenLoaiHoSo: <Input name="TenLoaiHoSo" type="text" onChange={_this.handChange} />,
                    MaLoaiHoSo: <Input name="MaLoaiHoSo" type="text" onChange={_this.handChange} />,
                    isCreate: true,
                };
                data.data.push(element);
                _this.setState({
                    dataLoaiHoSos: data.data,
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
                IdLoaiHoSo: record.IdLoaiHoSo,
                TenLoaiHoSo: record.TenLoaiHoSo,
                MaLoaiHoSo: record.MaLoaiHoSo,
                Cap: record.Cap,
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
        var dataset = _.map(this.state.dataLoaiHoSos, function (data) {
            return { 'TenLoaiHoSo': data.TenLoaiHoSo, 'MaLoaiHoSo': data.MaLoaiHoSo, 'Cap': data.Cap };
        })
        dataset.pop();
        dataset.unshift({TenLoaiHoSo:'Tên loại hồ sơ',MaLoaiHoSo:'Mã loại hồ sơ',Cap:'Cấp'})
        console.log(dataset);
        var option_ = [
            <Option value="1">1</Option>,
            <Option value="2">2</Option>,
            <Option value="3">3</Option>,

        ]
        const columns = [
            {
                title: 'Tên loại hồ sơ',
                dataIndex: 'TenLoaiHoSo',
                key: "TenLoaiHoSo",
                render: (TenLoaiHoSo, record) => {
                    return (
                        <div>
                            {record.isEdit ? <Input name="TenLoaiHoSo" type="text" value={_this.state.TenLoaiHoSo} onChange={_this.handChange} /> : TenLoaiHoSo}
                        </div>
                    )
                }
            },
            {
                title: 'Mã',
                dataIndex: 'MaLoaiHoSo',
                key: "MaLoaiHoSo",
                render: (MaLoaiHoSo, record) => {
                    return (
                        <div>
                            {record.isEdit ? <Input name="MaLoaiHoSo" type="text" value={_this.state.MaLoaiHoSo} onChange={_this.handChange} /> : MaLoaiHoSo}
                        </div>
                    )
                }
            },
            {
                title: 'Cấp ',
                dataIndex: 'Cap',
                key: "Cap",
                render: (Cap, record) => {
                    return (
                        <div>
                            {record.isEdit ?
                                <Select defaultValue={null} onChange={(value) => this.setState({ Cap: value })} value={this.state.Cap} style={{ width: 220 }} >
                                    {option_}
                                </Select>
                                :
                                <div>
                                    {Cap ? Cap : <Select defaultValue={null} onChange={(value) => this.setState({ Cap: value })} style={{ width: 220 }} >
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

        return (
            <div>
                <div style={{ marginTop: '10px', textAlign: "right" }}>
                    <Search
                        placeholder="Tìm kiếm ..."
                        onSearch={value => _this.searchItem(value)}
                        style={{ width: 400 }}
                    />
                    <span>                  
                    <ExportExel dataSet = {dataset} filename="Loại Hồ Sơ"/>
                    </span>
                </div>
                <br />
                <Table  rowKey="" columns={columns} dataSource={this.state.dataLoaiHoSos} />
                <Row />
                <Modal
                    title="Tạo mới vùng"
                    visible={this.state.visible}
                    onOk={this.save}
                    onCancel={this.cancel}
                    okText="Create "
                    width="720px"

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


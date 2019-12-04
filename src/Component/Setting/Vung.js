import React from 'react';
import 'antd/dist/antd.css';
import { Form, Menu,Input, Button, notification, message, Modal, Table, Icon, Row } from 'antd';
import vungService from '../../Service/vung.service';
import ExportExel from '../Common/Export/ExportExel';
import _ from 'lodash';
const { Search } = Input;
export default class Vung extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            IdVung: null,
            TenVung: null,
            MaVung: null,
            visible: false,
            dataVungs: [],
            count: 1,
        };
        this.vungService = new vungService();
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
        var data= {}
        var dataSource = _.cloneDeep(_this.state.dataVungs);
        if (this.state.IdVung === null) {
        data = {
                TenVung: this.state.TenVung,
                MaVung: this.state.MaVung,
            }
        } else {
        data = {
                IdVung: this.state.IdVung,
                TenVung: this.state.TenVung,
                MaVung: this.state.MaVung,
            }
            _.remove(dataSource, function (i) {
                return i.IdVung === data.IdVung;
            })
        }
        var TenVungs = _.map(dataSource, function (i) { return i.TenVung });
        var MaVungs = _.map(dataSource, function (i) { return i.MaVung });
        if (this.state.TenVung === "" || this.state.MaVung === "") {
            var messages = "Vui lòng nhập đủ trường thông tin ";
            message.warning(messages);
            return;
        }
        if ((_.indexOf(TenVungs, data.TenVung) !== -1)) {
            var messages = "Tên loại hồ sơ không hợp lệ. ";
            message.warning(messages);
            return;
        }
        if ((_.indexOf(MaVungs, data.MaVung) !== -1)) {
            var messages = "Mã hồ sơ không hợp lệ. ";
            message.warning(messages);
            return;
        }
        else {
            this.vungService.saveItem(data)
                .then(function () {
                    notification.success({
                        defaultValue: "topRight",
                        message: "Thêm thành công",
                        duration: 4,
                    }
                    );
                    _this.setState({
                        visible: false,
                        IdVung: null,
                        TenVung: null,
                        MaVung: null,
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
                _this.vungService.deleteItem(record.IdVung)
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
        _this.vungService.getItems(query)
            .then(function (data) {
                var element = {
                    TenVung: <Input name="TenVung" type="text" onChange={_this.handChange} />,
                    MaVung: <Input name="MaVung" type="text" onChange={_this.handChange} />,
                    isCreate: true,
                };
                data.data.push(element);
                _this.setState({
                    dataVungs: data.data,
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
                IdVung: record.IdVung,
                TenVung: record.TenVung,
                MaVung: record.MaVung,
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
        var dataset = _.map(this.state.dataVungs, function (data) {
            return { 'TenVung': data.TenVung, 'MaVung': data.MaVung};
        })
        dataset.pop();
        dataset.unshift({TenVung:'Tên vùng',MaVung:'Mã vùng'})
        console.log(dataset);
        const columns = [
            {
                title: 'Tên vùng',
                dataIndex: 'TenVung',
                key: "TenVung",
                render: (TenVung, record) => {
                    return (
                        <div>
                            {record.isEdit ? <Input name="TenVung" type="text" value={_this.state.TenVung} onChange={_this.handChange} /> : TenVung}
                        </div>
                    )
                }
            },
            {
                title: 'Mã',
                dataIndex: 'MaVung',
                key: "MaVung",
                render: (MaVung, record) => {
                    return (
                        <div>
                            {record.isEdit ? <Input name="MaVung" type="text" value={_this.state.MaVung} onChange={_this.handChange} /> : MaVung}
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
                    <ExportExel dataSet = {dataset}/>
                    </span>
                </div>
                <br />
                <Table rowKey="" columns={columns} dataSource={this.state.dataVungs} />
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


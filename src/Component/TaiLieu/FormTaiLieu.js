import React from 'react';
import { Form, Input, Row, Col, Select, Table, Button, notification, Icon, Dropdown, Menu, Modal } from 'antd';
class FormTaiLieu extends React.Component{
    change (){
        console.log('On Change')
    }
    render(){
        const { getFieldDecorator } = this.props.form;
        return(
            <div>
                <Form onChange = {this.change}>
                    <Row>
                        <Col span={12}>
                <Form.Item >
                            <Col span={2}>
                              Tên tài liêu:
                            </Col>
                            <span>
                              {getFieldDecorator('TenTaiLieu', {
                                rules: [{ required: true, message: "" }],
                              })(
                               <Input></Input>
                              )}
                            </span>
                          </Form.Item>
                          </Col>
                          </Row>
                    </Form>
            </div>
        )
    }
}
export default Form.create({})(FormTaiLieu)
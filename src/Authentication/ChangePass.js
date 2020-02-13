import React from 'react';
import nguoidungService from '../Service/nguoidung.service';
import { Form, Input, Button, Icon ,Checkbox,message,notification,Row, Col} from 'antd';

 class ChangePass extends React.Component {

constructor(props){
    super(props);
    this.state = {

    }
    this.nguoidungService = new nguoidungService();
}

componentDidMount =  ()=>{

}

saveItem =()=>{
    var _this = this ;
    var NewPass = "";
    var ConfirmPass = "";
    NewPass =  this.props.form.getFieldValue('newpassword');
    ConfirmPass =  this.props.form.getFieldValue('confirmpassword');
    if(!NewPass){
        message.warning("Vui lòng nhập mật khẩu mới !");
        return;
    }
    if(!ConfirmPass){
        message.warning("Vui lòng xác nhận mật khẩu !");
        return;
    }
    if(NewPass.length < 8){
        message.warning("Mật khẩu phải có ít nhất 8 ký tự  !");
        _this.props.form.resetFields(); 
        return;
    }
    if(ConfirmPass.length < 8){
        message.warning("Mật khẩu phải có ít nhất 8 ký tự  !");
        _this.props.form.resetFields(); 
        return;
    }
    if(NewPass !== ConfirmPass){
        message.warning("Xác nhận mật khẩu không đúng . Vui lòng thử lại !");
        return;
    }
    var data = this.nguoidungService.getUserCurrent();
    data.MatKhau = ConfirmPass;
    this.nguoidungService.changePassUser(data).then(function(){
        notification.success({
            defaultValue: "topRight",
            message: "Thay đổi mật khẩu thành công",
            duration: 1,
        }
        );
         _this.props.form.resetFields();  
    })
}



render(){
    const { getFieldDecorator } = this.props.form;
    return(
        <div>
               <Form  className="login-form">
        <Form.Item>
            <Col span = {3}>
                Mật khẩu mới : 
                </Col>
                <Col span = {19}>
          {getFieldDecorator('newpassword', {
            rules: [{ required: true, message: 'Please input your new password!' }],
          })(
            <Input
            style={{width:'400px'}}
              prefix={<Icon type="lock"style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="password"
              placeholder=""
            />,
          )}
          </Col>
        </Form.Item>
        <Form.Item>
        <Col span = {3}>
                Nhập lại mật khẩu: 
                </Col>
          {getFieldDecorator('confirmpassword', {
            rules: [{ required: true, message: 'Please input your confirm password!' }],
          })(
            <Input
            style={{width:'400px'}}
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="password"
              placeholder=""
            />,
          )}
        </Form.Item>
        <Button type="primary" onClick={this.saveItem}  className="login-form-button">
            Lưu lại
          </Button>
      </Form>
        </div>
    )
}
}
export default Form.create({})(ChangePass)
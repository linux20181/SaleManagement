import React from 'react';
import 'antd/dist/antd.css';
import { Form, Input, Button, Icon ,Checkbox,message,notification,Row} from 'antd';
import BlockUi from 'react-block-ui';
import nguoidungService from '../../Service/nguoidung.service';
import _ from 'lodash';
import ImgaeLogin from '../../Asset/Image/Login.png';
 class Login extends React.Component {
    constructor(props) {    
        super(props);
        this.state = {   
            Email : null,
            MatKhau :null,
            dataNguoiDung: [],
            loaded : true,  
        }; 
        this.nguoidungService = new nguoidungService();
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    
    handleSubmit (){
      var _this = this ;
      var filterEmail = [];
      filterEmail = _.map(_this.state.dataNguoiDung,function(data){
        return data.Email;
      })
      var data = {
            Email : this.props.form.getFieldValue('email'),
            MatKhau : this.props.form.getFieldValue('password')
        }
        if(!data.Email){
          var messages = "Email là trương bắt buộc.";
            message.warning(messages);
            return;
        }
        if(!data.MatKhau){
          var messages = "Mật khẩu là trường bắt buộc." ;
            message.warning(messages);
            return;
        }
        if(_.indexOf(filterEmail,data.Email) === -1){
          notification.error(
            {
                message: "Email không chính xác .",
                description: "Xin vui lòng thử lại",
                defaultValue: "topRight",
                duration: 2 ,
            }
        )
        setTimeout(function(){
          window.location.reload();
        },3000)
        return;
        }
        this.setState(data);
        this.nguoidungService.authenUser(data)
        .then(function(data){
            console.log(data.data);
            if(data.data.token){
              localStorage.setItem('ID',data.data.token);
              localStorage.setItem('User',JSON.stringify(data.data.result));
              _this.props.history.push("/home");
              window.location.reload();
            }else{
              notification.error(
                {
                    message: "Mật khẩu không chính xác .",
                    description: "Xin vui lòng thử lại .",
                    defaultValue: "topRight",
                    duration: 2 ,
                }
            )
            setTimeout(function(){
              _this.props.history.push("/login");
              window.location.reload();

            },3000);
            }
        }).catch(function(err){
       
          _this.props.history.push("/login");
          window.location.reload();
        }).finally(function(){
        })
    }
    componentDidMount(){
      var _this = this;
        this.nguoidungService.getItems("").then(
            function(data){
              _this.setState({
                dataNguoiDung:data.data,
              })
              setTimeout(function(){
                _this.setState({
                  loaded:false,
                })
              },2000)
            }
        )
    }
 render(){
   var _this = this;
     const { getFieldDecorator } = this.props.form;
     return (     
      <BlockUi tag="div" blocking={_this.state.loaded} >
      <Row>
         <div style={{backgroundColor:''}}>
         <div style={{ backgroundImage:"url(" + { ImgaeLogin } + ")",textAlign:"center",margin:"auto",marginTop:"10%",border:'solid',borderColor:"#ececec",borderRadius:'10px',height:'400px' , width:'600px',paddingTop:'50px'}}>
      <Form  className="login-form">
        <Form.Item>
          {getFieldDecorator('email', {
            rules: [{ required: true, message: 'Please input your email!' }],
          })(
            <Input
            style={{width:'400px'}}
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="email"
              placeholder="Email"
            />,
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: 'Please input your Password!' }],
          })(
            <Input
            style={{width:'400px'}}
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="password"
              placeholder="Password"
            />,
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('remember', {
            valuePropName: 'checked',
            initialValue: true,
          })(<Checkbox>Remember me</Checkbox>)}
          <br/>
        </Form.Item>
      </Form>
          <Button type="primary" onClick={this.handleSubmit}  className="login-form-button">
            Log in
          </Button>
      </div>
            </div>  
            </Row>      
            </BlockUi>
     )
 }
}
export default Form.create({})(Login)


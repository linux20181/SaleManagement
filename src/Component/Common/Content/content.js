import React from 'react';
import 'antd/dist/antd.css';
import 'react-block-ui/style.css';
import { Layout, Breadcrumb, Menu, Icon, Avatar, Badge, Dropdown } from 'antd';
import { BrowserRouter as Router, Route, Link  } from "react-router-dom";
import { IoIosPricetags ,IoMdAdd } from "react-icons/io";
import * as CONSTANT from '../../../Constant/constant';
import nguoidungService from '../../../Service/nguoidung.service';
import 'react-block-ui/style.css';
import _ from 'lodash';
// import Siders from './Sider';
import logo from '../../../Asset/Image/logo192.png'
import * as APP_STATE from '../../../router';
const { SubMenu } = Menu;
const { Content, Sider, Header } = Layout;
function convetHoTen(str){
    var arr = [];
    var _str = "";
    if(str){
       arr = _.cloneDeep(_.split(str," "));
    }
    _.forEach(arr,function(i){
        _str += i[0];
    })
    return _str;
}
export default class Contents extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.isLogout = this.isLogout.bind(this);
        this.nguoidungService = new nguoidungService();
        this.detailInfo = this.detailInfo.bind(this);
    }
    isAdmin(){
        var tmp = CONSTANT.GROUP.ADMIN;
        
      if(this.nguoidungService.getGroupUserCurrent() === tmp){
        return true;
      }
      return false;
      }
      isThuThu(){
        var tmp = CONSTANT.GROUP.THUTHU;
        if(this.nguoidungService.getGroupUserCurrent() === tmp){
          return true;
        }
        return false;
      }
    componentDidMount() {
        this.isAdmin();
    }
    isLogout(){
        if(localStorage.getItem('ID')){
            localStorage.removeItem('ID');
            localStorage.removeItem('User');
            window.location.reload();
        }
    }
   
    detailInfo(){      
        var _this =this
        window.location.replace("/nhansu/chitiet/" + _this.nguoidungService.getUserCurrent().ID);
    }
    render() {
        const menu = (
            <Menu>
                <Menu.Item>
                    <a onClick={this.detailInfo} >
                        Thông tin cá nhân
                </a>
                </Menu.Item>
                <Menu.Item>
                    <a onClick={this.isLogout}>
                        Đăng Xuất
                </a>
                </Menu.Item>

            </Menu>
        );
        return (
            <div>
                <Router>
                    <Header style={{ background: "white" }} className="header">
                        <div className="" />
                        <Menu
                            theme="light"
                            mode="horizontal"
                            defaultSelectedKeys={['2']}
                            style={{ lineHeight: '64px' }}
                        >
                            <Menu.Item key="4"> <Avatar size="large" src={logo} /></Menu.Item>
          
                            <Menu.Item key="1">
                                Trang chủ
                            </Menu.Item>
                            <Menu.Item key="2">Phòng ban</Menu.Item>
                            <Menu.Item key="3" style={{ float: 'right' }}>

                                <Dropdown overlay={menu} placement="bottomLeft">
                                <a style={{}}>{this.nguoidungService.getUserCurrent().HoTen}</a>
                                </Dropdown>
                            </Menu.Item>

                            <Menu.Item key="44" style={{ width:'55px',float: 'right' }}>
                                <span style={{ marginRight: "50px" }}>
                                    <Badge count={3}>
        <Avatar >{convetHoTen(this.nguoidungService.getUserCurrent().HoTen)}</Avatar>
                                    </Badge>
                                </span></Menu.Item>


                        </Menu>
                    </Header>    
                    <Content style={{ padding: '0 50px' }}>
                        <Breadcrumb style={{ margin: '16px 0' }}>
                            {/* <Breadcrumb.Item>Trang chủ</Breadcrumb.Item>
                        <Breadcrumb.Item>Phòng ban</Breadcrumb.Item>
                        <Breadcrumb.Item>Quản lý hồ sơ</Breadcrumb.Item> */}
                        </Breadcrumb>
                        <Layout style={{ padding: '24px 0', background: '#fff' }}>
                            {/* Region Siderbar */}
                            <Sider width={200} style={{ background: '#fff' }}>
                                <Menu
                                    mode="inline"
                                    defaultSelectedKeys={['1']}
                                    defaultOpenKeys={['sub1']}
                                    style={{ height: '100%' }}
                                >
                                    <Menu.Item key="123">     
                                        <Link to ="/home">
                                            <span>
                                                <Icon type="pie-chart" />                                             
                                                Dashboard
                                            </span>  
                                            </Link>                                                                                                                      
                                    </Menu.Item>
                                    <SubMenu
                                        key="sub1"
                                        title={
                                            <span>
                                                <Icon type="user" />
                                                Quản lý User
                </span>
                                        }
                                    >
                                        <Menu.Item key="1">
                                            Quản lý chung
                                        </Menu.Item>
                                        <Menu.Item key="2"><Link to={APP_STATE.APP_STATE.NHANSU.TREEHUMAN.url}>Sơ đồ nhân sự</Link></Menu.Item>
                                    { this.isAdmin() ? <Menu.Item key="11"><Link to={APP_STATE.APP_STATE.NHANSU.ADDHUMAN.url}>Bổ sung nhân sự</Link></Menu.Item> : null}
                                        <Menu.Item key="3">Phân quyền</Menu.Item>
                                        <Menu.Item key="4">Chi tiết</Menu.Item>
                                    </SubMenu>
                                    <SubMenu
                                        key="sub2"
                                        title={
                                            <span>
                                                <Icon type="laptop" />
                                                Thiết lập thuộc tính
                                          </span>
                                              }
                                               >
                                        <Menu.Item key="5">
                                            <Link to={APP_STATE.APP_STATE.SETTING.LOAIHOSO.url}>Loại hồ sơ </Link>
                                        </Menu.Item>
                                        <Menu.Item key="6">
                                            <Link to={APP_STATE.APP_STATE.SETTING.VUNG.url}>Vùng</Link>
                                        </Menu.Item>
                                        <Menu.Item key="7">
                                            <Link to={APP_STATE.APP_STATE.SETTING.KHO.url}>Kho</Link>
                                        </Menu.Item>
                                        <Menu.Item key="8">
                                            <Link to={APP_STATE.APP_STATE.SETTING.DONVI.url}>Đơn vị</Link>
                                        </Menu.Item>
                                        <Menu.Item key="9">
                                            <Link to={APP_STATE.APP_STATE.SETTING.PHONGBAN.url}>Phòng ban</Link>
                                        </Menu.Item>
                                        <Menu.Item key="10">
                                            <Link to={APP_STATE.APP_STATE.SETTING.TU.url}>Tủ</Link>
                                        </Menu.Item>
                                    </SubMenu>
                                    <SubMenu
                                        key="sub3"
                                        title={
                                            <span>
                                                <Icon type="notification" />
                                                 Thiết lập chung
                </span>
                                        }
                                    >
                                        <Menu.Item key="12"><Link to={APP_STATE.APP_STATE.HOSO.TAOMOIHOSO.url}> Tạo mới hồ sơ</Link></Menu.Item>
                                        <Menu.Item key="13">Chỉnh sửa hồ sơ</Menu.Item>                             
                                    </SubMenu>
                                    <SubMenu
                                        key="sub4"
                                        title={
                                            <span>
                                               <Icon type="unordered-list" />
                                                 Danh sách
                </span>
                                        }
                                    >
                                        <Menu.Item key="16"><Link to = {APP_STATE.APP_STATE.HOSO.DANHSACHHOSO.url}>Danh sách hồ sơ</Link></Menu.Item>
                                        <Menu.Item key="17"> <Link to = {APP_STATE.APP_STATE.TAILIEU.DANHSACHTAILIEU.url}>Danh sách tài liệu</Link></Menu.Item>
                                        <Menu.Item key="19">Yêu cầu cần xử lý</Menu.Item>
                                    </SubMenu>
                                    <SubMenu
                                    key = "sub5"
                                    title={
                                        <div>
                                        <IoIosPricetags />
                                            <span>
                                            Đăng ký mượn
                                            </span>
                                            </div>
                                    }
                                    >
                                        <Menu.Item key="33"><Link to = {APP_STATE.APP_STATE.DANGKYMUON.TAOMOI.url}>Tạo phiếu đăng ký</Link></Menu.Item> 
                                        <Menu.Item key="34"><Link to = {APP_STATE.APP_STATE.DANGKYMUON.DANHSACH.url}>Danh sách phiếu </Link></Menu.Item> 
                                        </SubMenu>
                                </Menu>
                            </Sider>                     
                            <Content style={{ padding: '0 24px', minHeight: 280 }}>
                                <Route exact path={APP_STATE.APP_STATE.NHANSU.DETAILHUMAN.url} component = {APP_STATE.APP_STATE.NHANSU.DETAILHUMAN.component} />
                            <Route exact path={APP_STATE.APP_STATE.DANGKYMUON.CHITIETPHIEU.url} component = {APP_STATE.APP_STATE.DANGKYMUON.CHITIETPHIEU.component} /> 
                            <Route exact path={APP_STATE.APP_STATE.DANGKYMUON.DANHSACH.url} component = {APP_STATE.APP_STATE.DANGKYMUON.DANHSACH.component} /> 
                            <Route exact path={APP_STATE.APP_STATE.DANGKYMUON.TAOMOI.url} component = {APP_STATE.APP_STATE.DANGKYMUON.TAOMOI.component} /> 
                            <Route exact path={APP_STATE.APP_STATE.TAILIEU.DANHSACHTAILIEU.url} component = {APP_STATE.APP_STATE.TAILIEU.DANHSACHTAILIEU.component} />                           
                                <Route exact path={APP_STATE.APP_STATE.HOME.url} component = {APP_STATE.APP_STATE.HOME.component} />                               
                            <Route exact path={APP_STATE.APP_STATE.HOSO.DANHSACHHOSO.url} component={APP_STATE.APP_STATE.HOSO.DANHSACHHOSO.component} />     
                            <Route exact path={APP_STATE.APP_STATE.HOSO.CHITIETHOSO.url} component={APP_STATE.APP_STATE.HOSO.CHITIETHOSO.component} />
                                <Route exact path={APP_STATE.APP_STATE.HOSO.TAOMOIHOSO.url} component={APP_STATE.APP_STATE.HOSO.TAOMOIHOSO.component} />             
                                <Route exact path={APP_STATE.APP_STATE.NHANSU.ADDHUMAN.url} component={APP_STATE.APP_STATE.NHANSU.ADDHUMAN.component} />
                                <Route exact path={APP_STATE.APP_STATE.NHANSU.TREEHUMAN.url} component={APP_STATE.APP_STATE.NHANSU.TREEHUMAN.component} />
                                <Route exact path={APP_STATE.APP_STATE.SETTING.TU.url} component={APP_STATE.APP_STATE.SETTING.TU.component} />
                                <Route exact path={APP_STATE.APP_STATE.SETTING.PHONGBAN.url} component={APP_STATE.APP_STATE.SETTING.PHONGBAN.component} />
                                <Route exact path={APP_STATE.APP_STATE.SETTING.DONVI.url} component={APP_STATE.APP_STATE.SETTING.DONVI.component} />
                                <Route exact path={APP_STATE.APP_STATE.SETTING.KHO.url} component={APP_STATE.APP_STATE.SETTING.KHO.component} />
                                <Route exact path={APP_STATE.APP_STATE.SETTING.VUNG.url} component={APP_STATE.APP_STATE.SETTING.VUNG.component} />
                                <Route exact path={APP_STATE.APP_STATE.SETTING.LOAIHOSO.url} component={APP_STATE.APP_STATE.SETTING.LOAIHOSO.component} />
                            </Content>
                        </Layout>
                    </Content>
                    
                </Router>
            </div>
        )
    }
} 
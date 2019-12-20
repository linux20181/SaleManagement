import React from 'react';
import 'antd/dist/antd.css';
import 'react-block-ui/style.css';
import { Layout, Breadcrumb, Menu, Icon, Avatar, Badge, Dropdown } from 'antd';
import { BrowserRouter as Router, Route, Link  } from "react-router-dom";
import { IoIosPricetags  } from "react-icons/io";
import * as CONSTANT from '../../../Constant/constant';
import nguoidungService from '../../../Service/nguoidung.service';
import phieunghiService from '../../../Service/phieunghi.service';
import phieumuonService from '../../../Service/phieumuon.service';
import 'react-block-ui/style.css';
import _ from 'lodash';
// import Siders from './Sider';
import logo from '../../../Asset/Image/logo192.png'
import * as APP_STATE from '../../../router';
const { SubMenu } = Menu;
const { Content, Sider, Header } = Layout;
function change_alias(alias) {
    var str = alias;
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g,"a"); 
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g,"e"); 
    str = str.replace(/ì|í|ị|ỉ|ĩ/g,"i"); 
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g,"o"); 
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g,"u"); 
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g,"y"); 
    str = str.replace(/đ/g,"d");
    str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g," ");
    str = str.replace(/ + /g," ");
    str = str.trim(); 
    return str;
}
function convetHoTen(str){
    var arr = [];
    var _str = "";
    
    if(str){
       arr = _.cloneDeep(_.split(change_alias(str)," "));
    }
    arr =_.compact(arr);
    _.forEach(arr,function(i){
        _str += i[0];
    })
    return _str.toUpperCase();
}
export default class Contents extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            toDoPhieuNghi:null,
            redirect:false,
            toDoPhieuOfMe:null
        };
        this.isLogout = this.isLogout.bind(this);
        this.nguoidungService = new nguoidungService();
        this.phieunghiService = new phieunghiService();
        this.phieumuonService = new phieumuonService();
        this.detailInfo = this.detailInfo.bind(this);
        this._detailPhieu = this._detailPhieu.bind(this);
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
       
        var _this = this;
        this.isAdmin();
        this.getPhieuNghiCanPheDuyet().then(function(data){
            _this.setState({
                toDoPhieuNghi:_.filter(data.data,function(d){
                    return d.NguoiPheDuyet === _this.nguoidungService.getUserCurrent().ID && d.TrangThaiPhieuNghi ==="Chờ xử lý";
                }),
            })
        }).then(function(){
            _this.getPhieuOfMe().then(function(data){
                if(data.length > 0){
                    if(new Date(data[0].ThoiGianKetThuc) < new Date()){
                        // console.log(new Date(data[0].ThoiGianKetThuc));
                        // console.log(new Date());
                        _this.phieunghiService.deleteItem(data[0].IdPhieuNghi).then(function(){
                            
                        })
                    }
                }
                    _this.setState({
                        toDoPhieuOfMe:data[0],
                    })
            })
        });
        
    }
    getPhieuNghiCanPheDuyet = async ()=>{
        return this.phieunghiService.getItems().then(function (data){
            return data;
            // _this.setState({
            //     toDoPhieuNghi:_.filter(data.data,function(d){
            //         return d.NguoiPheDuyet === _this.nguoidungService.getUserCurrent().ID;
            //     }),
            // })
        })
    }
    getPhieuOfMe = async ()=>{
        var _this = this;
        return this.phieunghiService.getItems().then(function (data){
            return _.filter(data.data,function(d){
                return d.IdNguoiDangKy === _this.nguoidungService.getUserCurrent().ID;
            })
            // _this.setState({
            //     toDoPhieuNghi:_.filter(data.data,function(d){
            //         return d.NguoiPheDuyet === _this.nguoidungService.getUserCurrent().ID;
            //     }),
            // })
        })
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
    _detailPhieu(data){
        if(data){
            window.location.replace("/nhansu/phieunghi/" + data.IdPhieuNghi);
        }
        return;    
    }
    render() {
        console.log(this.state);
        var _this =this;
        const menu = (
            <Menu>
                <Menu.Item>
                    <a onClick={this.detailInfo} >
                        Thông tin cá nhân
                </a>
                </Menu.Item>
                <Menu.Item>
                    <a onClick={this._detailPhieu.bind(this,_this.state.toDoPhieuOfMe)} >
                        Phiếu nghỉ của tôi
                </a>
                </Menu.Item>
                <Menu.Item>
                    <a onClick={null}>
                       Đổi mật khẩu
                </a>
                </Menu.Item>
                <Menu.Item>
                    <a onClick={this.isLogout}>
                        Đăng Xuất
                </a>
                </Menu.Item>

            </Menu>
        );
        var _menu = null;
        if(_this.state.toDoPhieuOfMe){
            if(_this.state.toDoPhieuOfMe.TrangThaiPhieuNghi === "Đã phê duyệt"){
                var _tmp = (
                    <Menu.Item onClick={ _this._detailPhieu.bind(this,this.state.toDoPhieuOfMe) }>
                        <div >
                            <span>Phiếu đăng ký nghỉ </span>
                    {this.state.toDoPhieuOfMe.MaPhieuNghi}
                <span> đã được phê duyệt</span>
                    </div>
                    </Menu.Item>    
            );
        }
        }
        if(this.state.toDoPhieuNghi){       
             _menu = this.state.toDoPhieuNghi.map(function(data){
                return(
                    <Menu.Item onClick={ _this._detailPhieu.bind(this,data) }>
                        <div >
                            <span>Phiếu nghỉ </span>
                    {data.MaPhieuNghi}
                <span> của {data.TenNguoiDangKy}</span>
                    </div>
                    </Menu.Item>
            )
        })
        _menu.push(_tmp);
    }
        
        const menuToDo = (
            <Menu>
               {_menu}
            </Menu>
        );
        var _count = 0;
        if(_tmp){
            _count = 1;
        }
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
                            <Link to ="/home">
                                          Trang Chủ 
                                            </Link> 
                            </Menu.Item>
                            <Menu.Item key="3" style={{ float: 'right' }}>

                                <Dropdown overlay={menu} placement="bottomLeft">
                                <a style={{}}>{this.nguoidungService.getUserCurrent().HoTen}</a>
                                </Dropdown>
                            </Menu.Item>

                            <Menu.Item key="44" style={{ width:'55px',float: 'right' }}>
                                <span style={{ marginRight: "50px" }}>
                                <Dropdown overlay={menuToDo} placement="bottomCenter">
                                    <Badge count={this.state.toDoPhieuNghi?this.state.toDoPhieuNghi.length + _count:0}>
        <Avatar >{convetHoTen(this.nguoidungService.getUserCurrent().HoTen)}</Avatar>
                                    </Badge>
                                    </Dropdown>
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
                                       
                                        <Menu.Item key="2"><Link to={APP_STATE.APP_STATE.NHANSU.TREEHUMAN.url}>Sơ đồ nhân sự</Link></Menu.Item>
                                    { this.isAdmin() ? <Menu.Item key="11"><Link to={APP_STATE.APP_STATE.NHANSU.ADDHUMAN.url}>Bổ sung nhân sự</Link></Menu.Item> : null}
                                        <Menu.Item key="4"><Link to={APP_STATE.APP_STATE.NHANSU.DANGKYNGHI.url}>Đăng ký nghỉ</Link></Menu.Item>
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
                            <Route exact path={APP_STATE.APP_STATE.NHANSU.DETAILPHIEUNGHI.url} component = {APP_STATE.APP_STATE.NHANSU.DETAILPHIEUNGHI.component} />
                            <Route exact path={APP_STATE.APP_STATE.NHANSU.DANGKYNGHI.url} component = {APP_STATE.APP_STATE.NHANSU.DANGKYNGHI.component} />
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
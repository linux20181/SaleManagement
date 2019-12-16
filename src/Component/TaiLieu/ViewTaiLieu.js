import React from 'react';
import 'antd/dist/antd.css';
import {Table,Row,Input,Col,Dropdown,Menu,Icon} from 'antd';
import { IoIosFlag } from "react-icons/io";
import _ from 'lodash';
import loaihosoService from '../../Service/loaihoso.service';
import donviService from '../../Service/donvi.service';
import vungService from '../../Service/vung.service';
import khoService from '../../Service/kho.service';
import phongbanService from '../../Service/phongban.service';
import hosotailieuService from '../../Service/hosotailieu.service';
import tailieuService from '../../Service/tailieu.service';
import logService from '../../Service/log.service';
import tuService from '../../Service/tu.service';
import ExportExel from '../Common/Export/ExportExel'
const { Search } = Input;
export default class ViewTaiLieu extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            dataSourceTL:null,
            dataSourceLoaiHoSo:null,
            dataSourceDonVi:null,
            dataSourcePhongBan:null,
        }
        this.khoService = new khoService();
        this.tailieuService = new tailieuService();
        this.vungService = new vungService();
        this.donviService = new donviService();
        this.loaihosoService = new loaihosoService();
        this.phongbanService = new phongbanService();
        this.hosotailieuService = new hosotailieuService();
        this.logService = new logService();
        this.tuService = new tuService();
    }
    componentDidMount(){
        var _this = this;
        var promises = [
            this.tailieuService.getItems(),
            this.phongbanService.getItems(),
            this.donviService.getItems(),
            this.loaihosoService.getItems(),   
        ];
        Promise.all(promises).then(function(data){
            _this.setState({
                dataSourceTL:data[0].data,
                dataSourcePhongBan:data[1].data,
                dataSourceDonVi:data[2].data,
                dataSourceLoaiHoSo:data[3].data,
            })
        })
      
    }
    convertDate(date) {
        var date = new Date(date);
        if (typeof (date) === "object") {
            var stringDate = date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate();
            return stringDate
        }
        return null;
    }
   render(){
    var _this = this;
    var dataset = null
    dataset = _.map(this.state.dataSourceTL, function (data) {
        return { 
            'SoHieuTaiLieu' : data.SoHieuTaiLieu,
            'TenTaiLieu': data.TenTaiLieu,
            'NgayBanHanh':_this.convertDate(data.NgayBanHanh),
            'NgayHetHan':_this.convertDate(data.NgayHetHan),
            'SoTrang':data.SoTrang,
            'DangVanBan':data.DangVanBan,
            'GhiChu':data.GhiChu,
            'TinhTrangMuonTra':data.TinhTrangMuonTra,
             }
        })
   // dataset.pop();
    dataset.unshift({SoHieuTaiLieu:'Số hiệu tài liệu',TenTaiLieu:'Tên tài liệu',NgayBanHanh:'Ngày ban hành',NgayHetHan:'Ngày hết hạn',SoTrang:"SoTrang",GhiChu:"Ghi chú",TinhTrangMuonTra:"Tình trạng mượn trả"})
    var columnsTL = [
        {
            title: "#",
            width:"60px",
            fixed:"left",
            render:()=>{
                return(
                    <div style={{width:"20px"}}>
                    <Dropdown overlay={_menu} trigger={['click']}>
                     <a style = {{color:" rgb(0, 255, 161)"}}><Icon style={{ fontSize: '20px' }} type="more" /></a>
                     </Dropdown>
                     </div>
                )
            }
            
        },
        {
            title: "Số hiệu tài liệu",
            dataIndex: 'SoHieuTaiLieu',
            key: 'SoHieuTaiLieu',  
            width:"200px",
            fixed:"left",
        },
        {
            title: "Tên tài liệu",
            dataIndex: 'TenTaiLieu',
            key: 'TenTaiLieu',
            width:"400px",
            fixed : "left"
        
      
        },
        {
            title: "Mã tài liệu văn thư",
            dataIndex: 'MaTaiLieuVanThu',
            key: 'MaTaiLieuVanThu'
        },
        {
            title: "Ngày ban hành",
            dataIndex: 'NgayBanHanh',
            key: 'NgayBanHanh',
            render:(NgayBanHanh)=>{
                return(
                    <div>
                        <div>
                        {this.convertDate(NgayBanHanh)}
                    </div>
                        </div>
                )
            }
        },
        {
            title: "Ngày hết hạn",
            dataIndex: 'NgayHetHan',
            key: 'NgayHetHan',
            render:(NgayHetHan)=>{
                return(
                    <div>
                        {this.convertDate(NgayHetHan)}
                    </div>
                )
            }
         
        },
        {
            title: "Loại hồ sơ",
            dataIndex: 'LoaiTaiLieuId',
            key: 'LoaiTaiLieuId',
            render:(LoaiTaiLieuId) =>{
                return(                                           
                    <div>
                        { LoaiTaiLieuId ? _.filter(this.state.dataSourceLoaiHoSo,function(i){
                            return i.IdLoaiHoSo === LoaiTaiLieuId;
                        })[0].TenLoaiHoSo : null}
                        </div>
                )
            }
         
        },
        {
            title: "Đơn vị ban hành",
            dataIndex: 'DonViBanHanhId',
            key: 'DonViBanHanhId',
            render:(DonViBanHanhId) =>{
                return(                                           
                    <div>
                        { DonViBanHanhId ? _.filter(this.state.dataSourceDonVi,function(i){
                            return i.IdDonVi === DonViBanHanhId;
                        })[0].TenDonVi : null}
                        </div>
                )
            }
         
        },
        {
            title: "Phòng ban phê duyệt",
            dataIndex: 'PhongBanPheDuyetId',
            key: 'PhongBanPheDuyetId',
            render:(PhongBanPheDuyetId) =>{
                return(                                           
                    <div>
                        { PhongBanPheDuyetId ? _.filter(this.state.dataSourcePhongBan,function(i){
                            return i.IdPhongBan === PhongBanPheDuyetId;
                        })[0].TenPhongBan : null}
                        </div>
                )
            }
        },
        {
            title: "Số trang",
            dataIndex: 'SoTrang',
            key: 'SoTrang'
         
        },
        {
            title: "Dạng văn bản",
            dataIndex: 'DangVanBan',
            key: 'DangVanBan'
         
        },
        {
            title: "Ghi chú",
            dataIndex: 'GhiChu',
            key: 'GhiChu'
         
        },
        {
            title: "Tình trạng mượn trả",
            dataIndex: 'TinhTrangMuonTra',
            key: 'TinhTrangMuonTra'
         
        },
    ]
    const menu = (
        <Menu>
          <Menu.Item>
          <ExportExel dataSet = {dataset} filename="Tài liệu"/>
          </Menu.Item>
         
        </Menu>
      );
      const _menu = (
        <Menu>
          <Menu.Item>
          <IoIosFlag style={{color:"rgb(0, 255, 161)"}} size="15px"/> <span></span>
          </Menu.Item>
         
        </Menu>
      );
       return(
        <div>
             <div>
                 <Row style={{}}>
                     <div >
                     <Col span={12}>
                  <h1  style={{ textTransform:"uppercase", color: "#1890ff" }}> Danh sách tài liệu</h1> 
                 </Col>
                 <Col span = {12}>
                  <div style={{ textAlign: "right" }}>
                    <Search
                        placeholder="Tìm kiếm ..."
                      
                        style={{ width: 400 }}
                    />
                    <span>
                    <Dropdown overlay={menu} trigger={['click']}>
                     <a style = {{color : "#534e4e"}}><Icon style={{ fontSize: '25px' }} type="more" /></a>
                     </Dropdown></span>
                </div>
                </Col>
                </div>
                  </Row>
                  <div style={{marginBottom:"20px"}} className = "form-head"> </div>
                  <Table bordered rowKey="" columns = {columnsTL} dataSource = {this.state.dataSourceTL} pagination={{ pageSize: 25 }}  scroll={{ x: 2300 , y:1300 }}/>
                  </div>
        </div>
       )
   }
}
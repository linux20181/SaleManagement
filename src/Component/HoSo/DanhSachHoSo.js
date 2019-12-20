import React from 'react';
import 'antd/dist/antd.css';
import { Table,Dropdown,Icon,Menu,notification,Row,Col,Input} from 'antd';
import { IoIosFlag } from "react-icons/io";
import _ from 'lodash';
import hosotailieuService from '../../Service/hosotailieu.service';
import nguoidungService from '../../Service/nguoidung.service';
import vungService from '../../Service/vung.service';
import khoService from '../../Service/kho.service';
import tuService from '../../Service/tu.service';
import phieumuonService from '../../Service/phieumuon.service';
const { Search } = Input;
function convertTime(date) {
    var stringDate = date.getFullYear() + "-" + JSON.stringify(parseInt(date.getMonth()) + 1) + "-" + date.getDate() ;
    return stringDate
  }
  function convertTimePay(date) {
      if(parseInt(date.getMonth()) === 1 || parseInt(date.getMonth())=== 3 ||parseInt(date.getMonth) === 5 ||parseInt(date.getMonth) === 7||parseInt(date.getMonth) ===8||parseInt(date.getMonth) === 10){
          if(parseInt(date.getDate()) > 16){
            var Ngay = 31 - parseInt(date.getDate()) - 15;
            var Thang = parseInt(date.getMonth()) + 2;
            var stringDate = date.getFullYear() + "-" + JSON.stringify(Thang) + "-" + JSON.stringify(Ngay);
            return stringDate
        }else{
        var Ngay = parseInt(date.getDate()) + 15;
          var Thang = date.getMonth() + 1;
          var stringDate = date.getFullYear() + "-" + JSON.stringify(Thang) + "-" + JSON.stringify(Ngay);
          return stringDate
        } 
      }
      if(parseInt(date.getMonth())===12){
        if(parseInt(date.getDate()) > 16){
        var Ngay = 31 - parseInt(date.getDate()) - 15;
        var Thang = parseInt(date.getMonth()) + 2;
        var Nam =  parseInt(date.getMonth()) + 1 ;
        var stringDate = JSON.stringify(Nam) + "-" + JSON.stringify(Thang) + "-" + JSON.stringify(Ngay);
        return stringDate
        }else{
            var Ngay = parseInt(date.getDate()) + 15;
            var Thang = date.getMonth() + 1;
            var stringDate = date.getFullYear() + "-" + JSON.stringify(Thang) + "-" + JSON.stringify(Ngay);
            return stringDate
        }
    }  
      if(parseInt(date.getMonth()) === 2) {
          if(parseInt(date.getDate()) > 13){
              var Ngay = parseInt(date.getDate())+ 15 - 28;
              var Thang = 3;
              var stringDate = date.getFullYear() + "-" + JSON.stringify(Thang) + "-" + JSON.stringify(Ngay);
              return stringDate;
          }
          var Ngay = parseInt(date.getDate()) + 15;
          var Thang = date.getMonth() + 1;
           var stringDate = date.getFullYear() + "-" + JSON.stringify(Thang) + "-" + JSON.stringify(Ngay);
              return stringDate;
      }
      if(parseInt(date.getDate()) >15){
        var Ngay = parseInt(date.getDate())+ 15 - 30;
        var Thang = parseInt(date.getMonth()) + 2;
        var stringDate = date.getFullYear() + "-" + JSON.stringify(Thang) + "-" + JSON.stringify(Ngay);
        return stringDate;
      }
        var Ngay = parseInt(date.getDate()) + 15;
        var Thang = date.getMonth() + 1;
        var stringDate = date.getFullYear() + "-" + JSON.stringify(Thang) + "-" + JSON.stringify(Ngay);
            return stringDate;
  }
export default class DanhSachHoSo extends React.Component {
      constructor(props){
          super(props);
          this.state = {
              dataSource :[],
              dataVungs:[],
              dataKhos:[],
              dataTus: [],
              HoSo: null,
              recordBorrow:null
          }
          this.nguoidungService = new nguoidungService();
          this.phieumuonService = new phieumuonService();
          this.hosotailieuService = new hosotailieuService();
          this.vungService = new vungService();
          this.khoService = new khoService();
          this.tuService = new tuService();
          this.onDetail = this.onDetail.bind(this);
          this.handleVisibleChange = this.handleVisibleChange.bind(this);
          this.sendBorrow = this.sendBorrow.bind(this);
      }

      searchItem = (query)=>{
        var _query = "Where TenHoSo Like "+"'"+query+"%'";    
        var _this = this;
        var promise = [_this.vungService.getItems(""),_this.khoService.getItems(""),_this.tuService.getItems("")];
          Promise.all(promise).then(function(data){
              return data;
          }).then(function(data){
              var self = data;
              _this.setState({
                  dataVungs:data[0].data,
                  dataKhos:data[1].data,
                  dataTus:data[2].data,
              })
              _this.hosotailieuService.getItems(_query).then(function(data){
                  console.log(data.data);
                  _this.setState({
                      dataSource : data.data,
                  })
              })
          })
    }

      componentDidMount(){
          var _this = this;
          var promise = [_this.vungService.getItems(""),_this.khoService.getItems(""),_this.tuService.getItems("")];
            Promise.all(promise).then(function(data){
                return data;
            }).then(function(data){
                var self = data;
                _this.setState({
                    dataVungs:data[0].data,
                    dataKhos:data[1].data,
                    dataTus:data[2].data,
                })
                _this.hosotailieuService.getItems("").then(function(data){
                    console.log(data.data);
                    _this.setState({
                        dataSource : data.data,
                    })
                })
            })
      }
      onDetail(record){
        this.props.history.push("/hosotailieu/" + record.id);
      }
      sendBorrow(){
         var _this = this ; 
            var CloneHoSo = this.state.HoSo;
         if(this.state.HoSo.TinhTrangMuonTra !=="Lưu kho"){
            notification.error(
                {
                    message: "Hồ sơ đã cho mượn. Vui lòng đăng ký mượn hồ sơ khác !",
                    defaultValue: "topRight",
                    duration: 4,
                }
            )
            return;
         }
          this.phieumuonService.saveItem(this.state.recordBorrow).then(function(){
            notification.success({
                defaultValue: "topRight",
                message: "Đăng ký mượn thành công !",
                description :" Thông tin chi tiết xin vui lòng xem trong Email .",
                duration: 4,
            }
            ); 
            CloneHoSo.TinhTrangMuonTra = "Đã cho mượn";
            _this.hosotailieuService.saveItem(CloneHoSo).then(function(){

            })
          })
      }
      handleVisibleChange(record){
          var _this = this ;
          var data = null;
          convertTimePay(new Date());
          this.setState({
            HoSo:record,
          })
          data={
              MaPhieuMuon: "PM"+"-" + record.IdHoSo +  new Date().toLocaleTimeString().substring(0, new Date().toLocaleTimeString().length - 2),
              TenPhieuMuon:"Phiếu mượn"+"-"+record.IdHoSo + new Date().toLocaleTimeString().substring(0, new Date().toLocaleTimeString().length - 2),
              Author:_this.nguoidungService.getUserCurrent().Email,
              ThoiGianMuon: convertTime(new Date()),
              ThoiGianTra: convertTimePay(new Date()),
              TenHoSoMuonId : record.IdHoSo,
              TrangThai:'Chờ xử lý',
              TenHoSoDaChoMuon: record.TenHoSo
          }
           data.MaPhieuMuon = data.MaPhieuMuon.replace(":","");
           data.TenPhieuMuon = data.TenPhieuMuon.replace(":","");
            data.MaPhieuMuon = data.MaPhieuMuon.replace(":","");
           data.TenPhieuMuon = data.TenPhieuMuon.replace(":","");
          _this.setState({
              recordBorrow:data,
          })
      }
      render(){
          var _this = this;
          const _menu = (
            <Menu>
              <Menu.Item>
              <IoIosFlag style={{color:"rgb(0, 255, 161)"}} size="15px"/> <span onClick={this.sendBorrow}> Đăng ký mượn </span>
              </Menu.Item>
             
            </Menu>
          );
         var columns = [
            {
                title: "#",
                width:"60px",
                fixed:"left",
                render:(record)=>{
                    return(
                        <div style={{width:"20px"}}>
                        <Dropdown
                        overlay={_menu} 
                        trigger={['click']}
                        onVisibleChange={this.handleVisibleChange.bind(this,record)}
                        >
                         <a style = {{color:" rgb(0, 255, 161)"}}><Icon style={{ fontSize: '20px' }} type="more" /></a>
                         </Dropdown>
                         </div>
                    )
                }
                
            },
            {
                title :"Số hiệu hồ sơ",
                dataIndex: 'SoHieuHoSo',
                key : "SoHieuHoSo",
                width : "200px",
                fixed: 'left',
                render:(text,record)=>{
                    return(
                        <a onClick = {_this.onDetail.bind(this,record)}>{text}</a>
                        )
                }
             },
            {
                title :"Tên hồ sơ",
                dataIndex : 'TenHoSo',
                width : "200px",
                fixed: 'left',
                render:(text,record)=>{
                    return(
                        <a onClick = {_this.onDetail.bind(this,record)}>{text}</a>
                        )
                }
            },
            {
                title :"Loại hồ sơ",
                dataIndex : 'TenLoaiHoSo',
                width : "200px",
            },
            {
                title :"Dạng văn bản",
                dataIndex : 'MasterData',
                width : "200px",
            },
            {
                title : "Đơn vị sỡ hữu",
                dataIndex:"TenDonVi",
                width : '200px',
            },
            {
                title:"Phòng ban sỡ hữu",
                dataIndex:"TenPhongBan",
                width : "200px",
            },
            {
                title: "Ghi chú",
                dataIndex: "GhiChu",
                width : "200px",
            },
            {
                title: " Năm hồ sơ",
                dataIndex:"NamHoSo",
                width : "200px",
            },
            {
                title: "Vùng",
                dataIndex:"VungId",
                width : "200px",
                render:(VungId,record)=>{
                    return(
                        <div>
                            <span>
                                {_.filter(this.state.dataVungs,function(i){
                                    return i.IdVung === VungId;
                                })[0].TenVung}
                                </span>
                            </div>
                    )
                }
            },
            {
                title: "Kho lưu trữ",
                dataIndex:"KhoId",
                width : "200px",
                render:(KhoId,record)=>{
                    return(
                        <div>
                            <span>
                                {_.filter(this.state.dataKhos,function(i){
                                    return i.IdKho === KhoId;
                                })[0].TenKho}
                                </span>
                            </div>
                    )
                }
            },
            {
                title: "Tủ",
                dataIndex:"TuId",
                width : "200px",
                render:(TuId,record)=>{
                    return(
                        <div>
                            <span>
                                {TuId ? _.filter(this.state.dataTus,function(i){
                                    return i.IdTu === TuId;
                                })[0].TenTu : null}
                                </span>
                            </div>
                    )
                }
            },
            {
                title: "Tình trạng mượn trả",
                dataIndex:"TinhTrangMuonTra",
                key:"TinhTrangMuonTra",
                width : "200px",
            },
          ]
          return(
              <div>
                   <Row style={{}}>
                     <div >
                     <Col span={12}>
                  <h1  style={{ textTransform:"uppercase", color: "#1890ff" }}> Danh hồ sơ</h1> 
                 </Col>
                 <Col span = {12}>
                  <div style={{ textAlign: "right" }}>
                  <Search
                        placeholder="Tìm kiếm ..."
                        onSearch={value => _this.searchItem(value)}
                        style={{ width: 400 }}
                    />
                    <span>
                    <Dropdown overlay={null} trigger={['click']}>
                     <a style = {{color : "#534e4e"}}><Icon style={{ fontSize: '25px' }} type="more" /></a>
                     </Dropdown></span>
                </div>
                </Col>
                </div>
                  </Row>
                  <div style={{marginBottom:"20px"}} className = "form-head"> </div>
                  <Table bordered rowKey="" columns = {columns} dataSource = {this.state.dataSource} pagination={{ pageSize: 25 }} scroll={{ x: 1300 , y:1300 }}/>
                  </div>
          )
      }
}



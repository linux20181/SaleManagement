import React from 'react';
import {Row, Col, Table} from 'antd';
import {FaChartBar} from 'react-icons/fa';
import {FaStaylinked} from 'react-icons/fa';
import {FaHockeyPuck} from 'react-icons/fa';
import hosotailieuService from '../../Service/hosotailieu.service';
import tailieuService from '../../Service/tailieu.service';
import phieumuonService from '../../Service/phieumuon.service';
import Status from '../../Component/Common/Status/Status';
import _ from 'lodash';
 function getEmailCurrUser(){
    var UserCurr = JSON.parse(localStorage.getItem('User'));
    return UserCurr.Email;
}
function getCurrUser(){
    var UserCurr = JSON.parse(localStorage.getItem('User'));
    return UserCurr;
}
export default class DanhSachPhieu extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            allHoSo: 0,
            allTaiLieu: 0,
            allPhieuMuon: 0,
            PhieuMuons : null
        }
        this.hosotailieuService = new hosotailieuService();
        this.tailieuService = new tailieuService();
        this.phieumuonService = new phieumuonService();
        this.detail = this.detail.bind(this);
    }
    detail(record){
        var _this = this;
        if(record){
            _this.props.history.push("/chitiet-phieumuon/" + record.IdPhieuMuon);
        }
    }
    convertTime(date) {
        var stringDate = date.getFullYear() + "-" + JSON.stringify(parseInt(date.getMonth()) + 1)+ "-" + date.getDate() + " " + date.toLocaleTimeString().substring(0, date.toLocaleTimeString().length - 2);
        return stringDate
      }
    componentDidMount(){
        var _this = this ;
        
        var promises = [this.hosotailieuService.getItems(),this.tailieuService.getItems(),this.phieumuonService.getItems()]
        Promise.all(promises).then(function(data){
            _this.setState({
                allHoSo : data[0].data.length,
                allTaiLieu:data[1].data.length,
                allPhieuMuon : data[2].data.length,
                PhieuMuons:_.forEach(data[2].data,function(pm){
                    if(parseInt(pm.ThoiGianTra.substring(5,7)) < (parseInt(new Date().getMonth()) + 1) ) {
                        pm.TrangThai ="Hết hạn";
                        pm.ThoiGianTra = _this.convertTime(new Date(data[2].data[0].ThoiGianTra));
                        pm.ThoiGianMuon = _this.convertTime(new Date(data[2].data[0].ThoiGianMuon));
                        _this.phieumuonService.saveItem(pm).then(function(){

                        })
                    }else{
                        if(parseInt(pm.ThoiGianTra.substring(5,7)) === (parseInt(new Date().getMonth()) + 1)){
                            if(parseInt(pm.ThoiGianTra.substring(8,10)) < (parseInt(new Date().getDate())) ){
                                pm.TrangThai = "Hết hạn";
                                pm.ThoiGianTra = _this.convertTime(new Date(data[2].data[0].ThoiGianTra));
                                pm.ThoiGianMuon = _this.convertTime(new Date(data[2].data[0].ThoiGianMuon));
                                _this.phieumuonService.saveItem(pm).then(function(){
                                    
                                })
                            }
                        }
                    }
                }),               
            })
        })
        
    }
    render(){
        var _this = this;
        var columnsPM = [
            {
                title : 'Trạng thái',
                dataIndex: 'TrangThai',
                key:"TrangThai",
                render:(TrangThai)=>{
                    return(
                        <div>
                            <Status status={TrangThai}/>
                            </div>
                    )
                }
            },
            {
                title : 'Tên phiếu mượn',
                dataIndex:'TenPhieuMuon',
                key:'TenPhieuMuon',
                render: (TenPhieuMuon,record)=>{
                    return(
                        <div>
                <a onClick = {_this.detail.bind(this,record)}>{TenPhieuMuon}</a>
                            </div>
                    )
                }
            },
            {
                title : 'Người mượn',
                dataIndex:'Author',
                key:'Author'

            },
            {
                title : 'Thời gian mượn',
                dataIndex:'ThoiGianMuon',
                key:'ThoiGianMuon',
            },
            {
                title : 'Thời gian trả',
                dataIndex:'ThoiGianTra',    
                key:'ThoiGianTra',
            },
        ];

        return(
    <div>
         <div style = {{paddingTop:"30px" , paddingLeft:"30px"}}>
                    <Table bordered title={() => <h3 style = {{color : "#52b3eb" ,textTransform : "uppercase"}}> Danh sách phiếu đăng ký </h3>}  columns={columnsPM} dataSource = {this.state.PhieuMuons} />
                    </div>
        </div>
)
    }
}
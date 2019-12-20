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

export default class Home extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            allHoSo: 0,
            allTaiLieu: 0,
            allHoSoDaChoMuon: 0,
            allPhieuMuon: 0,
            PhieuMuons : null
        }
        this.hosotailieuService = new hosotailieuService();
        this.tailieuService = new tailieuService();
        this.phieumuonService = new phieumuonService();
    }
    componentDidMount(){
        var _this = this ;
        var promises = [this.hosotailieuService.getItems(""),this.tailieuService.getItems(""),this.phieumuonService.getItems("")]
        Promise.all(promises).then(function(data){
            _this.setState({
                allHoSo : data[0].data.length,
                allHoSoDaChoMuon:_.filter(data[0].data,function(i){
                    return i.TinhTrangMuonTra === "Đã cho mượn";
                }).length,
                allTaiLieu:data[1].data.length,
                allPhieuMuon : data[2].data.length,
                PhieuMuons:_.filter(data[2].data,function(pm){
                    return pm.Author === getEmailCurrUser();
                })
            })
        })
        
    }
    render(){
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

            },
            // {
            //     title : 'Người mượn',
            //     dataIndex:'Author',
            //     key:'Author'

            // },
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
            <div style={{backgroundColor:"#f0f3f8", height:"1000px"}}>
                    <Row>
                <div>
                <Row style = {{paddingTop:"30px" , paddingLeft:"30px"}}>
                <Col span = {8}>
                    <div style={{backgroundColor:"white", height:"200px" , width:"430px" , borderWidth:"1px" , borderRadius:"8px"}}>                 
                    <h3 style= {{textAlign:"center", paddingTop:"30px", color:"#52b3eb" , textTransform:"uppercase"}}> Tổng số hồ sơ  </h3>
                    <Col span = {8} style ={{marginTop:"20px" , marginLeft:"20px"}}>
                    <div  style ={{ height:"50px" , width:"50px", backgroundColor:"#52b3eb" }}>
                    <FaChartBar style={{paddingLeft:"7px",paddingTop:"5px"}} color="white" size="40px" />
                    </div>
                    </Col>
                    <Col span = {8} style ={{marginTop:"20px" , marginLeft:"20px"}}>
                    <h2>{this.state.allHoSo}</h2>
                    </Col>
                    </div>
                </Col>
                <Col span = {8}> 
                <div style={{backgroundColor:"white", height:"200px" , width:"350px" , borderWidth:"1px" , borderRadius:"8px"}}>
                <div style={{backgroundColor:"white", height:"200px" , width:"430px" , borderWidth:"1px" , borderRadius:"8px"}}>                 
                    <h3 style= {{textAlign:"center", paddingTop:"30px", color:"rgb(235, 202, 82)" , textTransform:"uppercase"}}> Tổng số tài liệu  </h3>
                    <Col span = {8} style ={{marginTop:"20px" , marginLeft:"20px"}}>
                    <div  style ={{ height:"50px" , width:"50px", backgroundColor:"rgb(235, 202, 82)" }}>
                    <FaStaylinked style={{paddingLeft:"7px",paddingTop:"5px"}} color="white" size="40px" />
                    </div>
                    </Col>
                    <Col span = {8} style ={{marginTop:"20px" , marginLeft:"20px"}}>
                    <h2>{this.state.allTaiLieu}</h2>
                    </Col>
                    </div>
                     </div>
                </Col>
                <Col span = {8}> 
                <div style={{backgroundColor:"white", height:"200px" , width:"350px" , borderWidth:"1px" , borderRadius:"8px"}}>
                <div style={{backgroundColor:"white", height:"200px" , width:"430px" , borderWidth:"1px" , borderRadius:"8px"}}>                 
                    <h3 style= {{textAlign:"center", paddingTop:"30px", color:"rgb(61, 198, 96)" , textTransform:"uppercase"}}> Hồ sơ đang cho mượn </h3>
                    <Col span = {8} style ={{marginTop:"20px" , marginLeft:"20px"}}>
                    <div  style ={{ height:"50px" , width:"50px", backgroundColor:"rgb(61, 198, 96)" }}>
                    <FaHockeyPuck style={{paddingLeft:"7px",paddingTop:"5px"}} color="white" size="40px" />
                    </div>
                    </Col>
                    <Col span = {8} style ={{marginTop:"20px" , marginLeft:"20px"}}>
                    <h2>{this.state.allHoSoDaChoMuon}</h2>
                    </Col>
                    </div>
                     </div>
                </Col>
                </Row>
                </div>
                <div>
                <Row  style = {{paddingTop:"30px" , paddingLeft:"30px"}}>
                <Col span = {8}>
                <div style={{backgroundColor:"white", height:"200px" , width:"350px" , borderWidth:"1px" , borderRadius:"8px"}}>
                <div style={{backgroundColor:"white", height:"200px" , width:"350px" , borderWidth:"1px" , borderRadius:"8px"}}>
                <div style={{backgroundColor:"white", height:"200px" , width:"430px" , borderWidth:"1px" , borderRadius:"8px"}}>                 
                    <h3 style= {{textAlign:"center", paddingTop:"30px", color:"rgb(248, 100, 44)" , textTransform:"uppercase"}}>  Thống kê phiếu mượn  </h3>
                    <Col span = {8} style ={{marginTop:"20px" , marginLeft:"20px"}}>
                    <div  style ={{ height:"50px" , width:"50px", backgroundColor:"rgb(248, 100, 44)" }}>
                    <FaHockeyPuck style={{paddingLeft:"7px",paddingTop:"5px"}} color="white" size="40px" />
                    </div>
                    </Col>
                    <Col span = {8} style ={{marginTop:"20px" , marginLeft:"20px"}}>
                    <h2>{this.state.allPhieuMuon}</h2>
                    </Col>
                    </div>
                     </div>
                     </div>    
                 </Col>
                <Col span = {8}>
                <div style={{backgroundColor:"white", height:"200px" , width:"430px" , borderWidth:"1px" , borderRadius:"8px"}}>
                     </div>
                </Col>
                <Col span = {8}>
                <div style={{backgroundColor:"white", height:"200px" , width:"430px" , borderWidth:"1px" , borderRadius:"8px"}}>
                     </div>
                </Col>
                </Row>
                </div>
                </Row>
                <div style = {{paddingTop:"30px" , paddingLeft:"30px"}}>
                    <Table bordered title={() => <h3 style = {{color : "#52b3eb" ,textTransform : "uppercase"}}> Phiếu đăng ký của tôi </h3>}  columns={columnsPM} dataSource = {this.state.PhieuMuons} />
                    </div>
            </div>
        )
    }
}
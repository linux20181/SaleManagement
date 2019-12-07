import React from 'react';
import {Card,Row,Col,Avatar,Icon,Pagination} from 'antd';
import nguoidungService from '../../Service/nguoidung.service';
import 'react-tree-graph/dist/style.css';
import _ from 'lodash';
import { FaInstagram } from "react-icons/fa";
import { FaFacebookF } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { IoIosEye } from "react-icons/io";

const {Meta} = Card;
export default class TreeHuman extends React.Component {
    constructor(props){
        super(props);
        this.state ={
            dataNguoiDung :[],
            current:1
        }
        this.nguoidungService = new nguoidungService();
        this.viewDetail = this.viewDetail.bind(this);
    }
    componentDidMount(){
        var _this = this;
        var query = "ORDER BY Cap LIMIT 8 OFFSET " + (this.state.current - 1)*8;
        _this.nguoidungService.getItems(query).then(function(data){
             _this.setState({
                 dataNguoiDung:data.data,
             })
        })
    } 
    nextPage= page =>{
        console.log(page);
        this.setState({
            current : page,
        })
        this.componentDidMount();
    }
    componentDidUpdate(){
        var _this = this;
        var query = "ORDER BY Cap LIMIT 8 OFFSET " + (this.state.current - 1)*8;
        _this.nguoidungService.getItems(query).then(function(data){
             _this.setState({
                 dataNguoiDung:data.data,
             })
        })
    }
    viewDetail(id){
        if(id){
            this.props.history.push("/nhansu/chitiet/" + id);
        }else{
            this.props.history.push("/nhansu/sodonhansu");
        }
    }
    render() {  
        var _this = this
        var allCard = _.map(this.state.dataNguoiDung,function(data){
            return(
                <div>
                <Col span={5} style={{margin: "10px 5px 10px 25px" }}>     
                <Card  bordered={true}
                style={{fontFamily:"Times New Roman"}}
                 cover={<img alt="example" style={{width:"150px",marginLeft:"65px",marginTop:"10px", border:"solid",borderWidth:"1px",borderColor:"#eeeeee",borderRadius:"50%"}} src="https://galileo-camps.com/wp-content/themes/galileo-learning/library/img/default-person.png" />}
                 actions={[
                    <Icon type="setting" key="setting" />,
                    <IoIosEye size="25px"  onClick={_this.viewDetail.bind(this,data.ID)}/>,
                    <Icon type="ellipsis" key="ellipsis" />,
                  ]}
               >
                    <Meta avatar={<Avatar />} title={data.HoTen} description={data.ViTri} />
            <p style={{marginLeft:"47px",marginTop:"10px",marginBottom:"10px"}}>{data.PhongBan}</p>
                <div style={{marginLeft:"47px",marginTop:"10px",marginBottom:"10px"}}>
                <span > <FaInstagram size="20px" /> </span>
                <span > <FaFacebookF size="20px" /> </span>
                <span > <FaTwitter size="20px" /> </span>
                </div>
                </Card>
                </Col>                 
                </div>
            )
        })
        return (
            <div>
                <Row>
                {allCard}
                </Row>
            <div style={{float:"right",marginRight: "115px"}}>
            <Pagination current={this.state.current} onChange={this.nextPage}  defaultCurrent={1} total={50} />
            </div>  
            </div>             
        )
    }
}
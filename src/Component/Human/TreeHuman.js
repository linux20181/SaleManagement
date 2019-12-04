import React from 'react';
import {Card,Row,Col} from 'antd';
import nguoidungService from '../../Service/nguoidung.service';
import 'react-tree-graph/dist/style.css';
import _ from 'lodash';
const {Meta} = Card;
export default class TreeHuman extends React.Component {
    constructor(props){
        super(props);
        this.state ={
            dataNguoiDung :[],
        }
        this.nguoidungService = new nguoidungService();
    }
    componentDidMount(){
        var _this = this;
        _this.nguoidungService.getItems().then(function(data){
             _this.setState({
                 dataNguoiDung:data.data,
             })
        })
    }

    render() {
        var allCard = _.map(this.state.dataNguoiDung,function(data){
            return(
                <div>
                <Col span={5} style={{margin: "10px 5px 10px 25px" }}>     
                <Card  bordered={true}
                 cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />}
                >
                    <Meta title={data.HoTen} description={data.ViTri} />
                </Card>
                </Col>      
                </div>
            )
        })
        return (
            <div>
                {allCard}
            </div>
        )
    }
}
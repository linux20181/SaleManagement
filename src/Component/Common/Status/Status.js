import React from 'react';
import * as CONSTANT from '../../../Constant/constant';
import '../../../Asset/Css/status.css';
import {Tag} from 'antd';

function  getClass(status){
    if(status === CONSTANT.TRANGTHAI.CHOXULY){
        return 'gold';
    }
    if(status === CONSTANT.TRANGTHAI.HETHAN){
        return 'red';
    }
    if(status === CONSTANT.TRANGTHAI.DAPHEDUYET){
        return 'green';
    }
    if(status === CONSTANT.TRANGTHAI.DAHUY){
        return 'orange';
    }
}
export default class Status extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return(
            <div>
            <Tag style={{width:"90px"}} color={getClass(this.props.status)}>{this.props.status}</Tag>
            </div>
        )
    }
}
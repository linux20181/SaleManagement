import React from 'react';
import { Layout, Menu, Avatar  } from 'antd';
import 'antd/dist/antd.css';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import logo from '../../../Asset/Image/logoReactJs.png';
import qlhs from '../../HoSo/qlhs';
const { Header } = Layout;
export default class Headers extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return (
            <div>
                <Router>
                <Header className="header">
                    <div className="logo" />
                    
                    <Menu
                        theme="dark"
                        mode="horizontal"
                        defaultSelectedKeys={['2']}
                        style={{ lineHeight: '64px' }}
                    >
                        <Menu.Item key="4"> <Avatar size="large" src={logo} /></Menu.Item>
                        <Menu.Item key="1">
                            
                            Trang chủ
                           
                            </Menu.Item>
                        <Menu.Item key="2">Phòng ban</Menu.Item>
                        <Menu.Item key="3">
                        <Link to="/qlhs" component={qlhs}>
                            Quản lý hồ sơ
                        </Link>    
                            </Menu.Item>
                    </Menu>
                </Header>
                </Router>
            </div>
        )
    }
} 
import React from 'react';
import 'antd/dist/antd.css';
import { Layout} from 'antd';
const { Footer } = Layout;
export default class Footers extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return (
            <div>
                <Footer style={{ textAlign: 'center' }}>Company Management</Footer>
            </div>
        )
    }
} 
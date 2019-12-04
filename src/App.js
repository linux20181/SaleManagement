import React from 'react';
import 'antd/dist/antd.css';
import { Layout} from 'antd';
import Contents from './Component/Common/Content/content';
import Footers from './Component/Common/Footer/footer';
import 'react-block-ui/style.css';
import BlockUi from 'react-block-ui';
import { BrowserRouter as Router, Route, Link, Redirect } from "react-router-dom";
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      blocking: true,
     };
  }

componentDidMount(){
  var _this = this;
  setTimeout(function(){
   _this.setState({
     blocking : !_this.state.blocking
   })
  },2000)
}
   
  render() {
    return (
        <BlockUi tag="div" blocking={this.state.blocking}>
      <div >
        <div >
        <Layout>
          <div style={{background : "rgb(240, 242, 245)"}}>
        <Contents  />
        </div>
        <Footers/>
        </Layout>
        </div>
      </div>
        </BlockUi>
    );
  }
}
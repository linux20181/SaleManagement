import React from 'react';
import {Collapse} from 'antd';
const { Panel } = Collapse;
 export default class ToDoList extends React.Component {
    constructor(props){
        super(props);
        this.state = {
        }
    }
    render(){
        return(
            <div>
                <Collapse>
                <Panel header="ToDoList" key="1">
                <p>To Do List</p>
                </Panel>
                </Collapse>
            </div>
        )
    }
}
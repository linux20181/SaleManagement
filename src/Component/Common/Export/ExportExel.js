import React from 'react';
import ReactExport from "react-export-excel";
import { Button} from 'antd';
import _ from 'lodash';
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;
export default class ExportExel extends React.Component{
    constructor(props){
        super(props);
    }
    componentDidMount(){
       console.log(this.props.dataSet);
    }
    render(){
        var propertyHai = this.props.dataSet.map((data)=>{         
            return Object.keys(data);
             })
        var dataSource = propertyHai[0];
        var exelColumn = _.map(dataSource,function(i){
            return <ExcelColumn value={i} />
        });
        return(
            <div>
                 <ExcelFile element={<Button>Export Exel</Button>} filename = {this.props.filename}>
                    <ExcelSheet data={this.props.dataSet} name="Export">
                    {exelColumn}
                    </ExcelSheet>
                </ExcelFile>
                </div>
        )
    }
} 
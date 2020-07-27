import React, { useRef } from 'react'
import * as rb from 'react-bootstrap'
import {ReactComponent as Logo} from '../Imgs/upload.svg'
import Papa from 'papaparse'

class TopNavBar extends React.Component{

    constructor(){
        super();

        this.uploadFile = this.uploadFile.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.state = {
            dropDownValue: "None",
            dataList: ["None"],
            suspectCases: []
        }
    }

    handleClick(e) {
        this.refs.fileUploader.click();
    }

    uploadFile(event) {
        let file = event.target.files[0];

        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                // Use reader.result
                const lols = Papa.parse(reader.result, {header: true})
                
                console.log(lols.data)

                this.setState({dataList: ["None", ...lols.data.map(names => names.first_name + " " + names.last_name)]})

                const data = lols.data
                this.setState({suspectCases: data})
            }
            reader.readAsText(file)
        }
    }

    dropdownClicked(text) {
        this.setState({dropDownValue: text})
    }

    render() {
        
        let suspected = this.state.dataList.map(sus => <rb.NavDropdown.Item eventKey={sus}>{sus}</rb.NavDropdown.Item>)

        let displaySetting

        if(this.state.dataList.length === 1){
            displaySetting = "block"
        }
        else{
            displaySetting = "none"
        }
        
        return (
            <div>
                <rb.Navbar bg="white">
                    <rb.Navbar.Brand style={{fontSize:30}}>
                        Filter:
                    </rb.Navbar.Brand>
                    <rb.Navbar.Toggle />
                    <rb.Nav onSelect={(eventKey) => this.dropdownClicked(eventKey)}>
                        <rb.NavDropdown title={this.state.dropDownValue}>
                            {suspected}
                        </rb.NavDropdown>
                    </rb.Nav>
                    <rb.Navbar.Collapse className="justify-content-end">
                        <rb.Button className="text-right" id="importCases" style={{textSize:15}} onClick={this.handleClick.bind(this)}>
                            <Logo style={{width:30, height:30, paddingRight:7.4}} id="uploadLogo"/>
                            IMPORT SUSPECTED CASES
                        </rb.Button>
                        <input type="file" id="file" ref="fileUploader"/>
                        {/* style={{display: "none"}} onChange={this.uploadFile} */}
                    </rb.Navbar.Collapse>
                </rb.Navbar>

                <div>
                    {/* {this.state.suspectCases} */}
                </div>

                <div style={{verticalAlign:"middle", display:displaySetting}}>
                    <h1 style={{color:"#424761", textAlign:"center"}}>Import some data to begin</h1>
                </div>
            </div>
        )
    }

}

export default TopNavBar
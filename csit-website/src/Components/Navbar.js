import React, { useRef } from 'react'
import * as rb from 'react-bootstrap'
import {ReactComponent as Logo} from '../Imgs/upload.svg'
import Papa from 'papaparse'
import axios from 'axios'
import Graph from './Graphs';
// import Modal from './Modal'


class TopNavBar extends React.Component{

    constructor(props){
        super(props);

        this.uploadFile = this.uploadFile.bind(this);
        this.uploadFile2 = this.uploadFile2.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleClick2 = this.handleClick2.bind(this);
        this.state = {
            dropDownValue: "None",
            dataList: ["None"],
            suspectCases: [],
            movements: [],
            error: false,
            errorMsg: "",
            showModal: false,
            filenames: [],
            series:{},
            options: {
                chart: {height: 450, type: 'rangeBar'},
                plotOptions: {
                  bar: {horizontal: true, barHeight: '80%'}
                },
                xaxis: {
                  type: 'datetime'
                },
                stroke: {
                  width: 1
                },
                fill: {
                  type: 'solid',
                  opacity: 0.6
                },
                legend: {
                  position: 'top',
                  horizontalAlign: 'left'
                }
            }
        }
    }

    importCompleted(){
        const list = this.state
        this.props.handleData(list)
        return
    }

    handleClick(e) {
        this.refs.fileUploader.click();
    }

    handleClick2(e) {
        this.refs.fileUploader2.click();
    }

    uploadFile(event) {
        
        const file = event.target.files[0]

        if(file){
            if (file.name.includes("_suspected")){

                this.setState({filenames:[...this.state.filenames, file.name]})
                const reader = new FileReader();
                reader.onload = () => {
                    // Use reader.result
                    const lols = Papa.parse(reader.result, {header: true, skipEmptyLines: true}, )
                    
                    console.log(lols.data)
    
                    // Posting csv data into db
                    // this.postData('"' + JSON.stringify(lols.data) + '"')
                    // this.postSuspects(JSON.stringify(lols.data))
    
                    // Adds names into dropdown
                    this.setState({dataList: ["None", ...lols.data.map(names => names.firstName + " " + names.lastName)]})
    
                    const data = lols.data
                    this.setState({suspectCases: data})
                }
                reader.readAsText(file)
            }
            else{
                this.setState({error:true, errorMsg:"You have uploaded invalid files! Please rename the file to <filename>_suspected (For suspected cases)"})
                return
            }
        }
    }

    uploadFile2(event) {
        
        const file = event.target.files[0]

        if(file){
            if (file.name.includes("_movements")){
                
                this.setState({filenames:[...this.state.filenames, file.name]})
                const reader = new FileReader();
                reader.onload = () => {
                    // Use reader.result
                    const lols = Papa.parse(reader.result, {header: true, skipEmptyLines: true}, )
                    
                    console.log(lols.data)
    
                    // Posting csv data into db
                    // this.postData('"' + JSON.stringify(lols.data) + '"')
                    // this.postMovements(JSON.stringify(lols.data))
                    const data = lols.data
                    this.setState({movements: data})
                }
                reader.readAsText(file)
            }
            else{
                this.setState({error:true, errorMsg:"You have uploaded invalid files! Please rename the file to <filename>_movement (For suspected case movement)"})
                return
            }
        }
    }

    dropdownClicked(text) {
        this.setState({dropDownValue: text})
    }

    convertDate(date) {

        var lol = date
        var dateTimeParts = lol.split(' ')
        console.log(dateTimeParts)
        var dateParts = dateTimeParts[0].split('/')
        var timeParts = dateTimeParts[1].split(':')
        var timeOfDay = dateTimeParts[2]
        if(timeOfDay === "pm"){
            timeParts[0] += 12
        }

        // new Date(year, month, day, hours, minutes, seconds, milliseconds)
        var finalDate = new Date(dateParts[2], dateParts[1], dateParts[0], timeParts[0], timeParts[1]);
        console.log(finalDate)
        return finalDate.getTime();
    }

    populateGraph1(){
        let series2 = []
        this.state.suspectCases.forEach(suspect => {
            let data = []

            this.state.movements.forEach(movement => {
                if(movement.suspectId === suspect.id){
                    data.push(
                        {
                            x: movement.locationShortaddress,
                            y: [this.convertDate(movement.datetimeEntered),this.convertDate(movement.datetimeLeft)]
                        }
                    )
                }
            })

            series2.push(
                {
                    name: suspect.firstName + " " + suspect.lastName,
                    data: data
                }
            )
        })
        this.setState({series2})
    }

    

    render() {

        let suspected = this.state.dataList.map(sus => <rb.NavDropdown.Item eventKey={sus}>{sus}</rb.NavDropdown.Item>)
        
        let displaySetting, displaySetting2

        if(this.state.suspectCases.length > 0 && this.state.movements.length > 0 ){
            displaySetting = "none"
            displaySetting2 = "block"
            this.populateGraph1()
        }
        else{
            displaySetting = "block"
            displaySetting2 = "none"
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

                        <rb.Button className="text-right" id="importCases" style={{textSize:15}} onClick={() => this.setState({showModal: true})}>
                            <Logo style={{width:30, height:30, paddingRight:7.4}} id="uploadLogo"/>
                            IMPORT SUSPECTED CASES
                        </rb.Button>

                        {/* <rb.Button className="text-right" id="importCases" style={{textSize:15}} onClick={this.handleClick.bind(this)}>
                            <Logo style={{width:30, height:30, paddingRight:7.4}} id="uploadLogo"/>
                            IMPORT SUSPECTED CASES
                        </rb.Button>
                        <input type="file" id="file" ref="fileUploader" style={{display: "none"}} onChange={this.uploadFile} multiple/> */}
                    </rb.Navbar.Collapse>
                </rb.Navbar>

                <div>
                    <rb.Modal show={this.state.showModal} onHide={() => this.setState({showModal: false}) } animation={false}>
                        <rb.Modal.Header closeButton>
                            <rb.Modal.Title>Upload Suspect Cases Files</rb.Modal.Title>
                        </rb.Modal.Header>

                        <rb.Modal.Body className="d-flex justify-content-center">

                            <div className="row" >
                                <div className=".col-md-6" style={{paddingRight: 15}}>
                                    <b>Profile of suspected case</b>
                                    <br/>
                                    <br/>
                                    <rb.Button variant="secondary" style={{width:"100%"}} onClick={this.handleClick.bind(this)}>
                                        Upload
                                    </rb.Button>
                                    <input type="file" id="file" ref="fileUploader" style={{display: "none"}} onChange={this.uploadFile}/>
                                    <p>File Chosen: </p>
                                </div>

                                <div style ={{borderLeft: "2px dashed black", height: "100px"}}></div>

                                <div className=".col-md-6" variant="primary" style={{paddingLeft: 15}}>
                                    <b>Movement of suspected case</b>
                                    <br/>
                                    <br/>
                                    <rb.Button variant="secondary" style={{width:"100%"}} onClick={this.handleClick2.bind(this)}>
                                        Upload
                                    </rb.Button>
                                    <input type="file" id="file2" ref="fileUploader2" style={{display: "none"}} onChange={this.uploadFile2}/>
                                </div>
                            </div>
                        </rb.Modal.Body>
                    </rb.Modal>
                </div>

                <div>
                    <rb.Toast onClose={() => this.setState({error: false})} show={this.state.error}>
                        <rb.Toast.Header>
                            <strong className="mr-auto">Error!</strong>
                            {/* <small>11 mins ago</small> */}
                        </rb.Toast.Header>
                        <rb.Toast.Body>{this.state.errorMsg}</rb.Toast.Body>
                    </rb.Toast>
                </div>
                
                <div>
                    {/* {this.state.suspectCases} */}
                </div>

                <div style={{display:displaySetting, height:"100%"}}>
                    <h1 style={{color:"#424761", textAlign:"center", marginTop:"15%"}}>Import some data to begin</h1>
                </div>

                {/* <Graph display={displaySetting2} options={this.state.options} series={this.state.series}/> */}
            </div>
        )
    }

}

export default TopNavBar
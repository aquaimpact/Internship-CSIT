import React, { useRef } from 'react'
import * as rb from 'react-bootstrap'
import {ReactComponent as Logo} from '../Imgs/upload.svg'
import Papa from 'papaparse'
import axios from 'axios'
import Graph from './Graphs'
import Table from './Table'
import Table2 from './Table2'
import ProfileModal from './ProfileModal'
// import Chip from '@material-ui/core/Chip';


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
            datas:[],
            placename:"",
            datetime:[],
            showSelection: false,
            CCID:[],
            CloseContacts:{},
            fromCCID:[],
            profileModal:{},
            showSelection2: false,
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
        // console.log(dateTimeParts)
        var dateParts = dateTimeParts[0].split('/')
        var timeParts = dateTimeParts[1].split(':')
        var timeOfDay = dateTimeParts[2]
        if(timeOfDay === "pm"){
            timeParts[0] += 12
        }

        // new Date(year, month, day, hours, minutes, seconds, milliseconds)
        var finalDate = new Date(dateParts[2], dateParts[1] - 1, dateParts[0], timeParts[0], timeParts[1]);
        // console.log(finalDate)
        return finalDate.getTime();
    }

    populateGraph1(){
        let series2 = []
        this.state.suspectCases.forEach(suspect => {
            let data = []

            this.state.movements.filter(moves => moves.suspectId === suspect.id).forEach(movement => {
                data.push(
                    {
                        x: movement.locationShortaddress,
                        y: [this.convertDate(movement.datetimeEntered),this.convertDate(movement.datetimeLeft)]
                    }
                )
            })

            series2.push(
                {
                    name: suspect.firstName + " " + suspect.lastName,
                    data: data
                }
            )
        })
        return series2
    }

    convertSQLDate(startDate1, endDate, type = undefined){
        
        if(startDate1 !== undefined && endDate !== undefined){
            var date = new Date(startDate1)
            var date2 = date.toString().split(" ")
            var time = date2[4].split(":")
    
            var date1 = new Date(endDate)
            var date21 = date1.toString().split(" ")
            var time1 = date21[4].split(":")
            
            let str
            if(type === "header"){
                str = time[0] + ":"+ time[1] + " - " + time1[0] + ":" + time1[1]
            }
            else{
                str = date2[2] + " " + date2[1] + ", " + time[0] + ":"+ time[1] + " - " + time1[0] + ":" + time1[1]
            }
           
            return str
        }
        // return date2[1]
    }

    // Still kkeeps adding values to the list
    myCallback = (dataFromChild) => {
        // console.log("Data1:" + dataFromChild)
        this.setState({CCID:dataFromChild})
    }

    myCallback2 = (dataFromChild) => {
        // console.log("Data2:" + dataFromChild)
        this.setState({fromCCID:dataFromChild})
    }

    databackTable = (dataFromChild) => {

        this.setState({profileModal:dataFromChild})
        this.setState({showSelection2:true})
    }

    isEmptyObject(obj) {
        return !!obj && Object.keys(obj).length === 0 && obj.constructor === Object;
    }

    toCCClicked = () => {
        let IDs = []

        if(this.state.datas.length > 0){
            let placename = this.state.datas[0].locationShortaddress
            // console.log(this.state.CCID)
            this.state.datas.map(x => {
                for(var data of this.state.CCID){
    
                    // console.log(data)
                    if(x.peopleProfileId == data){
                        IDs.push(x.peopleProfileId)
                    }
                }
                
            })

            console.log("TO: " + IDs)
            
            let newItem = {...this.state.CloseContacts, [placename]:IDs}

            this.setState({CloseContacts:newItem}) 
        }
    }

    compare(arr1,arr2){
  
        if(!arr1  || !arr2) return
       
        let result;
       
        arr1.forEach((e1,i)=>arr2.forEach(e2=>{
         
            if(e1.length > 1 && e2.length){
                result = this.compare(e1,e2);
            }else if(e1 !== e2 ){
                result = false
            }else{
                result = true
            }
        }))
       return result
    }

    fromCCClicked = () => {

        if(this.state.datas.length > 0){
            let placename = this.state.datas[0].locationShortaddress
            let IDs = this.state.CloseContacts[placename].filter(x => this.state.fromCCID.includes(x) === false).map(x => {return x})
            
            console.log("From: " + IDs)

            let newItem = {...this.state.CloseContacts, [placename]:IDs}

            console.log("Items:" + newItem)

            this.setState({CloseContacts:newItem}) 
        }

    }

    render() {

        let suspected = this.state.dataList.map(sus => <rb.NavDropdown.Item eventKey={Math.random()}>{sus}</rb.NavDropdown.Item>)
        
        let displaySetting, displaySetting2, seriesdata
        let test

        if(this.state.suspectCases.length > 0 && this.state.movements.length > 0 ){
            displaySetting = "none"
            displaySetting2 = "block"
            
            test = this.populateGraph1()
        }
        else{
            displaySetting = "block"
            displaySetting2 = "none"
        }
        
        let graph1, graph11

        const that = this;

        let placename;

        if(test !== undefined){
            var options = {
                options: {
                    chart: {
                        height: 450, 
                        type: 'rangeBar',
                        events:{
                            dataPointSelection: function(event, chartContext, config) {
                                // Name of place
                                // console.log(test[config.seriesIndex].data[config.dataPointIndex].x)

                                that.setState({placename:test[config.seriesIndex].data[config.dataPointIndex].x, datetime:test[config.seriesIndex].data[config.dataPointIndex].y})

                                // For the time
                                // console.log(test[config.seriesIndex].data[config.dataPointIndex].y)
                                // For the Name
                                // console.log(test[config.seriesIndex].name)

                                placename = test[config.seriesIndex].data[config.dataPointIndex].x

                                fetch("http://localhost:8080/getMovementForDate?placeName="+ test[config.seriesIndex].data[config.dataPointIndex].x +"&dates=" + test[config.seriesIndex].data[config.dataPointIndex].y + "&personName=" + test[config.seriesIndex].name)
                                .then(response => response.json()).then(data => that.setState({datas:data})).catch(err => {console.log(err);});
                            }
                        }
                    },
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
            graph1 = <Graph display={displaySetting2} options={options.options} series={test} tool/>
        }

        let mappingsCC = this.state.datas.filter(data => data.caseNumber != null).map(data => {
            return({
                caseNumber:data.caseNumber,
                UID:data.peopleProfileId,
                name:data.firstName + " " + data.lastName,
                place:data.locationShortaddress,
                datetime:this.convertSQLDate(data.datetimeEntered, data.datetimeLeft)
            })
        })

        let mappingsPATP
        
        // Checks if there are any close contacts be begin with. If there are none than the below will run
        if(this.isEmptyObject(this.state.CloseContacts)){
            mappingsPATP = this.state.datas.filter(data => data.caseNumber == null).map(data =>{
                return({
                    UID:data.peopleProfileId,
                    name:data.firstName + " " + data.lastName,
                    place:data.locationShortaddress,
                    datetime:this.convertSQLDate(data.datetimeEntered, data.datetimeLeft)
                })
            })
        }

        // If you added the close contacts, no need to be for the current place (any place), then the below will run
        else{
            
            let newlist = []

            this.state.datas.filter(data => data.caseNumber == null).map(data =>{

                // Checks if the place that the user has clicked on contains any close contacts assigned to it. If there are, then it will take away all the people that are in the close 
                // contact list from the PATP
                if(this.state.CloseContacts[data.locationShortaddress] != undefined){
                    // console.log("Logged: " + this.state.CloseContacts[placename] + ": " + Array.isArray(this.state.CloseContacts[placename]))
                    if(this.state.CloseContacts[data.locationShortaddress].includes(data.peopleProfileId) === false){
                        newlist.push({
                            UID:data.peopleProfileId,
                            name:data.firstName + " " + data.lastName,
                            place:data.locationShortaddress,
                            datetime:this.convertSQLDate(data.datetimeEntered, data.datetimeLeft)
                        })
                    }
                }

                // If there isnt any close contacts then it will just return all the people from the PTAP back to PTAP
                else{
                    newlist.push({
                        UID:data.peopleProfileId,
                        name:data.firstName + " " + data.lastName,
                        place:data.locationShortaddress,
                        datetime:this.convertSQLDate(data.datetimeEntered, data.datetimeLeft)
                    })
                }       
            })

            mappingsPATP = newlist
        }

        let newlist2 = []

        this.state.datas.filter(data => data.caseNumber == null).map(data =>{
            
            if(this.state.CloseContacts[data.locationShortaddress] != undefined){
                if(this.state.CloseContacts[data.locationShortaddress].includes(data.peopleProfileId)){
                    newlist2.push({
                        UID:data.peopleProfileId,
                        name:data.firstName + " " + data.lastName,
                        place:data.locationShortaddress,
                        datetime:this.convertSQLDate(data.datetimeEntered, data.datetimeLeft)
                    })
                }
            }  
        })

        let mappingsclose = newlist2

        return (
            <div>
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
                </div>
                
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
                <div style={{display:displaySetting2}}>
                    <div style={{textAlign: "left", height:"100%", float:"left", width:"50%"}}>
                        {graph1}
                    </div>
                    <div style={{float:"left", width:"50%"}}>
                        <rb.Tabs defaultActiveKey="home" id="uncontrolled-tab-example">
                            <rb.Tab eventKey="home" title="CONFIRMED CASES">
                                <div style={{textAlign: "left", height:"100%"}}>
                                    {/* <Chip label="Basic" /> */}
                                    {/* PlaceName */}
                                    {this.state.placename}
                                    {/* Time Span */}
                                    {this.convertSQLDate(this.state.datetime[0], this.state.datetime[1], "header")}
                                    <Table tableprops={mappingsCC} display={displaySetting2} type = "CC" databack={this.databackTable}/>
                                </div>
                            </rb.Tab>

                            <rb.Tab eventKey="profile" title="CLOSE CONTACT">
                            <div style={{textAlign: "left", height:"100%"}}>
                                    {/* PlaceName */}
                                    {this.state.placename}
                                    {/* Time Span */}
                                    {this.convertSQLDate(this.state.datetime[0], this.state.datetime[1], "header")}
                                    <Table tableprops={mappingsclose} display={displaySetting2} type="PATP" databack={this.databackTable}/>
                                    <br/>
                                    <rb.Button onClick={() => this.setState({showSelection:true})}>
                                        Manual Import
                                    </rb.Button>
                                </div>
                            </rb.Tab>

                            <rb.Tab eventKey="contact" title="PUBLIC AT THE PLACE">
                                <div style={{textAlign: "left", height:"100%"}}>
                                    {/* PlaceName */}
                                    {this.state.placename}
                                    {/* Time Span */}
                                    {this.convertSQLDate(this.state.datetime[0], this.state.datetime[1], "header")}
                                    <Table tableprops={mappingsPATP} display={displaySetting2} type="PATP" databack={this.databackTable}/>
                                </div>
                            </rb.Tab>
                        </rb.Tabs>         
                    </div>
                    
                    {/* PTAP TO CC AND CC TO PTAP */}
                    <div>
                        <rb.Modal show={this.state.showSelection} onHide={()=>this.setState({showSelection:false})} centered size="xl" scrollable={true}>
                            <rb.Modal.Header closeButton>
                                <rb.Modal.Title>Transfer Users</rb.Modal.Title>
                            </rb.Modal.Header>
                            <rb.Modal.Body>
                                <div style={{float:"left", textAlign:"center", width:"40%"}}>
                                    <text fontSize="20px"><b>Close Contact With Public</b></text>
                                    <div style={{backgroundColor:"#F9F9F9", }}>
                                        <Table2 tableprops={mappingsclose} display={displaySetting2} type="modal-edit" callbackFromParent={this.myCallback2}/>
                                    </div>
                                </div>
                                <div style={{float:"left", textAlign:"center", width:"20%", alignItems:"center", justifyContent:"center"}}>
                                    <rb.Button onClick={this.toCCClicked}> &lt; &lt; </rb.Button>
                                    <div className="clearfix"></div>
                                    <rb.Button onClick={this.fromCCClicked}> &gt; &gt; </rb.Button>
                                </div>
                                <div style={{float:"right", textAlign:"center", width:"40%"}}>
                                    <text fontSize="20px"><b>Public At The Place</b></text>
                                    <div style={{backgroundColor:"#F9F9F9"}}>
                                        <Table tableprops={mappingsPATP} display={displaySetting2} type="modal-edit" callbackFromParent={this.myCallback}/>
                                    </div>
                                </div>
                            </rb.Modal.Body>
                            <rb.Modal.Footer>
                                <rb.Button variant="secondary" onClick={()=>this.setState({showSelection:false})}>
                                    Close
                                </rb.Button>
                            </rb.Modal.Footer>
                        </rb.Modal>
                    </div>
                    
                    <div>
                        <rb.Modal show={this.state.showSelection2} onHide={()=>this.setState({showSelection2:false})}>
                            <rb.Modal.Header closeButton>
                                <rb.Modal.Title>Person Profile</rb.Modal.Title>
                            </rb.Modal.Header>
                            <rb.Modal.Body>
                                <text><b>Name:</b> {this.state.profileModal.firstName + " " + this.state.profileModal.lastName}</text>
                                <br/>
                                <text><b>Gender:</b> {this.state.profileModal.gender}</text>
                                <br/>
                                <text><b>Case Number:</b> {this.state.profileModal.caseNumber}</text>
                                <br/>
                                <text><b>Marital Status:</b> {this.state.profileModal.maritalStatus}</text>
                                <br/>
                                <text><b>Phone Number:</b> {this.state.profileModal.phoneNumber}</text>
                                <br/>
                                <text><b>Company:</b> {this.state.profileModal.company}</text>
                            </rb.Modal.Body>
                            <rb.Modal.Footer>
                                <rb.Button variant="secondary" onClick={()=>this.setState({showSelection2:false})}>
                                    Close
                                </rb.Button>
                            </rb.Modal.Footer>
                        </rb.Modal>
                    </div>
                </div>
            </div>
        )
    }

}

export default TopNavBar
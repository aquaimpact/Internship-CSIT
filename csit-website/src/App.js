import React from 'react';
import './App.css';
import NavBar from './Components/Navbar'
import MainPage from './Components/Views (New)/MainPage'

import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
// import './style.css'

import "G:/INTERNSHIPFILES/CodingFolder/csit-website/src/assets/vendor/nucleo/css/nucleo.css";
import "G:/INTERNSHIPFILES/CodingFolder/csit-website/src/assets/vendor/font-awesome/css/font-awesome.min.css";
import "G:/INTERNSHIPFILES/CodingFolder/csit-website/src/assets/scss/argon-design-system-react.scss?v1.1.0";


function App() {

    return(
      <div className="App">
        <MainPage/>
        {/* <Graph display={displaySetting}/> */}
      </div>
    );
}

export default App;
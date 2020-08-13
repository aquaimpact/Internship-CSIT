import React from 'react';
import './App.css';
import NavBar from './Components/Navbar'

import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import './style.css'

function App() {

    return(
      <div className="App">
        <NavBar/>
        {/* <Graph display={displaySetting}/> */}
      </div>
    );
}

export default App;
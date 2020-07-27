import React from 'react';
// import logo from './logo.svg';
// import * as mui from '@material-ui/core'
// import * as rb from 'react-bootstrap'

// import 'bootstrap/dist/css/bootstrap.min.css';
// import './App.css';
import productsData from './Componenets/schoolProducts'
import Product from './Componenets/product'

// function App(){

//   const prodData = productsData.map(
//     prod => <Product key = {prod.id} name = {prod.name} price = {prod.price} desc={prod.Description}/>
  
//   )

//   return (
//     <div>
//       {prodData}
//     </div>
//   )
// }

class App extends React.Component{

  constructor(){
    super()
    this.state = {
      answer: "Yes"
    }
  }

  render(){
    return (
      <div>
        {this.state.answer}
      </div>
    )
  }
}

export default App

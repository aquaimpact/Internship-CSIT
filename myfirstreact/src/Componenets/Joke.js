import React from 'react'

function Joke(props){
    
    let qq

    if(props.question == undefined){
        qq = null
    }
    else{
        qq = "Question: " + props.question
    }

    return(

        <div>
            <h3>{qq}</h3>
            <h3>Punch Line: {props.punchLine}</h3>
        </div>

    )
}

export default Joke
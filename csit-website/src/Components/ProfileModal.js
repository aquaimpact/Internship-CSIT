import React, {useState} from 'react'
import * as rb from 'react-bootstrap'

function ProfileModal(props){

    console.log("Shown")

    if(props.shown === "true"){

        handleShow()
    }

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    return(
        <div>
            
        </div>
    )
}

export default ProfileModal

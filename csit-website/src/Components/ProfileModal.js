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
            <rb.Modal show={show} onHide={handleClose}>
                <rb.Modal.Header closeButton>
                    <rb.Modal.Title>Modal heading</rb.Modal.Title>
                </rb.Modal.Header>
                <rb.Modal.Body>Woohoo, you're reading this text in a modal!</rb.Modal.Body>
                <rb.Modal.Footer>
                    <rb.Button variant="secondary" onClick={handleClose}>
                        Close
                    </rb.Button>
                    <rb.Button variant="primary" onClick={handleClose}>
                        Save Changes
                    </rb.Button>
                </rb.Modal.Footer>
            </rb.Modal>
        </div>
    )
}

export default ProfileModal

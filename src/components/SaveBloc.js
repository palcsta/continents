import React, { useState } from 'react'
import Button from 'react-bootstrap/Button'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'
import { MdSave, MdLibraryAdd  } from 'react-icons/md'
import { IconContext } from 'react-icons'
import '../styles/SaveBloc.css'
import { saveBlocService } from '../services/blocService'
import { useCountry } from '../context/CountryContext'

const SaveBlocForm = ({ size }) => {
    const { selected, user, updateBlocList } = useCountry();
    const [blocName, setBlocName] = useState('')
    const [showSaveBlocForm, setShowSaveBlocForm] = useState(false)
    const [blocSaveProblem, setBlocSaveProblem] = useState("")
    const [blocSaved, setBlocSaved] = useState(false)

    const handleBlocNameChange = (event) => {
        event.preventDefault()
        setBlocName(event.target.value)
    }

    const pressSave = (event) => {
        event.preventDefault()
        const blocObject = {name:blocName,countries:selected}
        const token = `bearer ${user.token}`
        saveBlocService(blocObject,token).then(response => {
            let blocSavingProblem = "error" in response
            if(blocSavingProblem){
                setBlocSaveProblem(response.error)
            } else if("info" in response){
                setBlocSaveProblem("")
                setBlocSaved(true)
                setShowSaveBlocForm(false)
                updateBlocList()
            }
        }).catch(error => {
            console.error(error)
        })
    }

    const pressCancel = () => {
        setShowSaveBlocForm(false)
        setBlocName('')
    }

    const firstPress = () => {
        setShowSaveBlocForm(true)
        setBlocSaved(false)
    }

    return (
        <>
            {
                !showSaveBlocForm||!user?<>
                    <IconContext.Provider value={{ size: "1.25em", className: "saveButtonIcon" }}>
                        <OverlayTrigger overlay={<Tooltip id="tooltip-disabled" style={{display:user?"none":"inline"}}>You must be logged in to do this.</Tooltip>}>
<span>
                            <Button disabled={!user} style={{ pointerEvents: !user?'none':'auto' }} onClick={()=>firstPress()}size={size}><MdLibraryAdd/>New Bloc</Button> 
</span>
                            </OverlayTrigger>
                    </IconContext.Provider>
                    <p style={{color:"blue",display:blocSaved?"inline":"none"}}>Bloc Saved</p></>: 
                    <form onSubmit={pressSave}>
                        <div>
                            <label style={{marginRight:"0.2em"}}>Name: </label>
                            <input type="text" id="bloc-name" placeholder="Enter bloc name" onChange={handleBlocNameChange} />
                            <p style={{color:"red",display:blocSaveProblem.length?"inline":"none"}}>{blocSaveProblem}</p>
                        </div>

                        <IconContext.Provider value={{ size: "1.25em", className: "saveButtonIcon" }}>
                            <Button variant="primary" type="submit" style={{marginRight:"0.2em"}} size={size}><MdSave/> Save</Button>
                            <Button variant="secondary" onClick={()=>{pressCancel();setBlocSaveProblem("")}} size={size}>Cancel</Button>
                        </IconContext.Provider>
                    </form>
            }
        </>
    )
}

export default SaveBlocForm

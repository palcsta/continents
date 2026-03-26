import React, { useState, useEffect } from 'react'
import { MdAccountCircle, MdVpnKey } from 'react-icons/md'
import { IconContext } from 'react-icons'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'

import '../styles/login.css'
import { loginService, registerService } from '../services/loginService'
import { getBlocsService } from '../services/blocService'
import { useCountry } from '../context/CountryContext'

const LoginForm = () => {
  const { user, setUser, updateBlocList } = useCountry();
  const [validated, setValidated] = useState(false);

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showReg, setShowReg] = useState(false)
  const [regPassConfirm, setRegPassConfirm] = useState('')
  const [usernameErrors, setUsernameErrors] = useState([])
  const [passwordErrors, setPasswordErrors] = useState([])
  const [loginProblems, setLoginProblems] = useState([])

  useEffect(() => {
    const userJSON = window.localStorage.getItem('loggedContinentsUser')
    if (userJSON) {
      const loggedInUser = JSON.parse(userJSON)
      setUser(loggedInUser)
      updateBlocList()
    }
  }, [setUser, updateBlocList])

  const login = async () => {
    setValidated(false)
    const loginObject = {"username":username,"password":password}
    try {
      const res = await loginService(loginObject)
      const objWithToken = res.find(o=>"token" in o)
      if(objWithToken){
        const newUser = {token:objWithToken.token,username:username}
        setUser(newUser)
        window.localStorage.setItem('loggedContinentsUser', JSON.stringify(newUser)) 
        updateBlocList()
      } else {
        setUser(null)
      }
      
      let weCanReg = res.find(o => "canReg" in o) && res.find(o => "canReg" in o).canReg
      setUsernameErrors(res.filter(o=>o.concerning==="username").map(o=>o.error))
      setPasswordErrors(res.filter(o=>o.concerning==="password").map(o=>o.error))
      setLoginProblems(res.filter(o=>o.concerning==="login"))
      setShowReg(weCanReg)
      setValidated(!weCanReg && !res.filter(o=>o.concerning==="login").length)
    } catch (error) {
      console.error(error)
    }
  }

  const register = async () => {
    if(regPassConfirm === password){
      const regObject= {"username":username,"password":password}
      const dataResponse = await registerService(regObject)
      let regHasProblems = dataResponse.find(o=>"error" in o)
      if(!regHasProblems){
        setShowReg(false)
      } else {
        const usernameProblems = dataResponse.filter(o=>o.concerning==="username")
        const passwordProblems = dataResponse.filter(o=>o.concerning==="password")
        setPasswordErrors(passwordProblems)
        setUsernameErrors(usernameProblems)
      }
    }
  }

  const pressLogin = (event) => {
    event.preventDefault()
    showReg ? register() : login()
  }

  const pressLogout = () => {
    window.localStorage.removeItem('loggedContinentsUser')
    setUser(null)
    setUsername('')
    setPassword('')
  }

  const handleLoginFormUserChange = (event) => {
    event.preventDefault()
    setShowReg(false)
    setUsername(event.target.value)
  }

  const loggedOutContent = (
    <IconContext.Provider value={{ size: "1.25em"}}>
      <Form noValidate onSubmit={(event)=>pressLogin(event)}>
        <Row>
          <Form.Group as={Col} md="3" controlId="validationCustomUsername">
            <InputGroup hasValidation>
              <InputGroup.Text id="inputGroupPrepend"><MdAccountCircle/></InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Username"
                onChange={handleLoginFormUserChange} 
                isValid={username.length > 0 && validated && !usernameErrors.length}
                isInvalid={usernameErrors.length > 0}
              />
              <Form.Control.Feedback type="invalid">
                {usernameErrors.join(", ")}
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
          <Form.Group as={Col} md="3" controlId="validationCustomPassword">
            <InputGroup hasValidation>
              <InputGroup.Text id="passwordInputGroupPrepend"><MdVpnKey/></InputGroup.Text>
              <Form.Control
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                isValid={password.length > 0 && validated && !passwordErrors.length}
                isInvalid={passwordErrors.length > 0}
              />
              <Form.Control.Feedback type="invalid">
                {passwordErrors.join(", ")}
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
          {showReg && (
            <Form.Group as={Col} md="3" controlId="validationCustomPasswordConfirm">
              <InputGroup hasValidation>
                <InputGroup.Text id="passwordConfirmInputGroupPrepend"><MdVpnKey/></InputGroup.Text>
                <Form.Control
                  type="password"
                  placeholder="Confirm password"
                  onChange={(e) => setRegPassConfirm(e.target.value)}
                  isValid={password === regPassConfirm}
                  isInvalid={password !== regPassConfirm}
                />
                <Form.Control.Feedback type="invalid">
                  Passwords must match.
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>
          )}

          <Form.Group as={Col} md={showReg ? "1" : "2"}>
            <Button variant={showReg ? "outline-primary" : "link"} type="submit">
              {showReg ? "Register" : "Login/ Register"}
            </Button>
            <Form.Label style={{color:"red"}}>
              {loginProblems.length ? loginProblems.map(o=>o.error).join(", ") : ""}
            </Form.Label>
          </Form.Group>
          {showReg && (
            <Form.Group as={Col} md="1">
              <Button variant="outline-secondary" onClick={()=>setShowReg(false)}>Cancel</Button>
            </Form.Group>
          )}
        </Row>
      </Form>
    </IconContext.Provider> 
  )

  const loggedInContent = (
    <div>
      <div onClick={pressLogout} style={{ cursor: 'pointer' }}>
        <span>Logged in as {user ? user.username : ""}</span>
        <span className="fauxlinkbutton" style={{ marginLeft: '10px' }}>Logout</span>
      </div>
    </div>
  )

  return (
    <>
      {user ? loggedInContent : loggedOutContent}
    </>
  )
}

export default LoginForm

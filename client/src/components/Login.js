import React, { useState } from 'react'
import { Form, FormGroup, Input, Button, FormText, Spinner }
  from 'reactstrap'

import { axiosWithAuth } from '../utils/axiosWithAuth'

const initialCredentials = {
  username: '',
  password: ''
}

const Login = props => {
  
  // make a post request to retrieve a token from the api
  // when you have handled the token, navigate to the BubblePage route
  const [credentials, setCredentials] = useState(initialCredentials)
  const [isFetching, setIsFetching] = useState(false)
  const [error, setError] = useState('')

  const handleChange = e => {
    e.preventDefault()
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = e => {
    e.preventDefault()
    setIsFetching(true)

    axiosWithAuth()
      .post('/login', credentials)
      .then(res => {        
        localStorage.setItem('token', res.data.payload)        
        props.history.push('/bubbles')
      })
      .catch(err => {
        setIsFetching(false)
        setError(err.response.data.error)
      })
  }

  return (
    <div>
      <h1>Welcome to the</h1>
      <h1> Bubbles App!</h1>
      <p>Build a login page here</p>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Input
            type='text'
            name='username'
            placeholder='username'
            onChange={handleChange}
            value={credentials.username}
          />
        </FormGroup>
        <FormGroup>
          <Input
            type='password'
            name='password'
            placeholder='password'
            onChange={handleChange}
            value={credentials.password}
          />
        </FormGroup>
        <Button>Log In</Button>
        {isFetching ? <Spinner /> :
          <FormText>{error}</FormText>}
      </Form>
    </div>
  )
}

export default Login

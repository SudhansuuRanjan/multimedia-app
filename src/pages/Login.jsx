import React from 'react'
import OAuth from '../components/OAuth'

const Login = ({setUser}) => {
  return (
    <div>
        <OAuth setUser={setUser}/>
    </div>
  )
}

export default Login
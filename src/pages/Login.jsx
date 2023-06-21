import React from 'react'
import OAuth from '../components/OAuth'

const Login = ({ setUser }) => {
  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <div style={styles.logoCont}>
          <img style={styles.logoFirebase} src="./icons/firebase.png" alt="logo" />
          <div style={styles.plus}>
            +
          </div>
          <img style={styles.logoStackup} src="./icons/stackup.svg" alt="logo" />
        </div>
        <div style={styles.appname}>
          Multimedia Application
        </div>
        <OAuth setUser={setUser} />
      </div>
    </div>
  )
}

export default Login

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
  },
  box: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    height:"10rem",
  },
  logoFirebase: {
    width: '60px',
  },
  logoStackup: {
    width: '150px',
  },
  logoCont: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '20px',
    gap: '20px',
  },
  plus: {
    fontSize: '50px',
    fontWeight: 'bold',
    color: '#ff005c'
  },
  appname: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#ff005c',
    marginBottom: '20px',
  }
}
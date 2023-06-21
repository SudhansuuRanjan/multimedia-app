import React from 'react';
import { getAuth } from 'firebase/auth'
import { useNavigate } from 'react-router-dom';


export const Header = () => {
  const auth = getAuth();
  const navigate = useNavigate();

  const onLogout = () => {
    auth.signOut();
    navigate('/');
  }

  return (
    <header style={styles.header}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <div>
          <img style={styles.photo} src={auth.currentUser.photoURL} alt="profilepic" />
        </div>
        <div>
          <h1 style={styles.headerText}>Spectre_7-S&apos;s Drive</h1>
          <p style={styles.headerSubText}>A File Manager created by Spectre_7</p>
        </div>
      </div>
      <button style={{ padding: "0.4rem 2rem", borderRadius: "0.4rem", backgroundColor: "white", border: "none", margin: "0.3rem", cursor: "pointer" }} onClick={onLogout}>Logout</button>
    </header>
  );
}

const styles = {
  header: {
    backgroundColor: '#333',
    color: '#fff',
    textAlign: 'center',
    padding: '10px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  headerText: {
    fontSize: '30px'
  },
  headerSubText: {
    fontSize: '15px'
  },
  photo: {
    width: '4rem',
    height: '4rem',
    borderRadius: '50%'
  }
}
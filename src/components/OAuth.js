import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import { db } from '../firebase.config'
import { setDoc, doc, serverTimestamp, getDoc } from 'firebase/firestore'
import shortid from 'shortid'


const OAuth = () => {
    const navigate = useNavigate()
    const handleOAuth = async () => {
        try {
            const auth = getAuth()
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider)
            const user = result.user

            // Check if user exists in firestore
            const userRef = doc(db, 'users', user.uid)
            const userDoc = await getDoc(userRef)

            // If user does not exist in firestore, create a new document
            if (!userDoc.exists()) {
                await setDoc(userRef, {
                    name: user.displayName,
                    email: user.email,
                    timestamp: serverTimestamp(),
                    id: shortid.generate().toUpperCase(),
                    photoURL: user.photoURL
                })
            }
            navigate('/');
        } catch (error) {
            // toast.error('Bad User Credentials')
            console.log(error);
        }
    }

    return (
        <div style={styles.container}>
            <button style={styles.button} onClick={handleOAuth} >
                <img style={styles.img} src="https://cdn.cdnlogo.com/logos/g/35/google-icon.svg" alt="google" className='h-6 w-6' /> <p className='text-sm font-medium'>Sign{'In'} with Google</p>
            </button>
        </div>
    )
}


export default OAuth

const styles = {
    button: {
        backgroundColor: '#fff',
        border: '1px solid #ddd',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '1rem',
        fontWeight: '500',
        padding: '0.5rem 1rem',
        margin: '10px 0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    img: {
        height: '20px',
        marginRight: '10px',
        width: '20px'
    },
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    }
}
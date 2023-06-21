import React, { useState } from 'react'
import { db } from './../firebase.config';
import { getAuth } from 'firebase/auth';
import { collection, addDoc } from 'firebase/firestore';
import shortid from 'shortid';


const NewFolder = ({ setShowFolderModal, getFolders, folders }) => {
    const auth = getAuth();
    const [newFolderName, setNewFolderName] = useState("");
    const [folderCreating, setFolderCreating] = useState(false);

    const handleFolderCreate = async (e) => {
        e.preventDefault();
        setFolderCreating(true);
        if (newFolderName === "") {
            alert("Folder name cannot be empty");
            setFolderCreating(false);
            return;
        }
        if (folders.find(folder => folder.folderName === newFolderName)) {
            alert("Folder with same name already exists");
            setFolderCreating(false);
            return;
        }
        try {
            const folderRef = collection(db, "folders");
            const payload = {
                id: shortid.generate(),
                folderName: newFolderName,
                createdAt: new Date(),
                createdBy: auth.currentUser.email,
            }
            await addDoc(folderRef, payload);
            setShowFolderModal(false);
            alert("Folder created successfully");
            setNewFolderName("");
            setFolderCreating(false);
            await getFolders();
        } catch (error) {
            console.log(error);
            setFolderCreating(false);
        }
    }

    return (
        <div style={styles.modal}>
            <div style={styles.modalContent}>
                <p style={{ fontWeight: "bold" }}>New Folder</p>

                <form onSubmit={handleFolderCreate}>
                    <div style={styles.formControl}>
                        <label>Folder Name</label>
                        <input required value={newFolderName} onChange={(e) => setNewFolderName(e.target.value)} name='fileName' style={styles.input} type="text" placeholder='My awesome folder' />
                    </div>

                    <div style={{ ...styles.formControl, paddingTop: "1rem", marginTop: "2rem" }}>
                        <button disabled={folderCreating} style={styles.submitBtn} type="submit">
                            {
                                folderCreating ? "Creating..." : "Create"
                            }
                        </button>
                    </div>
                </form>

                <button disabled={folderCreating} onClick={() => setShowFolderModal(false)} style={styles.submitBtn}>Cancel</button>
            </div>
        </div>
    )
}

export default NewFolder

const styles = {
    modal: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: '20px',
        display: 'flex',
        gap: '1.5rem',
        alignItems: 'center',
        flexDirection: 'column',
    },
    modalClose: {
        padding: '10px',
        cursor: 'pointer',
    },
    closeButton: {
        padding: '10px',
        border: 'none',
        cursor: 'pointer',
        fontWeight: 'bold',
        backgroundColor: '#eee',
    },
    formControl: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.2rem',
        width: '100%',
    },
    submitBtn: {
        padding: '5px',
        border: 'none',
        cursor: 'pointer',
        fontWeight: 'bold',
        backgroundColor: '#eee',
    },
    input: {
        padding: '3px 7px',
    }
}
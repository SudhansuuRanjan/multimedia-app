import React, { useState } from 'react'
import { getAuth } from 'firebase/auth';
import { db } from '../firebase.config';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from 'firebase/firestore';
import shortid from 'shortid';

const FileUploadPopup = ({
    setShowFileModal,
    folders,
    getFiles
}) => {
    const auth = getAuth();
    const [fileToUpload, setFileToUpload] = useState(null);
    const [fileUploading, setFileUploading] = useState(false);
    const [formData, setFormData] = useState({
        fileName: "",
        fileType: "",
        folder: "",
        fileUrl: "",
    })

    // Handle FormData changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    // Upload file to Firebase Storage and getting url
    const storeFile = async (file) => {
        const storage = getStorage();
        const filename = `${file.name}-${shortid.generate()}`
        console.log(filename);
        const storageRef = ref(storage, 'files/' + filename);
        await uploadBytesResumable(storageRef, file);
        const url = await getDownloadURL(storageRef);
        return url;
    }

    // Creating a new doc in files collection with filedata
    const handleSubmit = async (e) => {
        e.preventDefault();
        setFileUploading(true);
        try {
            if (!fileToUpload) return;
            if (
                formData.fileName === "" || formData.fileType === "" || formData.folder === ""
            ) return alert("Please fill all the fields");
            const fileUrl = await storeFile(fileToUpload);
            const fileRef = collection(db, "files");
            const payload = {
                id: shortid.generate(),
                fileName: formData.fileName,
                fileType: formData.fileType,
                folder: formData.folder,
                fileUrl,
                createdAt: new Date(),
                createdBy: auth.currentUser.email,
            }
            await addDoc(fileRef, payload);
            setShowFileModal(false);
            alert("File uploaded successfully");
            setFormData({
                fileName: "",
                fileType: "",
                folder: "",
                fileUrl: "",
            })
            setFileToUpload(null);
            await getFiles();
            setFileUploading(false);
        } catch (error) {
            console.log(error);
            setFileUploading(false);
        }
    }

    const allFolders = folders && folders.filter((folder) => folder.folderName !== "All Files");


    return (
        <div style={styles.modal}>
            <div style={styles.modalContent}>
                <p style={{ fontWeight: "bold" }}>Upload File</p>

                <form onSubmit={handleSubmit} style={styles.modalBody}>
                    <div style={styles.formControl}>
                        <label>File</label>
                        <input required onChange={(e) => {
                            setFileToUpload(e.target.files[0])
                            setFormData({
                                ...formData,
                                fileName: e.target.files[0].name
                            })
                            console.log(e.target.files[0])
                        }} style={styles.input} type="file" />
                    </div>

                    <div style={styles.formControl}>
                        <label>File Name</label>
                        <input required value={formData.fileName} name='fileName' onChange={handleChange} style={styles.input} type="text" placeholder='My File' />
                    </div>

                    <div style={styles.formControl}>
                        <label>File Type</label>
                        <select required value={formData.fileType} name="fileType" onChange={handleChange} style={styles.input} placeholder="Select File Type">
                            <option value="">- Select -</option>
                            <option value="image">Image</option>
                            <option value="video">Video</option>
                            <option value="audio">Audio</option>
                            <option value="document">Document</option>
                        </select>
                    </div>

                    <div style={styles.formControl}>
                        <label>Folder</label>
                        <select required value={formData.folder} name="folder" onChange={handleChange} style={styles.input} placeholder="Select Folder">
                            <option value="">- Select -</option>
                            {
                                allFolders && allFolders.map(folder => (
                                    <option key={folder.id} value={folder.folderName}>{folder.folderName}</option>
                                ))
                            }
                        </select>
                    </div>

                    <div style={{ ...styles.formControl, paddingTop: "1rem" }}>
                        <button disabled={fileUploading} style={styles.submitBtn} type="submit">{
                            fileUploading ? "Uploading..." : "Upload"
                        }</button>
                    </div>
                </form>
                <button disabled={fileUploading} onClick={() => setShowFileModal(false)} style={styles.submitBtn} >Cancel</button>
            </div>
        </div>
    )
}

export default FileUploadPopup

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
        position: 'absolute',
        top: 0,
        right: 0,
        padding: '10px',
        cursor: 'pointer',
    },
    modalBody: {
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'column',
        padding: '10px',
        gap: '0.7rem',
    },
    modalHeader: {
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
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
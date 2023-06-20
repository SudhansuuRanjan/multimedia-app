import React from 'react'

const FileUploadPopup = ({
    setShowFileModal,
    setFileToUpload,
    setFormData,
    handleSubmit,
    formData,
    handleChange,
}) => {
    return (
        <div style={styles.modal}>
            <div style={styles.modalContent}>
                <p style={{ fontWeight: "bold" }}>Upload File</p>

                <form onSubmit={handleSubmit} style={styles.modalBody}>
                    <div style={styles.formControl}>
                        <label>File</label>
                        <input onChange={(e)=>{
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
                        <input value={formData.fileName} name='fileName' onChange={handleChange} style={styles.input} type="text" placeholder='My File'/>
                    </div>

                    <div style={styles.formControl}>
                        <label>File Type</label>
                        <select value={formData.fileType} name="fileType" onChange={handleChange} style={styles.input} placeholder="Select File Type">
                            <option value="">- Select -</option>
                            <option value="image">Image</option>
                            <option value="video">Video</option>
                            <option value="audio">Audio</option>
                            <option value="document">Document</option>
                        </select>
                    </div>

                    <div style={styles.formControl}>
                        <label>Folder</label>
                        <select value={formData.folder} name="folder" onChange={handleChange} style={styles.input} placeholder="Select Folder">
                            <option value="">- Select -</option>
                            <option value="image">Image</option>
                            <option value="video">Video</option>
                            <option value="audio">Audio</option>
                            <option value="document">Document</option>
                        </select>
                    </div>

                    <div style={{...styles.formControl, paddingTop:"1rem"}}>
                        <button style={styles.submitBtn} type="submit">Upload</button>
                    </div>
                </form>
                <button onClick={() => setShowFileModal(false)} style={styles.submitBtn} >Cancel</button>
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
    formControl:{
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
    input:{
        padding: '3px 7px',
    }
}
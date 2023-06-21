import React, { useState, useEffect } from 'react';
import { db } from '../firebase.config';
import { getAuth } from 'firebase/auth';
import { collection, getDocs, query, where, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { Pie, Bar } from 'react-chartjs-2';
import { AudioPlayer, ImageViewer, Loader, DocumentViewer, VideoPlayer, NewFolder, Folder, FileUploadPopup, Header } from '../components';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);


export default function Home() {
  const auth = getAuth();
  const [myFiles, setMyFiles] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const [showChartModal, setShowChartModal] = useState(false);
  const [showFileModal, setShowFileModal] = useState(false);
  const [currentFolder, setCurrentFolder] = useState(null) // All Files, [folder name
  const [folders, setFolders] = useState([]);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [selectedFolderName, setSelectedFolderName] = useState("All Files");


  // Get all files and Folders on page load
  useEffect(() => {
    getFolders();
    getFiles();
  }, [])


  var barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Files Breakdown',
      },
    },
  };

  // Get all files created by the user and sort them by date created in descending order (newest first) from firestore
  const getFiles = async () => {
    const q = query(collection(db, "files"), where("createdBy", "==", auth.currentUser.email));
    const querySnapshot = await getDocs(q);
    const files = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      data.uid = doc.id;
      files.push(data);
    });
    files.sort((a, b) => b.createdAt - a.createdAt);
    // console.log(files);
    setMyFiles(files);
    setCurrentFolder(files);
  }

  // Get all folders created by the user and sort them by date created in descending order (newest first) from firestore
  const getFolders = async () => {
    const q = query(collection(db, "folders"), where("createdBy", "==", auth.currentUser.email));
    const querySnapshot = await getDocs(q);
    const folders = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      data.uid = doc.id;
      folders.push(data);
    });
    folders.sort((a, b) => b.createdAt - a.createdAt);
    // console.log(folders);
    setFolders(folders);
  }

  // Rename a File in firestore
  const renameFile = async (id, fileName) => {
    try {
      const fileRef = doc(db, "files", id);
      await updateDoc(fileRef, { fileName });
    } catch (error) {
      console.log(error);
    }
  }

  // Delete a File in firestore
  const deleteFile = async (id) => {
    try {
      const fileRef = doc(db, "files", id);
      await deleteDoc(fileRef);
    } catch (error) {
      console.log(error);
    }
  }


  return (
    <>
      {
        showFolderModal && (
          <NewFolder folders={folders} setShowFolderModal={setShowFolderModal} getFolders={getFolders} />
        )
      }
      {
        showFileModal && (
          <FileUploadPopup getFiles={getFiles} folders={folders} setShowFileModal={setShowFileModal} />
        )
      }
      {showChartModal && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <p style={{ fontWeight: "bold" }}>Files Breakdown</p>
              <button style={styles.closeButton} onClick={() => setShowChartModal(false)}>close</button>
            </div>
            <div style={styles.modalBody}>
              <Pie
                data={{
                  labels: ['Video', 'Audio', 'Document', 'Image'],
                  datasets: [
                    {
                      label: 'Files Breakdown',
                      data: [myFiles.filter(file => file.fileType === 'video').length, myFiles.filter(file => file.fileType === 'audio').length, myFiles.filter(file => file.fileType === 'document').length, myFiles.filter(file => file.fileType === 'image').length],
                      backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                      ],
                      borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                      ],
                      borderWidth: 1,
                    },
                  ],
                }}
              />
              <Bar
                data={{
                  labels: ['Video', 'Audio', 'Document', 'Image'],
                  datasets: [
                    {
                      label: 'Files Breakdown',
                      data: [myFiles.filter(file => file.fileType === 'video').length, myFiles.filter(file => file.fileType === 'audio').length, myFiles.filter(file => file.fileType === 'document').length, myFiles.filter(file => file.fileType === 'image').length],
                      backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                      ],
                      borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                      ],
                      borderWidth: 1,
                    },
                  ],
                }}
                options={barChartOptions}
              />
            </div>
          </div>
        </div>
      )}
      <div className="App">
        <Header />
        <div style={styles.container}>
          <div style={{ padding: 10, paddingBottom: 0, }}>
            <p style={{ fontWeight: "bolder", fontSize: "1.1rem" }}>My Files</p>
            <p style={{ fontWeight: "bold" }}>User : {auth.currentUser.displayName}</p>
            <p style={{ fontWeight: "normal" }}>Email : {auth.currentUser.email}</p>
            <p>Drive Path : {"/file-server/" + selectedFolderName}</p>
          </div>
          <div style={styles.controlTools}>
            <button style={styles.controlButton}
              onClick={() => setShowFileModal(true)}
            >Upload File</button>
            <button style={styles.controlButton}
              onClick={async () => {
                if (selectedFile) {
                  const newName = prompt("Enter new name", selectedFile.fileName) ?? selectedFile.fileName;
                  const newFiles = currentFolder.map(file => {
                    if (file.id === selectedFile.id) {
                      return {
                        ...file,
                        fileName: newName,
                      }
                    }
                    return file
                  })
                  setCurrentFolder(newFiles)
                  await renameFile(selectedFile.uid, newName);
                  setSelectedFile(null);
                  await getFiles();
                }
              }
              }
            >Rename</button>
            <button style={styles.controlButton}
              onClick={() => {
                setShowChartModal(true)
              }}
            >Files Breakdown</button>
            <button style={styles.controlButton}
              onClick={() => {
                if (selectedFile) {
                  const link = document.createElement("a");
                  link.href = selectedFile.fileUrl;
                  link.download = selectedFile.fileName; // Set the desired file name
                  link.target = "_blank";
                  link.click();
                }
              }}
            >Download</button>
            <button style={styles.controlButton}
              onClick={async () => {
                if (selectedFile) {
                  await deleteFile(selectedFile.uid);
                  const newData = currentFolder.filter((file) => file.fileUrl !== selectedFile.fileUrl);
                  setCurrentFolder(newData);
                  setSelectedFile(null);
                  await getFiles();
                }
              }}
            >Delete</button>
          </div>
          <div style={styles.controlTools}>
            {
              folders.map((folder) => (
                <Folder setSelectedFile={setSelectedFile} setSelectedFolderName={setSelectedFolderName} selected={folder.folderName === selectedFolderName} files={myFiles} setCurrentFolder={setCurrentFolder} key={folder.id} folder={folder} />
              ))
            }

            <div onClick={() => setShowFolderModal(true)} style={styles.Folder}>
              <img style={styles.folderImG} src="./icons/newfolder.png" alt="folder" />
              <div style={styles.name}>
                Create Folder
              </div>
            </div>
          </div>
          <div style={styles.fileContainer}>
            <div style={{ width: "100%", padding: 10 }}>
              {!currentFolder ? <Loader /> : currentFolder.map((file) =>
                <div style={selectedFile?.fileUrl === file.fileUrl ? styles.fileSelected : styles.file} className="files" key={file.id} onClick={() => {
                  if (selectedFile && selectedFile.id === file.id) {
                    setSelectedFile(null)
                    return
                  }
                  setSelectedFile(file)
                }}>
                  {
                    file.fileType === 'video' && (
                      <img alt='video' src="./icons/youtube.png" style={{ width: 40, height: 40 }} />)
                  }
                  {
                    file.fileType === 'audio' && (
                      <img alt='audio' src="./icons/audio.png" style={{ width: 40, height: 40 }} />)
                  }
                  {
                    file.fileType === 'document' && (
                      <img alt='doc' src="./icons/doc.png" style={{ width: 40, height: 40 }} />)
                  }
                  {
                    file.fileType === 'image' && (
                      <img alt='pic' src="./icons/image.png" style={{ width: 40, height: 40 }} />)
                  }
                  <p>{file.fileName}</p>
                </div>
              )
              }
            </div>
            {selectedFile && (
              <div style={styles.fileViewer}>
                {selectedFile.fileType === 'video' && (
                  <VideoPlayer path={selectedFile.fileUrl} />
                )}
                {selectedFile.fileType === 'audio' && (
                  <AudioPlayer path={selectedFile.fileUrl} />
                )}
                {selectedFile.fileType === 'document' && (
                  <DocumentViewer path={selectedFile.fileUrl} />
                )}
                {selectedFile.fileType === 'image' && (
                  <ImageViewer path={selectedFile.fileUrl} />
                )}
                <p style={{ fontWeight: "bold", marginTop: 10 }}>{selectedFile.fileName}</p>
                <p>path: <span style={{ fontStyle: "italic" }}>/{selectedFile.folder}</span></p>
                <p>file type: <span style={{ fontStyle: "italic" }}>{selectedFile.fileType}</span></p>
              </div>

            )}
          </div>
        </div>
      </div>
    </>
  );
}

const styles = {
  container: {
    backgroundColor: '#fff',
    color: '#000',
  },
  fileContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexDirection: 'row',

  },
  file: {
    backgroundColor: '#eee',
    padding: '10px',
    marginBottom: '10px',
    cursor: 'pointer',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  fileSelected: {
    backgroundColor: '#ccc',
    padding: '10px',
    marginBottom: '10px',
    cursor: 'pointer',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  fileViewer: {
    padding: '10px',
    margin: '10px',
    width: '30vw',
    height: '100vh',
    cursor: 'pointer',
    borderLeft: '1px solid #000'
  },
  controlTools: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
    flexDirection: 'row',
    padding: '10px',
  },
  controlButton: {
    padding: '10px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 'bold',
  },

  // modal
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
    height: '50vh',
    display: 'flex',
    justifyContent: 'space-between',
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
    width: '100%',
    height: '90%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    padding: '10px',
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
  Folder: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "100px",
    height: "100px",
    backgroundColor: "#fff",
    borderRadius: "10px",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
    cursor: "pointer",
    transition: "all 0.3s ease-in-out",
    ":hover": {
      transform: "scale(1.05)",
    }
  },
  folderImG: {
    width: "50px",
    height: "50px",
  },
  name: {
    fontSize: "0.8rem",
    fontWeight: "bold",
    marginTop: "0.5rem",
  },
};
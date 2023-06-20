import React, { useState, useEffect } from 'react';
import { db } from '../firebase.config';
import { getAuth } from 'firebase/auth';
import { collection, getDocs, addDoc, query, where } from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { Header } from "../components/Header";
import { AudioPlayer } from '../components/AudioPlayer';
import { DocumentViewer } from '../components/DocumentViewer';
import { VideoPlayer } from '../components/VideoPlayer';
import { ImageViewer } from '../components/ImageViewer';
import { Pie, Bar } from 'react-chartjs-2';
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
import FileUploadPopup from '../components/FileUploadPopup';
import shortid from 'shortid';
import Loader from '../components/Loader';
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
  const [filePath, setFilePath] = useState("/file-server/")
  const [showChartModal, setShowChartModal] = useState(false);
  const [showFileModal, setShowFileModal] = useState(false);
  const [fileToUpload, setFileToUpload] = useState(null);
  const [formData, setFormData] = useState({
    fileName: "",
    fileType: "",
    folder: "",
    fileUrl: "",
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }



  useEffect(() => {
    // setMyFiles(data);
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

  const getFiles = async () => {
    const q = query(collection(db, "files"), where("createdBy", "==", auth.currentUser.email));
    const querySnapshot = await getDocs(q);
    const files = [];
    querySnapshot.forEach((doc) => {
      doc.data().id = doc.id;
      files.push(doc.data());
    });
    // console.log(files);
    setMyFiles(files);
  }

  const storeFile = async (file) => {
    const storage = getStorage();
    const filename = `${file.name}-${shortid.generate()}`
    const storageRef = ref(storage, 'files/' + filename);
    await uploadBytesResumable(storageRef, file);
    const url = await getDownloadURL(storageRef);
    return url;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!fileToUpload) return;
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
      await getFiles();
    } catch (error) {
      console.log(error);
    }
  }


  return (
    <>
      {
        showFileModal && (
          <FileUploadPopup handleSubmit={handleSubmit} setShowFileModal={setShowFileModal} formData={formData} setFormData={setFormData} setFileToUpload={setFileToUpload} handleChange={handleChange} />
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
            <p>Drive Path : {selectedFile ? "/file-server/" + selectedFile.folder : filePath}</p>
          </div>
          <div style={styles.controlTools}>
            <button style={styles.controlButton}
              onClick={() => setShowFileModal(true)}
            >Upload File</button>
            <button style={styles.controlButton}
              onClick={() => {
                if (selectedFile) {
                  const newFiles = myFiles.map(file => {
                    if (file.id === selectedFile.id) {
                      return {
                        ...file,
                        fileName: prompt("Enter new name", file.fileName) ?? file.fileName
                      }
                    }
                    return file
                  })
                  setMyFiles(newFiles)
                  setSelectedFile(null)
                }
              }}
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
              onClick={() => {
                if (selectedFile) {
                  const newData = myFiles.filter((file) => file.path !== selectedFile.path);
                  setMyFiles(newData);
                  setSelectedFile(null);
                }
              }}
            >Delete</button>
          </div>
          <div style={styles.fileContainer}>
            <div style={{ width: "100%", padding: 10 }}>
              {!myFiles ? <Loader /> : myFiles.map((file) =>
                <div style={selectedFile?.fileUrl === file.fileUrl ? styles.fileSelected : styles.file} className="files" key={file.id} onClick={() => {
                  if (selectedFile && selectedFile.id === file.id) {
                    setSelectedFile(null)
                    return
                  }
                  setSelectedFile(file)
                }}>
                  {
                    file.fileType === 'video' && (
                      <img src="./icons/youtube.png" style={{ width: 40, height: 40 }} />)
                  }
                  {
                    file.fileType === 'audio' && (
                      <img src="./icons/audio.png" style={{ width: 40, height: 40 }} />)
                  }
                  {
                    file.fileType === 'document' && (
                      <img src="./icons/doc.png" style={{ width: 40, height: 40 }} />)
                  }
                  {
                    file.fileType === 'image' && (
                      <img src="./icons/image.png" style={{ width: 40, height: 40 }} />)
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
  }
};
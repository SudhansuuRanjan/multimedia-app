import React from 'react'


const Folder = ({ folder, files, setCurrentFolder,setSelectedFolderName, selected, setSelectedFile }) => {
  const handleClick = () => {
    setSelectedFile(null);
    setSelectedFolderName(folder.folderName);
    if (folder.folderName === "All Files") {
      setCurrentFolder(files);
    } else {
      const folderfiles = files.filter(file => file.folder === folder.folderName);
      setCurrentFolder(folderfiles);
    }
  }


  return (
    <div onClick={handleClick} style={selected ? styles.FolderSelected : styles.Folder}>
      <img style={styles.folderImG} src="./icons/folder.png" alt="folder" />
      <div style={styles.name}>
        {folder.folderName}
      </div>
    </div>
  )
}

export default Folder

const styles = {
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

  FolderSelected: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "100px",
    height: "100px",
    backgroundColor: "#eee",
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
}
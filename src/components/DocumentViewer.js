export const DocumentViewer = ({ path }) => {
    return (
      <div style={{width:"100%"}}>
        <iframe title="doc" style={{width:"100%", height: "300px"}} src={path}></iframe>
      </div>
    )
  }
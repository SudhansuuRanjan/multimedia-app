export const ImageViewer = ({ path }) => {
    return (
      <div style={{width:"100%"}}>
        <img alt="file" src={path} />
      </div>
    )
  }
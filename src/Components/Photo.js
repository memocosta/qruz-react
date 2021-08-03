import React, { useState, useRef } from 'react'
import uploadIcon from '../upload.svg';

const Photo = (props) => {
  const [photo, setPhoto] = useState(props.photo);
  const fileInput = useRef(null);

  const handleSelectFile = () => {
    fileInput.current.click()
  }

  const onChange = ({
    target: {
      validity,
      files: [file]
    }
  }) => {
    validity.valid &&
    props.newPhoto(file)
    let reader = new FileReader();
    reader.onload = (e) => { 
      setPhoto(e.target.result);
    }
    reader.readAsDataURL(file);
  }

  return (
    <div>
      {photo &&
        <div className="image-cover image-cover-lg rounded-circle clickable"
          style={{ backgroundImage: "url("+photo+")"}}
          onClick={() => handleSelectFile()}
        ></div>
      }
      {!photo &&
        <div className="placeholder rounded-circle placeholder-lg bg-teal text-white clickable"
          onClick={() => handleSelectFile()}>
            <img src={uploadIcon} alt="Click to choose file" />
        </div>
      }
      <div className="mt-1">
        <small className="text-muted">
          {photo ? "Click to select another photo" : "Click to select photo"}
        </small>
      </div>
      <input style={{display: "none"}} type="file" ref={fileInput} onChange={onChange} />
    </div>
  )
}

export default Photo
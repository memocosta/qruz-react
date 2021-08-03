import React, { useState, useRef } from 'react'
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import uploadIcon from '../../upload.svg';
 
const GET_DOCUMENTS = gql`
  query getDocuments($documentableID: ID!, $documentableType: String!) {
    documents(documentable_id: $documentableID, documentable_type: $documentableType) {
      id
      name
      url
      expires_on
      documentable_id
      documentable_type
      updated_at
    }
  }
`;

const SINGLE_UPLOAD_MUTATION = gql`
  mutation singleUpload(
      $name: String, 
      $expiresOn: Date, 
      $documentableID: ID!, 
      $documentableType: String!, 
      $file: Upload!
    ) {
    uploadDocument(input: {
      documentable_id: $documentableID, 
      documentable_type: $documentableType
      file: $file
      name: $name
      expires_on: $expiresOn
    }) {
      id
      name
      url
      expires_on
      documentable_id
      documentable_type
      updated_at
    }
  }
`;

const CreateDocument = (props) => {
  const [name, setName] = useState('');
  const [expDay, setExpDay] = useState('');
  const [expMonth, setExpMonth] = useState('');
  const [expYear, setExpYear] = useState(''); 
  const [fileNameNull, setFileNameNull] = useState(false);  
  const [file, setFile] = useState();  
  const fileInput = useRef(null);
  const expiryDate = (expYear && expMonth && expDay) ? expYear + '-' + expMonth + '-' + expDay : null;

  const [
    uploadFileMutation,
    { loading, error }
  ] = useMutation(SINGLE_UPLOAD_MUTATION, {
    update: (store, { data: { uploadDocument } }) => {
      const data = store.readQuery({ 
        query: GET_DOCUMENTS,
        variables: { 
          documentableID: props.documentableID,
          documentableType: props.documentableType
        },
      });
      
      data.documents.push(uploadDocument);

      store.writeQuery({ 
        query: GET_DOCUMENTS,
        variables: { 
          documentableID: props.documentableID,
          documentableType: props.documentableType
        },
        data 
      });
    },
    onCompleted() {
      props.createModal(false);
    }
  });

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
    setFile(file)
  }

  const canUpload = (name || fileNameNull) && file && !loading;

  let button;
  if (loading) {
    button = "Saving.."
  } else {
    button = "Save"
  }

  let mutationFeedback;
  if (error) {
    mutationFeedback = <p className='alert alert-danger mb-4 rounded-0'>Bummer! Oh no, we weren't able to save changes made on this document. Please try again, if the issue persists, please shoot us an email at <em>support@qruz.app</em> and we'll help you out.</p>
  }

  const days = [];
  const months = [];
  const years = [];
  const currentYear = new Date().getFullYear();
  for (let i = 1; i <= 31; i++) { days.push(i) }
  for (let i = 1; i <= 12; i++) { months.push(i) }
  for (let i = currentYear; i <= currentYear + 10; i++) { years.push(i) }
  
  return (
    <div className="dialog-mask">
      <div className="dialog-wrapper dialog-md bg-white rounded-top rounded-bottom">
        <div className="dialog-container">
          <div id="dialog-header" className="rounded-top py-1 bg-gradient"></div>
          <form encType="multipart/form-data"
            onSubmit={e => {
              e.preventDefault();
              uploadFileMutation({ variables: { 
                documentableID: props.documentableID,
                documentableType: props.documentableType,
                file,
                name,
                expiresOn: expiryDate
            } });
          }}>
            <div id="dialog-body" className="px-4 pt-4 pb-4">
              <div className="text-center mb-2">
                <div className={"placeholder rounded-circle placeholder-lg bg-teal text-white clickable " + (loading ? " no-action inactive" : "")}
                  onClick={() => handleSelectFile()}>
                  {loading && 
                    <div className="spinner spinner-light"></div>
                  }
                  {!loading && 
                    <img src={uploadIcon} alt="Click to choose file" />
                  }
                </div>
                <div className="mt-1">
                  <small className="text-muted">
                    {file && file.name ? file.name + ' Selected' : 'Click to select file'}
                  </small>
                </div>
              </div>
              <div className="form-row">
                <input style={{display: "none"}} type="file" ref={fileInput} onChange={onChange} />
                <div className="form-group col-12">
                  <div className="custom-control custom-switch">
                    <input type="checkbox" 
                      className="custom-control-input" 
                      id="toggleCarRideShare"
                      onChange={() => setFileNameNull(!fileNameNull)}
                      value={fileNameNull}
                      checked={fileNameNull} />
                    <label className="custom-control-label" htmlFor="toggleCarRideShare">
                      Use original file name
                    </label>
                  </div>
                </div> 
                <div className="form-group col-12">
                  <input type="text" name="name" id="name" 
                    disabled={fileNameNull}
                    className="form-control" autoComplete="off" 
                    placeholder="File Name" 
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                  />
                  <small className="form-text text-muted">
                    It's highly recommended to assign each file a custom name instead of using the original file name.
                  </small>
                </div>
              </div>
              <div className="form-row">
                <p className="mb-2 ml-1 font-weight-custom">
                  Valid until
                </p>
              </div>
              <div className="form-row">
                <div className="form-group col-4 col-md-3 col-lg-2 mb-0">
                  <select name="licenseExpDay" id="licenseExpDay" 
                    className="form-control"
                    onChange={(e) => setExpDay(e.target.value)}
                    value={expDay}
                  >
                    <option value="">Day</option>
                    {days.map((day) => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group col-4 col-md-3 col-lg-2 mb-0">
                  <select name="licenseExpMonth" id="licenseExpMonth" 
                    className="form-control"
                    onChange={(e) => setExpMonth(e.target.value)}
                    value={expMonth}
                  >
                    <option value="">Month</option>
                    {months.map((month) => (
                      <option key={month} value={month}>{month}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group col-4 col-md-3 col-lg-2 mb-0">
                  <select name="licenseExpYear" id="licenseExpYear" 
                    className="form-control"
                    onChange={(e) => setExpYear(e.target.value)}
                    value={expYear}
                  >
                    <option value="">Year</option>
                    {years.map((year) => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
                <small className="form-text text-muted">
                  This is for documents that have an expiry date, e.g, National IDs, Driving License, etc.
                </small>
              </div>
            </div>
            {mutationFeedback}
            <div id="dialog-footer" className="px-4 pb-4">
              <button type="submit"
                className="btn btn-sm btn-outline-primary mr-2"
                disabled={!canUpload}>{button}
              </button>
              <button type="button" className="btn btn-sm btn-outline-secondary"
                onClick={() => props.createModal(false)}>Dismiss</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CreateDocument
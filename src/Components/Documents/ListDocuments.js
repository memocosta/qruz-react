import React, { useState } from 'react'
import gql from 'graphql-tag'
import { useQuery } from '@apollo/react-hooks'
import CreateDocument from './CreateDocument'
import EditDocument from './EditDocument'
import DeleteDocument from './DeleteDocument'


const GET_DOCUMENTS = gql`
  query getDocuments($documentableID: ID!, $documentableType: String!) {
    documents(documentable_id: $documentableID, documentable_type: $documentableType) {
      id
      name
      url
      expires_on
      documentable_id
      documentable_type
    }
  }
`;

const ListDocuments = (props) => {
  const [filterStr, setFilterStr] = useState('');
  const [createDocumentModal, setCreateDocumentModal] = useState(false);
  const [editDocumentID, setEditDocumentID] = useState('');
  const [deleteDocumentID, setDeleteDocumentID] = useState('');
  const [editDocumentModal, setEditDocumentModal] = useState(false);
  const [deleteDocumentModal, setDeleteDocumentModal] = useState(false);

  const { loading, error, data } = useQuery(GET_DOCUMENTS, {
    variables: { 
      documentableID: props.documentableID,
      documentableType: props.documentableType
    }
  });

  const handleEditModal = (DocumentID) => {
    setEditDocumentModal(true)
    setEditDocumentID(DocumentID)
  }

  const handleDeleteModal = (DocumentID) => {
    setDeleteDocumentModal(true)
    setDeleteDocumentID(DocumentID)
  }

  const hasData = () => data 
    && data.documents 
    && data.documents.length > 0
  
  const getFileExt = (url) => url.split('.').pop();

  if (loading) return <div className="spinner spinner-dark"></div>;
  if (error) return <p className="alert alert-danger">Error! Something went wrong.</p>; 
     
  return (
    <div>
      {!hasData() &&
        <div className="card border-0 mb-4">
          <div className="card-body">
            <div className="row justify-content-between">
              <div className="col-auto align-self-center">
                <p className="text-muted mb-0">
                  No documents yet.
                </p>
              </div>
              <div className="col-auto align-self-center">
                <button type="button"
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => setCreateDocumentModal(true)}>Upload
                </button>
              </div>
            </div>
          </div>
        </div>
      }
      {hasData() &&
        <div className="mb-4">
          <div className="card border-0 mb-4">
            <div className="card-body">
              <div className="row justify-content-between">
                <div className="col-auto align-self-center">
                  <form>
                    <input type="text" className="form-control" 
                      placeholder="Filter by name"
                      onChange={(e) => setFilterStr(e.target.value)}
                      value={filterStr} 
                    />
                  </form>
                </div>
                <div className="col-auto align-self-center">
                  <button type="button"
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => setCreateDocumentModal(true)}>Upload
                  </button>
                </div>
              </div>
            </div>
          </div> 
          <div className="row">
            {data.documents.filter(document => 
              document.name.toLowerCase().includes(filterStr.toLowerCase())
            ).map((document) => (
              <div className="col-md-4" key={document.id}>
                <div className="card border-0 mb-4">
                  <div className="card-body">
                    <div className="row justify-content-between">
                      <div className="col-auto align-self-center">
                        <small className="text-muted">
                          { getFileExt(document.url) }
                        </small>
                        <h4 className="mb-0 font-weight-bold" title={document.name}>
                          { document.name.length > 20 ? document.name.substring(0,20)+'..' : document.name }
                        </h4>
                        <small className="text-muted d">
                          { document.expires_on ? 
                            'Valid until '+ document.expires_on : 
                            'Has no expiration date.' 
                          }
                        </small>
                        <div className="mt-3">
                          <button type="button" 
                            className="btn btn-sm btn-light"
                            onClick={() => handleEditModal(document.id)}>
                            Edit
                          </button>
                          {editDocumentModal && editDocumentID === document.id &&
                            <EditDocument
                              document={document} 
                              editModal={setEditDocumentModal} 
                            />
                          }
                          <a href={document.url}
                            className="btn btn-sm btn-light mx-2" target="_blank" rel="noopener noreferrer">
                            Download
                          </a>
                          <button type="button"
                            onClick={() => handleDeleteModal(document.id)}
                            className="btn btn-sm btn-light">Del
                          </button>
                          {deleteDocumentModal && deleteDocumentID === document.id &&
                            <DeleteDocument
                              documentID={document.id} 
                              documentName={document.name} 
                              documentableID={document.documentable_id} 
                              documentableType={document.documentable_type} 
                              deleteModal={setDeleteDocumentModal} 
                            />
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      }
      {createDocumentModal &&
        <CreateDocument 
          createModal={setCreateDocumentModal} 
          documentableID={props.documentableID}
          documentableType={props.documentableType}
        />
      }
    </div>
  )
}

export default ListDocuments
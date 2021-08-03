import React from 'react'
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';

const DELETE_DOCUMENT = gql`
  mutation DeleteDocument($id: ID!) {
    deleteDocument(id: $id)
  }
`;
 
const GET_DOCUMENTS = gql`
  query GetDocuments($documentableID: ID!, $documentableType: String!) {
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

const DeleteDocument = (props) => {
  const [
    deleteDocument,
    { loading: mutationLoading },
  ] = useMutation(
    DELETE_DOCUMENT,
    {
      update: (store) => {
        const data = store.readQuery({ 
          query: GET_DOCUMENTS,
          variables: { 
            documentableID: props.documentableID,
            documentableType: props.documentableType
          }
         });   

        const newData = data.documents.filter(document => document.id !== props.documentID);

        store.writeQuery({ 
          query: GET_DOCUMENTS,
          variables: { 
            documentableID: props.documentableID,
            documentableType: props.documentableType
          }, 
          data: {documents: newData}
        });
      },
      onCompleted() {
        props.deleteModal(false)
      }
    }
  );

  let btnDisabled = false;
  let buttonText;
  if (mutationLoading) {
    buttonText = "Deleting"
    btnDisabled = true
  } else {
    buttonText = "Yes, delete"
  }
  return (
    <div className="dialog-mask">
      <div className="dialog-wrapper dialog-sm bg-white rounded-top rounded-bottom">
        <div className="dialog-container">
          <div id="dialog-body" className="px-4 pt-4">
            <p className="text-muted">
              You are about to delete <strong>{props.documentName}</strong> document. No one will be able to access this document ever again.
            </p>
            <p className="font-weight-bold mt-4">Are you absolutely positive?</p>
          </div>
          <div id="dialog-footer" className="px-4 pb-4 text-center">
            <button type="button"
              className="btn btn-lg btn-block btn-danger mb-2"
              onClick={() => {
                deleteDocument({
                  variables: {
                    id: props.documentID
                  }
                });
              }}
              disabled={btnDisabled}>{buttonText}
            </button>
            <button type="button" className="btn btn-sm btn-light"
              onClick={() => props.deleteModal(false)}>No, cancel</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DeleteDocument
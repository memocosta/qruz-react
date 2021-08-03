import React from 'react'
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';

const DELETE_PARTNER = gql`
  mutation DeletePartner(
    $id: ID!
  ) {
    deletePartner(
      id: $id
    ) {
      id
    }
  }
`;

const GET_PARTNERS = gql`
  {
    partners {
      id
      name
      email
      phone1
      phone2
      type
      size
      max_no_of_trips
      license_expires_on
    }
  }
`;

const DeletePartner = (props) => {
  const [
    deletePartner,
    { loading: mutationLoading },
  ] = useMutation(
    DELETE_PARTNER,
    {
      update: (store) => {
        const data = store.readQuery({ 
          query: GET_PARTNERS
         });   

        const newData = data.partners.filter(partner => partner.id !== props.partnerID);

        store.writeQuery({ 
          query: GET_PARTNERS, 
          data: {partners: newData}
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
              You are about to delete <strong>{props.partnerName}</strong> partner. No one will be able to access it ever again.
            </p>
            <p className="font-weight-bold mt-4">Are you absolutely positive?</p>
          </div>
          <div id="dialog-footer" className="px-4 pb-4 text-center">
            <button type="button"
              className="btn btn-lg btn-block btn-danger mb-2"
              onClick={() => {
                deletePartner({
                  variables: {
                    id: props.partnerID
                  }
                });
              }}
              disabled={btnDisabled}>{buttonText}
            </button>
            <button type="button" className="btn btn-light"
              onClick={() => props.deleteModal(false)}>No, cancel</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DeletePartner
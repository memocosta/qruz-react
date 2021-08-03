import React from 'react'
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';

const DELETE_PARTNER_USER = gql`
  mutation DeletePartnerUser(
    $id: ID!
  ) {
    deleteUser(
      id: $id
    ) {
      id
    }
  }
`;

const GET_PARTNER_USERS = gql`
  query getPartnerUsers($partner_id: ID!) {
    partnerUsers(partner_id: $partner_id) {
      id
      name
      email
      phone
      position
    }
  }
`;

const DeletePartnerUser = (props) => {
  const [
    deleteUser,
    { loading: mutationLoading },
  ] = useMutation(
    DELETE_PARTNER_USER,
    {
      update: (store) => {
        const data = store.readQuery({ 
          query: GET_PARTNER_USERS,
          variables: { partner_id: props.partnerID}
         });   

        const newData = data.partnerUsers.filter(user => user.id !== props.userID);

        store.writeQuery({ 
          query: GET_PARTNER_USERS,
          variables: { partner_id: props.partnerID}, 
          data: {partnerUsers: newData}
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
              You are about to delete employee <strong>{props.userName}</strong>. No one will be able to access this employee ever again.
            </p>
            <p className="font-weight-bold mt-4">Are you absolutely positive?</p>
          </div>
          <div id="dialog-footer" className="px-4 pb-4 text-center">
            <button type="button"
              className="btn btn-lg btn-block btn-danger mb-2"
              onClick={() => {
                deleteUser({
                  variables: {
                    id: props.userID
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

export default DeletePartnerUser
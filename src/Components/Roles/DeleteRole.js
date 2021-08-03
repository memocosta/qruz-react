import React from 'react'
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';

const DELETE_ROLE = gql`
  mutation DeleteRole(
    $id: ID!
  ) {
    deleteRole(
      id: $id
    ) {
      id
    }
  }
`;

const GET_ROLES = gql`
  {
    roles { 
      id
      name
      email
      phone      
      role_type {
        id
        name
      }
      dashboard
      roles
      archive
      communication
      promocodes
      business
      commute
      ondemand
      fleet
      payment
      cancellation
    }
  }
`;

const DeleteRole = (props) => {
  const [
    deleteRole,
    { loading: mutationLoading },
  ] = useMutation(
    DELETE_ROLE,
    {
      update: (store) => {
        const data = store.readQuery({ 
          query: GET_ROLES
         });   

        const newData = data.roles.filter(role => role.id !== props.roleID);

        store.writeQuery({ 
          query: GET_ROLES, 
          data: {roles: newData}
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
              You are about to delete role <strong>{props.roleName}</strong>. No one will be able to access it ever again.
            </p>
            <p className="font-weight-bold mt-4">Are you absolutely positive?</p>
          </div>
          <div id="dialog-footer" className="px-4 pb-4 text-center">
            <button type="button"
              className="btn btn-lg btn-block btn-danger mb-2"
              onClick={() => {
                deleteRole({
                  variables: {
                    id: props.roleID
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

export default DeleteRole
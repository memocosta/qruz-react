import React from 'react'
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';

const DELETE_CAR_TYPE = gql`
  mutation DeleteCarType(
    $id: ID!
  ) {
    deleteCarType(
      id: $id
    ) {
      id
    }
  }
`;

const GET_CAR_TYPES = gql`
  {
    carTypes {
      id
      name
    }
  }
`;

const DeleteCarType = (props) => {
  const [
    deleteCarType,
    { loading: mutationLoading },
  ] = useMutation(
    DELETE_CAR_TYPE,
    {
      update: (store) => {
        const data = store.readQuery({ 
          query: GET_CAR_TYPES
         });   

        const newData = data.carTypes.filter(type => type.id !== props.carTypeID);

        store.writeQuery({ 
          query: GET_CAR_TYPES,
          data: {carTypes: newData}
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
              You are about to delete car type <strong>{props.carTypeName}</strong>. No one will be able to access it ever again.
            </p>
            <p className="font-weight-bold mt-4">Are you absolutely positive?</p>
          </div>
          <div id="dialog-footer" className="px-4 pb-4 text-center">
            <button type="button"
              className="btn btn-lg btn-block btn-danger mb-2"
              onClick={() => {
                deleteCarType({
                  variables: {
                    id: props.carTypeID
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

export default DeleteCarType
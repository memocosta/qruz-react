import React from 'react'
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';

const DELETE_CAR_MAKE = gql`
  mutation DeleteCarMake(
    $id: ID!
  ) {
    deleteCarMake(
      id: $id
    ) {
      id
    }
  }
`;

const GET_CAR_MAKES = gql`
  {
    carMakes {
      id
      name
    }
  }
`;

const DeleteCarMake = (props) => {
  const [
    deleteCarMake,
    { loading: mutationLoading },
  ] = useMutation(
    DELETE_CAR_MAKE,
    { 
      update: (store) => {
        const data = store.readQuery({ 
          query: GET_CAR_MAKES
         });   

        const newData = data.carMakes.filter(make => make.id !== props.carMakeID);

        store.writeQuery({ 
          query: GET_CAR_MAKES,
          data: {carMakes: newData}
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
              You are about to delete car make <strong>{props.carMakeName}</strong>. No one will be able to access it ever again.
            </p>
            <p className="font-weight-bold mt-4">Are you absolutely positive?</p>
          </div>
          <div id="dialog-footer" className="px-4 pb-4 text-center">
            <button type="button"
              className="btn btn-lg btn-block btn-danger mb-2"
              onClick={() => {
                deleteCarMake({
                  variables: {
                    id: props.carMakeID
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

export default DeleteCarMake
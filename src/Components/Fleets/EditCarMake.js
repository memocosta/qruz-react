import React, { useState } from 'react'
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';

const UPDATE_CAR_MAKE = gql`
  mutation UpdateCarMake(
    $id: ID!
    $name: String!
  ) {
    updateCarMake(
      input: {
        id: $id
        name: $name
      }
    ) {
      id
      name
    }
  }
`;

const EditCarMake = (props) => {
  const [name, setName] = useState(props.carMake.name);

  const [
    updateCarMake,
    { loading: mutationLoading, error: mutationError },
  ] = useMutation(
    UPDATE_CAR_MAKE,
    {
      onCompleted() {
        props.editModal(false)
      }
    }
  );

  let btnDisabled = true;
  if (name && !mutationLoading
  ) {
    btnDisabled = false
  }

  let button;
  if (mutationLoading) {
    button = "Saving.."
  } else {
    button = "Save"
  }

  let mutationFeedback;

  if (mutationError) {
    mutationFeedback = <p className='alert alert-danger mb-4 rounded-0'>Bummer! Oh no, we weren't able to save changes made on this car make. Please try again, if the issue persists, please shoot us an email at <em>support@qruz.app</em> and we'll help you out.</p>
  }

  return (
    <div className="dialog-mask">
      <div className="dialog-wrapper dialog-md bg-white rounded-top rounded-bottom">
        <div className="dialog-container">
        
          <div id="dialog-header" className="bg-navy text-white px-4 py-4 rounded-top">
            <div className="row justify-content-between">
              <div className="col align-self-center">
                <h6 className="font-weight-bold mb-0">Update Car Make</h6>
              </div>
            </div>
          </div>
          <form encType="multipart/form-data"
            onSubmit={e => {
              e.preventDefault();
              updateCarMake({ variables: { 
                id: props.carMake.id,
                name: name
              } });
            }}>
            <div id="dialog-body" className="px-4 pt-4 pb-3">
              <div className="form-row">
                <div className="form-group col">
                  <label htmlFor="name">Car Make Name</label>
                  <input type="text" name="name" id="name" 
                    className="form-control" autoComplete="off" 
                    placeholder="e.g., Toyota, Nissan, Hyundai, etc." 
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                  />
                </div>
              </div>
            </div>
            {mutationFeedback}
            <div id="dialog-footer" className="px-4 pb-4">
              <button type="submit"
                className="btn btn-sm btn-outline-primary"
                disabled={btnDisabled}>{button}
              </button>
              <button type="button" className="btn btn-sm btn-outline-secondary ml-2"
                onClick={() => props.editModal(false)}>Dismiss</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default EditCarMake
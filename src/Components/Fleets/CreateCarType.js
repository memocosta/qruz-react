import React, { useState } from 'react'
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';

const GET_CAR_TYPES = gql`
  {
    carTypes {
      id
      name
    }
  }
`;

const CREATE_CAR_TYPE = gql`
  mutation CreateCarType(
    $name: String!
  ) {
    createCarType(
      input: {
        name: $name
      }
    ) {
      id
      name
    }
  }
`;

const CreateCarType = (props) => {
  const [name, setName] = useState('');

  const [
    createCarType,
    { loading: mutationLoading, error: mutationError },
  ] = useMutation(
    CREATE_CAR_TYPE,
    {
      update: (store, { data: { createCarType } }) => {
        const data = store.readQuery({ 
          query: GET_CAR_TYPES
         });

        data.carTypes.push(createCarType);

        store.writeQuery({ 
          query: GET_CAR_TYPES,
          data 
        });
      },
      onCompleted() {
        props.createModal(false)
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
    mutationFeedback = <p className='alert alert-danger mb-4 rounded-0'>Bummer! Oh no, we weren't able to create this car type. Please try again, if the issue persists, please shoot us an email at <em>support@qruz.app</em> and we'll help you out.</p>
  }
  return (
    <div className="dialog-mask">
      <div className="dialog-wrapper dialog-md bg-white rounded-top rounded-bottom">
        <div className="dialog-container">
        
          <div id="dialog-header" className="bg-navy text-white px-4 py-4 rounded-top">
            <div className="row justify-content-between">
              <div className="col align-self-center">
                <h6 className="font-weight-bold mb-0">Create New Car Type</h6>
              </div>
            </div>
          </div>
          <form encType="multipart/form-data"
            onSubmit={e => {
              e.preventDefault();
              createCarType({ variables: { 
                name: name
              } });
            }}>
            <div id="dialog-body" className="px-4 pt-4 pb-3">
              <div className="form-row">
                <div className="form-group col">
                  <label htmlFor="name">Car Type Name</label>
                  <input type="text" name="name" id="name" 
                    className="form-control" autoComplete="off" 
                    placeholder="e.g., VAN, Mini VAN, Mini Truck, Sedan, SUV, etc." 
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
                onClick={() => props.createModal(false)}>Dismiss</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CreateCarType
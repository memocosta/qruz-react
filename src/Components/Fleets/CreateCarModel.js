import React, { useState } from 'react'
import gql from 'graphql-tag';
import { useMutation, useQuery } from '@apollo/react-hooks';

const GET_CAR_MODELS = gql`
  query getCarModels($first: Int!, $page: Int, $field: String!, $order: SortOrder!) {
    carModels(first: $first, page: $page, orderBy: [
    {
      field: $field
      order: $order
    }
    ]) {
      data {
        id
        name
        make {
          id
          name
        }
      }
      paginatorInfo {
        currentPage
        lastPage
      }
    }
  }
`;

const CREATE_CAR_MODEL = gql`
  mutation CreateCarModel(
    $name: String!
    $carMakeID: ID!
  ) {
    createCarModel(
      input: {
        name: $name
        make_id: $carMakeID
      }
    ) {
      id
      name
      make {
        id
        name
      }
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

const CreateCarModel = (props) => {
  const [name, setName] = useState('');
  const [carMakeID, setCarMakeID] = useState('');

  const { loading, data } = useQuery(GET_CAR_MAKES);
  const [
    createCarModel,
    { loading: mutationLoading, error: mutationError },
  ] = useMutation(
    CREATE_CAR_MODEL,
    {
      update: (store, { data: { createCarModel } }) => {
        const data = store.readQuery({ 
          query: GET_CAR_MODELS,
          variables: { 
            first: props.perPage,
            page: props.page,
            field: props.sort,
            order: props.order
          },
        });

        data.carModels.data.push(createCarModel);

        store.writeQuery({ 
          query: GET_CAR_MODELS,
          variables: { 
            first: props.perPage,
            page: props.page,
            field: props.sort,
            order: props.order
          },
          data 
        });
      },
      onCompleted() {
        props.createModal(false)
      }
    }
  );

  let btnDisabled = true;
  if (name && carMakeID && !mutationLoading) btnDisabled = false;

  let button;
  if (mutationLoading) {
    button = "Saving.."
  } else {
    button = "Save"
  }

  let mutationFeedback;

  if (mutationError) {
    mutationFeedback = <p className='alert alert-danger mb-4 rounded-0'>Bummer! Oh no, we weren't able to create this car model. The chosen car model is not available. Please try again, if the issue persists, please shoot us an email at <em>support@qruz.app</em> and we'll help you out.</p>
  }
  return (
    <div className="dialog-mask">
      <div className="dialog-wrapper dialog-md bg-white rounded-top rounded-bottom">
        <div className="dialog-container">
        
          <div id="dialog-header" className="bg-navy text-white px-4 py-4 rounded-top">
            <div className="row justify-content-between">
              <div className="col align-self-center">
                <h6 className="font-weight-bold mb-0">Create New Car Model</h6>
              </div>
            </div>
          </div>
          <form encType="multipart/form-data"
            onSubmit={e => {
              e.preventDefault();
              createCarModel({ variables: { 
                name: name,
                carMakeID: carMakeID
              } });
            }}>
            <div id="dialog-body" className="px-4 pt-4 pb-3">
              <div className="form-row">
                <div className="form-group col-md-6">
                  <label htmlFor="carMake">Car Make</label>
                  <select name="carMake" id="carMake" 
                    className="form-control"
                    onChange={(e) => setCarMakeID(e.target.value)}
                    value={carMakeID} 
                    disabled={loading}>
                    <option value="">{loading ? "Loading makes" : "Select Make"}</option>
                    {data && data.carMakes && data.carMakes.map((carMake) => (
                      <option key={carMake.id} value={carMake.id}>{carMake.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group col-md-6">
                  <label htmlFor="name">Model Name</label>
                  <input type="text" name="name" id="name" 
                    className="form-control" autoComplete="off" 
                    placeholder="e.g., Hiace, Urvan, H-1, etc." 
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

export default CreateCarModel
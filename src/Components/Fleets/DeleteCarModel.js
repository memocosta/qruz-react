import React from 'react'
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';

const DELETE_CAR_MODEL = gql`
  mutation DeleteCarModel(
    $id: ID!
  ) {
    deleteCarModel(
      id: $id
    ) {
      id
    }
  }
`;

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

const DeleteCarModel = (props) => {
  const [
    deleteCarModel,
    { loading: mutationLoading },
  ] = useMutation(
    DELETE_CAR_MODEL,
    {
      update: (store) => {
        const data = store.readQuery({ 
          query: GET_CAR_MODELS,
          variables: { 
            first: props.perPage,
            page: props.page,
            field: props.sort,
            order: props.order
          }
        });   

        const newData = data.carModels.data.filter(model => model.id !== props.carModelID);
        const newDataObj = {
          carModels: {
            data: newData,
            paginatorInfo: data.carModels.paginatorInfo,
            __typename: "CarModelPaginator"
          }
        }

        store.writeQuery({ 
          query: GET_CAR_MODELS,
          variables: { 
            first: props.perPage,
            page: props.page,
            field: props.sort,
            order: props.order
          },
          data: newDataObj
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
              You are about to delete car model <strong>{props.carModelName}</strong>. No one will be able to access it ever again.
            </p>
            <p className="font-weight-bold mt-4">Are you absolutely positive?</p>
          </div>
          <div id="dialog-footer" className="px-4 pb-4 text-center">
            <button type="button"
              className="btn btn-lg btn-block btn-danger mb-2"
              onClick={() => {
                deleteCarModel({
                  variables: {
                    id: props.carModelID
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

export default DeleteCarModel
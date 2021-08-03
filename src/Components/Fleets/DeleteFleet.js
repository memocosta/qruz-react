import React from 'react'
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';

const DELETE_FLEET = gql`
  mutation DeleteFleet(
    $id: ID!
  ) {
    deleteFleet(
      id: $id
    ) {
      id
    }
  }
`;

const GET_FLEETS = gql`
  query getFleets($first: Int!, $page: Int, $field: String!, $order: SortOrder!) {
    fleets(first: $first, page: $page, orderBy: [
    {
      field: $field
      order: $order
    }
    ]) {
      data {
        id
        name
        phone
        email
        max_no_of_cars
        expires_on
      }
      paginatorInfo {
        currentPage
        lastPage
      }
    }
  }
`;

const DeleteFleet = (props) => {
  const [
    deleteFleet,
    { loading: mutationLoading },
  ] = useMutation(
    DELETE_FLEET,
    {
      update: (store) => {
        const data = store.readQuery({ 
          query: GET_FLEETS,
          variables: { 
            first: props.perPage,
            page: props.page,
            field: props.sort,
            order: props.order
          },
         });   

        const newData = data.fleets.data.filter(fleet => fleet.id !== props.fleetID);
        const newDataObj = {
          fleets: {
            data: newData,
            paginatorInfo: data.fleets.paginatorInfo,
            __typename: "FleetPaginator"
          }
        }

        store.writeQuery({ 
          query: GET_FLEETS, 
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
              You are about to delete <strong>{props.fleetName}</strong> fleet. No one will be able to access it ever again.
            </p>
            <p className="font-weight-bold mt-4">Are you absolutely positive?</p>
          </div>
          <div id="dialog-footer" className="px-4 pb-4 text-center">
            <button type="button"
              className="btn btn-lg btn-block btn-danger mb-2"
              onClick={() => {
                deleteFleet({
                  variables: {
                    id: props.fleetID
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

export default DeleteFleet
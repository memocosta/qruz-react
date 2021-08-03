import React from 'react'
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';

const DELETE_DRIVER = gql`
  mutation DeleteDriver(
    $id: ID!
  ) {
    deleteDriver(
      id: $id
    ) {
      id
    }
  }
`;

const GET_FLEET_DRIVERS = gql`
  query getFleetDrivers($fleetID: ID!, $first: Int!, $page: Int, $field: String!, $order: SortOrder!) {
    fleetDrivers(fleet_id: $fleetID, first: $first, page: $page, orderBy: [
    {
      field: $field
      order: $order
    }
    ]) {
      data {
        id
        name
        email
        phone
        license_expires_on
      }
      paginatorInfo {
        currentPage
        lastPage
      }
    }
  }
`;

const DeleteDriver = (props) => {
  const [
    deleteDriver,
    { loading: mutationLoading },
  ] = useMutation(
    DELETE_DRIVER,
    {
      update: (store) => {
        const data = store.readQuery({ 
          query: GET_FLEET_DRIVERS,
          variables: { 
            fleetID: props.fleetID,
            first: props.perPage,
            page: props.page,
            field: props.sort,
            order: props.order
          },
        });   

        const newData = data.fleetDrivers.data.filter(driver => driver.id !== props.driverID);
        const newDataObj = {
          fleetDrivers: {
            data: newData,
            paginatorInfo: data.fleetDrivers.paginatorInfo,
            __typename: "FleetDriverPaginator"
          }
        }

        store.writeQuery({ 
          query: GET_FLEET_DRIVERS,
          variables: { 
            fleetID: props.fleetID,
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
              You are about to delete driver <strong>{props.driverName}</strong>. No one will be able to access it ever again.
            </p>
            <p className="font-weight-bold mt-4">Are you absolutely positive?</p>
          </div>
          <div id="dialog-footer" className="px-4 pb-4 text-center">
            <button type="button"
              className="btn btn-lg btn-block btn-danger mb-2"
              onClick={() => {
                deleteDriver({
                  variables: {
                    id: props.driverID
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

export default DeleteDriver
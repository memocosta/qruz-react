import React from 'react'
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';

const DELETE_VEHICLE = gql`
  mutation DeleteVehicle(
    $id: ID!
  ) {
    deleteVehicle(
      id: $id
    ) {
      id
    }
  }
`;

const GET_VEHICLES = gql`
  query getVehicles($first: Int!, $page: Int, $field: String!, $order: SortOrder!) {
    vehicles(first: $first, page: $page, orderBy: [
    {
      field: $field
      order: $order
    }
    ]) {
      data {
        id
        license_plate
        license_expires_on
        year
        make {
          id
          name
        }
        model {
          id
          name
        }
        type {
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

const DeleteVehicle = (props) => {
  const [
    deleteVehicle,
    { loading: mutationLoading },
  ] = useMutation(
    DELETE_VEHICLE,
    {
      update: (store) => {
        const data = store.readQuery({ 
          query: GET_VEHICLES,
          variables: { 
            first: props.perPage,
            page: props.page,
            field: props.sort,
            order: props.order
          },
        });  

        const newData = data.vehicles.data.filter(vehicle => vehicle.id !== props.vehicleID);
        const newDataObj = {
          vehicles: {
            data: newData,
            paginatorInfo: data.vehicles.paginatorInfo,
            __typename: "VehiclePaginator"
          }
        }

        store.writeQuery({ 
          query: GET_VEHICLES,
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
              You are about to delete vehicle <strong>{props.vehicleName}</strong>. No one will be able to access it ever again.
            </p>
            <p className="font-weight-bold mt-4">Are you absolutely positive?</p>
          </div>
          <div id="dialog-footer" className="px-4 pb-4 text-center">
            <button type="button"
              className="btn btn-lg btn-block btn-danger mb-2"
              onClick={() => {
                deleteVehicle({
                  variables: {
                    id: props.vehicleID
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

export default DeleteVehicle
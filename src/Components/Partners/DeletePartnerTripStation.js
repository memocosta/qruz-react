import React from 'react'
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';

const DELETE_PARTNER_TRIP_STATION = gql`
  mutation DeletePartnerTripStation(
    $id: ID!
  ) {
    deletePartnerTripStation(
      id: $id
    ) {
      id
    }
  }
`;

const GET_PARTNER_TRIP_STATIONS = gql`
  query getPartnerTripStations($tripID: ID!) {
    partnerTripStations(trip_id: $tripID) {
      id
      name
      latitude
      longitude
      state
      time_from_start
      created_by {
        id
        name
        avatar
      }
    }
  }
`;

const DeletePartnerTripStation = (props) => {
  const [
    deletePartnerTripStation,
    { loading: mutationLoading },
  ] = useMutation(
    DELETE_PARTNER_TRIP_STATION,
    {
      update: (store) => {
        const data = store.readQuery({ 
          query: GET_PARTNER_TRIP_STATIONS,
          variables: { tripID: props.tripID }
        });   
        const newData = data.partnerTripStations.filter(station => station.id !== props.station.id);
        store.writeQuery({ 
          query: GET_PARTNER_TRIP_STATIONS,
          variables: { tripID: props.tripID }, 
          data: {partnerTripStations: newData}
        });
      },
      onCompleted() {
        props.stationEdited(true);
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
    <div>
      <div>
        <p className="text-muted">
          You are about to delete <strong>{props.station.name}</strong> station. No one will be able to access this station ever again.
        </p>
        <p className="font-weight-bold">Are you absolutely positive?</p>
      </div>
      <div>
        <button type="button"
          className="btn btn-sm btn-outline-danger"
          onClick={() => {
            deletePartnerTripStation({
              variables: {
                id: props.station.id
              }
            }); 
          }}
          disabled={btnDisabled}>{buttonText}
        </button>
      </div>
    </div>
  )
}
 
export default DeletePartnerTripStation
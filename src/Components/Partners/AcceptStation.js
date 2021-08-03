import React from 'react'
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';

const ACCEPT_PARTNER_TRIP_STATION = gql`
  mutation AcceptPartnerTripStation(
    $tripID: ID!
    $stationID: ID!
  ) {
    acceptPartnerTripStation(
      input: {
        trip_id: $tripID
        station_id: $stationID
      }
    ) {
      id
      name
      latitude
      longitude
      state
      created_by {
        id
        name
        avatar
      }
    }
  }
`;

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
      created_by {
        id
        name
        avatar
      }
    }
  }
`;

const AcceptStation = (props) => {

  const [ 
    acceptPartnerTripStation,
    {loading: acceptMutationLoading}
  ] = useMutation(
    ACCEPT_PARTNER_TRIP_STATION, 
    {
      onCompleted() {
        props.stationEdited(true);
        props.acceptStationModal(false);
      }
    }
  );

  const [
    deletePartnerTripStation,
    { loading: deleteMutationLoading },
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
        props.acceptStationModal(false);
      }
    }
  );

  let deleteBtnDisabled = false;
  let deleteButtonText;
  if (deleteMutationLoading) {
    deleteButtonText = "Rejecting..."
    deleteBtnDisabled = true
  } else {
    deleteButtonText = "No, Reject it"
  }

  let acceptBtnDisabled = false;
  let acceptButtonText;
  if (acceptMutationLoading) {
    acceptButtonText = "Accepting..."
    acceptBtnDisabled = true
  } else {
    acceptButtonText = "Yes, Accept it"
  }
  
  return (
    <div className="dialog-mask">
      <div className="dialog-wrapper dialog-sm bg-white rounded-top rounded-bottom">
        <div className="dialog-container">
          <div id="dialog-header" className="bg-gradient px-4 py-1 rounded-top"></div>
          <div id="dialog-body" className="px-4 pt-4">
            <div className="text-center mb-3">
              {props.station.created_by && props.station.created_by.avatar &&
                <div className="image-cover image-cover-lg rounded-circle " 
                  style={{ backgroundImage: "url("+props.station.created_by.avatar+")"}}
                ></div>
              }
              {!props.station.created_by &&
                <span className="placeholder rounded-circle placeholder-lg bg-teal text-white">
                  {props.station.created_by.name.substring(0,2).toUpperCase()}
                </span>
              }
            </div>
            <h6 className="font-weight-bold text-center my-3">New Station Request</h6>
            <p className="text-muted">
              This station has been submitted by <strong>{props.station.created_by.name}</strong> to be taken into account on the future.
            </p>
            <p className="font-weight-bold my-3">Are you willing to accept this station now?</p>
            <div className="text-center">
              <button type="button"
                className="btn btn-lg btn-block btn-success mb-3"
                onClick={() => {
                  acceptPartnerTripStation({
                    variables: {
                      tripID: props.tripID,
                      stationID: props.station.id
                    }
                  });
                }}
                disabled={acceptBtnDisabled}>{acceptButtonText}
              </button>
              <button type="button"
                className="btn btn-sm btn-outline-danger"
                onClick={() => {
                  deletePartnerTripStation({
                    variables: {
                      id: props.station.id
                    }
                  }); 
                }}
                disabled={deleteBtnDisabled}>{deleteButtonText}
              </button>
            </div>
          </div>
          <div id="dialog-footer" className="px-4 py-4 text-center">
            <small className="text-muted mr-2">You are uncertain! Simply</small>
            <button type="button" className="btn btn-sm btn-light"
              onClick={() => props.acceptStationModal(false)}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AcceptStation
import React from 'react'
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';

const DELETE_PARTNER_TRIP = gql`
  mutation DeletePartnerTrip(
    $id: ID!
  ) {
    deletePartnerTrip(
      id: $id
    ) {
      id
    }
  }
`;

const GET_PARTNER_TRIPS = gql`
  query getPartnerTrips($partner_id: ID!) {
    partnerTrips(partner_id: $partner_id) {
      id
      name
      ride_car_share
      subscription_code
      start_date
      end_date
      return_time
      schedule {
        saturday
        sunday
        monday
        tuesday
        wednesday
        thursday
        friday
      }
      driver {
        id
        name
      }
      vehicle {
        id
      }
    }
  }
`;

const DeletePartnerTrip = (props) => {
  const [
    deletePartnerTrip,
    { loading: mutationLoading },
  ] = useMutation(
    DELETE_PARTNER_TRIP,
    {
      update: (store) => {
        const data = store.readQuery({ 
          query: GET_PARTNER_TRIPS,
          variables: { partner_id: props.partnerID}
        });   

        const newData = data.partnerTrips.filter(trip => trip.id !== props.tripID);

        store.writeQuery({ 
          query: GET_PARTNER_TRIPS,
          variables: { partner_id: props.partnerID}, 
          data: {partnerTrips: newData}
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
              You are about to delete <strong>{props.tripName}</strong> trip. No one will be able to access this trip ever again.
            </p>
            <p className="font-weight-bold mt-4">Are you absolutely positive?</p>
          </div>
          <div id="dialog-footer" className="px-4 pb-4 text-center">
            <button type="button"
              className="btn btn-lg btn-block btn-danger mb-2"
              onClick={() => {
                deletePartnerTrip({
                  variables: {
                    id: props.tripID
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
 
export default DeletePartnerTrip
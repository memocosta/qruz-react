import React, { useState } from 'react'
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';

const EDIT_PARTNER_TRIP_STATION = gql`
  mutation EditPartnerTripStation(
    $id: ID!
    $name: String
    $state: String
    $timeFromStart: String
  ) {
    updatePartnerTripStation(
      input: {
        id: $id
        name: $name
        state: $state
        time_from_start: $timeFromStart
      }
    ) {
      id
      name
      latitude
      longitude
      state
      time_from_start
    }
  }
`;

const EditPartnerTripStation = (props) => {
  const tfs = props.station.time_from_start ? props.station.time_from_start.split(':') : ''
  const [name, setName] = useState(props.station.name);
  const [stationState, setStationState] = useState(props.station.state || '');
  const [hourFromStart, setHourFromStart] = useState(parseInt(tfs[0]) || '00');
  const [minuteFromStart, setMinuteFromStart] = useState(parseInt(tfs[1]) || '00');

  const endStation = props.stations.find(station => station.state === "END");
  
  const [
    updatePartnerTripStation,
    { loading: mutationLoading, error: mutationError },
  ] = useMutation(EDIT_PARTNER_TRIP_STATION,
    {
      onCompleted() {
        props.stationEdited(true);
      }
    }
  );

  const canSelectEnd = () => {
    if (endStation && stationState === "END" && endStation.id !== props.station.id) {
      return false
    }
    return true
  }  

  let btnDisabled = true;
  if (name && stationState && canSelectEnd() && !mutationLoading) btnDisabled = false;

  let button;
  if (mutationLoading) {
    button = "Saving.."
  } else {
    button = "Save"
  }

  let mutationFeedback;
  if (mutationError) {
    mutationFeedback = <p className='alert alert-danger mb-4 rounded-0'>Bummer! Oh no, we weren't able to save changes made on this station. Please try again, if the issue persists, kindly shoot us an email at <em>support@qruz.app</em> and we'll help you out.</p>
  }

  const hours = [];
  const minutes = [];
  for (let i = 1; i <= 12; i++) { hours.push(i) }
  for (let i = 1; i <= 60; i++) { minutes.push(i) }

  return (
    <div>
      <form encType="multipart/form-data"
        onSubmit={e => {
          e.preventDefault();
          updatePartnerTripStation({ variables: { 
            id: props.station.id,
            name: name,
            state: stationState,
            timeFromStart: hourFromStart + ":" + minuteFromStart
          } });
        }}
        >
        <div className="form-row">
          <div className="form-group col-7">
            <label htmlFor="size">Station Name</label>
            <input type="text" 
              name="name" id="name" 
              className="form-control" autoComplete="off" 
              placeholder="Station Name"
              onChange={(e) => setName(e.target.value)}
              value={name} 
            />
            <small className="form-text text-muted">
              Kindly make sure to choose a descriptive name.
            </small>
          </div>
          <div className="form-group col-5">
            <label htmlFor="size">Station State</label>
            <select name="stationState" 
              id="stationState" className="form-control"
              onChange={(e) => setStationState(e.target.value)}
              value={stationState}
            >
              <option value="">Select One</option>
              <option value="PICKABLE">Pickable Station</option>
              <option value="END">End Station</option>
            </select>
            {!canSelectEnd() &&
              <small className="form-text text-danger">
                There is already an end stattion.
              </small>
            }
          </div>
        </div>
        <div className="form-row">
          <p className="mb-2 ml-1 font-weight-custom">
            Time From Start
          </p>
        </div>
        <div className="form-row mb-2">
          <div className="form-group col-4 col-md-3 col-lg-2">
            <select name="hourFromStart" id="hourFromStart" 
              className="form-control"
              onChange={(e) => setHourFromStart(e.target.value)}
              value={hourFromStart}
            >
              <option value="00">Hour</option>
              {hours.map((hour) => (
                <option key={hour} value={hour}>{hour}</option>
              ))}
            </select>
          </div>
          <div className="form-group col-4 col-md-3 col-lg-2">
            <select name="minuteFromStart" id="minuteFromStart" 
              className="form-control"
              onChange={(e) => setMinuteFromStart(e.target.value)}
              value={minuteFromStart}
            >
              <option value="00">Minute</option>
              {minutes.map((minute) => (
                <option key={minute} value={minute}>{minute}</option>
              ))}
            </select>
          </div>
        </div>
        {mutationFeedback}
        <div>
          <button type="submit"
            className="btn btn-sm btn-outline-primary"
            disabled={btnDisabled}>{button}
          </button>
        </div>
      </form>
    </div>
  )
}

export default EditPartnerTripStation
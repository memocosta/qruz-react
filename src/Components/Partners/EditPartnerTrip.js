import React, { useState } from 'react'
import gql from 'graphql-tag';
import { useMutation, useQuery, useLazyQuery } from '@apollo/react-hooks';

const EDIT_TRIP = gql`
  mutation EditPartnerTrip(
    $id: ID!
    $name: String!
    $driverID: ID!
    $vehicleID: ID!
    $startDate: Date!
    $endDate: Date!
    $returnTime: String
    $saturday: String
    $sunday: String
    $monday: String
    $tuesday: String
    $wednesday: String
    $thursday: String
    $friday: String
  ) {
    updatePartnerTrip(
      input: {
        id: $id
        name: $name
        driver_id: $driverID
        vehicle_id: $vehicleID
        start_date: $startDate
        end_date: $endDate
        return_time: $returnTime
        saturday: $saturday
        sunday: $sunday
        monday: $monday
        tuesday: $tuesday
        wednesday: $wednesday
        thursday: $thursday
        friday: $friday
      }
    ) {
      id
      name
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

const GET_PARTNER_DRIVERS = gql`
  query getPartnerDrivers($partnerID: ID!, $assigned: Boolean!) {
    partnerDrivers(partner_id: $partnerID, assigned: $assigned) {
      id
      name
    }
  }
`;

const GET_DRIVER_VEHICLES = gql`
  query getDriverVehicles($driverID: ID!, $assigned: Boolean!, $first: Int!, $page: Int) {
    driverVehicles(driver_id: $driverID, assigned: $assigned, first: $first, page: $page) {
      data {
        id
        make {
          id
          name
        }
        model {
          id 
          name
        }
      }
    }
  }
`;

const EditPartnerTrip = (props) => {
  const [name, setName] = useState(props.trip.name);
  const [driverID, setDriverID] = useState(props.trip.driver.id);
  const [vehicleID, setVehicleID] = useState(props.trip.vehicle.id);
  const [hasReturn, setHasReturn] = useState(props.trip.return_time ? true : false);
  const [saturday, setSaturday] = useState(props.trip.schedule.saturday ? true : false);
  const [sunday, setSunday] = useState(props.trip.schedule.sunday ? true : false);
  const [monday, setMonday] = useState(props.trip.schedule.monday ? true : false);
  const [tuesday, setTuesday] = useState(props.trip.schedule.tuesday ? true : false);
  const [wednesday, setWednesday] = useState(props.trip.schedule.wednesday ? true : false);
  const [thursday, setThursday] = useState(props.trip.schedule.thursday ? true : false);
  const [friday, setFriday] = useState(props.trip.schedule.friday ? true : false);
  const [returnTime, setReturnTime] = useState(props.trip.return_time || '');
  const [startDate, setStartDate] = useState(props.trip.start_date || '');
  const [endDate, setEndDate] = useState(props.trip.end_date || '');
  const [saturdayTime, setSaturdayTime] = useState(props.trip.schedule.saturday || '');
  const [sundayTime, setSundayTime] = useState(props.trip.schedule.sunday || '');
  const [mondayTime, setMondayTime] = useState(props.trip.schedule.monday || '');
  const [tuesdayTime, setTuesdayTime] = useState(props.trip.schedule.tuesday || '');
  const [wednesdayTime, setWednesdayTime] = useState(props.trip.schedule.wednesday || '');
  const [thursdayTime, setThursdayTime] = useState(props.trip.schedule.thursday || '');
  const [fridayTime, setFridayTime] = useState(props.trip.schedule.friday || '');

  const { loading, data } = useQuery(GET_PARTNER_DRIVERS, {
    variables: { 
      partnerID: props.partnerID,
      assigned: true
    },
    onCompleted() {
      getDriverVehicles()
    }
  });

  const [
    updatePartnerTrip,
    { loading: mutationLoading, error: mutationError },
  ] = useMutation(
    EDIT_TRIP,
    {
      onCompleted() {
        props.editModal(false)
      }
    }
  );

  const [
    getDriverVehicles,
    { loading: getDriverVehiclesLoading, data: getDriverVehiclesData },
  ] = useLazyQuery(GET_DRIVER_VEHICLES, {
    variables: { 
      driverID: driverID,
      assigned: true,
      first: 100,
      page: 1
    }
  });

  let btnDisabled = true;
  if (name && driverID && vehicleID && !mutationLoading) {
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
    mutationFeedback = <p className='alert alert-danger mb-4 rounded-0'>Bummer! Oh no, we weren't able to create this trip. Please try again, if the issue persists, kindly shoot us an email at <em>support@qruz.app</em> and we'll help you out.</p>
  }

  return (
    <div className="dialog-mask">
      <div className="dialog-wrapper dialog-md bg-white rounded-top rounded-bottom">
        <div className="dialog-container">
        
          <div id="dialog-header" className="bg-gradient text-white px-4 py-4 rounded-top">
            <div className="row justify-content-between">
              <div className="col align-self-center">
                <h6 className="font-weight-bold mb-0">Edit Trip</h6>
              </div>
            </div>
          </div>
          <form encType="multipart/form-data"
            onSubmit={e => {
              e.preventDefault();
              updatePartnerTrip({ variables: { 
                id: props.trip.id,
                name: name,
                driverID: driverID,
                vehicleID: vehicleID,
                startDate: startDate,
                endDate: endDate,
                returnTime: returnTime,
                saturday: (saturday ? saturdayTime : null),
                sunday: (sunday ? sundayTime : null),
                monday: (monday ? mondayTime : null),
                tuesday: (tuesday ? tuesdayTime : null),
                wednesday: (wednesday ? wednesdayTime : null),
                thursday: (thursday ? thursdayTime : null),
                friday: (friday ? fridayTime : null)
              } });
            }}
            >
            <div id="dialog-body" className="px-4 pt-4 pb-3">
              <div className="form-row mb-2">
                <div className="form-group col-md-4">
                  <label htmlFor="tripName">Trip Name</label>
                  <input type="text" 
                    name="tripName" id="tripName" 
                    className="form-control" autoComplete="off" 
                    placeholder="Trip Name"
                    onChange={(e) => setName(e.target.value)}
                    value={name} 
                  />
                </div>
                <div className="form-group col-md-4">
                  <label htmlFor="driver">Driver</label>
                  <select name="driver" id="driver" 
                    className="form-control"
                    onChange={(e) => {
                      setDriverID(e.target.value)
                      getDriverVehicles();
                    }}
                    value={driverID} 
                    disabled={loading}>
                    <option value="">{loading ? "Loading drivers" : "Select driver"}</option>
                    {data && data.partnerDrivers && data.partnerDrivers.map((driver) => (
                      <option key={driver.id} value={driver.id}>{driver.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group col-md-4">
                  <label htmlFor="driver">Vehicle</label>
                  <select name="vehicle" id="vehicle" 
                    className="form-control"
                    onChange={(e) => setVehicleID(e.target.value)}
                    value={vehicleID} 
                    disabled={getDriverVehiclesLoading}>
                    <option value="">{getDriverVehiclesLoading ? "Loading vehicles" : "Select vehicle"}</option>
                    {getDriverVehiclesData && getDriverVehiclesData.driverVehicles.data && getDriverVehiclesData.driverVehicles.data.map((vehicle) => (
                      <option key={vehicle.id} value={vehicle.id}>{vehicle.make.name + ' ' + vehicle.model.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group col-md-4">
                  <label htmlFor="start_date">Start Date</label>
                  <input type="date" name="start_date" id="start_date" 
                    className="form-control" autoComplete="off"
                    onChange={(e) => setStartDate(e.target.value)}
                    value={startDate} />
                </div>
                <div className="form-group col-md-4">
                  <label htmlFor="end_date">End Date</label>
                  <input type="date" name="end_date" id="end_date" 
                    className="form-control" autoComplete="off"
                    onChange={(e) => setEndDate(e.target.value)}
                    value={endDate} />
                </div>
              </div>
              <div className="form-row pl-1">
                <p className="font-weight-bold mb-3">
                  Work Days and Trip Time
                </p>
              </div>
              <table className="table">
                <tbody>
                  <tr>
                    <td>
                      <div className="custom-control custom-switch">
                        <input type="checkbox" 
                          className="custom-control-input" 
                          id="saturday"
                          onChange={() => setSaturday(!saturday)}
                          value={saturday}
                          checked={saturday} />
                        <label className="custom-control-label" htmlFor="saturday">
                        Saturday
                        </label>
                      </div>
                    </td>
                    <td>
                      <input type="time" name="saturdayTime" id="saturdayTime" 
                        className="form-control" autoComplete="off"
                        onChange={(e) => setSaturdayTime(e.target.value)}
                        value={saturdayTime} disabled={!saturday} 
                      />
                    </td>
                    <td>
                      <div className="custom-control custom-switch">
                        <input type="checkbox" 
                          className="custom-control-input" 
                          id="sunday"
                          onChange={() => setSunday(!sunday)}
                          value={sunday}
                          checked={sunday} 
                        />
                        <label className="custom-control-label" htmlFor="sunday">
                        Sunday
                        </label>
                      </div>
                    </td>
                    <td>
                      <input type="time" name="sundayTime" id="sundayTime" 
                        className="form-control" autoComplete="off"
                        onChange={(e) => setSundayTime(e.target.value)}
                        value={sundayTime} disabled={!sunday}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className="custom-control custom-switch">
                        <input type="checkbox" 
                          className="custom-control-input" 
                          id="monday"
                          onChange={() => setMonday(!monday)}
                          value={monday}
                          checked={monday} 
                        />
                        <label className="custom-control-label" htmlFor="monday">
                        Monday
                        </label>
                      </div>
                    </td>
                    <td>
                      <input type="time" name="mondayTime" id="mondayTime" 
                        className="form-control" autoComplete="off"
                        onChange={(e) => setMondayTime(e.target.value)}
                        value={mondayTime} disabled={!monday}
                      />
                    </td>
                    <td>
                      <div className="custom-control custom-switch">
                        <input type="checkbox" 
                          className="custom-control-input" 
                          id="tuesday"
                          onChange={() => setTuesday(!tuesday)}
                          value={tuesday}
                          checked={tuesday} 
                        />
                        <label className="custom-control-label" htmlFor="tuesday">
                        Tuesday
                        </label>
                      </div>
                    </td>
                    <td>
                      <input type="time" name="tuesdayTime" id="tuesdayTime" 
                        className="form-control" autoComplete="off"
                        onChange={(e) => setTuesdayTime(e.target.value)}
                        value={tuesdayTime} disabled={!tuesday}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className="custom-control custom-switch">
                        <input type="checkbox" 
                          className="custom-control-input" 
                          id="wednesday"
                          onChange={() => setWednesday(!wednesday)}
                          value={wednesday}
                          checked={wednesday} 
                        />
                        <label className="custom-control-label" htmlFor="wednesday">
                        Wednesday
                        </label>
                      </div>
                    </td>
                    <td>
                      <input type="time" name="wednesdayTime" id="wednesdayTime" 
                        className="form-control" autoComplete="off"
                        onChange={(e) => setWednesdayTime(e.target.value)}
                        value={wednesdayTime} disabled={!wednesday}
                      />
                    </td>
                    <td>
                      <div className="custom-control custom-switch">
                        <input type="checkbox" 
                          className="custom-control-input" 
                          id="thursday"
                          onChange={() => setThursday(!thursday)}
                          value={thursday}
                          checked={thursday} 
                        />
                        <label className="custom-control-label" htmlFor="thursday">
                        Thursday
                        </label>
                      </div>
                    </td>
                    <td>
                      <input type="time" name="thursdayTime" id="thursdayTime" 
                        className="form-control" autoComplete="off"
                        onChange={(e) => setThursdayTime(e.target.value)}
                        value={thursdayTime} disabled={!thursday}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className="custom-control custom-switch">
                        <input type="checkbox" 
                          className="custom-control-input" 
                          id="friday"
                          onChange={() => setFriday(!friday)}
                          value={friday}
                          checked={friday} 
                        />
                        <label className="custom-control-label" htmlFor="friday">
                        Friday
                        </label>
                      </div>
                    </td>
                    <td>
                      <input type="time" name="fridayTime" id="fridayTime" 
                        className="form-control" autoComplete="off"
                        onChange={(e) => setFridayTime(e.target.value)}
                        value={fridayTime} disabled={!friday}
                      />
                    </td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>
                      <div className="custom-control custom-switch">
                        <input type="checkbox" 
                          className="custom-control-input" 
                          id="hasReturn"
                          onChange={() => setHasReturn(!hasReturn)}
                          value={hasReturn}
                          checked={hasReturn} 
                        />
                        <label className="custom-control-label" htmlFor="hasReturn">
                        Has return
                        </label>
                      </div>
                    </td>
                    <td>
                      <input type="time" name="returnTime" id="returnTime" 
                        className="form-control" autoComplete="off"
                        onChange={(e) => setReturnTime(e.target.value)}
                        value={returnTime} disabled={!hasReturn}
                      />
                    </td>
                    <td></td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>
            {mutationFeedback}
            <div id="dialog-footer" className="px-4 pb-4">
              <button type="submit"
                className="btn btn-sm btn-outline-primary"
                disabled={btnDisabled}>{button}
              </button>
              <button type="button" className="btn btn-sm btn-outline-secondary ml-2"
                onClick={() => props.editModal(false)}>Dismiss</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default EditPartnerTrip
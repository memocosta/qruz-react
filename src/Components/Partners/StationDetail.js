import React, { useState } from 'react'
import EditPartnerTripStation from './EditPartnerTripStation'
import DeletePartnerTripStation from './DeletePartnerTripStation'
import PartnerTripStationUsers from './PartnerTripStationUsers'

const StationDetail = (props) => {
  const [view, setView] = useState('edit');

  return (
    <div className="dialog-mask">
      <div className="dialog-wrapper dialog-md bg-white rounded-top rounded-bottom">
        <div className="dialog-container">
          <div id="dialog-header" className="bg-gradient text-white px-4 py-4 rounded-top">
            <div className="row justify-content-between">
              <div className="col align-self-center">
                <h5 className="font-weight-bold mb-0">{props.stationName} Station</h5>
              </div>
            </div>
          </div>
          <div id="dialog-body" className="px-4 py-4">
            <ul className="nav nav-pills fadeInUp py-1" id="pills-tab" role="tablist">
              <li className="nav-item">
                <span onClick={() => setView('edit')} className={"nav-link clickable" + (view === "edit" ? " active" : "")}>Edit Station</span>
              </li>
              {props.stationState !== "END" &&
                <li className="nav-item">
                  <span onClick={() => setView('subbedUsers')} className={"nav-link clickable" + (view === "subbedUsers" ? " active" : "")}>Subscribed Users</span>
                </li>
              }
              <li className="nav-item">
                <span onClick={() => setView('dangerZone')} className={"nav-link clickable" + (view === "dangerZone" ? " active bg-danger" : "")}>Danger Zone</span>
              </li>
            </ul>
            <div className="mt-4">
              {view === 'edit' &&
                <EditPartnerTripStation 
                  station={props.station}
                  stationEdited={props.stationEdited}
                  stations={props.stations}
                />
              }
              {view === 'subbedUsers' &&
                <PartnerTripStationUsers stationID={props.station.id} />
              }
              {view === 'dangerZone' &&
                <DeletePartnerTripStation 
                  tripID={props.tripID}
                  station={props.station}
                  stationEdited={props.stationEdited}
                />
              }
            </div>
          </div>
          <div id="dialog-footer" className="px-4 pb-4 text-right">
            <button type="button" className="btn btn-light"
              onClick={() => props.detailModal(false)}>Dismiss</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StationDetail
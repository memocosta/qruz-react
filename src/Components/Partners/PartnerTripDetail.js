import React, {useState} from 'react'
import { Link } from 'react-router-dom'
import gql from 'graphql-tag'
import { useQuery } from '@apollo/react-hooks'
import PartnerTripSubbedUsers from './PartnerTripSubbedUsers'
import PartnerTripNotSubbedUsers from './PartnerTripNotSubbedUsers'
import PartnerTripNotVerifiedUsers from './PartnerTripNotVerifiedUsers'
import PartnerTripStations from './PartnerTripStations'

const GET_PARTNER_TRIP = gql`
  query getPartnerTrip($id: ID!) {
    trip(id: $id) {
      name
      subscription_code
      partner {
        name
      }
      vehicle {
        photo
      }
    }
  }
`; 

const BUSINESS = gql`{ businessPerm @client }`;
const PARTNER_ID = gql`{ partnerID @client }`;

const PartnerTripDetail = (props) => {
  const [view, setView] = useState('stations');

  const { data: business } = useQuery(BUSINESS)
  const { data: partner } = useQuery(PARTNER_ID)
  
  const { loading, error, data } = useQuery(GET_PARTNER_TRIP, {
    variables: { id: props.match.params.tripID}
  });

  if (business && !business.businessPerm && !partner.partnerID) return <p className='alert alert-warning fadeInUp'><strong>Bummer!</strong> You are not authorized to access this feature. If you have an issues or need to report a bug, shoot us an email at <em>support@qruz.app</em> and we'll help you out.</p>; 

  if (loading) return <div className="spinner spinner-dark"></div>;
  if (error) return <p className="alert alert-danger">Error! Something went wrong.</p>;

  return (
    <div>
      <div className="card border-0 mb-4">
        <div className="card-body">
          <div className="row">
            <div className="col-auto">
              {data.trip.vehicle.photo &&
                <div className="image-cover image-cover-lg rounded" 
                  style={{ backgroundImage: "url("+data.trip.vehicle.photo+")"}}
                ></div>
              }
              {!data.trip.vehicle.photo &&
                <span className="placeholder rounded placeholder-lg bg-teal text-white">
                  {data.trip.partner.name.substring(0,2).toUpperCase()}
                </span>
              }
            </div>
            <div className="col align-self-center">
              <p className="mb-1 text-muted">{ data.trip.partner.name }</p>
              <h4 className="mb-1">
                <span className="font-weight-bold">{data.trip.name}</span> <span className="text-muted">trip</span>
              </h4>
              <p className="text-muted">{data.trip.subscription_code}</p>
              <div className="mt-4">
                <ul className="nav nav-pills" id="pills-tab" role="tablist">
                  {!partner.partnerID &&
                    <li className="nav-item">
                      <Link to={`/business/partners/${props.match.params.partnerID}/view`} className="nav-link">Back to Partner View</Link>
                    </li>
                  }
                  <li className="nav-item">
                    <span onClick={() => setView('stations')} className={"nav-link clickable" + (view === "stations" ? " active" : "")}>Stations</span>
                  </li>
                  <li className="nav-item">
                    <span onClick={() => setView('subbedUsers')} className={"nav-link clickable" + (view === "subbedUsers" ? " active" : "")}>Subbed Users</span>
                  </li>
                  <li className="nav-item">
                    <span onClick={() => setView('notVerifiedUsers')} className={"nav-link clickable" + (view === "notVerifiedUsers" ? " active" : "")}>Pending Subbs</span>
                  </li>
                  <li className="nav-item">
                    <span onClick={() => setView('notSubbedUsers')} className={"nav-link clickable" + (view === "notSubbedUsers" ? " active" : "")}>Not Subbed Users</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      {view === 'subbedUsers' &&
        <PartnerTripSubbedUsers partnerID={props.match.params.partnerID} tripID={props.match.params.tripID} />
      }
      {view === 'notSubbedUsers' &&
        <PartnerTripNotSubbedUsers partnerID={props.match.params.partnerID} tripID={props.match.params.tripID} subscriptionCode={data.trip.subscription_code} />
      }
      {view === 'notVerifiedUsers' &&
        <PartnerTripNotVerifiedUsers partnerID={props.match.params.partnerID} tripID={props.match.params.tripID} />
      }
      {view === 'stations' &&
        <PartnerTripStations tripID={props.match.params.tripID} />
      }
      </div>
    )
  }

export default PartnerTripDetail
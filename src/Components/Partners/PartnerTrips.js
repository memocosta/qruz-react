import React, {useState} from 'react'
import { Link } from 'react-router-dom'
import gql from 'graphql-tag'
import { useQuery } from '@apollo/react-hooks'
import CreatePartnerTrip from './CreatePartnerTrip'
import EditPartnerTrip from './EditPartnerTrip'
import DeletePartnerTrip from './DeletePartnerTrip'

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
        photo
      }
    }
  } 
`;

const PARTNER_ID = gql`{ partnerID @client }`;
const BUSINESS = gql`{ businessPerm @client }`;

const PartnerTrips = (props) => {
  const [createPartnerTripModal, setCreatePartnerTripModal] = useState(false);
  const [editTripID, setEditTripID] = useState('');
  const [deletePartnerTripID, setDeletePartnerTripID] = useState('');
  const [editPartnerTripModal, setEditPartnerTripModal] = useState(false);
  const [deletePartnerTripModal, setDeletePartnerTripModal] = useState(false);
  const [filterStr, setFilterStr] = useState('');

  const { data: business } = useQuery(BUSINESS)
  const { data: partner } = useQuery(PARTNER_ID)

  const { loading, error, data } = useQuery(GET_PARTNER_TRIPS, {
    variables: { 
      partner_id: partner.partnerID ? partner.partnerID : props.partnerID
    }
  });
  
  if (business && !business.businessPerm && !partner.partnerID) return <p className='alert alert-warning fadeInUp'><strong>Bummer!</strong> You are not authorized to access this feature. If you have an issues or need to report a bug, shoot us an email at <em>support@qruz.app</em> and we'll help you out.</p>;

  const handleEditModal = (tripID) => {
    setEditPartnerTripModal(true)
    setEditTripID(tripID)
  }

  const handleDeleteModal = (tripID) => {
    setDeletePartnerTripModal(true)
    setDeletePartnerTripID(tripID)
  }

  if (loading) return <div className="spinner spinner-dark"></div>;
  if (error) return <p className="alert alert-danger">Error! Something went wrong.</p>;

  return (
    <div>
      <div className="card border-0 mb-4">
        <div className="card-body">
          <div className="row justify-content-between">
            <div className="col-auto align-self-center">
              <form>
                <input type="text" className="form-control" 
                  placeholder="Filter by name"
                  onChange={(e) => setFilterStr(e.target.value)}
                  value={filterStr} 
                />
              </form>
            </div>
            <div className="col-auto align-self-center">
              <button type="button" className="btn btn-sm btn-outline-primary" 
                onClick={() => setCreatePartnerTripModal(true)}>
                  New Trip
              </button>
            </div>
          </div>
        </div>
      </div>
      {data && data.partnerTrips && data.partnerTrips.length === 0 &&
      <div className="card border-0 mb-4">
        <div className="card-body">
          <p className="text-center text-muted mb-0">
            No trips have associated with this partner yet.
          </p>
        </div>
      </div>
      }
      {data && data.partnerTrips && data.partnerTrips.length > 0 &&
        <div className="row">
          {data.partnerTrips.filter(trip => trip.name.toLowerCase().includes(filterStr.toLowerCase())).map((trip) => (
            <div className="col-md-4" key={trip.id}>
              <div className="card border-0 mb-4">
                <div className="card-body">
                  <div className="row justify-content-between">
                    <div className="col align-self-center">
                      <h4 className="mb-1 font-weight-bold">
                        <Link to={`/business/partners/${partner.partnerID ? partner.partnerID : props.partnerID}/trips/${trip.id}/view`}>
                          { trip.name }
                        </Link>
                      </h4>
                      <p className="text-muted mb-0">{trip.subscription_code}</p>
                      {trip.schedule &&
                        <div className="mt-3">
                          {trip.schedule.saturday &&
                            <span className="placeholder rounded-circle placeholder-sm bg-navy text-white placeholder-list" 
                              title={trip.schedule.saturday}>SA</span>
                          }
                          {trip.schedule.sunday &&
                            <span className="placeholder rounded-circle placeholder-sm bg-navy text-white placeholder-list"
                              title={trip.sunday}>SU</span>
                          }
                          {trip.schedule.monday &&
                            <span className="placeholder rounded-circle placeholder-sm bg-navy text-white placeholder-list"
                              title={trip.schedule.monday}>MO</span>
                          }
                          {trip.schedule.tuesday &&
                            <span className="placeholder rounded-circle placeholder-sm bg-navy text-white placeholder-list"
                              title={trip.schedule.tuesday}>TU</span>
                          }
                          {trip.schedule.wednesday &&
                            <span className="placeholder rounded-circle placeholder-sm bg-navy text-white placeholder-list"
                              title={trip.schedule.wednesday}>WE</span>
                          }
                          {trip.schedule.thursday &&
                            <span className="placeholder rounded-circle placeholder-sm bg-navy text-white placeholder-list"
                              title={trip.schedule.thursday}>TH</span>
                          }
                          {trip.schedule.friday &&
                            <span className="placeholder rounded-circle placeholder-sm bg-navy text-white placeholder-list"
                              title={trip.schedule.friday}>FR</span>
                          }
                        </div>
                      }
                      <div className="mt-4">
                        <Link to={`/business/partners/${partner.partnerID ? partner.partnerID : props.partnerID}/trips/${trip.id}/view`} className="btn btn-sm btn-light">
                          View
                        </Link>
                        <button type="button" 
                          onClick={() => handleEditModal(trip.id)}
                          className="btn btn-sm btn-light mx-2">
                          Edit
                        </button>
                        {editPartnerTripModal && editTripID === trip.id &&
                          <EditPartnerTrip 
                            partnerID={partner.partnerID ? partner.partnerID : props.partnerID} 
                            trip={trip} 
                            editModal={setEditPartnerTripModal} 
                          />
                        }
                        <button type="button"
                          onClick={() => handleDeleteModal(trip.id)}
                          className="btn btn-sm btn-light">Del
                        </button>
                        {deletePartnerTripModal && deletePartnerTripID === trip.id &&
                          <DeletePartnerTrip
                            tripID={trip.id} 
                            tripName={trip.name} 
                            partnerID={partner.partnerID ? partner.partnerID : props.partnerID}
                            deleteModal={setDeletePartnerTripModal} 
                          />
                        }
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          </div>
        }
        {createPartnerTripModal &&
          <CreatePartnerTrip 
            partnerID={partner.partnerID ? partner.partnerID : props.partnerID} 
            createModal={setCreatePartnerTripModal} 
          />
        }
      </div>
    )
  }

export default PartnerTrips
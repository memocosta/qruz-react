import React, { useState } from 'react'
import gql from 'graphql-tag'
import { useQuery, useMutation } from '@apollo/react-hooks'

const GET_PARTNER_DRIVERS = gql`
  query getPartnerDrivers($partner_id: ID!, $assigned: Boolean!) {
    partnerDrivers(partner_id: $partner_id, assigned: $assigned) {
      id
      name
      avatar
    }
  }
`;

const DELETE_PARTNER_DRIVER = gql`
  mutation DeletePartnerDriver(
    $partnerID: ID!
    $driverID: [ID!]!
  ) {
    deletePartnerDriver(
      input: {
        partner_id: $partnerID
        driver_id: $driverID
      }
    ) {
      status
    }
  }
`;

const PARTNER_ID = gql`{ partnerID @client }`;
const BUSINESS = gql`{ businessPerm @client }`;

const PartnerAssignedDrivers = (props) => {
  const [driverID, setDriverID] = useState([]);
  const [filterStr, setFilterStr] = useState(''); 

  const { data: business } = useQuery(BUSINESS)
  const { data: partner } = useQuery(PARTNER_ID)
  
  const { loading, error, data } = useQuery(GET_PARTNER_DRIVERS, {
    variables: { 
      partner_id: partner.partnerID ? partner.partnerID : props.partnerID,
      assigned: true
    }
  });

  const [
    deletePartnerDriver,
    { loading: mutationLoading }
  ] = useMutation(
    DELETE_PARTNER_DRIVER, 
    {
      update: (store) => {
        const dataAssigned = store.readQuery({ 
          query: GET_PARTNER_DRIVERS,
          variables: { partner_id: props.partnerID, assigned: true },
        });   

        const newData = dataAssigned.partnerDrivers.filter(driver => !driverID.includes(driver.id));
        
              
        store.writeQuery({ 
          query: GET_PARTNER_DRIVERS,
          variables: { partner_id: props.partnerID, assigned: true },
          data: {partnerDrivers: newData}
        });

        try {
          const dataNotAssigned = store.readQuery({ 
            query: GET_PARTNER_DRIVERS,
            variables: { partner_id: props.partnerID, assigned: false },
          });
          
          const cancelled = dataAssigned.partnerDrivers.filter(driver => driverID.includes(driver.id));

          store.writeQuery({ 
            query: GET_PARTNER_DRIVERS,
            variables: { partner_id: props.partnerID, assigned: false },
            data: {partnerDrivers: dataNotAssigned.partnerDrivers.concat(cancelled)}
          });
        } catch (err) {
          console.log("No cache for unassigned drivers");
        }
      },
      onCompleted() {
        setDriverID([])
      }
    }
  );
  
  if (business && !business.businessPerm && !partner.partnerID) return <p className='alert alert-warning fadeInUp'><strong>Bummer!</strong> You are not authorized to access this feature. If you have an issues or need to report a bug, shoot us an email at <em>support@qruz.app</em> and we'll help you out.</p>;

  const assignBtnDisabled = () => mutationLoading || !driverID.length ? true : false
  const assignBtnText = () => mutationLoading ? "Saving.." : "Unassign"

  const handleSelectDriver = (driver) => {
    if (driverID.includes(driver)) {
      const newDriverID = driverID.filter(id => id !== driver)
      setDriverID(newDriverID)
    } else {
      setDriverID([...driverID, driver])
    }
  }

  const hasData = () => data && data.partnerDrivers && data.partnerDrivers.length > 0

  const allSelected = () => driverID.length === data.partnerDrivers.length

  const selectDeselectAll = () => {
    if (allSelected()) {
      setDriverID([])
    } else {
      let newDriverID = []
      data.partnerDrivers.map((driver) => newDriverID.push(driver.id))
      setDriverID(newDriverID)
    }
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
            {!partner.partnerID &&
              <div className="col-auto align-self-center">
                <button type="button" 
                  disabled={!hasData()}
                  className="btn btn-sm btn-outline-primary mr-2"
                  onClick={() => selectDeselectAll()}>
                  {allSelected() && hasData() ? "Deselect All" : "Select All"}
                </button>
                <button type="button"
                  disabled={assignBtnDisabled()}
                  onClick={() => {
                    deletePartnerDriver({
                      variables: {
                        partnerID: props.partnerID,
                        driverID: driverID
                      }
                    });
                  }}
                  className="btn btn-sm btn-outline-primary">{assignBtnText()}
                </button> 
              </div>
            }
          </div>
        </div>
      </div>
      {!hasData() &&
      <div className="card border-0 mb-4">
        <div className="card-body">
          <p className="text-center text-muted mb-0">
            No drivers.
          </p>
        </div>
      </div>
      }
      {hasData() &&
        <div className="row">
          {data.partnerDrivers.filter(driver => driver.name.toLowerCase().includes(filterStr.toLowerCase())).map((driver) => (
            <div className="col-md-4" key={driver.id}>
              <div className={"card border-0 mb-4 clickable" + (driverID.includes(driver.id) ? " selected" : "")}
                onClick={() => handleSelectDriver(driver.id)}>
                <div className="card-body">
                  <div className="row">
                    <div className="col-auto align-self-center">
                      {driver.avatar &&
                        <div className="image-cover image-cover-md rounded" 
                          style={{ backgroundImage: "url("+driver.avatar+")"}}
                        ></div>
                      }
                      {!driver.avatar &&
                        <span className="placeholder rounded placeholder-md bg-teal text-white">
                          {driver.name.substring(0,2).toUpperCase()}
                        </span>
                      }
                    </div>
                    <div className="col align-self-center">
                      <h4 className="mb-1 font-weight-bold">
                        { driver.name }
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      }
    </div>
  )
}

export default PartnerAssignedDrivers
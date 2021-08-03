import React, { useState } from 'react'
import gql from 'graphql-tag';
import { useMutation, useQuery } from '@apollo/react-hooks';

const GET_PARTNER_DRIVERS = gql`
  query getPartnerDrivers($partner_id: ID!, $assigned: Boolean!) {
    partnerDrivers(partner_id: $partner_id, assigned: $assigned) {
      id
      name
      avatar
    }
  }
`;

const CREATE_PARTNER_DRIVER = gql`
  mutation CreatePartnerDriver(
    $partnerID: ID!
    $driverID: [ID!]!
  ) {
    createPartnerDriver(
      input: {
        partner_id: $partnerID
        driver_id: $driverID
      }
    ) {
      status
    }
  } 
`; 

const PartnerNotAssignedDrivers = (props) => {
  const [driverID, setDriverID] = useState([]);
  const [filterStr, setFilterStr] = useState('');
  
  const { loading, error, data } = useQuery(
    GET_PARTNER_DRIVERS, {
      variables: { partner_id: props.partnerID, assigned: false }
    }
  );

  const [
    createPartnerDriver,
    { loading: mutationLoading }
  ] = useMutation(
    CREATE_PARTNER_DRIVER,
    {
      update: (store) => {
        const dataNotAssigned = store.readQuery({ 
          query: GET_PARTNER_DRIVERS,
          variables: { partner_id: props.partnerID, assigned: false },
        });   

        const newData = dataNotAssigned.partnerDrivers.filter(driver => !driverID.includes(driver.id));

        store.writeQuery({ 
          query: GET_PARTNER_DRIVERS,
          variables: { partner_id: props.partnerID, assigned: false },
          data: {partnerDrivers: newData}
        });

        try {
          const dataAssigned = store.readQuery({ 
            query: GET_PARTNER_DRIVERS,
            variables: { partner_id: props.partnerID, assigned: true },
          }); 

          const assigned = dataNotAssigned.partnerDrivers.filter(driver => driverID.includes(driver.id));

          store.writeQuery({ 
            query: GET_PARTNER_DRIVERS,
            variables: { partner_id: props.partnerID, assigned: true },
            data: { partnerDrivers: dataAssigned.partnerDrivers.concat(assigned) }
          });
        } catch (err) {
          console.log("No cache for assigned drivers");
        }
      },
      onCompleted() {
        setDriverID([])
      }
    }
  ); 
 
  const assignBtnDisabled = () => mutationLoading || !driverID.length ? true : false
  const assignBtnText = () => mutationLoading ? "Saving.." : "Assign"

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
                  createPartnerDriver({
                    variables: {
                      partnerID: props.partnerID,
                      driverID: driverID
                    }
                  });
                }}
                className="btn btn-sm btn-outline-primary">{assignBtnText()}
              </button> 
            </div>
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
                      <h5 className="mb-0 font-weight-bold">
                        { driver.name }
                      </h5>
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

export default PartnerNotAssignedDrivers
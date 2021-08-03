import React, { useState } from 'react'
import gql from 'graphql-tag'
import { useQuery, useMutation } from '@apollo/react-hooks'

const GET_DRIVER_VEHICLES = gql`
  query getDriverVehicles($driverID: ID!, $assigned: Boolean!, $first: Int!, $page: Int, $field: String!, $order: SortOrder!) {
    driverVehicles(driver_id: $driverID, assigned: $assigned, first: $first, page: $page, orderBy: [
    {
      field: $field
      order: $order
    }
    ]) {
      data {
        id
        license_plate
        year
        photo
        type {
          id
          name
        }
        make {
          id
          name
        }
        model {
          id
          name
        }
      }
      paginatorInfo {
        currentPage
        lastPage
      }
    }
  }
`;

const DELETE_DRIVER_VEHICLE = gql`
  mutation DeleteDriverVehicle(
    $driverID: ID!
    $vehicleID: [ID!]!
  ) {
    deleteDriverVehicle(
      input: {
        driver_id: $driverID
        vehicle_id: $vehicleID
      }
    ) {
      status
    }
  }
`;

const DriverAssignedVehicles = (props) => {
  const [vehicleID, setVehicleID] = useState([]);
  const [filterStr, setFilterStr] = useState(''); 
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(''); 
  const [perPage, setPerPage] = useState(50); 
  const [sort, setSort] = useState('car_make_id'); 
  const [order, setOrder] = useState('DESC'); 

  const { loading, error, data } = useQuery(GET_DRIVER_VEHICLES, {
    variables: { 
      driverID: props.driverID,
      assigned: true,
      first: perPage,
      page: page,
      field: sort,
      order: order
    },
    onCompleted() {
      setLastPage(data.driverVehicles.paginatorInfo.lastPage)
    }
  });

  const [
    deleteDriverVehicle,
    { loading: mutationLoading }
  ] = useMutation(
    DELETE_DRIVER_VEHICLE, 
    {
      update: (store) => {
        const dataAssigned = store.readQuery({ 
          query: GET_DRIVER_VEHICLES,
          variables: { 
            driverID: props.driverID,
            assigned: true,
            first: perPage,
            page: page,
            field: sort,
            order: order
          }
        });   

        const newData = dataAssigned.driverVehicles.data.filter(vehicle => !vehicleID.includes(vehicle.id));
        const newDataObj = {
          driverVehicles: {
            data: newData,
            paginatorInfo: dataAssigned.driverVehicles.paginatorInfo,
            __typename: "DriverVehiclePaginator"
          }
        }
              
        store.writeQuery({ 
          query: GET_DRIVER_VEHICLES,
          variables: { 
            driverID: props.driverID,
            assigned: true,
            first: perPage,
            page: page,
            field: sort,
            order: order
          },
          data: newDataObj
        });

        try {
          const dataNotAssigned = store.readQuery({ 
            query: GET_DRIVER_VEHICLES,
            variables: { 
              driverID: props.driverID,
              assigned: false,
              first: 50,
              page: 1,
              field: sort,
              order: order
            }
          });
          
          const cancelled = dataAssigned.driverVehicles.data.filter(vehicle => vehicleID.includes(vehicle.id));
          const newDataObj = {
            driverVehicles: {
              data: dataNotAssigned.driverVehicles.data.concat(cancelled),
              paginatorInfo: dataNotAssigned.driverVehicles.paginatorInfo,
              __typename: "DriverVehiclePaginator"
            }
          }

          store.writeQuery({ 
            query: GET_DRIVER_VEHICLES,
            variables: { 
              driverID: props.driverID,
              assigned: false,
              first: 50,
              page: 1,
              field: sort,
              order: order
            },
            data: newDataObj
          });
        } catch (err) {
          console.log("No cache for unassigned vehicles");
        }
      },
      onCompleted() {
        setVehicleID([])
      }
    }
  );

  const assignBtnDisabled = () => mutationLoading || !vehicleID.length ? true : false
  const assignBtnText = () => mutationLoading ? "Saving.." : "Unassign"
  const changingData = () => (loading || mutationLoading) && lastPage;

  const handleSelectVehicle = (vehicle) => {
    if (vehicleID.includes(vehicle)) {
      const newVehicleID = vehicleID.filter(id => id !== vehicle)
      setVehicleID(newVehicleID)
    } else {
      setVehicleID([...vehicleID, vehicle])
    }
  }

  const hasData = () => data 
    && data.driverVehicles.data 
    && data.driverVehicles.data.length > 0

  const allSelected = () => vehicleID.length === data.driverVehicles.data.length

  const selectDeselectAll = () => {
    if (allSelected()) {
      setVehicleID([])
    } else {
      let newVehicleID = []
      data.driverVehicles.data.map((vehicle) => newVehicleID.push(vehicle.id))
      setVehicleID(newVehicleID)
    }
  }

  const loadingIndicator = <div className="spinner spinner-dark"></div>;

  if (loading && !lastPage) return loadingIndicator;
  if (error) return <p className="alert alert-danger">Error! Something went wrong.</p>;

  return (
    <div>
      {!hasData() &&
        <div className="card border-0 mb-4">
          <div className="card-body">
            <p className="text-center text-muted mb-0">
              No vehicles.
            </p>
          </div>
        </div>
      }
      {hasData() &&
        <div className="mb-4">
          <div className="card border-0 mb-4">
            <div className="card-body">
              <div className="row">
                <div className="col-auto align-self-center">
                  <form className="form-inline">
                    <small className="mr-2 text-muted">Sort By</small>
                    <select name="sort" id="sort" 
                      className="form-control mr-2"
                      onChange={(e) => {
                        setSort(e.target.value)
                      }}
                      value={sort}>
                      <option value="car_make_id">Make</option>
                      <option value="car_model_id">Model</option>
                      <option value="car_type_id">Type</option>
                      <option value="year">Year</option>
                      <option value="license_expires_on">License Expire</option>
                    </select>
                  </form>
                </div>
                <div className="col align-self-center">
                  <form className="form-inline">
                    <small className="mr-2 text-muted">Order</small>
                    <select name="order" id="order" 
                      className="form-control mr-2"
                      onChange={(e) => {
                        setOrder(e.target.value)
                      }}
                      value={order}>
                      <option value="DESC">Z-A</option>
                      <option value="ASC">A-Z</option>
                    </select>
                  </form>
                </div>
                <div className="col-auto align-self-center">
                  <form className="form-inline">
                    <small className="mr-2 text-muted">Items Per Page</small>
                    <select 
                      disabled={lastPage === 1}
                      name="perPage" id="perPage" 
                      className="form-control"
                      onChange={(e) => {
                        setPerPage(e.target.value)
                        setPage(1)
                      }}
                      value={perPage}>
                      <option value="50">50</option>
                      <option value="100">100</option>
                      <option value="200">200</option>
                      <option value="500">500</option>
                    </select>
                  </form>
                </div>
              </div>
            </div>
          </div>
          <div className="card border-0 mb-4">
            <div className="card-body">
              <div className="row justify-content-between">
                <div className="col-auto align-self-center">
                  <form>
                    <input type="text" className="form-control" 
                      placeholder="Filter by model name"
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
                      deleteDriverVehicle({
                        variables: {
                          driverID: props.driverID,
                          vehicleID: vehicleID
                        }
                      });
                    }}
                    className="btn btn-sm btn-outline-primary">{assignBtnText()}
                  </button> 
                </div>
              </div>
            </div>
          </div> 
          <div className={"fadeInUp" + (changingData() ? " inactive" : "")}>
            <div className="row">
              {data.driverVehicles.data.filter(vehicle => 
                vehicle.make.name.toLowerCase().includes(filterStr.toLowerCase())
                ||
                vehicle.model.name.toLowerCase().includes(filterStr.toLowerCase())
                ||
                vehicle.year.includes(filterStr)
              ).map((vehicle) => (
                <div className="col-md-4" key={vehicle.id}>
                  <div className={"card noAnimation border-0 mb-4 clickable" + (vehicleID.includes(vehicle.id) ? " selected" : "")}
                    onClick={() => handleSelectVehicle(vehicle.id)}>
                    <div className="card-body">
                      <div className="row">
                        <div className="col-auto">
                          {vehicle.photo &&
                            <div className="image-cover image-cover-lg rounded" 
                              style={{ backgroundImage: "url("+vehicle.photo+")"}}
                            ></div>
                          }
                          {!vehicle.photo &&
                            <span className="placeholder rounded placeholder-lg bg-teal text-white">
                              {vehicle.make.name.substring(0,2).toUpperCase()}
                            </span>
                          }
                        </div>
                        <div className="col align-self-center">
                          <p className="mb-1 text-muted">
                            {vehicle.type.name}
                          </p>
                          <h5 className="mb-1 font-weight-bold">
                            { vehicle.make.name } { vehicle.model.name } { vehicle.year }
                          </h5>
                          <p className="text-muted mb-0">
                            {vehicle.license_plate}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      }
      {lastPage > 1 &&
        <div className="row justify-content-between mb-4">
          <div className="col-auto align-self-center">
            <small className="text-muted">
              Page { page } of { lastPage }
            </small>
          </div>
          <div className="col-auto align-self-center">
            <button type="button"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="btn btn-sm btn-outline-primary mr-2">Previous
            </button>
            <button type="button"
              disabled={page === lastPage}
              onClick={() => {
                setPage(page + 1)
              }}
              className="btn btn-sm btn-outline-primary">
                Next
            </button>
          </div>
        </div>
      }
    </div>
  )
}

export default DriverAssignedVehicles
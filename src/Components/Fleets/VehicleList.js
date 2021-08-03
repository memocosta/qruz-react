import React, { useState } from 'react'
import gql from 'graphql-tag'
import { Link } from 'react-router-dom'
import { useQuery } from '@apollo/react-hooks'
import CreateVehicle from './CreateVehicle'
import EditVehicle from './EditVehicle'
import DeleteVehicle from './DeleteVehicle'

const GET_VEHICLES = gql`
  query getVehicles($first: Int!, $page: Int, $field: String!, $order: SortOrder!) {
    vehicles(first: $first, page: $page, orderBy: [
    {
      field: $field
      order: $order
    }
    ]) {
      data {
        id
        license_plate
        license_expires_on
        year
        photo
        make {
          id
          name
        }
        model {
          id
          name
        }
        type {
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

const VehicleList = () => {
  const [deleteVehicleID, setDeleteVehicleID] = useState('');
  const [editVehicleID, setEditVehicleID] = useState('');
  const [createVehicleModal, setCreateVehicleModal] = useState(false);
  const [editVehicleModal, setEditVehicleModal] = useState(false);
  const [deleteVehicleModal, setDeleteVehicleModal] = useState(false);
  const [filterStr, setFilterStr] = useState('');
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(''); 
  const [perPage, setPerPage] = useState(50); 
  const [sort, setSort] = useState('created_at'); 
  const [order, setOrder] = useState('DESC'); 

  const { loading, error, data } = useQuery(GET_VEHICLES, {
    variables: { 
      first: perPage,
      page: page,
      field: sort,
      order: order
    },
    onCompleted() {
      setLastPage(data.vehicles.paginatorInfo.lastPage)
    }
  });

  const handleEditModal = (vehicleID) => {
    setEditVehicleModal(true)
    setEditVehicleID(vehicleID)
  }
 
  const handleDeleteModal = (vehicleID) => {
    setDeleteVehicleModal(true)
    setDeleteVehicleID(vehicleID)
  }

  const changingData = () => loading && lastPage;
  
  if (loading && !lastPage) return <div className="spinner spinner-dark"></div>;
  if (error) return <p className="alert alert-danger">Error! Something went wrong.</p>;
  return (
    <div>
      {data && data.vehicles.data && data.vehicles.data.length === 0 &&
        <div className="card border-0 mb-4">
          <div className="card-body">
            <div className="row justify-content-between">
              <div className="col-auto align-self-center">
                <p className="text-muted mb-0">
                  No vehicles.
                </p>
              </div>
              <div className="col-auto align-self-center">
                <button type="button" className="btn btn-sm btn-outline-primary" 
                  onClick={() => setCreateVehicleModal(true)}>
                  New Vehicle
                </button> 
              </div>
            </div>
          </div>
        </div>
      }
      {data && data.vehicles.data && data.vehicles.data.length > 0 &&
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
                      <option value="created_at">Date Created</option>
                      <option value="updated_at">Date Modified</option>
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
                      placeholder="Filter by name"
                      onChange={(e) => setFilterStr(e.target.value)}
                      value={filterStr} 
                    />
                  </form>
                </div>
                <div className="col-auto align-self-center">
                  <button type="button" className="btn btn-sm btn-outline-primary" 
                    onClick={() => setCreateVehicleModal(true)}>
                    New Vehicle
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className={"fadeInUp" + (changingData() ? " inactive" : "")}>
            <div className="row">
              {data.vehicles.data.filter((vehicle) => 
                vehicle.make.name.toLowerCase().includes(filterStr.toLowerCase())
                ||
                vehicle.model.name.toLowerCase().includes(filterStr.toLowerCase())
                ||
                vehicle.year.includes(filterStr)
              ).map((vehicle) => (
                <div className="col-md-4" key={vehicle.id}>
                  <div className="card border-0 mb-4">
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
                        <div className="col">
                          <h5 className="mb-1 font-weight-bold">
                            <Link to={`/fleets/vehicles/${vehicle.id}/view`}>
                              { vehicle.make.name } { vehicle.model.name } { vehicle.year }
                            </Link>
                          </h5>
                          <p className="text-muted">
                            {vehicle.type.name}
                          </p>
                          <div className="mt-3">
                            <Link to={`/fleets/vehicles/${vehicle.id}/view`} className="btn btn-sm btn-light mr-2">
                              View
                            </Link> 
                            <button type="button" 
                              className="btn btn-sm btn-light mr-2"
                              onClick={() => handleEditModal(vehicle.id)}>
                              Edit
                            </button>
                            {editVehicleModal && editVehicleID === vehicle.id &&
                              <EditVehicle
                                vehicle={vehicle} 
                                editModal={setEditVehicleModal} 
                              />
                            }
                            <button type="button"
                              onClick={() => handleDeleteModal(vehicle.id)}
                              className="btn btn-sm btn-light">Del
                            </button>
                            {deleteVehicleModal && deleteVehicleID === vehicle.id &&
                              <DeleteVehicle
                                vehicleID={vehicle.id} 
                                vehicleName={vehicle.make.name + ' ' + vehicle.model.name + ' ' + vehicle.year} 
                                deleteModal={setDeleteVehicleModal} 
                                page={page} perPage={perPage}
                                sort={sort} order={order}
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
      {createVehicleModal &&
        <CreateVehicle createModal={setCreateVehicleModal} 
          page={page} perPage={perPage}
          sort={sort} order={order}
        />
      }
    </div>
  )
}

export default VehicleList
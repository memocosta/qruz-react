import React, {useState} from 'react'
import gql from 'graphql-tag'
import { Link } from 'react-router-dom'
import { useQuery } from '@apollo/react-hooks'
import CreateDriver from './CreateDriver'
import EditDriver from './EditDriver'
import DeleteDriver from './DeleteDriver'

const GET_FLEET_DRIVERS = gql`
  query getFleetDrivers($fleetID: ID!, $first: Int!, $page: Int, $field: String!, $order: SortOrder!) {
    fleetDrivers(fleet_id: $fleetID, first: $first, page: $page, orderBy: [
    {
      field: $field
      order: $order
    }
    ]) {
      data {
        id
        name
        email
        phone
        license_expires_on
        avatar
      }
      paginatorInfo {
        currentPage
        lastPage
      }
    }
  }
`;

const FleetDriverList = (props) => {
  const [deleteDriverID, setDeleteDriverID] = useState('');
  const [editDriverID, setEditDriverID] = useState('');
  const [createDriverModal, setCreateDriverModal] = useState(false);
  const [editDriverModal, setEditDriverModal] = useState(false);
  const [deleteDriverModal, setDeleteDriverModal] = useState(false);
  const [filterStr, setFilterStr] = useState('');
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(''); 
  const [perPage, setPerPage] = useState(50); 
  const [sort, setSort] = useState('created_at'); 
  const [order, setOrder] = useState('DESC'); 

  const { loading, error, data } = useQuery(GET_FLEET_DRIVERS, 
  {
    variables: { 
      fleetID: props.fleetID,
      first: perPage,
      page: page,
      field: sort,
      order: order
    },
    onCompleted() {
      props.driverCount(data.fleetDrivers.data.length)
      setLastPage(data.fleetDrivers.paginatorInfo.lastPage)
    }
  });

  const handleEditModal = (driverID) => {
    setEditDriverModal(true)
    setEditDriverID(driverID)
  }

  const handleDeleteModal = (driverID) => {
    setDeleteDriverModal(true)
    setDeleteDriverID(driverID)
  }

  const changingData = () => loading && lastPage;

  if (loading && !lastPage) return <div className="spinner spinner-dark"></div>;
  if (error) return <p className="alert alert-danger">Error! Something went wrong.</p>;

  return (
    <div>
      {data && data.fleetDrivers.data && data.fleetDrivers.data.length === 0 &&
        <div className="card border-0 mb-4">
          <div className="card-body">
            <div className="row justify-content-between">
              <div className="col align-self-center">
              <p className="text-muted mb-0">
                No drivers yet.
              </p>
              </div>
              <div className="col-auto align-self-center">
                <button type="button" className="btn btn-sm btn-outline-primary" 
                  onClick={() => setCreateDriverModal(true)}>
                  New Driver
                </button>
              </div>
            </div>
          </div>
        </div>
      }
      {data && data.fleetDrivers.data && data.fleetDrivers.data.length > 0 &&
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
                      <option value="name">Name</option>
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
                      placeholder="Filter by driver name"
                      onChange={(e) => setFilterStr(e.target.value)}
                      value={filterStr} 
                    />
                  </form>
                </div>
                <div className="col-auto align-self-center">
                  <button type="button" className="btn btn-sm btn-outline-primary" 
                    onClick={() => setCreateDriverModal(true)}>
                    New Driver
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className={"row fadeInUp" + (changingData() ? " inactive" : "")}>
            {data.fleetDrivers.data.filter(driver => driver.name.toLowerCase().includes(filterStr.toLowerCase())).map((driver) => (
              <div className="col-md-4" key={driver.id}>
                <div className="card noAnimation border-0 mb-4">
                  <div className="card-body">
                    <div className="row">
                      <div className="col-auto">
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
                        <h4 className="mb-0 font-weight-bold">
                          <Link to={`/fleets/${props.fleetID}/drivers/${driver.id}/view`}>
                            { driver.name }
                          </Link>
                        </h4>
                        <div className="mt-3">
                          <Link to={`/fleets/${props.fleetID}/drivers/${driver.id}/view`} className="btn btn-sm btn-light mr-2">
                            View
                          </Link>
                          <button type="button" 
                            className="btn btn-sm btn-light mr-2"
                            onClick={() => handleEditModal(driver.id)}>
                            Edit
                          </button>
                          {editDriverModal && editDriverID === driver.id &&
                            <EditDriver
                              driver={driver} 
                              editModal={setEditDriverModal} 
                            />
                          }
                          <button type="button"
                            onClick={() => handleDeleteModal(driver.id)}
                            className="btn btn-sm btn-light">Del
                          </button>
                          {deleteDriverModal && deleteDriverID === driver.id &&
                            <DeleteDriver
                              fleetID={props.fleetID}
                              driverID={driver.id} 
                              driverName={driver.name} 
                              deleteModal={setDeleteDriverModal} 
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
      {createDriverModal &&
        <CreateDriver 
          createModal={setCreateDriverModal} 
          fleetID={props.fleetID}
          page={page} perPage={perPage}
          sort={sort} order={order} 
        />
      }
    </div>
  )
}

export default FleetDriverList
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import gql from 'graphql-tag'
import { useQuery } from '@apollo/react-hooks'
import CreateFleet from './CreateFleet'
import EditFleet from './EditFleet' 
import DeleteFleet from './DeleteFleet'

const GET_FLEETS = gql`
  query getFleets($first: Int!, $page: Int, $field: String!, $order: SortOrder!) {
    fleets(first: $first, page: $page, orderBy: [
    {
      field: $field
      order: $order
    }
    ]) {
      data {
        id
        name
        phone
        email
        max_no_of_cars
        expires_on
        avatar
      }
      paginatorInfo {
        currentPage
        lastPage
      }
    }
  }
`;

const FleetList = () => {
  const [deleteFleetID, setDeleteFleetID] = useState('');
  const [editFleetID, setEditFleetID] = useState('');
  const [createFleetModal, setCreateFleetModal] = useState(false);
  const [editFleetModal, setEditFleetModal] = useState(false);
  const [deleteFleetModal, setDeleteFleetModal] = useState(false);
  const [filterStr, setFilterStr] = useState(''); 
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(''); 
  const [perPage, setPerPage] = useState(50); 
  const [sort, setSort] = useState('created_at'); 
  const [order, setOrder] = useState('DESC');

  const { loading, error, data } = useQuery(GET_FLEETS, {
    variables: { 
      first: perPage,
      page: page,
      field: sort,
      order: order
    },
    onCompleted() {
      setLastPage(data.fleets.paginatorInfo.lastPage)
    }
  });

  const handleEditModal = (fleetID) => {
    setEditFleetModal(true)
    setEditFleetID(fleetID)
  }

  const handleDeleteModal = (fleetID) => {
    setDeleteFleetModal(true)
    setDeleteFleetID(fleetID)
  }

  const changingData = () => loading && lastPage;

  if (loading && !lastPage) return <div className="spinner spinner-dark"></div>;
  if (error) console.log(error);

  return (
    <div>
      {data && data.fleets.data && data.fleets.data.length === 0 &&
        <div className="card border-0 mb-4">
          <div className="card-body">
            <div className="row justify-content-between">
              <div className="col-auto align-self-center">
                <p className="text-muted mb-0">No fleets.</p>
              </div>
              <div className="col-auto align-self-center">
                <button type="button" className="btn btn-sm btn-outline-primary" 
                  onClick={() => setCreateFleetModal(true)}>
                  New Fleet
                </button>
              </div>
            </div>
          </div>
        </div>
      }
      {data && data.fleets.data && data.fleets.data.length > 0 &&
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
                      placeholder="Filter by fleet name"
                      onChange={(e) => setFilterStr(e.target.value)}
                      value={filterStr} 
                    />
                  </form>
                </div>
                <div className="col-auto align-self-center">
                  <button type="button" className="btn btn-sm btn-outline-primary" 
                    onClick={() => setCreateFleetModal(true)}>
                    New Fleet
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className={"row fadeInUp" + (changingData() ? " inactive" : "")}>
            {data.fleets.data.filter(fleet => fleet.name.toLowerCase().includes(filterStr.toLowerCase())).map((fleet) => (
              <div className="col-md-4" key={fleet.id}>
                <div className="card noAnimation border-0 mb-4">
                  <div className="card-body">
                    <div className="row">
                      <div className="col-auto">
                        {fleet.avatar &&
                          <div className="image-cover image-cover-md rounded" 
                            style={{ backgroundImage: "url("+fleet.avatar+")"}}
                          ></div>
                        }
                        {!fleet.avatar &&
                          <span className="placeholder rounded placeholder-md bg-teal text-white">
                            {fleet.name.substring(0,2).toUpperCase()}
                          </span>
                        }
                      </div>
                      <div className="col align-self-center">
                        <h4 className="mb-0 font-weight-bold">
                          <Link to={`/fleets/${fleet.id}/view`}>
                            { fleet.name }
                          </Link>
                        </h4>
                        <div className="mt-3">
                          <Link to={`/fleets/${fleet.id}/view`} className="btn btn-sm btn-light mr-2">
                            View
                          </Link>
                          <button type="button" 
                            className="btn btn-sm btn-light mr-2"
                            onClick={() => handleEditModal(fleet.id)}>
                            Edit
                          </button>
                          {editFleetModal && editFleetID === fleet.id &&
                            <EditFleet
                              fleet={fleet} 
                              editModal={setEditFleetModal} 
                            />
                          }
                          <button type="button"
                            onClick={() => handleDeleteModal(fleet.id)}
                            className="btn btn-sm btn-light">Del
                          </button>
                          {deleteFleetModal && deleteFleetID === fleet.id &&
                            <DeleteFleet
                              fleetID={fleet.id} 
                              fleetName={fleet.name} 
                              deleteModal={setDeleteFleetModal} 
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
      }
      {createFleetModal &&
        <CreateFleet createModal={setCreateFleetModal} 
          page={page} perPage={perPage}
          sort={sort} order={order}
        />
      }
    </div>
  )
}

export default FleetList
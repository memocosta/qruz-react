import React, { useState } from 'react'
import gql from 'graphql-tag'
import { useQuery } from '@apollo/react-hooks'
import CreateCarModel from './CreateCarModel'
import EditCarModel from './EditCarModel'
import DeleteCarModel from './DeleteCarModel'
 
const GET_CAR_MODELS = gql`
  query getCarModels($first: Int!, $page: Int, $field: String!, $order: SortOrder!) {
    carModels(first: $first, page: $page, orderBy: [
    {
      field: $field
      order: $order
    }
    ]) {
      data {
        id
        name
        make {
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

const CarModelList = () => {
  const [deleteCarModelID, setDeleteCarModelID] = useState('');
  const [editCarModelID, setEditCarModelID] = useState('');
  const [createCarModelModal, setCreateCarModelModal] = useState(false);
  const [editCarModelModal, setEditCarModelModal] = useState(false);
  const [deleteCarModelModal, setDeleteCarModelModal] = useState(false);
  const [filterStr, setFilterStr] = useState('');
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(''); 
  const [perPage, setPerPage] = useState(50); 
  const [sort, setSort] = useState('created_at'); 
  const [order, setOrder] = useState('DESC');

  const { loading, error, data } = useQuery(GET_CAR_MODELS, {
    variables: { 
      first: perPage,
      page: page,
      field: sort,
      order: order
    },
    onCompleted() {
      setLastPage(data.carModels.paginatorInfo.lastPage)
    }
  });

  const handleEditModal = (carModelID) => {
    setEditCarModelModal(true)
    setEditCarModelID(carModelID)
  }

  const handleDeleteModal = (carModelID) => {
    setDeleteCarModelModal(true)
    setDeleteCarModelID(carModelID)
  }

  const changingData = () => loading && lastPage;

  if (loading && !lastPage) return <div className="spinner spinner-dark"></div>;
  if (error) return <p className="alert alert-danger">Error! Something went wrong.</p>;
  
  return (
    <div>
      {data && data.carModels.data && data.carModels.data.length === 0 &&
        <div className="card border-0 mb-4">
          <div className="card-body">
            <div className="row justify-content-between">
              <div className="col-auto align-self-center">
                <p className="text-muted mb-0">
                  No car models.
                </p>
              </div>
              <div className="col-auto align-self-center">
                <button type="button" className="btn btn-sm btn-outline-primary" 
                  onClick={() => setCreateCarModelModal(true)}>
                  New Model
                </button>
              </div>
            </div>
          </div>
        </div> 
      }
      {data && data.carModels.data && data.carModels.data.length > 0 &&
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
                      <option value="make_id">Make</option>
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
                    onClick={() => setCreateCarModelModal(true)}>
                    New Model
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className={"fadeInUp" + (changingData() ? " inactive" : "")}>
            <div className="row">
              {data.carModels.data.filter(carModel => carModel.name.toLowerCase().includes(filterStr.toLowerCase())).map((carModel) => (
                <div className="col-md-4" key={carModel.id}>
                  <div className="card noAnimation border-0 mb-4">
                    <div className="card-body">
                      <div className="row">
                        <div className="col align-self-center">
                          <p className="text-muted mb-1">{ carModel.make.name }</p>
                          <h4 className="font-weight-bold mb-0">
                            { carModel.name }
                          </h4>
                        </div>
                        <div className="col-auto align-self-center">
                            <button type="button" 
                              className="btn btn-sm btn-light mr-2"
                              onClick={() => handleEditModal(carModel.id)}>
                              Edit
                            </button>
                            {editCarModelModal && editCarModelID === carModel.id &&
                              <EditCarModel
                                carModel={carModel} 
                                editModal={setEditCarModelModal} 
                              />
                            }
                            <button type="button"
                              onClick={() => handleDeleteModal(carModel.id)}
                              className="btn btn-sm btn-light">Del
                            </button>
                            {deleteCarModelModal && deleteCarModelID === carModel.id &&
                              <DeleteCarModel
                                carModelID={carModel.id} 
                                carModelName={carModel.name} 
                                deleteModal={setDeleteCarModelModal} 
                                page={page} perPage={perPage}
                                sort={sort} order={order}
                              />
                            }
                          </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
      {createCarModelModal &&
        <CreateCarModel 
          createModal={setCreateCarModelModal} 
          page={page} perPage={perPage} 
          sort={sort} order={order}
        />
      }
    </div>
  )
}

export default CarModelList
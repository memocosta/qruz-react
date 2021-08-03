import React, { useState } from 'react'
import gql from 'graphql-tag'
import { useQuery } from '@apollo/react-hooks'
import CreateCarType from './CreateCarType'
import EditCarType from './EditCarType'
import DeleteCarType from './DeleteCarType'
 
const GET_CAR_TYPES = gql`
  {
    carTypes {
      id
      name
    }
  }
`;

const CarTypeList = () => {
  const [deleteCarTypeID, setDeleteCarTypeID] = useState('');
  const [editCarTypeID, setEditCarTypeID] = useState('');
  const [createCarTypeModal, setCreateCarTypeModal] = useState(false);
  const [editCarTypeModal, setEditCarTypeModal] = useState(false);
  const [deleteCarTypeModal, setDeleteCarTypeModal] = useState(false);
  const [filterStr, setFilterStr] = useState(''); 

  const { loading, error, data } = useQuery(GET_CAR_TYPES);

  const handleEditModal = (carTypeID) => {
    setEditCarTypeModal(true)
    setEditCarTypeID(carTypeID)
  }

  const handleDeleteModal = (carTypeID) => {
    setDeleteCarTypeModal(true)
    setDeleteCarTypeID(carTypeID)
  }

  if (loading) return <div className="spinner spinner-dark"></div>;
  if (error) return <p className="alert alert-danger">Error! Something went wrong.</p>;
  return (
    <div>
      {data && data.carTypes && data.carTypes.length === 0 &&
        <div className="card border-0 mb-4">
          <div className="card-body">
            <div className="row justify-content-between">
              <div className="col-auto align-self-center">
                <p className="text-muted mb-0">No Car Types.</p>
              </div>
              <div className="col-auto align-self-center">
                <button type="button" className="btn btn-sm btn-outline-primary" 
                  onClick={() => setCreateCarTypeModal(true)}>
                  New Type
                </button>
              </div>
            </div>
          </div>
        </div>
      }
      {data && data.carTypes && data.carTypes.length > 0 &&
        <div className="mb-4">
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
                    onClick={() => setCreateCarTypeModal(true)}>
                    New Type
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            {data.carTypes.filter(carType => carType.name.toLowerCase().includes(filterStr.toLowerCase())).map((carType) => (
              <div className="col-md-4" key={carType.id}>
                <div className="card border-0 mb-4">
                  <div className="card-body">
                    <div className="row">
                      <div className="col align-self-center">
                        <h4 className="font-weight-bold mb-0">
                          { carType.name }
                        </h4>
                      </div>
                      <div className="col-auto align-self-center">
                          <button type="button" 
                            className="btn btn-sm btn-light mr-2"
                            onClick={() => handleEditModal(carType.id)}>
                            Edit
                          </button>
                          {editCarTypeModal && editCarTypeID === carType.id &&
                            <EditCarType
                              carType={carType} 
                              editModal={setEditCarTypeModal} 
                            />
                          }
                          <button type="button"
                            onClick={() => handleDeleteModal(carType.id)}
                            className="btn btn-sm btn-light">Del
                          </button>
                          {deleteCarTypeModal && deleteCarTypeID === carType.id &&
                            <DeleteCarType
                              carTypeID={carType.id} 
                              carTypeName={carType.name} 
                              deleteModal={setDeleteCarTypeModal} 
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
      }
      {createCarTypeModal &&
        <CreateCarType createModal={setCreateCarTypeModal} />
      }
    </div>
  )
}

export default CarTypeList
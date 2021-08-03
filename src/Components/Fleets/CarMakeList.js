import React, { useState } from 'react'
import gql from 'graphql-tag'
import { useQuery } from '@apollo/react-hooks'
import CreateCarMake from './CreateCarMake'
import EditCarMake from './EditCarMake'
import DeleteCarMake from './DeleteCarMake'
 
const GET_CAR_MAKES = gql`
  {
    carMakes {
      id
      name
    }
  }
`;
 
const CarMakeList = () => {
  const [deleteCarMakeID, setDeleteCarMakeID] = useState('');
  const [editCarMakeID, setEditCarMakeID] = useState('');
  const [createCarMakeModal, setCreateCarMakeModal] = useState(false);
  const [editCarMakeModal, setEditCarMakeModal] = useState(false);
  const [deleteCarMakeModal, setDeleteCarMakeModal] = useState(false);
  const [filterStr, setFilterStr] = useState(''); 

  const { loading, error, data } = useQuery(GET_CAR_MAKES);

  const handleEditModal = (carMakeID) => {
    setEditCarMakeModal(true)
    setEditCarMakeID(carMakeID)
  }

  const handleDeleteModal = (carMakeID) => {
    setDeleteCarMakeModal(true)
    setDeleteCarMakeID(carMakeID)
  }

  if (loading) return <div className="spinner spinner-dark"></div>;
  if (error) return <p className="alert alert-danger">Error! Something went wrong.</p>;
  return (
    <div>
      {data && data.carMakes && data.carMakes.length === 0 &&
        <div className="card border-0 mb-4">
          <div className="card-body">
            <div className="row justify-content-between">
              <div className="col-auto align-self-center">
                <p className="text-muted mb-0">No Car Makes.</p>
              </div>
              <div className="col-auto align-self-center">
                <button type="button" className="btn btn-sm btn-outline-primary" 
                  onClick={() => setCreateCarMakeModal(true)}>
                  New Make
                </button>
              </div>
            </div>
          </div>
        </div>
      }
      {data && data.carMakes && data.carMakes.length > 0 &&
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
                    onClick={() => setCreateCarMakeModal(true)}>
                    New Make
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            {data.carMakes.filter(carMake => carMake.name.toLowerCase().includes(filterStr.toLowerCase())).map((carMake) => (
              <div className="col-md-4" key={carMake.id}>
                <div className="card border-0 mb-4">
                  <div className="card-body">
                    <div className="row">
                      <div className="col align-self-center">
                        <h4 className="font-weight-bold mb-0">
                          { carMake.name }
                        </h4>
                      </div>
                      <div className="col-auto align-self-center">
                          <button type="button" 
                            className="btn btn-sm btn-light mr-2"
                            onClick={() => handleEditModal(carMake.id)}>
                            Edit
                          </button>
                          {editCarMakeModal && editCarMakeID === carMake.id &&
                            <EditCarMake
                              carMake={carMake} 
                              editModal={setEditCarMakeModal} 
                            />
                          }
                          <button type="button"
                            onClick={() => handleDeleteModal(carMake.id)}
                            className="btn btn-sm btn-light">Del
                          </button>
                          {deleteCarMakeModal && deleteCarMakeID === carMake.id &&
                            <DeleteCarMake
                              carMakeID={carMake.id} 
                              carMakeName={carMake.name} 
                              deleteModal={setDeleteCarMakeModal} 
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
      {createCarMakeModal &&
        <CreateCarMake createModal={setCreateCarMakeModal} />
      }
    </div>
  )
}

export default CarMakeList
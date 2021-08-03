import React, { useState } from 'react'
import gql from 'graphql-tag'
import { useQuery } from '@apollo/react-hooks'
import CreateRoleType from './CreateRoleType'
import EditRoleType from './EditRoleType'
import DeleteRoleType from './DeleteRoleType'
 
const GET_ROLE_TYPES = gql`
  {
    roleTypes {
      id
      name
    }
  }
`;

const RoleTypeList = () => {
  const [deleteRoleTypeID, setDeleteRoleTypeID] = useState('');
  const [editRoleTypeID, setEditRoleTypeID] = useState('');
  const [createRoleTypeModal, setCreateRoleTypeModal] = useState(false);
  const [editRoleTypeModal, setEditRoleTypeModal] = useState(false);
  const [deleteRoleTypeModal, setDeleteRoleTypeModal] = useState(false);
  const [filterStr, setFilterStr] = useState(''); 

  const { loading, error, data } = useQuery(GET_ROLE_TYPES);

  const handleEditModal = (roleTypeID) => {
    setEditRoleTypeModal(true)
    setEditRoleTypeID(roleTypeID)
  }

  const handleDeleteModal = (roleTypeID) => {
    setDeleteRoleTypeModal(true)
    setDeleteRoleTypeID(roleTypeID)
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
                onClick={() => setCreateRoleTypeModal(true)}>
                New Type
              </button>
            </div>
          </div>
        </div>
      </div>
      {data && data.roleTypes && data.roleTypes.length === 0 &&
        <div className="card border-0 mb-4">
          <div className="card-body">
            <p className="text-center text-muted mb-0">
              No roleTypes.
            </p>
          </div>
        </div>
      }
      {data && data.roleTypes && data.roleTypes.length > 0 &&
        <div className="row">
          {data.roleTypes.filter(roleType => roleType.name.toLowerCase().includes(filterStr.toLowerCase())).map((roleType) => (
            <div className="col-md-4" key={roleType.id}>
              <div className="card border-0 mb-4">
                <div className="card-body">
                  <div className="row">
                    <div className="col align-self-center">
                      <h5 className="font-weight-bold mb-0">
                        { roleType.name }
                      </h5>
                    </div>
                    <div className="col-auto align-self-center">
                      <button type="button" 
                        className="btn btn-sm btn-light mr-2"
                        onClick={() => handleEditModal(roleType.id)}>
                        Edit
                      </button>
                      {editRoleTypeModal && editRoleTypeID === roleType.id &&
                        <EditRoleType
                          roleType={roleType} 
                          editModal={setEditRoleTypeModal} 
                        />
                      }
                      <button type="button"
                        onClick={() => handleDeleteModal(roleType.id)}
                        className="btn btn-sm btn-light">Del
                      </button>
                      {deleteRoleTypeModal && deleteRoleTypeID === roleType.id &&
                        <DeleteRoleType
                          roleTypeID={roleType.id} 
                          roleTypeName={roleType.name} 
                          deleteModal={setDeleteRoleTypeModal} 
                        />
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      }
      {createRoleTypeModal &&
        <CreateRoleType createModal={setCreateRoleTypeModal} />
      }
    </div>
  )
}

export default RoleTypeList
import React, { useState } from 'react'
import gql from 'graphql-tag'
import { useQuery } from '@apollo/react-hooks'
import CreateRole from './CreateRole'
import EditRole from './EditRole'
import DeleteRole from './DeleteRole'
  
const GET_ROLES = gql`
  {
    roles { 
      id
      name
      email
      phone      
      role_type {
        id
        name
      }
      dashboard
      roles
      archive
      communication
      promocodes
      business
      commute
      ondemand
      fleet
      payment
      cancellation
    }
  }
`;

const RoleList = () => {
  const [deleteRoleID, setDeleteRoleID] = useState('');
  const [editRoleID, setEditRoleID] = useState('');
  const [createRoleModal, setCreateRoleModal] = useState(false);
  const [editRoleModal, setEditRoleModal] = useState(false);
  const [deleteRoleModal, setDeleteRoleModal] = useState(false);
  const [filterStr, setFilterStr] = useState(''); 

  const { loading, error, data } = useQuery(GET_ROLES);

  const handleEditModal = (roleID) => {
    setEditRoleModal(true)
    setEditRoleID(roleID)
  }

  const handleDeleteModal = (roleID) => {
    setDeleteRoleModal(true)
    setDeleteRoleID(roleID)
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
                onClick={() => setCreateRoleModal(true)}>
                New Role
              </button>
            </div>
          </div>
        </div>
      </div>
      {data && data.roles && data.roles.length === 0 &&
        <div className="card border-0 mb-4">
          <div className="card-body">
            <p className="text-center text-muted mb-0">
              No roles yet
            </p>
          </div>
        </div>
      }
      {data && data.roles && data.roles.length > 0 &&
        <div className="row">
          {data.roles.filter(role => role.name.toLowerCase().includes(filterStr.toLowerCase())).map((role) => (
            <div className="col-md-4" key={role.id}>
              <div className="card border-0 mb-4">
                <div className="card-body">
                  <div className="row justify-content-between">
                    <div className="col-auto">
                      <span className="placeholder rounded placeholder-md bg-teal text-white">
                        {role.name.substring(0,2).toUpperCase()}
                      </span>
                    </div>
                    <div className="col align-self-center">
                      <h4 className="mb-1 font-weight-bold">
                        { role.name }
                      </h4>
                      <p className="text-muted mb-0">{ role.role_type.name }</p>
                      <div className="mt-3">
                        <button type="button" 
                          className="btn btn-sm btn-light mr-2"
                          onClick={() => handleEditModal(role.id)}>
                          Edit
                        </button>
                        {editRoleModal && editRoleID === role.id &&
                          <EditRole
                            role={role} 
                            editModal={setEditRoleModal} 
                          />
                        }
                        <button type="button"
                          disabled={role.email === "superuser@qruz.app"}
                          onClick={() => handleDeleteModal(role.id)}
                          className="btn btn-sm btn-light">Delete
                        </button>
                        {deleteRoleModal && deleteRoleID === role.id &&
                          <DeleteRole
                            roleID={role.id} 
                            roleName={role.name} 
                            deleteModal={setDeleteRoleModal} 
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
      }
      {createRoleModal &&
        <CreateRole createModal={setCreateRoleModal} />
      }
    </div>
  )
}

export default RoleList
import React, { useState } from 'react'
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import RoleList from './RoleList'
import RoleTypeList from './RoleTypeList'

const ROLES = gql`{ rolesPerm @client }`;
 
const Navigator = () => {
  const [view, setView] = useState('roles');
  const { data: rolesPerm } = useQuery(ROLES)

  if (rolesPerm && !rolesPerm.rolesPerm) return <p className='alert alert-warning fadeInUp'><strong>Bummer!</strong> You are not authorized to access this feature. If you have an issues or need to report a bug, shoot us an email at <em>support@qruz.app</em> and we'll help you out.</p>;

  return (
    <div>
      <div className="card border-0 mb-4">
        <div className="card-body">
          <ul className="nav nav-pills" id="pills-tab" role="tablist">
            <li className="nav-item">
              <span onClick={() => setView('roles')} className={"nav-link clickable" + (view === "roles" ? " active" : "")}>Roles</span>
            </li>
            <li className="nav-item">
              <span onClick={() => setView('roleTypes')} className={"nav-link clickable" + (view === "roleTypes" ? " active" : "")}>Role Types</span>
            </li>
          </ul>
        </div>
      </div>
      {view === 'roles' &&
        <RoleList />
      }
      {view === 'roleTypes' &&
        <RoleTypeList />
      }
    </div>
  )
}

export default Navigator
import React, { useState } from 'react'
import gql from 'graphql-tag';
import { useMutation, useQuery } from '@apollo/react-hooks';

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

const CREATE_ROLE = gql`
  mutation CreateRole(
    $name: String!
    $email: String!
    $password: String!
    $phone: String
    $roleTypeID: ID!
    $dashboard: Boolean
    $roles: Boolean
    $archive: Boolean
    $communication: Boolean
    $promocodes: Boolean
    $business: Boolean
    $commute: Boolean
    $ondemand: Boolean
    $fleet: Boolean
    $payment: Boolean
    $cancellation: Boolean
  ) {
    createRole(
      input: {
        name: $name
        email: $email
        password: $password
        phone: $phone
        role_type_id: $roleTypeID
        dashboard: $dashboard
        roles: $roles
        archive: $archive
        communication: $communication
        promocodes: $promocodes
        business: $business
        commute: $commute
        ondemand: $ondemand
        fleet: $fleet
        payment: $payment
        cancellation: $cancellation
      }
    ) {
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

const GET_ROLE_TYPES = gql`
  {
    roleTypes {
      id
      name
    }
  }
`;

const CreateRole = (props) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [phone, setPhone] = useState('');
  const [roleTypeID, setRoleTypeID] = useState('');
  const [dashboard, setDashboard] = useState(false);
  const [roles, setRoles] = useState(false);
  const [archive, setArchive] = useState(false);
  const [communication, setCommunication] = useState(false);
  const [promocodes, setPromocodes] = useState(false);
  const [business, setBusiness] = useState(false);
  const [commute, setCommute] = useState(false);
  const [ondemand, setOndemand] = useState(false);
  const [fleet, setFleet] = useState(false);
  const [payment, setPayment] = useState(false);
  const [cancellation, setCancellation] = useState(false);

  const { loading, data } = useQuery(GET_ROLE_TYPES);

  const [
    createRole,
    { loading: mutationLoading, error: mutationError },
  ] = useMutation(
    CREATE_ROLE,
    {
      update: (store, { data: { createRole } }) => {
        const data = store.readQuery({ 
          query: GET_ROLES
         });

        data.roles.push(createRole); 

        store.writeQuery({ 
          query: GET_ROLES,
          data 
        });
      }, 
      onCompleted() {
        props.createModal(false)
      }
    }
  );

  let btnDisabled = true;
  if (name 
    && phone 
    && email 
    && password 
    && password === rePassword
    && roleTypeID 
    && !mutationLoading) {
    btnDisabled = false
  }

  let button;
  if (mutationLoading) {
    button = "Saving.."
  } else {
    button = "Save"
  }

  let mutationFeedback;
  if (mutationError) {
    mutationFeedback = <p className='alert alert-danger mb-4 rounded-0'>Bummer! Oh no, we weren't able to create this role. Please try again, if the issue persists, kindly shoot us an email at <em>support@qruz.app</em> and we'll help you out.</p>
  }

  return (
    <div className="dialog-mask">
      <div className="dialog-wrapper dialog-md bg-white rounded-top rounded-bottom">
        <div className="dialog-container">
        
          <div id="dialog-header" className="bg-navy text-white px-4 py-4 rounded-top">
            <div className="row justify-content-between">
              <div className="col align-self-center">
                <h6 className="font-weight-bold mb-0">Create New Role</h6>
              </div>
            </div>
          </div>
          <form encType="multipart/form-data"
            onSubmit={e => {
              e.preventDefault();
              createRole({ variables: { 
                name: name,
                email: email,
                password: password,
                phone: phone,
                roleTypeID: roleTypeID,
                dashboard: dashboard,
                roles: roles,
                archive: archive,
                promocodes: promocodes,
                business: business,
                commute: commute,
                ondemand: ondemand,
                communication: communication,
                fleet: fleet,
                payment: payment,
                cancellation: cancellation,
              } });
            }}
            >
            <div id="dialog-body" className="px-4 pt-4 pb-3">
              <div className="form-row pl-1">
                <p className="font-weight-bold">
                  Basic Information
                </p>
              </div>
              <div className="form-row">
                <div className="form-group col-md-4">
                  <label htmlFor="name">Name</label>
                  <input type="text" 
                    name="name" id="name" 
                    className="form-control" autoComplete="off" 
                    placeholder="Display Name"
                    onChange={(e) => setName(e.target.value)}
                    value={name} 
                  />
                </div>
                <div className="form-group col-md-4">
                  <label htmlFor="phone">Phone</label>
                  <input type="text" 
                    name="phone" id="phone" 
                    className="form-control" autoComplete="off" 
                    placeholder="Phone"
                    onChange={(e) => setPhone(e.target.value)}
                    value={phone} 
                  />
                </div>
                <div className="form-group col-md-4">
                  <label htmlFor="email">Email</label>
                  <input type="email" 
                    name="email" id="email" 
                    className="form-control" autoComplete="off" 
                    placeholder="Email"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email} 
                  />
                </div>
                <div className="form-group col-md-4">
                  <label htmlFor="password">Password</label>
                  <input type="password" 
                    name="password" id="password" 
                    className="form-control" autoComplete="off" 
                    placeholder="Use 8 or more characters"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password} 
                  />
                </div>
                <div className="form-group col-md-4">
                  <label htmlFor="passwordConfirmation">rePassword</label>
                  <input type="password" 
                    name="passwordConfirmation" id="passwordConfirmation" 
                    className="form-control" autoComplete="off" 
                    placeholder="Password Again"
                    onChange={(e) => setRePassword(e.target.value)}
                    value={rePassword} 
                  />
                </div>
                <div className="form-group col-md-4">
                  <label htmlFor="roleType">Role Type</label>
                  <select name="roleType" id="roleType" 
                    className="form-control"
                    onChange={(e) => setRoleTypeID(e.target.value)}
                    value={roleTypeID} >
                    <option value="">{loading ? "Loading role types" : "Select Role Type"}</option>
                    {data && data.roleTypes && data.roleTypes.map((roleType) => (
                      <option key={roleType.id} value={roleType.id}>{roleType.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-row mt-2 pl-1">
                <p className="font-weight-bold">
                  Access Control
                </p>
              </div>
              <div className="form-row">
                <div className="form-group col-md-4">
                  <div className="custom-control custom-switch">
                    <input type="checkbox" 
                      className="custom-control-input" id="dashboard"
                      onChange={() => setDashboard(!dashboard)}
                      value={dashboard}
                      checked={dashboard} />
                    <label className="custom-control-label" htmlFor="dashboard">Dashboard</label>
                  </div>
                </div>
                <div className="form-group col-md-4">
                  <div className="custom-control custom-switch">
                    <input type="checkbox" className="custom-control-input" id="roles"
                      onChange={() => setRoles(!roles)}
                      value={roles}
                      checked={roles} />
                    <label className="custom-control-label" htmlFor="roles">Roles</label>
                  </div>
                </div>
                <div className="form-group col-md-4">
                  <div className="custom-control custom-switch">
                    <input type="checkbox" className="custom-control-input" id="archive" 
                      onChange={() => setArchive(!archive)}
                      value={archive}
                      checked={archive} />
                    <label className="custom-control-label" htmlFor="archive">Archive</label>
                  </div>
                </div>
                <div className="form-group col-md-4">
                  <div className="custom-control custom-switch">
                    <input type="checkbox" className="custom-control-input" id="communication" 
                      onChange={() => setCommunication(!communication)}
                      value={communication}
                      checked={communication} />
                    <label className="custom-control-label" htmlFor="communication">Communication</label>
                  </div>
                </div>
                <div className="form-group col-md-4">
                  <div className="custom-control custom-switch">
                    <input type="checkbox" className="custom-control-input" id="promoCodes" 
                      onChange={() => setPromocodes(!promocodes)}
                      value={promocodes}
                      checked={promocodes} />
                    <label className="custom-control-label" htmlFor="promoCodes">Promo Codes</label>
                  </div>
                </div>
                <div className="form-group col-md-4">
                  <div className="custom-control custom-switch">
                    <input type="checkbox" className="custom-control-input" id="qruzBusiness" 
                      onChange={() => setBusiness(!business)}
                      value={business}
                      checked={business} />
                    <label className="custom-control-label" htmlFor="qruzBusiness">Qruz Business</label>
                  </div>
                </div>
                <div className="form-group col-md-4">
                  <div className="custom-control custom-switch">
                    <input type="checkbox" className="custom-control-input" id="qruzCommute" 
                      onChange={() => setCommute(!commute)}
                      value={commute}
                      checked={commute} />
                    <label className="custom-control-label" htmlFor="qruzCommute">Qruz Commute</label>
                  </div>
                </div>
                <div className="form-group col-md-4">
                  <div className="custom-control custom-switch">
                    <input type="checkbox" className="custom-control-input" id="qruzOnDemand" 
                      onChange={() => setOndemand(!ondemand)}
                      value={ondemand}
                      checked={ondemand} />
                    <label className="custom-control-label" htmlFor="qruzOnDemand">Qruz On-Demand</label>
                  </div>
                </div>
                <div className="form-group col-md-4">
                  <div className="custom-control custom-switch">
                    <input type="checkbox" className="custom-control-input" id="fleet" 
                      onChange={() => setFleet(!fleet)}
                      value={fleet}
                      checked={fleet} />
                    <label className="custom-control-label" htmlFor="fleet">Fleet</label>
                  </div>
                </div>
                <div className="form-group col-md-4">
                  <div className="custom-control custom-switch">
                    <input type="checkbox" className="custom-control-input" id="payments" 
                      onChange={() => setPayment(!payment)}
                      value={payment}
                      checked={payment} />
                    <label className="custom-control-label" htmlFor="payments">Payments</label>
                  </div>
                </div>
                <div className="form-group col-md-4">
                  <div className="custom-control custom-switch">
                    <input type="checkbox" className="custom-control-input" id="cancellation" 
                      onChange={() => setCancellation(!cancellation)}
                      value={cancellation}
                      checked={cancellation} />
                    <label className="custom-control-label" htmlFor="cancellation">Cancellation</label>
                  </div>
                </div>
              </div>
            </div>
            {mutationFeedback}
            <div id="dialog-footer" className="px-4 pb-4">
              <button type="submit"
                className="btn btn-sm btn-outline-primary"
                disabled={btnDisabled}>{button}
              </button>
              <button type="button" className="btn btn-sm btn-outline-secondary ml-2"
                onClick={() => props.createModal(false)}>Dismiss</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CreateRole
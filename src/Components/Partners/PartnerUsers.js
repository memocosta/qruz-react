import React, {useState} from 'react'
import gql from 'graphql-tag'
import { useQuery } from '@apollo/react-hooks'
import CreatePartnerUser from './CreatePartnerUser'
import EditPartnerUser from './EditPartnerUser'
import DeletePartnerUser from './DeletePartnerUser'

const GET_PARTNER_USERS = gql`
  query getPartnerUsers($partner_id: ID!) {
    partnerUsers(partner_id: $partner_id) {
      id
      name
      email
      phone
      position
      avatar
    }
  }
`;

const BUSINESS = gql`{ businessPerm @client }`;
const PARTNER_ID = gql`{ partnerID @client }`;

const PartnerUsers = (props) => {
  const [deletePartnerUserID, setDeletePartnerUserID] = useState('');
  const [editPartnerUserID, setEditPartnerUserID] = useState('');
  const [createPartnerUserModal, setCreatePartnerUserModal] = useState(false);
  const [editPartnerUserModal, setEditPartnerUserModal] = useState(false);
  const [deletePartnerUserModal, setDeletePartnerUserModal] = useState(false);
  const [filterStr, setFilterStr] = useState('');

  const { data: business } = useQuery(BUSINESS)
  const { data: partner } = useQuery(PARTNER_ID)
  
  const { loading, error, data } = useQuery(GET_PARTNER_USERS, {
    variables: { partner_id: partner.partnerID ? partner.partnerID : props.partnerID}
  });

  if (business && !business.businessPerm && !partner.partnerID) return <p className='alert alert-warning fadeInUp'><strong>Bummer!</strong> You are not authorized to access this feature. If you have an issues or need to report a bug, shoot us an email at <em>support@qruz.app</em> and we'll help you out.</p>;

  const handleEditModal = (userID) => {
    setEditPartnerUserModal(true)
    setEditPartnerUserID(userID)
  }

  const handleDeleteModal = (userID) => {
    setDeletePartnerUserModal(true)
    setDeletePartnerUserID(userID)
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
                onClick={() => setCreatePartnerUserModal(true)}>
                New User
              </button>
            </div>
          </div>
        </div>
      </div>
      {data && data.partnerUsers && data.partnerUsers.length === 0 &&
      <div className="card border-0 mb-4">
        <div className="card-body">
          <p className="text-center text-muted mb-0">
            No empolyees.
          </p>
        </div>
      </div>
      }
      {data && data.partnerUsers && data.partnerUsers.length > 0 &&
        <div className="row">
          {data.partnerUsers.filter(user => user.name.toLowerCase().includes(filterStr.toLowerCase())).map((user) => (
            <div className="col-md-4" key={user.id}>
              <div className="card border-0 mb-4">
                <div className="card-body">
                  <div className="row justify-content-between">
                    <div className="col-auto">
                      {user.avatar &&
                        <div className="image-cover image-cover-md rounded" 
                          style={{ backgroundImage: "url("+user.avatar+")"}}
                        ></div>
                      }
                      {!user.avatar &&
                        <span className="placeholder rounded placeholder-md bg-teal text-white">
                          {user.name.substring(0,2).toUpperCase()}
                        </span>
                      }
                    </div>
                    <div className="col align-self-center">
                      <h4 className="mb-1 font-weight-bold">
                        { user.name }
                      </h4>
                      <p className="text-muted mb-0">{ user.position ? user.position : "has no position yet" }</p>
                      <div className="mt-3">
                        <button type="button" className="btn btn-sm btn-light mr-2"
                          onClick={() => handleEditModal(user.id)}>Edit
                        </button>
                        {editPartnerUserModal && editPartnerUserID === user.id &&
                          <EditPartnerUser 
                            partnerID={partner.partnerID ? partner.partnerID : props.partnerID} 
                            user={user} 
                            editModal={setEditPartnerUserModal} 
                          />
                        }
                        <button type="button"
                          onClick={() => handleDeleteModal(user.id)}
                          className="btn btn-sm btn-light">Del
                        </button>
                        {deletePartnerUserModal && deletePartnerUserID === user.id &&
                          <DeletePartnerUser
                            userID={user.id} 
                            userName={user.name} 
                            partnerID={partner.partnerID ? partner.partnerID : props.partnerID}
                            deleteModal={setDeletePartnerUserModal} 
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
      {createPartnerUserModal &&
        <CreatePartnerUser partnerID={partner.partnerID ? partner.partnerID : props.partnerID} createModal={setCreatePartnerUserModal} />
      }
    </div>
  )
}

export default PartnerUsers
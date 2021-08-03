import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import gql from 'graphql-tag'
import { useQuery } from '@apollo/react-hooks'
import CreatePartner from './CreatePartner'
import EditPartner from './EditPartner'
import DeletePartner from './DeletePartner'

const BUSINESS = gql`{ businessPerm @client }`;
 
const GET_PARTNERS = gql`
  {
    partners {
      id
      name
      email
      phone1
      phone2
      type
      size
      max_no_of_trips
      license_expires_on
      logo
    }
  }
`;

const PartnerList = () => {
  const [deletePartnerID, setDeletePartnerID] = useState('');
  const [editPartnerID, setEditPartnerID] = useState('');
  const [createPartnerModal, setCreatePartnerModal] = useState(false);
  const [editPartnerModal, setEditPartnerModal] = useState(false);
  const [deletePartnerModal, setDeletePartnerModal] = useState(false);
  const [filterStr, setFilterStr] = useState(''); 

  const { data: business } = useQuery(BUSINESS)
  const { loading, error, data } = useQuery(GET_PARTNERS);

  if (business && !business.businessPerm) return <p className='alert alert-warning fadeInUp'><strong>Bummer!</strong> You are not authorized to access this feature. If you have an issues or need to report a bug, shoot us an email at <em>support@qruz.app</em> and we'll help you out.</p>; 

  const handleEditModal = (partnerID) => {
    setEditPartnerModal(true)
    setEditPartnerID(partnerID)
  }

  const handleDeleteModal = (partnerID) => {
    setDeletePartnerModal(true)
    setDeletePartnerID(partnerID)
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
                onClick={() => setCreatePartnerModal(true)}>
                New Partner
              </button>
            </div>
          </div>
        </div>
      </div>
      {data && data.partners && data.partners.length === 0 &&
        <div className="card border-0 mb-4">
          <div className="card-body">
            <p className="text-center text-muted mb-0">
              No partners.
            </p>
          </div>
        </div>
      }
      {data && data.partners && data.partners.length > 0 &&
        <div className="row">
          {data.partners.filter(partner => partner.name.toLowerCase().includes(filterStr.toLowerCase())).map((partner) => (
            <div className="col-md-4" key={partner.id}>
              <div className="card border-0 mb-4">
                <div className="card-body">
                  <div className="row justify-content-between">
                    <div className="col-auto">
                      {partner.logo &&
                        <div className="image-cover image-cover-md rounded" 
                          style={{ backgroundImage: "url("+partner.logo+")"}}
                        ></div>
                      }
                      {!partner.logo &&
                        <span className="placeholder rounded placeholder-md bg-teal text-white">
                          {partner.name.substring(0,2).toUpperCase()}
                        </span>
                      }
                    </div>
                    <div className="col align-self-center">
                      <h4 className="mb-1 font-weight-bold">
                        <Link to={`/business/partners/${partner.id}/view`}>
                          { partner.name }
                        </Link>
                      </h4>
                      <p className="text-muted mb-0">{ partner.type }</p>
                      <div className="mt-3">
                        <Link to={`/business/partners/${partner.id}/view`} className="btn btn-sm btn-light mr-2">
                          View
                        </Link>
                        <button type="button" 
                          className="btn btn-sm btn-light mr-2"
                          onClick={() => handleEditModal(partner.id)}>
                          Edit
                        </button>
                        {editPartnerModal && editPartnerID === partner.id &&
                          <EditPartner
                            partner={partner} 
                            editModal={setEditPartnerModal} 
                          />
                        }
                        <button type="button"
                          onClick={() => handleDeleteModal(partner.id)}
                          className="btn btn-sm btn-light">Del
                        </button>
                        {deletePartnerModal && deletePartnerID === partner.id &&
                          <DeletePartner
                            partnerID={partner.id} 
                            partnerName={partner.name} 
                            deleteModal={setDeletePartnerModal} 
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
      {createPartnerModal &&
        <CreatePartner createModal={setCreatePartnerModal} />
      }
    </div>
  )
}

export default PartnerList
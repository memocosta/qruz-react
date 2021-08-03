import React, { useState } from 'react'
import gql from 'graphql-tag'
import { useQuery, useMutation } from '@apollo/react-hooks'

const CREATE_PARTNER_TRIP_USERS = gql`
  mutation CreatePartnerTripUser(
    $tripID: ID!
    $subscriptionCode: String!
    $userID: [ID!]!
  ) {
    createPartnerTripUser(
      input: {
        trip_id: $tripID
        user_id: $userID
        subscription_code: $subscriptionCode
      }
    ) {
      status
    }
  }
`;

const GET_PARTNER_TRIP_USERS = gql`
  query getPartnerTripUsers($partner_id: ID!, $trip_id: ID!, $status: String!) {
    partnerTripUsers(input: {
      partner_id: $partner_id, 
      trip_id: $trip_id, 
      status: $status
    }) {
      id
      name
      avatar
    }
  }
`;

const PartnerTripNotSubbedUsers = (props) => {
  const [userID, setUserID] = useState([]);
  const [filterStr, setFilterStr] = useState('');

  const { loading, error, data, refetch } = useQuery(GET_PARTNER_TRIP_USERS, {
    variables: { 
      partner_id: props.partnerID,
      trip_id: props.tripID,
      status: "notSubscribed"
    }
  });

  const [ 
    createPartnerTripUser,
    { loading: mutationLoading },
  ] = useMutation(
    CREATE_PARTNER_TRIP_USERS, 
    {
      update: (store) => {
        const dataNotSubscribed = store.readQuery({ 
          query: GET_PARTNER_TRIP_USERS,
          variables: { 
            partner_id: props.partnerID,
            trip_id: props.tripID,
            status: "notSubscribed"
          }
        });   

        const newData = dataNotSubscribed.partnerTripUsers.filter(user => !userID.includes(user.id));
        
        store.writeQuery({ 
          query: GET_PARTNER_TRIP_USERS,
          variables: { 
            partner_id: props.partnerID,
            trip_id: props.tripID,
            status: "notSubscribed"
          },
          data: {partnerTripUsers: newData}
        });

        try {
          const dataNotVerified = store.readQuery({ 
            query: GET_PARTNER_TRIP_USERS,
            variables: { 
              partner_id: props.partnerID,
              trip_id: props.tripID,
              status: "notVerified"
            }
          });
          
          const sent = dataNotSubscribed.partnerTripUsers.filter(user => userID.includes(user.id));

          store.writeQuery({ 
            query: GET_PARTNER_TRIP_USERS,
            variables: { 
              partner_id: props.partnerID,
              trip_id: props.tripID,
              status: "notVerified"
            },
            data: {partnerTripUsers: dataNotVerified.partnerTripUsers.concat(sent)}
          });
        } catch (err) {
          console.log("No cache for not verified users");
        }
      }, 
      onCompleted() {
        setUserID([])
      }
    }
  );

  const subscribeBtnDisabled = () => mutationLoading || !userID.length ? true : false
  const subscribeBtnText = () => mutationLoading ? "Saving.." : "Invite"

  const handleSelectUser = (user) => {
    if (userID.includes(user)) {
      const newUserID = userID.filter(id => id !== user)
      setUserID(newUserID)
    } else {
      setUserID([...userID, user])
    }
  }

  const hasData = () => data && data.partnerTripUsers && data.partnerTripUsers.length > 0

  const allSelected = () => userID.length === data.partnerTripUsers.length

  const selectDeselectAll = () => {
    if (allSelected()) {
      setUserID([])
    } else {
      let newUserID = []
      data.partnerTripUsers.map((user) => newUserID.push(user.id))
      setUserID(newUserID)
    }
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
              <button type="button" className="btn btn-sm btn-outline-primary mr-2" 
                onClick={() => refetch()}>
                Refetch
              </button>
              <button type="button" 
                disabled={!hasData()}
                className="btn btn-sm btn-outline-primary mr-2"
                onClick={() => selectDeselectAll()}>
                {allSelected() && hasData() ? "Deselect All" : "Select All"}
              </button>
              <button type="button"
                disabled={subscribeBtnDisabled()}
                onClick={() => {
                  createPartnerTripUser({
                    variables: {
                      tripID: props.tripID,
                      subscriptionCode: props.subscriptionCode,
                      userID: userID
                    }
                  });
                }}
                className="btn btn-sm btn-outline-primary">{subscribeBtnText()}
              </button> 
            </div>
          </div>
        </div>
      </div>
      {!hasData() &&
      <div className="card border-0 mb-4">
        <div className="card-body">
          <p className="text-center text-muted mb-0">
            No empolyees.
          </p>
        </div>
      </div>
      }
      {hasData() &&
        <div className="row">
          {data.partnerTripUsers.filter(user => user.name.toLowerCase().includes(filterStr.toLowerCase())).map((user) => (
            <div className="col-md-4" key={user.id}>
              <div className={"card border-0 mb-4 clickable" + (userID.includes(user.id) ? " selected" : "")}
                onClick={() => handleSelectUser(user.id)}>
                <div className="card-body">
                  <div className="row">
                    <div className="col-auto align-self-center">
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
                      <h5 className="mb-0 font-weight-bold">
                        { user.name }
                      </h5>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          </div>
        }
      </div>
    )
  }

export default PartnerTripNotSubbedUsers
import React, { useState } from 'react'
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import Photo from '../Photo';

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

const CREATE_USER = gql`
  mutation CreatePartnerUser(
    $name: String!
    $email: String!
    $partnerID: ID
    $phone: String
    $position: String
    $avatar: Upload
  ) {
    createUser(
      input: {
        name: $name
        email: $email
        partner_id: $partnerID
        phone: $phone
        position: $position
        avatar: $avatar
      }
    ) {
      user {
        id
        name
        email
        phone
        position
        avatar
      }
    }
  }
`;

const CreatePartnerUser = (props) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [position, setPosition] = useState('');
  const [file, setFile] = useState('');

  const [
    createUser,
    { loading: mutationLoading, error: mutationError },
  ] = useMutation(
    CREATE_USER,
    {
      update: (store, { data: { createUser } }) => {
        const data = store.readQuery({ 
          query: GET_PARTNER_USERS,
          variables: { partner_id: props.partnerID}
         });

        data.partnerUsers.push(createUser.user);

        store.writeQuery({ 
          query: GET_PARTNER_USERS,
          variables: { partner_id: props.partnerID}, 
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
      && email
      && phone
      && !mutationLoading
  ) {
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
    mutationFeedback = <p className='alert alert-danger mb-4 rounded-0'>Bummer! Oh no, we weren't able to add this user. Please try again, if the issue persists, kindly shoot us an email at <em>support@qruz.app</em> and we'll help you out.</p>
  }

  return (
    <div className="dialog-mask">
      <div className="dialog-wrapper dialog-md bg-white rounded-top rounded-bottom">
        <div className="dialog-container">
          <div id="dialog-header" className="bg-gradient text-white px-4 py-1 rounded-top"></div>
          <form encType="multipart/form-data"
            onSubmit={e => {
              e.preventDefault();
              createUser({ variables: { 
                name: name,
                email: email,
                partnerID: props.partnerID,
                phone: phone,
                position: position,
                avatar: file
              } });
            }}
            >
            <div id="dialog-body" className="px-4 pt-4 pb-3">
              <div className="text-center mb-2">
                <Photo photo={null} newPhoto={setFile} />
              </div>
              <div className="form-row">
                <div className="form-group col-md-4">
                  <label htmlFor="name">Name</label>
                  <input type="text" name="name" id="name" 
                    className="form-control" autoComplete="off" 
                    placeholder="Display Name" 
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                  />
                </div>
                <div className="form-group col-md-4">
                  <label htmlFor="email">Email</label>
                  <input type="email" name="email" id="email" 
                    className="form-control" autoComplete="off" 
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    placeholder="Email"
                  />
                </div>
                <div className="form-group col-md-4">
                  <label htmlFor="phone">Phone</label>
                  <input type="text" name="phone" 
                    id="phone" className="form-control" 
                    autoComplete="off" placeholder="Mobile Number"
                    onChange={(e) => setPhone(e.target.value)}
                    value={phone}
                  />
                </div>
                <div className="form-group col-md-4">
                  <label htmlFor="position">Title</label>
                  <input type="text" name="position" 
                    id="position" className="form-control" 
                    autoComplete="off" placeholder="e.g., CEO, COO, CFO, etc."
                    onChange={(e) => setPosition(e.target.value)}
                    value={position}
                  />
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

export default CreatePartnerUser
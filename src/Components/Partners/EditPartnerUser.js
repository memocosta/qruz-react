import React, { useState } from 'react'
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import Photo from '../Photo';

const UPDATE_USER = gql`
  mutation EditPartnerUser(
    $id: ID!
    $name: String!
    $email: String!
    $phone: String
    $position: String
    $avatar: Upload
  ) {
    updateUser(
      input: {
        id: $id
        name: $name
        email: $email
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

const EditPartnerUser = (props) => {
  const [name, setName] = useState(props.user.name);
  const [email, setEmail] = useState(props.user.email);
  const [phone, setPhone] = useState(props.user.phone || '');
  const [position, setPosition] = useState(props.user.position || '');
  const [file, setFile] = useState('');
  const avatar = props.user.avatar || '';
  
  const [
    updateUser,
    { loading: mutationLoading, error: mutationError },
  ] = useMutation(
    UPDATE_USER,
    {
      onCompleted() {
        props.editModal(false)
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
    mutationFeedback = <p className='alert alert-danger mb-4 rounded-0'>Bummer! Oh no, we weren't able to save the changes. Please try again, if the issue persists, kindly shoot us an email at <em>support@qruz.app</em> and we'll help you out.</p>
  }

  return (
    <div className="dialog-mask">
      <div className="dialog-wrapper dialog-md bg-white rounded-top rounded-bottom">
        <div className="dialog-container">
          <div id="dialog-header" className="rounded-top py-1 bg-gradient"></div>
          <form encType="multipart/form-data"
            onSubmit={e => {
              e.preventDefault();
              updateUser({ variables: { 
                id: props.user.id,
                name: name,
                email: email,
                phone: phone,
                position: position,
                avatar: file
              } });
            }}
            >
            <div id="dialog-body" className="px-4 pt-4 pb-3">
              <div className="text-center mb-2">
                <Photo photo={avatar} newPhoto={setFile} />
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
                  <label htmlFor="phone">Phone</label>
                  <input type="text" name="phone" 
                    id="phone" className="form-control" 
                    autoComplete="off" placeholder="Mobile Number"
                    onChange={(e) => setPhone(e.target.value)}
                    value={phone}
                  />
                </div>
                <div className="form-group col-md-4">
                  <label htmlFor="email">Email</label>
                  <input type="email" name="email" id="email" 
                    className="form-control" autoComplete="off" 
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    placeholder="example@example.com"
                  />
                </div>
                <div className="form-group col-md-4">
                  <label htmlFor="position">Position</label>
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
                onClick={() => props.editModal(false)}>Dismiss</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default EditPartnerUser
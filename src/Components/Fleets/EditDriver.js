import React, { useState } from 'react'
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import Photo from '../Photo';

const UPDATE_DRIVER = gql`
  mutation UpdateDriver(
    $id: ID!
    $name: String!
    $phone: String!
    $email: String
    $licenseExpiresOn: Date
    $avatar: Upload
  ) {
    updateDriver(
      input: {
        id: $id
        name: $name
        phone: $phone
        email: $email
        license_expires_on: $licenseExpiresOn
        avatar: $avatar
      }
    ) {
      id
      name
      email
      phone
      status
      license_expires_on
      avatar
    }
  }
`;

const EditDriver = (props) => {
  const leo = props.driver.license_expires_on ? props.driver.license_expires_on.split('-') : null
  const [name, setName] = useState(props.driver.name);
  const [email, setEmail] = useState(props.driver.email);
  const [phone, setPhone] = useState(props.driver.phone);
  const [expDay, setExpDay] = useState(leo ? parseInt(leo[2]) : '');
  const [expMonth, setExpMonth] = useState(leo ? parseInt(leo[1]) : '');
  const [expYear, setExpYear] = useState(leo ? leo[0] : '');
  const [file, setFile] = useState('');
  const avatar = props.driver.avatar ? props.driver.avatar : ''

  const [
    updateDriver,
    { loading: mutationLoading, error: mutationError },
  ] = useMutation(
    UPDATE_DRIVER,
    {
      onCompleted() {
        props.editModal(false)
      }
    }
  );

  let btnDisabled = true;
  if (name 
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
    mutationFeedback = <p className='alert alert-danger mb-4 rounded-0'>Bummer! Oh no, we weren't able to save changes made on this driver. Please try again, if the issue persists, please shoot us an email at <em>support@qruz.app</em> and we'll help you out.</p>
  }

  const licenseExpiry = (expYear && expMonth && expDay) ? expYear + '-' + expMonth + '-' + expDay : '';

  const days = [];
  const months = [];
  const years = [];
  const currentYear = new Date().getFullYear();
  for (let i = 1; i <= 31; i++) { days.push(i) }
  for (let i = 1; i <= 12; i++) { months.push(i) }
  for (let i = currentYear; i <= currentYear + 3; i++) { years.push(i) }
  
  return (
    <div className="dialog-mask">
      <div className="dialog-wrapper dialog-md bg-white rounded-top rounded-bottom">
        <div className="dialog-container">
          <div id="dialog-header" className="rounded-top py-1 bg-gradient"></div>
          <form encType="multipart/form-data"
            onSubmit={e => {
              e.preventDefault();
              updateDriver({ variables: { 
                id: props.driver.id,
                name: name,
                email: email,
                fleetID: props.fleetID,
                phone: phone,
                licenseExpiresOn: licenseExpiry,
                avatar: file
              } });
            }}>
            <div id="dialog-body" className="px-4 pt-4 pb-4">
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
                  <label htmlFor="email">Email</label>
                  <input type="email" name="email" id="email" 
                    className="form-control" autoComplete="off" 
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    placeholder="andrew@example.com"
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
              </div>
              <div className="form-row">
                <p className="mb-2 ml-1 font-weight-custom">
                  License Expires On
                </p>
              </div>
              <div className="form-row">
                <div className="form-group col-md-2">
                  <select name="licenseExpDay" id="licenseExpDay" 
                    className="form-control"
                    onChange={(e) => setExpDay(e.target.value)}
                    value={expDay}
                  >
                    <option value="">Day</option>
                    {days.map((day) => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group col-md-2">
                  <select name="licenseExpMonth" id="licenseExpMonth" 
                    className="form-control"
                    onChange={(e) => setExpMonth(e.target.value)}
                    value={expMonth}
                  >
                    <option value="">Month</option>
                    {months.map((month) => (
                      <option key={month} value={month}>{month}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group col-md-2">
                  <select name="licenseExpYear" id="licenseExpYear" 
                    className="form-control"
                    onChange={(e) => setExpYear(e.target.value)}
                    value={expYear}
                  >
                    <option value="">Year</option>
                    {years.map((year) => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
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

export default EditDriver
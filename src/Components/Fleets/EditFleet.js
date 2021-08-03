import React, { useState } from 'react'
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import Photo from '../Photo'; 
 
const UPDATE_FLEET = gql`
  mutation UpdateFleet(
    $id: ID!
    $name: String!
    $email: String
    $phone: String!
    $max_no_of_cars: Int
    $expires_on: Date
    $avatar: Upload
  ) {
    updateFleet(
      input: {
        id: $id
        name: $name
        email: $email
        phone: $phone
        max_no_of_cars: $max_no_of_cars
        expires_on: $expires_on
        avatar: $avatar
      }
    ) {
      id
      name
      email
      phone
      max_no_of_cars
      expires_on
      avatar
    }
  }
`;

const EditFleet = (props) => {
  const aeo = props.fleet.expires_on ? props.fleet.expires_on.split('-') : null
  const [name, setName] = useState(props.fleet.name);
  const [email, setEmail] = useState(props.fleet.email);
  const [phone, setPhone] = useState(props.fleet.phone || '');
  const [maxNoOfCars, setMaxNoOfCars] = useState(props.fleet.max_no_of_cars || '');
  const [expDay, setExpDay] = useState(aeo ? parseInt(aeo[2]) : '');
  const [expMonth, setExpMonth] = useState(aeo ? parseInt(aeo[1]) : '');
  const [expYear, setExpYear] = useState(aeo ? parseInt(aeo[0]) : '');
  const [file, setFile] = useState('');
  const avatar = props.fleet.avatar || '';

  const [
    updateFleet,
    { loading, error },
  ] = useMutation(
    UPDATE_FLEET,
    {
      onCompleted() {
        props.editModal(false)
      }
    }
  );

  let btnDisabled = true;
  if (name && phone && !loading) btnDisabled = false

  let button;
  if (loading) {
    button = "Saving.."
  } else {
    button = "Save"
  }

  let mutationFeedback;

  if (error) {
    mutationFeedback = <p className='alert alert-danger mb-4 rounded-0'>Bummer! Oh no, we weren't able to save changes made on this fleet. Please try again, if the issue persists, please shoot us an email at <em>support@qruz.app</em> and we'll help you out.</p>
  }

  const days = [];
  const months = [];
  const years = [];
  const currentYear = new Date().getFullYear();
  for (let i = 1; i <= 31; i++) { days.push(i) }
  for (let i = 1; i <= 12; i++) { months.push(i) }
  for (let i = currentYear; i <= currentYear + 10; i++) { years.push(i) }

  return (
    <div className="dialog-mask">
      <div className="dialog-wrapper dialog-md bg-white rounded-top rounded-bottom">
        <div className="dialog-container">
          <div id="dialog-header" className="rounded-top py-1 bg-gradient"></div>
          <form encType="multipart/form-data"
            onSubmit={e => {
              e.preventDefault();
              updateFleet({ variables: { 
                id: props.fleet.id,
                name: name,
                email: email,
                phone: phone,
                max_no_of_cars: maxNoOfCars ? maxNoOfCars : null,
                expires_on: (expYear && expMonth && expDay) ? expYear + '-' + expMonth + '-' + expDay : null,
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
                    placeholder="Email"
                  />
                </div>
                <div className="form-group col-md-4">
                  <label htmlFor="email">Phone</label>
                  <input type="number" name="phone" 
                    id="phone" className="form-control" 
                    autoComplete="off" placeholder="Phone"
                    onChange={(e) => setPhone(e.target.value)}
                    value={phone}
                  />
                </div>
                <div className="form-group col-md-4">
                  <label htmlFor="maxNoOfCars">Maximum No. of cars</label>
                  <select name="maxNoOfCars" 
                    id="maxNoOfCars" className="form-control"
                    onChange={(e) => setMaxNoOfCars(e.target.value)}
                    value={maxNoOfCars}
                  >
                    <option value="">Select One</option>
                    <option value="10">10</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                    <option value="500">500</option>
                    <option value="1000">1000</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <p className="mb-2 ml-1 font-weight-custom">
                  Account Expires On
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

export default EditFleet
import React, { useState } from 'react'
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import Photo from '../Photo';

const GET_FLEETS = gql`
  query getFleets($first: Int!, $page: Int, $field: String!, $order: SortOrder!) {
    fleets(first: $first, page: $page, orderBy: [
    {
      field: $field
      order: $order
    }
    ]) {
      data {
        id
        name
        phone
        email
        max_no_of_cars
        expires_on
        avatar
      }
      paginatorInfo {
        currentPage
        lastPage
      }
    }
  }
`;

const CREATE_FLEET = gql`
  mutation CreateFleet(
    $name: String!
    $phone: String!
    $email: String
    $max_no_of_cars: Int
    $expires_on: Date
    $avatar: Upload
  ) {
    createFleet(
      input: {
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

const CreateFleet = (props) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [maxNoOfCars, setMaxNoOfCars] = useState('');
  const [expDay, setExpDay] = useState('');
  const [expMonth, setExpMonth] = useState('');
  const [expYear, setExpYear] = useState('');
  const [file, setFile] = useState('');

  const [
    createFleet,
    { loading: mutationLoading, error: mutationError },
  ] = useMutation(
    CREATE_FLEET,
    {
      update: (store, { data: { createFleet } }) => {
        const data = store.readQuery({ 
          query: GET_FLEETS,
          variables: { 
            first: props.perPage,
            page: props.page,
            field: props.sort,
            order: props.order
          },
         });

        data.fleets.data.push(createFleet); 

        store.writeQuery({ 
          query: GET_FLEETS,
          variables: { 
            first: props.perPage,
            page: props.page,
            field: props.sort,
            order: props.order
          },
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
    mutationFeedback = <p className='alert alert-danger mb-4 rounded-0'>Bummer! Oh no, we weren't able to create this fleet. Please try again, if the issue persists, please shoot us an email at <em>support@qruz.app</em> and we'll help you out.</p>
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
          <div id="dialog-header" className="bg-gradient px-4 py-1 rounded-top"></div>
          <form encType="multipart/form-data"
            onSubmit={e => {
              e.preventDefault();
              createFleet({ variables: { 
                name: name,
                email: email,
                phone: phone,
                max_no_of_cars: maxNoOfCars,
                expires_on: expYear + '-' + expMonth + '-' + expDay,
                avatar: file
              } });
            }}>
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
                <div className="form-group col-4 col-md-3 col-lg-2">
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
                <div className="form-group col-4 col-md-3 col-lg-2">
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
                <div className="form-group col-4 col-md-3 col-lg-2">
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
                onClick={() => props.createModal(false)}>Dismiss</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CreateFleet
import React, { useState } from 'react'
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import Photo from '../Photo';

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

const CREATE_PARTNER = gql`
  mutation createPartner(
    $name: String!
    $email: String!
    $password: String!
    $phone1: String
    $phone2: String
    $type: String
    $size: String
    $maxNoOfTrips: Int
    $licenseExpiresOn: Date
    $logo: Upload
  ) {
    createPartner(
      input: {
        name: $name
        email: $email
        password: $password
        phone1: $phone1
        phone2: $phone2
        type: $type
        size: $size
        max_no_of_trips: $maxNoOfTrips
        license_expires_on: $licenseExpiresOn
        logo: $logo
      }
    ) {
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

const CreatePartner = (props) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [phone1, setPhone1] = useState('');
  const [phone2, setPhone2] = useState('');
  const [type, setType] = useState('');
  const [size, setSize] = useState('');
  const [maxNoOfTrips, setMaxNoOfTrips] = useState('');
  const [licenseExpDay, setLicenseExpDay] = useState('');
  const [licenseExpMonth, setLicenseExpMonth] = useState('');
  const [licenseExpYear, setLicenseExpYear] = useState('');
  const [file, setFile] = useState('');

  const [
    createPartner,
    { loading: mutationLoading, error: mutationError },
  ] = useMutation(
    CREATE_PARTNER, 
    {
      update: (store, { data: { createPartner } }) => {
        const data = store.readQuery({ 
          query: GET_PARTNERS
         });

        data.partners.push(createPartner); 

        store.writeQuery({ 
          query: GET_PARTNERS,
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
      && password
      && password === rePassword
      && phone1
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
    mutationFeedback = <p className='alert alert-danger mb-4 rounded-0'>Bummer! Oh no, we weren't able to create this partner. Please try again, if the issue persists, please shoot us an email at <em>support@qruz.app</em> and we'll help you out.</p>
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
              createPartner({ variables: { 
                name: name,
                email: email,
                password: password,
                phone1: phone1,
                phone2: phone2,
                type: type,
                size: size,
                maxNoOfTrips: maxNoOfTrips,
                licenseExpiresOn: licenseExpYear + '-' + licenseExpMonth + '-' + licenseExpDay,
                logo: file
              } });
            }}
            >
            <div id="dialog-body" className="px-4 pt-4 pb-3">
              <div className="text-center mb-2">
                <Photo photo={null} newPhoto={setFile} />
              </div>
              <div className="form-row pl-1">
                <p className="font-weight-bold mb-2">
                  Basic Information
                </p>
              </div>
              <div className="form-row">
                <div className="form-group col-md-4">
                  <label htmlFor="name">Name</label>
                  <input type="text" name="name" id="name" 
                    className="form-control" autoComplete="off" 
                    placeholder="Organization Name" 
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                  />
                </div>
                <div className="form-group col-md-4">
                  <label htmlFor="phone1">Phone1</label>
                  <input type="text" name="phone1" 
                    id="phone1" className="form-control" 
                    autoComplete="off" placeholder="Phone"
                    onChange={(e) => setPhone1(e.target.value)}
                    value={phone1}
                  />
                </div>
                <div className="form-group col-md-4">
                  <label htmlFor="phone2">Phone2</label>
                  <input type="text" name="phone2" 
                    id="phone2" className="form-control" 
                    autoComplete="off" placeholder="Phone2"
                    onChange={(e) => setPhone2(e.target.value)}
                    value={phone2}
                  />
                </div>
                <div className="form-group col-md-4">
                  <label htmlFor="size">Organization Size</label>
                  <select name="size" 
                    id="size" className="form-control"
                    onChange={(e) => setSize(e.target.value)}
                    value={size}
                  >
                    <option value="">Select One</option>
                    <option value="Small">Small</option>
                    <option value="Medium">Medium</option>
                    <option value="Large">Large</option>
                    <option value="Enterprise">Enterprise</option>
                  </select>
                </div>
                <div className="form-group col-md-4">
                  <label htmlFor="maxNoOfTrips">Maximum No. of Trips</label>
                  <select name="maxNoOfTrips" 
                    id="maxNoOfTrips" className="form-control"
                    onChange={(e) => setMaxNoOfTrips(e.target.value)}
                    value={maxNoOfTrips}
                  >
                    <option value="">Select One</option>
                    <option value="10">10</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                    <option value="500">500</option>
                    <option value="1000">1000</option>
                  </select>
                </div>
                <div className="form-group col-md-4">
                  <label htmlFor="type">Type</label>
                  <select name="type" 
                    id="type" className="form-control"
                    onChange={(e) => setType(e.target.value)}
                    value={type}
                  >
                    <option value="">Select One</option>
                    <option value="Company">Company</option>
                    <option value="School">School</option>
                    <option value="Conference">Conference</option>
                    <option value="University">University</option>
                    <option value="Fleet Owner">Fleet Owner</option>
                    <option value="Private Group">Private Group</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <p className="mb-2 ml-1 font-weight-custom">
                  Valid until
                </p>
              </div>
              <div className="form-row mb-2">
                <div className="form-group col-4 col-md-3 col-lg-2">
                  <select name="licenseExpDay" id="licenseExpDay" 
                    className="form-control"
                    onChange={(e) => setLicenseExpDay(e.target.value)}
                    value={licenseExpDay}
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
                    onChange={(e) => setLicenseExpMonth(e.target.value)}
                    value={licenseExpMonth}
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
                    onChange={(e) => setLicenseExpYear(e.target.value)}
                    value={licenseExpYear}
                  >
                    <option value="">Year</option>
                    {years.map((year) => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-row pl-1">
                <p className="font-weight-bold mb-2">
                  Access Credentials
                </p>
              </div>
              <div className="form-row">
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
                  <label htmlFor="password">Password</label>
                  <input type="password" name="password" id="password" 
                    className="form-control" autoComplete="off" 
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    placeholder="Secret"
                  />
                </div>
                <div className="form-group col-md-4">
                  <label htmlFor="rePassword">rePassword</label>
                  <input type="password" name="rePassword" id="rePassword" 
                    className="form-control" autoComplete="off" 
                    onChange={(e) => setRePassword(e.target.value)}
                    value={rePassword}
                    placeholder="Password Again"
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

export default CreatePartner
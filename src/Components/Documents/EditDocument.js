import React, { useState } from 'react'
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';

const UPDATE_DOCUMENT = gql`
  mutation UpdateDocument(
    $id: ID!
    $name: String
    $expiresOn: Date
  ) {
    updateDocument(
      input: {
        id: $id
        name: $name
        expires_on: $expiresOn
      }
    ) {
      id
      name
      url
      expires_on
      documentable_id
      documentable_type
      updated_at
    }
  }
`;

const EditDocument = (props) => {
  const expiresOn = props.document.expires_on ? props.document.expires_on.split('-') : null
  const [name, setName] = useState(props.document.name);
  const [expDay, setExpDay] = useState(expiresOn ? parseInt(expiresOn[2]) : '');
  const [expMonth, setExpMonth] = useState(expiresOn ? parseInt(expiresOn[1]) : '');
  const [expYear, setExpYear] = useState(expiresOn ? expiresOn[0] : ''); 

  const [
    updateDocument,
    { loading: mutationLoading, error: mutationError },
  ] = useMutation(
    UPDATE_DOCUMENT,
    {
      onCompleted() {
        props.editModal(false)
      }
    }
  );

  let btnDisabled = true;
  if (name && !mutationLoading) btnDisabled = false

  let button;
  if (mutationLoading) {
    button = "Saving.."
  } else {
    button = "Save"
  }

  let mutationFeedback;

  if (mutationError) {
    mutationFeedback = <p className='alert alert-danger mb-4 rounded-0'>Bummer! Oh no, we weren't able to save changes made on this document. Please try again, if the issue persists, please shoot us an email at <em>support@qruz.app</em> and we'll help you out.</p>
  }

  const expiryDate = (expYear && expMonth && expDay) ? expYear + '-' + expMonth + '-' + expDay : '';

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
          <div id="dialog-header" className="bg-gradient text-white px-4 py-4 rounded-top">
            <div className="row justify-content-between">
              <div className="col align-self-center">
                <h6 className="font-weight-bold mb-0">Edit Document</h6>
              </div>
            </div>
          </div>
          <form encType="multipart/form-data"
            onSubmit={e => {
              e.preventDefault();
              updateDocument({ variables: { 
                id: props.document.id,
                name: name,
                expiresOn: expiryDate
              } });
            }}>
            <div id="dialog-body" className="px-4 pt-4 pb-4">
              <div className="form-row">
                <div className="form-group col-12">
                  <label htmlFor="name">Name</label>
                  <input type="text" name="name" id="name" 
                    className="form-control" autoComplete="off" 
                    placeholder="Display Name" 
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                  />
                </div>
              </div>
              <div className="form-row">
                <p className="mb-2 ml-1 font-weight-custom">
                  Expires On
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

export default EditDocument
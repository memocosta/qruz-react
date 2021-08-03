import React, { useState } from 'react'
import gql from 'graphql-tag';
import { useMutation, useQuery, useLazyQuery } from '@apollo/react-hooks';
import Photo from '../Photo';

const GET_VEHICLES = gql`
  query getVehicles($first: Int!, $page: Int, $field: String!, $order: SortOrder!) {
    vehicles(first: $first, page: $page, orderBy: [
    {
      field: $field
      order: $order
    } 
    ]) {
      data {
        id
        license_plate
        license_expires_on
        year
        photo
        make {
          id
          name
        }
        model {
          id
          name
        }
        type {
          id
          name
        }
      }
      paginatorInfo {
        currentPage
        lastPage
      }
    }
  }
`;

const CREATE_VEHICLE = gql`
  mutation CreateVehicle(
    $license_plate: String!
    $license_expires_on: Date!
    $car_type_id: ID!
    $car_make_id: ID!
    $car_model_id: ID!
    $year: String!
    $photo: Upload
  ) {
    createVehicle(
      input: {
        license_plate: $license_plate
        license_expires_on: $license_expires_on
        car_type_id: $car_type_id
        car_make_id: $car_make_id
        car_model_id: $car_model_id
        year: $year
        photo: $photo
      }
    ) {
      id
      license_plate
      license_expires_on
      year
      photo
      make {
        id
        name
      }
      model {
        id
        name
      }
      type {
        id
        name
      }
    }
  }
`;

const GET_CAR_TYPES = gql`
  {
    carTypes {
      id
      name
    }
  }
`;

const GET_CAR_MAKES = gql`
  {
    carMakes {
      id
      name
    }
  }
`;

const GET_CAR_MODELS = gql`
  query getCarMakeModels($makeID: ID!) {
    carMakeModels(make_id: $makeID) {
      id
      name
    }
  } 
`;

const CreateVehicle = (props) => {
  const [licensePlate, setLicensePlate] = useState('');
  const [manufactureYear, setManufactureYear] = useState('');
  const [carTypeID, setCarTypeID] = useState('');
  const [carMakeID, setCarMakeID] = useState('');
  const [carModelID, setCarModelID] = useState('');
  const [expDay, setExpDay] = useState('');
  const [expMonth, setExpMonth] = useState('');
  const [expYear, setExpYear] = useState('');
  const [file, setFile] = useState('');

  const { loading, data } = useQuery(GET_CAR_TYPES);
  const { loading: getCarMakesLoading, data: getCarMakesData } = useQuery(GET_CAR_MAKES);
  const [
    getCarMakeModels, 
    { loading: getCarModelsLoading, data: getCarModelsData }
  ] = useLazyQuery(GET_CAR_MODELS, {
    variables: { 
      makeID: carMakeID
    }
  });

  const [
    createVehicle,
    { loading: mutationLoading, error: mutationError },
  ] = useMutation(
    CREATE_VEHICLE,
    {
      update: (store, { data: { createVehicle } }) => {
        const data = store.readQuery({ 
          query: GET_VEHICLES,
          variables: { 
            first: props.perPage,
            page: props.page,
            field: props.sort,
            order: props.order
          },
        });

        data.vehicles.data.push(createVehicle);

        store.writeQuery({ 
          query: GET_VEHICLES,
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
  if (licensePlate 
      && expDay
      && expMonth
      && expYear 
      && manufactureYear 
      && carMakeID 
      && carTypeID 
      && carModelID 
      && !mutationLoading) {
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
    mutationFeedback = <p className='alert alert-danger mb-4 rounded-0'>Bummer! Oh no, we weren't able to create this vehicle. Please try again, if the issue persists, please shoot us an email at <em>support@qruz.app</em> and we'll help you out.</p>
  }

  const days = [];
  const months = [];
  const years = [];
  const manufactureYears = [];
  const currentYear = new Date().getFullYear();
  for (let i = 1; i <= 31; i++) { days.push(i) }
  for (let i = 1; i <= 12; i++) { months.push(i) }
  for (let i = currentYear; i <= currentYear + 3; i++) { years.push(i) }
  for (let i = currentYear - 5; i <= currentYear + 1; i++) { manufactureYears.push(i) }

  return (
    <div className="dialog-mask">
      <div className="dialog-wrapper dialog-md bg-white rounded-top rounded-bottom">
        <div className="dialog-container">
          <div id="dialog-header" className="bg-gradient px-4 py-1 rounded-top"></div>
          <form encType="multipart/form-data"
            onSubmit={e => {
              e.preventDefault();
              createVehicle({ variables: { 
                license_plate: licensePlate,
                license_expires_on: expYear + '-' + expMonth + '-' + expDay,
                car_type_id: carTypeID,
                car_make_id: carMakeID,
                car_model_id: carModelID,
                year: manufactureYear,
                photo: file
              } });
            }}> 
            <div id="dialog-body" className="px-4 pt-4 pb-3">
              <div className="text-center mb-2">
                <Photo photo={null} newPhoto={setFile} />
              </div>
              <div className="form-row">
                <div className="form-group col-md-4">
                  <label htmlFor="carMake">Make</label>
                  <select name="carMake" id="carMake" 
                    className="form-control"
                    onChange={(e) => {
                      setCarMakeID(e.target.value)
                      getCarMakeModels();
                    }}
                    value={carMakeID} 
                    disabled={getCarMakesLoading}>
                    <option value="">{getCarMakesLoading ? "Loading makes" : "Select Make"}</option>
                    {getCarMakesData && getCarMakesData.carMakes && getCarMakesData.carMakes.map((carMake) => (
                      <option key={carMake.id} value={carMake.id}>{carMake.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group col-md-4">
                  <label htmlFor="carModel">Model</label>
                  <select name="carModel" id="carModel" 
                    className="form-control"
                    onChange={(e) => setCarModelID(e.target.value)}
                    value={carModelID} 
                    disabled={getCarModelsLoading}>
                    <option value="">{getCarModelsLoading ? "Loading models" : "Select Model"}</option>
                    {getCarModelsData && getCarModelsData.carMakeModels && getCarModelsData.carMakeModels.map((carModel) => (
                      <option key={carModel.id} value={carModel.id}>{carModel.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group col-md-4">
                  <label htmlFor="manufactureYear">Year</label>
                  <select name="manufactureYear" id="manufactureYear" 
                    className="form-control"
                    onChange={(e) => setManufactureYear(e.target.value)}
                    value={manufactureYear}
                  >
                    <option value="">Select Year</option>
                    {manufactureYears.map((year) => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group col-md-4">
                  <label htmlFor="carType">Type</label>
                  <select name="carType" id="carType" 
                    className="form-control"
                    onChange={(e) => setCarTypeID(e.target.value)}
                    value={carTypeID} 
                    disabled={loading}>
                    <option value="">{loading ? "Loading types" : "Select Type"}</option>
                    {data && data.carTypes && data.carTypes.map((carType) => (
                      <option key={carType.id} value={carType.id}>{carType.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group col-md-4">
                  <label htmlFor="licensePlate">License Plate</label>
                  <input type="text" name="licensePlate" id="licensePlate" 
                    className="form-control" autoComplete="off" 
                    placeholder="Car Number" 
                    onChange={(e) => setLicensePlate(e.target.value)}
                    value={licensePlate}
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
                onClick={() => props.createModal(false)}>Dismiss</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CreateVehicle
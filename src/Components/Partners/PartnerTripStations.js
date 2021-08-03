import React, { useState, useCallback } from 'react'
import gql from 'graphql-tag'
import { useQuery, useMutation } from '@apollo/react-hooks'
import Map from '../Map'
import StationDetail from './StationDetail'
import AcceptStation from './AcceptStation'
import logoSymbol from '../../logo-light-symbol.png';
import pendingIcon from '../../icons/pending.svg';
import endIcon from '../../icons/end.svg';
import pickableIcon from '../../icons/pickable.svg';

const CREATE_TRIP_STATION = gql`
  mutation CreatePartnerTripStation(
    $name: String
    $latitude: String!
    $longitude: String!
    $partnerTripID: ID!
    $accepted_at: DateTime!
    $state: String
  ) {
    createPartnerTripStation(
      input: {
        name: $name
        latitude: $latitude
        longitude: $longitude
        trip_id: $partnerTripID
        state: $state
        accepted_at: $accepted_at
      }
    ) {
      id
      name
      latitude
      longitude
      state
      time_from_start
      created_by {
        id
        name
        avatar
      }
    }
  }
`;

const GET_PARTNER_TRIP_STATIONS = gql`
  query getPartnerTripStations($tripID: ID!) {
    partnerTripStations(trip_id: $tripID) {
      id
      name
      latitude
      longitude
      state
      time_from_start
      created_by {
        id
        name
        avatar
      }
    }
  }
`;

const EDIT_PARTNER_TRIP_STATION = gql`
  mutation EditPartnerTripStation(
    $id: ID!
    $name: String
    $latitude: String!
    $longitude: String!
  ) {
    updatePartnerTripStation(
      input: {
        id: $id
        name: $name
        latitude: $latitude
        longitude: $longitude
      }
    ) {
      id
      name
      latitude
      longitude
    }
  }
`;

const PartnerTripStations = (props) => {
  const [selectedStation, setSelectedStation] = useState();
  const [acceptStationModal, setAcceptStationModal] = useState(false);
  const [stationDetailModal, setStationDetailModal] = useState(false);
  const [updatedMap, setUpdatedMap] = useState();
  const [stationEdited, setStationEdited] = useState(false);
  const [markers, setMarkers] = useState([]); 
  const now = new Date().toJSON().replace('T',' ').substring(0,19);

  const [ 
    updatePartnerTripStation, 
    { loading: updateStationLoading },
   ] = useMutation(EDIT_PARTNER_TRIP_STATION);
   
  const { loading, error, data } = useQuery(GET_PARTNER_TRIP_STATIONS, {
    variables: { tripID: props.tripID }
  });
  const [
    createPartnerTripStation,
    { loading: createStationLoading },
  ] = useMutation(
    CREATE_TRIP_STATION,
    { 
      update: (store, { data: { createPartnerTripStation } }) => {
        const data = store.readQuery({ 
          query: GET_PARTNER_TRIP_STATIONS,
          variables: { tripID: props.tripID }
        });
        data.partnerTripStations.push(createPartnerTripStation);
        store.writeQuery({ 
          query: GET_PARTNER_TRIP_STATIONS,
          variables: { tripID: props.tripID }, 
          data 
        });
      },
      onCompleted() {
        setStationEdited(true);
      }
    }
  );

  const handleDetailModal = (station) => {
    setSelectedStation(station);
    setStationDetailModal(true)
  }

  const handleAcceptStationModal = (station) => {
    setSelectedStation(station);
    setAcceptStationModal(true)
  }

  const mutating = createStationLoading || updateStationLoading;
  const hasStations = data && data.partnerTripStations.length;

  const handleMarkerShape = (state) => {
    switch(state) {
      case "END":
        return endIcon
      case "PENDING":
        return pendingIcon    
      default:
        return pickableIcon 
    }
  }

  const createStation = (name, lat, lng) => {
    createPartnerTripStation({variables: { 
      name: name,
      partnerTripID: props.tripID,
      latitude: lat,
      longitude: lng,
      state: "PICKABLE",
      accepted_at: now
    } });
  }

  const updateStation = (id, lat, lng) => {
    updatePartnerTripStation({ variables: { 
      id: id,
      latitude: lat,
      longitude: lng
    } });
  }

  const getStations = (stations, map) => { 
    if (hasStations) {
      let bounds  = new window.google.maps.LatLngBounds();  
      stations.map((station) => {
        const latLng = new window.google.maps.LatLng(station.latitude, station.longitude);            
        const marker = new window.google.maps.Marker({
          draggable: true,
          map,
          position: latLng,
          title: station.name,
          icon: handleMarkerShape(station.state)
        })
        setMarkers(markers => [...markers, marker]);
        if (station.state === 'END') marker.setAnimation(window.google.maps.Animation.BOUNCE);
        marker.addListener('click', () => {
          if (station.state === 'PENDING') {
            handleAcceptStationModal(station);
          } else {
            handleDetailModal(station);
          }
        });
        const loc = new window.google.maps.LatLng(marker.position.lat(), marker.position.lng());      
        bounds.extend(loc);
        window.google.maps.event.addListener(marker, 'dragend', (evt) => {
          updateStation(station.id, evt.latLng.lat(), evt.latLng.lng())
        });
      });
      map.fitBounds(bounds);
      map.panToBounds(bounds);
    } else {
      map.setCenter({lat: 31.2001, lng: 29.9187});
      map.setZoom(7);
    }
  }

  const initMap = (map) => {
    setUpdatedMap(map);
    let searchBox = new window.google.maps.places.SearchBox(document.getElementById('searchbox'));
    searchBox.addListener('places_changed', function() {
      const place = searchBox.getPlaces()[0];
      createStation(place.name, place.geometry.location.lat(), place.geometry.location.lng());
    });
    getStations(data.partnerTripStations, map);
  }

  const removeMarkers = () => {
    markers.forEach(marker => marker.setMap(null));
    setMarkers([])
  }
  
  if (stationEdited) {
    removeMarkers();
    getStations(data.partnerTripStations, updatedMap);
    setStationDetailModal(false);
    setStationEdited(false);
  }
  
  const fitView = () => {    
    removeMarkers();
    getStations(data.partnerTripStations, updatedMap);
  }

  const mapProps = {
    onMount: initMap
  }
  
  const theMap = useCallback(<Map {...mapProps} />, [mapProps]) 

  if (loading) return <div className="spinner spinner-dark"></div>;
  if (error) return <p className="alert alert-danger">Error! Something went wrong.</p>;

  return (
    <div>
      <div className="card border-0 mb-4">
        <div className="card-body position-relative">
          <div className="position-absolute map-search">
            <input type="text" id="searchbox" className="form-control" placeholder="Start typing to search places and add stations"></input>
          </div>
          <div className="position-absolute map-fit">
            <span 
              onClick={() => fitView()}
              className={"placeholder placeholder-md bg-navy text-white rounded-circle clickable" + (mutating ? " no-action" : "")}>
              {mutating &&
                <div className="spinner spinner-light"></div>
              }
              {!mutating &&
                <img src={logoSymbol} className="app-logo-sm mr-0 pr-0" alt="Fit View" />
              }
            </span>
          </div>
          {theMap}
        </div>
      </div>
      {stationDetailModal &&
        <StationDetail
          tripID={props.tripID}
          station={selectedStation}
          detailModal={setStationDetailModal} 
          stationEdited={setStationEdited}
          stations={data.partnerTripStations}
        />
      }
      {acceptStationModal &&
        <AcceptStation
          tripID={props.tripID}
          station={selectedStation}
          acceptStationModal={setAcceptStationModal} 
          stationEdited={setStationEdited}
        />
      }
    </div>
  )
}

export default PartnerTripStations
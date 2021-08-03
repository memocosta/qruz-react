import React from 'react'
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

const PROMOCODES = gql`{ promocodesPerm @client }`;

const Promocodes = () => { 
  const { data: promocodes } = useQuery(PROMOCODES) 
  
  if (promocodes && !promocodes.promocodesPerm) return <p className='alert alert-warning fadeInUp'><strong>Bummer!</strong> You are not authorized to access this feature. If you have an issues or need to report a bug, shoot us an email at <em>support@qruz.app</em> and we'll help you out.</p>;
  
  return (
    <div className="card border-0 mb-4">
      <div className="card-body">
        <h6 className="mb-0">Promocodes</h6>
      </div>
    </div>
  )
}

export default Promocodes
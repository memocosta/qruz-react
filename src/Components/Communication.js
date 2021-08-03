import React from 'react'
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

const COMMUNICATION = gql`{ communicationPerm @client }`;

const Communication = () => { 
  const { data: communication } = useQuery(COMMUNICATION) 
  
  if (communication && !communication.communicationPerm) return <p className='alert alert-warning fadeInUp'><strong>Bummer!</strong> You are not authorized to access this feature. If you have an issues or need to report a bug, shoot us an email at <em>support@qruz.app</em> and we'll help you out.</p>;
  
  return (
    <div className="card border-0 mb-4">
      <div className="card-body">
        <h6 className="mb-0">Communication</h6>
      </div>
    </div>
  )
}

export default Communication
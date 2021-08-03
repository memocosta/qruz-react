import React from 'react'
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
const IS_LOGGED_IN = gql`{ isLoggedIn @client }`;

const Home = () => {
  const { data: auth } = useQuery(IS_LOGGED_IN)  
  
  if (auth && !auth.isLoggedIn) return <p className='alert alert-danger fadeInUp'>Bummer! You have to login to access this feature.</p>;
  
  return (
    <div className="card border-0 mb-4">
      <div className="card-body">
        <h6 className="mb-0">Welcome</h6>
      </div>
    </div>
  )
}

export default Home
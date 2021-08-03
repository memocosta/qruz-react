import React, { useState } from 'react'
import { Redirect } from 'react-router-dom'
import gql from 'graphql-tag';
import { useMutation, useApolloClient, useQuery } from '@apollo/react-hooks';

const IS_LOGGED_IN = gql`{ isLoggedIn @client }`;
const PARTNER_ID = gql`{ partnerID @client }`;

const LOGIN = gql`
  mutation PartnerLogin(
    $email: String!
    $password: String!
  ) {
    partnerLogin(
      input: {
        email: $email
        password: $password
      }
    ) {
      access_token
      partner {
        id
        name
      }
    }
  }
`;

const PartnerLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [successLogin, setSuccessLogin] = useState(false);
  const client = useApolloClient();

  const { data: auth } = useQuery(IS_LOGGED_IN);
  const { data: partner } = useQuery(PARTNER_ID)

  const [
    Login,
    { loading: mutationLoading, error: mutationError, data: mutationData },
  ] = useMutation(
    LOGIN,
    {
      onCompleted() {
        setSuccessLogin(true)
      }
    }
  );

  if (auth.isLoggedIn) return <Redirect to={"/business/partners/"+partner.partnerID+"/users"} />

  let btnDisabled = true;
  if (email && password && !mutationLoading) {
    btnDisabled = false
  }

  let button;
  if (mutationLoading) {
    button = "Signing in..."
  } else {
    button = "Sign in"
  }

  let mutationFeedback;

  if (mutationError) {
    mutationFeedback = <p className='alert alert-danger mb-3 rounded-0'><strong>Bummer!</strong> Oh no, we weren't able to log you in. May be you misspelled your credentials, please try again.</p>
  }

  if (successLogin) {
    localStorage.setItem('isLoggedIn', true)
    localStorage.setItem('token', mutationData.partnerLogin.access_token)
    localStorage.setItem('partnerID', mutationData.partnerLogin.partner.id)
    localStorage.setItem('name', mutationData.partnerLogin.partner.name)
    client.writeData({ data: { 
      isLoggedIn: true,
      partnerID: mutationData.partnerLogin.partner.id,
      name: mutationData.partnerLogin.partner.name
    } });
  }
  return (
    <div className="row justify-content-center fadeInUp">
      <div className="col-md-6 align-self-center">
        <br />
        <div className="card border-0 my-4 rounded-bottom rounded-top">
          <form encType="multipart/form-data"
            onSubmit={e => {
              e.preventDefault();
              Login({ variables: { 
                email: email,
                password: password
              } }); 
            }}>
            <div id="card-body" className="px-4 pt-4 rounded-top">
              <p className="font-weight-bold mb-3">Sign in to Qruz</p>
              <div className="form-row">
                <div className="form-group col-12">
                  <input type="email" name="email" id="email" 
                    className="form-control" autoComplete="off" 
                    placeholder="Email Address" 
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                  />
                </div>
                <div className="form-group col-12">
                  <input type="password" name="password" id="password" 
                    className="form-control" autoComplete="off" 
                    placeholder="Password" 
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                  />
                </div>
              </div>
            </div>
            {mutationFeedback}
            <div id="card-footer" className="px-4 pb-4">
              <button type="submit"
                className="btn btn-sm btn-outline-primary"
                disabled={btnDisabled}>{button}
              </button>
            </div>
          </form>
        </div>
        <p className="text-muted">
          Thank you for using Qruz. If you have issues or need to report a bug? Feel free to shoot us an email at <em>support@qruz.app</em> and we'll help you out.
        </p>
      </div>
    </div>
  )
}

export default PartnerLogin
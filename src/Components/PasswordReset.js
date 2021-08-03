import React, { useState } from 'react'
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';

const PASSWORD_RESET = gql`
  mutation UpdateUserForgottenPassword(
    $token: String!
    $email: String!
    $password: String!
    $password_confirmation: String!
  ) {
    updateUserForgottenPassword(
      input: {
        token: $token
        email: $email
        password: $password
        password_confirmation: $password_confirmation
      }
    ) {
      status
      message
    }
  }
`;

const PasswordRest = (props) => {
  const [token] = useState(props.match.params.token);
  const [email] = useState(decodeURIComponent(props.location.search).split("=").pop());
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  

  const [
    PasswordRest,
    { loading, error, data },
  ] = useMutation(PASSWORD_RESET);

  let btnDisabled = true;
  if (email 
      && token
      && password
      && password === rePassword 
      && !loading) {
    btnDisabled = false
  }

  let button;
  if (loading) {
    button = "Saving.."
  } else {
    button = "Save"
  }

  let mutationFeedback;

  const responseStatus = data && data.updateUserForgottenPassword.status
  const responseMsg = data && data.updateUserForgottenPassword.message

  if (error) {
    mutationFeedback = <p className='alert alert-danger mb-3 rounded-0'><strong>Bummer!</strong> Oh no, we weren't able to reset you password. Something went wrong, please try again.</p>
  }

  if (responseStatus === true) return <p className='alert alert-success fadeInUp'><b>Voila.</b> You've successfully created a new password. Use this new password to sign in to the app.</p>

  if (responseStatus === false) return <p className='alert alert-danger fadeInUp'>{responseMsg}</p>;

  return (
    <div className="row justify-content-center fadeInUp">
      <div className="col-md-6">
        <br />
        <div className="card border-0 my-4 rounded-bottom rounded-top">
          <form encType="multipart/form-data"
            onSubmit={e => {
              e.preventDefault();
              PasswordRest({ variables: { 
                email: email,
                token: token,
                password: password,
                password_confirmation: rePassword
              } }); 
            }}>
            <div id="card-body" className="px-4 pt-4 rounded-top">
              <p className="font-weight-bold mb-3">Let's get you a new password</p>
              <div className="form-row">
                <div className="form-group col-12">
                  <input type="password" name="password" id="password" 
                    className="form-control" autoComplete="off" 
                    placeholder="New Password" 
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                  />
                </div>
                <div className="form-group col-12">
                  <input type="password" name="rePassword" id="rePassword" 
                    className="form-control" autoComplete="off" 
                    placeholder="New Password Again" 
                    onChange={(e) => setRePassword(e.target.value)}
                    value={rePassword}
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

export default PasswordRest
import React, { useState } from 'react'
import QruzMemberLogin from './Roles/QruzMemberLogin'
import PartnerLogin from './Partners/PartnerLogin'


const Login = (props) => {
  let viewAs = props.location.search.split("=").pop();
  if (viewAs !== 'qruz' && viewAs !== 'partner') viewAs = 'qruz'
  const [view, setView] = useState(viewAs);  

  return (
    <div>
      {view === 'qruz' &&
        <QruzMemberLogin toggleView={setView} />
      }
      {view === 'partner' &&
        <PartnerLogin toggleView={setView} />
      }
      <div className="row justify-content-center fadeInUp">
        <div className="col-md-6 align-self-center">
          <p className="text-muted">
            Having issues or need to report a bug? Feel free to shoot us an email at <b>support@qruz.app</b> and we'll help you out.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
import React from 'react'

const PartnerArchives = () => {
  return (
    <div>
      <div className="card border-0 mb-4">
        <div className="card-body">
          <div className="row">
            <div className="col align-self-center">
              <form>
                <input type="text" className="form-control" placeholder="Start typing to search all archives"></input>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="card border-0 mb-4">
        <div className="card-body">
          <table className="table table-hover">
            <thead>
              <tr>
                <th className="border-top-0 text-center">ID</th>
                <th className="border-top-0 text-center">Date a Time</th>
                <th className="border-top-0 text-center">Driver</th>
                <th className="border-top-0 text-center">Subbed Users</th>
                <th className="border-top-0 text-center">Trip</th>
                <th className="border-top-0 text-center">Feedback</th>
              </tr>
            </thead>
            <tbody className="text-center">
              <tr>
                <td colSpan="6" className="text-center text-muted pt-4">
                  No archives yet
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default PartnerArchives
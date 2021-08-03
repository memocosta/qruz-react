import React, { Component } from "react";
import { Link } from "react-router-dom";
import LostList from "./LostList";

class Lost extends Component {
  render() {
    return (
      <div className="border-0 mb-4">
        <div className="card border-0 mb-4">
          <div className="card-body">
            <div className="row">
              <div className="col align-self-center">
                <form>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Start typing to search losts"
                  ></input>
                </form>
              </div>
              <div className="col-auto align-self-center">
                <Link to="/losts/new" className="btn btn-custom">
                  New lost
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="border-0 mb-4">
            <table className="table table-hover seperated">
              <thead>
                <tr>
                  <th className="border-top-0">ID</th>
                  <th className="border-top-0">trip id</th>
                  <th className="border-top-0">image</th>
                  <th className="border-top-0">driver</th>
                  <th className="border-top-0">user</th>
                  <th className="border-top-0">description</th>
                  <th className="border-top-0">date & Time</th>
                  <th className="border-top-0">status</th>
                  <th className="border-top-0"></th>
                  <th className="border-top-0"></th>
                </tr>
              </thead>
              <tbody>
                {LostList.map(lost => (
                  <tr key={lost.id}>
                    <td>{lost.id}</td>
                    <td>{lost.trip_id}</td>
                    <td>{lost.driver}</td>
                    <td>{lost.user}</td>
                    <td><img src={lost.image} class="notification-img"  width="120px" height="120px"/></td>
                    <td>{lost.description}</td>
                    <td>{lost.date}</td>
                    <td>{lost.status}</td>
                    <td>
                      <Link to="/roles/edit" className="btn btn-sm btn-light">
                        Edit
                      </Link>
                    </td>
                    <td>
                      <button type="button" className="btn btn-sm btn-light">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
      </div>
    );
  }
}

export default Lost;

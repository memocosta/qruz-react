import React, { Component } from "./node_modules/react";
import { Link } from "./node_modules/react-router-dom";
import Rated from "./rated";

class Rating extends Component {
  render() {
    return (
      <div className="border-0 mb-4">
        <div className="review-type">
            <span>
                Driver
            </span>
            <span>
                User
            </span>
        </div>
        <div className="card border-0 mb-4">
          <div className="card-body">
            <div className="row">
              <div className="col align-self-center">
                <form>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Start typing to search users"
                  ></input>
                </form>
              </div>
              <div className="col-auto align-self-center">
                <Link to="/users/new" className="btn btn-custom">
                  New user
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
                  <th className="border-top-0">date & Time</th>
                  <th className="border-top-0">driver</th>
                  <th className="border-top-0">passenger</th>
                  <th className="border-top-0">trip id</th>
                  <th className="border-top-0">rating</th>
                  <th className="border-top-0"></th>
                </tr>
              </thead>
              <tbody>
                {Rated.map(user => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.date}</td>
                    <td>{user.driver}</td>
                    <td>{user.passenger}</td>
                    <td>{user.trip_id}</td>
                    <td>{user.rating}</td>
                    <td>
                      <Link to="/users/edit" className="btn btn-sm btn-light">
                        more
                      </Link>
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

export default Rating;

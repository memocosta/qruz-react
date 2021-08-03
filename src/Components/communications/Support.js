import React, { Component } from "react";
import { Link } from "react-router-dom";
import Supporter from "./supporters";

class Support extends Component {
  render() {
    return (
      <div className="border-0 mb-4">
        <div className="row">
          <div className="col-md-3 col-xs-6">
            <div className="support-card card mb-2">
              <div className="card-body">
                <h2>
                  374 <p> Total mails</p>
                </h2>
              </div>
            </div>
          </div>
          <div className="col-md-3 col-xs-6">
            <div className="support-card card mb-2">
              <div className="card-body">
                <h2>
                  374 <p> Total mails</p>
                </h2>
              </div>
            </div>
          </div>
          <div className="col-md-3 col-xs-6">
            <div className="support-card card mb-2">
              <div className="card-body">
                <h2>
                  374 <p> Total mails</p>
                </h2>
              </div>
            </div>
          </div>
          <div className="col-md-3 col-xs-6">
            <div className="support-card card mb-2">
              <div className="card-body">
                <h2>
                  374 <p> Total mails</p>
                </h2>
              </div>
            </div>
          </div>
        </div>
        <div className="card border-0 mb-4">
          <div className="card-body">
            <div className="row">
              <div className="col align-self-center">
                <form>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Start typing to search roles"
                  ></input>
                </form>
              </div>
              <div className="col-auto align-self-center">
                <Link to="/roles/new" className="btn btn-custom">
                  New Role
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
                  <th className="border-top-0">opened by</th>
                  <th className="border-top-0">email</th>
                  <th className="border-top-0">subject</th>
                  <th className="border-top-0">assign to</th>
                  <th className="border-top-0">status</th>
                  <th className="border-top-0"></th>
                  <th className="border-top-0"></th>
                </tr>
              </thead>
              <tbody>
                {Supporter.map(role => (
                  <tr key={role.id}>
                    <td>{role.id}</td>
                    <td>{role.date}</td>
                    <td>{role.opened_by}</td>
                    <td>{role.email}</td>
                    <td>{role.subject}</td>
                    <td>{role.assign_to}</td>
                    <td>{role.status}</td>
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

export default Support;

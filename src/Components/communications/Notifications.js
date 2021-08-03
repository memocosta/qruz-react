import React, { Component } from "react";
import { Link } from "react-router-dom";
import NotificationsList from "./NotificationsList";

class Notifications extends Component {
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
                    placeholder="Start typing to search notes"
                  ></input>
                </form>
              </div>
              <div className="col-auto align-self-center">
                <Link to="/notes/new" className="btn btn-custom">
                  New note
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
                  <th className="border-top-0">Target</th>
                  <th className="border-top-0">image</th>
                  <th className="border-top-0">description</th>
                  <th className="border-top-0">date & Time</th>
                  <th className="border-top-0">status</th>
                  <th className="border-top-0"></th>
                  <th className="border-top-0"></th>
                </tr>
              </thead>
              <tbody>
                {NotificationsList.map(note => (
                  <tr key={note.id}>
                    <td>{note.id}</td>
                    <td>{note.target}</td>
                    <td><img src={note.image} class="notification-img"  width="120px" height="120px"/></td>
                    <td>{note.description}</td>
                    <td>{note.date}</td>
                    <td>{note.status}</td>
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

export default Notifications;

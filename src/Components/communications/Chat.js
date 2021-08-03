import React, { Component } from "react";
import { Link } from "react-router-dom";
import ChatList from "./ChatList";

class Chat extends Component {
  render() {
    return (
      <div className="border-0 mb-4">
        <div className="row">
          <div className="col-md-5">
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
            <div className="chat-type">
              <span>
                  Driver
              </span>
              <span>
                  User
              </span>
              <span>
                  Internal
              </span>
              <span>
                  Service Chat
              </span>
          </div>
        
          <div className="chat-list">
            {ChatList.map(user => (
              <div className="chat-user" key={user.id}>
                <div className="left">
                  <img src={user.image} />
                  <h6>{user.name}</h6>
                  <p>{user.status}</p>
                </div>
                <div className="right">
                  <p>{user.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
          </div>

         
        
       
      </div>
    );
  }
}

export default Chat;

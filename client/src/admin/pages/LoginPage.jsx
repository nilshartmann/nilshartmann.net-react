// ---------------------------------------------------------------------------
// --- Nils Hartmann | http://nilshartmann.net                             ---
// ---------------------------------------------------------------------------
import React from "react";

import { history } from "../../util/Frontend";
import connectModelState from "../../model/connectModel";

class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onDoLogin() {
    const { userid, password } = this.state;
    const { login, params } = this.props;
    login(userid, password, params.splat ? `/${params.splat}` : "/");
  }

  onInputChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  render() {
    const { userid, password } = this.state;
    const loginEnabled = userid && password;

    return (
      <div>
        <h1>Login</h1>
        <input name="userid" type="text" onChange={e => this.onInputChange(e)} placeholder="User Id" />
        <input name="password" type="password" onChange={e => this.onInputChange(e)} placeholder="Password" />

        <button enabled={loginEnabled} onClick={() => this.onDoLogin()}>
          Login
        </button>
        <div>{this.state.message}</div>
      </div>
    );
  }
}

const w = connectModelState(LoginPage, null, ({ login }) => ({ login }));
export default w;

import React from "react";
import { withRouter, Link } from "react-router-dom";
import Header from "./Header";

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  handleSubmit(e) {
    const { email, password } = this.state;
    e.preventDefault();
    this.props.register(email, password);
  }

  render() {
    return (
      <>
        <Header linkText="Log In" linkTo="/signin" />
        <form className="register" onSubmit={this.handleSubmit}>
          <h2 className="register__header">Sign Up</h2>
          <input
            name="email"
            className="register__input"
            type="email"
            value={this.state.email}
            onChange={this.handleChange}
            placeholder="Email"
          />
          <input
            name="password"
            className="register__input"
            type="password"
            value={this.state.password}
            onChange={this.handleChange}
            placeholder="Password"
          />
          <button className="register__button">Sign Up</button>
          <Link to="/signin" className="register__link">
            Already a member? Log in here!
          </Link>
        </form>
      </>
    );
  }
}

export default withRouter(Register);

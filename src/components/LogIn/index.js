import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

class LogIn extends Component {
  state = {
    username: '',
    password: '',
    errorMessage: '',
  }

  onSuccessView = jwtToken => {
    const {history} = this.props

    Cookies.set('jwt_token', jwtToken, {expires: 30})

    history.replace('/')
  }

  onFailureView = errorMessage => {
    this.setState({errorMessage})
  }

  onChangeUsername = e => {
    this.setState({username: e.target.value})
  }

  onChangePassword = e => {
    this.setState({password: e.target.value})
  }

  onFormSubmit = async e => {
    e.preventDefault()

    const {username, password} = this.state
    const userDetails = {username, password}
    if (username && password === '') {
      this.setState({errorMessage: "Username and Password didn't match"})
    } else {
      const options = {
        method: 'POST',
        body: JSON.stringify(userDetails),
      }

      const response = await fetch('https://apis.ccbp.in/login', options)
      const data = await response.json()
      if (response.ok === true) {
        this.onSuccessView(data.jwt_token)
      } else {
        this.onFailureView(data.error_msg)
      }
    }
  }

  render() {
    const {username, password, errorMessage} = this.state

    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <div className="login-container">
        <div className="login-image-container">
          <img
            className="login-image"
            src="https://res.cloudinary.com/dky69roxl/image/upload/v1687428143/Layer_2_yigitt.png"
            alt="website login"
          />
        </div>
        <form onSubmit={this.onFormSubmit} className="form-container">
          <div className="login-logo-container">
            <img
              className="login-logo"
              src="https://res.cloudinary.com/dky69roxl/image/upload/v1687411063/Standard_Collection_8_yc8kdx.svg"
              alt="website logo"
            />
            <h1 className="login-heading">Insta Share</h1>
          </div>
          <div className="input-container">
            <label className="label-text" htmlFor="username">
              USERNAME
            </label>
            <br />
            <input
              onChange={this.onChangeUsername}
              value={username}
              className="input"
              type="text"
              id="username"
              placeholder="Username"
            />
          </div>
          <div className="input-container">
            <label className="label-text" htmlFor="password">
              PASSWORD
            </label>
            <br />
            <input
              onChange={this.onChangePassword}
              value={password}
              id="password"
              className="input"
              type="password"
              placeholder="Password"
            />
          </div>
          <button type="submit" className="login-btn">
            Login
          </button>
          <p className="error-message">{errorMessage}</p>
        </form>
      </div>
    )
  }
}
export default LogIn

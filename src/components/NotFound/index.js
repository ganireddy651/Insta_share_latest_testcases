import {withRouter} from 'react-router-dom'
// import Cookies from 'js-cookie'
import './index.css'

const NotFound = props => {
  const onClickNavigateToHome = () => {
    const {history} = props
    history.replace('/')
  }

  //   const jwtToken = Cookies.get('jwt_token')
  //   if (jwtToken === undefined) {
  //     return <Redirect to="/login" />
  //   }

  return (
    <div className="not-found-container">
      <img
        className="not-found-image"
        src="https://res.cloudinary.com/dky69roxl/image/upload/v1687415338/erroring_1_pejmlx.png"
        alt="page not found"
      />
      <h1 className="not-found-heading">PAGE NOT FOUND</h1>
      <p className="not-found-description">
        we are sorry, the page you requested could not be found
      </p>
      <button
        onClick={onClickNavigateToHome}
        className="not-found-btn"
        type="button"
      >
        Home Page
      </button>
    </div>
  )
}

export default withRouter(NotFound)

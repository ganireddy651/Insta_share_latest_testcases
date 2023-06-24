import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import {FaSearch} from 'react-icons/fa'
import {FiMenu} from 'react-icons/fi'
import SearchContext from '../../context/SearchContext'
import './index.css'

const Header = props => {
  const onClickLogout = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }
  return (
    <SearchContext.Consumer>
      {value => {
        const {searchInput, changeSearchInput} = value
        const onSearchChange = e => {
          changeSearchInput(e.target.value)
        }
        return (
          <nav className="app-navbar">
            <div className="logo-container">
              <Link to="/" className="link">
                <img
                  className="nav-logo"
                  src="https://res.cloudinary.com/dky69roxl/image/upload/v1687411063/Standard_Collection_8_yc8kdx.svg"
                  alt="website logo"
                />
              </Link>
              <Link to="/" className="link">
                <h1 className="nav-heading">Insta Share</h1>
              </Link>
            </div>
            <div className="nav-items-container">
              <div className="nav-search-container">
                <input
                  className="search-input"
                  placeholder="Search Caption"
                  type="search"
                  onChange={onSearchChange}
                  value={searchInput}
                />
                <button
                  className="search-button"
                  type="button"
                  data-testid="searchIcon"
                >
                  <FaSearch className="search-icon" />
                </button>
              </div>
              <div className="nav-items">
                <ul className="list-container">
                  <Link to="/" className="link">
                    <li className="item">Home</li>
                  </Link>
                  <Link to="/my-profile" className="link">
                    <li className="item">Profile</li>
                  </Link>
                  <li>
                    <button
                      onClick={onClickLogout}
                      className="logout-btn"
                      type="button"
                    >
                      Logout
                    </button>
                  </li>
                </ul>
                <button className="hamburger-icon" type="button">
                  <FiMenu />
                </button>
              </div>
            </div>
          </nav>
        )
      }}
    </SearchContext.Consumer>
  )
}
export default withRouter(Header)

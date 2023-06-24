import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsGrid3X3} from 'react-icons/bs'
import {BiCamera} from 'react-icons/bi'
import Header from '../Header'
import './index.css'

class UserProfile extends Component {
  state = {isLoader: 'initial', userDetails: {}}

  componentDidMount = () => {
    this.getUserData()
  }

  getUserData = async () => {
    this.setState({isLoader: 'inprogress'})
    const {match} = this.props
    const {params} = match
    const {id} = params

    const jwtToken = Cookies.get('jwt_token')

    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(
      `https://apis.ccbp.in/insta-share/users/${id}`,
      options,
    )

    if (response.ok === true) {
      const data = await response.json()
      const convertedData = {
        userDetails: data.user_details,
      }
      const formattedData = {
        followersCount: convertedData.userDetails.followers_count,
        followingCount: convertedData.userDetails.following_count,
        id: convertedData.userDetails.id,
        posts: convertedData.userDetails.posts,
        postsCount: convertedData.userDetails.posts_count,
        profilePic: convertedData.userDetails.profile_pic,
        stories: convertedData.userDetails.stories,
        userBio: convertedData.userDetails.user_bio,
        userId: convertedData.userDetails.user_id,
        userName: convertedData.userDetails.user_name,
      }
      this.setState({isLoader: 'success', userDetails: formattedData})
    }
    if (response.status === 400) {
      this.setState({isLoader: 'failure'})
    }
  }

  renderSuccessView = () => {
    const {userDetails} = this.state
    // console.log(userDetails)

    return (
      <div className="user-profile-container">
        <div className="profile-container">
          <img
            src={userDetails.profilePic}
            alt="user profile"
            className="profile-pic"
          />
          <div className="user-details">
            <h1 className="user-name">{userDetails.userName}</h1>
            <div className="post-follower-container">
              <p className="no-posts-and-followers">
                {userDetails.postsCount} posts
              </p>
              <p className="no-posts-and-followers">
                {userDetails.followersCount} followers
              </p>
              <p className="no-posts-and-followers">
                {userDetails.followingCount} following
              </p>
            </div>
            <p className="user-id">{userDetails.userId}</p>
            <p className="user-bio">{userDetails.userBio}</p>
          </div>
        </div>
        <ul className="stories-container">
          {userDetails.stories.map(each => (
            <li key={each.id}>
              <img src={each.image} alt="user story" className="story-img" />
            </li>
          ))}
        </ul>
        <hr className="h-line" />
        <div>
          <BsGrid3X3 className="post-icon" />
          <h1 className="post-text">Posts</h1>
          {userDetails.posts.length === 0 ? (
            <div className="no-post-container">
              <BiCamera className="no-post-icon" />
              <h1 className="no-post">No Posts</h1>
            </div>
          ) : (
            <ul className="posts-container">
              {userDetails.posts.map(each => (
                <li key={each.id}>
                  <img src={each.image} alt="user post" className="post-img" />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    )
  }

  tryButtonClick = () => {
    this.getUserData()
  }

  renderFailureView = () => (
    <div className="failure-container">
      <img
        src="https://res.cloudinary.com/dky69roxl/image/upload/v1687514221/alert-triangle_logvrh.png"
        alt="failure view"
      />
      <p className="failure-content">Something went wrong. Please try again</p>
      <button type="button" className="try-btn" onClick={this.tryButtonClick}>
        Try again
      </button>
    </div>
  )

  renderInprogressView = () => (
    <div data-testid="loader" className="loader-container">
      <Loader
        data-testid="loader"
        type="TailSpin"
        color="#4094EF"
        height={50}
        width={50}
      />
    </div>
  )

  renderUserProfileData = () => {
    const {isLoader} = this.state
    switch (isLoader) {
      case 'success':
        return this.renderSuccessView()
      case 'failure':
        return this.renderFailureView()
      case 'inprogress':
        return this.renderInprogressView()
      default:
        return null
    }
  }

  render() {
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken === undefined) {
      return <Redirect to="/login" />
    }
    return (
      <>
        <Header />
        <div className="user-page-container">
          {this.renderUserProfileData()}
        </div>
      </>
    )
  }
}

export default UserProfile

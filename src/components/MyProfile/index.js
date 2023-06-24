import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import {BsGrid3X3} from 'react-icons/bs'
import {BiCamera} from 'react-icons/bi'
import Cookies from 'js-cookie'
import Header from '../Header'
import './index.css'

const apiStatus = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  in_progress: 'IN_PROGRESS',
}

class MyProfile extends Component {
  state = {status: apiStatus.initial, myProfile: {}}

  componentDidMount() {
    this.getMyProfileData()
  }

  getMyProfileData = async () => {
    this.setState({status: apiStatus.in_progress})
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(
      'https://apis.ccbp.in/insta-share/my-profile',
      options,
    )
    const data = await response.json()
    // console.log(data)

    if (response.ok === true) {
      const convertedData = {
        profile: data.profile,
      }
      const formattedData = {
        followersCount: convertedData.profile.followers_count,
        followingCount: convertedData.profile.following_count,
        id: convertedData.profile.id,
        posts: convertedData.profile.posts,
        postsCount: convertedData.profile.posts_count,
        profilePic: convertedData.profile.profile_pic,
        stories: convertedData.profile.stories,
        userBio: convertedData.profile.user_bio,
        userId: convertedData.profile.user_id,
        userName: convertedData.profile.user_name,
      }
      console.log(formattedData)
      this.setState({status: apiStatus.success, myProfile: formattedData})
    } else {
      this.setState({status: apiStatus.failure})
    }
  }

  onClickRetryMyProfile = () => {
    this.getMyProfileData()
  }

  renderMyProfile = () => {
    const {status} = this.state
    switch (status) {
      case apiStatus.success:
        return this.renderMyProfileSuccessView()
      case apiStatus.failure:
        return this.renderMyProfileFailureView()
      case apiStatus.in_progress:
        return this.renderMyProfileInprogressView()
      default:
        return null
    }
  }

  renderMyProfileSuccessView = () => {
    const {myProfile} = this.state
    return (
      <div className="user-profile-container">
        <div className="profile-container">
          <img
            src={myProfile.profilePic}
            alt={myProfile.userName}
            className="profile-pic"
          />
          <div className="user-details">
            <h1 className="user-name">{myProfile.userName}</h1>
            <div className="post-follower-container">
              <p className="no-posts-and-followers">
                {myProfile.posts.length} posts
              </p>
              <p className="no-posts-and-followers">
                {myProfile.followersCount} followers
              </p>
              <p className="no-posts-and-followers">
                {myProfile.followingCount} following
              </p>
            </div>
            <p className="user-id">{myProfile.userId}</p>
            <p className="user-bio">{myProfile.userBio}</p>
          </div>
        </div>
        <ul className="stories-container">
          {myProfile.stories.map(each => (
            <li key={each.id}>
              <img src={each.image} alt="my story" className="story-img" />
            </li>
          ))}
        </ul>
        <hr />
        <div>
          <BsGrid3X3 className="post-icon" />
          <h1 className="post-text">Posts</h1>
          {myProfile.posts.length === 0 ? (
            <div className="no-post-container">
              <BiCamera className="no-post-icon" />
              <h1 className="no-post">No Posts</h1>
            </div>
          ) : (
            <ul className="posts-container">
              {myProfile.posts.map(each => (
                <li key={each.id}>
                  <img src={each.image} alt="my post" className="post-img" />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    )
  }

  renderMyProfileFailureView = () => (
    <div className="failure-container">
      <img
        src="https://res.cloudinary.com/dky69roxl/image/upload/v1687514221/alert-triangle_logvrh.png"
        alt="failure view"
      />
      <p className="failure-content">Something went wrong. Please try again</p>
      <button
        onClick={this.onClickRetryMyProfile}
        type="button"
        className="try-btn"
      >
        Try Again
      </button>
    </div>
  )

  renderMyProfileInprogressView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader
        data-testid="loader"
        type="TailSpin"
        color="#4094EF"
        height={50}
        width={50}
      />
    </div>
  )

  render() {
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken === undefined) {
      return <Redirect to="/login" />
    }
    return (
      <>
        <Header />
        <div className="profile-page-container">{this.renderMyProfile()}</div>
      </>
    )
  }
}

export default MyProfile

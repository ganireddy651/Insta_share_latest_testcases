import {Component} from 'react'
import Cookies from 'js-cookie'
import Slider from 'react-slick'
import Loader from 'react-loader-spinner'
import './index.css'

const apiStatus = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  in_progress: 'IN_PROGRESS',
}

class UserStories extends Component {
  state = {status: apiStatus.initial, userStories: []}

  componentDidMount() {
    this.getUserStoryData()
  }

  onClickFetchUserStory = () => {
    this.getUserStoryData()
  }

  getUserStoryData = async () => {
    this.setState({status: apiStatus.in_progress})
    const jwtToken = Cookies.get('jwt_token')

    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(
      'https://apis.ccbp.in/insta-share/stories',
      options,
    )
    const data = await response.json()

    if (response.ok === true) {
      const convertedUserStories = data.users_stories.map(each => ({
        userId: each.user_id,
        userName: each.user_name,
        storyUrl: each.story_url,
      }))
      this.setState({
        userStories: convertedUserStories,
        status: apiStatus.success,
      })
    } else {
      this.setState({status: apiStatus.failure})
    }
  }

  renderUserStories = () => {
    const {status} = this.state
    switch (status) {
      case apiStatus.success:
        return this.renderSuccessView()
      case apiStatus.failure:
        return this.renderFailureView()
      case apiStatus.in_progress:
        return this.renderLoaderView()
      default:
        return null
    }
  }

  renderSuccessView = () => {
    const {userStories} = this.state
    const settings = {
      dots: false,
      infinite: true,
      speed: 500,
      slidesToShow: 6,
      slidesToScroll: 6,
      initialSlide: 0,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 5,
            slidesToScroll: 3,
            infinite: true,
            dots: false,
          },
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2,
            initialSlide: 2,
            dots: false,
          },
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
            dots: false,
          },
        },
      ],
    }

    return (
      <div>
        <ul className="slider-container">
          <Slider {...settings}>
            {userStories.map(eachStory => (
              <li key={eachStory.userId} className="story_container">
                <img
                  className="story-image"
                  alt="user story"
                  src={eachStory.storyUrl}
                />
                <p className="userName">{eachStory.userName}</p>
              </li>
            ))}
          </Slider>
        </ul>
      </div>
    )
  }

  renderFailureView = () => (
    <div className="something-went-wrong-container">
      <img
        className="something-went-wrong-image"
        src="https://res.cloudinary.com/dky69roxl/image/upload/v1687445839/Group_7522_qluwiv.png"
        alt="something went wrong"
      />
      <p className="issue-description">
        Something went wrong. Please try again
      </p>
      <button
        className="Retry-btn"
        onClick={this.onClickFetchUserStory}
        type="button"
      >
        Try again
      </button>
    </div>
  )

  renderLoaderView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="TailSpin" color="#f0f3f7" height={50} width={50} />
    </div>
  )

  render() {
    return (
      <div className="story-list-container">{this.renderUserStories()}</div>
    )
  }
}

export default UserStories

import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import SearchContext from '../../context/SearchContext'
import Header from '../Header'
import UserStories from '../UserStories'
import Posts from '../Posts'
import './index.css'

const apiStatus = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  in_progress: 'IN_PROGRESS',
}

class Home extends Component {
  state = {
    status: apiStatus.initial,
    searchInput: '',
    posts: [],
  }

  componentDidMount() {
    this.getPostsData()
  }

  onClickRetry = () => {
    this.getPostsData()
  }

  getPostsData = async () => {
    this.setState({status: apiStatus.in_progress})
    const jwtToken = Cookies.get('jwt_token')
    const {searchInput} = this.state

    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(
      `https://apis.ccbp.in/insta-share/posts?search=${searchInput}`,
      options,
    )
    const data = await response.json()

    if (response.ok === true && data.posts.length !== 0) {
      const convertedPostsData = data.posts.map(eachPost => ({
        postId: eachPost.post_id,
        profilePic: eachPost.profile_pic,
        userId: eachPost.user_id,
        userName: eachPost.user_name,
        likesCount: eachPost.likes_count,
        createdAt: eachPost.created_at,
        postDetails: eachPost.post_details,
        comments: eachPost.comments,
      }))

      this.setState({
        posts: convertedPostsData,
        status: apiStatus.success,
      })
    } else if (data.posts.length === 0) {
      this.setState({status: 'noPost'})
    } else {
      this.setState({status: apiStatus.failure})
    }
  }

  changeSearchInput = search => {
    this.setState({searchInput: search}, this.getPostsData)
  }

  renderPosts = () => {
    const {status} = this.state
    switch (status) {
      case apiStatus.success:
        return this.renderPostsSuccessView()
      case apiStatus.failure:
        return this.renderPostsFailureView()
      case apiStatus.in_progress:
        return this.renderPostsLoaderView()
      case 'noPost':
        return this.noPostView()
      default:
        return null
    }
  }

  renderPostsSuccessView = () => {
    const {posts, searchInput} = this.state
    return (
      <div>
        {searchInput.length === 0 ? <h1>Search Results</h1> : null}
        <ul className="posts-list-container">
          {posts.map(each => (
            <Posts each={each} key={each.postId} />
          ))}
        </ul>
      </div>
    )
  }

  renderPostsFailureView = () => (
    <div className="home-failure-section">
      <img
        src="https://res.cloudinary.com/dky69roxl/image/upload/v1687496778/alert-triangle_qkgohb.svg"
        alt="failure view"
      />
      <p>Something went wrong. Please try again</p>
      <button className="Retry-btn" onClick={this.onClickRetry} type="button">
        Retry
      </button>
    </div>
  )

  renderPostsLoaderView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="TailSpin" color="#f0f3f7" height={50} width={50} />
    </div>
  )

  noPostView = () => (
    <>
      <div className="no-search-results-container">
        <img
          src="https://res.cloudinary.com/dky69roxl/image/upload/v1687581557/Group_ufwy4f.png "
          alt="No Results"
        />
        <h2 className="no-search-found">Search Not Found</h2>
        <p className="search-again">Try different keyword or search again</p>
      </div>
    </>
  )

  render() {
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken === undefined) {
      return <Redirect to="/login" />
    }
    const {searchInput} = this.state
    console.log(searchInput.length)

    return (
      <SearchContext.Provider
        value={{searchInput, changeSearchInput: this.changeSearchInput}}
      >
        <>
          <Header />
          <div className="home-page-container">
            <UserStories />
            <div className="posts-container">{this.renderPosts()}</div>
          </div>
        </>
      </SearchContext.Provider>
    )
  }
}

export default Home

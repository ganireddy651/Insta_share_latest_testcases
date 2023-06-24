import {Component} from 'react'
import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import {BsHeart} from 'react-icons/bs'
import {FaRegComment} from 'react-icons/fa'
import {BiShareAlt} from 'react-icons/bi'
import {FcLike} from 'react-icons/fc'

import './index.css'

class Posts extends Component {
  state = {isUserLike: false, count: 0}

  likeIconClick = async (postId, likesCount) => {
    const jwtToken = Cookies.get('jwt_token')
    const data = {
      like_status: true,
    }
    const option = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify(data),
    }
    await fetch(`https://apis.ccbp.in/insta-share/posts/${postId}/like`, option)

    this.setState(preState => ({
      isUserLike: !preState.isUserLike,
      count: likesCount + 1,
    }))
  }

  unlikeClicked = async postId => {
    const jwtToken = Cookies.get('jwt_token')
    const data = {
      like_status: false,
    }
    const option = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify(data),
    }
    await fetch(`https://apis.ccbp.in/insta-share/posts/${postId}/like`, option)
    this.setState(preState => ({
      isUserLike: !preState.isUserLike,
    }))
  }

  render() {
    const {each} = this.props
    const {
      profilePic,
      userName,
      likesCount,
      createdAt,
      postDetails,
      comments,
      userId,
      postId,
    } = each
    const {isUserLike, count} = this.state

    const updatedPostDetails = {
      caption: postDetails.caption,
      imageUrl: postDetails.image_url,
    }

    const jwtToken = Cookies.get('jwt_token')

    if (jwtToken === undefined) {
      const {history} = this.props
      history.replace('/login')
    }

    return (
      <li className="post-card">
        <div className="post-header">
          <Link to={`/users/${userId}`} className="link">
            <img
              className="profile"
              src={profilePic}
              alt="post author profile"
            />
          </Link>
          <Link to={`/users/${userId}`} className="link">
            <p className="username">{userName}</p>
          </Link>
        </div>
        <img
          className="post-image"
          src={updatedPostDetails.imageUrl}
          alt="post"
        />
        <div className="impressions-container">
          {isUserLike ? (
            <FcLike
              className="heart-icon"
              onClick={() => this.unlikeClicked(postId)}
              data-testid="unLikeIcon"
            />
          ) : (
            <button
              className="heart-btn"
              type="button"
              data-testid="likeIcon"
              onClick={() => this.likeIconClick(postId, likesCount)}
            >
              <BsHeart data-testid="likeIcon" className="heart-icon" />
            </button>
          )}

          <FaRegComment className="comment-icon" />
          <BiShareAlt className="share-icon" />
          {isUserLike ? (
            <p className="likes-count">{count} likes</p>
          ) : (
            <p className="likes-count">{likesCount} likes</p>
          )}

          <p className="caption">{updatedPostDetails.caption}</p>
          <ul className="comment-list_container">
            {comments.map(eachComment => (
              <li key={eachComment.user_id}>
                <p className="comment">
                  <span className="span-text-comment">
                    {eachComment.user_name}{' '}
                  </span>
                  {eachComment.comment}
                </p>
              </li>
            ))}
          </ul>
          <p className="created-at">{createdAt}</p>
        </div>
      </li>
    )
  }
}

export default Posts

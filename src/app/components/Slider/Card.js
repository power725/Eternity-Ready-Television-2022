import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import getChannelUrl from '../../helpers/getChannelUrl'
import getThumbUrl from '../../helpers/getThumbUrl'

var styles={
  container: {
    transform: 'scale(1)',
    visibility: 'visible',
    width: '100%',
    height: '100%',
    top: '-41%',
    left: '-41%',
    transitionTimingFunction: 'cubic-bezier(0.5, 0, 0.1, 1)',
    transitionDuration: '400ms',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: '50% 50%',
    backgroundSize: '100% 100%',
  },
  overlay: {
    position: 'absolute',
    top: '0',
    right: '0',
    bottom: '-1px',
    left: '-1px',
    cursor: 'pointer',
    zIndex: 2,
    backgroundColor: 'rgba(0,0,0,0)',
    backgroundImage: 'linear-gradient(to bottom,rgba(0,0,0,0) 0,rgba(0,0,0,0) 33%,rgba(0,0,0,.85) 100%)',
  },
  hitzone: {
    position: 'absolute',
    top: '0px',
    left: '0px',
    right: '0px',
    bottom: '0px',
    zIndex: '1',
  },
}
const Card = (props) =>{
  const {title, age, year, description, rating, slug, href, uniqueId} = props
  const thumbUrl = getThumbUrl(props);
  let container = {
    transform: 'scale(1)',
    visibility: 'visible',
    width: '100%',
    height: '100%',
    top: '-41%',
    left: '-41%',
    transitionTimingFunction: 'cubic-bezier(0.5, 0, 0.1, 1)',
    transitionDuration: '400ms',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: '50% 50%',
    backgroundSize: '100% 100%',
    backgroundImage: `url(${thumbUrl})`
  }
  return (
    <div style={container}>
      <div style={styles.overlay}>
        <Link to={getChannelUrl(props)}>
          <div className="play"></div>
        </Link>
      </div>
      <div className="infoteaser">
        <span className="title">{title}</span>
        <span className="stars">{'★'.repeat(rating)}</span>
        {
          age ? <span className="age">{age}</span> : ''
        }
        <span className="year">{ year}</span>
          <span className="info">
            {description}
        </span>
      </div>
  </div>
  )
}


Card.prototype = {
  href: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  age: PropTypes.number.isRequired,
  year: PropTypes.number.isRequired,
  description: PropTypes.string.isRequired,
  rating: PropTypes.number.isRequired,
  thumb: PropTypes.string.isRequired,
}

export default Card

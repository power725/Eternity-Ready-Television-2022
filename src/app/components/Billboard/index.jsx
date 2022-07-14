import React from 'react'
import { Link } from 'react-router'
import style from './style.css'

const Billboard = () => (
<div>
  <div className="billboard">
      <div className="container">
          <div className="hero-gradient"></div>
          <div className="intro-text-wrapper">
            <div className="intro-text">
                <div className="intro-heading">ISHINE KNECT <span>SATURDAYS 12PM CST</span></div>
                <div className="intro-lead-in">Families and pre-teens you are in for a treat! If you like the shows seen on Nickelodeon and Disney TV then this Christian series is going to be a lot of fun for the entire family. iShine KNECT is designed for kids and parents to take time to connect with each other and have some wacky fun in the process.</div>
                <Link className="btn btn-light" to="/watch/578558ae73de2089121b6b1a">Watch Now</Link>
            </div>
          </div>
      </div>
  </div>
</div>
)

export default Billboard

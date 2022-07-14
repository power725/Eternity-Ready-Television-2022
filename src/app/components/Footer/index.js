import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from  'classnames'
import isUserAgentMobile from '../../helpers/isUserAgentMobile'
import style from './style.css'

class Footer extends Component {
    static contextTypes = {
        router: PropTypes.object
    }
    hideFooter() {
        try {
            return /\/watch\//.test(this.context.router.location.pathname)
        } catch (e) {
            return false;
        }

    }

    render() {
        return (
            <footer className={classNames({hideFooter: this.hideFooter()})}>
                <div className="footer sepparator"></div>

                <div className="footer FooterLinks">
                    <a href="http://www.eternityready.org/about-us" target="_blank" className="active section">About Us</a>
                    <div className="sepparator"> / </div>
                    <a href="http://www.eternityready.org/affilate" target="_blank" className="active section">Got Content?</a>
                    <div className="sepparator"> / </div>
                    <a href="http://www.eternityready.org/advertise" target="_blank" className="active section">Advertise</a>
                    <div className="sepparator"> / </div>
                    <a href="http://www.eternityready.org/help" target="_blank" className="active section">Help</a>
                    <div className="sepparator"> / </div>
                    <a href="http://www.eternityready.org/terms" target="_blank" className="active section">Policies</a>
                    <div className="sepparator"> / </div>
                </div>

                <div>
                    <br /><a href="https://www.facebook.com/eternityready/" target="_blank"><img src={require("../../commonResources/logo.png")} width="32" height="32" /></a>
                </div>
                <p>© 2017 Eternity Ready<br /></p>
                <p>RRTV is a division of Eternity Ready. Some of the Web Site related logos, content, and all other Intellectual property contained therein are not owned nor endorsed by ETERNITY READY. The Doctrine - Theology expressed thru content on this site do not neccessary reflect the views and beliefs of Eternity Ready. And are provided for Educational Purposes only.<br /></p>

            </footer>
        );
    }
}

export default Footer

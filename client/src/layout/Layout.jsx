import React from 'react';
import { Link, PropTypes } from 'react-router';

import connectModel from '../model/connectModel'

import SocialIcons from './SocialIcons';

class Layout extends React.Component {
  renderAdminLinks() {
    const { authorization, location, logout, newPost } = this.props;
    if (!authorization) {
      // return <Link to={`/login${location.pathname}`}>Login</Link>;
      return null;
    } else {
      return <span><a onClick={()=>logout()}>Logout</a> | <a onClick={()=>newPost()}>New Post</a> | <Link to='/upload'>Uploads</Link></span>;
    }
  }

  render() {
    const { children, location } = this.props;

    // TODO...
    const mainClassNames = location.pathname === '/edit' || location.pathname.startsWith('/edit/')
      ? 'Main Fullwidth' : 'Main';

    const adminLinks = this.renderAdminLinks();

    return <div className='Background'>
      <div className='Header'>
        <Link className='Title' to='/'>Nils Hartmann</Link>
        <SocialIcons />
        {adminLinks}
      </div>
      <div className={mainClassNames}>
        <div className='Clearfix'>
          <div className='Container'>
            {children}
          </div>
          <div className='Sidebar' style={{}}>
            <div className='Section'>
              <h1 className='Title'>Bücher</h1>
              <div className='Image'>
                <a className='ReadMore'  href='https://www.dpunkt.de/buecher/5542/9783864903274-react-12388.html' target='_blank'><img src='/uploads/react-buch-titel.jpg'/>React - Einführung und Grundlagen (Mai 2016)</a>
              </div>
              <div className='Image'>
                <Link className='ReadMore'  to='/posts/das-osgi-buch'><img  src='/uploads/die_osgi_service_platform_01.jpg'/>Die OSGi Service Platform (April 2008)</Link>
              </div>
            </div>
            <div className='Section'>
              <h1 className='Title'>Talks</h1>
              <div className='Image'>
                <a className='ReadMore' href='https://jax.de/session/komponentenentwicklung-mit-react/' target='_blank'><img src='/uploads/JAX_2016_Speakerbutton_Rectangle.jpg'/>Komponentenentwicklung mit React (April 2016)</a>
              </div>
              <div className='Image'>
                <a className='ReadMore' href='https://www.enterjs.de/abstracts.html#worksop-react' target='_blank'><img  src='/uploads/enterjs.svg'/>React Einsteiger Workshop (Juni 2016)</a>
              </div>
            </div>
            <div className='Section'>
              <h1 className='Title'>Kolumne</h1>
              <div className='Image'>
                <a className='ReadMore' href='https://jaxenter.de/tag/keine-angst-vor-javascript' target='_blank'><img src='/uploads/jaxenter.jpg'/>Keine Angst vor JavaScript! (JaxEnter-Kolumne)</a>
              </div>
            </div>
          </div>
        </div>
        <div className='Footer'>
          <Link to='/pages/impressum'>Impressum</Link>
        </div>
      </div>
    </div>;
  }
}
Layout.propTypes = {
  children:      React.PropTypes.any,
  authorization: React.PropTypes.string,
  location:      React.PropTypes.object.isRequired,
  logout:        React.PropTypes.func.isRequired,
  newPost:       React.PropTypes.func.isRequired
};

const w = connectModel(Layout,
  ({ location, authorization }) => ({location, authorization}),
  ({ logout, newPost }) => ({logout, newPost}))
  ;
export default w;
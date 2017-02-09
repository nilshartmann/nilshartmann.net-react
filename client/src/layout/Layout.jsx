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
      return <span><a onClick={() => logout() }>Logout</a> | <a onClick={() => newPost() }>New Post</a> | <Link to='/upload'>Uploads</Link></span>;
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

          <div className='Sidebar'>
            <div className='Section'>
              <h1 className='Title'>Beratung</h1>
              <span className='ReadMore'>Gerne berate und unterstütze ich dich und dein Team rund um das Thema JavaScript (insbesondere React, Redux, TypeScript, Architektur, CI/CD) in Form von Schulungen, Workshops oder Coaching. Bei Interesse einfach <a href='mailto:nils@nilshartmann.net'>anfragen</a>.</span>
            </div>
            <div className='Section'>
              <h1 className='Title'>Bücher</h1>
              <div className='Image'>
                <a className='ReadMore'  href='/posts/react-buch-erschienen'><img src='/uploads/react-buch-titel.jpg'/>React - Die praktische Einf&uuml; hrung in React, React Router und Redux (Juni 2016) </a>
              </div>
              <div className='Image'>
                <Link className='ReadMore'  to='/posts/das-osgi-buch'><img  src='/uploads/die_osgi_service_platform_01.jpg'/>Die OSGi Service Platform (April 2008) </Link>
              </div>
            </div>
            <div className='Section'>
              <h1 className='Title'>Talks und Workshops</h1>
              <div className='Image'>
                <img src='/uploads/1486677191125_JAX_2017.png' alt='Jax Konferenz 2017'/>
                <p><b>Mainz, Mai 2017</b></p>
                <p style={{marginBottom: '0.5em'}}><a className='ReadMore' href='https://jax.de/session/warum-graphql-und-nicht-rest/' target='_blank'>Warum GraphQL und nicht REST?</a></p>
                <p style={{marginBottom: '0.5em'}}><a className='ReadMore' href='https://jax.de/session/rethinking-best-practices-mit-react-webanwendungen-entwickeln/' target='_blank'>Rethinking Best Practices – mit React Webanwendungen entwickeln</a></p>
                <p><a className='ReadMore' href='https://jax.de/session/freitag-12-05-2017-webanwendungen-mit-react-entwickeln-eine-praktische-einfuehrung/' target='_blank'>Webanwendungen mit React entwickeln – eine praktische Einführung (Workshop, 1 Tag)</a></p>
              </div>
              <div className='Image'>
                <img  src='/uploads/1486678559642_dpunkt.jpg'/>
                <p><b>Heidelberg, 1./2. Juni</b></p>
                <a className='ReadMore' href='http://dpunkt.de/react' target='_blank'>
                  Workshop: Einführung in die Philosophie von React und Redux</a>
              </div>
            </div>
            <div className='Section'>
              <h1 className='Title'>Kolumne</h1>
              <div className='Image'>
                <a className='ReadMore' href='https://jaxenter.de/tag/keine-angst-vor-javascript' target='_blank'><img src='/uploads/jaxenter.jpg'/>Keine Angst vor JavaScript!(JaxEnter-Kolumne) </a>
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
  children: React.PropTypes.any,
  authorization: React.PropTypes.string,
  location: React.PropTypes.object.isRequired,
  logout: React.PropTypes.func.isRequired,
  newPost: React.PropTypes.func.isRequired
};

const w = connectModel(Layout,
  ({ location, authorization }) => ({ location, authorization }),
  ({ logout, newPost }) => ({ logout, newPost }))
  ;
export default w;
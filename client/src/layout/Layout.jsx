import React from "react";
import { Link, PropTypes } from "react-router";

import connectModel from "../model/connectModel";

import SocialIcons from "./SocialIcons";

class Layout extends React.Component {
  renderAdminLinks() {
    const { authorization, location, logout, newPost } = this.props;
    if (!authorization) {
      // return <Link to={`/login${location.pathname}`}>Login</Link>;
      return null;
    } else {
      return (
        <span>
          <a onClick={() => logout()}>Logout</a> | <a onClick={() => newPost()}>New Post</a> | <Link to="/upload">Uploads</Link>
        </span>
      );
    }
  }

  render() {
    const { children, location } = this.props;

    // TODO...
    const mainClassNames = location.pathname === "/edit" || location.pathname.startsWith("/edit/") ? "Main Fullwidth" : "Main";

    const adminLinks = this.renderAdminLinks();

    return (
      <div className="Background">
        <div className="Header">
          <Link className="Title" to="/">
            Nils Hartmann
          </Link>
          <SocialIcons />
          {adminLinks}
        </div>
        <div className={mainClassNames}>
          <div className="Clearfix">
            <div className="Container">{children}</div>

            <div className="Sidebar">
              <div className="Section">
                <h1 className="Title">React-Workshops</h1>
                <span className="ReadMore">
                  Gerne unterstütze ich dich und dein Team rund um das Thema JavaScript (insbesondere React, Redux und TypeScript)
                  zum Beispiel in Form von Workshops oder Code-Reviews. Bei Interesse einfach{" "}
                  <a href="mailto:nils@nilshartmann.net">anfragen</a>.
                </span>
              </div>
              <div className="Section">
                <h1 className="Title">Bücher</h1>
                <div className="Image">
                  <a className="ReadMore" href="/posts/react-buch-erschienen">
                    <img src="/uploads/react-buch-titel.jpg" />React - Die praktische Einf&uuml; hrung in React, React Router und
                    Redux (Juni 2016){" "}
                  </a>
                </div>
                <div className="Image">
                  <Link className="ReadMore" to="/posts/das-osgi-buch">
                    <img src="/uploads/die_osgi_service_platform_01.jpg" />Die OSGi Service Platform (April 2008){" "}
                  </Link>
                </div>
              </div>
              <div className="Section">
                <h1 className="Title">Talks und Workshops</h1>
                <div className="Image">
                  <p>
                    <b>EnterJS, Juni 2018</b>
                  </p>
                  <p style={{ marginBottom: "0.5em" }}>
                    <a
                      className="ReadMore"
                      href="https://www.enterjs.de/single?id=6446%C2%B5-frontends%3A-javascript-integration-patterns"
                      target="_blank"
                    >
                      Micro Frontends: JavaScript Integration Patterns
                    </a>
                  </p>
                  <p style={{ marginBottom: "0.5em" }}>
                    <a
                      className="ReadMore"
                      href="https://www.enterjs.de/single?id=6713&apollo-client-2.0%3A-graphql-als-state-management-werkzeug-f%C3%BCr-react"
                      target="_blank"
                    >
                      Apollo Client 2.0: GraphQL als State-Management-Werkzeug für React?
                    </a>
                  </p>
                </div>
                <div className="Image">
                  <p>
                    <b>W-JAX München, November 2018</b>
                  </p>

                  <p style={{ marginBottom: "0.5em" }}>
                    <a
                      className="ReadMore"
                      href="https://jax.de/web-development-javascript/react-2018-context-api-suspense-time-slicing-und-mehr/"
                      target="_blank"
                    >
                      React 2018: Context API, Suspense, Time Slicing und mehr
                    </a>
                  </p>
                </div>
                <div className="Image">
                  <img src="/uploads/1498424152641_nils-im-workshop.jpeg" />
                  <p>
                    <b>Vergangene Talks</b>
                  </p>
                  <a className="ReadMore" href="https://nilshartmann.net/posts/vergangene-talks" target="_blank">
                    Übersicht über vergangene Talks
                  </a>
                </div>
              </div>
              <div className="Section">
                <h1 className="Title">Kolumne</h1>
                <div className="Image">
                  <a className="ReadMore" href="https://jaxenter.de/tag/keine-angst-vor-javascript" target="_blank">
                    <img src="/uploads/jaxenter.jpg" />Keine Angst vor JavaScript!(JaxEnter-Kolumne){" "}
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="Footer">
            <Link to="/pages/impressum">Impressum</Link>&nbsp;|&nbsp;
            <Link to="/pages/datenschutzerklaerung">Datenschutzerklärung</Link>
          </div>
        </div>
      </div>
    );
  }
}

const w = connectModel(
  Layout,
  ({ location, authorization }) => ({ location, authorization }),
  ({ logout, newPost }) => ({ logout, newPost })
);
export default w;

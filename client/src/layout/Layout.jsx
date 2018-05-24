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
                    <b>Voxxed Days Wien, März 2018</b>
                  </p>
                  <p style={{ marginBottom: "0.5em" }}>
                    <a
                      className="ReadMore"
                      href="https://voxxeddaysvienna2018.sched.com/event/Dl01/lets-type-a-practical-introduction-to-typescript-for-java-developers"
                      target="_blank"
                    >
                      Let's type! A practical introdution to TypeScript
                    </a>
                  </p>
                </div>
                <div className="Image">
                  <p>
                    <b>Jax Mainz, April 2018</b>
                  </p>
                  <p style={{ marginBottom: "0.5em" }}>
                    <a
                      className="ReadMore"
                      href="https://jax.de/web-development-javascript/lets-type-eine-praktische-einfuehrung-in-typescript/"
                      target="_blank"
                    >
                      Let's type - eine praktische Einführung in TypeScript
                    </a>
                  </p>
                  <p style={{ marginBottom: "0.5em" }}>
                    <a
                      className="ReadMore"
                      href="https://jax.de/web-development-javascript/react-in-enterprise-anwendungen/"
                      target="_blank"
                    >
                      React in Enterprise Anwendungen
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

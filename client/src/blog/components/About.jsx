// ---------------------------------------------------------------------------
// --- Nils Hartmann | http://nilshartmann.net                             ---
// ---------------------------------------------------------------------------

import React from "react";

import FlickrBar from "./FlickrBar";

export default function About({ flickrImages }) {
  const imgStyle = {
    float: "right",
    maxWidth: "160px",
    marginLeft: "10px"
  };

  const divStyle = {
    float: "left"
  };

  const pStyle = {
    marginBottom: "8px"
  };

  const ulStyle = {
    marginTop: 0
  };

  return (
    <div>
      <div className="Row Clearfix">
        <div className="TitlePanel Title ">Willkommen!</div>

        <p style={pStyle}>
          <img style={imgStyle} src="/uploads/nh.jpg" />Ich bin Nils Hartmann, Softwareentwickler und -Architekt aus Hamburg und
          beschäftige mich mit <b>JavaScript</b> (insbesondere <b>React</b>, Redux, GraphQL und <b>TypeScript</b>). 2016 habe ich
          ein{" "}
          <a href="/posts/react-buch-erschienen">
            <b>Buch über React</b>
          </a>{" "}
          veröffentlicht.
        </p>
        <p style={pStyle}>
          Rund um das Thema React und JavaScript biete ich individuelle <b>Trainings und Workshops</b> (auch In-House) an. Da ich
          auch langjährige Java-Erfahrung habe, kann ich auch bei der Umstellung von Java auf JavaScript behilflich sein. Wenn Du
          Interesse hast, schreibe mir doch einfach eine <a href="mailto:nils@nilshartmann.net">E-Mail</a>.
        </p>
        <p style={pStyle}>
          Regelmäßig halte ich auch <b>Vorträge</b>:
        </p>
        <ul style={ulStyle}>
          <li>
            <a
              href="https://www.enterjs.de/single?id=6713&apollo-client-2.0%3A-graphql-als-state-management-werkzeug-f%C3%BCr-react"
              target="_blank"
            >
              {" "}
              Apollo Client 2.0: GraphQL als State-Management-Werkzeug für React?
            </a>{" "}
            (EnterJS, Darmstadt Juni 2018)
          </li>
          <li>
            <a href="https://www.enterjs.de/single?id=6446%C2%B5-frontends%3A-javascript-integration-patterns" target="_blank">
              Micro Frontends: JavaScript Integration Patterns
            </a>{" "}
            (EnterJS, Darmstadt Juni 2018)
          </li>
          <li>
            <a
              href="https://jax.de/web-development-javascript/react-2018-context-api-suspense-time-slicing-und-mehr/"
              target="_blank"
            >
              React 2018: Context API, Suspense, Time Slicing und mehr
            </a>{" "}
            (W-JAX München, November 2018)
          </li>
        </ul>
      </div>
      <div className="Row">
        <FlickrBar flickrImages={flickrImages} />
      </div>
    </div>
  );
}

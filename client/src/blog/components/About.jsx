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
              href="https://voxxeddaysvienna2018.sched.com/event/Dl01/lets-type-a-practical-introduction-to-typescript-for-java-developers"
              target="_blank"
            >
              {" "}
              Let's Type! A practical introduction to TypeScript for Java developers
            </a>{" "}
            (Voxxed Days Vienna, Wien, 13. März 2018)
          </li>
          <li>
            <a
              href="https://jax.de/web-development-javascript/lets-type-eine-praktische-einfuehrung-in-typescript/"
              target="_blank"
            >
              Let's type! Eine praktische Einführung in TypeScript
            </a>{" "}
            (Jax, Mainz, 26. April 2018)
          </li>
          <li>
            <a href="https://jax.de/web-development-javascript/react-in-enterprise-anwendungen/" target="_blank">
              React in Enterprise-Anwendungen
            </a>{" "}
            (Jax, Mainz, 26. April 2018)
          </li>
        </ul>
      </div>
      <div className="Row">
        <FlickrBar flickrImages={flickrImages} />
      </div>
    </div>
  );
}

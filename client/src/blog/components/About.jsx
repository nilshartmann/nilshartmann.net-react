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
          <img style={imgStyle} src="/uploads/nh.jpg" />Ich bin Nils Hartmann, freiberuflicher Softwareentwickler und -Architekt
          aus Hamburg und beschäftige mich mit <b>Java</b> und <b>JavaScript/TypeScript</b> (insbesondere <b>Spring Boot</b>,{" "}
          <b>GraphQL</b>, <b>React</b>). 2016 habe ich ein{" "}
          <a href="/posts/react-buch-erschienen">
            <b>Buch über React</b>
          </a>{" "}
          veröffentlicht.
        </p>
        <p style={pStyle}>
          Ich unterstütze dich gerne in deinem Projekt, sei es beim programmieren, in Architektur-Fragen oder zum Beispiel durch
          gemeinsame Code-Reviews (auch Remote). Rund um die Themen React, JavaScript, TypeScript und GraphQL biete ich auch
          individuelle <b>Trainings und Workshops</b> (auch In-House) an. Wenn Du Interesse hast, schreibe mir doch einfach eine{" "}
          <a href="mailto:nils@nilshartmann.net">E-Mail</a>, dann schauen wir gemeinsam, was am besten passt.
        </p>
        <p style={pStyle}>
          Regelmäßig halte ich auch <b>Vorträge</b>:
        </p>
        <ul style={ulStyle}>
          <li>
            <a href="https://www.oose.de/abendvortrag/neues-jahr-alles-neu-in-react/" target="_blank">
              Neues Jahr, alles neu in React?
            </a>{" "}
            (OOSE Abendveranstaltung, Hamburg, Januar 2019)
          </li>
          <li>
            <a href="https://programm.javaland.eu/2019/#/scheduledEvent/569601" target="_blank">
              GraphQL für Java-Entwickler
            </a>{" "}
            (JavaLand, Brühl, März 2019)
          </li>

          <li>
            <a href="https://jax.de/serverside-enterprise-java/graphql-fuer-java-anwendungen/" target="_blank">
              {" "}
              GraphQL für Java Anwendungen
            </a>{" "}
            (JAX, Mainz, Mai 2019)
          </li>
          <li>
            <a href="https://jax.de/web-development-javascript/moderne-frontend-architektur-mit-javascript/" target="_blank">
              Moderne Frontend-Architektur mit JavaScript
            </a>{" "}
            (Mit Oliver Zeigermann, JAX, Mainz, Mai 2019)
          </li>
          <li>
            <a href="https://www.md-devdays.de/Act?id=1000027" target="_blank">
              Modernes React
            </a>{" "}
            (Magdeburger Developer Days, Mai 2019)
          </li>
        </ul>
      </div>
      <div className="Row">
        <FlickrBar flickrImages={flickrImages} />
      </div>
    </div>
  );
}

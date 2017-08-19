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
          Rund um das Thema React und JavaScript biete ich <b>Trainings und Workshops</b> an. Da ich auch langjährige
          Java-Erfahrung habe, kann ich auch bei der Umstellung von Java auf JavaScript behilflich sein. Wenn Du Interesse hast,
          schreibe mir doch einfach eine <a href="mailto:nils@nilshartmann.net">E-Mail</a>.
        </p>
        <p style={pStyle}>
          Regelmäßig halte ich auch <b>Vorträge</b>:
          <ul style={ulStyle}>
            <li>
              <a href="https://2017.javazone.no/program/5ddf7fcd3cdd41d78091f0677eb4eec0" target="_blank">
                {" "}Overview of current (JavaScript) frontend architectures
              </a>{" "}
              (JavaZone, Oslo, September 2017)
            </li>
            <li>
              <a
                href="http://bed-con.org/2017/talks/Rethinking-Best-Practices--Moderne-Web-Anwendungen-mit-React-entwickeln"
                target="_blank"
              >
                Rethinking Best Practices – Moderne Web-Anwendungen mit React entwickeln
              </a>{" "}
              (BedCon, Berlin, 22. September 2017)
            </li>
            <li>
              <a href="https://www.oose.de/abendvortrag/single-page-anwendungen-mit-react/" target="_blank">
                Single-Page-Anwendungen mit React
              </a>{" "}
              (OOSE Abendvortrag, Hamburg, 25. Oktober 2017)
            </li>
            <li>
              <a href="https://jax.de/web-development-javascript/das-javascript-oekosystem-orientierungshilfen/" target="_blank">
                Das JavaScript-Ökosystem: Orientierungshilfen
              </a>{" "}
              (W-Jax, München, 8. November 2017)
            </li>
            <li>
              <a
                href="https://jax.de/web-development-javascript/react-und-typescript-workshop-moderne-webanwendungen-entwickeln/"
                target="_blank"
              >
                Workshop: Moderne Webanwendungen mit React und TypeScript entwickeln
              </a>{" "}
              (W-Jax, München, 10. November 2017)
            </li>
            <li>
              <a href="https://nilshartmann.net/posts/vergangene-talks">...und weitere</a>
            </li>
          </ul>
        </p>
      </div>
      <div className="Row">
        <FlickrBar flickrImages={flickrImages} />
      </div>
    </div>
  );
}

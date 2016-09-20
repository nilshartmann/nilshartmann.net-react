// ---------------------------------------------------------------------------
// --- Nils Hartmann | http://nilshartmann.net                             ---
// ---------------------------------------------------------------------------

import React from 'react';

import FlickrBar from './FlickrBar';

export default function About({flickrImages}) {

  const imgStyle = {
      'float': 'right',
      'maxWidth': '160px',
      'marginLeft': '10px'
    };

    const divStyle = {
      'float': 'left'
    }

    const pStyle={
      'marginBottom': '5px'
    };

  return <div>
    <div className='Row Clearfix'>
      <div className='TitlePanel Title '>Willkommen auf meiner Homepage!</div>

      <p style={pStyle}><img  style={imgStyle} src='/uploads/nh.jpg' />Ich bin Nils Hartmann, Software-Entwickler aus Hamburg.</p>
      <p style={pStyle}>Hauptsächlich beschäftige ich mich mit Java (Spring, OSGi, JPA), JavaScript (React, Redux, TypeScript, NodeJS) und dem Thema Continuous Integration/-Deployment (Buildautomatisierung, Git, Docker etc).</p>
      <p style={pStyle}>Ich biete auch Beratung und Workshops für dich und dein Team an. Wenn Du Interesse hast, schreibe mir doch einfach eine <a href="mailto:nils@nilshartmann.net">E-Mail</a>.</p>
      <p style={pStyle}>Viel Spaß auf dieser Seite!</p>
    </div>
    <div className='Row'>
      <FlickrBar flickrImages={flickrImages}/>
    </div>
  </div>;
}


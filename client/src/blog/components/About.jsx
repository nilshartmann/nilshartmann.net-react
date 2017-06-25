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
			<p style={pStyle}>Hauptsächlich beschäftige ich mich derzeit mit der Entwicklung von <b>JavaScript-Anwendungen</b> (insb mit <b>React</b>, Redux, MobX, GraphQL und TypeScript). 2016 habe ich
				ein <a href="/posts/react-buch-erschienen"><b>Buch über React</b></a> veröffentlicht und biete <b>Schulungen und Workshops</b> an. Da ich ursprünglich aus dem Java-Bereich (Spring, OSGi, JPA) komme, kann ich auch bei der Umstellung von Java auf JavaScript behilflich sein.
				Wenn Du Interesse an einem Workshop hast, schreibe mir doch einfach eine <a href="mailto:nils@nilshartmann.net">E-Mail</a></p>
      <p style={pStyle}>Viel Spaß auf dieser Seite!</p>
    </div>
    <div className='Row'>
      <FlickrBar flickrImages={flickrImages}/>
    </div>
  </div>;
}


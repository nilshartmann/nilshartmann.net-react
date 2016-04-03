// ---------------------------------------------------------------------------
// --- Nils Hartmann | http://nilshartmann.net                             ---
// ---------------------------------------------------------------------------

import React from 'react';

import FlickrBar from './FlickrBar';

export default function About({flickrImages}) {
  return <div>
    <div className='Row'>
      <div className='TitlePanel Title'>Willkommen auf meiner Homepage!</div>
      <p>Ich bin Nils Hartmann, Software-Entwickler aus Hamburg. Auf dieser Seite geht es daher auch in erster Linie
        um das Thema Software-Entwicklung (Java und JavaScript) und manchmal auch ums
        Fotografieren.</p>

      <p>Viel Spaß beim Lesen!</p>
    </div>
    <div className='Row'>
      <FlickrBar flickrImages={flickrImages}/>
    </div>
  </div>;
}


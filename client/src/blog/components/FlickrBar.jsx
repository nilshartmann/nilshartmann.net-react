// ---------------------------------------------------------------------------
// --- Nils Hartmann | http://nilshartmann.net                             ---
// ---------------------------------------------------------------------------

import React from "react";

export default class FlickrBar extends React.Component {
  render() {
    const { flickrImages } = this.props;
    if (!flickrImages) {
      return false;
    }
    return (
      <div className="FlickrBar">
        {flickrImages.map(photo =>
          <a key={photo.id} href={photo.flickrUrl} target="_blank">
            <img src={photo.imgUrl} title={photo.title} />
          </a>
        )}
      </div>
    );
  }
}

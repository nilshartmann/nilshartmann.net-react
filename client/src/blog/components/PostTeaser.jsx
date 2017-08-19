// ---------------------------------------------------------------------------
// --- Nils Hartmann | http://nilshartmann.net                             ---
// ---------------------------------------------------------------------------
import React from "react";
import { Link, PropTypes } from "react-router";

import connectModel from "../../model/connectModel";
import { fullPostUrl } from "./../../util/Frontend";

function PostTeaser({ post, pushLocation }) {
  const image = post.image ? <img className="Image" src={post.image} /> : false;
  const postUrl = fullPostUrl(post);

  return (
    <div onClick={() => pushLocation(postUrl)} className="Row PostTeaser Selectable">
      <div className="TitlePanel Clearfix">
        {image}
        {post._date}
        <h1 className="Title">
          {post.title}
        </h1>
      </div>
      <p>
        <span dangerouslySetInnerHTML={{ __html: post._summaryHtml }} />&nbsp;<Link className="ReadMore" to={postUrl}>
          More...
        </Link>
      </p>
    </div>
  );
}

PostTeaser.propTypes = {
  post: React.PropTypes.object.isRequired,
  pushLocation: React.PropTypes.func.isRequired
};

export default connectModel(PostTeaser, null, ({ pushLocation }) => ({ pushLocation }));

// ---------------------------------------------------------------------------
// --- Nils Hartmann | http://nilshartmann.net                             ---
// ---------------------------------------------------------------------------

import React from "react";
import { tagUrl } from "./../../util/Frontend";

import Button from "./Button";

export default class FullPost extends React.Component {
  static defaultProps = {
    loggedIn: false
  };

  constructor(props) {
    super(props);
    this.state = {
      imageExpanded: props.post.image_expanded
    };

    this.toggleExpandedImage = this.toggleExpandedImage.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ imageExpanded: nextProps.post.image_expanded });
  }

  toggleExpandedImage() {
    this.setState({ imageExpanded: !this.state.imageExpanded });
  }

  renderPostImage(post) {
    console.log("post - imageExpanded:", this.state.imageExpanded);

    const imagePosition = post.image_position || "before_summary";
    if (!post.image || imagePosition === "skip") {
      return null;
    }

    if (imagePosition === "left" || imagePosition === "right") {
      const positionClassName = imagePosition.charAt(0).toUpperCase() + imagePosition.substring(1);
      return <img className={`ImageFloating ${positionClassName}`} src={`${post.image}`} />;
    }

    if (this.state.imageExpanded) {
      return (
        <div className="ImageFullWidth-Full">
          <img className="ImageFullWidth-Full" src={`${post.image}`} onClick={this.toggleExpandedImage} />
        </div>
      );
    }

    const postImageStyle = { backgroundImage: `url(${post.image})` };
    return <div className="ImageFullWidth" style={postImageStyle} onClick={this.toggleExpandedImage} />;
  }

  render() {
    const { post, loggedIn } = this.props;

    return (
      <div className="Row FullPost">
        <p className="Date">{post._date}</p>

        <h1 className="Title">{post.title}</h1>

        <div>
          {this.renderPostImage(post)}
          <div className="Summary" dangerouslySetInnerHTML={{ __html: post._summaryHtml }} />
          <div className="Content" dangerouslySetInnerHTML={{ __html: post._contentHtml }} />
        </div>
        <div className="Tags">
          {post.tags.map(tag => {
            return (
              <Button key={tag} linkTo={tagUrl(tag)}>
                {tag}
              </Button>
            );
          })}
        </div>
      </div>
    );
  }
}

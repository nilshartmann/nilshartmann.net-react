// ---------------------------------------------------------------------------
// --- Nils Hartmann | http://nilshartmann.net                             ---
// ---------------------------------------------------------------------------

import React from "react";
import PostEditor from "../components/PostEditor";

import connectModel from "../../model/connectModel";

class PostEditorPage extends React.Component {
  componentDidMount() {
    console.log(".......................................................");
    const { params, loadPost } = this.props;
    console.log("params", params);
    if (params.slug) {
      loadPost(params.slug);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { params, loadPost } = nextProps;
    const currentParams = this.props.params;
    if (params.slug && params.slug !== currentParams.slug) {
      loadPost(params.slug);
    }
  }

  render() {
    console.log("....................................................... post", this.props.post);
    return (
      <div>
        <PostEditor {...this.props} />
      </div>
    );
  }
}

export default connectModel(
  PostEditorPage,
  ({ post, tags }) => ({ post, tags }),
  ({ loadPost, loadTags, savePost }) => ({ loadPost, loadTags, savePost })
);

// ---------------------------------------------------------------------------
// --- Nils Hartmann | http://nilshartmann.net                             ---
// ---------------------------------------------------------------------------

import React from "react";
import { fullPostUrl, postTitle } from "./../../util/Frontend";
import FullPost from "./../components/FullPost";
import NavButton from "./../components/NavButton";
import AdminLinks from "../components/AdminLinks";

import connectModel from "../../model/connectModel";

class FullPostPage extends React.Component {
  componentDidMount() {
    const { loadPost, routeParams } = this.props;
    loadPost(routeParams.slug);
  }

  componentWillReceiveProps(nextProps) {
    const { routeParams: currentRouteParams } = this.props;
    const { loadPost, routeParams } = nextProps;

    if (currentRouteParams.slug !== routeParams.slug) {
      loadPost(routeParams.slug);
    }
  }

  render() {
    const { post, loadPostError, loggedIn, editPost, publishPost } = this.props;
    if (loadPostError) {
      return <h1>{loadPostError}</h1>;
    }

    if (!post) {
      return null;
    }

    return (
      <div>
        <div className="Row Small">
          <div className="NavBar">
            <NavButton url={fullPostUrl(post._prev)} title={`Previous post: ${postTitle(post._prev)}`} icon="angle-left" />
            <NavButton url="/" title="Home" icon="home" />
            <NavButton url={fullPostUrl(post._next)} title={`Next post: ${postTitle(post._next)}`} icon="angle-right" />
          </div>
        </div>

        <FullPost post={post} loggedIn={loggedIn} />
        <AdminLinks post={post} loggedIn={loggedIn} editPost={editPost} publishPost={publishPost} />

        <div className="Row Small">
          <div className="NavBar">
            <NavButton url={fullPostUrl(post._prev)} title={`Previous post: ${postTitle(post._prev)}`} icon="angle-left" />
            <div className="NavButton" />
            <NavButton url={fullPostUrl(post._next)} title={`Next post: ${postTitle(post._next)}`} icon="angle-right" />
          </div>
        </div>
      </div>
    );
  }
}

const connectedComponent = connectModel(
  FullPostPage,
  ({ post, loadPostError }) => ({ post, loadPostError }),
  ({ loadPost, isLoggedIn, editPost, publishPost }) => ({
    loadPost,
    loggedIn: isLoggedIn(),
    editPost,
    publishPost
  })
);
connectedComponent.preRender = (props, { loadPost }) => {
  const { params } = props;
  return loadPost(params.slug);
};

export default connectedComponent;

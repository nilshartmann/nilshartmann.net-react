// ---------------------------------------------------------------------------
// --- Nils Hartmann | http://nilshartmann.net                             ---
// ---------------------------------------------------------------------------

import React from "react";
import { Link } from "react-router";

import connectModel from "../../model/connectModel";
import About from "./../components/About";
import PostList from "./../components/PostList";

class IndexPage extends React.Component {
  componentDidMount() {
    const { getFlickrImages, loadPosts } = this.props;
    getFlickrImages();
    loadPosts({ limit: 5 });
  }

  render() {
    return (
      <div>
        <About {...this.props} />
        <PostList {...this.props} />

        <div className="Row">
          <div className="Center">
            <div className="Title">
              <Link to="/posts" title="Alle Beiträge anzeigen">
                Alle Beiträge anzeigen
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const connectedIndexPage = connectModel(IndexPage, model => model, actions => actions);
connectedIndexPage.preRender = (props, actions) => {
  return Promise.all([actions.getFlickrImages(), actions.loadPosts({ limit: 5 })]);
};
export default connectedIndexPage;

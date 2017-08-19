// ---------------------------------------------------------------------------
// --- Nils Hartmann | http://nilshartmann.net                             ---
// ---------------------------------------------------------------------------

import React from "react";

import connectModel from "../../model/connectModel";

import PostList from "./../components/PostList";
import NavButton from "./../components/NavButton";

class AllPostsPage extends React.Component {
  componentDidMount() {
    const { loadPosts } = this.props;

    loadPosts();
  }

  render() {
    const { posts } = this.props;
    return (
      <div>
        <PostList posts={posts} />

        <div className="Row Narrow">
          <div className="NavBar Center">
            <NavButton url="/" label="Home" />
          </div>
        </div>
      </div>
    );
  }
}

export default connectModel(AllPostsPage, ({ posts }) => ({ posts }), ({ loadPosts }) => ({ loadPosts }));

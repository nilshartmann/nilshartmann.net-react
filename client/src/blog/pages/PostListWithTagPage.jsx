// ---------------------------------------------------------------------------
// --- Nils Hartmann | http://nilshartmann.net                             ---
// ---------------------------------------------------------------------------

import React from 'react';
import { Link } from 'react-router';

import connectModel from '../../model/connectModel';

import PostList from './../components/PostList';
import NavButton from './../components/NavButton';

class PostsWithTagList extends React.Component {
  componentDidMount() {
    const { loadPosts, routeParams } = this.props;

    loadPosts({filter: {'tag': routeParams.tag}});
  }

  render() {
    const {routeParams, posts} = this.props;
    return <div>
      <div className='Row Narrow'>Find below a list of all posts tagged with <span
        className='TagName'>{routeParams.tag}</span> (or see a list of <Link to='/tags'>all tags</Link>)

        <div className='Right'><NavButton url={NavButton.BACK} icon='close' scale='lg'/></div>
      </div>
      <PostList posts={posts} />
    </div>;
  }
}

const connectedPostsWithTagList = connectModel(PostsWithTagList, ({ posts }) => ({ posts }), ({ loadPosts }) => ({ loadPosts }));
connectedPostsWithTagList.preRender = (props, actions) => {
  console.log('PRERENDER', props);
  return actions.loadPosts({filter: {'tag': props.params.tag}})
}
export default connectedPostsWithTagList;
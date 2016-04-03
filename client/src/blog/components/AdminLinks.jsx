import React from 'react';

import Button from './Button';

import { editPost } from './../../util/Frontend';

export default function AdminLinks({ post, loggedIn, editPost,  publishPost }) {
  if (!loggedIn) {
    // stateless function components MUST return an element
    return <div></div>;
  }

  return <div>
    <Button onClick={ () => editPost(post.slug) }>Edit</Button>
    { post.published ? null : <Button onClick={ () => publishPost(post.slug) }>Publish</Button>}
  </div>;
}
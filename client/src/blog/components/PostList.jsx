// ---------------------------------------------------------------------------
// --- Nils Hartmann | http://nilshartmann.net                             ---
// ---------------------------------------------------------------------------

import React from "react";

import PostTeaser from "./PostTeaser";

export default function PostList({ posts }) {
  if (!posts) {
    return <div />;
  }
  return (
    <div>
      {posts.map(post => {
        return <PostTeaser key={post.slug} post={post} />;
      })}
    </div>
  );
}

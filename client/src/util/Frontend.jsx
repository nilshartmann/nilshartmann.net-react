// ---------------------------------------------------------------------------
// --- Nils Hartmann | http://nilshartmann.net                             ---
// ---------------------------------------------------------------------------
/* Returns the Url to the specified post or null if post is not defined */
export function fullPostUrl(post) {
  if (!post) {
    return null;
  }
  return `/posts/${post.slug}`;
}

/* returns the title of the specified post or null if post is not defined */
export function postTitle(post) {
  if (!post) {
    return null;
  }

  return post.title;
}

export function tagUrl(tag) {
  return `/tags/${tag}`;
}

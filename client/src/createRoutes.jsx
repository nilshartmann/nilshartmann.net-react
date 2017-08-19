import React from "react";

import { Route } from "react-router";

// Components
import Layout from "./layout/Layout";
import IndexPage from "./blog/pages/IndexPage";
import AllPostsPage from "./blog/pages/AllPostsPage";
import FullPostPage from "./blog/pages/FullPostPage";
import PostListWithTagPage from "./blog/pages/PostListWithTagPage";
import TagListPage from "./blog/pages/TagListPage";
import UploadForm from "./admin/pages/UploadForm";
import LoginPage from "./admin/pages/LoginPage";
import ImpressumPage from "./layout/ImpressumPage";
import PostEditorPage from "./admin/pages/PostEditorPage";

export default function createRoutes(model) {
  function requireAuth(nextState, replace) {
    const state = model.getState();
    if (!state.authorization) {
      const redirect = nextState.location.pathname;
      replace(`/login${redirect}`);
    }
  }

  return (
    <Route component={Layout}>
      <Route path="/" component={IndexPage} />
      <Route path="/posts" component={AllPostsPage} />
      <Route path="/posts/:slug" component={FullPostPage} />
      <Route path="/tags" component={TagListPage} />
      <Route path="/tags/:tag" component={PostListWithTagPage} />
      <Route path="/pages/impressum" component={ImpressumPage} />

      <Route path="/login" component={LoginPage} />
      <Route path="/login/*" component={LoginPage} />
      <Route path="/upload" component={UploadForm} onEnter={requireAuth} />
      <Route path="/edit" component={PostEditorPage} onEnter={requireAuth} />
      <Route path="/edit/:slug" component={PostEditorPage} onEnter={requireAuth} />
    </Route>
  );
}

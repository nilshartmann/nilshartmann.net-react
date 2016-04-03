import { EventEmitter } from 'events';

import { browserHistory } from 'react-router'

const MODEL_CHANGE_EVENT = 'model_change';

const DUMMY_LOCAL_STORAGE = {
  getItem() {},
  setItem() {},
  removeItem() {}
}

const DUMMY_HISTORY = {
  push() {},
  listen() {}
}

/**
 * A Model consits of a state and action that manipulate the state
 * (there a some 'read-only' actions too...)
 */
export default function createModel({initialState, backendUrl, history = DUMMY_HISTORY, localStorage = DUMMY_LOCAL_STORAGE}) {
  // Initial State
  let state = initialState ? initialState : {};

    // util
  function doFetch(url, params = {}) {
    const authHeader = state.authorization ? { authorization: state.authorization } : null;
    params.headers = Object.assign({
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      authHeader,
      params.headers
    );

    return fetch(url, params)
  }

  // TODO
  const authorization = localStorage.getItem('simpleblog_authorization');
  console.log('Authorization from localStorage', authorization);
  state.authorization = authorization;
  if (authorization) {
    doFetch(`${backendUrl}/api/restricted`, {
      headers: { authorization }
    })
    .then(response => response.ok ? mergeState({authorization}) : discardAuthorization())
    .catch(e => console.log('ERROR WHILE VALIDATING AUTHORIZATION', e));
  }

  // Event emitter
  const emitter = Object.assign({}, EventEmitter.prototype, {
    emitChange() {
      this.emit(MODEL_CHANGE_EVENT);
    },

    addChangeListener(callback) {
      this.on(MODEL_CHANGE_EVENT, callback);
    },

    removeChangeListener(callback) {
      this.removeListener(MODEL_CHANGE_EVENT, callback);
    }
  });

  function subscribe(callback) {
    const cb = () => callback(state);
    emitter.on(MODEL_CHANGE_EVENT, cb);

    return function () {
      emitter.removeListener(MODEL_CHANGE_EVENT, cb);
    }
  }

  // merges old and new state and emits event
  function mergeState(newState, callback) {
    state = Object.assign({}, state, newState);
    if (callback) {
      return callback();
    }
    emitter.emitChange();
  }

  function getState() {
    return state;
  }

  // initialize State (Note: state is synced only in direction history => state, but not
  // vice vers. Changing location in state does not change history)
  history.listen(location => mergeState({ location }));



  function discardAuthorization() {
    localStorage.removeItem('simpleblog_authorization');
    mergeState({ authorization: null });
  }

  let flickrImages;
  function getOrFetchFlickrImages(url) {
    if (flickrImages) {
      return Promise.resolve(flickrImages);
    }
    return doFetch(url)
      .then(response => response.json())
      .then(json => { flickrImages = json; return flickrImages; })
      .then(flickrImages => shuffle(flickrImages))
      .then(getOrFetchFlickrImages);
  }

  const actions = Object.assign({}, {
    // Router / History / Navigation ------------------------------------
    pushLocation(url) {
      history.push(url);
    },

    login(userid, password, redirectOnSuccess) {
      const payload = {
        userid,
        password
      };

      const url = `${backendUrl}/api/login`;
      const params = {
        method: 'post',
        body: JSON.stringify(payload),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      };

      return fetch(url, params)
        .then(response => {
          if (response.ok) {
            const authorization = response.headers.get('authorization');
            localStorage.setItem('simpleblog_authorization', authorization);
            mergeState(
              { authorization },
              () => actions.pushLocation(redirectOnSuccess)
              );
          } else {
            // TODO ERROR HANDLING INVALID LOGIN
            discardAuthorization();
          }
        })
        .catch(err => { console.log('Could not login', err); discardAuthorization(); })
    },

    logout() {
      return doFetch(`${backendUrl}/api/logout`)
        .then(discardAuthorization)
        .then(actions.pushLocation('/'))
        .catch(ex => {console.error('parsing failed', ex); discardAuthorization()})
        ;
    },

    isLoggedIn() {
      const { authorization } = state;
      return authorization !== null && authorization !== undefined;
    },

    loadPost(slug) {
      console.log('Load Post', slug);
      // https://github.com/reactjs/redux/issues/291#issuecomment-122828218
      function handleResponse(response) {
        if (!response.ok) {
          const loadPostError = response.status === 404 ? 'Post not found' : 'An error occured';
          return mergeState({
            post: null,
            loadPostError
          })
        }
        return response.json()
          .then(post => mergeState({
            loadPostError: undefined,
            post
          })
            );
      }

      return doFetch(`${backendUrl}/api/posts/${slug}`)
        .then(handleResponse)
        .catch(ex => console.error('parsing failed', ex))
        ;
    },

    loadPosts({filter, limit} = {}) {
      const options = {
        'fields': 'slug,summary,title,image'
      };

      if (filter) {
        options.filter = filter;
      }

      if (limit) {
        options.limit = limit;
      }

      const url = `${backendUrl}/api/posts?options=${JSON.stringify(options) }`;
      return doFetch(url)
        .then(response => response.json())
        .then(posts => mergeState({ posts }))
        .catch(ex => console.error('parsing failed', ex))
        ;
    },

    loadTags(levels) {
      return doFetch(`${backendUrl}/api/tags?count=true`)
        .then(response => response.json())
        .then(tags => {
          console.log('tags', tags);
          const range = Math.max(0.01, tags.max - tags.min) * 1.0001;
          tags.tags.forEach((tag) => {
            tag.weight = 1 + Math.floor(levels * (tag.count - tags.min) / range);
          });
          mergeState(tags);
        })
        .catch(ex => console.error('fetching tags failed', ex));
    },

    getFlickrImages(count = 6) {
      // TODO: flickr handling is evil in the current way
      // i.e. what happens, if count changes on following calls
      return getOrFetchFlickrImages(`${backendUrl}/api/flickrimages`)
        .then(allFlickrImages => {
          const currentIndex = state.flickrImagesIndex || 0
          mergeState({
            flickrImages: allFlickrImages.slice(currentIndex, currentIndex + count),
            flickrImagesIndex: currentIndex + count
          })
        });
    },


    editPost(slug) {
      actions.pushLocation(`/edit/${slug}`);
    },

    newPost() {
      mergeState({post: null}, () => actions.pushLocation(`/edit`));
    },

    publishPost(slug) {
      function handleResponse(response) {
        console.log('Response received');
        if (!response.ok) {
          return mergeState({ publishPostError: response.statusText});
        }
        return actions.loadPost(slug);
      }

      const url = `${backendUrl}/api/posts`;
      return doFetch(url,
        {method: 'PUT',
        body: JSON.stringify({
          slug,
          action: 'publish'
        })
        })
        .then(handleResponse)
        .catch(err => console.error('PUBLISH POST FAILED', err));
        ;
    },

    savePost(post) {
      return actions.postJson(`/api/posts`,
        { post }
      );
    },

    postJson(relativePath, payload) {
      const url = `${backendUrl}${relativePath}`;
      const json = JSON.stringify(payload);
      const params = {
        method:  'post',
        body:    json,
        headers: {
          'Accept':       'application/json',
          'Content-Type': 'application/json',
          authorization: state.authorization
        }
      };

      return fetch(url, params)
        .then(res => {console.log('res', res); return res; })
        .then(response => response.json().then(data => ({ response, data })))
      ;
    },

    postForm(path, form) {
      const url = `${backendUrl}${path}`;
      const params = {
        method: 'post',
        body:   form,
        headers: {
          authorization: state.authorization
        }
      };
      return fetch(url, params);
    },

    listUploads() {

      console.log('state', state);
      const url = `${backendUrl}/api/uploads`;
      const params = {
        headers: {
          authorization: state.authorization
        }
      };

      return fetch(url, params)
        .then(res => res.json())
        .then(uploads => mergeState({uploads}))
      ;
    }
  });

  return {
    // use to subscribe to state changes
    subscribe,

    // all actions that can be invoked
    actions,

    getState
  };
}

function shuffle(array) {
  let currentIndex = array.length;
  let temporaryValue;
  let randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex !== 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

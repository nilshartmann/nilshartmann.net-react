import "isomorphic-fetch";

import { shuffle } from "../util/Utils";

const FLICKR_END_POINT = "https://api.flickr.com/services/rest/";

export function createReadApi(contentStore, config) {
  function queryPosts(options = {}) {
    return contentStore
      .readPosts()
      .then(posts => posts.filter(post => !options.filter || post.tags.find(t => t === options.filter.tag)))
      .then(posts => (options.limit ? posts.slice(0, options.limit) : posts));
  }

  function getPost(slug) {
    return contentStore.readPosts().then(posts => {
      const thisPost = posts.findIndex(post => slug === post.slug);
      if (thisPost === -1) {
        // not found
        return null;
      }

      const copy = Object.assign({}, posts[thisPost], {
        _prev: thisPost > 0 ? posts[thisPost - 1] : undefined,
        _next: thisPost < posts.length - 1 ? posts[thisPost + 1] : undefined
      });

      return copy;
    });
  }

  function getTags(withCount) {
    return contentStore.readPosts().then(posts => {
      const result = {
        tags: []
      };
      if (withCount) {
        result.min = Number.MAX_VALUE;
        result.max = Number.MIN_VALUE;
      }
      const tagMap = {};

      posts.forEach(post => {
        post.tags.forEach(tag => {
          if (!withCount) {
            if (result.tags.indexOf(tag) === -1) {
              result.tags.push(tag);
            }
          } else {
            if (!tagMap[tag]) {
              const t = { count: 1, tag };
              tagMap[tag] = t;
              result.tags.push(t);
            } else {
              tagMap[tag].count = tagMap[tag].count + 1;
            }
            result.min = Math.min(result.min, tagMap[tag].count);
            result.max = Math.max(result.max, tagMap[tag].count);
          }
        });
      });

      // sort by name
      result.tags.sort((aTag, bTag) => {
        const a = aTag.tag || aTag;
        const b = bTag.tag || bTag;
        if (a > b) {
          return 1;
        }
        if (a < b) {
          return -1;
        }
        return 0;
      });

      return result;
    });
  }

  let flickrImages = null;

  function getFlickrImages() {
    // TODO: when to refresh the cache? (a) on new uploads to flickr (b) is the photo secret valid forever?
    if (flickrImages) {
      return Promise.resolve(flickrImages);
    }

    console.log("Fetching Flickr Images");

    const { flickr: { apiKey, userId } } = config;
    // https://www.flickr.com/services/api/flickr.people.getPublicPhotos.html
    const url = `${FLICKR_END_POINT}?method=flickr.people.getPublicPhotos&api_key=${apiKey}&user_id=${userId}&format=json&nojsoncallback=1`;
    return fetch(url)
      .then(response => response.json())
      .then(flickrResponse => {
        if (flickrResponse.stat !== "ok") {
          console.err("Flickr returned error:");
          console.dir(flickrResponse);
        }

        // https://www.flickr.com/services/api/misc.urls.html
        return flickrResponse.photos.photo.map(photo => ({
          imgUrl: `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_s.jpg`,
          id: photo.id,
          title: photo.title,
          flickrUrl: `https://www.flickr.com/photos/${photo.owner}/${photo.id}`
        }));
      })
      .then(flickrPhotos => {
        flickrImages = flickrPhotos;
        return flickrPhotos;
      });
  }

  return {
    queryPosts,
    getPost,
    getTags,
    getFlickrImages
  };
}

export function createWriteApi(contentStore, apiUser, apiPassword) {
  function login(userid, password) {
    if (userid === apiUser && password === apiPassword) {
      return {
        user: userid
      };
    }
  }

  function storeDraft(post) {
    return contentStore.storeDraft(post);
  }

  function publishPost(slug) {
    return contentStore.publishPost(slug);
  }

  function listUploads() {
    return contentStore.listUploadedFiles();
  }

  function upload(payload, fileName, formFile) {
    return contentStore.storeUpload(payload, fileName, formFile);
  }

  return {
    login,
    storeDraft,
    publishPost,
    listUploads,
    upload
  };
}

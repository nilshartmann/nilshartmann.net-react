import React from 'react';
import { RouterContext, match } from 'react-router';
import { renderToString } from 'react-dom/server';
import ModelProvider from '../../client/src/model/ModelProvider';
import createModel from '../../client/src/model/createModel';
import createRoutes from '../../client/src/createRoutes'
import renderIndexHtml from '../renderIndexHtml';

// important to create a new store per request, otherwise it gets reused with all requests and data keeps on adding
export default function renderRoute(request, reply, backendUrl) {
  const model = createModel({backendUrl})
  console.log('**************************** RENDER ROUTE ******************************');
  const location = request.path;
  const routes = createRoutes(model);
  match({routes, location}, (error, redirectLocation, renderProps) => {
    if (redirectLocation) {
      reply.redirect(redirectLocation.pathname + redirectLocation.search);
    } else if (error) {
      console.error(error);
      reply(error.message).code(500);
    } else if (renderProps == null) {
      reply('Not found').code(404);
    } else {
      preRender(renderProps.components, renderProps, model).then(() => {
        const html = renderToString(
          <ModelProvider model={model}>
            <RouterContext {...renderProps}/>
          </ModelProvider>
        );
        const initialState = model.getState();
        reply(renderFullPage(html, backendUrl, initialState));
      }).catch(error => {
        console.log('############### ERROR: ', error);
        return reply(error).code(500);
      })
    }
  });
}

function preRender(components, renderProps, model) {
  const preRenderComponents = components.filter(component => component && component.preRender);
  const preRenderPromises =
    preRenderComponents.map(component => component.preRender(renderProps, model.actions));
  return Promise.all(preRenderPromises);
}

function renderFullPage(html, backendUrl, initialState) {
  return renderIndexHtml(backendUrl, initialState, html);
}
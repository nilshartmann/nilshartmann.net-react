import React, { Children } from 'react';

export const ModelShape =  React.PropTypes.shape({
   subscribe: React.PropTypes.func.isRequired,
   actions: React.PropTypes.object.isRequired,
   getState: React.PropTypes.func.isRequired
});

export default class ModelProvider extends React.Component {

  static propTypes = {
    model: React.PropTypes.object.isRequired,
    children: React.PropTypes.element.isRequired
  };

  static childContextTypes = {
    model: React.PropTypes.object.isRequired
  }

  constructor(props, context) {
    super(props, context);
    this.model = props.model;
  }

  getChildContext() {
    return { model: this.model }
  }

render() {
    const { children } = this.props;
    return Children.only(children);
  }
}
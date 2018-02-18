import React, { Children } from "react";
import PropTypes from "prop-types";

export const ModelShape = PropTypes.shape({
  subscribe: PropTypes.func.isRequired,
  actions: PropTypes.object.isRequired,
  getState: PropTypes.func.isRequired
});

export default class ModelProvider extends React.Component {
  static propTypes = {
    model: PropTypes.object.isRequired,
    children: PropTypes.element.isRequired
  };

  static childContextTypes = {
    model: PropTypes.object.isRequired
  };

  constructor(props, context) {
    super(props, context);
    this.model = props.model;
  }

  getChildContext() {
    return { model: this.model };
  }

  render() {
    const { children } = this.props;
    return Children.only(children);
  }
}

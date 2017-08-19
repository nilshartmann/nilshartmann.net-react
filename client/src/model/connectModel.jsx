import React from "react";

import { ModelShape } from "./ModelProvider";

/**
 * Connects a Component to the model's state and/or actions.
 *
 * Both state and actions are passed as props to the wrapped component.
 * When the model (state) changes the new state is passed to the wrapped component.
 *
 */
// stateMapping: name-in-model to name-in-props
// actionMapping is 'read-once', as actions don't change.
const connectModel = (ClientComponent, stateMapping, actionMapping) =>
  class extends React.Component {
    static contextTypes = {
      model: ModelShape.isRequired
    };

    constructor(props, context) {
      super(props, context);

      const { model } = this.context;

      if (actionMapping) {
        // since actions don't change we just run the mapping function once
        this.state = {
          actions: actionMapping(model.actions)
        };
      } else {
        this.state = {
          actions: {}
        };
      }
    }

    componentDidMount() {
      // only listen to model changes if wrapped component is interessted in
      // model state
      if (!stateMapping) {
        return;
      }

      const { model } = this.context;
      this.unsubscribeModel = model.subscribe(() => this.onChangeModel());
    }

    componentWillUnmount() {
      const { unsubscribeModel } = this;
      if (unsubscribeModel) {
        unsubscribeModel();
      }
    }

    onChangeModel() {
      this.forceUpdate(); // TODO
    }

    render() {
      const { model } = this.context;

      const modelState = stateMapping ? stateMapping(model.getState()) : {};
      const modelActions = this.state.actions;
      const targetProps = { ...modelState, ...modelActions, ...this.props };

      return <ClientComponent {...targetProps} />;
    }
  };

export default connectModel;

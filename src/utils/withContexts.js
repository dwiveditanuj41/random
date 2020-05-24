import React from 'react';

const withContexts = (contexts = []) => WrappedComponent => {
  const WrappingComponent = contexts.reduce((AccumulatedComponent, context) => {
    const { Consumer } = context;
    return props => (
      <Consumer>
        {contextValues => (
          <AccumulatedComponent {...props} {...contextValues} />
        )}
      </Consumer>
    );
  }, WrappedComponent);

  return WrappingComponent;
};

export default withContexts;

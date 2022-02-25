import React from 'react';

export const ReactionsContext = React.createContext({
  hitReact: (reactId, postId) => {},
  isPending: (reactId, postId) => {},
});

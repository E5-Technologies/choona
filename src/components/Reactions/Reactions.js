import React from 'react';
import {
  ReactionButtonDisco,
  ReactionButtonFire,
  ReactionButtonHeart,
  ReactionButtonThrowback,
  ReactionButtonThumbsDown,
  ReactionButtonThumbsUp,
} from './Buttons/Buttons';

const Reactions = {
  thumbsUp: {
    map: 'A',
    oldText: '🔥',
    icon: <ReactionButtonThumbsUp active />,
  },
  fire: {
    map: 'B',
    oldText: '😍',
    icon: <ReactionButtonFire active />,
  },
  heart: {
    map: 'C',
    oldText: '💃',
    icon: <ReactionButtonHeart active />,
  },
  disco: {
    map: 'D',
    oldText: '🕺',
    icon: <ReactionButtonDisco active />,
  },
  throwback: {
    map: 'E',
    oldText: '🤤',
    icon: <ReactionButtonThrowback active />,
  },
  thumbsDown: {
    map: 'F',
    oldText: '👍',
    icon: <ReactionButtonThumbsDown active />,
  },
};

export default Reactions;

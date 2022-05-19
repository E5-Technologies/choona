import React from 'react';
import {
  ReactionButtonDisco,
  ReactionButtonFire,
  ReactionButtonHeart,
  ReactionButtonThrowback,
  ReactionButtonThumbsDown,
  ReactionButtonThumbsUp,
} from './Buttons/Buttons';


const ReactionComponent = ({value,onClick}) => {
  switch (value) {
    case 'thumbsUp':
      return   <ReactionButtonThumbsUp active onClick={onClick ? onClick : () => null} />
    case 'fire':
      return <ReactionButtonFire active onClick={onClick ? onClick : () => null} />
    case 'heart':
      return  <ReactionButtonHeart active onClick={onClick ? onClick : () => null} />
    case 'disco':
      return <ReactionButtonDisco active onClick={onClick ? onClick : () => null} />
    case 'throwback':
      return <ReactionButtonThrowback active onClick={onClick ? onClick : () => null} />
    case 'thumbsDown':
      return <ReactionButtonThumbsDown active onClick={onClick ? onClick : () => null} />
    default:
      return <></>;
  }
};

export default ReactionComponent;

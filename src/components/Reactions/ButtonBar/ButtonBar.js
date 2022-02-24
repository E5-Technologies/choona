import React from 'react';
import { View } from 'react-native';
import {
  ReactionButtonDisco,
  ReactionButtonFire,
  ReactionButtonHeart,
  ReactionButtonThrowback,
  ReactionButtonThumbsDown,
  ReactionButtonThumbsUp,
} from '../Buttons/Buttons';
import Reactions from '../Reactions';
import styles from './ButtonBar.style';

const ReactionButtonBar = ({ onReactPressed, myReactions }) => {
  return (
    <View style={styles.container}>
      <ReactionButtonThumbsUp
        style={{ marginRight: 5, maxWidth: 50 }}
        active={myReactions.thumbsUp}
        onClick={() => {
          return onReactPressed('thumbsUp');
        }}
      />
      <ReactionButtonFire
        style={{ marginRight: 5, maxWidth: 50 }}
        active={myReactions.fire}
        onClick={() => onReactPressed('fire')}
      />
      <ReactionButtonHeart
        style={{ marginRight: 5, maxWidth: 50 }}
        active={myReactions.heart}
        onClick={() => onReactPressed('heart')}
      />
      <ReactionButtonDisco
        style={{ marginRight: 5, maxWidth: 50 }}
        active={myReactions.disco}
        onClick={() => onReactPressed('disco')}
      />
      <ReactionButtonThrowback
        style={{ marginRight: 5, maxWidth: 50 }}
        active={myReactions.throwback}
        onClick={() => onReactPressed('throwback')}
      />
      <ReactionButtonThumbsDown
        style={{ maxWidth: 50 }}
        active={myReactions.thumbsDown}
        onClick={() => onReactPressed('thumbsDown')}
      />
    </View>
  );
};

export default ReactionButtonBar;

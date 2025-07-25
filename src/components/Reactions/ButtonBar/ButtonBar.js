import React from 'react';
import {StyleSheet, View} from 'react-native';
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

const ReactionButtonBar = ({
  onReactPressed,
  myReactions,
  myReactionsPending,
  relatedId,
}) => {
  return (
    <View style={styles.container}>
      <ReactionButtonThumbsUp
        style={style.iconstyle}
        active={myReactions.thumbsUp}
        pending={myReactionsPending.thumbsUp}
        relatedId={relatedId}
        onClick={() => {
          return onReactPressed('thumbsUp', relatedId);
        }}
      />
      <ReactionButtonFire
        style={style.iconstyle}
        active={myReactions.fire}
        pending={myReactionsPending.fire}
        relatedId={relatedId}
        onClick={() => onReactPressed('fire', relatedId)}
      />
      <ReactionButtonHeart
        style={style.iconstyle}
        active={myReactions.heart}
        pending={myReactionsPending.heart}
        relatedId={relatedId}
        onClick={() => onReactPressed('heart', relatedId)}
      />
      <ReactionButtonDisco
        style={style.iconstyle}
        active={myReactions.disco}
        pending={myReactionsPending.disco}
        relatedId={relatedId}
        onClick={() => onReactPressed('disco', relatedId)}
      />
      <ReactionButtonThrowback
        style={style.iconstyle}
        active={myReactions.throwback}
        pending={myReactionsPending.throwback}
        relatedId={relatedId}
        onClick={() => onReactPressed('throwback', relatedId)}
      />
      <ReactionButtonThumbsDown
        style={{maxWidth: 35}}
        active={myReactions.thumbsDown}
        pending={myReactionsPending.thumbsDown}
        relatedId={relatedId}
        onClick={() => onReactPressed('thumbsDown', relatedId)}
      />
    </View>
  );
};

export default ReactionButtonBar;

const style = StyleSheet.create({
  iconstyle: {
    marginRight: 5,
    maxWidth: 35,
  },
});

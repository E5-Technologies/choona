import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import Colors from '../../../assests/Colors';
import normalise from '../../../utils/helpers/Dimens';

const HomeListItemReactions = ({ onReactionPress, reactions }) => {
  const react = ['🔥', '😍', '💃', '🕺', '🤤', '👍'];

  return (
    <View style={styles.listItemReactionsContainer}>
      <TouchableOpacity onPress={() => onReactionPress(react[0])}>
        <Text style={styles.listItemReactionsIcon}>{react[0]}</Text>
        <Text style={styles.listItemReactionsText}>
          {reactions ? reactions.fire_count : 0}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onReactionPress(react[1])}>
        <Text style={styles.listItemReactionsIcon}>{react[1]}</Text>
        <Text style={styles.listItemReactionsText}>
          {reactions ? reactions.love_count : 0}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onReactionPress(react[2])}>
        <Text style={styles.listItemReactionsIcon}>{react[2]}</Text>
        <Text style={styles.listItemReactionsText}>
          {reactions ? reactions.dancer_count : 0}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onReactionPress(react[3])}>
        <Text style={styles.listItemReactionsIcon}>{react[3]}</Text>
        <Text style={styles.listItemReactionsText}>
          {reactions ? reactions.man_dancing_count : 0}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onReactionPress(react[4])}>
        <Text style={styles.listItemReactionsIcon}>{react[4]}</Text>
        <Text style={styles.listItemReactionsText}>
          {reactions ? reactions.face_count : 0}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onReactionPress(react[5])}>
        <Text style={styles.listItemReactionsIcon}>{react[5]}</Text>
        <Text style={styles.listItemReactionsText}>
          {reactions ? reactions.thumbsup_count : 0}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default HomeListItemReactions;

const styles = StyleSheet.create({
  listItemReactionsContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  listItemReactionsIcon: {
    fontSize: normalise(25),
    fontWeight: 'bold',
  },
  listItemReactionsText: {
    color: Colors.white,
    fontFamily: 'ProximaNova-Bold',
    fontSize: normalise(10),
    position: 'absolute',
    right: normalise(-4),
    top: normalise(Platform.OS === 'android' ? -6 : -4),
  },
});

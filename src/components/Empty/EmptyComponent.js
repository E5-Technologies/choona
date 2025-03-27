import React from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import Colors from '../../assests/Colors';
import normalise from '../../utils/helpers/Dimens';

const EmptyComponent = ({ buttonPress, buttonText, image, text, title }) => {
  return (
    <View style={styles.emptyContainer}>
      {image && (
        <Image
          source={image ? image : null}
          style={styles.emptyImage}
          resizeMode="contain"
        />
      )}
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptyText}>{text}</Text>
      {buttonText && (
        <TouchableOpacity
          style={styles.emptyButton}
          onPress={() => buttonPress()}>
          <Text style={styles.emptyButtonText}>{buttonText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default EmptyComponent;

const styles = StyleSheet.create({
  emptyContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: normalise(32),
  },
  emptyImage: {
    height: Math.floor(Dimensions.get('window').width / 1.8),
    marginBottom: normalise(20),
    width: Math.floor(Dimensions.get('window').width / 1.8),
  },
  emptyTitle: {
    color: Colors.white,
    fontFamily: 'ProximaNova-Bold',
    fontSize: normalise(16),
    marginBottom: normalise(6),
    textAlign: 'center',
  },
  emptyText: {
    color: Colors.fordGray,
    fontSize: normalise(12),
    fontFamily: 'ProximaNova-Regular',
    marginHorizontal: normalise(12),
    textAlign: 'center',
  },
  emptyButton: {
    alignItems: 'center',
    borderRadius: normalise(24),
    backgroundColor: Colors.white,
    height: normalise(42),
    justifyContent: 'center',
    marginTop: normalise(30),
    width: '100%',
  },
  emptyButtonText: {
    color: Colors.darkerblack,
    fontFamily: 'Kallisto',
    fontSize: normalise(12),
    textTransform: 'uppercase',
  },
});

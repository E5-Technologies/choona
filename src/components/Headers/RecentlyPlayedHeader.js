import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import normaliseNew from '../../utils/helpers/DimensNew';
import Colors from '../../assests/Colors';

export const RecentlyPlayedHeader = ({ registerType }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        YOUR RECENTLY PLAYED ON{' '}
        {registerType === 'spotify' ? 'SPOTIFY' : 'APPLE MUSIC'}
      </Text>
      <Text style={styles.textAlt}>Pull to Refresh</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '100%',
    height: normaliseNew(40),
    alignItems: 'center',
    backgroundColor: Colors.darkerblack,
    justifyContent: 'space-between',
  },
  text: {
    color: Colors.white,
    fontSize: normaliseNew(10),
    marginLeft: normaliseNew(16),
    fontFamily: 'ProximaNova-Bold',
  },
  textAlt: {
    color: '#979797',
    fontSize: normaliseNew(10),
    marginRight: normaliseNew(16),
    fontFamily: 'ProximaNova-Regular',
    textTransform: 'uppercase',
  },
});

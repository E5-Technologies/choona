import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Text} from 'react-native-gesture-handler';
import ImagePath from '../../assests/ImagePath';
import {useMemo} from 'react';

export function TrackProgress({
  setModalVisible,
  modalVisible,
  duration,
  position,
  isShow=false
}) {
  // function format(seconds) {
  //   let mins = parseInt(seconds / 60)
  //     .toString()
  //     .padStart(2, '0');
  //   let secs = (Math.trunc(seconds) % 60).toString().padStart(2, '0');
  //   return `${mins}:${secs}`;
  // }

  const formattedTime = useMemo(() => {
    const format = seconds => {
      let mins = Math.floor(seconds / 60)
        .toString()
        .padStart(2, '0');
      let secs = Math.floor(seconds % 60)
        .toString()
        .padStart(2, '0');
      return `${mins}:${secs}`;
    };

    return `${format(position)} / ${format(duration)}`;
  }, [position, duration]);

  return (
    <View style={{}}>
      <Text style={styles.trackProgress}>
        {/* {format(position)} / {format(duration)} */}
        {formattedTime}
      </Text>
      {isShow &&
      <TouchableOpacity
        style={styles.addIconWrapper}
        onPress={() => setModalVisible(!modalVisible)}>
        <Image
          source={ImagePath.add_white}
          style={styles.inviteIcon}
          resizeMode="cover"
        />
      </TouchableOpacity>
}
    </View>
  );
}

const styles = StyleSheet.create({
  trackProgress: {
    marginTop: 15,
    textAlign: 'center',
    fontSize: 12,
    color: '#eee',
  },
  inviteIcon: {
    height: 25,
    width: 25,
  },
  addIconWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.6,
    position: 'absolute',
    top: -10,
    right: 0,
    width: 50,
    height: 50,
  },
});

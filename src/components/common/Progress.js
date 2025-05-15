import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Text} from 'react-native-gesture-handler';
import {useProgress} from 'react-native-track-player';
import ImagePath from '../../assests/ImagePath';

export function TrackProgress({setModalVisible, modalVisible}) {
  const {position, duration} = useProgress(200);

  function format(seconds) {
    let mins = parseInt(seconds / 60)
      .toString()
      .padStart(2, '0');
    let secs = (Math.trunc(seconds) % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  }

  return (
    <View style={{}}>
      <Text style={styles.trackProgress}>
        {format(position)} / {format(duration)}
      </Text>
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          opacity: 0.6,
          // backgroundColor: 'green',
          position: 'absolute',
          top: -10,
          right: 0,
          width: 50,
          height: 50,
        }}
        onPress={() => setModalVisible(!modalVisible)}>
        <Image
          source={ImagePath.add_white}
          style={styles.inviteIcon}
          resizeMode="cover"
        />
        {/* <Text
                    style={[
                      styles.listItemHeaderSongTextTitle,
                      {marginLeft: normalise(8), fontSize: normalise(13)},
                    ]}
                    numberOfLines={2}>
                    Send Invite
                  </Text> */}
      </TouchableOpacity>
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
    // borderRadius: 5,
    height: 25,
    width: 25,
  },
});

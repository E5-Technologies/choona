// import React, {useContext} from 'react';
// import {
//   View,
//   Text,
//   FlatList,
//   StyleSheet,
//   TouchableOpacity,
//   Button,
//   Alert,
// } from 'react-native';
// import PlayButton from './PlayButton';
// import {PlayerContext, PlayerProvider} from './PlayerContext';

// const SongItem = ({item}) => {
//   // const {currentSong, isPlaying, playSong} = useContext(PlayerContext);
//   // console.log(currentSong, isPlaying, 'these are tow');
//   // //   const isCurrent = currentSong === item?.id;
//   // const isCurrent = currentSong == '1802080084';

//   // const handlePlaySong = songId => {
//   //   console.log(songId, 'its song id >>');
//   //   playSong(songId);
//   // };

//   const {
//     currentSong,
//     isPlaying,
//     isAuthorized,
//     isLoading,
//     playMedia,
//     togglePlayback,
//   } = useContext(PlayerContext);

//   const isCurrent = currentSong === '1802080084';

//   const handlePress = songId => {
//     if (isCurrent && isPlaying) {
//       togglePlayback();
//     } else {
//       Alert.alert('play');
//       playMedia(songId);
//     }
//   };

//   return (
//     <View style={styles.songItem}>
//       <View style={styles.songInfo}>
//         <Text style={styles.title}>{item?.song_name} </Text>
//         <Text style={styles.artist}>{item?.artist_name}</Text>
//       </View>
//       {/* <PlayButton
//         songId={'1802080084'}
//         size={36}
//         color={isCurrent ? '#FF2D55' : '#000'}
//       /> */}
//       {/* <Button title="play" onPress={() => handlePlaySong('1802080084')} /> */}
//       <Button title="play" onPress={() => handlePress('1802080084')} />
//     </View>
//   );
// };

// const SongListScren = props => {
//   console.log(props?.route.params?.songList, 'this is song lists');
//   return (
//     <PlayerProvider>
//       <View style={{flex: 1, backgroundColor: 'black', marginTop: 80}}>
//         <FlatList
//           data={props?.route.params?.songList}
//           keyExtractor={item => item?.id}
//           renderItem={({item}) => <SongItem item={item} />}
//         />
//       </View>
//     </PlayerProvider>
//   );
// };

// const styles = StyleSheet.create({
//   songItem: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//   },
//   songInfo: {
//     flex: 1,
//     marginRight: 10,
//   },
//   title: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: 'white',
//   },
//   artist: {
//     fontSize: 14,
//     color: '#666',
//   },
// });

// export default SongListScren;

import {
  Auth,
  MusicKit,
  Player,
  useCurrentSong,
  useIsPlaying,
  CatalogSearchType,
} from '@lomray/react-native-apple-music';
import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Button, Image, Alert} from 'react-native';

const SongListScren = () => {
  const {isPlaying} = useIsPlaying();
  const {song} = useCurrentSong();
  const [songList, setSongList] = useState({});

  // console.log(song, isPlaying, 'thesa rerf');

  // const onAuth = () => {
  //   Auth.authorize()
  //     .then(status => console.log('Authorize:', status))
  //     .catch(console.error);
  // };

  const onAuth = () => {
    Auth.authorize()
      .then(status => {
        Alert.alert('yes');
        if (status == 'authorized') {
          Alert.alert('authorized');
        }
        console.log('Authorize:', status);
      })
      .catch(error => {
        console.log(error, 'its error , whil asking permiesion ');
      });
  };

  const onCheck = () => {
    Auth.checkSubscription()
      .then(result => console.log('CheckSubscription: ', result))
      .catch(error =>
        console.log(error, 'this is errro when check user Subscription'),
      );
  };

  const onToggle = () => void Player.togglePlayerState();

  const onFetch = () => {
    MusicKit.catalogSearch('Taylor Swift', [CatalogSearchType.SONGS], {
      limit: 1,
      offset: 0,
    })
      .then(results => {
        // console.log('Search Results:', results);
        setSongList(results?.songs[0]);
      })
      .catch(error => {
        console.error('Failed to perform catalog search:', error);
      });
  };

  const onSkip = () => void Player.skipToNextEntry();

  async function setPlaybackQueue(itemId) {
    try {
      await MusicKit.setPlaybackQueue(itemId, 'song');
    } catch (error) {
      console.error('Setting playback queue:', error);
    }
  }

  useEffect(() => {
    console.log(songList, 'this is first song');

    setPlaybackQueue(songList?.id);
  }, [songList]);

  return (
    <View style={styles.container}>
      <Text>App</Text>
      <Button title="Authorize" onPress={onAuth} />
      <Button title="Check Status" onPress={onCheck} />
      <Button title="Fetch" onPress={onFetch} />
      <View style={styles.mt16}>
        <Button title={isPlaying ? 'Pause' : 'Play'} onPress={onToggle} />
        <Button title="Next" onPress={onSkip} />
      </View>
      <View style={styles.musicContainer}>
        <View
          style={[
            styles.indicator,
            {backgroundColor: isPlaying ? 'green' : 'red'},
          ]}
        />
        {song && (
          <>
            {song.artworkUrl && (
              <Image style={styles.image} source={{uri: song.artworkUrl}} />
            )}
            <View style={styles.content}>
              <Text>{song.title}</Text>
              <Text style={styles.artist}>{song.artistName}</Text>
            </View>
          </>
        )}
      </View>
    </View>
  );
};

export default SongListScren;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  mt16: {
    marginTop: 16,
  },
  indicator: {
    width: 10,
    height: 10,
    borderRadius: 10,
    marginRight: 12,
  },
  musicContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 4,
    marginRight: 12,
  },
  content: {
    maxWidth: '80%',
  },
  artist: {
    fontWeight: '700',
  },
});

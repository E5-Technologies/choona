const fs = require('fs');
let code = fs.readFileSync('App.js', 'utf8');
let lines = code.split('\n');

// 1. Remove MusicPlayerBar from the root
const rootMusicPlayerBar =
    `            <MusicPlayerBar
              onPress={() => {
                const song = playingSongRef;
                if (song) {
                  NavigationService.navigate('Player', {
                    comments: [],
                    song_title: song.song_name,
                    album_name: song.album_name,
                    song_pic: song.song_pic,
                    username: song.username,
                    profile_pic: song.profile_pic,
                    uri: song.uri,
                    reactions: song.reactionData,
                    id: song.id,
                    artist: song.artist,
                    changePlayer: song.changePlayer,
                    originalUri: song.originalUri,
                    isrc: song.isrc,
                    registerType: song.regType,
                    details: song.details,
                    showPlaylist: song.showPlaylist,
                    comingFromMessage: song.comingFromMessage,
                    apple_song_id: song.apple_song_id,
                  });
                }
              }}
            />`;

code = code.replace(rootMusicPlayerBar, '');

// 2. Add BottomTabBar import
code = code.replace("import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';", "import { createBottomTabNavigator, BottomTabBar } from '@react-navigation/bottom-tabs';");

// 3. Extract BottomTab
lines = code.split('\n'); // re-split because we removed music player bar
let startIdx = lines.findIndex(l => l.includes('const BottomTab = () => {'));
let endIdx = -1;
let braces = 0;
for (let i = startIdx; i < lines.length; i++) {
    if (lines[i].includes('{')) braces += (lines[i].match(/{/g) || []).length;
    if (lines[i].includes('}')) braces -= (lines[i].match(/}/g) || []).length;
    // wait! What if { and } are unbalanced? In JS it's fine. 
    if (braces === 0 && lines[i].trim() === '};') {
        endIdx = i;
        break;
    }
}

let bottomTabLines = lines.slice(startIdx, endIdx + 1);

// Remove BottomTab from original lines
lines.splice(startIdx, endIdx - startIdx + 1);
code = lines.join('\n');

// 4. Modify BottomTab to include hooks & tabBar
let bottomTabStr = bottomTabLines.join('\n');

const hooksToAdd =
    `    const TokenReducer = useSelector(state => state.TokenReducer);
    const playingSongRef = useSelector(state => state.SongReducer.playingSongRef);`;

bottomTabStr = bottomTabStr.replace(
    '    const MessageReducer = useSelector(state => state.MessageReducer);',
    '    const MessageReducer = useSelector(state => state.MessageReducer);\n' + hooksToAdd
);

const customTabBar =
    `          tabBar={props => (
            <View style={{ backgroundColor: 'transparent' }}>
              <MusicPlayerBar
                position="relative"
                onPress={() => {
                  const song = playingSongRef;
                  if (song) {
                    NavigationService.navigate('Player', {
                      comments: [],
                      song_title: song.song_name,
                      album_name: song.album_name,
                      song_pic: song.song_pic,
                      username: song.username,
                      profile_pic: song.profile_pic,
                      uri: song.uri,
                      reactions: song.reactionData,
                      id: song.id,
                      artist: song.artist,
                      changePlayer: song.changePlayer,
                      originalUri: song.originalUri,
                      isrc: song.isrc,
                      registerType: song.regType,
                      details: song.details,
                      showPlaylist: song.showPlaylist,
                      comingFromMessage: song.comingFromMessage,
                      apple_song_id: song.apple_song_id,
                    });
                  }
                }}
              />
              <BottomTabBar {...props} />
            </View>
          )}
          initialRouteName={`;

bottomTabStr = bottomTabStr.replace("          initialRouteName={", customTabBar);

// 5. Insert BottomTab before App
code = code.replace('const App = () => {', bottomTabStr + '\n\nconst App = () => {');

fs.writeFileSync('App.js', code);
console.log('Done refactoring');

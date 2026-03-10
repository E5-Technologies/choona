import os
import sys

def main():
    file_path = '/Users/akvashisth/Documents/choona/choona/App.js'
    with open(file_path, 'r') as f:
        lines = f.readlines()
        
    # The BottomTab starts at line 197 (index 196) and ends at line 656 (index 655)
    start_idx = -1
    for i, line in enumerate(lines):
        if 'const BottomTab = () => {' in line:
            start_idx = i
            break
            
    if start_idx == -1:
        print("BottomTab not found")
        sys.exit(1)
        
    # find end of BottomTab block
    end_idx = start_idx
    braces = 0
    for i in range(start_idx, len(lines)):
        braces += lines[i].count('{')
        braces -= lines[i].count('}')
        if braces == 0 and lines[i].strip() == '};':
            end_idx = i
            break
            
    bottom_tab_lines = lines[start_idx:end_idx+1]
    
    # modify bottom_tab_lines to inject Redux hooks
    for i, line in enumerate(bottom_tab_lines):
        if 'const MessageReducer = useSelector(state => state.MessageReducer);' in line:
            bottom_tab_lines.insert(i + 1, '    const TokenReducer = useSelector(state => state.TokenReducer);\n')
            bottom_tab_lines.insert(i + 2, '    const playingSongRef = useSelector(state => state.SongReducer.playingSongRef);\n')
            break
            
    # Replace the Tab.Navigator with custom tabBar
    for i, line in enumerate(bottom_tab_lines):
        if 'initialRouteName={' in line:
            tab_bar_str = """          tabBar={props => (
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
"""
            bottom_tab_lines.insert(i, tab_bar_str)
            break
            
    # Remove BottomTab from the original lines array
    del lines[start_idx:end_idx+1]
    
    # insert bottom_tab_lines before 'const App = () => {'
    app_idx = -1
    for i, line in enumerate(lines):
        if 'const App = () => {' in line:
            app_idx = i
            break
            
    if app_idx != -1:
        # Insert all bottom_tab_lines
        for line in reversed(bottom_tab_lines):
            lines.insert(app_idx, line)
        lines.insert(app_idx + len(bottom_tab_lines), '\n')
            
    # Remove MusicPlayerBar from bottom
    start_music = -1
    end_music = -1
    for i in range(len(lines)):
        if '<MusicPlayerBar' in lines[i] and '          </AppleMusicContext.Provider>' in lines[i+100] or '            <MusicPlayerBar' in lines[i]:
            if '              onPress={() => {' in lines[i+1]:
                start_music = i
                for j in range(i, len(lines)):
                    if '            />' in lines[j] and '          </AppleMusicContext.Provider>' in lines[j+1]:
                        end_music = j
                        break
                if end_music != -1:
                    break
                    
    if start_music != -1 and end_music != -1:
        del lines[start_music:end_music+1]
        
    # Import BottomTabBar
    for i, line in enumerate(lines):
        if "from '@react-navigation/bottom-tabs';" in line:
            lines[i] = "import { createBottomTabNavigator, BottomTabBar } from '@react-navigation/bottom-tabs';\n"
            break
            
    with open(file_path, 'w') as f:
        f.writelines(lines)
        
    print("Python script generated correctly and executed.")

if __name__ == '__main__':
    main()

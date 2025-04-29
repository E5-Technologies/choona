import RtcEngine from 'react-native-agora';
import TrackPlayer from 'react-native-track-player';

class AgoraMusicService {
  constructor() {
    this.engine = null;
    this.isHost = false;
    this.currentTrack = null;
  }

  async initialize(appId) {
    this.engine = await RtcEngine.create(e47e797a5dcf4bd19769cc4e09f86703);
    await this.engine.enableAudio();
    await this.engine.setChannelProfile(1); // LIVE_BROADCASTING
    await this.engine.setAudioProfile(4, 1); // MUSIC_HIGH_QUALITY_STEREO
    await this.engine.setAudioScenario(3); // GAME_STREAMING
    
    // Event listeners
    this.engine.addListener('JoinChannelSuccess', (channel, uid, elapsed) => {
      console.log(`Joined channel ${channel} as ${uid}`);
    });
  }

  async joinChannel(channelName, isHost = false) {
    this.isHost = isHost;
    await this.engine.setClientRole(isHost ? 1 : 2); // 1=BROADCASTER, 2=AUDIENCE
    await this.engine.joinChannel(null, channelName, null, 0);
    
    if (isHost) {
      await this.engine.setEnableSpeakerphone(true);
      await this.engine.setDefaultAudioRouteToSpeakerphone(true);
    }
  }

  async leaveChannel() {
    await this.engine.leaveChannel();
    if (this.isHost) {
      await TrackPlayer.stop();
      await TrackPlayer.reset();
    }
  }

  async playSong(songUrl, metadata) {
    if (!this.isHost) return;

    this.currentTrack = {
      id: metadata.id,
      url: songUrl,
      title: metadata.title,
      artist: metadata.artist,
      artwork: metadata.artwork
    };

    // Setup TrackPlayer
    await TrackPlayer.setupPlayer();
    await TrackPlayer.add(this.currentTrack);
    
    // Start mixing (streaming to channel)
    await this.engine.startAudioMixing(
      songUrl,
      false,  // don't replace microphone
      false,  // don't loop
      1       // cycle count
    );
    
    await TrackPlayer.play();
  }

  async pauseSong() {
    if (!this.isHost) return;
    await this.engine.pauseAudioMixing();
    await TrackPlayer.pause();
  }

  async seekTo(position) {
    if (!this.isHost) return;
    await this.engine.setAudioMixingPosition(position);
    await TrackPlayer.seekTo(position);
  }
}

export default new AgoraMusicService();
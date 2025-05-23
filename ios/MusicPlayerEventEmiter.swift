import Foundation
import MusicKit
import MediaPlayer
import React

@objc(MusicPlayerEventEmitter)
class MusicPlayerEventEmitter: RCTEventEmitter {
    private var timer: Timer?
    
    @objc override static func requiresMainQueueSetup() -> Bool {
        return true
    }
    
    override func supportedEvents() -> [String]! {
        return ["PlaybackProgress"]
    }
    
    @objc override func startObserving() {
        timer = Timer.scheduledTimer(withTimeInterval: 1.0, repeats: true) { _ in
            self.sendPlaybackProgress()
        }
    }
    
    @objc override func stopObserving() {
        timer?.invalidate()
        timer = nil
    }
    
    private func sendPlaybackProgress() {
        let player = SystemMusicPlayer.shared
        guard let currentEntry = player.queue.currentEntry else { return }
        
        let elapsed = player.playbackTime
        let duration = currentEntry.item.duration
        
        let payload: [String: Any] = [
            "elapsed": elapsed,
            "duration": duration,
            "progress": duration > 0 ? elapsed / duration : 0.0
        ]
        
        sendEvent(withName: "PlaybackProgress", body: payload)
    }

    @objc func constantsToExport() -> [String: Any]! {
        return ["version": "1.0"]
    }
}
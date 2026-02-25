#import <Foundation/Foundation.h>
#import "React/RCTBridgeModule.h"
#import <StoreKit/StoreKit.h>
#import <MediaPlayer/MediaPlayer.h>

@interface Print : NSObject <RCTBridgeModule>
@end

@implementation Print

RCT_EXPORT_MODULE(Print)

RCT_EXPORT_METHOD(printValue:(NSString *)developerToken
                  resolve:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    if (@available(iOS 11.0, *)) {
        SKCloudServiceController *cloudServiceController = [[SKCloudServiceController alloc] init];
        [SKCloudServiceController requestAuthorization:^(SKCloudServiceAuthorizationStatus status) {
            if (status == SKCloudServiceAuthorizationStatusAuthorized) {
                [cloudServiceController requestCapabilitiesWithCompletionHandler:^(SKCloudServiceCapability capabilities, NSError * _Nullable error) {
                    // Check capability using bitwise AND
                    if (capabilities & SKCloudServiceCapabilityMusicCatalogPlayback) {
                        [cloudServiceController requestUserTokenForDeveloperToken:developerToken completionHandler:^(NSString * _Nullable token, NSError * _Nullable error) {
                            if (token) {
                                [[NSUserDefaults standardUserDefaults] setObject:token forKey:@"MUSIC_USER_TOKEN"];
                                [[NSUserDefaults standardUserDefaults] setObject:developerToken forKey:@"DEVELOPER_TOKEN"];
                                resolve(token);
                            } else {
                                reject(@"E_COUNT", @"User Token blank", error);
                            }
                        }];
                    } else {
                        // Request library permissions
                        [MPMediaLibrary requestAuthorization:^(MPMediaLibraryAuthorizationStatus libStatus) {
                            // After requesting, we can assume failure for now
                            reject(@"E_UNAUTHORIZED", @"No playback capability", error);
                        }];
                    }
                }];
            } else {
                reject(@"E_UNAUTHORIZED", @"Not authorized", nil);
            }
        }];
    } else {
        reject(@"E_UNSUPPORTED", @"Requires iOS 11.0 or newer", nil);
    }
}

@end

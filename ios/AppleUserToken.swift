//
//  Print.swift
//  YourAppName
//

import Foundation
import StoreKit
import MediaPlayer

@objc(Print)
class Print: NSObject {
    private let appleMusicManager = AppleMusicManager()
    private var authorizationManager: AuthorizationManager?
    
    // Corrected method signature
    @objc(printValue:resolve:rejecter:)
    func printValue(_ developerToken: String,
                   resolve: @escaping RCTPromiseResolveBlock,
                   reject: @escaping RCTPromiseRejectBlock) -> Void {
        
        DispatchQueue.main.async {
            self.setupAuthorizationManager()
            
            // Store the developer token
            SharedClass.shared.developerToken = developerToken
            
            // Check authorization status first
            let cloudStatus = SKCloudServiceController.authorizationStatus()
            let mediaStatus = MPMediaLibrary.authorizationStatus()
            
            if cloudStatus != .authorized || mediaStatus != .authorized {
                self.requestPermissions(developerToken: developerToken, resolve: resolve, reject: reject)
            } else {
                self.requestUserToken(developerToken: developerToken, resolve: resolve, reject: reject)
            }
        }
    }
    
    private func setupAuthorizationManager() {
        if authorizationManager == nil {
            authorizationManager = AuthorizationManager(appleMusicManager: appleMusicManager)
            NotificationCenter.default.addObserver(
                self,
                selector: #selector(handleAuthorizationUpdate),
                name: AuthorizationManager.cloudServiceDidUpdateNotification,
                object: nil
            )
        }
    }
    
    private func requestPermissions(developerToken: String,
                                  resolve: @escaping RCTPromiseResolveBlock,
                                  reject: @escaping RCTPromiseRejectBlock) {
        SKCloudServiceController.requestAuthorization { [weak self] status in
            guard let self = self else { return }
            
            if status != .authorized {
                reject("E_CLOUD_AUTH", "User denied Apple Music access", nil)
                return
            }
            
            MPMediaLibrary.requestAuthorization { [weak self] status in
                guard let self = self else { return }
                
                if status != .authorized {
                    reject("E_MEDIA_AUTH", "User denied Media Library access", nil)
                    return
                }
                
                self.requestUserToken(developerToken: developerToken, resolve: resolve, reject: reject)
            }
        }
    }
    
    private func requestUserToken(developerToken: String,
                                resolve: @escaping RCTPromiseResolveBlock,
                                reject: @escaping RCTPromiseRejectBlock) {
        let cloudServiceController = SKCloudServiceController()
        
        cloudServiceController.requestCapabilities { [weak self] capabilities, error in
            guard let self = self else { return }
            
            if let error = error {
                reject("E_CAPABILITIES", "Failed to get capabilities", error)
                return
            }
            
            if !capabilities.contains(.musicCatalogPlayback) {
                // User doesn't have Apple Music subscription
                resolve("")
                return
            }
            
            if #available(iOS 11.0, *) {
                cloudServiceController.requestUserToken(forDeveloperToken: developerToken) { token, error in
                    if let error = error {
                        reject("E_TOKEN", "Failed to get user token", error)
                        return
                    }
                    
                    guard let token = token else {
                        reject("E_TOKEN", "User token is nil", nil)
                        return
                    }
                    
                    // Store tokens
                    UserDefaults.standard.set(token, forKey: "MUSIC_USER_TOKEN")
                    UserDefaults.standard.set(developerToken, forKey: "DEVELOPER_TOKEN")
                    
                    resolve(token)
                }
            } else {
                reject("E_VERSION", "iOS version too old", nil)
            }
        }
    }
    
    @objc
    private func handleAuthorizationUpdate() {
        // Handle authorization updates if needed
    }
    
    deinit {
        NotificationCenter.default.removeObserver(self)
    }
}




// //
// //  AppleUserToken.swift
// //  Choona
// //
// //  Created by webskitters on 02/09/20.
// //

// import Foundation
// import UIKit
// import StoreKit
// import MediaPlayer

// @objc(Print)
// class Print: UIViewController {
//   let notificationCenter = NotificationCenter.default
//   var appleMusicManager = AppleMusicManager()
//   var authorizationManager : AuthorizationManager?
//   var didPresentCloudServiceSetup = false
  
//   var appleMusicUserToken = ""
  
//    @objc
//    func printValue(_ developerToken : String,  resolve: @escaping RCTPromiseResolveBlock,
//                    rejecter reject: @escaping RCTPromiseRejectBlock) {
    
//     authorizationManager = AuthorizationManager(appleMusicManager: appleMusicManager)
//     notificationCenter.addObserver(self,
//                                    selector: #selector(handleAuthorizationManagerDidUpdateNotification),
//                                    name: AuthorizationManager.cloudServiceDidUpdateNotification,
//                                    object: nil)
//     SharedClass.shared.developerToken = developerToken
   
//     //var musicUserToken = musicToken()
    
// //    if musicUserToken != ""{
// //        resolve(musicUserToken)
// //      }else{
// //        print("HERE IS ELSE",musicUserToken)
// //      }
    
//     if let _ = SharedClass.shared.developerToken{
//         let developerToken = SharedClass.shared.developerToken
//         let cloudServiceController = SKCloudServiceController()
//         SKCloudServiceController.requestAuthorization { status in
//             print(status)
//             guard status == .authorized else {
//                 print(status)
//                 return
//             }
//             print(status)
//         }
        
//         cloudServiceController.requestCapabilities { capabilities, error in
//             guard capabilities.contains(.musicCatalogPlayback) else {
//                 print(error?.localizedDescription)
//                 self.authorizationManager!.requestCloudServiceAuthorization()
                
//                 self.authorizationManager!.requestMediaLibraryAuthorization()
//               resolve("")
//               return
                
//             }
//             print(capabilities)
//         }
        
//       if #available(iOS 11.0, *) {
//         cloudServiceController.requestUserToken(forDeveloperToken: developerToken!, completionHandler: { token, error in
          
//           guard let token = token else {
//             print(error?.localizedDescription)
//             // resolve("")
//            reject("E_COUNT", "User Token blank", error)
//             return }
//           UserDefaults.standard.set(token, forKey: "MUSIC_USER_TOKEN")
//           UserDefaults.standard.set(developerToken, forKey: "DEVELOPER_TOKEN")
//           self.appleMusicUserToken = token
//           print("Music User Token:", token)
//           resolve(token)
          
//         })
//       } else {
//         // Fallback on earlier versions
//       }
//     }
  
      
//   }
  
  
// //  @objc
// //  func decrement(
// //    _ resolve: RCTPromiseResolveBlock,
// //    rejecter reject: RCTPromiseRejectBlock
// //  ) -> Void {
// //
// //  }
  
  
  
  
  
  
  
//   override func viewDidLoad() {
//       super.viewDidLoad()

//   }
//   @objc func handleAuthorizationManagerDidUpdateNotification() {
//       DispatchQueue.main.async {
//           if SKCloudServiceController.authorizationStatus() == .notDetermined || MPMediaLibrary.authorizationStatus() == .notDetermined {
//               print("not")
//               //  self.navigationItem.rightBarButtonItem?.isEnabled = true
//           } else {
//               // self.navigationItem.rightBarButtonItem?.isEnabled = false
//               print("determined")
              
//             if #available(iOS 10.1, *) {
//               if self.authorizationManager!.cloudServiceCapabilities.contains(.musicCatalogSubscriptionEligible) &&
//                   !self.authorizationManager!.cloudServiceCapabilities.contains(.musicCatalogPlayback)
//               {
//                 print("xxxxx")
//                 self.presentCloudServiceSetup()
//               }
//             } else {
//               // Fallback on earlier versions
//             }
//             /*  if !self.authorizationManager!.cloudServiceCapabilities.contains(.musicCatalogSubscriptionEligible)
//               {
//                   print("xxxxx")
//                   self.presentCloudServiceSetup()
//               }*/
//           }
          
//           DispatchQueue.main.async {
//               // self.tableView.reloadData()
//               print("yyyyy")
//             self.appleMusicUserToken = self.musicToken()
              
//           }
//       }
//   }
  
//   func presentCloudServiceSetup() {
      
//       guard didPresentCloudServiceSetup == false else {
//           return
//       }
      
//       /*
//        If the current `SKCloudServiceCapability` includes `.musicCatalogSubscriptionEligible`, this means that the currently signed in iTunes Store
//        account is elgible for an Apple Music Trial Subscription.  To provide the user with an option to sign up for a free trial, your application
//        can present the `SKCloudServiceSetupViewController` as demonstrated below.
//        */
      
//     if #available(iOS 10.1, *) {
//       let cloudServiceSetupViewController = SKCloudServiceSetupViewController()
//     } else {
//       // Fallback on earlier versions
//     }
// //      cloudServiceSetupViewController.delegate = self
// //
// //      cloudServiceSetupViewController.load(options: [.action: SKCloudServiceSetupAction.subscribe]) { [weak self] (result, error) in
// //          guard error == nil else {
// //              fatalError("An Error occurred: \(error!.localizedDescription)")
// //          }
// //
// //          if result {
// //              self?.present(cloudServiceSetupViewController, animated: true, completion: nil)
// //              self?.didPresentCloudServiceSetup = true
// //          }
// //      }
//   }
  
//   func musicToken() -> String
//   {
//       if let _ = SharedClass.shared.developerToken{
//           let developerToken = SharedClass.shared.developerToken
//           let cloudServiceController = SKCloudServiceController()
//           SKCloudServiceController.requestAuthorization { status in
//               print(status)
//               guard status == .authorized else {
//                   print(status)
//                   return
//               }
//               print(status)
//           }
          
//           cloudServiceController.requestCapabilities { capabilities, error in
//               guard capabilities.contains(.musicCatalogPlayback) else {
//                   print(error?.localizedDescription)
//                   self.authorizationManager!.requestCloudServiceAuthorization()
                  
//                   self.authorizationManager!.requestMediaLibraryAuthorization()
//                   return
                  
//               }
//               print(capabilities)
//           }
          
//         if #available(iOS 11.0, *) {
//           cloudServiceController.requestUserToken(forDeveloperToken: developerToken!, completionHandler: { token, error in
            
//             guard let token = token else {
//               print(error?.localizedDescription)
//               return }
//             UserDefaults.standard.set(token, forKey: "MUSIC_USER_TOKEN")
//             UserDefaults.standard.set(developerToken, forKey: "DEVELOPER_TOKEN")
//             self.appleMusicUserToken = token
//             print("Music User Token:", token)
            
            
//           })
//         } else {
//           // Fallback on earlier versions
//         }
//       }
//     return self.appleMusicUserToken
//   }
  
// }

// extension Print: SKCloudServiceSetupViewControllerDelegate {
//   @available(iOS 10.1, *)
//   func cloudServiceSetupViewControllerDidDismiss(_ cloudServiceSetupViewController: SKCloudServiceSetupViewController) {
//         //        DispatchQueue.main.async {
//         //            self.tableView.reloadData()
//         //        }
//     }
// }


//
//  AppleUserToken.swift
//  Choona
//
//  Created by webskitters on 02/09/20.
//

import Foundation
import UIKit
import StoreKit
import MediaPlayer

@objc(Print)
class Print: UIViewController {
  let notificationCenter = NotificationCenter.default
  var appleMusicManager = AppleMusicManager()
  var authorizationManager : AuthorizationManager?
  var didPresentCloudServiceSetup = false
  
  var appleMusicUserToken = ""
  
   @objc
   func printValue(_ developerToken : String,  resolve: @escaping RCTPromiseResolveBlock,
                   rejecter reject: @escaping RCTPromiseRejectBlock) {
    
    authorizationManager = AuthorizationManager(appleMusicManager: appleMusicManager)
    notificationCenter.addObserver(self,
                                   selector: #selector(handleAuthorizationManagerDidUpdateNotification),
                                   name: AuthorizationManager.cloudServiceDidUpdateNotification,
                                   object: nil)
    SharedClass.shared.developerToken = developerToken
   
//    var musicUserToken = musicToken()
//    if musicUserToken != ""{
//        resolve(musicUserToken)
//      }else{
//        print("HERE IS ELSE",musicUserToken)
//      }
    
    if let _ = SharedClass.shared.developerToken{
        let developerToken = SharedClass.shared.developerToken
        let cloudServiceController = SKCloudServiceController()
        SKCloudServiceController.requestAuthorization { status in
            print(status)
            guard status == .authorized else {
                print(status)
                return
            }
            print(status)
        }
        
        cloudServiceController.requestCapabilities { capabilities, error in
            guard capabilities.contains(.musicCatalogPlayback) else {
                print(error?.localizedDescription)
                self.authorizationManager!.requestCloudServiceAuthorization()
                
                self.authorizationManager!.requestMediaLibraryAuthorization()
                return
                
            }
            print("CAPABILITIES--",capabilities)
        }

         print("FLOW_REACHED_HERE")
        
      if #available(iOS 11.0, *) {
                
//        cloudServiceController.requestUserToken(forDeveloperToken: developerToken!) { userToken, error in
//               
//          print("USER TOKEN", userToken)
//          if let error = error {
//                    print("Failed to get user token: \(error.localizedDescription)")
//                  reject("E_COUNT", "User Token blank", error)
//                    return
//                }
//
//                guard let token = userToken else {
//                    print("User token is nil")
//                  reject("E_COUNT", "User Token blank", error)
//                    return
//                }
//
//                    UserDefaults.standard.set(token, forKey: "MUSIC_USER_TOKEN")
//                    UserDefaults.standard.set(developerToken, forKey: "DEVELOPER_TOKEN")
//                    self.appleMusicUserToken = token
//                    print("Music User Token:", token)
//                    resolve(token)
//            }
        
        
        cloudServiceController.requestUserToken(forDeveloperToken: developerToken!, completionHandler: { token, error in
          print("Music User Token:", token)

          guard let token = token else {
            print(error?.localizedDescription)
            reject("E_COUNT", "User Token blank", error)
            return }
          UserDefaults.standard.set(token, forKey: "MUSIC_USER_TOKEN")
          UserDefaults.standard.set(developerToken, forKey: "DEVELOPER_TOKEN")
          self.appleMusicUserToken = token
          print("Music User Token:", token)
          resolve(token)
          
        })
      } else {
        // Fallback on earlier versions
      }
    }
  
      
  }
  
  
//  @objc
//  func decrement(
//    _ resolve: RCTPromiseResolveBlock,
//    rejecter reject: RCTPromiseRejectBlock
//  ) -> Void {
//
//  }
  
  
  
  
  
  
  
  override func viewDidLoad() {
      super.viewDidLoad()

  }
  @objc func handleAuthorizationManagerDidUpdateNotification() {
      DispatchQueue.main.async {
          if SKCloudServiceController.authorizationStatus() == .notDetermined || MPMediaLibrary.authorizationStatus() == .notDetermined {
              print("not")
              //  self.navigationItem.rightBarButtonItem?.isEnabled = true
          } else {
              // self.navigationItem.rightBarButtonItem?.isEnabled = false
              print("determined")
              
            if #available(iOS 10.1, *) {
              if self.authorizationManager!.cloudServiceCapabilities.contains(.musicCatalogSubscriptionEligible) &&
                  !self.authorizationManager!.cloudServiceCapabilities.contains(.musicCatalogPlayback)
              {
                print("xxxxx")
                self.presentCloudServiceSetup()
              }
            } else {
              // Fallback on earlier versions
            }
            /*  if !self.authorizationManager!.cloudServiceCapabilities.contains(.musicCatalogSubscriptionEligible)
              {
                  print("xxxxx")
                  self.presentCloudServiceSetup()
              }*/
          }
          
          DispatchQueue.main.async {
              // self.tableView.reloadData()
              print("yyyyy")
            self.appleMusicUserToken = self.musicToken()
              
          }
      }
  }
  
  func presentCloudServiceSetup() {
      
      guard didPresentCloudServiceSetup == false else {
          return
      }
      
      /*
       If the current `SKCloudServiceCapability` includes `.musicCatalogSubscriptionEligible`, this means that the currently signed in iTunes Store
       account is elgible for an Apple Music Trial Subscription.  To provide the user with an option to sign up for a free trial, your application
       can present the `SKCloudServiceSetupViewController` as demonstrated below.
       */
      
    if #available(iOS 10.1, *) {
      let cloudServiceSetupViewController = SKCloudServiceSetupViewController()
    } else {
      // Fallback on earlier versions
    }
//      cloudServiceSetupViewController.delegate = self
//      
//      cloudServiceSetupViewController.load(options: [.action: SKCloudServiceSetupAction.subscribe]) { [weak self] (result, error) in
//          guard error == nil else {
//              fatalError("An Error occurred: \(error!.localizedDescription)")
//          }
//          
//          if result {
//              self?.present(cloudServiceSetupViewController, animated: true, completion: nil)
//              self?.didPresentCloudServiceSetup = true
//          }
//      }
  }
  
  func musicToken() -> String
  {
      if let _ = SharedClass.shared.developerToken{
          let developerToken = SharedClass.shared.developerToken
          let cloudServiceController = SKCloudServiceController()
          SKCloudServiceController.requestAuthorization { status in
              print(status)
              guard status == .authorized else {
                  print(status)
                  return
              }
              print(status)
          }
          
          cloudServiceController.requestCapabilities { capabilities, error in
              guard capabilities.contains(.musicCatalogPlayback) else {
                  print(error?.localizedDescription)
                  self.authorizationManager!.requestCloudServiceAuthorization()
                  
                  self.authorizationManager!.requestMediaLibraryAuthorization()
                  return
                  
              }
              print(capabilities)
          }
          
        if #available(iOS 11.0, *) {
          cloudServiceController.requestUserToken(forDeveloperToken: developerToken!, completionHandler: { token, error in
            
            guard let token = token else {
              print(error?.localizedDescription)
              return }
            UserDefaults.standard.set(token, forKey: "MUSIC_USER_TOKEN")
            UserDefaults.standard.set(developerToken, forKey: "DEVELOPER_TOKEN")
            self.appleMusicUserToken = token
            print("Music User Token:", token)
            
            
          })
        } else {
          // Fallback on earlier versions
        }
      }
    return self.appleMusicUserToken
  }
  
}

extension Print: SKCloudServiceSetupViewControllerDelegate {
  @available(iOS 10.1, *)
  func cloudServiceSetupViewControllerDidDismiss(_ cloudServiceSetupViewController: SKCloudServiceSetupViewController) {
        //        DispatchQueue.main.async {
        //            self.tableView.reloadData()
        //        }
    }
}

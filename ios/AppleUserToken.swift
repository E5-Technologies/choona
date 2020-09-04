//
//  AppleUserToken.swift
//  Choona
//
//  Created by webskitters on 02/09/20.
//

import Foundation
import UIKit
import StoreKit

@objc(Print)
class Print: NSObject {
  @objc
  func printValue(_ abc : String, callback: RCTResponseSenderBlock) {
    callback([abc])
 }
}

// Copyright 2018-present 650 Industries. All rights reserved.

import ExpoModulesCore

public class ExpoDevLauncherReactDelegateHandler: ExpoReactDelegateHandler, RCTBridgeDelegate, EXDevLauncherControllerDelegate {
  private weak var reactDelegate: ExpoReactDelegate?
  private var bridgeDelegate: RCTBridgeDelegate?
  private var launchOptions: [AnyHashable : Any]?
  private var deferredRootView: EXDevLauncherDeferredRCTRootView?
  private var rootViewModuleName: String?
  private var rootViewInitialProperties: [AnyHashable : Any]?
  public static var shouldEnableAutoSetup: Bool = {
    if !EXAppDefines.APP_DEBUG {
      return false
    }

    // Backward compatible if main AppDelegate already has expo-dev-launcher setup,
    // we just skip in this case.
    if EXDevLauncherController.sharedInstance().isStarted {
      return false
    }

    return true
  }()

  public override func createBridge(reactDelegate: ExpoReactDelegate, bridgeDelegate: RCTBridgeDelegate, launchOptions: [AnyHashable : Any]?) -> RCTBridge? {
    if !ExpoDevLauncherReactDelegateHandler.shouldEnableAutoSetup {
      return nil
    }

    self.reactDelegate = reactDelegate
    self.bridgeDelegate = EXRCTBridgeDelegateInterceptor(bridgeDelegate: bridgeDelegate, interceptor: self)
    self.launchOptions = launchOptions

    EXDevLauncherController.sharedInstance().autoSetupPrepare(self, launchOptions: launchOptions)
    return EXDevLauncherDeferredRCTBridge(delegate: self.bridgeDelegate!, launchOptions: self.launchOptions)
  }

  public override func createRootView(reactDelegate: ExpoReactDelegate, bridge: RCTBridge, moduleName: String, initialProperties: [AnyHashable : Any]?) -> RCTRootView? {
    if !ExpoDevLauncherReactDelegateHandler.shouldEnableAutoSetup {
      return nil
    }

    self.rootViewModuleName = moduleName
    self.rootViewInitialProperties = initialProperties
    self.deferredRootView = EXDevLauncherDeferredRCTRootView(bridge: bridge, moduleName: moduleName, initialProperties: initialProperties)
    return self.deferredRootView
  }

  // MARK: RCTBridgeDelegate implementations

  public func sourceURL(for bridge: RCTBridge!) -> URL! {
    return EXDevLauncherController.sharedInstance().sourceUrl()
  }

  // MARK: EXDevelopmentClientControllerDelegate implementations

  public func devLauncherController(_ developmentClientController: EXDevLauncherController, didStartWithSuccess success: Bool) {
    let bridge = RCTBridge(delegate: self.bridgeDelegate, launchOptions: self.launchOptions)
    developmentClientController.appBridge = bridge

    let rootView = RCTRootView(bridge: bridge!, moduleName: self.rootViewModuleName!, initialProperties: self.rootViewInitialProperties)
    rootView.backgroundColor = self.deferredRootView?.backgroundColor ?? UIColor.white
    let window = getWindow()
    window.rootViewController = self.reactDelegate?.createRootViewController()
    window.rootViewController!.view = rootView
    window.makeKeyAndVisible()

    // it is purposeful that we don't clean up saved properties here, because we may initialize
    // several React instances over a single app lifetime and we want them all to have the same
    // initial properties
  }

  // MARK: Internals

  private func getWindow() -> UIWindow {
    var window = UIApplication.shared.windows.filter {$0.isKeyWindow}.first
    if (window == nil) {
      window = UIApplication.shared.delegate?.window ?? nil
    }
    if (window == nil) {
      fatalError("Cannot find the current window.")
    }
    return window!
  }
}

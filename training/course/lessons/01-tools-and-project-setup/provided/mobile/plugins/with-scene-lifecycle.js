/**
 * Expo config plugin: adopts the UIScene life cycle on iOS.
 *
 * Apps built with the iOS 27 SDK crash at launch on iOS 27 devices unless they use scenes
 * ("UIScene life cycle is required for apps built with this SDK"). Older simulators only warn.
 * Expo ships `ExpoAppSceneDelegate` (Obj-C name `EXExpoAppSceneDelegate`), which creates the window
 * and starts React Native, so the AppDelegate must stop doing that and expose its factory instead.
 */
const { withAppDelegate, withInfoPlist } = require('expo/config-plugins');

function withSceneLifecycle(config) {
  config = withInfoPlist(config, (mod) => {
    mod.modResults.UIApplicationSceneManifest = {
      UIApplicationSupportsMultipleScenes: false,
      UISceneConfigurations: {
        UIWindowSceneSessionRoleApplication: [
          { UISceneConfigurationName: 'Default Configuration', UISceneDelegateClassName: 'EXExpoAppSceneDelegate' },
        ],
      },
    };
    return mod;
  });

  config = withAppDelegate(config, (mod) => {
    let contents = mod.modResults.contents;
    if (contents.includes('ExpoReactNativeFactoryProvider')) return mod;

    contents = contents
      .replace('class AppDelegate: ExpoAppDelegate {', 'class AppDelegate: ExpoAppDelegate, ExpoReactNativeFactoryProvider {')
      .replace(/\n#if os\(iOS\) \|\| os\(tvOS\)\n\s*window = UIWindow\(frame: UIScreen\.main\.bounds\)[\s\S]*?#endif\n/, '');

    if (!contents.includes('ExpoReactNativeFactoryProvider') || contents.includes('startReactNative')) {
      throw new Error('with-scene-lifecycle: AppDelegate.swift template changed; update the plugin.');
    }
    mod.modResults.contents = contents;
    return mod;
  });

  return config;
}

module.exports = withSceneLifecycle;

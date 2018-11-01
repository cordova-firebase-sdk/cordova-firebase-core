# cordova-firebase-core [![](https://travis-ci.org/cordova-firebase-sdk/cordova-firebase-core.svg?branch=master)](https://travis-ci.org/cordova-firebase-sdk/cordova-firebase-core)


**THIS PLUGIN IS NOT READY TO SHIP. DO NOT USE THIS PLUGIN IN YOUR APP YET.**


## Description

  This plugin provides wrapper API of `firebase.app` namespace.

## Goal of `cordova-firebase-xxx` project

  The goal of `cordova-firebase-xxx` is to provide the way to use [Firebase SDKs](https://firebase.google.com/docs/) to Cordova applications.

  Google provides many SDKs for each platforms, `Firebase JS library` for Web platforms, `Firebase SDK for Android` for Android platforms.
  Those SDKs are optimized for their target SDKs, and these provides same features with different method names.

  The `cordova-firebase-xxx` plugins wrap those SDKs, then provide one JS API, which is almost the same as `Firebase JS library`.

  For example, this is a snippet code that create an instance of `Firebase Realtime database`.

  ```js
  var config = {
    apiKey: "(YOUR API KEY)",
    databaseURL: "https://(PROJECT ID).firebaseio.com"
  };
  var app = firebase.initializeApp(config);
  var database = app.database();
  ```

  Using this plugin `cordova-firebase-core` and [cordova-firebase-database](https://github.com/cordova-firebase-sdk/cordova-firebase-database),
  you can write the above code.

  ```js
  var config = {
    apiKey: "(YOUR API KEY)",
    databaseURL: "https://(PROJECT ID).firebaseio.com"
  };
  var app = plugin.firebase.initializeApp(config);
  var database = app.database();
  ```

  That's it.

  If you run your app on **Android**, this plugin uses `Firebase SDK for Android`.

  If you run your app on **iOS**, this plugin uses `Firebase SDK for iOS`.

  If you run your app on **browser**, this plugin uses `Firebase JS library`.




## Supported platforms

  This plugin supports the following platforms:

  - Browser
  - iOS
  - Android

## Installation

  - **Step1** Install this plugin

    ```bash
    $> cordova plugin add https://github.com/cordova-firebase-sdk/cordova-firebase-core --save
    ```

  - **Step2** Download `google-services.json`, then put it at `(your_project_dir)/google-services.json`
    Hint: [Get a config file for your Android App](https://support.google.com/firebase/answer/7015592#android)

    Then add the below three lines into `(your_project_dir)/config.xml` file.

    ```xml
    <platform name="android">
        <resource-file src="google-services.json" target="app/google-services.json" />
    </platform>
    ```

  - **Step3** Download `GoogleService-Info.plist`, then put it at `(your_project_dir)/GoogleService-Info.plist`
    Hint: [Get a config file for your iOS App](https://support.google.com/firebase/answer/7015592#ios)

    Then add the below three lines into `(your_project_dir)/config.xml` file.

    ```xml
    <platform name="ios">
        <resource-file src="GoogleService-Info.plist" />
    </platform>
    ```

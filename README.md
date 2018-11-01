![](https://travis-ci.org/cordova-firebase-sdk/cordova-firebase-core.svg?branch=master)

# cordova-firebase-core


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

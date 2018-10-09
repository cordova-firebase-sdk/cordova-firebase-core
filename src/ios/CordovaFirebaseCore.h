
#import <Cordova/CDV.h>
@import Firebase;
#import "FirebaseAppPlugin.h"

#ifndef CordovaFirebaseApp_h
#define CordovaFirebaseApp_h

@interface CordovaFirebaseApp : CDVPlugin

- (void)newInstance:(CDVInvokedUrlCommand*)command;
@end

#endif

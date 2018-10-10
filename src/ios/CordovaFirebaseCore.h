
#import <Cordova/CDV.h>
@import Firebase;
#import "FirebaseAppPlugin.h"

#ifndef CordovaFirebaseCore_h
#define CordovaFirebaseCore_h

@interface CordovaFirebaseCore : CDVPlugin
@property (strong, atomic) NSMutableDictionary *apps;

- (void)newInstance:(CDVInvokedUrlCommand*)command;
@end

#endif


#import <Cordova/CDV.h>
@import Firebase;
#import <NSString+LZCompression.h>

#ifndef FirebaseAppPlugin_h
#define FirebaseAppPlugin_h

@interface FirebaseAppPlugin : CDVPlugin

@property (strong, nonatomic) NSString *pluginId;
@property (strong, atomic) NSMutableDictionary *objects;
@property (strong, atomic) FIRApp *app;

- (void)initWithOptions:(NSDictionary*)options;

- (void)delete:(CDVInvokedUrlCommand*)command;
@end

#endif

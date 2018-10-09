
#import <Cordova/CDV.h>
@import Firebase;
#import <NSString+LZCompression.h>

#ifndef FirebaseDatabasePlugin_h
#define FirebaseDatabasePlugin_h

@interface FirebaseAppPlugin : CDVPlugin

@property (strong, nonatomic) NSString *pluginId;
@property (strong, atomic) NSMutableDictionary *objects;

- (void)pluginInitializeWithFIRDatabase:(FIRDatabase*)databaseRef andPluginId:(NSString *)pluginId;

- (void)delete:(CDVInvokedUrlCommand*)command;
@end

#endif

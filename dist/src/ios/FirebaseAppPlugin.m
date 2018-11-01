#import "FirebaseAppPlugin.h"

@implementation FirebaseAppPlugin

- (void)pluginInitialize
{
  [super pluginInitialize];
  
  self.objects = [NSMutableDictionary dictionary];
}

- (void)initWithOptions:(NSDictionary*)options
{
  self.pluginId = [options objectForKey:@"id"];

//  NSString *name = [params objectForKey:@"name"];
//  NSDictionary *configureOpts =  [options objectForKey:@"options"];
//  FIROptions *fireOptions = [[FIROptions alloc] init];
//  // TODO: Create fireOptions dinamically
//  [FIRApp configureWithOptions:fireOptions];
  @try{
    [FIRApp configure];
  } @catch (NSException *error) {
    NSLog(@"--->ignore error : %@", error);
  }
  
  self.app = FIRApp.defaultApp;
}


//---------------------------------------------------------------------------------
// App.delete
// https://firebase.google.com/docs/reference/js/firebase.app.App#delete
//---------------------------------------------------------------------------------
- (void)delete:(CDVInvokedUrlCommand*)command
{
  NSLog(@"---->[ios] app.delete()");

  [self.app deleteApp:^(BOOL success) {
    CDVPluginResult* pluginResult;
    if (success) {
      self.app = nil;
      pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
    } else {
      pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Could not delete this app"];
    }
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
  }];
}
@end

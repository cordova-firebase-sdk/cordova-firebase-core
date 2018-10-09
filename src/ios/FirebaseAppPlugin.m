#import "FirebaseDatabasePlugin.h"

@implementation FirebaseDatabasePlugin

- (void)pluginInitialize
{
  [super pluginInitialize];
}

- (void)pluginInitializeWithFIRDatabase:(FIRDatabase*)databaseRef  andPluginId:(NSString *)pluginId
{
  self.database = databaseRef;
  self.semaphore = dispatch_semaphore_create(0);
  self.objects = [NSMutableDictionary dictionary];
  self.jsCallbackHolder = [NSMutableDictionary dictionary];
  self.pluginId = pluginId;

}


//---------------------------------------------------------------------------------
// App.delete
// https://firebase.google.com/docs/reference/js/firebase.app.App#delete
//---------------------------------------------------------------------------------
- (void)delete:(CDVInvokedUrlCommand*)command
{
  NSDictionary *options = [command.arguments objectAtIndex:0];
  NSLog(@"---->[ios] app.delete() %@", options);

  NSString *appId = [options objectForKey:@"appId"];
  FIRApp *app = [self.objects objectForKey:appId];


  CDVPluginResult* pluginResult;
  pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
  [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}
@end

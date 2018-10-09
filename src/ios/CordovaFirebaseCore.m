#import "CordovaFirebaseApp.h"

@implementation CordovaFirebaseApp
- (void)pluginInitialize
{

}
- (void)newInstance:(CDVInvokedUrlCommand*)command
{

  NSDictionary *params = [command.arguments objectAtIndex:0];
  NSString *instanceId = [options objectForKey:@"id"];
  NSString *name = [options objectForKey:@"name"];
  NSString *configureOptions = [options objectForKey:@"options"];


  FirebaseAppPlugin *appPlugin = [[FirebaseAppPlugin alloc] init];
  [appPlugin pluginInitialize];

  // Hack:
  // In order to load the plugin instance of the same class but different names,
  // register the plugin instance into the pluginObjects directly.
  CDVViewController *cdvViewController = (CDVViewController*)self.viewController;
  if ([appPlugin respondsToSelector:@selector(setViewController:)]) {
    [appPlugin setViewController:cdvViewController];
  }
  if ([appPlugin respondsToSelector:@selector(setCommandDelegate:)]) {
    [appPlugin setCommandDelegate:cdvViewController.commandDelegate];
  }
  [cdvViewController.pluginObjects setObject:databasePlugin forKey:instanceId];
  [cdvViewController.pluginsMap setValue:instanceId forKey:instanceId];
  [appPlugin pluginInitializeWithFIRApp: appPlugin andPluginId: instanceId];


  CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
  [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}


@end

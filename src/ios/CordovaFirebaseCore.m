#import "CordovaFirebaseCore.h"

@implementation CordovaFirebaseCore
- (void)pluginInitialize
{
  self.apps = [NSMutableDictionary dictionary];
  
}
- (void)newInstance:(CDVInvokedUrlCommand*)command
{

  NSDictionary *params = [command.arguments objectAtIndex:0];
  NSString *instanceId = [params objectForKey:@"id"];


  FirebaseAppPlugin *appPlugin = [[FirebaseAppPlugin alloc] init];

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
  [cdvViewController.pluginObjects setObject:appPlugin forKey:instanceId];
  [cdvViewController.pluginsMap setValue:instanceId forKey:instanceId];
  [appPlugin initWithOptions: params];
  
  // Keep the appPlugin instance
  [self.apps setObject:appPlugin forKey:instanceId];


  CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
  [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}


@end

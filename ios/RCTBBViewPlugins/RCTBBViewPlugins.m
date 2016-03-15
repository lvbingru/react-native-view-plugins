//
//  RCTBBViewPlugins.m
//  RCTBBViewPlugins
//
//  Created by LvBingru on 3/15/16.
//  Copyright © 2016 erica. All rights reserved.
//

#import "RCTBBViewPlugins.h"
#import "RCTShadowView.h"
#import "RCTUIManager.h"

@implementation RCTBBViewPlugins

RCT_EXPORT_MODULE();

@synthesize bridge = _bridge;

RCT_EXPORT_METHOD(isSubview:(nonnull NSNumber *)reactTag
                  relativeTo:(nonnull NSNumber *)ancestorReactTag
                  callback:(RCTResponseSenderBlock)callback)
{
    dispatch_async(dispatch_get_main_queue(), ^{
        UIView *view = [_bridge.uiManager viewForReactTag:reactTag];
        UIView *ancestorView = [_bridge.uiManager viewForReactTag:ancestorReactTag];
        
        while (view) {
            view = view.superview;
            if (view == ancestorView) {
                if (callback) {
                    callback(@[@(YES)]);
                }
                return;
            }
        }
        
        if (callback) {
            callback(@[@(NO)]);
        }
    });
}

@end

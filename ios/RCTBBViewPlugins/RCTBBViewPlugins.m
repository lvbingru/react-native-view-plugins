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
#import "RCTImageLoader.h"
#import "RCTConvert.h"
#import "RCTImageStoreManager.h"

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

RCT_EXPORT_METHOD(isTextInput:(nonnull NSNumber *)reactTag
                  callback:(RCTResponseSenderBlock)callback)
{
    dispatch_async(dispatch_get_main_queue(), ^{
        UIView *view = [_bridge.uiManager viewForReactTag:reactTag];
        if ([view isKindOfClass:[UITextField class]] || [view isKindOfClass:[UITextView class]]) {
            if (callback) {
                callback(@[@(YES)]);
            }
        }
        else {
            if (callback) {
                callback(@[@(NO)]);
            }
        }
    });
}

//RCT_EXPORT_METHOD(resizeImage:(NSString *)imageTag
//                  options:(NSDictionary *)options
//                  callback:(RCTResponseSenderBlock)callback)
//{
//    CGFloat width = [RCTConvert float:options[@"width"]];
//    CGFloat height = [RCTConvert float:options[@"height"]];
//    CGSize size= CGSizeMake(width, height);
//    [_bridge.imageLoader loadImageWithTag:imageTag size:size scale:0.0f resizeMode:RCTResizeModeContain progressBlock:^(int64_t progress, int64_t total) {
//        
//    } completionBlock:^(NSError *error, UIImage *image) {
//        if (error) {
//            callback(@[error]);
//        }
//        else {
//            [_bridge.imageStoreManager storeImage:image withBlock:^(NSString *tempImageTag) {
//                callback(@[tempImageTag]);
//            }];
//        }
//    }];
//}

@end

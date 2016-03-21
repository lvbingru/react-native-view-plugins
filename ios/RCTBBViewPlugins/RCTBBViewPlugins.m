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

RCT_EXPORT_METHOD(resizeImage:(NSString *)imageTag
                  options:(NSDictionary *)options
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    [_bridge.imageLoader loadImageWithTag:imageTag callback:^(NSError *error, UIImage *image) {
        
        if (error) {
            reject([NSString stringWithFormat:@"%d",error.code], error.description, error);
        }
        else {
            CGFloat width = [RCTConvert float:options[@"width"]];
            CGFloat height = [RCTConvert float:options[@"height"]];
            CGFloat scale = 1.0;
            if (image.size.width>0 && image.size.height>0) {
                scale = MAX(width/(image.size.width *image.scale), height/(image.size.height * image.scale));
            }
            image = [self scaledImage:image scale:scale];
            
            NSData *data;
            BOOL png = [RCTConvert BOOL:options[@"png"]];
            if (png) {
                data = UIImagePNGRepresentation(image);
            }
            else {
                CGFloat compress = [RCTConvert float:options[@"compress"]];
                if (compress == 0) {
                    compress = 1.0f;
                }
                data = UIImageJPEGRepresentation(image, compress);
            }
            NSError *error;

            NSString *tmpDirectory = NSTemporaryDirectory();
            NSString *filePath = [tmpDirectory stringByAppendingPathComponent:[NSDate date].description];
            
            [[NSFileManager defaultManager] createFileAtPath:filePath contents:data attributes:nil];

            if (error) {
                reject([NSString stringWithFormat:@"%d",error.code], error.description, error);
            }
            else {
                resolve([NSURL fileURLWithPath:filePath].absoluteString);
            }
        }
    }];
}

- (UIImage *)scaledImage:(UIImage *)image scale:(CGFloat)scale
{
    if (scale >= 1.0) {
        return image;
    }
    if (scale==0) {
        scale = 1.0/[UIScreen mainScreen].scale;
    }
    CGFloat width = image.size.width * scale;
    CGFloat height = image.size.height * scale;
    
    UIGraphicsBeginImageContext(CGSizeMake(width, height));
    [image drawInRect:CGRectMake(0, 0, width, height)];
    UIImage *scaledImage = UIGraphicsGetImageFromCurrentImageContext();
    UIGraphicsEndImageContext();
    return scaledImage;
}

@end

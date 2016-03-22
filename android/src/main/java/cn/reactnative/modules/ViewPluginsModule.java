package cn.reactnative.modules;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageManager;
import android.database.Cursor;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Canvas;
import android.graphics.PixelFormat;
import android.graphics.drawable.BitmapDrawable;
import android.graphics.drawable.Drawable;
import android.graphics.drawable.NinePatchDrawable;
import android.net.Uri;
import android.os.AsyncTask;
import android.os.Environment;
import android.provider.MediaStore;
import android.support.annotation.Nullable;
import android.telecom.Call;
import android.util.Log;

import com.facebook.common.executors.UiThreadImmediateExecutorService;
import com.facebook.common.internal.Preconditions;
import com.facebook.common.references.CloseableReference;
import com.facebook.common.util.UriUtil;
import com.facebook.datasource.BaseDataSubscriber;
import com.facebook.datasource.DataSource;
import com.facebook.datasource.DataSubscriber;
import com.facebook.drawee.backends.pipeline.Fresco;
import com.facebook.drawee.drawable.OrientedDrawable;
import com.facebook.imagepipeline.common.ResizeOptions;
import com.facebook.imagepipeline.core.ImagePipeline;
import com.facebook.imagepipeline.image.CloseableAnimatedImage;
import com.facebook.imagepipeline.image.CloseableImage;
import com.facebook.imagepipeline.image.CloseableStaticBitmap;
import com.facebook.imagepipeline.image.EncodedImage;
import com.facebook.imagepipeline.request.ImageRequest;
import com.facebook.imagepipeline.request.ImageRequestBuilder;
import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.GuardedAsyncTask;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.lang.reflect.Field;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by lvbingru on 11/5/15.
 */
public class ViewPluginsModule extends ReactContextBaseJavaModule {

    public ViewPluginsModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "BBViewPlugins";
    }

    @ReactMethod
    public void resizeImage(String imageTag, ReadableMap options, Promise promise) {

        new ResizeImage(getReactApplicationContext(), imageTag, options, promise)
                .executeOnExecutor(AsyncTask.THREAD_POOL_EXECUTOR);
    }

    private static class ResizeImage extends GuardedAsyncTask<Void, Void> {
        private final Context mContext;
        private final String mImageTag;
        private final ReadableMap mOptions;
        private final Promise mPromise;

        protected ResizeImage(ReactContext reactContext, String imageTag, ReadableMap options, final Promise promise) {
            super(reactContext);
            mContext = reactContext;
            mImageTag = imageTag;
            mOptions = options;
            mPromise = promise;
        }

        @Override
        protected void doInBackgroundGuarded(Void... params) {
            String imageUrl = mImageTag;

            Uri uri = Uri.parse(imageUrl);
            if (imageUrl.startsWith("content")) {
                imageUrl = getFilePathFromUri(uri);
            }
            else if (imageUrl.startsWith("file")) {
                imageUrl = uri.getPath();
            }

            double width = 0.0;
            double height = 0.0;
            if (mOptions.hasKey("size")) {
                ReadableMap size =  mOptions.getMap("size");
                width = size.getDouble("width");
                height = size.getDouble("height");
            }


            Bitmap bitmap = scaleImage(imageUrl, width, height);
            saveImage(bitmap);
            bitmap.recycle();
        }

//        private static @Nullable
//        Uri _getResourceDrawableUri(Context context, @Nullable String name) {
//            if (name == null || name.isEmpty()) {
//                return null;
//            }
//            name = name.toLowerCase().replace("-", "_");
//            int resId = context.getResources().getIdentifier(
//                    name,
//                    "drawable",
//                    context.getPackageName());
//            return new Uri.Builder()
//                    .scheme(UriUtil.LOCAL_RESOURCE_SCHEME)
//                    .path(String.valueOf(resId))
//                    .build();
//        }

        private File getTempFile()
        {
            String timeStamp = new Date().toString();

            File file = null;
            try
            {
                file = new File(
                        mContext.getCacheDir(),
                        timeStamp);
            }
            catch (Exception e)
            {
            }
            return file;
        }

        private void saveImage(Bitmap bm) {
            File f = getTempFile();
            try {
                FileOutputStream out = new FileOutputStream(f);
                if (mOptions.hasKey("png") && mOptions.getBoolean("png")) {
                    bm.compress(Bitmap.CompressFormat.PNG, 100, out);
                }
                else {
                    if(mOptions.hasKey("compress")) {
                        bm.compress(Bitmap.CompressFormat.JPEG, (int)(mOptions.getDouble("compress")*100), out);
                    }
                    else {
                        bm.compress(Bitmap.CompressFormat.JPEG, 100, out);
                    }
                }
                out.flush();
                out.close();

                String path = f.getAbsolutePath();
                mPromise.resolve(path);
            } catch (Exception e) {
                mPromise.reject("-1",e.getMessage());
            }
        }

        private String getFilePathFromUri(Uri uri) {

            String ret = "";
            String[] projection = { MediaStore.Images.Media.DATA};
            Cursor cursor = mContext.getContentResolver().query(uri, projection, null, null, null);
            if(cursor!=null){
                if (cursor.moveToFirst()) {
                    int column_index = cursor.getColumnIndexOrThrow(MediaStore.Images.Media.DATA);
                    ret = cursor.getString(column_index);
                }
                cursor.close();
            }
            return ret;
        }

        private Bitmap scaleImage(String filepath, double width, double height) {

            BitmapFactory.Options op = new BitmapFactory.Options();
            op.inJustDecodeBounds = true;
            BitmapFactory.decodeFile(filepath, op);
            int w = op.outWidth;
            int h = op.outHeight;

            op.inJustDecodeBounds = false;
            if (width > 0 && height > 0 && w>0 && h>0) {
                double scale = Math.max(width/w, height/h);
                op.outWidth = (int)(width * scale);
                op.outHeight = (int)(height * scale);
            }
            else {
                op.outWidth = w;
                op.outHeight = h;
            }

            Bitmap bitmap = BitmapFactory.decodeFile(filepath, op);
            return bitmap;
        }
    }



}

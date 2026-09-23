package com.civ6.pocket;

import android.app.Activity;
import android.graphics.Color;
import android.net.Uri;
import android.os.Bundle;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

public class MainActivity extends Activity {
    private static final String ASSET_HOST = "appassets.androidplatform.net";
    private static final String START_URL = "https://" + ASSET_HOST + "/assets/index.html";
    private static final Map<String, String> MIME_TYPES;

    static {
        Map<String, String> types = new HashMap<>();
        types.put("index.html", "text/html");
        types.put("app.js", "application/javascript");
        types.put("style.css", "text/css");
        types.put("data.json", "application/json");
        MIME_TYPES = Collections.unmodifiableMap(types);
    }

    private WebView webView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        webView = new WebView(this);
        webView.setBackgroundColor(Color.rgb(11, 32, 43));
        webView.setVerticalScrollBarEnabled(false);
        webView.setHorizontalScrollBarEnabled(false);
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setAllowFileAccess(false);
        settings.setAllowContentAccess(false);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        webView.setWebViewClient(new PocketWebViewClient());
        setContentView(webView);
        if (savedInstanceState == null) {
            webView.loadUrl(START_URL);
        } else {
            webView.restoreState(savedInstanceState);
        }
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        webView.saveState(outState);
        super.onSaveInstanceState(outState);
    }

    @Override
    public void onBackPressed() {
        webView.evaluateJavascript("document.getElementById('detail').classList.contains('open')", result -> {
            if ("true".equals(result)) {
                webView.evaluateJavascript("closeDetail()", null);
            } else if (webView.canGoBack()) {
                webView.goBack();
            } else {
                MainActivity.super.onBackPressed();
            }
        });
    }

    @Override
    protected void onDestroy() {
        webView.destroy();
        super.onDestroy();
    }

    private class PocketWebViewClient extends WebViewClient {
        @Override
        public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
            Uri uri = request.getUrl();
            if (!"https".equals(uri.getScheme()) || !ASSET_HOST.equals(uri.getHost())) {
                return null;
            }
            String path = uri.getPath();
            if (path == null || !path.startsWith("/assets/")) {
                return notFound();
            }
            String fileName = path.substring("/assets/".length());
            String mimeType = MIME_TYPES.get(fileName);
            if (mimeType == null && fileName.matches("images/[a-z0-9_]+\\.png")) {
                mimeType = "image/png";
            }
            if (mimeType == null) {
                return notFound();
            }
            try {
                InputStream data = getAssets().open(fileName);
                return new WebResourceResponse(mimeType, "image/png".equals(mimeType) ? null : "UTF-8", data);
            } catch (IOException ignored) {
                return notFound();
            }
        }

        @Override
        public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
            return handleNavigation(request.getUrl());
        }

        @Override
        public boolean shouldOverrideUrlLoading(WebView view, String url) {
            return handleNavigation(Uri.parse(url));
        }

        private boolean handleNavigation(Uri uri) {
            return !("https".equals(uri.getScheme()) && ASSET_HOST.equals(uri.getHost()));
        }

        private WebResourceResponse notFound() {
            return new WebResourceResponse("text/plain", "UTF-8", 404, "Not Found",
                    Collections.emptyMap(), new ByteArrayInputStream(new byte[0]));
        }
    }
}

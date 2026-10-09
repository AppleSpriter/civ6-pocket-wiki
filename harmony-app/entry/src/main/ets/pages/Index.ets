import { webview } from '@kit.ArkWeb';

const LOCAL_ORIGIN: string = 'https://civ6-pocket.invalid/';

@Entry
@Component
struct Index {
  private controller: webview.WebviewController = new webview.WebviewController();

  private localResource(url: string): WebResourceResponse {
    const path: string = url.startsWith(LOCAL_ORIGIN) ? url.substring(LOCAL_ORIGIN.length).split(/[?#]/)[0] : '';
    const textType: string = path === 'index.html' ? 'text/html' :
      path === 'app.js' ? 'application/javascript' :
      path === 'style.css' ? 'text/css' :
      path === 'data.json' ? 'application/json' : '';
    const isImage: boolean = /^images\/[a-z0-9_]+\.png$/.test(path);
    const response = new WebResourceResponse();

    if (!textType && !isImage) {
      response.setResponseData('Not Found');
      response.setResponseMimeType('text/plain');
      response.setResponseEncoding('utf-8');
      response.setResponseCode(404);
      response.setReasonMessage('Not Found');
      response.setResponseIsReady(true);
      return response;
    }

    response.setResponseData($rawfile(`web/${path}`));
    response.setResponseMimeType(isImage ? 'image/png' : textType);
    if (!isImage) {
      response.setResponseEncoding('utf-8');
    }
    response.setResponseCode(200);
    response.setReasonMessage('OK');
    response.setResponseIsReady(true);
    return response;
  }

  build() {
    Column() {
      Web({ src: `${LOCAL_ORIGIN}index.html`, controller: this.controller })
        .javaScriptAccess(true)
        .domStorageAccess(true)
        .fileAccess(false)
        .imageAccess(true)
        .onlineImageAccess(true)
        .onInterceptRequest((event) => this.localResource(event.request.getRequestUrl()))
        .onOverrideUrlLoading((request) => !request.getRequestUrl().startsWith(LOCAL_ORIGIN))
        .width('100%')
        .height('100%')
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#0B202B')
  }
}

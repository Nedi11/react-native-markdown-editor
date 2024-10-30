// src/HtmlToMarkdownConverter.tsx
import React, { useEffect, useRef, useState } from 'react';
import { WebView } from 'react-native-webview';

interface HtmlToMarkdownConverterProps {
  htmlContent: string;
  onConversionComplete: (markdown: string) => void;
}

const HtmlToMarkdownConverter = ({
  htmlContent,
  onConversionComplete,
}: HtmlToMarkdownConverterProps) => {
  const webViewRef = useRef<WebView>(null);
  const [webviewLoaded, setWebviewLoaded] = useState(false);

  // HTML content for the WebView to perform HTML to Markdown conversion
  const converterHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>HTML to Markdown Converter</title>
      <script src="https://unpkg.com/turndown/dist/turndown.js"></script>
    </head>
    <body>
      <script>
        (function() {
          function convertHtmlToMarkdown(html) {
            var turndownService = new TurndownService();
            return turndownService.turndown(html);
          }

          window.addEventListener('message', function(event) {
            var htmlContent = event.data;
            var markdown = convertHtmlToMarkdown(htmlContent);
            window.ReactNativeWebView.postMessage(markdown);
          });
        })();
      </script>
    </body>
    </html>
  `;

  useEffect(() => {
    if (webviewLoaded && webViewRef.current && htmlContent) {
      webViewRef.current.postMessage(htmlContent);
    }
  }, [htmlContent, webviewLoaded]);

  const handleMessage = (event: any) => {
    const markdown = event.nativeEvent.data;
    onConversionComplete(markdown);
  };

  return (
    <WebView
      ref={webViewRef}
      originWhitelist={['*']}
      source={{ html: converterHtml }}
      onMessage={handleMessage}
      javaScriptEnabled={true}
      onLoad={() => setWebviewLoaded(true)}
      style={{ height: 0, width: 0 }} // Hide the WebView
    />
  );
};

export default HtmlToMarkdownConverter;

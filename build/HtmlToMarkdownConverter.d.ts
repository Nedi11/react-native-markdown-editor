import React from 'react';
interface HtmlToMarkdownConverterProps {
    htmlContent: string;
    onConversionComplete: (markdown: string) => void;
}
declare const HtmlToMarkdownConverter: ({ htmlContent, onConversionComplete, }: HtmlToMarkdownConverterProps) => React.JSX.Element;
export default HtmlToMarkdownConverter;

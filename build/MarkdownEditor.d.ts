import React from 'react';
interface MarkdownEditorProps {
    initialContent?: string;
    onContentChange?: (content: string) => void;
    editorStyles?: any;
    markdownStyles?: any;
    readOnly?: boolean;
}
export declare const renderRules: {
    math_inline: (node: any, children: any, parent: any, styles: any) => React.JSX.Element;
    math_block: (node: any, children: any, parent: any, styles: any) => React.JSX.Element;
};
declare const MarkdownEditor: React.FC<MarkdownEditorProps>;
export default MarkdownEditor;

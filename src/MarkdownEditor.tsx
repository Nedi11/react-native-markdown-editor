// src/MarkdownEditor.tsx
import React, { useRef, useState, useEffect } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { RichEditor } from 'react-native-pell-rich-editor';
import MarkdownIt from 'markdown-it';
import markdownItMathjax from 'markdown-it-mathjax3';
import Markdown from 'react-native-markdown-display';
import HtmlToMarkdownConverter from './HtmlToMarkdownConverter';
import { renderLatexInline, renderLatexBlock } from './LatexRenderer';

interface MarkdownEditorProps {
  initialContent?: string;
  onContentChange?: (content: string) => void;
  editorStyles?: any;
  markdownStyles?: any;
  readOnly?: boolean;
}

// Initialize Markdown-It instances with and without MathJax support
const markdownIt = new MarkdownIt().use(markdownItMathjax);
const markdownItWithoutMathjax = new MarkdownIt();

// Render rules to handle inline and block math in Markdown
export const renderRules = {
  math_inline: (node: any, children: any, parent: any, styles: any) => {
    const content = node.content;
    return <Text key={node.key}>{renderLatexInline(content)}</Text>;
  },
  math_block: (node: any, children: any, parent: any, styles: any) => {
    const content = node.content;
    return (
      <View key={node.key} style={{ alignItems: 'center', marginVertical: 10 }}>
        {renderLatexBlock(content)}
      </View>
    );
  },
};

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  initialContent = '',
  onContentChange,
  editorStyles = {},
  markdownStyles = {},
  readOnly = false,
}) => {
  const [content, setContent] = useState(initialContent);
  const [htmlContent, setHtmlContent] = useState('');
  const [htmlContentToConvert, setHtmlContentToConvert] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const richEditorRef = useRef<RichEditor>(null);

  const handleEditorChange = (html: string) => {
    setHtmlContent(html);
  };

  const toggleEdit = () => {
    if (isEditing) {
      setHtmlContentToConvert(htmlContent);
    } else {
      setIsEditing(!readOnly);
    }
  };

  const handleConversionComplete = (markdown: string) => {
    const fixedMarkdown = markdown.replace(/(\${1,2})([^$]+?)\1/g, (match, delimiter, content) => {
      const fixedContent = content.replace(/\\\\/g, '\\');
      return `${delimiter}${fixedContent}${delimiter}`;
    });
    setContent(fixedMarkdown);
    setHtmlContentToConvert('');
    setIsEditing(false);
    if (onContentChange) {
      onContentChange(markdown);
    }
  };

  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);

  return (
    <View style={{ marginBottom: 20 }}>
      {/* Convert HTML to Markdown */}
      {htmlContentToConvert && (
        <HtmlToMarkdownConverter
          htmlContent={htmlContentToConvert}
          onConversionComplete={handleConversionComplete}
        />
      )}

      {/* Render Editor or Markdown View */}
      {isEditing ? (
        <RichEditor
          ref={richEditorRef}
          initialContentHTML={markdownItWithoutMathjax.render(content)}
          placeholder="Start typing..."
          onChange={handleEditorChange}
          editorStyle={{
            backgroundColor: '#f5f5f5',
            color: '#000',
            contentCSSText: 'font-size: 16px; color: #000;',
            ...editorStyles,
          }}
        />
      ) : (
        <Markdown
          markdownit={markdownIt}
          rules={renderRules}
          style={{
            body: {
              color: '#000',
              backgroundColor: '#f5f5f5',
              ...markdownStyles,
            },
          }}
        >
          {content}
        </Markdown>
      )}

      {/* Toggle Edit Button */}
      {!readOnly && (
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 10 }}>
          <TouchableOpacity onPress={toggleEdit}>
            <Text
              style={{
                color: 'blue',
                backgroundColor: 'white',
                paddingHorizontal: 8,
                paddingVertical: 2,
                borderRadius: 4,
                borderStyle: 'solid',
                borderWidth: 1,
                borderColor: 'black',
              }}
            >
              {isEditing ? 'Save' : 'Edit'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default MarkdownEditor;

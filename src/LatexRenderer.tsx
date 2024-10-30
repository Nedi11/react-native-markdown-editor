// src/LatexRenderer.tsx
import React from 'react';
import { Text, View } from 'react-native';
import MathView from 'react-native-math-view';

export const renderLatexInline = (latex: string) => (
  <Text>
    <MathView
      math={latex}
      style={{ fontSize: 16, lineHeight: 22 }} // Adjust as needed for inline alignment
    />
  </Text>
);

export const renderLatexBlock = (latex: string) => (
  <View style={{ alignItems: 'center', marginVertical: 10 }}>
    <MathView
      math={latex}
      style={{ fontSize: 20, lineHeight: 28 }} // Adjust for block LaTeX
    />
  </View>
);

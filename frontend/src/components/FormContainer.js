import React from 'react';
import { StyleSheet } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default function FormContainer({ children, style }) {
  return (
    <KeyboardAwareScrollView
      style={[styles.container, style]}
      contentContainerStyle={styles.conteudo}
      enableOnAndroid={true}
      enableAutomaticScroll={true}
      extraScrollHeight={120}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {children}
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  conteudo: { flexGrow: 1, paddingBottom: 60 },
});
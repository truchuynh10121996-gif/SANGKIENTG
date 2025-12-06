import React, { useState, useEffect } from 'react';
import { TouchableOpacity, StyleSheet, Alert, ActivityIndicator, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Voice from '@react-native-voice/voice';

export default function VoiceRecorder({ language, onTranscriptionComplete }) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [partialResults, setPartialResults] = useState('');

  // Map language code
  const getVoiceLanguage = (lang) => {
    const languageMap = {
      'vi': 'vi-VN',
      'en': 'en-US',
      'km': 'km-KH'
    };
    return languageMap[lang] || 'vi-VN';
  };

  useEffect(() => {
    // Đăng ký các event handlers
    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechPartialResults = onSpeechPartialResults;
    Voice.onSpeechError = onSpeechError;

    // Cleanup khi component unmount
    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const onSpeechStart = (e) => {
    console.log('Speech started');
    setIsRecording(true);
  };

  const onSpeechEnd = (e) => {
    console.log('Speech ended');
    setIsRecording(false);
  };

  const onSpeechResults = (e) => {
    console.log('Speech results:', e.value);
    setIsProcessing(false);
    if (e.value && e.value.length > 0) {
      // Lấy kết quả tốt nhất (đầu tiên)
      onTranscriptionComplete(e.value[0]);
    }
  };

  const onSpeechPartialResults = (e) => {
    if (e.value && e.value.length > 0) {
      setPartialResults(e.value[0]);
    }
  };

  const onSpeechError = (e) => {
    console.error('Speech error:', e.error);
    setIsRecording(false);
    setIsProcessing(false);

    // Hiển thị lỗi thân thiện
    let errorMessage = 'Không thể nhận diện giọng nói. Vui lòng thử lại.';

    if (e.error?.code === 'recognition_fail') {
      errorMessage = 'Không nghe rõ. Vui lòng nói to và rõ hơn.';
    } else if (e.error?.code === 'no_match') {
      errorMessage = 'Không nhận diện được. Vui lòng thử lại.';
    } else if (e.error?.code === 'network') {
      errorMessage = 'Lỗi kết nối mạng. Vui lòng kiểm tra internet.';
    } else if (e.error?.code === 'permission') {
      errorMessage = 'Vui lòng cấp quyền sử dụng microphone.';
    }

    Alert.alert('Thông báo', errorMessage);
  };

  const startRecording = async () => {
    try {
      setIsProcessing(true);
      setPartialResults('');

      await Voice.start(getVoiceLanguage(language));

    } catch (error) {
      console.error('Failed to start recording:', error);
      setIsProcessing(false);
      Alert.alert('Lỗi', 'Không thể bắt đầu ghi âm. Vui lòng thử lại.');
    }
  };

  const stopRecording = async () => {
    try {
      await Voice.stop();
      setIsRecording(false);
      // Kết quả sẽ được trả về qua onSpeechResults
    } catch (error) {
      console.error('Failed to stop recording:', error);
      setIsRecording(false);
      setIsProcessing(false);
    }
  };

  const handlePress = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        isRecording && styles.buttonRecording
      ]}
      onPress={handlePress}
      disabled={isProcessing && !isRecording}
    >
      {isProcessing && !isRecording ? (
        <ActivityIndicator size="small" color="#FF8DAD" />
      ) : (
        <Ionicons
          name={isRecording ? 'stop-circle' : 'mic'}
          size={24}
          color={isRecording ? '#D32F2F' : '#FF8DAD'}
        />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 5,
    marginLeft: 5
  },
  buttonRecording: {
    backgroundColor: 'rgba(211, 47, 47, 0.1)',
    borderRadius: 20,
    padding: 8
  }
});

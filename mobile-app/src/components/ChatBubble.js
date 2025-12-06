import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Speech from 'expo-speech';

export default function ChatBubble({ message, language }) {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const isBot = message.sender === 'bot';
  const isFraud = message.isFraudAlert;

  // Cleanup khi component unmount
  useEffect(() => {
    return () => {
      Speech.stop();
    };
  }, []);

  // Map language code sang voice language
  const getVoiceLanguage = (lang) => {
    const languageMap = {
      'vi': 'vi-VN',
      'en': 'en-US',
      'km': 'km-KH' // Khmer - có thể không được hỗ trợ trên mọi thiết bị
    };
    return languageMap[lang] || 'vi-VN';
  };

  const handlePlayAudio = async () => {
    try {
      // Nếu đang nói thì dừng lại
      const speaking = await Speech.isSpeakingAsync();
      if (speaking) {
        await Speech.stop();
        setIsSpeaking(false);
        return;
      }

      setIsSpeaking(true);

      // Sử dụng expo-speech để đọc text
      Speech.speak(message.text, {
        language: getVoiceLanguage(language),
        pitch: 1.0,
        rate: Platform.OS === 'ios' ? 0.5 : 0.9, // iOS nói nhanh hơn nên giảm rate
        onStart: () => {
          setIsSpeaking(true);
        },
        onDone: () => {
          setIsSpeaking(false);
        },
        onStopped: () => {
          setIsSpeaking(false);
        },
        onError: (error) => {
          console.error('Speech error:', error);
          setIsSpeaking(false);
        }
      });

    } catch (error) {
      console.error('Play audio error:', error);
      setIsSpeaking(false);
    }
  };

  const formatTime = (date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  return (
    <View style={[styles.container, isBot ? styles.botContainer : styles.userContainer]}>
      {isBot ? (
        <View style={styles.botBubbleWrapper}>
          {isFraud && (
            <View style={styles.alertBadge}>
              <Ionicons name="warning" size={16} color="#FFF" />
              <Text style={styles.alertBadgeText}>CẢNH BÁO</Text>
            </View>
          )}

          <View style={[styles.bubble, styles.botBubble, isFraud && styles.fraudBubble]}>
            <Text style={[styles.text, styles.botText]}>{message.text}</Text>

            <View style={styles.bubbleFooter}>
              <Text style={styles.time}>{formatTime(message.timestamp)}</Text>

              <TouchableOpacity
                style={styles.speakerButton}
                onPress={handlePlayAudio}
              >
                <Ionicons
                  name={isSpeaking ? 'stop-circle' : 'volume-high'}
                  size={20}
                  color={isSpeaking ? '#D32F2F' : '#FF8DAD'}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ) : (
        <LinearGradient
          colors={['#FF8DAD', '#FF6B99']}
          style={[styles.bubble, styles.userBubble]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Text style={[styles.text, styles.userText]}>{message.text}</Text>
          <Text style={[styles.time, styles.userTime]}>{formatTime(message.timestamp)}</Text>
        </LinearGradient>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
    maxWidth: '80%'
  },
  botContainer: {
    alignSelf: 'flex-start'
  },
  userContainer: {
    alignSelf: 'flex-end'
  },
  botBubbleWrapper: {
    position: 'relative'
  },
  alertBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D32F2F',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    marginBottom: 5,
    alignSelf: 'flex-start'
  },
  alertBadgeText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 5
  },
  bubble: {
    borderRadius: 20,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3
  },
  botBubble: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderBottomLeftRadius: 5
  },
  fraudBubble: {
    borderWidth: 2,
    borderColor: '#D32F2F'
  },
  userBubble: {
    borderBottomRightRadius: 5
  },
  text: {
    fontSize: 15,
    lineHeight: 22
  },
  botText: {
    color: '#333'
  },
  userText: {
    color: '#FFF'
  },
  bubbleFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 5
  },
  time: {
    fontSize: 11,
    color: '#999',
    marginTop: 5
  },
  userTime: {
    color: 'rgba(255, 255, 255, 0.7)'
  },
  speakerButton: {
    padding: 5
  }
});

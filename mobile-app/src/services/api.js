import axios from 'axios';

// Cấu hình API base URL
// Thay đổi địa chỉ này theo backend của bạn
const API_BASE_URL = 'http://localhost:5000/api';

// Tạo axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * Gửi tin nhắn đến chatbot
 */
export const sendMessage = async ({ message, conversationId, language }) => {
  try {
    const response = await api.post('/chatbot/message', {
      message,
      conversationId,
      language
    });

    return response.data.data;
  } catch (error) {
    console.error('API sendMessage error:', error);
    throw error;
  }
};

/**
 * Chuyển text thành giọng nói (TTS)
 */
export const synthesizeSpeech = async ({ text, language, gender = 'FEMALE' }) => {
  try {
    const response = await api.post('/tts/synthesize', {
      text,
      language,
      gender
    });

    return response.data.data;
  } catch (error) {
    console.error('API synthesizeSpeech error:', error);
    throw error;
  }
};

/**
 * Chuyển giọng nói thành text (STT)
 */
export const transcribeAudio = async (formData) => {
  try {
    const response = await api.post('/stt/transcribe', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    return response.data.data;
  } catch (error) {
    console.error('API transcribeAudio error:', error);
    throw error;
  }
};

/**
 * Lấy lịch sử hội thoại
 */
export const getConversation = async (conversationId) => {
  try {
    const response = await api.get(`/chatbot/conversation/${conversationId}`);
    return response.data.data;
  } catch (error) {
    console.error('API getConversation error:', error);
    throw error;
  }
};

/**
 * Health check
 */
export const checkHealth = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    console.error('API health check error:', error);
    throw error;
  }
};

export default api;

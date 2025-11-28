const geminiService = require('../services/gemini.service');
const qaService = require('../services/qa.service');
const conversationService = require('../services/conversation.service');

/**
 * Gửi tin nhắn đến chatbot và nhận phản hồi
 */
exports.sendMessage = async (req, res) => {
  try {
    const { message, conversationId, language } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        status: 'error',
        message: 'Message is required'
      });
    }

    // Phát hiện ngôn ngữ nếu không được cung cấp
    const detectedLanguage = language || await detectLanguageFromText(message);

    // Lấy context từ Q&A scenarios
    const qaContext = await qaService.getRelevantQA(message);

    // Tạo prompt với context
    const systemPrompt = generateSystemPrompt(detectedLanguage, qaContext);

    // Gọi Gemini API để có phản hồi
    const response = await geminiService.generateResponse(message, systemPrompt);

    // Lưu hội thoại
    const conversation = await conversationService.saveMessage({
      conversationId: conversationId || generateConversationId(),
      userMessage: message,
      botResponse: response,
      language: detectedLanguage,
      timestamp: new Date()
    });

    res.status(200).json({
      status: 'success',
      data: {
        conversationId: conversation.conversationId,
        response: response,
        language: detectedLanguage,
        isFraudAlert: checkFraudKeywords(response),
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Chatbot sendMessage error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to process message',
      error: error.message
    });
  }
};

/**
 * Lấy lịch sử hội thoại
 */
exports.getConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const conversation = await conversationService.getConversation(conversationId);

    if (!conversation) {
      return res.status(404).json({
        status: 'error',
        message: 'Conversation not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: conversation
    });

  } catch (error) {
    console.error('Get conversation error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get conversation',
      error: error.message
    });
  }
};

/**
 * Xóa hội thoại
 */
exports.deleteConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;
    await conversationService.deleteConversation(conversationId);

    res.status(200).json({
      status: 'success',
      message: 'Conversation deleted successfully'
    });

  } catch (error) {
    console.error('Delete conversation error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete conversation',
      error: error.message
    });
  }
};

/**
 * Phát hiện ngôn ngữ
 */
exports.detectLanguage = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({
        status: 'error',
        message: 'Text is required'
      });
    }

    const language = await detectLanguageFromText(text);

    res.status(200).json({
      status: 'success',
      data: { language }
    });

  } catch (error) {
    console.error('Detect language error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to detect language',
      error: error.message
    });
  }
};

// Helper Functions

function generateConversationId() {
  return `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

async function detectLanguageFromText(text) {
  // Phát hiện ngôn ngữ đơn giản dựa trên ký tự
  const vietnameseChars = /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i;
  const khmerChars = /[\u1780-\u17FF]/;

  if (khmerChars.test(text)) {
    return 'km'; // Khmer
  } else if (vietnameseChars.test(text)) {
    return 'vi'; // Vietnamese
  } else {
    return 'en'; // English (default)
  }
}

function generateSystemPrompt(language, qaContext) {
  const prompts = {
    vi: `Bạn là Agribank Digital Guard, trợ lý AI chuyên nghiệp về phòng chống lừa đảo của Ngân hàng Agribank Việt Nam.

NHIỆM VỤ:
- Phân tích các tình huống người dùng mô tả để xác định dấu hiệu lừa đảo
- Cảnh báo rõ ràng nếu phát hiện nguy cơ lừa đảo
- Đưa ra hướng dẫn cụ thể, an toàn để xử lý tình huống
- Luôn lịch sự, thân thiện và chuyên nghiệp

DỮ LIỆU THAM KHẢO:
${qaContext}

CÁCH TRẢ LỜI:
1. Nếu phát hiện lừa đảo: Bắt đầu với "⚠️ CẢNH BÁO LỪA ĐẢO"
2. Giải thích rõ ràng tại sao đây là lừa đảo
3. Hướng dẫn cách xử lý an toàn từng bước
4. Khuyên người dùng liên hệ hotline Agribank: 1900 5555 88

Hãy trả lời bằng tiếng Việt, ngắn gọn, dễ hiểu.`,

    en: `You are Agribank Digital Guard, a professional AI assistant specializing in fraud prevention for Agribank Vietnam.

MISSION:
- Analyze situations described by users to identify fraud indicators
- Provide clear warnings if fraud risks are detected
- Give specific, safe instructions for handling situations
- Always be polite, friendly, and professional

REFERENCE DATA:
${qaContext}

HOW TO RESPOND:
1. If fraud detected: Start with "⚠️ FRAUD ALERT"
2. Clearly explain why this is a fraud
3. Provide step-by-step safe handling instructions
4. Advise users to contact Agribank hotline: 1900 5555 88

Please respond in English, concisely and clearly.`,

    km: `អ្នកគឺជា Agribank Digital Guard ជំនួយការ AI វិជ្ជាជីវៈក្នុងការការពារការលួចបន្លំសម្រាប់ធនាគារ Agribank វៀតណាម។

បេសកកម្ម:
- វិភាគស្ថានភាពដែលអ្នកប្រើប្រាស់ពិពណ៌នាដើម្បីកំណត់សញ្ញាបញ្ហាការលួចបន្លំ
- ផ្តល់ការព្រមានច្បាស់លាស់ប្រសិនបើរកឃើញហានិភ័យការលួចបន្លំ
- ផ្តល់ការណែនាំជាក់លាក់និងសុវត្ថិភាពសម្រាប់ការដោះស្រាយស្ថានភាព
- តែងតែគួរសម មិត្តភាព និងវិជ្ជាជីវៈ

ទិន្នន័យយោង:
${qaContext}

របៀបឆ្លើយតប:
1. ប្រសិនបើរកឃើញការលួចបន្លំ៖ ចាប់ផ្តើមជាមួយ "⚠️ ការព្រមានការលួចបន្លំ"
2. ពន្យល់ច្បាស់ថាហេតុអ្វីនេះជាការលួចបន្លំ
3. ផ្តល់ការណែនាំសុវត្ថិភាពជាបន្តបន្ទាប់
4. ណែនាំអ្នកប្រើប្រាស់ទាក់ទង Agribank hotline: 1900 5555 88

សូមឆ្លើយជាភាសាខ្មែរ យ៉ាងសង្ខេប និងច្បាស់លាស់។`
  };

  return prompts[language] || prompts['en'];
}

function checkFraudKeywords(response) {
  const fraudKeywords = [
    'lừa đảo', 'cảnh báo', 'nguy hiểm', 'fraud', 'alert', 'warning',
    'scam', 'suspicious', 'không tin tưởng', 'đừng', 'stop'
  ];

  const lowerResponse = response.toLowerCase();
  return fraudKeywords.some(keyword => lowerResponse.includes(keyword));
}

// api/chat.js - Vercel Serverless Function (CommonJS)
// Model: deepseek/deepseek-v4-flash:free via OpenRouter

module.exports = async function handler(req, res) {

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'OPENROUTER_API_KEY missing', code: 'NO_API_KEY' });
  }

  let userMessage = '';
  let conversationHistory = [];
  try {
    userMessage = req.body.message || '';
    conversationHistory = req.body.history || [];
  } catch (e) {
    return res.status(400).json({ error: 'Invalid body', code: 'INVALID_BODY' });
  }

  if (!userMessage.trim()) {
    return res.status(400).json({ error: 'Empty message', code: 'EMPTY_MESSAGE' });
  }

  const systemPrompt = [
    '🎓 أنت مساعد ذكي لطلاب الكلية التطبيقية بجامعة القصيم',
    '',
    '📋 التعليمات الأساسية:',
    '- تحدث باللهجة السعودية الطبيعية، ودود، وطبيعي مثل شخص حقيقي',
    '- الإجابات قصيرة (2-4 جمل) واضحة مباشرة',
    '- تنوع في الأسلوب - لا تكرر نفس الكلام',
    '- لا تبدأ الرد بـ: "أهلا", "بالتأكيد", "حسناً"',
    '- استخدم رموز بتحفظ (🎓 ✅ ⚠️ فقط)',
    '',
    '💡 معلومات الكلية:',
    '📍 الموقع: المليداء - المدينة الجامعية لجامعة القصيم',
    '',
    '📚 التخصصات (22 تخصص في 4 مسارات):',
    '  💻 التقني (9): جرافيكس، أمن سيبراني، برمجة، ويب، UI/UX، حوسبة سحابية، تحليل نظم، أنظمة مؤسسة، دعم فني',
    '  🏥 الصحي (4): أسنان، مختبرات، تمريض، تعقيم طبي',
    '  📊 الإداري (6): محاسبة، تسويق، تسويق رقمي، لوجستيات، خدمة عملاء، إدارة فعاليات',
    '  ⚡ المتنوع (3): طاقة شمسية، سلامة صناعية، تعليم اللغة العربية',
    '',
    '💰 المكافآت والرسوم:',
    '- الدراسة مجانية تماماً',
    '- مكافأة جامعية شهرية للطلاب المنتظمين',
    '- بدون تكاليف خفية',
    '',
    '⏱️ مدة الدراسة:',
    '- من سنتين إلى سنتين ونصف',
    '- شامل التدريب الميداني',
    '',
    '📝 القبول والتسجيل:',
    '- التقديم إلكتروني عبر بوابة القبول الموحد',
    '- يفتح عادة في الصيف',
    '- شروط محددة حسب التخصص',
    '',
    '🎯 الحرمان والغياب:',
    '- إذا غبت أكثر من 25% بدون عذر ➜ حرمان من الامتحان النهائي',
    '- درجة النجاح: 60 من 100',
    '- المعدل التراكمي من 5.00',
    '',
    '📖 المتطلبات الأخرى:',
    '- زي: سكراب طبي (صحي)، أو زي وطني (باقي التخصصات)',
    '- تدريب ميداني بعد سنتين',
    '- مركز طبي داخل الحرم للطوارئ',
    '- خدمة نقل (باصات جامعية)',
    '- حذف وإضافة في الأسبوع الأول من كل فصل',
    '',
    '✅ الشهادة:',
    '- معتمدة رسمياً من جامعة القصيم',
    '- معترف بها في سوق العمل',
    '',
    '🚀 استراتيجيات الإجابة:',
    '- إذا سأل عن "التخصصات" ➜ اسأل: "أي مسار يهمك؟"',
    '- إذا سأل عن شيء خارج الكلية ➜ قول: "هذا خارج اختصاصي"',
    '- إذا شكرك ➜ قول: "في خدمتك دايم"',
    '- إذا سلم عليك ➜ قول: "وعليكم السلام حياك الله"',
    '- لكل سؤال شائع: أضف معلومة إضافية صغيرة',
    '',
    'ملاحظة: أنت تمثل الكلية، كن احترافي وصبور ودائماً متعاون! 🤝'
  ].join('\n');

  const messages = [{ role: 'system', content: systemPrompt }];
  var hist = conversationHistory.slice(-6);
  for (var i = 0; i < hist.length; i++) {
    if (hist[i] && hist[i].role && hist[i].content) {
      messages.push({ role: hist[i].role, content: hist[i].content });
    }
  }
  messages.push({ role: 'user', content: userMessage.trim() });

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + apiKey,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://vercel.app',
        'X-Title': 'College Assistant'
      },
      body: JSON.stringify({
        model: 'mistralai/mistral-7b-instruct:free',  // نموذج أفضل ومجاني
        messages: messages,
        max_tokens: 500,  // زيادة الحد الأقصى للإجابات أطول
        temperature: 0.7,  // أكثر طبيعية
        top_p: 0.95,
        frequency_penalty: 0.5,
        presence_penalty: 0.3
      })
    });

    if (!response.ok) {
      var errData = {};
      try { errData = await response.json(); } catch(e2) {}
      if (response.status === 401) return res.status(401).json({ error: 'API key invalid', code: 'INVALID_KEY' });
      if (response.status === 429) return res.status(429).json({ error: 'Rate limit', code: 'RATE_LIMIT' });
      if (response.status === 402) return res.status(402).json({ error: 'Quota exceeded', code: 'QUOTA_EXCEEDED' });
      return res.status(response.status).json({ error: (errData.error && errData.error.message) || 'API error', code: 'API_ERROR' });
    }

    const data = await response.json();
    const aiReply = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content && data.choices[0].message.content.trim();
    if (!aiReply) return res.status(500).json({ error: 'Empty response', code: 'EMPTY_RESPONSE' });

    return res.status(200).json({ reply: aiReply });

  } catch (err) {
    return res.status(500).json({ error: 'Server error: ' + err.message, code: 'SERVER_ERROR' });
  }
};
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
    'انت مساعد ذكي اسمك مساعد الطالب في الكلية التطبيقية بجامعة القصيم.',
    'قواعد الردود:',
    '- تحدث باللهجة السعودية الطبيعية مو الفصحى الرسمية',
    '- ردودك قصيرة ومباشرة من 2 الى 4 جمل فقط',
    '- كن ودود وطبيعي مثل شخص حقيقي',
    '- لا تكرر نفس الكلام',
    '- لا تبدأ كل رد بكلمة اهلا او بالتاكيد',
    '- تنوع في اسلوب الرد',
    '- اذا سلم عليك قل وعليكم السلام حياك الله',
    '- اذا شكرك قل العفو في خدمتك دايم',
    '- اذا سالك عن شيء خارج الكلية قل هذا خارج تخصصي',
    'معلوماتك:',
    '- الكلية التطبيقية بجامعة القصيم في المليداء',
    '- 22 تخصص في 4 مجالات تقنية وصحية وادارية ومتنوعة',
    '- الدراسة مجانية مع مكافاة شهرية',
    '- مدة الدراسة سنتين الى سنتين ونصف',
    '- التقديم الكتروني عبر بوابة القبول الموحد',
    '- الحرمان عند تجاوز 25 بالمئة غياب',
    '- درجة النجاح 60 من 100 والمعدل من 5.00',
    '- يوجد تدريب ميداني بعد اكمال سنتين ومكتب التدريب يساعدك',
    'اذا سالك عن التخصصات بشكل عام قل: الكلية تقدم 22 تخصصاً في 4 مسارات. أي مسار يهمك؟ التقني او الصحي او الاداري او المتنوع',
    'اذا قال تقني اعرض: الجرافيكس والامن السيبراني والبرمجة وتطوير الويب وUI/UX والحوسبة السحابية وتصميم النظم وانظمة المؤسسة والدعم الفني',
    'اذا قال صحي اعرض: مساعد طبيب اسنان ومحضرو المختبرات وفني رعاية مرضى والتعقيم الطبي',
    'اذا قال اداري اعرض: المحاسبة والتسويق والمبيعات والتسويق الرقمي وسلاسل الامداد وخدمة العملاء وادارة الفعاليات',
    'اذا قال متنوع اعرض: الطاقة الشمسية والسلامة الصناعية وتعليم اللغة العربية للناطقين بغيرها',
    'بعد عرض التخصصات اسال: أي تخصص تبي تعرف عنه اكثر؟'
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
        model: 'deepseek/deepseek-v4-flash:free',
        messages: messages,
        max_tokens: 300,
        temperature: 0.75,
        top_p: 0.9,
        frequency_penalty: 0.5,
        presence_penalty: 0.3,
        reasoning: { enabled: true }
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
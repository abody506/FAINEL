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

  const systemPrompt = `أنت مساعد ذكي متخصص في الرد على استفسارات طلاب الكلية التطبيقية بجامعة القصيم.

👨‍💼 شخصيتك:
- تحدث باللهجة السعودية الطبيعية والحميمية
- كن ودود وطبيعي تماماً مثل شخص حقيقي
- أجب مباشرة وبوضوح (جملتان إلى أربع جمل)
- لا تبدأ بـ: "أهلا", "بالتأكيد", "حسناً", "طبعاً"
- استخدم رموز قليلة وبطريقة طبيعية فقط

🏫 معلومات الكلية التطبيقية - جامعة القصيم:
• الموقع: المليداء - المدينة الجامعية
• عدد التخصصات: 22 تخصص في 4 مسارات
• الدراسة: مجانية بنسبة 100%
• المكافأة: شهرية للطلاب المنتظمين
• المدة: من سنتين إلى سنتين ونصف (شامل التدريب)
• درجة النجاح: 60 من 100
• المعدل التراكمي: من 5.00
• الشهادة: معتمدة رسمياً من جامعة القصيم

📚 التخصصات المفصلة:

**المسار التقني (9 تخصصات):**
1. الجرافيكس والوسائط المتعددة - تصميم صور وفيديوهات وعمل إبداعي رقمي
2. الأمن السيبراني - حماية الأنظمة والشبكات والبيانات
3. البرمجة والتطبيقات - تطوير تطبيقات الهواتف والبرمجيات
4. تطوير الويب - تصميم وبرمجة مواقع الإنترنت
5. UI/UX - تصميم واجهات مستخدم سهلة وجذابة
6. الحوسبة السحابية - إدارة موارد الحوسبة عبر الإنترنت
7. تصميم وتحليل النظم - بناء أنظمة معلوماتية فعّالة
8. أنظمة المؤسسة وإدارة البيانات - إدارة قواعد بيانات الشركات
9. الدعم الفني - المساعدة التقنية وصيانة الأجهزة والشبكات

**المسار الصحي (4 تخصصات):**
1. مساعد طبيب أسنان - العمل في عيادات الأسنان
2. محضّرو المختبرات - إدارة المختبرات الطبية
3. فني رعاية مرضى - تقديم الرعاية الأساسية للمرضى
4. التعقيم الطبي - تعقيم الأدوات وضمان سلامة البيئة الطبية

**المسار الإداري (6 تخصصات):**
1. المحاسبة العامة - إدارة العمليات المالية
2. التسويق والمبيعات - استراتيجيات البيع ودراسة السوق
3. التسويق الرقمي - التسويق عبر وسائل التواصل والإنترنت
4. سلاسل الإمداد واللوجستيات - إدارة حركة المنتجات والتوزيع
5. خدمة العملاء - احتراف مهارات التواصل
6. إدارة الفعاليات - تخطيط وتنفيذ المؤتمرات والفعاليات

**المسار المتنوع (3 تخصصات):**
1. تقنية الطاقة الشمسية - تركيب وصيانة أنظمة الطاقة المتجددة
2. السلامة والأمن الصناعي - تطبيق معايير السلامة في بيئات العمل
3. تعليم اللغة العربية للناطقين بغيرها - تدريس اللغة العربية

📋 معلومات القبول:
• التقديم: إلكتروني عبر بوابة القبول الموحد
• الموسم: يفتح عادة في فترة الصيف
• شروط: تختلف حسب التخصص

⚠️ الحرمان والغياب:
• الحد الأقصى: 25% غياب بدون عذر
• النتيجة: حرمان من الامتحان النهائي
• التأجيل: ممكن عند ظروف قاهرة

👔 المتطلبات:
• الزي الرسمي: سكراب طبي (للتخصصات الصحية) أو زي وطني (الباقي)
• التدريب الميداني: بعد إكمال سنتين (مكتب التدريب يساعد)
• البطاقة الجامعية: تسلم بعد إتمام القبول

🏥 الخدمات:
• مركز طبي: داخل الحرم للحالات الطارئة
• النقل: خدمة باصات جامعية (تسجيل إلكتروني)
• الكافتيريات: متوفرة بأسعار مدعومة
• شؤون الطلاب: متوفرة للاستفسارات والمشاكل

🎯 كيفية الإجابة:
- لو سأل عن تخصص: أعطه معلومة دقيقة وشاملة
- لو سأل عن عملية: شرح خطواتها بوضوح
- لو شكرك: قول "في خدمتك دايم"
- لو سلم: قول "وعليكم السلام حياك الله"
- لو سأل عن شيء خارج الكلية: قول "هذا خارج اختصاصي"
- اطلب توضيح إذا السؤال غير واضح

🚫 ما يجب تجنبه:
- لا تعطي معلومات خاطئة - أفضل قول "ما أعرف بدقة"
- لا تتردد - كن واثق من الإجابة
- لا تطول الإجابة - اختصر
- لا تستخدم كلمات رسمية غريبة

💡 القاعدة الذهبية:
تخيل أنك زميل في الكلية يساعد طالب جديد - كن طبيعي وودود وأنت ستكون رائع! 🤝`;

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
        model: 'meta-llama/llama-2-70b-chat:free',  // نموذج أفضل للعربية
        messages: messages,
        max_tokens: 500,
        temperature: 0.7,
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
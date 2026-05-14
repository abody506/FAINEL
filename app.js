// ===== مساعد الطالب - الكلية التطبيقية =====
// نظام هجين: قواعد محلية + OpenRouter AI (DeepSeek)
// Vanilla JS - متوافق مع Vercel Serverless Functions

'use strict';

// ===== تطبيع النص العربي =====
function norm(t) {
  if (!t) return '';
  return t.toLowerCase()
    .replace(/[\u064B-\u065F\u0670]/g, '')
    .replace(/[أإآا]/g, 'ا')
    .replace(/[ةه]/g, 'ه')
    .replace(/[يى]/g, 'ي')
    .replace(/[ؤو]/g, 'و')
    .replace(/\s+/g, ' ').trim();
}

function has(text, words) {
  var n = norm(text);
  return words.some(function(w) { return n.indexOf(norm(w)) !== -1; });
}

// ===== قاعدة بيانات الردود المحلية =====
function localAI(input) {
  var t = norm(input);
  if (has(t, ['السلام عليكم','سلام عليكم'])) return 'وعليكم السلام، حياك الله! كيف أقدر أساعدك؟';
  if (has(t, ['هلا','هلو','هاي','hi','hello'])) return 'أهلا وسهلا، كيف أقدر أساعدك؟';
  if (has(t, ['مرحبا','مرحبتين','اهلا','صباح الخير','مساء الخير'])) return 'أهلا وسهلا، تفضل بسؤالك.';
  if (has(t, ['كيف حالك','كيف الحال','عامل كيف','شلونك'])) return 'بخير والحمد لله، شكراً لسؤالك! كيف أقدر أساعدك؟';
  if (has(t, ['من انت','مين انت','ما اسمك','وش اسمك','عرف نفسك','انت مين','هولوجرام'])) return 'أنا مساعد الطالب الذكي في الكلية التطبيقية بجامعة القصيم. أجاوب على أسئلتك عن التخصصات والقبول والحياة الجامعية.';
  if (has(t, ['وين الكلية','اين الكلية','موقع الكلية','عنوان الكلية','المليداء','وين تقع','اين تقع'])) return 'الكلية التطبيقية تقع في المدينة الجامعية لجامعة القصيم في المليداء.';
  if (has(t, ['مجاني','مجانية','مكافأه','مكافأة','راتب','رسوم','مصاريف','كم تكلف','بكم الدراسه','بدل'])) return 'الدراسة مجانية تماماً، وتُصرف مكافأة جامعية شهرية للطلاب المنتظمين.';
  if (has(t, ['كم مده','كم مدة','مدة الدراسه','كم سنه','كم سنة','متى اتخرج','كم فصل','كم تستغرق'])) return 'مدة الدراسة سنتين إلى سنتين ونصف، وهذا شامل التدريب الميداني.';
  if (has(t, ['كيف اسجل','كيف اقدم','طريقة التسجيل','شروط القبول','موعد القبول','متى يفتح القبول','تقديم الكلية'])) return 'التقديم يتم إلكترونياً عبر بوابة القبول الموحد لجامعة القصيم، وغالباً تفتح في فترة الصيف.';
  if (has(t, ['هل الشهاده معتمده','هل الشهادة معتمدة','هل الدبلوم معتمد','قيمة الشهاده','معترف بالشهاده'])) return 'أكيد! الشهادة معتمدة رسمياً من جامعة القصيم، والبرامج مصممة لتلبية احتياجات سوق العمل.';
  if (has(t, ['حرمان','نسبة الغياب','كم غياب','متى احرم','25 بالمئه','نسبة الحضور','كم مره اغيب'])) return 'إذا تجاوزت نسبة غيابك 25% بدون عذر مقبول، يصدر بحقك قرار حرمان وتُمنع من الاختبار النهائي.';
  if (has(t, ['كم درجة النجاح','درجة النجاح','كم المعدل','المعدل التراكمي','gpa','60','نجاح المادة'])) return 'درجة النجاح 60 من 100، والمعدل التراكمي يُحسب من 5.00.';
  if (has(t, ['تدريب ميداني','تدريب عملي','internship','هل في تدريب','يوجد تدريب'])) return 'نعم يوجد تدريب ميداني، بعد إكمال سنتين من الدراسة يمكنك التوجه لمكتب التدريب في الكلية للاستفسار وترتيب مكان التدريب.';
  if (has(t, ['موعد الاختبارات','جدول الاختبارات','متى الاختبار','ميد تيرم','اختبار نهائي','متى الامتحانات'])) return 'مواعيد الاختبارات النهائية في التقويم الجامعي الرسمي. الاختبارات النصفية يتفق عليها الأستاذ مع الطلاب.';
  if (has(t, ['زي رسمي','ايش البس','وش البس','ملابس الكليه','سكراب','زي الطلاب'])) return 'التخصصات الصحية تتطلب سكراب طبي، وباقي التخصصات تلتزم بالزي الوطني.';
  if (has(t, ['مركز طبي','عيادة الجامعه','طوارئ الجامعه','تعبت بالجامعه','اسعاف الجامعه'])) return 'سلامتك أولاً! يوجد مركز طبي داخل الحرم الجامعي للرعاية الصحية الأولية والحالات الطارئة.';
  if (has(t, ['باص الجامعه','مواصلات الجامعه','نقل الطلاب','حافلة الجامعه','كيف اوصل للجامعه'])) return 'توفر جامعة القصيم خدمة النقل الترددي (الباصات) حسب مسارات معتمدة، وتقدر تسجل إلكترونياً.';
  if (has(t, ['حذف واضافه','حذف وإضافة','اغير تخصصي','احذف ماده','اضيف ماده','تعديل المواد'])) return 'فترة الحذف والإضافة في الأسبوع الأول من كل فصل، وتتم إلكترونياً عبر بوابتك الجامعية.';
  if (has(t, ['بطاقه جامعيه','بطاقة جامعية','هويه الطالب','كارت الجامعه','استلام البطاقه'])) return 'بعد إتمام قبولك وإصدار رقمك الجامعي، سيُعلن عن مواعيد استلام البطاقات. تابع إيميلك الجامعي.';
  if (has(t, ['اجل دراستي','انسحاب من الفصل','اوقف دراستي','تاجيل الفصل'])) return 'يمكن تأجيل الفصل عند وجود ظروف قاهرة، ويتم رفع الطلب إلكترونياً ضمن المواعيد المحددة.';
  if (has(t, ['كافتيريا','مطعم','اكل','طعام','وجبه','قهوه','جوعان','وين اكل'])) return 'متوفر كافتيريات وأكشاك قهوة وأماكن جلوس مخصصة للطلاب داخل الحرم الجامعي.';
  if (has(t, ['مرشد اكاديمي','مشكله اكاديميه','مشكله بالجدول','شؤون الطلاب','لمين اروح','من يساعدني'])) return 'تواصل مع المرشد الأكاديمي المخصص لك، أو راجع قسم شؤون الطلاب في الكلية.';
  return null;
}

// ===== قاعدة التخصصات =====
function matchSpec(t) {
  if (has(t, ['جرافيكس','وسائط متعدده','تصميم جرافيك','graphic design','موشن جرافيك']) || (has(t, ['تصميم']) && has(t, ['تخصص','ايش','وش','ما هو','عن']))) return 'تخصص الجرافيكس والوسائط المتعددة: تصميم صور، إنتاج فيديوهات، وعمل إبداعي رقمي. مناسب لمن يحب الفن الرقمي.';
  if (has(t, ['امن سيبراني','سيبراني','cybersecurity','امن المعلومات','حماية الشبكات'])) return 'تخصص الأمن السيبراني: دراسة حماية الأنظمة والشبكات والبيانات الرقمية من الهجمات الإلكترونية والاختراقات والوصول غير المصرح به.';
  if (has(t, ['برمجه','برمجة','تطوير تطبيقات','تطبيقات الجوال','programming']) || (has(t, ['تطبيق']) && has(t, ['تخصص','تطوير']))) return 'تخصص البرمجة والتطبيقات: تطوير تطبيقات الهواتف والبرمجيات بلغات برمجة حديثة.';
  if (has(t, ['تطوير ويب','تطوير الويب','web development','برمجة مواقع'])) return 'تخصص تطوير الويب: تصميم وبرمجة مواقع الإنترنت من الصفر حتى الاحتراف.';
  if (has(t, ['ui ux','ui/ux','تجربة المستخدم','واجهة المستخدم','تصميم واجهات'])) return 'تخصص UI/UX: تصميم واجهات مستخدم سهلة ومريحة وجذابة للمواقع والتطبيقات.';
  if (has(t, ['حوسبه سحابيه','حوسبة سحابية','cloud computing','aws','azure'])) return 'تخصص الحوسبة السحابية: مجال تقني يركز على إدارة وتقديم موارد الحوسبة كالخوادم والتخزين وقواعد البيانات عبر الإنترنت بنظام الدفع حسب الاستخدام، بدلاً من الأجهزة المحلية.';
  if (has(t, ['تصميم نظم','تحليل نظم','systems analysis'])) return 'تخصص تصميم وتحليل النظم: تخصص تقني إداري يهدف إلى دراسة وفهم احتياجات المؤسسات، ثم بناء وتطوير أنظمة معلوماتية فعّالة تلبي هذه الاحتياجات وتحسّن الأداء التشغيلي.';
  if (has(t, ['انظمة المؤسسه','أنظمة المؤسسة','ادارة البيانات','erp','قواعد بيانات المؤسسات'])) return 'تخصص أنظمة المؤسسة وإدارة البيانات: إدارة قواعد بيانات الشركات بأحدث الأنظمة.';
  if (has(t, ['دعم فني','it support','صيانة اجهزه','تقنية معلومات','تكنيشن'])) return 'تخصص الدعم الفني: المجال المسؤول عن تقديم المساعدة التقنية وصيانة وتشغيل أجهزة وبرمجيات الحاسب والشبكات للمستخدمين، سواء داخل الشركات أو كخدمة عملاء.';
  if (has(t, ['مساعد طبيب اسنان','اسنان','dental','طب الاسنان'])) return 'تخصص مساعد طبيب أسنان: العمل في عيادات الأسنان ومساعدة الأطباء في رعاية المرضى.';
  if (has(t, ['محضر مختبرات','مختبرات طبيه','lab technician','تحاليل طبيه','مختبر'])) return 'تخصص محضّرو المختبرات: تجهيز وإدارة المختبرات الطبية والعلمية.';
  if (has(t, ['رعاية مرضى','فني رعايه','تمريض','nursing','patient care'])) return 'تخصص فني رعاية مرضى: تقديم الرعاية الأساسية للمرضى في المنشآت الصحية.';
  if (has(t, ['تعقيم طبي','تعقيم الادوات','sterilization','تعقيم'])) return 'تخصص التعقيم الطبي: تعقيم الأدوات الطبية وضمان سلامة بيئة العمل الصحي.';
  if (has(t, ['محاسبه','محاسبة','accounting','تقارير ماليه','ميزانيه'])) return 'تخصص المحاسبة العامة: إدارة العمليات المالية وإعداد التقارير. مطلوب في القطاعين الخاص والحكومي.';
  if (has(t, ['تسويق رقمي','digital marketing','سوشيال ميديا','تسويق الكتروني','اعلانات رقميه'])) return 'تخصص التسويق الرقمي: التسويق عبر منصات التواصل الاجتماعي والإنترنت. مجال في نمو مستمر.';
  if (has(t, ['تسويق ومبيعات','مبيعات','sales','marketing','استراتيجية تسويق']) || (has(t, ['تسويق']) && has(t, ['تخصص','ايش','وش','ما هو']))) return 'تخصص التسويق والمبيعات: استراتيجيات البيع ودراسة السوق وكيفية الوصول للعملاء.';
  if (has(t, ['سلاسل الامداد','لوجستيات','logistics','supply chain','مستودعات','شحن'])) return 'تخصص سلاسل الإمداد واللوجستيات: إدارة حركة المنتجات وتوزيعها من المصنع للمستهلك.';
  if (has(t, ['خدمة العملاء','customer service','التعامل مع العملاء'])) return 'تخصص خدمة العملاء: احتراف مهارات التواصل وتلبية احتياجات العملاء. مطلوب في جميع القطاعات.';
  if (has(t, ['ادارة فعاليات','تنظيم فعاليات','event management','تنظيم مؤتمرات'])) return 'تخصص إدارة الفعاليات: تخطيط وتنفيذ المؤتمرات والفعاليات بنجاح.';
  if (has(t, ['طاقه شمسيه','طاقة شمسية','solar','الواح شمسيه','طاقه متجدده'])) return 'تخصص تقنية الطاقة الشمسية: تركيب وصيانة أنظمة الطاقة المتجددة. مجال المستقبل.';
  if (has(t, ['سلامه صناعيه','سلامة صناعية','safety','سلامة مهنيه','وقاية من الحوادث'])) return 'تخصص السلامة والأمن الصناعي: تطبيق معايير السلامة في بيئات العمل والحد من الحوادث.';
  if (has(t, ['تعليم اللغه العربيه','لغه عربيه للاجانب','ناطقين بغيرها','تدريس العربيه'])) return 'تخصص تعليم اللغة العربية للناطقين بغيرها: تدريس وتأسيس غير الناطقين باللغة العربية.';
  return null;
}

// ===== قائمة التخصصات - يسأل عن المسار أولاً =====
function matchAllSpecs(t) {
  // إذا سأل عن كل التخصصات بدون تحديد مسار
  if (has(t, ['كل التخصصات','جميع التخصصات','قائمة التخصصات','ايش في الكليه','وش في الكليه','كم تخصص','عدد التخصصات','التخصصات المتاحه','التخصصات المتوفره','اعرض التخصصات','ما هي التخصصات','اذكر التخصصات']) || (has(t, ['تخصصات']) && has(t, ['كل','جميع','قائمه','كم','عدد','ايش','وش','ما هي']))) {
    return 'الكلية تقدم 22 تخصصاً في 4 مسارات. أي مسار يهمك؟\n\n💻 التقني\n🏥 الصحي\n📊 الإداري\n⚡ المتنوع';
  }

  // إذا اختار المسار التقني
  if (has(t, ['تقني','تقنية','تكنولوجيا','كمبيوتر','حاسب']) && has(t, ['تخصص','تخصصات','مسار','ايش','وش','ما هي','اعرض','اذكر'])) {
    return 'تخصصات المسار التقني (9 تخصصات):\n\n1. الجرافيكس والوسائط المتعددة\n2. الأمن السيبراني\n3. البرمجة والتطبيقات\n4. تطوير الويب\n5. تصميم واجهات المستخدم UI/UX\n6. الحوسبة السحابية\n7. تصميم وتحليل النظم\n8. أنظمة المؤسسة وإدارة البيانات\n9. الدعم الفني\n\nأي تخصص تبي تعرف عنه أكثر؟';
  }

  // إذا اختار المسار الصحي
  if (has(t, ['صحي','صحية','طبي','طبية','صحه','صحة']) && has(t, ['تخصص','تخصصات','مسار','ايش','وش','ما هي','اعرض','اذكر'])) {
    return 'تخصصات المسار الصحي (4 تخصصات):\n\n1. مساعد طبيب أسنان\n2. محضّرو المختبرات\n3. فني رعاية مرضى\n4. التعقيم الطبي\n\nأي تخصص تبي تعرف عنه أكثر؟';
  }

  // إذا اختار المسار الإداري
  if (has(t, ['اداري','ادارية','إداري','إدارية','اعمال','أعمال','بزنس']) && has(t, ['تخصص','تخصصات','مسار','ايش','وش','ما هي','اعرض','اذكر'])) {
    return 'تخصصات المسار الإداري (6 تخصصات):\n\n1. المحاسبة العامة\n2. التسويق والمبيعات\n3. التسويق الرقمي\n4. سلاسل الإمداد واللوجستيات\n5. خدمة العملاء\n6. إدارة الفعاليات\n\nأي تخصص تبي تعرف عنه أكثر؟';
  }

  // إذا اختار المسار المتنوع
  if (has(t, ['متنوع','متنوعة','طاقه','طاقة','سلامه','سلامة','لغه','لغة']) && has(t, ['تخصص','تخصصات','مسار','ايش','وش','ما هي','اعرض','اذكر'])) {
    return 'تخصصات المسار المتنوع (3 تخصصات):\n\n1. تقنية الطاقة الشمسية\n2. السلامة والأمن الصناعي\n3. تعليم اللغة العربية للناطقين بغيرها\n\nأي تخصص تبي تعرف عنه أكثر؟';
  }

  return null;
}

// ===== الذكاء المحلي الرئيسي =====
function localSmartAI(input) {
  if (!input || input.trim().length === 0) return null;
  var t = norm(input);
  var r = localAI(input); if (r) return r;
  r = matchAllSpecs(t); if (r) return r;
  r = matchSpec(t); if (r) return r;
  if (has(t, ['تخصص','تخصصات','برنامج','برامج','دبلوم'])) return 'الكلية تقدم 22 تخصصاً في 4 مسارات. أي مسار يهمك؟\n\n💻 التقني\n🏥 الصحي\n📊 الإداري\n⚡ المتنوع';
  var outOfScope = ['كره قدم','كرة قدم','سياسه','سياسة','طبخ','وصفه','فيلم','مسلسل','اغنيه','موسيقى','طقس','اخبار'];
  if (has(t, outOfScope)) return 'هذا خارج تخصصي، أنا متخصص في شؤون الكلية التطبيقية بجامعة القصيم. هل لديك سؤال عن الكلية؟';
  return null;
}

// ===== حالة التطبيق =====
var state = {
  isListening: false, isSpeaking: false, isThinking: false,
  recognition: null, synthesis: window.speechSynthesis,
  audioContext: null, analyser: null,
  autoRestart: true, restartTimeout: null,
  lastInput: '', lastResponse: '',
  conversationHistory: [], currentUtterance: null,
  speechSupported: true, inputMode: 'voice', bestArabicVoice: null
};

var DOM = {};

function initDOM() {
  DOM.loadingScreen  = document.getElementById('loading-screen');
  DOM.mainApp        = document.getElementById('main-app');
  DOM.statusDot      = document.getElementById('status-dot');
  DOM.statusText     = document.getElementById('status-text');
  DOM.avatarMouth    = document.getElementById('avatar-mouth');
  DOM.soundWaves     = document.getElementById('sound-waves');
  DOM.chatMessages   = document.getElementById('chat-messages');
  DOM.transcriptText = document.getElementById('transcript-text');
  DOM.micBtn         = document.getElementById('mic-btn');
  DOM.micIcon        = document.getElementById('mic-icon');
  DOM.stopBtn        = document.getElementById('stop-btn');
  DOM.aiThinking     = document.getElementById('ai-thinking');
  DOM.errorToast     = document.getElementById('error-toast');
  DOM.vizBars        = document.getElementById('viz-bars');
  DOM.textInputArea  = document.getElementById('text-input-area');
  DOM.textInput      = document.getElementById('text-input');
  DOM.sendBtn        = document.getElementById('send-btn');
}

window.addEventListener('DOMContentLoaded', function() {
  initParticles();
  setTimeout(function() {
    var ls = document.getElementById('loading-screen');
    ls.classList.add('fade-out');
    setTimeout(function() {
      ls.style.display = 'none';
      document.getElementById('main-app').classList.remove('hidden');
      initDOM();
      initApp();
    }, 800);
  }, 2200);
});

function initApp() {
  createVizBars();
  detectBestVoice();
  var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) { state.speechSupported = false; enableTextMode(); }
  else { initSpeechRecognition(); setTimeout(function() { startListening(); }, 800); }
  setupEventListeners();
}

function detectBestVoice() {
  function findVoice() {
    var v = state.synthesis.getVoices();
    state.bestArabicVoice = v.find(function(x){return x.lang==='ar-SA';}) ||
      v.find(function(x){return x.lang==='ar-EG';}) ||
      v.find(function(x){return x.lang.startsWith('ar');}) ||
      v.find(function(x){return x.name.toLowerCase().includes('arabic');}) || null;
  }
  findVoice();
  if (state.synthesis.onvoiceschanged !== undefined) state.synthesis.onvoiceschanged = findVoice;
}

function enableTextMode() {
  state.inputMode = 'text';
  if (DOM.textInputArea) DOM.textInputArea.style.display = 'flex';
  if (DOM.micBtn) { DOM.micBtn.classList.add('disabled'); DOM.micBtn.title = 'التعرف على الصوت غير متاح في هذا المتصفح'; }
  if (DOM.transcriptText) DOM.transcriptText.textContent = 'اكتب سؤالك أدناه...';
  updateStatus('ready');
}

function createVizBars() {
  var c = document.createElement('div');
  c.className = 'viz-bars-container';
  for (var i = 0; i < 20; i++) {
    var b = document.createElement('div');
    b.className = 'viz-bar-item';
    b.style.height = '4px';
    c.appendChild(b);
  }
  if (DOM.vizBars && DOM.vizBars.parentElement) { DOM.vizBars.parentElement.appendChild(c); DOM.vizBars.remove(); }
}

function initSpeechRecognition() {
  var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) return;
  state.recognition = new SR();
  state.recognition.lang = 'ar-SA';
  state.recognition.continuous = true;
  state.recognition.interimResults = true;
  state.recognition.maxAlternatives = 1;
  state.recognition.onstart = function() {
    state.isListening = true; updateStatus('listening');
    DOM.micBtn.classList.add('listening'); DOM.micIcon.textContent = '🔴';
    DOM.transcriptText.textContent = 'أستمع إليك...'; DOM.transcriptText.classList.add('active');
  };
  state.recognition.onresult = function(event) {
    var interim = '', final = '';
    for (var i = event.resultIndex; i < event.results.length; i++) {
      var tr = event.results[i][0].transcript;
      if (event.results[i].isFinal) final += tr; else interim += tr;
    }
    if (interim) DOM.transcriptText.textContent = interim;
    if (final.trim()) { DOM.transcriptText.textContent = final.trim(); handleUserInput(final.trim()); }
  };
  state.recognition.onerror = function(e) {
    if (e.error === 'no-speech' || e.error === 'aborted') { if (state.autoRestart && !state.isSpeaking) restartListening(); return; }
    if (e.error === 'not-allowed') { showError('يرجى السماح بالوصول إلى المايكروفون من إعدادات المتصفح.'); updateStatus('error'); enableTextMode(); return; }
    if (e.error === 'network') { showError('تحقق من اتصالك بالإنترنت.'); return; }
    if (state.autoRestart && !state.isSpeaking) restartListening();
  };
  state.recognition.onend = function() {
    state.isListening = false;
    if (DOM.micBtn) DOM.micBtn.classList.remove('listening');
    if (DOM.micIcon) DOM.micIcon.textContent = '🎤';
    if (DOM.transcriptText) DOM.transcriptText.classList.remove('active');
    if (state.autoRestart && !state.isSpeaking && !state.isThinking) restartListening();
    else if (!state.isSpeaking && !state.isThinking) { updateStatus('ready'); if (DOM.transcriptText) DOM.transcriptText.textContent = 'استمع... تحدث الآن'; }
  };
}

function restartListening() {
  clearTimeout(state.restartTimeout);
  state.restartTimeout = setTimeout(function() {
    if (state.autoRestart && !state.isSpeaking && !state.isThinking && state.recognition) {
      try { state.recognition.start(); } catch(e) {}
    }
  }, 500);
}

function startListening() {
  if (!state.recognition) return;
  state.autoRestart = true;
  try { state.recognition.start(); } catch(e) {}
  initAudioVisualizer();
}

function stopListening() {
  state.autoRestart = false;
  clearTimeout(state.restartTimeout);
  if (state.recognition) { try { state.recognition.stop(); } catch(e) {} }
  state.isListening = false;
  if (DOM.micBtn) DOM.micBtn.classList.remove('listening');
  if (DOM.micIcon) DOM.micIcon.textContent = '🎤';
  updateStatus('ready');
  if (DOM.transcriptText) { DOM.transcriptText.textContent = 'المايكروفون متوقف - اضغط للتشغيل'; DOM.transcriptText.classList.remove('active'); }
}

async function initAudioVisualizer() {
  try {
    var stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    state.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    state.analyser = state.audioContext.createAnalyser();
    state.analyser.fftSize = 64;
    var mic = state.audioContext.createMediaStreamSource(stream);
    mic.connect(state.analyser);
    animateVisualizer();
  } catch(e) {}
}

function animateVisualizer() {
  if (!state.analyser) return;
  var bufLen = state.analyser.frequencyBinCount;
  var data = new Uint8Array(bufLen);
  var bars = document.querySelectorAll('.viz-bar-item');
  function draw() {
    requestAnimationFrame(draw);
    if (!state.analyser) return;
    state.analyser.getByteFrequencyData(data);
    bars.forEach(function(bar, i) {
      var val = data[Math.floor((i / bars.length) * bufLen)] || 0;
      var h = state.isListening ? Math.max(4, (val / 255) * 36) : 4;
      bar.style.height = h + 'px';
      bar.style.opacity = state.isListening ? (0.4 + (val / 255) * 0.6) : 0.3;
    });
  }
  draw();
}

// ===== معالجة المدخلات =====
async function handleUserInput(text) {
  if (!text || text.trim().length === 0) return;
  if (state.isThinking) return;
  var cleanText = text.trim();
  if (norm(cleanText) === norm(state.lastInput) && state.lastInput !== '') return;
  state.lastInput = cleanText;
  if (state.recognition) { try { state.recognition.stop(); } catch(e) {} }
  addMessage(cleanText, 'user');
  state.isThinking = true;
  showThinking(true);
  updateStatus('thinking');
  var localResponse = localSmartAI(cleanText);
  if (localResponse) {
    await delay(150 + Math.random() * 150);
    showThinking(false); state.isThinking = false;
    deliverResponse(localResponse);
  } else {
    try {
      var aiResponse = await callOpenRouterAI(cleanText);
      showThinking(false); state.isThinking = false;
      deliverResponse(aiResponse);
    } catch(err) {
      showThinking(false); state.isThinking = false;
      deliverResponse(getFallbackResponse(err.code));
    }
  }
}

function deliverResponse(text) {
  if (text === state.lastResponse) text = 'هل لديك سؤال آخر؟';
  state.lastResponse = text;
  state.conversationHistory.push({ role: 'assistant', content: text });
  if (state.conversationHistory.length > 20) state.conversationHistory = state.conversationHistory.slice(-20);
  addMessageWithTyping(text, 'assistant');
  speakText(text);
}

async function callOpenRouterAI(userMessage) {
  state.conversationHistory.push({ role: 'user', content: userMessage });
  var controller = new AbortController();
  var timeoutId = setTimeout(function() { controller.abort(); }, 25000);
  try {
    var response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userMessage, history: state.conversationHistory.slice(-6) }),
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    var data = await response.json();
    if (!response.ok) {
      var err = new Error(data.error || 'خطأ في الاتصال');
      err.code = data.code || 'API_ERROR';
      throw err;
    }
    return data.reply;
  } catch(e) {
    clearTimeout(timeoutId);
    if (e.name === 'AbortError') { var te = new Error('timeout'); te.code = 'TIMEOUT'; throw te; }
    if (!navigator.onLine) { var oe = new Error('offline'); oe.code = 'OFFLINE'; throw oe; }
    throw e;
  }
}

function getFallbackResponse(code) {
  var r = {
    'OFFLINE': 'يبدو إنك مو متصل بالإنترنت. تحقق من الاتصال وحاول مرة ثانية.',
    'TIMEOUT': 'الاتصال أخذ وقتاً طويلاً. حاول مرة ثانية.',
    'RATE_LIMIT': 'الطلبات كثيرة الحين، انتظر ثانية وحاول مرة ثانية.',
    'QUOTA_EXCEEDED': 'رصيد الذكاء الاصطناعي انتهى مؤقتاً. تواصل مع الإدارة.',
    'INVALID_KEY': 'هناك مشكلة في إعدادات النظام. تواصل مع الإدارة.',
    'NO_API_KEY': 'النظام يحتاج إعداد. تواصل مع الإدارة.',
    'API_ERROR': 'حدث خطأ مؤقت. حاول مرة ثانية.',
    'SERVER_ERROR': 'حدث خطأ في الخادم. حاول بعد قليل.'
  };
  return r[code] || 'ما قدرت أجاوب الحين. حاول مرة ثانية أو اسأل سؤالاً مختلفاً.';
}

function delay(ms) { return new Promise(function(resolve) { setTimeout(resolve, ms); }); }

// ===== Text To Speech =====
function speakText(text) {
  if (!state.synthesis) { afterSpeak(); return; }
  state.synthesis.cancel();
  // تنظيف النص من كل ما لا يُنطق
  var clean = text
    .replace(/[\u{1F000}-\u{1FFFF}]/gu, '')   // إيموجي
    .replace(/[\u2600-\u27BF]/g, '')            // رموز متنوعة
    .replace(/[*_~#`]/g, '')                    // ماركداون
    .replace(/\d+\./g, '')                      // أرقام مع نقطة (1. 2. 3.)
    .replace(/[،,]/g, ' ')                      // فواصل
    .replace(/[:]/g, ' ')                       // نقطتان
    .replace(/\n+/g, ' ')                       // أسطر جديدة
    .replace(/\s+/g, ' ')
    .trim();
  if (!clean) { afterSpeak(); return; }
  var utt = new SpeechSynthesisUtterance(clean);
  utt.lang = 'ar-SA'; utt.rate = 0.90; utt.pitch = 1.05; utt.volume = 1.0;
  if (state.bestArabicVoice) utt.voice = state.bestArabicVoice;
  state.isSpeaking = true; state.currentUtterance = utt;
  updateStatus('speaking');
  if (DOM.avatarMouth) DOM.avatarMouth.classList.add('talking');
  if (DOM.soundWaves) DOM.soundWaves.classList.add('active');
  var ended = false;
  function onEnd() { if (!ended) { ended = true; clearInterval(resumeTimer); afterSpeak(); } }
  utt.onend = onEnd;
  utt.onerror = function(e) { if (e.error !== 'interrupted') onEnd(); };
  state.synthesis.speak(utt);
  // Chrome bug workaround
  var resumeTimer = setInterval(function() {
    if (!state.isSpeaking) { clearInterval(resumeTimer); return; }
    if (state.synthesis.paused) state.synthesis.resume();
  }, 5000);
}

function afterSpeak() {
  state.isSpeaking = false; state.currentUtterance = null;
  if (DOM.avatarMouth) DOM.avatarMouth.classList.remove('talking');
  if (DOM.soundWaves) DOM.soundWaves.classList.remove('active');
  updateStatus('ready');
  if (DOM.transcriptText) DOM.transcriptText.textContent = 'استمع... تحدث الآن';
  state.lastInput = '';
  if (state.autoRestart && state.recognition && state.inputMode === 'voice') {
    setTimeout(function() { try { state.recognition.start(); } catch(e) {} }, 600);
  }
}

function stopSpeaking() { if (state.synthesis) state.synthesis.cancel(); afterSpeak(); }

// ===== عرض الرسائل مع Typing Effect =====
function addMessageWithTyping(text, sender) {
  var div = document.createElement('div');
  div.className = 'message ' + (sender === 'user' ? 'user-message' : 'assistant-message');
  var av = document.createElement('div');
  av.className = 'message-avatar';
  av.textContent = sender === 'user' ? '👤' : '🤖';
  var bubble = document.createElement('div');
  bubble.className = 'message-bubble';
  if (sender === 'user') { div.appendChild(bubble); div.appendChild(av); }
  else { div.appendChild(av); div.appendChild(bubble); }
  DOM.chatMessages.appendChild(div);
  DOM.chatMessages.scrollTop = DOM.chatMessages.scrollHeight;
  if (sender === 'assistant') {
    var p = document.createElement('p');
    bubble.appendChild(p);
    var i = 0;
    var chars = text.replace(/[*_~#]/g,'').trim();
    function typeChar() {
      if (i < chars.length) {
        p.textContent += chars[i]; i++;
        DOM.chatMessages.scrollTop = DOM.chatMessages.scrollHeight;
        setTimeout(typeChar, 18);
      }
    }
    typeChar();
  } else {
    var p = document.createElement('p');
    p.textContent = text;
    bubble.appendChild(p);
  }
}

function addMessage(text, sender) { addMessageWithTyping(text, sender); }

// ===== تحديث الحالة =====
function updateStatus(s) {
  var map = {
    ready:     { text: 'جاهز للاستماع',      dot: '' },
    listening: { text: 'أستمع إليك...',      dot: 'listening' },
    thinking:  { text: 'يفكر المساعد...',    dot: 'speaking' },
    speaking:  { text: 'المساعد يتحدث',      dot: 'speaking' },
    error:     { text: 'خطأ في المايكروفون', dot: 'listening' }
  };
  var st = map[s] || map.ready;
  if (DOM.statusText) DOM.statusText.textContent = st.text;
  if (DOM.statusDot) DOM.statusDot.className = 'status-dot ' + st.dot;
}

function showThinking(show) { if (DOM.aiThinking) DOM.aiThinking.classList.toggle('visible', show); }

function showError(msg) {
  if (!DOM.errorToast) return;
  DOM.errorToast.textContent = msg;
  DOM.errorToast.classList.add('visible');
  setTimeout(function() { if (DOM.errorToast) DOM.errorToast.classList.remove('visible'); }, 6000);
}

function askQuestion(q) {
  if (state.isThinking || state.isSpeaking) return;
  state.lastInput = '';
  handleUserInput(q);
}

function sendTextInput() {
  if (!DOM.textInput) return;
  var text = DOM.textInput.value.trim();
  if (!text || state.isThinking) return;
  DOM.textInput.value = '';
  handleUserInput(text);
}

function setupEventListeners() {
  if (DOM.micBtn) {
    DOM.micBtn.addEventListener('click', function() {
      if (state.inputMode === 'text') return;
      if (state.isListening) stopListening();
      else { state.autoRestart = true; startListening(); }
    });
  }
  if (DOM.stopBtn) DOM.stopBtn.addEventListener('click', function() { stopSpeaking(); });
  if (DOM.sendBtn) DOM.sendBtn.addEventListener('click', function() { sendTextInput(); });
  if (DOM.textInput) {
    DOM.textInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendTextInput(); }
    });
  }
  window.addEventListener('offline', function() { showError('انقطع الاتصال بالإنترنت.'); });
  window.addEventListener('online', function() { showError('عاد الاتصال بالإنترنت'); });
}

// ===== جسيمات الخلفية =====
function initParticles() {
  var canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);
  var particles = [];
  for (var i = 0; i < 70; i++) {
    particles.push({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
      size: Math.random() * 1.8 + 0.4, opacity: Math.random() * 0.45 + 0.1,
      color: Math.random() > 0.5 ? '0,212,255' : '123,47,255'
    });
  }
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var i = 0; i < particles.length; i++) {
      for (var j = i + 1; j < particles.length; j++) {
        var dx = particles[i].x - particles[j].x;
        var dy = particles[i].y - particles[j].y;
        var d = Math.sqrt(dx * dx + dy * dy);
        if (d < 110) {
          ctx.beginPath();
          ctx.strokeStyle = 'rgba(0,212,255,' + (0.04 * (1 - d / 110)) + ')';
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
    particles.forEach(function(p) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(' + p.color + ',' + p.opacity + ')';
      ctx.fill();
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
    });
    requestAnimationFrame(draw);
  }
  draw();
}

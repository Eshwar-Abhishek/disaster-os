/**
 * RESQ Comprehensive Offline Autonomous Emergency AI Engine & Knowledge Base
 * Operates 100% offline without cellular or cloud connection.
 */

const EMERGENCY_KNOWLEDGE = [
  {
    keywords: ['bleeding', 'bleed', 'blood', 'wound', 'cut', 'gash', 'haemorrhage'],
    topic: 'Severe Bleeding & Hemorrhage Control',
    severity: 'Critical',
    steps: [
      'Apply direct, firm pressure on the wound using a clean cloth, towel, or gloved hand.',
      'Maintain continuous pressure for at least 10–15 minutes without lifting to check.',
      'Elevate the injured limb above heart level if no bone fracture is suspected.',
      'If bleeding soaks through, DO NOT remove the first cloth—add more layers on top.',
      'If severe limb bleeding persists after 5 mins, apply a tourniquet 2-3 inches ABOVE the injury (never on a joint). Tighten until bleeding stops.'
    ],
    triageCategory: 'Red',
    bloodLossRisk: 'High',
    warning: 'Do not remove tourniquet once applied. Note the exact application time.'
  },
  {
    keywords: ['cpr', 'breath', 'breathing', 'unconscious', 'pulse', 'heart', 'cardiac', 'collapse', 'passed out'],
    topic: 'CPR & Unconscious Patient Resuscitation',
    severity: 'Critical',
    steps: [
      'Check responsiveness: Tap shoulders firmly and yell "Are you okay?".',
      'Check for normal breathing for 5–10 seconds.',
      'If NOT breathing or only gasping, place hands in the center of the chest.',
      'Push hard and fast: 100–120 compressions per minute at a depth of 2 inches (5 cm).',
      'Maintain rhythm: "Push... Push... Push..." (rhythm of Stayin\' Alive).',
      'Perform continuous compressions until emergency medical responders take over or patient revives.'
    ],
    triageCategory: 'Red',
    bloodLossRisk: 'None',
    warning: 'Do not stop compressions unless victim wakes up or physical exhaustion prevents continuing.'
  },
  {
    keywords: ['burn', 'fire', 'scalding', 'heat', 'chemical burn', 'acid'],
    topic: 'Thermal & Chemical Burn Emergency',
    severity: 'High',
    steps: [
      'Immediately cool the burn under cool (not ice cold) running water for 10–20 minutes.',
      'For chemical burns, flush continuously with clean water for 20 minutes to dilute chemical.',
      'Remove jewelry, belts, or tight clothing around burned areas before swelling begins.',
      'Cover burn loosely with clean, non-stick sterile gauze or clean plastic wrap.',
      'Do NOT pop blisters. Do NOT apply butter, oil, toothpaste, or ice.'
    ],
    triageCategory: 'Yellow',
    bloodLossRisk: 'Low',
    warning: 'Chemical burns to eyes require continuous irrigation flushing for 30 minutes.'
  },
  {
    keywords: ['choking', 'choke', 'airway', 'blocked throat', 'food stuck', 'strangle'],
    topic: 'Choking & Airway Obstruction',
    severity: 'Critical',
    steps: [
      'Ask "Are you choking?". If they cannot speak or cough, stand behind them.',
      'Perform Heimlich Maneuver: Wrap arms around waist, tilt victim slightly forward.',
      'Make a fist with one hand, place thumb side above navel and below ribcage.',
      'Grasp fist with other hand and give quick, upward abdominal thrusts.',
      'Repeat thrusts until object is expelled or person becomes unconscious (then start CPR).'
    ],
    triageCategory: 'Red',
    bloodLossRisk: 'None',
    warning: 'For infants under 1 year, perform 5 back blows followed by 5 chest thrusts.'
  },
  {
    keywords: ['snake', 'bite', 'venom', 'poisonous', 'reptile'],
    topic: 'Snake Bite & Envenomation Management',
    severity: 'High',
    steps: [
      'Keep victim calm and still to slow venom circulation.',
      'Immobilize the bitten limb below heart level.',
      'Remove tight jewelry or footwear before swelling occurs.',
      'Clean wound with clean water without rubbing.',
      'Do NOT cut the bite area, do NOT suck out venom, do NOT apply ice or tight tourniquets.'
    ],
    triageCategory: 'Orange',
    bloodLossRisk: 'Low',
    warning: 'Remember snake color/pattern if safe to observe to assist anti-venom selection.'
  },
  {
    keywords: ['fracture', 'broken', 'bone', 'leg', 'arm', 'joint', 'dislocation'],
    topic: 'Bone Fracture & Splinting Protocol',
    severity: 'Medium',
    steps: [
      'Stop any external bleeding first with direct pressure.',
      'Immobilize the injured area. Do NOT attempt to realign broken bones.',
      'Apply a rigid splint (cardboard, wood, folded magazine) extending above and below joint.',
      'Secure splint firmly with cloth ties, but avoid wrapping so tightly that circulation is cut off.',
      'Apply wrapped ice pack (15 mins on/15 mins off) to reduce pain and swelling.'
    ],
    triageCategory: 'Yellow',
    bloodLossRisk: 'Medium (High if open compound fracture)',
    warning: 'If bone is protruding (open fracture), cover with sterile cloth without pressing bone back in.'
  },
  {
    keywords: ['flood', 'drowning', 'water', 'submerged', 'current', 'river'],
    topic: 'Flood Survival & Drowning First Aid',
    severity: 'Critical',
    steps: [
      'Reach or Throw before going in: Use a pole, rope, or floating object to rescue drowning person.',
      'Once out of water, check breathing and pulse.',
      'If not breathing, start CPR immediately with 5 initial rescue breaths before chest compressions.',
      'Turn victim onto side if vomiting occurs to clear airway.',
      'Keep victim warm with dry blankets to treat hypothermia.'
    ],
    triageCategory: 'Red',
    bloodLossRisk: 'None',
    warning: 'Never enter fast-moving floodwaters over knee height.'
  },
  {
    keywords: ['earthquake', 'rubble', 'trapped', 'building collapse', 'debris', 'tremor'],
    topic: 'Earthquake & Rubble Collapse Survival',
    severity: 'Critical',
    steps: [
      'Drop, Cover, and Hold On: Get under heavy furniture, shield head and neck.',
      'If trapped in rubble: Protect nose/mouth with cloth to prevent dust inhalation.',
      'Signal rescue teams by tapping on pipes or metallic objects (3 taps in sequence).',
      'Shout only as a last resort to preserve oxygen and avoid inhaling deadly dust.',
      'Cover any wounds tightly to prevent contamination.'
    ],
    triageCategory: 'Red',
    bloodLossRisk: 'High',
    warning: 'Watch out for aftershocks and secondary collapse risks.'
  },
  {
    keywords: ['electric', 'shock', 'electrocution', 'live wire', 'power line'],
    topic: 'Electrical Shock & High Voltage Trauma',
    severity: 'Critical',
    steps: [
      'Do NOT touch the victim while they are still in contact with the electrical current.',
      'Shut off main power source or switch breaker off immediately.',
      'If power cannot be shut off, use non-conductive object (wooden broom handle, dry cardboard) to separate victim from source.',
      'Check breathing and pulse. Start CPR immediately if patient is unresponsive.',
      'Treat electrical burns with dry sterile dressings.'
    ],
    triageCategory: 'Red',
    bloodLossRisk: 'Low',
    warning: 'High voltage lines require staying at least 30 feet away until utility crew cuts grid power.'
  },
  {
    keywords: ['pregnancy', 'childbirth', 'baby delivery', 'labor', 'pregnant'],
    topic: 'Emergency Childbirth & Labor in Disaster',
    severity: 'Critical',
    steps: [
      'Keep mother calm, warm, and lying in comfortable position.',
      'Wash hands thoroughly with soap/water or hand sanitizer.',
      'Do NOT pull or push the baby. Let mother push naturally during contractions.',
      'Support baby\'s head and body as it emerges. Clean baby\'s mouth and nose gently with clean cloth.',
      'Dry baby immediately and wrap tightly against mother\'s chest for skin-to-skin warmth.'
    ],
    triageCategory: 'Orange',
    bloodLossRisk: 'Medium',
    warning: 'Do NOT tie or cut umbilical cord unless sterile clamp/scissors are available. Wait for medical staff.'
  },
  {
    keywords: ['chemical', 'ammonia', 'gas leak', 'fumes', 'poisonous gas'],
    topic: 'Chemical Leak & Hazardous Gas Plume Evacuation',
    severity: 'Critical',
    steps: [
      'Evacuate UPWIND and CROSSWIND away from the chemical plume cloud.',
      'Cover mouth and nose with wet cloth or mask.',
      'If trapped indoors: Seal doors, windows, and air vents with damp towels or duct tape.',
      'If chemical hits skin/eyes: Flush with clean water for 20 minutes continuously.',
      'Remove contaminated clothing immediately and place in sealed plastic bag.'
    ],
    triageCategory: 'Red',
    bloodLossRisk: 'Low',
    warning: 'Anhydrous ammonia and chlorine gas damage lungs rapidly. Seek fresh air immediately.'
  }
];

export function queryOfflineAI(userInput) {
  if (!userInput || typeof userInput !== 'string') {
    return getDefaultResponse();
  }

  const query = userInput.toLowerCase();
  const matched = EMERGENCY_KNOWLEDGE.find(item =>
    item.keywords.some(kw => query.includes(kw))
  );

  if (matched) {
    return {
      severity: matched.severity,
      topic: matched.topic,
      steps: matched.steps,
      triageCategory: matched.triageCategory,
      bloodLossRisk: matched.bloodLossRisk,
      warning: matched.warning,
      offlineStatus: 'OPERATIONAL (Local Decision Engine)'
    };
  }

  // Generic First Aid Triage fallback
  return {
    severity: 'High',
    topic: 'General Emergency Survival Instructions',
    steps: [
      'Ensure immediate environment is safe before administering aid.',
      'Check vital signs: Airway, Breathing, Circulation (ABCs).',
      'Control severe bleeding with direct pressure.',
      'Keep victim warm and lying down to prevent shock.',
      'Activate phone Emergency Beacon or call emergency services if network returns.'
    ],
    triageCategory: 'Yellow',
    bloodLossRisk: 'Unknown',
    warning: 'Monitor victim closely for signs of shock (pale skin, rapid pulse, confusion).',
    offlineStatus: 'OPERATIONAL (Local General Protocol)'
  };
}

function getDefaultResponse() {
  return {
    severity: 'Medium',
    topic: 'Offline Emergency Survival Assistant',
    steps: ['Select an emergency topic or state symptoms for instant offline first aid guidance.'],
    triageCategory: 'Green',
    bloodLossRisk: 'Low',
    offlineStatus: 'READY'
  };
}

export function getMultilingualAIResponse(aiResult, langCode = 'en-US') {
  if (!aiResult) return null;

  const shortLang = (langCode || 'en').split('-')[0].toLowerCase();

  const translations = {
    hi: {
      intro: 'आपकी आपातकालीन प्रतिक्रिया',
      topic: aiResult.topic,
      severity: `गंभीरता: ${aiResult.severity}`,
      action: `मुख्य कदम: ${aiResult.steps[0]}`,
      reassurance: 'शांत रहें, निकटतम आपातकालीन टीम को अलर्ट भेज दिया गया है।'
    },
    te: {
      intro: 'మీ అత్యవసర రక్షణ మార్గదర్శకం',
      topic: aiResult.topic,
      severity: `తీవ్రత: ${aiResult.severity}`,
      action: `తక్షణ చర్య: ${aiResult.steps[0]}`,
      reassurance: 'ప్రశాంతంగా ఉండండి, అత్యవసర రక్షణ సహాయం పంపబడింది.'
    },
    ta: {
      intro: 'உங்கள் அவசர சிகிச்சை வழிகாட்டுதல்',
      topic: aiResult.topic,
      severity: `தீவிரத்தன்மை: ${aiResult.severity}`,
      action: `உடனடி நடவடிக்கை: ${aiResult.steps[0]}`,
      reassurance: 'அமைதியாக இருங்கள், அவசர உதவி அனுப்பப்பட்டுள்ளது.'
    },
    kn: {
      intro: 'ನಿಮ್ಮ ತುರ್ತು ವೈದ್ಯಕೀಯ ಮಾರ್ಗದರ್ಶನ',
      topic: aiResult.topic,
      severity: `ತೀವ್ರತೆ: ${aiResult.severity}`,
      action: `ತಕ್ಷಣದ ಕ್ರಮ: ${aiResult.steps[0]}`,
      reassurance: 'ಶಾಂತರಾಗಿರಿ, ತುರ್ತು ರಕ್ಷಣಾ ತಂಡವನ್ನು ಕಳುಹಿಸಲಾಗಿದೆ.'
    },
    ml: {
      intro: 'അടിയന്തര വൈദ്യസഹായ മാർഗ്ഗനിർദ്ദേശം',
      topic: aiResult.topic,
      severity: `തീവ്രത: ${aiResult.severity}`,
      action: `ഉടനടി ചെയ്യേണ്ടത്: ${aiResult.steps[0]}`,
      reassurance: 'ശാന്തരായിരിക്കുക, അടിയന്തര സഹായം അയച്ചിട്ടുണ്ട്.'
    },
    mr: {
      intro: 'आपत्कालीन वैद्यकीय मार्गदर्शन',
      topic: aiResult.topic,
      severity: `तीव्रता: ${aiResult.severity}`,
      action: `तत्काळ कारवाई: ${aiResult.steps[0]}`,
      reassurance: 'शांत रहा, आपत्कालीन पथक पाठवले आहे.'
    },
    gu: {
      intro: 'કટોકટી તબીબી માર્ગદર્શન',
      topic: aiResult.topic,
      severity: `ગંભીરતા: ${aiResult.severity}`,
      action: `ત્વરિત પગલું: ${aiResult.steps[0]}`,
      reassurance: 'શાંત રહો, કટોકટીની મદદ મોકલી આપવામાં આવી છે.'
    },
    pa: {
      intro: 'ਸੰਕਟਕਾਲੀਨ ਡਾਕਟਰੀ ਮਦਦ ਗਾਈਡ',
      topic: aiResult.topic,
      severity: `ਗੰਭੀਰਤਾ: ${aiResult.severity}`,
      action: `ਤੁਰੰਤ ਕਦਮ: ${aiResult.steps[0]}`,
      reassurance: 'ਸ਼ਾਂਤ ਰਹੋ, ਸੰਕਟਕਾਲੀਨ ਟੀਮ ਭੇਜੀ ਗਈ ਹੈ।'
    },
    bn: {
      intro: 'জরুরী চিকিৎসা নির্দেশনা',
      topic: aiResult.topic,
      severity: `তীব্রতা: ${aiResult.severity}`,
      action: `অবিলম্বে করণীয়: ${aiResult.steps[0]}`,
      reassurance: 'শান্ত থাকুন, জরুরী উদ্ধারকারী দলকে পাঠানো হয়েছে।'
    },
    ur: {
      intro: 'ہنگامی طبی امدادی رہنمائی',
      topic: aiResult.topic,
      severity: `شدت: ${aiResult.severity}`,
      action: `فوری اقدام: ${aiResult.steps[0]}`,
      reassurance: 'پرسکون رہیں، ہنگامی امداد بھیج دی گئی ہے۔'
    },
    es: {
      intro: 'Guía de respuesta de emergencia',
      topic: aiResult.topic,
      severity: `Severidad: ${aiResult.severity}`,
      action: `Acción inmediata: ${aiResult.steps[0]}`,
      reassurance: 'Mantenga la calma, la ayuda de emergencia está en camino.'
    },
    fr: {
      intro: "Guide de réponse d'urgence",
      topic: aiResult.topic,
      severity: `Gravité: ${aiResult.severity}`,
      action: `Action immédiate: ${aiResult.steps[0]}`,
      reassurance: 'Restez calme, les secours sont en route.'
    },
    ar: {
      intro: 'دليل الاستجابة للطوارئ',
      topic: aiResult.topic,
      severity: `الخطورة: ${aiResult.severity}`,
      action: `الإجراء الفوري: ${aiResult.steps[0]}`,
      reassurance: 'ابق هادئاً، فريق الطوارئ في الطريق إليك.'
    },
    zh: {
      intro: '紧急救援操作指南',
      topic: aiResult.topic,
      severity: `严重程度: ${aiResult.severity}`,
      action: `立即操作: ${aiResult.steps[0]}`,
      reassurance: '请保持冷静，救援人员正在赶往现场。'
    },
    en: {
      intro: 'Emergency Response Guide',
      topic: aiResult.topic,
      severity: `Severity: ${aiResult.severity}`,
      action: `Immediate Action: ${aiResult.steps[0]}`,
      reassurance: 'Stay calm, emergency responders are dispatched.'
    }
  };

  const pack = translations[shortLang] || translations.en;

  const spokenText = `${pack.intro}. ${pack.topic}. ${pack.severity}. ${pack.action}. ${pack.reassurance}`;

  return {
    ...aiResult,
    spokenText,
    localizedTopic: pack.topic,
    localizedAction: pack.action,
    localizedIntro: pack.intro,
    localizedReassurance: pack.reassurance
  };
}

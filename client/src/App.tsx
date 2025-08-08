import React, { useState, useMemo } from "react";

// ============================================================================
// ЛОГИКА СЕГМЕНТАЦИИ (встроенная в компонент)
// ============================================================================

const LATVIAN_MONTHS = [
  "janvāris",
  "janvārī",
  "janvāra",
  "janv.",
  "februāris",
  "februārī",
  "februāra",
  "febr.",
  "marts",
  "martā",
  "marta",
  "mart.",
  "aprīlis",
  "aprīlī",
  "aprīļa",
  "apr.",
  "maijs",
  "maijā",
  "maija",
  "jūnijs",
  "jūnijā",
  "jūnija",
  "jūn.",
  "jūlijs",
  "jūlijā",
  "jūlija",
  "jūl.",
  "augusts",
  "augustā",
  "augusta",
  "aug.",
  "septembris",
  "septembrī",
  "septembra",
  "sept.",
  "oktobris",
  "oktobrī",
  "oktobra",
  "okt.",
  "novembris",
  "novembrī",
  "novembra",
  "nov.",
  "decembris",
  "decembrī",
  "decembra",
  "dec.",
];

const LATVIAN_WEEKDAYS = [
  "pirmdiena",
  "pirmdienā",
  "pirmdienas",
  "pirmd.",
  "otrdiena",
  "otrdienā",
  "otrdienas",
  "otrd.",
  "trešdiena",
  "trešdienā",
  "trešdienas",
  "trešd.",
  "ceturtdiena",
  "ceturtdienā",
  "ceturtdienas",
  "ceturtd.",
  "piektdiena",
  "piektdienā",
  "piektdienas",
  "piektd.",
  "sestdiena",
  "sestdienā",
  "sestdienas",
  "sestd.",
  "svētdiena",
  "svētdienā",
  "svētdienas",
  "svētd.",
];

const LATVIAN_ABBREVIATIONS = [
  "u.c.",
  "utt.",
  "piem.",
  "sk.",
  "t.i.",
  "u.tml.",
  "nr.",
  "lpp.",
  "lv.",
  "eur.",
  "g.",
  "gs.",
  "st.",
  "k.",
  "dr.",
  "prof.",
  "mg.",
  "bc.",
  "inž.",
  "uzņ.",
  "sabiedr.",
  "a/s",
  "sia",
];

const GEOGRAPHIC_TERMS = [
  "iela",
  "ielā",
  "ielas",
  "prospekts",
  "prospektā",
  "pr.",
  "bulvāris",
  "bulvārī",
  "bulv.",
  "laukums",
  "laukumā",
  "lauk.",
  "rajons",
  "rajonā",
  "raj.",
  "stāvs",
  "stāvā",
  "st.",
  "māja",
  "mājā",
  "m.",
  "korpuss",
  "korpusā",
  "korp.",
];

function isDatePattern(text, dotIndex) {
  const beforeDot = text.substring(0, dotIndex).trim();
  const afterDot = text.substring(dotIndex + 1).trim();

  const numberMatch = beforeDot.match(/\b(\d{1,2})\s*$/);
  if (!numberMatch) return false;

  const number = parseInt(numberMatch[1]);
  if (number < 1 || number > 31) return false;

  const wordsAfter = afterDot.split(/\s+/);
  if (wordsAfter.length === 0) return false;

  const firstWordAfter = wordsAfter[0].toLowerCase().replace(/[.,!?]/g, "");

  return (
    LATVIAN_MONTHS.some(month => {
      const cleanMonth = month.toLowerCase().replace(".", "");
      return firstWordAfter.startsWith(cleanMonth) || cleanMonth.startsWith(firstWordAfter);
    }) ||
    LATVIAN_WEEKDAYS.some(day => {
      const cleanDay = day.toLowerCase().replace(".", "");
      return firstWordAfter.startsWith(cleanDay) || cleanDay.startsWith(firstWordAfter);
    })
  );
}

function isYearPattern(text, dotIndex) {
  const beforeDot = text.substring(0, dotIndex).trim();
  const afterDot = text.substring(dotIndex + 1).trim();

  const yearMatch = beforeDot.match(/\b(1[8-9]\d{2}|20\d{2}|21\d{2})\s*$/);
  if (!yearMatch) return false;

  const wordsAfter = afterDot.split(/\s+/);
  if (wordsAfter.length === 0) return false;

  const firstWordAfter = wordsAfter[0].toLowerCase();
  const yearWords = ["gads", "gadā", "gada", "g."];

  return yearWords.some(word => firstWordAfter.startsWith(word));
}

function isAbbreviation(text, dotIndex) {
  const beforeDot = text.substring(0, dotIndex + 1).toLowerCase();

  return LATVIAN_ABBREVIATIONS.some(abbr => {
    const pattern = abbr.toLowerCase();
    return beforeDot.endsWith(" " + pattern) || beforeDot.endsWith(pattern);
  });
}

function isAddressPattern(text, dotIndex) {
  const beforeDot = text.substring(0, dotIndex).trim();
  const afterDot = text.substring(dotIndex + 1).trim();

  const numberMatch = beforeDot.match(/\b(\d{1,3})\s*$/);
  if (!numberMatch) return false;

  const wordsAfter = afterDot.split(/\s+/);
  if (wordsAfter.length === 0) return false;

  const firstWordAfter = wordsAfter[0].toLowerCase();

  return GEOGRAPHIC_TERMS.some(
    term => firstWordAfter.startsWith(term) || term.startsWith(firstWordAfter)
  );
}

function isListItem(text, dotIndex) {
  const beforeDot = text.substring(0, dotIndex).trim();
  const listPattern = /^[\s]*([0-9]+|[a-zā-ž])\s*$/i;
  return listPattern.test(beforeDot);
}

function isTitle(text) {
  const trimmed = text.trim();
  if (trimmed.length === 0) return false;

  const hasNoPunctuation = !/[.!?]$/.test(trimmed);
  const isShort = trimmed.length < 60;
  const startsWithCapital = /^[A-ZĀČĒĢĪĶĻŅŠŪŽ]/.test(trimmed);
  const isAllCaps = trimmed === trimmed.toUpperCase() && trimmed.length > 2;
  const hasCapitalWords = (trimmed.match(/[A-ZĀČĒĢĪĶĻŅŠŪŽ]/g) || []).length > 1;

  return isAllCaps || (isShort && hasNoPunctuation && startsWithCapital && hasCapitalWords);
}

function processSentencesInLine(text) {
  const sentences = [];
  let currentSentence = "";
  let i = 0;

  while (i < text.length) {
    const char = text[i];
    currentSentence += char;

    if (char === "." || char === "!" || char === "?") {
      if (char === ".") {
        const dotIndex = i;

        if (
          isDatePattern(text, dotIndex) ||
          isYearPattern(text, dotIndex) ||
          isAbbreviation(text, dotIndex) ||
          isAddressPattern(text, dotIndex) ||
          isListItem(text, dotIndex)
        ) {
          i++;
          continue;
        }
      }

      const nextIndex = i + 1;
      if (nextIndex < text.length) {
        const restText = text.substring(nextIndex);
        const nextNonSpaceMatch = restText.match(/^\s*(.)/);

        if (nextNonSpaceMatch) {
          const nextChar = nextNonSpaceMatch[1];

          if (/[A-ZĀČĒĢĪĶĻŅŠŪŽ]/.test(nextChar)) {
            sentences.push(currentSentence.trim());
            currentSentence = "";
          }
        } else {
          sentences.push(currentSentence.trim());
          currentSentence = "";
        }
      } else {
        sentences.push(currentSentence.trim());
        currentSentence = "";
      }
    }

    i++;
  }

  if (currentSentence.trim().length > 0) {
    sentences.push(currentSentence.trim());
  }

  return sentences;
}

function splitIntoSentencesAdvanced(text) {
  if (!text || text.trim().length === 0) return [];

  const normalizedText = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const lines = normalizedText.split(/\n+/).filter(line => line.trim().length > 0);

  const allSentences = [];

  for (const line of lines) {
    const trimmedLine = line.trim();

    if (isTitle(trimmedLine)) {
      allSentences.push(trimmedLine);
    } else {
      const sentencesInLine = processSentencesInLine(trimmedLine);
      allSentences.push(...sentencesInLine);
    }
  }

  return allSentences.filter(s => s.length > 2);
}

// ============================================================================
// REACT КОМПОНЕНТ
// ============================================================================

const LatvianSentenceTester = () => {
  const [inputText, setInputText] = useState(`ZIŅAS
Šodien ir 5. augustā. Anna pamostas agri. Viņas mammai šodien ir dzimšanas diena.

Anna grib mammu pārsteigt ar dzimšanas dienas brokastīm. Mammai ļoti garšo pankūkas ar iebiežināto pienu. Tāpēc Anna nolemj uzcept gardas pankūkas.

Anna klusi dodas uz virtuvi. Viņa negrib pamodināt mammu. Anna sāk darbu pie pankūku cepšanas. Vispirms viņa apsien sev priekšautu.

Mans plāns:
1. Pamosties agri.
2. Padarīt mājas darbus.
3. Iet gulēt.

Dr. Bērziņš strādā u.c. darbus. Piem., viņš raksta grāmatas. Viņš dzīvo 3. stāvā.`);

  // Цвета для выделения предложений
  const colors = [
    "#FFE5E5", // светло-красный
    "#E5F3FF", // светло-синий
    "#E5FFE5", // светло-зеленый
    "#FFF0E5", // светло-оранжевый
    "#F0E5FF", // светло-фиолетовый
    "#FFFFE5", // светло-желтый
    "#E5FFFF", // светло-голубой
    "#FFE5F0", // светло-розовый
    "#F0FFE5", // светло-лайм
    "#FFE5FF", // светло-пурпурный
  ];

  // Вычисляем результат сегментации
  const segmentationResult = useMemo(() => {
    if (!inputText.trim()) return { sentences: [], visualizedText: "" };

    const sentences = splitIntoSentencesAdvanced(inputText);

    // Создаем визуализированный текст
    let visualizedText = inputText;
    let offset = 0;

    sentences.forEach((sentence, index) => {
      const color = colors[index % colors.length];
      const sentenceIndex = visualizedText.indexOf(sentence, offset);

      if (sentenceIndex !== -1) {
        const before = visualizedText.substring(0, sentenceIndex);
        const highlighted = `<span style="background-color: ${color}; padding: 2px 4px; border-radius: 3px; margin: 1px;">${sentence}</span>`;
        const after = visualizedText.substring(sentenceIndex + sentence.length);

        visualizedText = before + highlighted + after;
        offset = sentenceIndex + highlighted.length;
      }
    });

    return { sentences, visualizedText };
  }, [inputText]);

  // Предустановленные тесты
  const testCases = [
    {
      name: "🎯 Основной тест",
      text: `ZIŅAS
Šodien ir 5. augustā. Anna pamostas agri. Viņas mammai šodien ir dzimšanas diena.`,
    },
    {
      name: "📅 Даты",
      text: "Tikšanās notiks 15. janvārī. Anna būs tur. Mēs sāksim 10. februārī.",
    },
    {
      name: "📝 Сокращения",
      text: "Dr. Bērziņš strādā u.c. darbus. Piem., viņš raksta grāmatas.",
    },
    {
      name: "🏢 Адреса",
      text: "Es dzīvoju 3. stāvā. Mans draugs dzīvo Brīvības ielā 25. māja.",
    },
    {
      name: "🔢 Списки",
      text: `Mans plāns:
1. Pamosties agri.
2. Padarīt mājas darbus.
3. Iet gulēt.`,
    },
    {
      name: "📰 Заголовки",
      text: `SVARĪGI PAZIŅOJUMI
Šodien notiks svarīgs pasākums.

Manas vasaras atmiņas
Es atceros tos brīnišķīgos mirkļus.`,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Заголовок */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🇱🇻 Тестер умной сегментации латышских предложений
          </h1>
          <p className="text-gray-600 text-lg">
            Вставьте латышский текст и посмотрите, как алгоритм разбивает его на предложения
          </p>
        </div>

        {/* Быстрые тесты */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 text-gray-700">🧪 Готовые тесты:</h3>
          <div className="flex flex-wrap gap-2">
            {testCases.map((testCase, index) => (
              <button
                key={index}
                onClick={() => setInputText(testCase.text)}
                className="px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                {testCase.name}
              </button>
            ))}
          </div>
        </div>

        {/* Основной интерфейс */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Левая панель - ввод */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
              📝 Исходный текст
            </h2>

            <textarea
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              placeholder="Вставьте латышский текст здесь..."
              className="w-full h-96 p-4 border border-gray-300 rounded-lg font-mono text-sm leading-relaxed resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />

            <div className="mt-4 text-sm text-gray-500">
              Символов: {inputText.length} | Строк: {inputText.split("\n").length}
            </div>
          </div>

          {/* Правая панель - результат */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
              🎨 Результат сегментации
              <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                {segmentationResult.sentences.length} предложений
              </span>
            </h2>

            <div
              className="w-full h-96 p-4 border border-gray-300 rounded-lg font-mono text-sm leading-relaxed overflow-y-auto bg-gray-50"
              dangerouslySetInnerHTML={{ __html: segmentationResult.visualizedText }}
            />

            <div className="mt-4 text-sm text-gray-500">
              💡 Каждое предложение выделено своим цветом
            </div>
          </div>
        </div>

        {/* Статистика */}
        <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">📊 Детальная информация</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {segmentationResult.sentences.length}
              </div>
              <div className="text-sm text-blue-800">Всего предложений</div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {segmentationResult.sentences.filter(s => isTitle(s)).length}
              </div>
              <div className="text-sm text-green-800">Заголовков</div>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {Math.round(
                  segmentationResult.sentences.reduce((sum, s) => sum + s.length, 0) /
                    Math.max(segmentationResult.sentences.length, 1)
                )}
              </div>
              <div className="text-sm text-purple-800">Средняя длина</div>
            </div>
          </div>

          {/* Список предложений */}
          <div className="space-y-2">
            <h4 className="font-medium text-gray-700">Найденные предложения:</h4>
            <div className="max-h-48 overflow-y-auto">
              {segmentationResult.sentences.map((sentence, index) => (
                <div key={index} className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded">
                  <span
                    className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium text-white"
                    style={{ backgroundColor: colors[index % colors.length].replace("E5", "80") }}
                  >
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    <span className="text-sm text-gray-600">
                      {isTitle(sentence) ? "📰 " : "📝 "}
                      {sentence}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Инструкция */}
        <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
          <h3 className="text-lg font-semibold mb-3 text-blue-800">ℹ️ Как пользоваться</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
            <div>
              <p className="mb-2">
                <strong>1. Вставьте латышский текст</strong> в левое окно
              </p>
              <p className="mb-2">
                <strong>2. Посмотрите результат</strong> в правом окне
              </p>
              <p>
                <strong>3. Используйте готовые тесты</strong> для проверки разных случаев
              </p>
            </div>
            <div>
              <p className="mb-2">
                ✅ <strong>Распознает:</strong> даты, сокращения, списки, заголовки
              </p>
              <p className="mb-2">
                🎨 <strong>Цвета:</strong> каждое предложение имеет свой цвет
              </p>
              <p>
                📊 <strong>Статистика:</strong> количество и типы найденных предложений
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LatvianSentenceTester;

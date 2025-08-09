import React, { useState, useMemo } from "react";
import { splitIntoSentencesAdvanced } from "./utils/latvianSegmentation";

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

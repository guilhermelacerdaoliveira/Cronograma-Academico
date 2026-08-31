# Cronograma Academico V2

Projeto feito em React Native para organizar horários de aula.

O sistema permite criar diferentes horários, adicionar matérias para cada dia da semana e visualizar a grade completa com os horários calculados automaticamente.

## Funções

* Criar mais de um horário
* Definir horário de início das aulas
* Configurar duração das aulas e intervalo
* Adicionar matérias em cada dia da semana
* Adicionar aulas extras
* Salvar tudo no navegador
* Exportar e importar arquivos JSON

## Tecnologias usadas

* React Native
* AsyncStorage

## Como executar

cd Cronograma-Academico
cd horarioV2
cd cronogramacademico
npm install
npx expo install @react-native-async-storage/async-storage
npx expo install expo-file-system
npx expo install expo-document-picker
npx expo install expo-sharing

npx expo start --tunnel

## Organização

App.js
src/
│ Theme.js
├── screens/
│   ├── Home.js
│   ├── Editor.js
│   └── ScheduleView.js
│
├── components/
│   ├── home/
│   │   ├── CreateProfileCard.js
│   │   └── WeekOverview.js
│   │
│   ├── editor/
│   │   ├── Preview.js
│   │   ├── DiaEditor.js
│   │   ├── AulaInput.js
│   │   └── AbaExtras.js
│   │
│   └── schedule/
│       ├── AulaSlot.js
│       ├── AulaExtraSlot.js
│       └── IntervaloSlot.js
│
└── utils/
    ├── Storage.js
    └── FileUtils.js


## Observações

O projeto ainda está em uma versão desatualizada e com bugs, algumas funcionalidades podem não estar funcionando corretamente

## funcionalidades futuras

* criação de uma função professor
* adicionar horários de sábado e domingo
* adicionar possibilidade de notificação
* versão online que funciona offline
* funções extras (carga horária, férias, mudança especifica)

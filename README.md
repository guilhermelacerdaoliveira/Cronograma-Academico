# 📅 Horário Escolar

Aplicação web para organização de horários escolares. Roda direto no navegador, sem login, sem servidor, sem internet.

## Funcionalidades

- Criação de múltiplos perfis de horário (ex: Escola Manhã, Cursinho Tarde)
- Configuração de horário de início, duração de aula e intervalo por perfil
- Grade semanal com horários calculados automaticamente
- Aulas extras com data, horário e opção de repetição semanal
- Dados salvos localmente no navegador via `localStorage`
- Exportação e importação de horários em `.json`

## Tecnologias

- [React](https://react.dev/) — interface e componentes
- [Vite](https://vitejs.dev/) — ambiente de desenvolvimento
- `localStorage` — armazenamento local dos dados

## Como rodar

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/horario-escolar.git
cd horario-escolar

# Instale as dependências
npm install

# Rode o servidor de desenvolvimento
npm run dev
```

Acesse `http://localhost:5173` no navegador.

## Estrutura do projeto

```
src/
├── App.jsx               # Controla a navegação entre telas
├── main.jsx              # Ponto de entrada
├── index.css             # Estilos globais
├── components/
│   ├── Home.jsx          # Tela inicial com listagem de perfis
│   ├── ScheduleView.jsx  # Visualização da grade semanal
│   └── Editor.jsx        # Edição de aulas, configurações e extras
└── utils/
    ├── storage.js        # localStorage e cálculo de horários
    └── fileUtils.js      # Importação e exportação de arquivos
```

## Como usar

1. Acesse o site e crie um novo horário com um nome (ex: "Escola Manhã")
2. Na aba **Configurações**, defina o horário de início, duração das aulas e do intervalo
3. Na aba **Aulas**, adicione as matérias de cada dia da semana
4. Na aba **Extras**, cadastre aulas fora do horário normal, como recuperações
5. Volte para a grade e visualize tudo organizado com os horários calculados
6. Use o botão **Exportar** para salvar o arquivo e compartilhar com outros

## Possíveis melhorias futuras

- [ ] Notificações de início de aula
- [ ] Formato de texto simples para importação/exportação (sem JSON)
- [ ] Versão mobile (PWA)
- [ ] Sincronização online opcional
- [ ] Integração com calendário do dispositivo

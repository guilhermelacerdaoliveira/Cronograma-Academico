import AsyncStorage from '@react-native-async-storage/async-storage'

const KEY_PERFIS = 'horario-escolar-perfis'
const KEY_ATIVO = 'horario-escolar-ativo'

export const DIAS = ['segunda', 'terca', 'quarta', 'quinta', 'sexta']
export const DIAS_LABELS = {
  segunda: 'Segunda',
  terca: 'Terça',
  quarta: 'Quarta',
  quinta: 'Quinta',
  sexta: 'Sexta',
}

export function criarPerfilVazio(nome = 'Meu Horário') {
  return {
    id: Math.random().toString(36).slice(2) + Date.now().toString(36),
    nome,
    config: {
      inicio: '07:30',
      duracaoAula: 50,
      duracaoIntervalo: 15,
      aulaIntervaloApos: 2,
    },
    horario: { segunda: [], terca: [], quarta: [], quinta: [], sexta: [] },
    aulasExtras: [],
  }
}

// AsyncStorage é assíncrono — sempre use await
export async function carregarPerfis() {
  try {
    const raw = await AsyncStorage.getItem(KEY_PERFIS)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export async function salvarPerfis(perfis) {
  await AsyncStorage.setItem(KEY_PERFIS, JSON.stringify(perfis))
}

export async function carregarIdAtivo() {
  return await AsyncStorage.getItem(KEY_ATIVO)
}

export async function salvarIdAtivo(id) {
  if (id) {
    await AsyncStorage.setItem(KEY_ATIVO, id)
  } else {
    await AsyncStorage.removeItem(KEY_ATIVO)
  }
}

// Cálculos de horário — igual ao web, sem mudanças
export function calcularHorarioAula(config, indexAula) {
  const { inicio, duracaoAula, duracaoIntervalo, aulaIntervaloApos } = config
  const [h, m] = inicio.split(':').map(Number)
  let total = h * 60 + m
  for (let i = 0; i < indexAula; i++) {
    total += duracaoAula
    if ((i + 1) % aulaIntervaloApos === 0) total += duracaoIntervalo
  }
  return minutosParaHora(total)
}

export function calcularFimAula(config, indexAula) {
  const inicio = calcularHorarioAula(config, indexAula)
  const [h, m] = inicio.split(':').map(Number)
  return minutosParaHora(h * 60 + m + config.duracaoAula)
}

function minutosParaHora(min) {
  const h = Math.floor(min / 60) % 24
  const m = min % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

export function diaDaSemana(dataISO) {
  const [y, mo, d] = dataISO.split('-').map(Number)
  const map = ['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado']
  return map[new Date(y, mo - 1, d).getDay()]
}

export function formatarData(dataISO) {
  const [y, mo, d] = dataISO.split('-')
  return `${d}/${mo}/${y}`
}
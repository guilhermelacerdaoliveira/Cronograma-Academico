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
    id: crypto.randomUUID(),
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

export function carregarPerfis() {
  try {
    const raw = localStorage.getItem(KEY_PERFIS)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

export function salvarPerfis(perfis) {
  localStorage.setItem(KEY_PERFIS, JSON.stringify(perfis))
}

export function carregarIdAtivo() {
  return localStorage.getItem(KEY_ATIVO) || null
}

export function salvarIdAtivo(id) {
  localStorage.setItem(KEY_ATIVO, id)
}

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
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`
}

export function diaDaSemana(dataISO) {
  const [y, mo, d] = dataISO.split('-').map(Number)
  const map = ['domingo','segunda','terca','quarta','quinta','sexta','sabado']
  return map[new Date(y, mo - 1, d).getDay()]
}

export function formatarData(dataISO) {
  const [y, mo, d] = dataISO.split('-')
  return `${d}/${mo}/${y}`
}

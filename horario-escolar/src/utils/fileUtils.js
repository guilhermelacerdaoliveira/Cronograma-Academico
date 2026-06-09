// Converte o perfil pra formato de texto simples
export function exportarPerfil(perfil) {
  const linhas = []

  linhas.push(`[${perfil.nome}]`)
  linhas.push(`inicio: ${perfil.config.inicio}`)
  linhas.push(`duracao: ${perfil.config.duracaoAula}`)
  linhas.push(`intervalo: ${perfil.config.duracaoIntervalo}`)
  linhas.push(`apos: ${perfil.config.aulaIntervaloApos}`)
  linhas.push('')

  const DIAS = ['segunda', 'terca', 'quarta', 'quinta', 'sexta']
  for (const dia of DIAS) {
    const aulas = perfil.horario[dia] || []
    if (aulas.length > 0) {
      linhas.push(`${dia}: ${aulas.join(', ')}`)
    }
  }

  for (const extra of perfil.aulasExtras || []) {
    const rep = extra.repetirSemanal ? ' | semanal' : ''
    linhas.push(`EXTRA: ${extra.nome} | ${extra.data} | ${extra.horario}${rep}`)
  }

  const texto = linhas.join('\n')
  const blob = new Blob([texto], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `horario-${perfil.nome.toLowerCase().replace(/\s+/g, '-')}.txt`
  a.click()
  URL.revokeObjectURL(url)
}

// Lê o arquivo de texto e reconstrói o perfil
export function importarPerfil(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const texto = e.target.result
        const perfil = parsearTexto(texto)
        resolve(perfil)
      } catch (err) {
        reject(new Error('Arquivo inválido: ' + err.message))
      }
    }

    reader.onerror = () => reject(new Error('Erro ao ler o arquivo.'))
    reader.readAsText(file)
  })
}

function parsearTexto(texto) {
  const DIAS = ['segunda', 'terca', 'quarta', 'quinta', 'sexta']

  const perfil = {
    id: crypto.randomUUID(),
    nome: 'Horário Importado',
    config: {
      inicio: '07:30',
      duracaoAula: 50,
      duracaoIntervalo: 15,
      aulaIntervaloApos: 2,
    },
    horario: { segunda: [], terca: [], quarta: [], quinta: [], sexta: [] },
    aulasExtras: [],
  }

  const linhas = texto.split('\n').map(l => l.trim()).filter(l => l.length > 0)

  for (const linha of linhas) {
    // Nome do perfil: [Nome Aqui]
    if (linha.startsWith('[') && linha.endsWith(']')) {
      perfil.nome = linha.slice(1, -1).trim()
      continue
    }

    // Aula extra: EXTRA: nome | data | horario | semanal?
    if (linha.startsWith('EXTRA:')) {
      const partes = linha.slice(6).split('|').map(p => p.trim())
      if (partes.length < 3) throw new Error(`Linha EXTRA inválida: "${linha}"`)
      perfil.aulasExtras.push({
        id: crypto.randomUUID(),
        nome: partes[0],
        data: partes[1],
        horario: partes[2],
        repetirSemanal: partes[3] === 'semanal',
      })
      continue
    }

    // Configurações: chave: valor
    if (linha.startsWith('inicio:')) {
      perfil.config.inicio = linha.split(':').slice(1).join(':').trim()
      continue
    }
    if (linha.startsWith('duracao:')) {
      perfil.config.duracaoAula = Number(linha.split(':')[1].trim())
      continue
    }
    if (linha.startsWith('intervalo:')) {
      perfil.config.duracaoIntervalo = Number(linha.split(':')[1].trim())
      continue
    }
    if (linha.startsWith('apos:')) {
      perfil.config.aulaIntervaloApos = Number(linha.split(':')[1].trim())
      continue
    }

    // Dias: segunda: Matemática, Português
    const diaEncontrado = DIAS.find(d => linha.startsWith(d + ':'))
    if (diaEncontrado) {
      const conteudo = linha.slice(diaEncontrado.length + 1).trim()
      perfil.horario[diaEncontrado] = conteudo
        .split(',')
        .map(a => a.trim())
        .filter(a => a.length > 0)
      continue
    }
  }

  return perfil
}
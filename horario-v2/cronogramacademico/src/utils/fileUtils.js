export function exportarPerfil(perfil) {
  const json = JSON.stringify(perfil, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `horario-${perfil.nome.toLowerCase().replace(/\s+/g, '-')}.json`
  a.click()
  URL.revokeObjectURL(url)
}

export function importarPerfil(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const dados = JSON.parse(e.target.result)
        if (!dados.horario || !dados.config) throw new Error('Formato inválido')
        // Garante que tem id novo pra não conflitar
        dados.id = crypto.randomUUID()
        resolve(dados)
      } catch {
        reject(new Error('Arquivo inválido. Use um arquivo exportado pelo sistema.'))
      }
    }
    reader.onerror = () => reject(new Error('Erro ao ler o arquivo.'))
    reader.readAsText(file)
  })
}

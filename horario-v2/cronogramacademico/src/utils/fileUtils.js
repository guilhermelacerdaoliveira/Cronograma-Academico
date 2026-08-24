import * as FileSystem from 'expo-file-system'
import * as DocumentPicker from 'expo-document-picker'
import * as Sharing from 'expo-sharing'

// Exporta o perfil como arquivo .json e abre o menu de compartilhamento nativo
export async function exportarPerfil(perfil) {
  const json = JSON.stringify(perfil, null, 2)
  const nomeArquivo = `horario-${perfil.nome.toLowerCase().replace(/\s+/g, '-')}.json`
  const path = FileSystem.cacheDirectory + nomeArquivo

  await FileSystem.writeAsStringAsync(path, json, {
    encoding: FileSystem.EncodingType.UTF8,
  })

  // Abre o compartilhamento nativo do iOS/Android
  const disponivel = await Sharing.isAvailableAsync()
  if (disponivel) {
    await Sharing.shareAsync(path, {
      mimeType: 'application/json',
      dialogTitle: 'Compartilhar horário',
    })
  } else {
    throw new Error('Compartilhamento não disponível neste dispositivo.')
  }
}

// Abre o seletor de arquivos nativo e retorna o perfil parseado
export async function importarPerfil() {
  const resultado = await DocumentPicker.getDocumentAsync({
    type: 'application/json',
    copyToCacheDirectory: true,
  })

  // Usuário cancelou
  if (resultado.canceled) return null

  const arquivo = resultado.assets[0]
  const conteudo = await FileSystem.readAsStringAsync(arquivo.uri, {
    encoding: FileSystem.EncodingType.UTF8,
  })

  try {
    const dados = JSON.parse(conteudo)
    if (!dados.horario || !dados.config) {
      throw new Error('Formato inválido')
    }
    // Gera um id novo pra não conflitar com perfis existentes
    dados.id = Math.random().toString(36).slice(2) + Date.now().toString(36)
    return dados
  } catch {
    throw new Error('Arquivo inválido. Use um arquivo exportado pelo sistema.')
  }
}
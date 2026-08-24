import React, { useState, useEffect } from 'react'
import { View, StyleSheet, SafeAreaView, Alert } from 'react-native'
import { carregarPerfis, salvarPerfis, carregarIdAtivo, salvarIdAtivo } from './src/utils/Storage'
import { importarPerfil } from './src/utils/FileUtils'
import Home from './src/screens/Home'
import ScheduleView from './src/screens/ScheduleView'
import Editor from './src/screens/Editor'
import { colors } from './src/Theme'

export default function App() {
  const [perfis, setPerfis] = useState([])
  const [idAtivo, setIdAtivo] = useState(null)
  const [tela, setTela] = useState('home')
  const [carregou, setCarregou] = useState(false)

  // Carrega dados do AsyncStorage na inicialização
  useEffect(() => {
    async function init() {
      const ps = await carregarPerfis()
      const id = await carregarIdAtivo()
      setPerfis(ps)
      setIdAtivo(id)
      setCarregou(true)
    }
    init()
  }, [])

  if (!carregou) return null

  const perfilAtivo = perfis.find(p => p.id === idAtivo) || null

  async function abrirPerfil(id) {
    await salvarIdAtivo(id)
    setIdAtivo(id)
    setTela('view')
  }

  async function criarPerfil(novoPerfil) {
    const novos = [...perfis, novoPerfil]
    await salvarPerfis(novos)
    setPerfis(novos)
    abrirPerfil(novoPerfil.id)
  }

  async function deletarPerfil(id) {
    Alert.alert(
      'Deletar horário',
      'Tem certeza? Essa ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Deletar',
          style: 'destructive',
          onPress: async () => {
            const novos = perfis.filter(p => p.id !== id)
            await salvarPerfis(novos)
            setPerfis(novos)
            if (idAtivo === id) {
              await salvarIdAtivo(null)
              setIdAtivo(null)
              setTela('home')
            }
          },
        },
      ]
    )
  }

  async function handleImportar() {
    try {
      const perfil = await importarPerfil()
      if (!perfil) return // usuário cancelou
      const novos = [...perfis, perfil]
      await salvarPerfis(novos)
      setPerfis(novos)
      abrirPerfil(perfil.id)
    } catch (err) {
      Alert.alert('Erro ao importar', err.message)
    }
  }

  async function salvarEdicao(perfilEditado) {
    const novos = perfis.map(p => p.id === perfilEditado.id ? perfilEditado : p)
    await salvarPerfis(novos)
    setPerfis(novos)
    setTela('view')
  }

  async function irHome() {
    await salvarIdAtivo(null)
    setIdAtivo(null)
    setTela('home')
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {tela === 'home' && (
          <Home
            perfis={perfis}
            onAbrirPerfil={abrirPerfil}
            onCriarPerfil={criarPerfil}
            onDeletarPerfil={deletarPerfil}
            onImportar={handleImportar}
          />
        )}
        {tela === 'view' && perfilAtivo && (
          <ScheduleView
            perfil={perfilAtivo}
            onEditar={() => setTela('editor')}
            onVoltar={irHome}
          />
        )}
        {tela === 'editor' && perfilAtivo && (
          <Editor
            perfil={perfilAtivo}
            onSalvar={salvarEdicao}
            onCancelar={() => setTela('view')}
          />
        )}
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  container: {
    flex: 1,
  },
})
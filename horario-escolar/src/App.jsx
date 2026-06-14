import React, { useState, useRef } from 'react'
import Home from './components/Home'
import ScheduleView from './components/ScheduleView'
import Editor from './components/Editor'
import Sidebar from './components/Sidebar'
import { importarPerfil } from './utils/fileUtils'
import {
  carregarPerfis, salvarPerfis,
  carregarIdAtivo, salvarIdAtivo,
} from './utils/storage'

export default function App() {
  const [perfis, setPerfis] = useState(() => carregarPerfis())
  const [idAtivo, setIdAtivo] = useState(() => carregarIdAtivo())
  const [tela, setTela] = useState('home')
  const inputRef = useRef()

  const perfilAtivo = perfis.find(p => p.id === idAtivo) || null

  // ID usado para marcar item ativo na sidebar
  const telaAtiva = tela === 'home' ? 'home' : idAtivo

  function abrirPerfil(id) {
    salvarIdAtivo(id)
    setIdAtivo(id)
    setTela('view')
  }

  function criarPerfil(novoPerfil) {
    const novos = [...perfis, novoPerfil]
    salvarPerfis(novos)
    setPerfis(novos)
    abrirPerfil(novoPerfil.id)
  }

  function deletarPerfil(id) {
    const novos = perfis.filter(p => p.id !== id)
    salvarPerfis(novos)
    setPerfis(novos)
    if (idAtivo === id) {
      setIdAtivo(null)
      salvarIdAtivo(null)
      setTela('home')
    }
  }

  async function handleImportar() {
    inputRef.current.click()
  }

  async function handleImportarArquivo(e) {
    const file = e.target.files[0]
    if (!file) return
    try {
      const perfil = await importarPerfil(file)
      const novos = [...perfis, perfil]
      salvarPerfis(novos)
      setPerfis(novos)
      abrirPerfil(perfil.id)
    } catch (err) {
      alert(err.message)
    }
    e.target.value = ''
  }

  function salvarEdicao(perfilEditado) {
    const novos = perfis.map(p => p.id === perfilEditado.id ? perfilEditado : p)
    salvarPerfis(novos)
    setPerfis(novos)
    setTela('view')
  }

  function irHome() {
    setIdAtivo(null)
    salvarIdAtivo(null)
    setTela('home')
  }

  return (
    <div style={{ display: 'flex' }}>
      {/* Sidebar global — aparece em todas as telas */}
      <Sidebar
        perfis={perfis}
        telaAtual={telaAtiva}
        onIrHome={irHome}
        onAbrirPerfil={abrirPerfil}
        onDeletarPerfil={deletarPerfil}
        onImportar={handleImportar}
      />

      {/* Conteúdo principal */}
      <div style={{ marginLeft: 'var(--sidebar-width)', flex: 1, minHeight: '100vh' }}>
        {tela === 'home' && (
          <Home
            perfis={perfis}
            onAbrirPerfil={abrirPerfil}
            onCriarPerfil={criarPerfil}
            onDeletarPerfil={deletarPerfil}
            onImportarPerfil={(perfil) => {
              const novos = [...perfis, perfil]
              salvarPerfis(novos)
              setPerfis(novos)
              abrirPerfil(perfil.id)
            }}
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
      </div>

      <input
        ref={inputRef}
        type="file"
        accept=".json"
        style={{ display: 'none' }}
        onChange={handleImportarArquivo}
      />
    </div>
  )
}
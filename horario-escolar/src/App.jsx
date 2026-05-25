import React, { useState } from 'react'
import Home from './components/Home'
import ScheduleView from './components/ScheduleView'
import Editor from './components/Editor'
import {
  carregarPerfis, salvarPerfis,
  carregarIdAtivo, salvarIdAtivo,
} from './utils/storage'

export default function App() {
  const [perfis, setPerfis] = useState(() => carregarPerfis())
  const [idAtivo, setIdAtivo] = useState(() => carregarIdAtivo())
  const [tela, setTela] = useState(() => {
    // Se tem perfis salvos, vai direto pra home com lista; senão home vazia
    return 'home'
  })

  const perfilAtivo = perfis.find(p => p.id === idAtivo) || null

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
    }
  }

  function importarPerfil(perfil) {
    const novos = [...perfis, perfil]
    salvarPerfis(novos)
    setPerfis(novos)
    abrirPerfil(perfil.id)
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
    <>
      {tela === 'home' && (
        <Home
          perfis={perfis}
          onAbrirPerfil={abrirPerfil}
          onCriarPerfil={criarPerfil}
          onDeletarPerfil={deletarPerfil}
          onImportarPerfil={importarPerfil}
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
    </>
  )
}

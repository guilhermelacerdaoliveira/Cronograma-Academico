import React, { useState, useRef } from 'react'
import { criarPerfilVazio } from '../utils/storage'
import { importarPerfil } from '../utils/fileUtils'
import './Home.css'

export default function Home({ perfis, onAbrirPerfil, onCriarPerfil, onDeletarPerfil, onImportarPerfil }) {
  const [criando, setCriando] = useState(false)
  const [nomePerfil, setNomePerfil] = useState('')
  const inputRef = useRef()

  function handleCriar() {
    const nome = nomePerfil.trim() || 'Meu Horário'
    onCriarPerfil(criarPerfilVazio(nome))
    setNomePerfil('')
    setCriando(false)
  }

  async function handleImportar(e) {
    const file = e.target.files[0]
    if (!file) return
    try {
      const perfil = await importarPerfil(file)
      onImportarPerfil(perfil)
    } catch (err) {
      alert(err.message)
    }
    e.target.value = ''
  }

  return (
    <div className="home fade-in">
      <div className="home-wrap">
        <div className="home-top">
          <div className="home-icon">📅</div>
          <h1 className="home-title">Horário Escolar</h1>
          <p className="home-sub">Seus horários, organizados. Sem login.</p>
        </div>

        {perfis.length > 0 && (
          <section className="home-section">
            <h2 className="home-section-title">Horários salvos</h2>
            <div className="perfis-list">
              {perfis.map((p) => (
                <div key={p.id} className="perfil-card">
                  <button className="perfil-card-main" onClick={() => onAbrirPerfil(p.id)}>
                    <span className="perfil-card-nome">{p.nome}</span>
                    <span className="perfil-card-meta">
                      {Object.values(p.horario).reduce((a, d) => a + d.length, 0)} aulas
                      {p.aulasExtras?.length > 0 && ` · ${p.aulasExtras.length} extra${p.aulasExtras.length > 1 ? 's' : ''}`}
                    </span>
                  </button>
                  <button className="perfil-card-del btn-danger" onClick={() => {
                    if (confirm(`Deletar "${p.nome}"?`)) onDeletarPerfil(p.id)
                  }}>✕</button>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="home-section">
          <h2 className="home-section-title">Novo horário</h2>
          {criando ? (
            <div className="home-novo-form">
              <input
                className="field-input"
                placeholder="Nome (ex: Escola Manhã, Cursinho...)"
                value={nomePerfil}
                onChange={(e) => setNomePerfil(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCriar()}
                autoFocus
              />
              <div className="home-novo-btns">
                <button className="btn-primary" onClick={handleCriar}>Criar</button>
                <button className="btn-secondary" onClick={() => setCriando(false)}>Cancelar</button>
              </div>
            </div>
          ) : (
            <button className="btn-primary home-btn-novo" onClick={() => setCriando(true)}>
              + Criar novo horário
            </button>
          )}
        </section>

        <section className="home-section">
          <button className="btn-secondary home-btn-import" onClick={() => inputRef.current.click()}>
            📂 Importar arquivo .json
          </button>
          <input ref={inputRef} type="file" accept=".json" style={{ display: 'none' }} onChange={handleImportar} />
        </section>

        <p className="home-footer">Dados salvos só no seu navegador · Funciona offline</p>
      </div>
    </div>
  )
}

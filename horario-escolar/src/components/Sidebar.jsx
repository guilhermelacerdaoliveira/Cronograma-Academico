import React from 'react'
import './Sidebar.css'

export default function Sidebar({ perfis, telaAtual, onIrHome, onAbrirPerfil, onDeletarPerfil, onImportar }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span className="sidebar-brand-name">Meu Horário</span>
        <span className="sidebar-brand-sub">Escolar</span>
      </div>

      <nav className="sidebar-nav">
        <span className="sidebar-nav-label">Início</span>

        <button
          className={`sidebar-nav-item ${telaAtual === 'home' ? 'active' : ''}`}
          onClick={onIrHome}
        >
          <span className="nav-icon">🏠</span>
          <span className="nav-label">Início</span>
        </button>

        {perfis.length > 0 && (
          <>
            <span className="sidebar-nav-label" style={{ marginTop: 16 }}>Horários</span>
            {perfis.map((p) => (
              <button
                key={p.id}
                className={`sidebar-nav-item ${telaAtual === p.id ? 'active' : ''}`}
                onClick={() => onAbrirPerfil(p.id)}
              >
                <span className="nav-icon">📋</span>
                <span className="nav-label">{p.nome}</span>
                <button
                  className="nav-del"
                  onClick={(e) => {
                    e.stopPropagation()
                    if (confirm(`Deletar "${p.nome}"?`)) onDeletarPerfil(p.id)
                  }}
                  title="Deletar"
                >✕</button>
              </button>
            ))}
          </>
        )}

        <span className="sidebar-nav-label" style={{ marginTop: 16 }}>Ações</span>
        <button className="sidebar-nav-item" onClick={onIrHome}>
          <span className="nav-icon">➕</span>
          <span className="nav-label">Novo horário</span>
        </button>
        <button className="sidebar-nav-item" onClick={onImportar}>
          <span className="nav-icon">📂</span>
          <span className="nav-label">Importar .json</span>
        </button>
      </nav>

      <div className="sidebar-version">Versão 1.0.0</div>
    </aside>
  )
}
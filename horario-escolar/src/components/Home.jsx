import React, { useState } from 'react'
import { criarPerfilVazio } from '../utils/storage'
import './Home.css'

export default function Home({ perfis, onAbrirPerfil, onCriarPerfil, onDeletarPerfil, onImportarPerfil }) {
  const [criando, setCriando] = useState(false)
  const [nomePerfil, setNomePerfil] = useState('')

  function handleCriar() {
    const nome = nomePerfil.trim() || 'Meu Horário'
    onCriarPerfil(criarPerfilVazio(nome))
    setNomePerfil('')
    setCriando(false)
  }

  const hoje = new Date()
  const dataFormatada = hoje.toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="home-dashboard fade-in">
      <div className="dashboard-header">
        <h1 className="dashboard-greeting">Olá, estudante! 👋</h1>
        <p className="dashboard-date">{dataFormatada}</p>
      </div>

      <div className="dashboard-row">
        <div className="dash-card">
          <div className="dash-card-label">
            <span className="label-icon">⏰</span>
            Próxima aula
          </div>
          <div className="dash-card-title">
            {perfis.length === 0 ? 'Nenhum horário criado' : 'Sem aulas programadas'}
          </div>
          <div className="dash-card-sub">
            {perfis.length === 0
              ? 'Crie um horário para começar!'
              : 'Aproveite para descansar ou estudar!'}
          </div>
        </div>

        <div className="dash-card">
          <div className="dash-card-label">Aulas de hoje</div>
          <div className="dash-card-sub">
            {perfis.length === 0 ? 'Nenhum horário criado' : 'Nenhuma aula hoje'}
          </div>
        </div>
      </div>

      {perfis.length > 0 && (
        <div className="dashboard-row">
          <div className="dash-card">
            <div className="dash-card-label">Visão da Semana</div>
            <div className="week-row">
              {['Seg', 'Ter', 'Qua', 'Qui', 'Sex'].map((d, i) => {
                const dias = ['segunda', 'terca', 'quarta', 'quinta', 'sexta']
                const total = perfis.reduce((acc, p) => acc + (p.horario[dias[i]]?.length || 0), 0)
                return (
                  <div key={d} className="week-day-pill">
                    <span className="pill-label">{d}</span>
                    <span className="pill-count">{total}</span>
                    <span className="pill-sub">aulas</span>
                  </div>
                )
              })}
            </div>
            {perfis[0] && (
              <button className="week-btn-full" onClick={() => onAbrirPerfil(perfis[0].id)}>
                Ver horário completo →
              </button>
            )}
          </div>

          <div className="dash-card">
            <div className="dash-card-label">Novo horário</div>
            {criando ? (
              <div className="home-novo-form">
                <input
                  className="field-input"
                  placeholder="Nome (ex: Cursinho Tarde)"
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
          </div>
        </div>
      )}

      {perfis.length === 0 && (
        <div className="dash-card">
          <div className="dash-card-label">Começar agora</div>
          {criando ? (
            <div className="home-novo-form">
              <input
                className="field-input"
                placeholder="Nome do horário (ex: Escola Manhã)"
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
        </div>
      )}

      <p className="home-footer">Dados salvos só no seu navegador · Funciona offline</p>
    </div>
  )
}
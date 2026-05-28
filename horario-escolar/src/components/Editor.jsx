import React, { useState } from 'react'
import { DIAS, DIAS_LABELS, calcularHorarioAula, calcularFimAula } from '../utils/storage'
import './Editor.css'

const ABAS = ['config', 'horario', 'extras']
const ABA_LABELS = { config: '⚙️ Configurações', horario: '📋 Aulas', extras: '📌 Aulas Extras' }

export default function Editor({ perfil, onSalvar, onCancelar }) {
  const [aba, setAba] = useState('config')
  const [draft, setDraft] = useState(() => JSON.parse(JSON.stringify(perfil)))

  function setConfig(campo, valor) {
    setDraft(p => ({ ...p, config: { ...p.config, [campo]: valor } }))
  }

  function setNome(v) {
    setDraft(p => ({ ...p, nome: v }))
  }

  function setAulas(dia, aulas) {
    setDraft(p => ({ ...p, horario: { ...p.horario, [dia]: aulas } }))
  }

  function setExtras(extras) {
    setDraft(p => ({ ...p, aulasExtras: extras }))
  }

  return (
    <div className="editor fade-in">
      <header className="editor-header">
        <div className="editor-header-left">
          <button className="btn-ghost" onClick={onCancelar}>← Cancelar</button>
          <input
            className="editor-nome-input"
            value={draft.nome}
            onChange={e => setNome(e.target.value)}
          />
        </div>
        <button className="btn-primary" onClick={() => onSalvar(draft)}>✓ Salvar</button>
      </header>

      <div className="editor-abas">
        {ABAS.map(a => (
          <button
            key={a}
            className={`editor-aba ${aba === a ? 'editor-aba--ativa' : ''}`}
            onClick={() => setAba(a)}
          >
            {ABA_LABELS[a]}
          </button>
        ))}
      </div>

      <div className="editor-body">
        {aba === 'config' && <AbaConfig config={draft.config} onChange={setConfig} />}
        {aba === 'horario' && <AbaHorario horario={draft.horario} config={draft.config} onChange={setAulas} />}
        {aba === 'extras' && <AbaExtras extras={draft.aulasExtras || []} onChange={setExtras} />}
      </div>
    </div>
  )
}

// ── Aba Configurações ──────────────────────────────────────────────────────────
function AbaConfig({ config, onChange }) {
  return (
    <div className="aba-config">
      <div className="config-card">
        <h3 className="config-title">Horário das aulas</h3>
        <p className="config-desc">Defina quando começam as aulas e quanto tempo dura cada uma.</p>

        <div className="config-grid">
          <div>
            <label className="field-label">Horário de início</label>
            <input type="time" className="field-input" value={config.inicio}
              onChange={e => onChange('inicio', e.target.value)} />
          </div>
          <div>
            <label className="field-label">Duração de cada aula (min)</label>
            <input type="number" className="field-input" min="10" max="180" value={config.duracaoAula}
              onChange={e => onChange('duracaoAula', Number(e.target.value))} />
          </div>
          <div>
            <label className="field-label">Duração do intervalo (min)</label>
            <input type="number" className="field-input" min="5" max="60" value={config.duracaoIntervalo}
              onChange={e => onChange('duracaoIntervalo', Number(e.target.value))} />
          </div>
          <div>
            <label className="field-label">Intervalo após quantas aulas?</label>
            <input type="number" className="field-input" min="1" max="10" value={config.aulaIntervaloApos}
              onChange={e => onChange('aulaIntervaloApos', Number(e.target.value))} />
          </div>
        </div>

        <div className="config-preview">
          <span className="config-preview-label">Exemplo de horário:</span>
          <Preview config={config} />
        </div>
      </div>
    </div>
  )
}

function Preview({ config }) {
  const exemplos = []
  let normal = 0
  for (let i = 0; i < 5; i++) {
    exemplos.push({ tipo: 'aula', i, inicio: calcularHorarioAula(config, i), fim: calcularFimAula(config, i) })
    normal++
    if (normal % config.aulaIntervaloApos === 0 && i < 4) {
      const fim = calcularFimAula(config, i)
      const inicio2 = calcularHorarioAula(config, i + 1)
      exemplos.push({ tipo: 'intervalo', inicio: fim, fim: inicio2 })
    }
  }
  return (
    <div className="preview-list">
      {exemplos.map((e, idx) =>
        e.tipo === 'intervalo'
          ? <div key={idx} className="preview-intervalo">☕ Intervalo {e.inicio}–{e.fim}</div>
          : <div key={idx} className="preview-aula">
              <span className="preview-num">{e.i + 1}ª aula</span>
              <span className="preview-tempo">{e.inicio} – {e.fim}</span>
            </div>
      )}
    </div>
  )
}

// ── Aba Horário ────────────────────────────────────────────────────────────────
function AbaHorario({ horario, config, onChange }) {
  return (
    <div className="aba-horario">
      {DIAS.map(dia => (
        <DiaEditor key={dia} label={DIAS_LABELS[dia]} aulas={horario[dia] || []}
          config={config} onChange={a => onChange(dia, a)} />
      ))}
    </div>
  )
}

function DiaEditor({ label, aulas, config, onChange }) {
  const [input, setInput] = useState('')

  function add() {
    const nome = input.trim()
    if (!nome) return
    onChange([...aulas, nome])
    setInput('')
  }

  function remover(i) { onChange(aulas.filter((_, idx) => idx !== i)) }
  function editar(i, v) { const c = [...aulas]; c[i] = v; onChange(c) }
  function mover(i, dir) {
    const c = [...aulas]
    const j = i + dir
    if (j < 0 || j >= c.length) return
    ;[c[i], c[j]] = [c[j], c[i]]
    onChange(c)
  }

  return (
    <div className="dia-editor">
      <div className="dia-editor-header">
        <span className="dia-editor-label">{label}</span>
        <span className="dia-editor-count">{aulas.length} aula{aulas.length !== 1 ? 's' : ''}</span>
      </div>
      <div className="dia-editor-aulas">
        {aulas.length === 0
          ? <p className="dia-empty">Nenhuma aula</p>
          : aulas.map((nome, i) => (
            <div key={i} className="dia-aula-item">
              <span className="dia-aula-horario">{calcularHorarioAula(config, i)}</span>
              <AulaInput value={nome} onChange={v => editar(i, v)} />
              <button className="icon-btn" onClick={() => mover(i, -1)} title="Subir" disabled={i === 0}>↑</button>
              <button className="icon-btn" onClick={() => mover(i, 1)} title="Descer" disabled={i === aulas.length - 1}>↓</button>
              <button className="btn-danger" onClick={() => remover(i)}>✕</button>
            </div>
          ))
        }
      </div>
      <div className="dia-editor-add">
        <input className="field-input" placeholder="Nome da aula..."
          value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && add()} />
        <button className="btn-primary dia-add-btn" onClick={add}>+</button>
      </div>
    </div>
  )
}

function AulaInput({ value, onChange }) {
  const [editing, setEditing] = useState(false)
  const [val, setVal] = useState(value)
  if (editing) return (
    <input className="field-input aula-input-edit" value={val}
      autoFocus
      onChange={e => setVal(e.target.value)}
      onBlur={() => { onChange(val.trim() || value); setEditing(false) }}
      onKeyDown={e => { if (e.key === 'Enter') { onChange(val.trim() || value); setEditing(false) } }} />
  )
  return <span className="dia-aula-nome" onDoubleClick={() => setEditing(true)}>{value}</span>
}

// ── Aba Extras ─────────────────────────────────────────────────────────────────
function AbaExtras({ extras, onChange }) {
  const [form, setForm] = useState({ nome: '', data: '', horario: '07:30', repetirSemanal: false })
  const [erro, setErro] = useState('')

  function add() {
    if (!form.nome.trim()) return setErro('Informe o nome da aula.')
    if (!form.data) return setErro('Informe a data.')
    if (!form.horario) return setErro('Informe o horário.')
    onChange([...extras, { ...form, nome: form.nome.trim(), id: crypto.randomUUID() }])
    setForm({ nome: '', data: '', horario: '07:30', repetirSemanal: false })
    setErro('')
  }

  function remover(id) { onChange(extras.filter(e => e.id !== id)) }

  return (
    <div className="aba-extras">
      <div className="extras-form-card">
        <h3 className="config-title">Adicionar aula extra</h3>
        <p className="config-desc">Recuperação, reposição ou qualquer aula fora do horário normal.</p>

        <div className="config-grid">
          <div className="config-grid-full">
            <label className="field-label">Nome da aula</label>
            <input className="field-input" placeholder="Ex: Recuperação de Matemática"
              value={form.nome} onChange={e => setForm(f => ({ ...f, nome: e.target.value }))} />
          </div>
          <div>
            <label className="field-label">Data</label>
            <input type="date" className="field-input" value={form.data}
              onChange={e => setForm(f => ({ ...f, data: e.target.value }))} />
          </div>
          <div>
            <label className="field-label">Horário</label>
            <input type="time" className="field-input" value={form.horario}
              onChange={e => setForm(f => ({ ...f, horario: e.target.value }))} />
          </div>
        </div>

        <label className="extras-check">
          <input type="checkbox" checked={form.repetirSemanal}
            onChange={e => setForm(f => ({ ...f, repetirSemanal: e.target.checked }))} />
          <span>Repetir toda semana nesse dia</span>
        </label>

        {erro && <p className="extras-erro">{erro}</p>}
        <button className="btn-primary extras-add-btn" onClick={add}>+ Adicionar aula extra</button>
      </div>

      {extras.length > 0 && (
        <div className="extras-list">
          <h3 className="config-title" style={{ marginBottom: 12 }}>Aulas extras cadastradas</h3>
          {extras.map(e => (
            <div key={e.id} className="extra-item">
              <div className="extra-item-info">
                <span className="extra-item-nome">{e.nome}</span>
                <span className="extra-item-meta">
                  📅 {e.data.split('-').reverse().join('/')} · ⏰ {e.horario}
                  {e.repetirSemanal && ' · 🔁 Semanal'}
                </span>
              </div>
              <button className="btn-danger" onClick={() => remover(e.id)}>✕</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

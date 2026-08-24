import React, { useMemo } from 'react'
import { DIAS, DIAS_LABELS, calcularHorarioAula, calcularFimAula, diaDaSemana, formatarData } from '../utils/storage'
import { exportarPerfil } from '../utils/fileUtils'
import './ScheduleView.css'

export default function ScheduleView({ perfil, onEditar, onVoltar }) {
  const hoje = new Date()
  const hojeISO = hoje.toISOString().slice(0, 10)
  const hojeChave = ['domingo','segunda','terca','quarta','quinta','sexta','sabado'][hoje.getDay()]

  const diasComAulas = useMemo(() => {
    return DIAS.map((dia) => {
      const aulasNormais = (perfil.horario[dia] || []).map((nome, i) => ({
        tipo: 'normal',
        nome,
        inicio: calcularHorarioAula(perfil.config, i),
        fim: calcularFimAula(perfil.config, i),
        key: `normal-${i}`,
      }))

      const extrasNoDia = (perfil.aulasExtras || [])
        .filter(e => diaDaSemana(e.data) === dia)
        .map((e) => ({
          tipo: 'extra',
          nome: e.nome,
          inicio: e.horario,
          fim: somarMinutos(e.horario, perfil.config.duracaoAula),
          data: e.data,
          repetirSemanal: e.repetirSemanal,
          key: `extra-${e.id}`,
        }))

      const todas = [...aulasNormais, ...extrasNoDia].sort((a, b) => a.inicio.localeCompare(b.inicio))

      const comIntervalo = []
      let contadorNormais = 0
      for (const aula of todas) {
        comIntervalo.push(aula)
        if (aula.tipo === 'normal') {
          contadorNormais++
          if (contadorNormais % perfil.config.aulaIntervaloApos === 0) {
            const proxIndex = todas.indexOf(aula) + 1
            const proxNormal = todas.slice(proxIndex).find(a => a.tipo === 'normal')
            if (proxNormal) {
              comIntervalo.push({
                tipo: 'intervalo',
                inicio: aula.fim,
                fim: proxNormal.inicio,
                key: `intervalo-${aula.key}`,
              })
            }
          }
        }
      }

      return { dia, label: DIAS_LABELS[dia], aulas: comIntervalo, isHoje: dia === hojeChave }
    })
  }, [perfil, hojeChave])

  const totalAulas = DIAS.reduce((a, d) => a + (perfil.horario[d]?.length || 0), 0)
  const totalExtras = (perfil.aulasExtras || []).length

  return (
    <div className="view fade-in">
      <header className="view-header">
        <div className="view-header-left">
          <button className="btn-ghost" onClick={onVoltar}>← Início</button>
          <div>
            <h1 className="view-title">{perfil.nome}</h1>
            <p className="view-meta">
              {totalAulas} aulas regulares
              {totalExtras > 0 && ` · ${totalExtras} extra${totalExtras > 1 ? 's' : ''}`}
              {' · '}{perfil.config.inicio} · {perfil.config.duracaoAula}min/aula
            </p>
          </div>
        </div>
        <div className="view-header-right">
          <button className="btn-secondary" onClick={() => exportarPerfil(perfil)}>💾 Exportar</button>
          <button className="btn-primary" onClick={onEditar}>✏️ Editar</button>
        </div>
      </header>

      <div className="view-grid">
        {diasComAulas.map(({ dia, label, aulas, isHoje }) => (
          <div key={dia} className={`day-col ${isHoje ? 'day-col--hoje' : ''}`}>
            <div className="day-header">
              <span className="day-label">{label}</span>
              {isHoje && <span className="day-badge">Hoje</span>}
              <span className="day-count">{aulas.filter(a => a.tipo !== 'intervalo').length}</span>
            </div>
            <div className="day-aulas">
              {aulas.length === 0
                ? <div className="day-empty">Sem aulas</div>
                : aulas.map((item) => {
                    if (item.tipo === 'intervalo') return <IntervaloSlot key={item.key} inicio={item.inicio} fim={item.fim} />
                    if (item.tipo === 'extra') return <AulaExtraSlot key={item.key} item={item} />
                    return <AulaSlot key={item.key} item={item} />
                  })
              }
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function AulaSlot({ item }) {
  return (
    <div className="aula-slot">
      <div className="aula-slot-tempo">
        <span className="aula-slot-inicio">{item.inicio}</span>
        <span className="aula-slot-fim">{item.fim}</span>
      </div>
      <div className="aula-slot-nome">{item.nome}</div>
    </div>
  )
}

function AulaExtraSlot({ item }) {
  return (
    <div className="aula-slot aula-slot--extra">
      <div className="aula-slot-tempo">
        <span className="aula-slot-inicio">{item.inicio}</span>
        <span className="aula-slot-fim">{item.fim}</span>
      </div>
      <div className="aula-slot-info">
        <span className="aula-slot-nome">{item.nome}</span>
        <span className="aula-extra-tag">
          {item.repetirSemanal ? '🔁 Semanal' : `📅 ${formatarData(item.data)}`}
        </span>
      </div>
    </div>
  )
}

function IntervaloSlot({ inicio, fim }) {
  return (
    <div className="intervalo-slot">
      <span className="intervalo-label">☕ Intervalo</span>
      <span className="intervalo-tempo">{inicio} – {fim}</span>
    </div>
  )
}

function somarMinutos(hora, min) {
  const [h, m] = hora.split(':').map(Number)
  const total = h * 60 + m + min
  return `${String(Math.floor(total / 60) % 24).padStart(2,'0')}:${String(total % 60).padStart(2,'0')}`
}

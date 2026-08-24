import React, { useMemo } from 'react'
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
import { colors, radius } from '../Theme'
import { DIAS, DIAS_LABELS, calcularHorarioAula, calcularFimAula, diaDaSemana, formatarData } from '../utils/Storage'
import { exportarPerfil } from '../utils/FileUtils'
import AulaSlot from '../components/schedule/AulaSlot'
import AulaExtraSlot from '../components/schedule/AulaExtraSlot'
import IntervaloSlot from '../components/schedule/IntervaloSlot'

function somarMinutos(hora, min) {
  const [h, m] = hora.split(':').map(Number)
  const total = h * 60 + m + min
  return `${String(Math.floor(total / 60) % 24).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`
}

export default function ScheduleView({ perfil, onEditar, onVoltar }) {
  const hoje = new Date()
  const hojeChave = ['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'][hoje.getDay()]

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
        .map(e => ({
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
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={onVoltar}>
            <Text style={styles.backBtn}>← Início</Text>
          </TouchableOpacity>
          <View>
            <Text style={styles.title}>{perfil.nome}</Text>
            <Text style={styles.meta}>
              {totalAulas} aulas
              {totalExtras > 0 ? ` · ${totalExtras} extra${totalExtras > 1 ? 's' : ''}` : ''}
              {` · ${perfil.config.inicio} · ${perfil.config.duracaoAula}min`}
            </Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.btnSecondary} onPress={() => exportarPerfil(perfil)}>
            <Text style={styles.btnSecondaryText}>💾</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnPrimary} onPress={onEditar}>
            <Text style={styles.btnPrimaryText}>✏️ Editar</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Grade de dias — scroll horizontal */}
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {diasComAulas.map(({ dia, label, aulas, isHoje }) => (
          <View key={dia} style={[styles.dayCol, isHoje && styles.dayColHoje]}>
            <View style={[styles.dayHeader, isHoje && styles.dayHeaderHoje]}>
              <Text style={[styles.dayLabel, isHoje && styles.dayLabelHoje]}>{label.toUpperCase()}</Text>
              {isHoje && <View style={styles.badge}><Text style={styles.badgeText}>HOJE</Text></View>}
              <View style={[styles.countBadge, isHoje && styles.countBadgeHoje]}>
                <Text style={[styles.countText, isHoje && styles.countTextHoje]}>
                  {aulas.filter(a => a.tipo !== 'intervalo').length}
                </Text>
              </View>
            </View>
            <View style={styles.dayAulas}>
              {aulas.length === 0
                ? <Text style={styles.empty}>Sem aulas</Text>
                : aulas.map(item => {
                    if (item.tipo === 'intervalo') return <IntervaloSlot key={item.key} inicio={item.inicio} fim={item.fim} />
                    if (item.tipo === 'extra') return <AulaExtraSlot key={item.key} item={item} />
                    return <AulaSlot key={item.key} item={item} />
                  })
              }
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1.5,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
    gap: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    gap: 8,
  },
  backBtn: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  meta: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 1,
  },
  btnPrimary: {
    backgroundColor: colors.accent,
    borderRadius: radius.md,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  btnPrimaryText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  btnSecondary: {
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  btnSecondaryText: {
    fontSize: 16,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 0,
  },
  // Cada dia ocupa a largura toda (mobile: lista vertical)
  dayCol: {
    borderBottomWidth: 1.5,
    borderBottomColor: colors.border,
  },
  dayColHoje: {
    backgroundColor: '#FAFAFA',
  },
  dayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
    gap: 8,
  },
  dayHeaderHoje: {
    backgroundColor: colors.accentLight,
  },
  dayLabel: {
    flex: 1,
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
    letterSpacing: 0.5,
  },
  dayLabelHoje: {
    color: colors.textPrimary,
  },
  badge: {
    backgroundColor: colors.accent,
    borderRadius: 99,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  badgeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  countBadge: {
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 99,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  countBadgeHoje: {
    backgroundColor: colors.accent,
    borderColor: 'transparent',
  },
  countText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textMuted,
  },
  countTextHoje: {
    color: '#fff',
  },
  dayAulas: {
    padding: 12,
  },
  empty: {
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'center',
    paddingVertical: 20,
    fontStyle: 'italic',
  },
})
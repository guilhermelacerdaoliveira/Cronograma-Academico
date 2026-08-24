import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { colors, radius } from '../../Theme'

const DIAS_CURTOS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex']
const DIAS_CHAVES = ['segunda', 'terca', 'quarta', 'quinta', 'sexta']

export default function WeekOverview({ perfis, hojeChave, onVerHorario }) {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>Visão da Semana</Text>
      <View style={styles.row}>
        {DIAS_CURTOS.map((d, i) => {
          const chave = DIAS_CHAVES[i]
          const total = perfis.reduce((acc, p) => acc + (p.horario[chave]?.length || 0), 0)
          const isHoje = chave === hojeChave
          return (
            <View key={d} style={[styles.pill, isHoje && styles.pillHoje]}>
              <Text style={[styles.pillLabel, isHoje && styles.pillTextHoje]}>{d}</Text>
              <Text style={[styles.pillCount, isHoje && styles.pillTextHoje]}>{total}</Text>
              <Text style={[styles.pillSub, isHoje && styles.pillTextHoje]}>aulas</Text>
            </View>
          )
        })}
      </View>
      {perfis[0] && (
        <TouchableOpacity style={styles.btnFull} onPress={() => onVerHorario(perfis[0].id)}>
          <Text style={styles.btnFullText}>Ver horário completo →</Text>
        </TouchableOpacity>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.xl,
    padding: 20,
    gap: 12,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  row: {
    flexDirection: 'row',
    gap: 6,
  },
  pill: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
    backgroundColor: colors.bg,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingVertical: 10,
  },
  pillHoje: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  pillLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  pillCount: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    lineHeight: 22,
  },
  pillSub: {
    fontSize: 9,
    color: colors.textMuted,
  },
  pillTextHoje: {
    color: '#fff',
  },
  btnFull: {
    backgroundColor: colors.accent,
    borderRadius: radius.lg,
    padding: 13,
    alignItems: 'center',
  },
  btnFullText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
})
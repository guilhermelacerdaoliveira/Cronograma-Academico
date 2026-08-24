import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { colors, radius } from '../../Theme'
import { calcularHorarioAula, calcularFimAula } from '../../utils/Storage'

export default function Preview({ config }) {
  const exemplos = []
  let normal = 0

  for (let i = 0; i < 5; i++) {
    exemplos.push({
      tipo: 'aula',
      i,
      inicio: calcularHorarioAula(config, i),
      fim: calcularFimAula(config, i),
    })
    normal++
    if (normal % config.aulaIntervaloApos === 0 && i < 4) {
      exemplos.push({
        tipo: 'intervalo',
        inicio: calcularFimAula(config, i),
        fim: calcularHorarioAula(config, i + 1),
      })
    }
  }

  return (
    <View style={styles.list}>
      {exemplos.map((e, idx) =>
        e.tipo === 'intervalo' ? (
          <Text key={idx} style={styles.intervalo}>
            ☕ Intervalo {e.inicio}–{e.fim}
          </Text>
        ) : (
          <View key={idx} style={styles.aula}>
            <Text style={styles.aulaNum}>{e.i + 1}ª aula</Text>
            <Text style={styles.aulaTempo}>{e.inicio} – {e.fim}</Text>
          </View>
        )
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  list: {
    gap: 4,
  },
  aula: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 8,
    backgroundColor: colors.surface,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  aulaNum: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  aulaTempo: {
    fontSize: 12,
    color: colors.textSecondary,
    fontVariant: ['tabular-nums'],
  },
  intervalo: {
    fontSize: 11,
    color: colors.textMuted,
    textAlign: 'center',
    paddingVertical: 4,
    fontStyle: 'italic',
  },
})
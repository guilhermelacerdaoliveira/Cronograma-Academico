import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { colors, radius } from '../../Theme'
import { formatarData } from '../../utils/Storage'

export default function AulaExtraSlot({ item }) {
  return (
    <View style={styles.container}>
      <View style={styles.tempo}>
        <Text style={styles.inicio}>{item.inicio}</Text>
        <Text style={styles.fim}>{item.fim}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.nome} numberOfLines={2}>{item.nome}</Text>
        <Text style={styles.tag}>
          {item.repetirSemanal ? '🔁 Semanal' : `📅 ${formatarData(item.data)}`}
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: colors.extraLight,
    borderWidth: 1.5,
    borderColor: colors.extra,
    borderRadius: radius.md,
    padding: 10,
    marginBottom: 6,
  },
  tempo: {
    alignItems: 'flex-end',
    minWidth: 38,
    flexShrink: 0,
  },
  inicio: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.extra,
    fontVariant: ['tabular-nums'],
  },
  fim: {
    fontSize: 10,
    color: colors.textMuted,
    fontVariant: ['tabular-nums'],
  },
  info: {
    flex: 1,
    gap: 3,
  },
  nome: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textPrimary,
    lineHeight: 17,
  },
  tag: {
    fontSize: 10,
    color: colors.extra,
    fontWeight: '500',
  },
})
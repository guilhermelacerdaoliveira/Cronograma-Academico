import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { colors, radius, typography } from '../../Theme'

export default function AulaSlot({ item }) {
  return (
    <View style={styles.container}>
      <View style={styles.tempo}>
        <Text style={styles.inicio}>{item.inicio}</Text>
        <Text style={styles.fim}>{item.fim}</Text>
      </View>
      <Text style={styles.nome} numberOfLines={2}>{item.nome}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
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
    color: colors.textPrimary,
    fontVariant: ['tabular-nums'],
  },
  fim: {
    fontSize: 10,
    color: colors.textMuted,
    fontVariant: ['tabular-nums'],
  },
  nome: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: colors.textPrimary,
    lineHeight: 17,
    paddingTop: 1,
  },
})
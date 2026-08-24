import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { colors, radius } from '../../Theme'

export default function IntervaloSlot({ inicio, fim }) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>☕ Intervalo</Text>
      <Text style={styles.tempo}>{inicio} – {fim}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: colors.bg,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
    marginBottom: 6,
  },
  label: {
    fontSize: 10,
    color: colors.textMuted,
    fontWeight: '500',
  },
  tempo: {
    fontSize: 10,
    color: colors.textMuted,
    fontVariant: ['tabular-nums'],
  },
})
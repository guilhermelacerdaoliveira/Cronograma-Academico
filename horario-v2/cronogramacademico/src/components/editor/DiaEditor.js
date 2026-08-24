import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import { colors, radius } from '../../Theme'
import { calcularHorarioAula } from '../../utils/Storage'
import AulaInput from './AulaInput'

export default function DiaEditor({ label, aulas, config, onChange }) {
  const [input, setInput] = useState('')

  function add() {
    const nome = input.trim()
    if (!nome) return
    onChange([...aulas, nome])
    setInput('')
  }

  function remover(i) {
    onChange(aulas.filter((_, idx) => idx !== i))
  }

  function editar(i, v) {
    const c = [...aulas]
    c[i] = v
    onChange(c)
  }

  function mover(i, dir) {
    const c = [...aulas]
    const j = i + dir
    if (j < 0 || j >= c.length) return
    ;[c[i], c[j]] = [c[j], c[i]]
    onChange(c)
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.count}>{aulas.length} aula{aulas.length !== 1 ? 's' : ''}</Text>
      </View>

      <View style={styles.aulas}>
        {aulas.length === 0
          ? <Text style={styles.empty}>Nenhuma aula</Text>
          : aulas.map((nome, i) => (
            <View key={i} style={styles.aulaItem}>
              <Text style={styles.horario}>{calcularHorarioAula(config, i)}</Text>
              <AulaInput value={nome} onChange={v => editar(i, v)} />
              <TouchableOpacity
                style={[styles.iconBtn, i === 0 && styles.iconBtnDisabled]}
                onPress={() => mover(i, -1)}
                disabled={i === 0}
              >
                <Text style={styles.iconBtnText}>↑</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.iconBtn, i === aulas.length - 1 && styles.iconBtnDisabled]}
                onPress={() => mover(i, 1)}
                disabled={i === aulas.length - 1}
              >
                <Text style={styles.iconBtnText}>↓</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnDanger} onPress={() => remover(i)}>
                <Text style={styles.btnDangerText}>✕</Text>
              </TouchableOpacity>
            </View>
          ))
        }
      </View>

      <View style={styles.addRow}>
        <TextInput
          style={styles.addInput}
          placeholder="Nome da aula..."
          placeholderTextColor={colors.textMuted}
          value={input}
          onChangeText={setInput}
          onSubmitEditing={add}
          returnKeyType="done"
        />
        <TouchableOpacity style={styles.addBtn} onPress={add}>
          <Text style={styles.addBtnText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.xl,
    padding: 16,
    marginBottom: 12,
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  count: {
    fontSize: 11,
    color: colors.textMuted,
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 99,
    paddingHorizontal: 9,
    paddingVertical: 2,
    overflow: 'hidden',
  },
  aulas: {
    gap: 6,
  },
  empty: {
    fontSize: 12,
    color: colors.textMuted,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 8,
  },
  aulaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: 8,
  },
  horario: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textMuted,
    minWidth: 36,
    fontVariant: ['tabular-nums'],
  },
  iconBtn: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBtnDisabled: {
    opacity: 0.3,
  },
  iconBtnText: {
    fontSize: 11,
    color: colors.textMuted,
  },
  btnDanger: {
    backgroundColor: colors.dangerLight,
    borderRadius: radius.sm,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  btnDangerText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.danger,
  },
  addRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  addInput: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 13,
    color: colors.textPrimary,
    backgroundColor: colors.surface,
  },
  addBtn: {
    backgroundColor: colors.accent,
    borderRadius: radius.md,
    paddingHorizontal: 16,
    paddingVertical: 9,
  },
  addBtnText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '700',
    lineHeight: 22,
  },
})
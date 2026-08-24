import React, { useState } from 'react'
import { Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native'
import { colors, radius } from '../../Theme'

// No mobile não existe "duplo clique" — o usuário toca no nome pra editar
export default function AulaInput({ value, onChange }) {
  const [editing, setEditing] = useState(false)
  const [val, setVal] = useState(value)

  function confirmar() {
    const novo = val.trim() || value
    onChange(novo)
    setEditing(false)
  }

  if (editing) {
    return (
      <TextInput
        style={styles.input}
        value={val}
        onChangeText={setVal}
        onBlur={confirmar}
        onSubmitEditing={confirmar}
        autoFocus
        returnKeyType="done"
      />
    )
  }

  return (
    <TouchableOpacity onPress={() => setEditing(true)} style={styles.touchable}>
      <Text style={styles.nome} numberOfLines={1}>{value}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  touchable: {
    flex: 1,
  },
  nome: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  input: {
    flex: 1,
    fontSize: 13,
    color: colors.textPrimary,
    borderWidth: 1.5,
    borderColor: colors.accent,
    borderRadius: radius.sm,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: colors.surface,
  },
})
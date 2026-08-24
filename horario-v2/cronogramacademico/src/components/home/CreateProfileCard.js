import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import { colors, radius } from '../../Theme'

export default function CreateProfileCard({ onCreate }) {
  const [criando, setCriando] = useState(false)
  const [nome, setNome] = useState('')

  function handleCriar() {
    onCreate(nome.trim() || 'Meu Horário')
    setNome('')
    setCriando(false)
  }

  if (criando) {
    return (
      <View style={styles.card}>
        <Text style={styles.cardLabel}>Novo horário</Text>
        <TextInput
          style={styles.input}
          placeholder="Nome (ex: Cursinho Tarde)"
          placeholderTextColor={colors.textMuted}
          value={nome}
          onChangeText={setNome}
          onSubmitEditing={handleCriar}
          autoFocus
          returnKeyType="done"
        />
        <View style={styles.btns}>
          <TouchableOpacity style={styles.btnPrimary} onPress={handleCriar}>
            <Text style={styles.btnPrimaryText}>Criar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnSecondary} onPress={() => setCriando(false)}>
            <Text style={styles.btnSecondaryText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  return (
    <TouchableOpacity style={styles.btnNovo} onPress={() => setCriando(true)}>
      <Text style={styles.btnNovoText}>+ Criar novo horário</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.xl,
    padding: 20,
    gap: 10,
  },
  cardLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.lg,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: colors.textPrimary,
    backgroundColor: colors.surface,
  },
  btns: {
    flexDirection: 'row',
    gap: 8,
  },
  btnPrimary: {
    flex: 1,
    backgroundColor: colors.accent,
    borderRadius: radius.md,
    padding: 11,
    alignItems: 'center',
  },
  btnPrimaryText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  btnSecondary: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: 11,
    alignItems: 'center',
  },
  btnSecondaryText: {
    color: colors.textPrimary,
    fontWeight: '500',
    fontSize: 14,
  },
  btnNovo: {
    backgroundColor: colors.accent,
    borderRadius: radius.lg,
    padding: 14,
    alignItems: 'center',
  },
  btnNovoText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
})
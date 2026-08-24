import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, Switch, StyleSheet, Platform } from 'react-native'
import { colors, radius } from '../../Theme'
import { formatarData } from '../../utils/Storage'

export default function AbaExtras({ extras, onChange }) {
  const [form, setForm] = useState({
    nome: '',
    data: '',
    horario: '07:30',
    repetirSemanal: false,
  })
  const [erro, setErro] = useState('')

  function add() {
    if (!form.nome.trim()) return setErro('Informe o nome da aula.')
    if (!form.data) return setErro('Informe a data (AAAA-MM-DD).')
    if (!form.horario) return setErro('Informe o horário.')
    onChange([
      ...extras,
      {
        ...form,
        nome: form.nome.trim(),
        id: Math.random().toString(36).slice(2) + Date.now().toString(36),
      },
    ])
    setForm({ nome: '', data: '', horario: '07:30', repetirSemanal: false })
    setErro('')
  }

  function remover(id) {
    onChange(extras.filter(e => e.id !== id))
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Adicionar aula extra</Text>
        <Text style={styles.desc}>Recuperação, reposição ou qualquer aula fora do horário normal.</Text>

        <Text style={styles.fieldLabel}>Nome da aula</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Recuperação de Matemática"
          placeholderTextColor={colors.textMuted}
          value={form.nome}
          onChangeText={v => setForm(f => ({ ...f, nome: v }))}
        />

        <Text style={styles.fieldLabel}>Data (AAAA-MM-DD)</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: 2025-09-10"
          placeholderTextColor={colors.textMuted}
          value={form.data}
          onChangeText={v => setForm(f => ({ ...f, data: v }))}
          keyboardType="numbers-and-punctuation"
        />

        <Text style={styles.fieldLabel}>Horário (HH:MM)</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: 13:00"
          placeholderTextColor={colors.textMuted}
          value={form.horario}
          onChangeText={v => setForm(f => ({ ...f, horario: v }))}
          keyboardType="numbers-and-punctuation"
        />

        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Repetir toda semana nesse dia</Text>
          <Switch
            value={form.repetirSemanal}
            onValueChange={v => setForm(f => ({ ...f, repetirSemanal: v }))}
            trackColor={{ false: colors.border, true: colors.accent }}
            thumbColor={Platform.OS === 'android' ? (form.repetirSemanal ? colors.accent : '#f4f3f4') : undefined}
          />
        </View>

        {erro ? <Text style={styles.erro}>{erro}</Text> : null}

        <TouchableOpacity style={styles.addBtn} onPress={add}>
          <Text style={styles.addBtnText}>+ Adicionar aula extra</Text>
        </TouchableOpacity>
      </View>

      {extras.length > 0 && (
        <View style={styles.card}>
          <Text style={[styles.title, { marginBottom: 12 }]}>Aulas extras cadastradas</Text>
          {extras.map(e => (
            <View key={e.id} style={styles.extraItem}>
              <View style={styles.extraInfo}>
                <Text style={styles.extraNome}>{e.nome}</Text>
                <Text style={styles.extraMeta}>
                  📅 {formatarData(e.data)} · ⏰ {e.horario}
                  {e.repetirSemanal ? ' · 🔁 Semanal' : ''}
                </Text>
              </View>
              <TouchableOpacity style={styles.btnDanger} onPress={() => remover(e.id)}>
                <Text style={styles.btnDangerText}>✕</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.xl,
    padding: 20,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  desc: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 5,
    marginTop: 12,
  },
  input: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 14,
    color: colors.textPrimary,
    backgroundColor: colors.surface,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  switchLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    flex: 1,
  },
  erro: {
    fontSize: 12,
    color: colors.danger,
    backgroundColor: colors.dangerLight,
    borderRadius: radius.sm,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginTop: 8,
  },
  addBtn: {
    backgroundColor: colors.accent,
    borderRadius: radius.md,
    padding: 13,
    alignItems: 'center',
    marginTop: 16,
  },
  addBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  extraItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    backgroundColor: colors.bg,
    borderRadius: radius.md,
    marginBottom: 8,
  },
  extraInfo: {
    flex: 1,
    gap: 3,
  },
  extraNome: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  extraMeta: {
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
})
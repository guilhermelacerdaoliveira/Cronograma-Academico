import React, { useState } from 'react'
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
import { colors, radius } from '../Theme'
import { DIAS, DIAS_LABELS } from '../utils/Storage'
import DiaEditor from '../components/editor/DiaEditor'
import Preview from '../components/editor/Preview'
import AbaExtras from '../components/editor/AbaExtras'

const ABAS = ['config', 'horario', 'extras']
const ABA_LABELS = { config: 'Configurações', horario: 'Aulas', extras: 'Extras' }

export default function Editor({ perfil, onSalvar, onCancelar }) {
  const [aba, setAba] = useState('config')
  const [draft, setDraft] = useState(() => JSON.parse(JSON.stringify(perfil)))

  function setConfig(campo, valor) {
    setDraft(p => ({ ...p, config: { ...p.config, [campo]: valor } }))
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onCancelar}>
          <Text style={styles.backBtn}>← Cancelar</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.nomeInput}
          value={draft.nome}
          onChangeText={v => setDraft(p => ({ ...p, nome: v }))}
          returnKeyType="done"
        />
        <TouchableOpacity style={styles.btnSalvar} onPress={() => onSalvar(draft)}>
          <Text style={styles.btnSalvarText}>✓ Salvar</Text>
        </TouchableOpacity>
      </View>

      {/* Abas */}
      <View style={styles.abas}>
        {ABAS.map(a => (
          <TouchableOpacity
            key={a}
            style={[styles.aba, aba === a && styles.abaAtiva]}
            onPress={() => setAba(a)}
          >
            <Text style={[styles.abaText, aba === a && styles.abaTextAtiva]}>
              {ABA_LABELS[a]}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Corpo */}
      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent}>
        {aba === 'config' && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Horário das aulas</Text>
            <Text style={styles.cardDesc}>Defina quando começam as aulas e quanto tempo dura cada uma.</Text>

            <Text style={styles.fieldLabel}>Horário de início (HH:MM)</Text>
            <TextInput
              style={styles.input}
              value={draft.config.inicio}
              onChangeText={v => setConfig('inicio', v)}
              placeholder="07:30"
              keyboardType="numbers-and-punctuation"
              returnKeyType="done"
            />

            <Text style={styles.fieldLabel}>Duração de cada aula (min)</Text>
            <TextInput
              style={styles.input}
              value={String(draft.config.duracaoAula)}
              onChangeText={v => setConfig('duracaoAula', Number(v) || 0)}
              keyboardType="number-pad"
              returnKeyType="done"
            />

            <Text style={styles.fieldLabel}>Duração do intervalo (min)</Text>
            <TextInput
              style={styles.input}
              value={String(draft.config.duracaoIntervalo)}
              onChangeText={v => setConfig('duracaoIntervalo', Number(v) || 0)}
              keyboardType="number-pad"
              returnKeyType="done"
            />

            <Text style={styles.fieldLabel}>Intervalo após quantas aulas?</Text>
            <TextInput
              style={styles.input}
              value={String(draft.config.aulaIntervaloApos)}
              onChangeText={v => setConfig('aulaIntervaloApos', Number(v) || 1)}
              keyboardType="number-pad"
              returnKeyType="done"
            />

            <View style={styles.previewBox}>
              <Text style={styles.previewLabel}>EXEMPLO DE HORÁRIO</Text>
              <Preview config={draft.config} />
            </View>
          </View>
        )}

        {aba === 'horario' && (
          <View>
            {DIAS.map(dia => (
              <DiaEditor
                key={dia}
                label={DIAS_LABELS[dia]}
                aulas={draft.horario[dia] || []}
                config={draft.config}
                onChange={aulas => setDraft(p => ({ ...p, horario: { ...p.horario, [dia]: aulas } }))}
              />
            ))}
          </View>
        )}

        {aba === 'extras' && (
          <AbaExtras
            extras={draft.aulasExtras || []}
            onChange={extras => setDraft(p => ({ ...p, aulasExtras: extras }))}
          />
        )}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: colors.surface,
    borderBottomWidth: 1.5,
    borderBottomColor: colors.border,
  },
  backBtn: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
    flexShrink: 0,
  },
  nomeInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    paddingBottom: 2,
  },
  btnSalvar: {
    backgroundColor: colors.accent,
    borderRadius: radius.md,
    paddingHorizontal: 14,
    paddingVertical: 8,
    flexShrink: 0,
  },
  btnSalvarText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  abas: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderBottomWidth: 1.5,
    borderBottomColor: colors.border,
  },
  aba: {
    flex: 1,
    paddingVertical: 13,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  abaAtiva: {
    borderBottomColor: colors.accent,
  },
  abaText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textMuted,
  },
  abaTextAtiva: {
    color: colors.accent,
    fontWeight: '600',
  },
  body: {
    flex: 1,
  },
  bodyContent: {
    padding: 16,
    paddingBottom: 48,
  },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.xl,
    padding: 20,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  cardDesc: {
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
    marginTop: 14,
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
  previewBox: {
    backgroundColor: colors.bg,
    borderRadius: radius.md,
    padding: 16,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginTop: 20,
  },
  previewLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textMuted,
    letterSpacing: 0.6,
    marginBottom: 10,
  },
})
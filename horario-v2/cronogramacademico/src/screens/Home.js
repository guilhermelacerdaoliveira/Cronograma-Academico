import React from 'react'
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
import { colors, radius } from '../Theme'
import { criarPerfilVazio } from '../utils/Storage'
import CreateProfileCard from '../components/home/CreateProfileCard'
import WeekOverview from '../components/home/WeekOverview'

export default function Home({ perfis, onAbrirPerfil, onCriarPerfil, onDeletarPerfil, onImportar }) {
  const hoje = new Date()
  const hojeChave = ['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'][hoje.getDay()]
  const dataFormatada = hoje.toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  function handleCriar(nome) {
    onCriarPerfil(criarPerfilVazio(nome))
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Olá, estudante!</Text>
        <Text style={styles.date}>{dataFormatada}</Text>
      </View>

      {perfis.length > 0 && (
        <WeekOverview
          perfis={perfis}
          hojeChave={hojeChave}
          onVerHorario={onAbrirPerfil}
        />
      )}

      {perfis.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Horários salvos</Text>
          {perfis.map(p => (
            <View key={p.id} style={styles.perfilCard}>
              <TouchableOpacity style={styles.perfilMain} onPress={() => onAbrirPerfil(p.id)}>
                <Text style={styles.perfilNome}>{p.nome}</Text>
                <Text style={styles.perfilMeta}>
                  {Object.values(p.horario).reduce((a, d) => a + d.length, 0)} aulas
                  {p.aulasExtras?.length > 0
                    ? ` · ${p.aulasExtras.length} extra${p.aulasExtras.length > 1 ? 's' : ''}`
                    : ''}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.perfilDel}
                onPress={() => onDeletarPerfil(p.id)}
              >
                <Text style={styles.perfilDelText}>✕</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      <View style={styles.section}>
        <CreateProfileCard onCreate={handleCriar} />
      </View>

      <TouchableOpacity style={styles.btnImport} onPress={onImportar}>
        <Text style={styles.btnImportText}>📂 Importar arquivo .json</Text>
      </TouchableOpacity>

      <Text style={styles.footer}>Dados salvos no dispositivo · Funciona offline</Text>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    padding: 20,
    gap: 16,
    paddingBottom: 48,
  },
  header: {
    paddingTop: 12,
    marginBottom: 4,
  },
  greeting: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  date: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 3,
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  perfilCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  perfilMain: {
    flex: 1,
    padding: 14,
    gap: 3,
  },
  perfilNome: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  perfilMeta: {
    fontSize: 12,
    color: colors.textMuted,
  },
  perfilDel: {
    padding: 14,
    backgroundColor: colors.dangerLight,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
  },
  perfilDelText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.danger,
  },
  btnImport: {
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: 14,
    alignItems: 'center',
  },
  btnImportText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  footer: {
    textAlign: 'center',
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 8,
  },
})
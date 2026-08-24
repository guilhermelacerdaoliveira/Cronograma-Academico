import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
} from 'react-native'

import { criarPerfilVazio } from '../utils/storage'

export default function Home({
  perfis,
  onAbrirPerfil,
  onCriarPerfil,
  onDeletarPerfil,
  onImportarPerfil,
}) {
  const [criando, setCriando] = useState(false)
  const [nomePerfil, setNomePerfil] = useState('')

  function handleCriar() {
    const nome = nomePerfil.trim() || 'Meu Horário'

    onCriarPerfil(criarPerfilVazio(nome))

    setNomePerfil('')
    setCriando(false)
  }

  const hoje = new Date()

  const dataFormatada = hoje.toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.dashboardHeader}>
        <Text style={styles.dashboardGreeting}>
          Olá, estudante!
        </Text>

        <Text style={styles.dashboardDate}>
          {dataFormatada}
        </Text>
      </View>

      {/* Cards principais */}
      <View style={styles.dashboardRow}>
        {/* Próxima aula */}
        <View style={styles.dashCard}>
          <Text style={styles.dashCardLabel}>
            Próxima aula
          </Text>

          <Text style={styles.dashCardTitle}>
            {perfis.length === 0
              ? 'Nenhum horário criado'
              : 'Sem aulas programadas'}
          </Text>

          <Text style={styles.dashCardSub}>
            {perfis.length === 0
              ? 'Crie um horário para começar!'
              : 'Aproveite para descansar ou estudar!'}
          </Text>
        </View>

        {/* Aulas de hoje */}
        <View style={styles.dashCard}>
          <Text style={styles.dashCardLabel}>
            Aulas de hoje
          </Text>

          <Text style={styles.dashCardSub}>
            {perfis.length === 0
              ? 'Nenhum horário criado'
              : 'Nenhuma aula hoje'}
          </Text>
        </View>
      </View>

      {/* Quando existem perfis */}
      {perfis.length > 0 && (
        <View style={styles.dashboardRow}>
          {/* Visão da semana */}
          <View style={styles.dashCard}>
            <Text style={styles.dashCardLabel}>
              Visão da Semana
            </Text>

            <View style={styles.weekRow}>
              {['Seg', 'Ter', 'Qua', 'Qui', 'Sex'].map((dia, index) => {
                const dias = [
                  'segunda',
                  'terca',
                  'quarta',
                  'quinta',
                  'sexta',
                ]

                const total = perfis.reduce(
                  (acc, perfil) =>
                    acc +
                    (perfil.horario?.[dias[index]]?.length || 0),
                  0
                )

                return (
                  <View
                    key={dia}
                    style={styles.weekDayPill}
                  >
                    <Text style={styles.pillLabel}>
                      {dia}
                    </Text>

                    <Text style={styles.pillCount}>
                      {total}
                    </Text>

                    <Text style={styles.pillSub}>
                      aulas
                    </Text>
                  </View>
                )
              })}
            </View>

            {perfis[0] && (
              <Pressable
                style={({ pressed }) => [
                  styles.weekButton,
                  pressed && styles.buttonPressed,
                ]}
                onPress={() => onAbrirPerfil(perfis[0].id)}
              >
                <Text style={styles.weekButtonText}>
                  Ver horário completo →
                </Text>
              </Pressable>
            )}
          </View>

          {/* Novo horário */}
          <View style={styles.dashCard}>
            <Text style={styles.dashCardLabel}>
              Novo horário
            </Text>

            {criando ? (
              <View style={styles.newForm}>
                <TextInput
                  style={styles.input}
                  placeholder="Nome (ex: Cursinho Tarde)"
                  placeholderTextColor="#999"
                  value={nomePerfil}
                  onChangeText={setNomePerfil}
                  onSubmitEditing={handleCriar}
                  autoFocus
                  returnKeyType="done"
                />

                <View style={styles.newButtons}>
                  <Pressable
                    style={({ pressed }) => [
                      styles.primaryButton,
                      pressed && styles.buttonPressed,
                    ]}
                    onPress={handleCriar}
                  >
                    <Text style={styles.primaryButtonText}>
                      Criar
                    </Text>
                  </Pressable>

                  <Pressable
                    style={({ pressed }) => [
                      styles.secondaryButton,
                      pressed && styles.buttonPressed,
                    ]}
                    onPress={() => {
                      setCriando(false)
                      setNomePerfil('')
                    }}
                  >
                    <Text style={styles.secondaryButtonText}>
                      Cancelar
                    </Text>
                  </Pressable>
                </View>
              </View>
            ) : (
              <Pressable
                style={({ pressed }) => [
                  styles.primaryButton,
                  pressed && styles.buttonPressed,
                ]}
                onPress={() => setCriando(true)}
              >
                <Text style={styles.primaryButtonText}>
                  + Criar novo horário
                </Text>
              </Pressable>
            )}
          </View>
        </View>
      )}

      {/* Nenhum perfil */}
      {perfis.length === 0 && (
        <View style={styles.dashCard}>
          <Text style={styles.dashCardLabel}>
            Começar agora
          </Text>

          {criando ? (
            <View style={styles.newForm}>
              <TextInput
                style={styles.input}
                placeholder="Nome do horário (ex: Escola Manhã)"
                placeholderTextColor="#999"
                value={nomePerfil}
                onChangeText={setNomePerfil}
                onSubmitEditing={handleCriar}
                autoFocus
                returnKeyType="done"
              />

              <View style={styles.newButtons}>
                <Pressable
                  style={({ pressed }) => [
                    styles.primaryButton,
                    pressed && styles.buttonPressed,
                  ]}
                  onPress={handleCriar}
                >
                  <Text style={styles.primaryButtonText}>
                    Criar
                  </Text>
                </Pressable>

                <Pressable
                  style={({ pressed }) => [
                    styles.secondaryButton,
                    pressed && styles.buttonPressed,
                  ]}
                  onPress={() => {
                    setCriando(false)
                    setNomePerfil('')
                  }}
                >
                  <Text style={styles.secondaryButtonText}>
                    Cancelar
                  </Text>
                </Pressable>
              </View>
            </View>
          ) : (
            <Pressable
              style={({ pressed }) => [
                styles.primaryButton,
                pressed && styles.buttonPressed,
              ]}
              onPress={() => setCriando(true)}
            >
              <Text style={styles.primaryButtonText}>
                + Criar novo horário
              </Text>
            </Pressable>
          )}
        </View>
      )}

      {/* Footer */}
      <Text style={styles.footer}>
        Dados salvos só no seu navegador · Funciona offline
      </Text>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F6',
  },

  content: {
    padding: 24,
    paddingTop: 40,
    paddingBottom: 50,
  },

  dashboardHeader: {
    marginBottom: 28,
  },

  dashboardGreeting: {
    fontSize: 26,
    fontWeight: '700',
    color: '#171717',
    letterSpacing: -0.5,
  },

  dashboardDate: {
    fontSize: 13,
    color: '#777',
    marginTop: 4,
  },

  dashboardRow: {
    gap: 16,
    marginBottom: 16,
  },

  dashCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E3E3E3',
    borderRadius: 16,
    padding: 22,
  },

  dashCardLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#888',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 10,
  },

  dashCardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#171717',
    marginBottom: 4,
  },

  dashCardSub: {
    fontSize: 13,
    color: '#777',
    lineHeight: 19,
  },

  weekRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },

  weekDayPill: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8F8F6',
    borderWidth: 1.5,
    borderColor: '#E3E3E3',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 4,
  },

  pillLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#777',
  },

  pillCount: {
    fontSize: 19,
    fontWeight: '700',
    color: '#171717',
    lineHeight: 24,
    marginTop: 3,
  },

  pillSub: {
    fontSize: 10,
    color: '#999',
    marginTop: 2,
  },

  weekButton: {
    width: '100%',
    paddingVertical: 13,
    borderRadius: 12,
    backgroundColor: '#4F46E5',
    alignItems: 'center',
    justifyContent: 'center',
  },

  weekButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },

  newForm: {
    gap: 10,
  },

  input: {
    borderWidth: 1.5,
    borderColor: '#DADADA',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: '#171717',
    backgroundColor: '#FFFFFF',
  },

  newButtons: {
    flexDirection: 'row',
    gap: 8,
  },

  primaryButton: {
    flex: 1,
    minHeight: 44,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#4F46E5',
    alignItems: 'center',
    justifyContent: 'center',
  },

  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },

  secondaryButton: {
    flex: 1,
    minHeight: 44,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#EEEEEC',
    alignItems: 'center',
    justifyContent: 'center',
  },

  secondaryButtonText: {
    color: '#333',
    fontSize: 14,
    fontWeight: '600',
  },

  buttonPressed: {
    opacity: 0.75,
  },

  footer: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginTop: 20,
  },
})

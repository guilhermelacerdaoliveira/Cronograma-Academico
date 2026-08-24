import React, { useMemo } from 'react'
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
} from 'react-native'

import {
  DIAS,
  DIAS_LABELS,
  calcularHorarioAula,
  calcularFimAula,
  diaDaSemana,
  formatarData,
} from '../utils/storage'

import { exportarPerfil } from '../utils/fileUtils'

export default function ScheduleView({
  perfil,
  onEditar,
  onVoltar,
}) {
  const { width } = useWindowDimensions()

  const hoje = new Date()

  const hojeChave = [
    'domingo',
    'segunda',
    'terca',
    'quarta',
    'quinta',
    'sexta',
    'sabado',
  ][hoje.getDay()]

  const diasComAulas = useMemo(() => {
    return DIAS.map((dia) => {
      // -----------------------------
      // Aulas normais
      // -----------------------------
      const aulasNormais = (perfil.horario?.[dia] || []).map(
        (nome, i) => ({
          tipo: 'normal',
          nome,
          inicio: calcularHorarioAula(
            perfil.config,
            i
          ),
          fim: calcularFimAula(
            perfil.config,
            i
          ),
          key: `normal-${i}`,
        })
      )

      // -----------------------------
      // Aulas extras
      // -----------------------------
      const extrasNoDia = (
        perfil.aulasExtras || []
      )
        .filter(
          (extra) =>
            diaDaSemana(extra.data) === dia
        )
        .map((extra) => ({
          tipo: 'extra',
          nome: extra.nome,
          inicio: extra.horario,
          fim: somarMinutos(
            extra.horario,
            perfil.config.duracaoAula
          ),
          data: extra.data,
          repetirSemanal:
            extra.repetirSemanal,
          key: `extra-${extra.id}`,
        }))

      // -----------------------------
      // Junta e ordena por horário
      // -----------------------------
      const todas = [
        ...aulasNormais,
        ...extrasNoDia,
      ].sort((a, b) =>
        a.inicio.localeCompare(b.inicio)
      )

      // -----------------------------
      // Insere intervalos
      // -----------------------------
      const comIntervalo = []

      let contadorNormais = 0

      for (const aula of todas) {
        comIntervalo.push(aula)

        if (aula.tipo === 'normal') {
          contadorNormais++

          if (
            contadorNormais %
              perfil.config.aulaIntervaloApos ===
            0
          ) {
            const proxIndex =
              todas.indexOf(aula) + 1

            const proxNormal = todas
              .slice(proxIndex)
              .find(
                (a) => a.tipo === 'normal'
              )

            if (proxNormal) {
              comIntervalo.push({
                tipo: 'intervalo',
                inicio: aula.fim,
                fim: proxNormal.inicio,
                key: `intervalo-${aula.key}`,
              })
            }
          }
        }
      }

      return {
        dia,
        label: DIAS_LABELS[dia],
        aulas: comIntervalo,
        isHoje: dia === hojeChave,
      }
    })
  }, [perfil, hojeChave])

  const totalAulas = DIAS.reduce(
    (total, dia) =>
      total +
      (perfil.horario?.[dia]?.length || 0),
    0
  )

  const totalExtras =
    (perfil.aulasExtras || []).length

  /*
   * No celular queremos que cada coluna tenha
   * uma largura confortável e que o usuário possa
   * deslizar horizontalmente.
   */
  const colunaWidth =
    width < 600 ? 260 : Math.max(width / 5, 180)

  return (
    <View style={styles.container}>
      {/* =====================================
          CABEÇALHO
      ===================================== */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Pressable
            style={({ pressed }) => [
              styles.backButton,
              pressed && styles.pressed,
            ]}
            onPress={onVoltar}
          >
            <Text style={styles.backButtonText}>
              ← Início
            </Text>
          </Pressable>

          <View style={styles.headerActions}>
            <Pressable
              style={({ pressed }) => [
                styles.secondaryButton,
                pressed && styles.pressed,
              ]}
              onPress={() =>
                exportarPerfil(perfil)
              }
            >
              <Text style={styles.secondaryButtonText}>
                💾 Exportar
              </Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.primaryButton,
                pressed && styles.pressed,
              ]}
              onPress={onEditar}
            >
              <Text style={styles.primaryButtonText}>
                ✏️ Editar
              </Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.titleContainer}>
          <Text
            style={styles.title}
            numberOfLines={1}
          >
            {perfil.nome}
          </Text>

          <Text style={styles.meta}>
            {totalAulas} aulas regulares
            {totalExtras > 0
              ? ` · ${totalExtras} extra${
                  totalExtras > 1 ? 's' : ''
                }`
              : ''}
            {' · '}
            {perfil.config.inicio}
            {' · '}
            {perfil.config.duracaoAula}
            min/aula
          </Text>
        </View>
      </View>

      {/* =====================================
          GRADE
      ===================================== */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.grid}
      >
        {diasComAulas.map(
          ({
            dia,
            label,
            aulas,
            isHoje,
          }) => (
            <View
              key={dia}
              style={[
                styles.dayColumn,
                {
                  width: colunaWidth,
                },
                isHoje &&
                  styles.dayColumnToday,
              ]}
            >
              {/* -----------------------------
                  Cabeçalho do dia
              ----------------------------- */}
              <View style={styles.dayHeader}>
                <Text
                  style={[
                    styles.dayLabel,
                    isHoje &&
                      styles.dayLabelToday,
                  ]}
                >
                  {label}
                </Text>

                <View style={styles.dayHeaderRight}>
                  {isHoje && (
                    <View style={styles.todayBadge}>
                      <Text style={styles.todayBadgeText}>
                        Hoje
                      </Text>
                    </View>
                  )}

                  <View
                    style={[
                      styles.dayCount,
                      isHoje &&
                        styles.dayCountToday,
                    ]}
                  >
                    <Text
                      style={[
                        styles.dayCountText,
                        isHoje &&
                          styles.dayCountTextToday,
                      ]}
                    >
                      {
                        aulas.filter(
                          (a) =>
                            a.tipo !==
                            'intervalo'
                        ).length
                      }
                    </Text>
                  </View>
                </View>
              </View>

              {/* -----------------------------
                  Aulas
              ----------------------------- */}
              <View style={styles.dayLessons}>
                {aulas.length === 0 ? (
                  <Text style={styles.emptyText}>
                    Sem aulas
                  </Text>
                ) : (
                  aulas.map((item) => {
                    if (
                      item.tipo ===
                      'intervalo'
                    ) {
                      return (
                        <IntervaloSlot
                          key={item.key}
                          inicio={item.inicio}
                          fim={item.fim}
                        />
                      )
                    }

                    if (
                      item.tipo ===
                      'extra'
                    ) {
                      return (
                        <AulaExtraSlot
                          key={item.key}
                          item={item}
                        />
                      )
                    }

                    return (
                      <AulaSlot
                        key={item.key}
                        item={item}
                      />
                    )
                  })
                )}
              </View>
            </View>
          )
        )}
      </ScrollView>
    </View>
  )
}

/* ============================================
   AULA NORMAL
============================================ */

function AulaSlot({ item }) {
  return (
    <View style={styles.aulaSlot}>
      <View style={styles.aulaTempo}>
        <Text style={styles.aulaInicio}>
          {item.inicio}
        </Text>

        <Text style={styles.aulaFim}>
          {item.fim}
        </Text>
      </View>

      <View style={styles.aulaInfo}>
        <Text style={styles.aulaNome}>
          {item.nome}
        </Text>
      </View>
    </View>
  )
}

/* ============================================
   AULA EXTRA
============================================ */

function AulaExtraSlot({ item }) {
  return (
    <View style={styles.aulaExtraSlot}>
      <View style={styles.aulaTempo}>
        <Text style={styles.aulaInicio}>
          {item.inicio}
        </Text>

        <Text style={styles.aulaFim}>
          {item.fim}
        </Text>
      </View>

      <View style={styles.aulaInfo}>
        <Text style={styles.aulaNome}>
          {item.nome}
        </Text>

        <Text style={styles.extraTag}>
          {item.repetirSemanal
            ? '🔁 Semanal'
            : `📅 ${formatarData(item.data)}`}
        </Text>
      </View>
    </View>
  )
}

/* ============================================
   INTERVALO
============================================ */

function IntervaloSlot({
  inicio,
  fim,
}) {
  return (
    <View style={styles.intervaloSlot}>
      <Text style={styles.intervaloLabel}>
        ☕ Intervalo
      </Text>

      <Text style={styles.intervaloTempo}>
        {inicio} – {fim}
      </Text>
    </View>
  )
}

/* ============================================
   UTILITÁRIO
============================================ */

function somarMinutos(hora, min) {
  const [h, m] = hora
    .split(':')
    .map(Number)

  const total =
    h * 60 + m + min

  return `${String(
    Math.floor(total / 60) % 24
  ).padStart(2, '0')}:${String(
    total % 60
  ).padStart(2, '0')}`
}

/* ============================================
   STYLES
============================================ */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  /* Header */

  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 18,
    borderBottomWidth: 1.5,
    borderBottomColor: '#E3E3E3',
    backgroundColor: '#FFFFFF',
  },

  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },

  titleContainer: {
    marginTop: 14,
  },

  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#171717',
    letterSpacing: -0.3,
  },

  meta: {
    fontSize: 12,
    color: '#888888',
    marginTop: 4,
  },

  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  backButton: {
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: '#F1F1EF',
  },

  backButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#444444',
  },

  primaryButton: {
    minHeight: 40,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: '#4F46E5',
    alignItems: 'center',
    justifyContent: 'center',
  },

  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },

  secondaryButton: {
    minHeight: 40,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: '#EEEEEC',
    alignItems: 'center',
    justifyContent: 'center',
  },

  secondaryButtonText: {
    color: '#333333',
    fontSize: 13,
    fontWeight: '600',
  },

  pressed: {
    opacity: 0.7,
  },

  /* Grid */

  grid: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },

  dayColumn: {
    minHeight: '100%',
    borderRightWidth: 1.5,
    borderRightColor: '#E3E3E3',
    backgroundColor: '#FFFFFF',
  },

  dayColumnToday: {
    backgroundColor: '#FAFAFA',
  },

  /* Day header */

  dayHeader: {
    minHeight: 52,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1.5,
    borderBottomColor: '#E3E3E3',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  dayLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#666666',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },

  dayLabelToday: {
    color: '#171717',
  },

  dayHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  todayBadge: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 99,
  },

  todayBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },

  dayCount: {
    minWidth: 24,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 99,
    backgroundColor: '#F4F4F2',
    borderWidth: 1,
    borderColor: '#E3E3E3',
    alignItems: 'center',
  },

  dayCountToday: {
    backgroundColor: '#4F46E5',
    borderColor: '#4F46E5',
  },

  dayCountText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#888888',
  },

  dayCountTextToday: {
    color: '#FFFFFF',
  },

  /* Aulas */

  dayLessons: {
    padding: 10,
    gap: 6,
  },

  emptyText: {
    fontSize: 12,
    color: '#999999',
    textAlign: 'center',
    paddingVertical: 24,
    fontStyle: 'italic',
  },

  aulaSlot: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E3E3E3',
    borderRadius: 10,
  },

  aulaExtraSlot: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#FFF7ED',
    borderWidth: 1.5,
    borderColor: '#F97316',
    borderRadius: 10,
  },

  aulaTempo: {
    width: 40,
    flexShrink: 0,
  },

  aulaInicio: {
    fontSize: 11,
    fontWeight: '700',
    color: '#171717',
    fontVariant: ['tabular-nums'],
  },

  aulaFim: {
    fontSize: 10,
    color: '#999999',
    marginTop: 1,
    fontVariant: ['tabular-nums'],
  },

  aulaInfo: {
    flex: 1,
    minWidth: 0,
  },

  aulaNome: {
    fontSize: 12,
    fontWeight: '600',
    color: '#171717',
    lineHeight: 16,
  },

  extraTag: {
    fontSize: 10,
    color: '#F97316',
    fontWeight: '500',
    marginTop: 4,
  },

  /* Intervalo */

  intervaloSlot: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 7,
    paddingHorizontal: 10,
    backgroundColor: '#F5F5F3',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E3E3E3',
  },

  intervaloLabel: {
    fontSize: 10,
    color: '#888888',
    fontWeight: '500',
  },

  intervaloTempo: {
    fontSize: 10,
    color: '#888888',
    fontVariant: ['tabular-nums'],
  },
})

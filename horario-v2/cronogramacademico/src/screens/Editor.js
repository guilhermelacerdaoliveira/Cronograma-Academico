import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
} from 'react-native'

import {
  DIAS,
  DIAS_LABELS,
  calcularHorarioAula,
  calcularFimAula,
} from '../utils/storage'

const ABAS = ['config', 'horario', 'extras']

const ABA_LABELS = {
  config: 'Configurações',
  horario: 'Aulas',
  extras: 'Aulas Extras',
}

export default function Editor({
  perfil,
  onSalvar,
  onCancelar,
}) {
  const [aba, setAba] = useState('config')

  const [draft, setDraft] = useState(() =>
    JSON.parse(JSON.stringify(perfil))
  )

  function setConfig(campo, valor) {
    setDraft((p) => ({
      ...p,
      config: {
        ...p.config,
        [campo]: valor,
      },
    }))
  }

  function setNome(valor) {
    setDraft((p) => ({
      ...p,
      nome: valor,
    }))
  }

  function setAulas(dia, aulas) {
    setDraft((p) => ({
      ...p,
      horario: {
        ...p.horario,
        [dia]: aulas,
      },
    }))
  }

  function setExtras(extras) {
    setDraft((p) => ({
      ...p,
      aulasExtras: extras,
    }))
  }

  return (
    <View style={styles.editor}>
      {/* =================================
          HEADER
      ================================= */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Pressable
            style={({ pressed }) => [
              styles.cancelButton,
              pressed && styles.pressed,
            ]}
            onPress={onCancelar}
          >
            <Text style={styles.cancelButtonText}>
              ← Cancelar
            </Text>
          </Pressable>

          <TextInput
            style={styles.nameInput}
            value={draft.nome}
            onChangeText={setNome}
            placeholder="Nome do horário"
            placeholderTextColor="#999"
            returnKeyType="done"
          />
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.saveButton,
            pressed && styles.pressed,
          ]}
          onPress={() => onSalvar(draft)}
        >
          <Text style={styles.saveButtonText}>
            ✓ Salvar
          </Text>
        </Pressable>
      </View>

      {/* =================================
          ABAS
      ================================= */}
      <View style={styles.tabsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabs}
        >
          {ABAS.map((item) => {
            const ativa = aba === item

            return (
              <Pressable
                key={item}
                style={[
                  styles.tab,
                  ativa && styles.tabActive,
                ]}
                onPress={() => setAba(item)}
              >
                <Text
                  style={[
                    styles.tabText,
                    ativa && styles.tabTextActive,
                  ]}
                >
                  {ABA_LABELS[item]}
                </Text>
              </Pressable>
            )
          })}
        </ScrollView>
      </View>

      {/* =================================
          CORPO
      ================================= */}
      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.bodyContent}
        showsVerticalScrollIndicator={false}
      >
        {aba === 'config' && (
          <AbaConfig
            config={draft.config}
            onChange={setConfig}
          />
        )}

        {aba === 'horario' && (
          <AbaHorario
            horario={draft.horario}
            config={draft.config}
            onChange={setAulas}
          />
        )}

        {aba === 'extras' && (
          <AbaExtras
            extras={draft.aulasExtras || []}
            onChange={setExtras}
          />
        )}
      </ScrollView>
    </View>
  )
}

/* ==========================================
   ABA CONFIGURAÇÕES
========================================== */

function AbaConfig({
  config,
  onChange,
}) {
  return (
    <View style={styles.configContainer}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          Horário das aulas
        </Text>

        <Text style={styles.cardDescription}>
          Defina quando começam as aulas e quanto
          tempo dura cada uma.
        </Text>

        <View style={styles.formGrid}>
          <Field
            label="Horário de início"
            value={config.inicio}
            placeholder="07:30"
            keyboardType="numbers-and-punctuation"
            onChangeText={(value) =>
              onChange('inicio', value)
            }
          />

          <Field
            label="Duração de cada aula (min)"
            value={String(config.duracaoAula)}
            keyboardType="numeric"
            onChangeText={(value) =>
              onChange(
                'duracaoAula',
                Number(value) || 0
              )
            }
          />

          <Field
            label="Duração do intervalo (min)"
            value={String(config.duracaoIntervalo)}
            keyboardType="numeric"
            onChangeText={(value) =>
              onChange(
                'duracaoIntervalo',
                Number(value) || 0
              )
            }
          />

          <Field
            label="Intervalo após quantas aulas?"
            value={String(
              config.aulaIntervaloApos
            )}
            keyboardType="numeric"
            onChangeText={(value) =>
              onChange(
                'aulaIntervaloApos',
                Number(value) || 0
              )
            }
          />
        </View>

        <View style={styles.preview}>
          <Text style={styles.previewLabel}>
            Exemplo de horário
          </Text>

          <Preview config={config} />
        </View>
      </View>
    </View>
  )
}

/* ==========================================
   CAMPO
========================================== */

function Field({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>
        {label}
      </Text>

      <TextInput
        style={styles.fieldInput}
        value={value}
        placeholder={placeholder}
        placeholderTextColor="#999"
        keyboardType={keyboardType}
        onChangeText={onChangeText}
      />
    </View>
  )
}

/* ==========================================
   PREVIEW
========================================== */

function Preview({ config }) {
  const exemplos = []

  let normal = 0

  for (let i = 0; i < 5; i++) {
    exemplos.push({
      tipo: 'aula',
      i,
      inicio: calcularHorarioAula(
        config,
        i
      ),
      fim: calcularFimAula(
        config,
        i
      ),
    })

    normal++

    if (
      normal % config.aulaIntervaloApos ===
        0 &&
      i < 4
    ) {
      const fim =
        calcularFimAula(config, i)

      const inicio2 =
        calcularHorarioAula(
          config,
          i + 1
        )

      exemplos.push({
        tipo: 'intervalo',
        inicio: fim,
        fim: inicio2,
      })
    }
  }

  return (
    <View style={styles.previewList}>
      {exemplos.map((item, index) => {
        if (item.tipo === 'intervalo') {
          return (
            <View
              key={index}
              style={styles.previewInterval}
            >
              <Text style={styles.previewIntervalText}>
                ☕ Intervalo {item.inicio}–{item.fim}
              </Text>
            </View>
          )
        }

        return (
          <View
            key={index}
            style={styles.previewLesson}
          >
            <Text style={styles.previewNumber}>
              {item.i + 1}ª aula
            </Text>

            <Text style={styles.previewTime}>
              {item.inicio} – {item.fim}
            </Text>
          </View>
        )
      })}
    </View>
  )
}

/* ==========================================
   ABA HORÁRIO
========================================== */

function AbaHorario({
  horario,
  config,
  onChange,
}) {
  return (
    <View style={styles.scheduleContainer}>
      {DIAS.map((dia) => (
        <DiaEditor
          key={dia}
          label={DIAS_LABELS[dia]}
          aulas={horario[dia] || []}
          config={config}
          onChange={(aulas) =>
            onChange(dia, aulas)
          }
        />
      ))}
    </View>
  )
}

/* ==========================================
   EDITOR DE DIA
========================================== */

function DiaEditor({
  label,
  aulas,
  config,
  onChange,
}) {
  const [input, setInput] = useState('')

  function add() {
    const nome = input.trim()

    if (!nome) return

    onChange([...aulas, nome])
    setInput('')
  }

  function remover(index) {
    onChange(
      aulas.filter(
        (_, i) => i !== index
      )
    )
  }

  function editar(index, valor) {
    const copia = [...aulas]

    copia[index] = valor

    onChange(copia)
  }

  function mover(index, direcao) {
    const copia = [...aulas]

    const novoIndex =
      index + direcao

    if (
      novoIndex < 0 ||
      novoIndex >= copia.length
    ) {
      return
    }

    const temp =
      copia[index]

    copia[index] =
      copia[novoIndex]

    copia[novoIndex] =
      temp

    onChange(copia)
  }

  return (
    <View style={styles.dayCard}>
      {/* Header */}
      <View style={styles.dayHeader}>
        <Text style={styles.dayTitle}>
          {label}
        </Text>

        <View style={styles.dayCount}>
          <Text style={styles.dayCountText}>
            {aulas.length}{' '}
            {aulas.length === 1
              ? 'aula'
              : 'aulas'}
          </Text>
        </View>
      </View>

      {/* Aulas */}
      <View style={styles.dayLessons}>
        {aulas.length === 0 ? (
          <Text style={styles.dayEmpty}>
            Nenhuma aula
          </Text>
        ) : (
          aulas.map((nome, index) => (
            <View
              key={index}
              style={styles.lessonItem}
            >
              <Text style={styles.lessonTime}>
                {calcularHorarioAula(
                  config,
                  index
                )}
              </Text>

              <AulaInput
                value={nome}
                onChange={(valor) =>
                  editar(index, valor)
                }
              />

              <Pressable
                disabled={index === 0}
                style={[
                  styles.iconButton,
                  index === 0 &&
                    styles.iconButtonDisabled,
                ]}
                onPress={() =>
                  mover(index, -1)
                }
              >
                <Text style={styles.iconButtonText}>
                  ↑
                </Text>
              </Pressable>

              <Pressable
                disabled={
                  index ===
                  aulas.length - 1
                }
                style={[
                  styles.iconButton,
                  index ===
                    aulas.length - 1 &&
                    styles.iconButtonDisabled,
                ]}
                onPress={() =>
                  mover(index, 1)
                }
              >
                <Text style={styles.iconButtonText}>
                  ↓
                </Text>
              </Pressable>

              <Pressable
                style={styles.deleteButton}
                onPress={() =>
                  remover(index)
                }
              >
                <Text style={styles.deleteButtonText}>
                  ✕
                </Text>
              </Pressable>
            </View>
          ))
        )}
      </View>

      {/* Adicionar */}
      <View style={styles.addRow}>
        <TextInput
          style={styles.addInput}
          placeholder="Nome da aula..."
          placeholderTextColor="#999"
          value={input}
          onChangeText={setInput}
          onSubmitEditing={add}
          returnKeyType="done"
        />

        <Pressable
          style={({ pressed }) => [
            styles.addButton,
            pressed && styles.pressed,
          ]}
          onPress={add}
        >
          <Text style={styles.addButtonText}>
            +
          </Text>
        </Pressable>
      </View>
    </View>
  )
}

/* ==========================================
   INPUT INLINE DA AULA
========================================== */

function AulaInput({
  value,
  onChange,
}) {
  const [editing, setEditing] =
    useState(false)

  const [val, setVal] =
    useState(value)

  function finalizar() {
    const novoValor =
      val.trim() || value

    onChange(novoValor)
    setVal(novoValor)
    setEditing(false)
  }

  if (editing) {
    return (
      <TextInput
        style={styles.lessonInput}
        value={val}
        autoFocus
        onChangeText={setVal}
        onBlur={finalizar}
        onSubmitEditing={finalizar}
        returnKeyType="done"
      />
    )
  }

  return (
    <Pressable
      style={styles.lessonNameContainer}
      onPress={() => {
        setVal(value)
        setEditing(true)
      }}
    >
      <Text
        style={styles.lessonName}
        numberOfLines={1}
      >
        {value}
      </Text>
    </Pressable>
  )
}

/* ==========================================
   ABA EXTRAS
========================================== */

function AbaExtras({
  extras,
  onChange,
}) {
  const [form, setForm] =
    useState({
      nome: '',
      data: '',
      horario: '07:30',
      repetirSemanal: false,
    })

  const [erro, setErro] =
    useState('')

  function updateForm(campo, valor) {
    setForm((prev) => ({
      ...prev,
      [campo]: valor,
    }))
  }

  function add() {
    if (!form.nome.trim()) {
      setErro(
        'Informe o nome da aula.'
      )
      return
    }

    if (!form.data) {
      setErro(
        'Informe a data.'
      )
      return
    }

    if (!form.horario) {
      setErro(
        'Informe o horário.'
      )
      return
    }

    const novaAula = {
      ...form,
      nome: form.nome.trim(),
      id: gerarId(),
    }

    onChange([
      ...extras,
      novaAula,
    ])

    setForm({
      nome: '',
      data: '',
      horario: '07:30',
      repetirSemanal: false,
    })

    setErro('')
  }

  function remover(id) {
    onChange(
      extras.filter(
        (extra) =>
          extra.id !== id
      )
    )
  }

  return (
    <View style={styles.extrasContainer}>
      {/* Formulário */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          Adicionar aula extra
        </Text>

        <Text style={styles.cardDescription}>
          Recuperação, reposição ou qualquer
          aula fora do horário normal.
        </Text>

        <View style={styles.formFull}>
          <Field
            label="Nome da aula"
            value={form.nome}
            placeholder="Ex: Recuperação de Matemática"
            onChangeText={(value) =>
              updateForm(
                'nome',
                value
              )
            }
          />
        </View>

        <View style={styles.formGrid}>
          <Field
            label="Data"
            value={form.data}
            placeholder="AAAA-MM-DD"
            keyboardType="numbers-and-punctuation"
            onChangeText={(value) =>
              updateForm(
                'data',
                value
              )
            }
          />

          <Field
            label="Horário"
            value={form.horario}
            placeholder="07:30"
            keyboardType="numbers-and-punctuation"
            onChangeText={(value) =>
              updateForm(
                'horario',
                value
              )
            }
          />
        </View>

        {/* Repetição */}
        <View style={styles.switchRow}>
          <Switch
            value={
              form.repetirSemanal
            }
            onValueChange={(value) =>
              updateForm(
                'repetirSemanal',
                value
              )
            }
            trackColor={{
              false: '#D4D4D4',
              true: '#A5B4FC',
            }}
            thumbColor={
              form.repetirSemanal
                ? '#4F46E5'
                : '#F5F5F5'
            }
          />

          <Text style={styles.switchText}>
            Repetir toda semana nesse dia
          </Text>
        </View>

        {/* Erro */}
        {erro ? (
          <Text style={styles.errorText}>
            {erro}
          </Text>
        ) : null}

        <Pressable
          style={({ pressed }) => [
            styles.fullButton,
            pressed && styles.pressed,
          ]}
          onPress={add}
        >
          <Text style={styles.fullButtonText}>
            + Adicionar aula extra
          </Text>
        </Pressable>
      </View>

      {/* Lista */}
      {extras.length > 0 && (
        <View style={styles.card}>
          <Text
            style={[
              styles.cardTitle,
              styles.extraListTitle,
            ]}
          >
            Aulas extras cadastradas
          </Text>

          {extras.map((extra) => (
            <View
              key={extra.id}
              style={styles.extraItem}
            >
              <View
                style={
                  styles.extraItemInfo
                }
              >
                <Text
                  style={
                    styles.extraItemName
                  }
                  numberOfLines={1}
                >
                  {extra.nome}
                </Text>

                <Text
                  style={
                    styles.extraItemMeta
                  }
                >
                  {formatarDataBR(
                    extra.data
                  )}
                  {' · '}
                  {extra.horario}
                  {extra.repetirSemanal
                    ? ' · 🔁 Semanal'
                    : ''}
                </Text>
              </View>

              <Pressable
                style={
                  styles.deleteButtonLarge
                }
                onPress={() =>
                  remover(extra.id)
                }
              >
                <Text
                  style={
                    styles.deleteButtonText
                  }
                >
                  ✕
                </Text>
              </Pressable>
            </View>
          ))}
        </View>
      )}
    </View>
  )
}

/* ==========================================
   UTILITÁRIOS
========================================== */

function gerarId() {
  return (
    Date.now().toString(36) +
    Math.random()
      .toString(36)
      .substring(2, 10)
  )
}

function formatarDataBR(data) {
  if (!data) return ''

  const partes =
    data.split('-')

  if (partes.length !== 3) {
    return data
  }

  return `${partes[2]}/${partes[1]}/${partes[0]}`
}

/* ==========================================
   STYLES
========================================== */

const styles = StyleSheet.create({
  editor: {
    flex: 1,
    backgroundColor: '#F8F8F6',
  },

  /* Header */

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1.5,
    borderBottomColor: '#E3E3E3',
  },

  headerLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginRight: 12,
  },

  cancelButton: {
    paddingVertical: 9,
    paddingHorizontal: 11,
    borderRadius: 9,
    backgroundColor: '#F1F1EF',
  },

  cancelButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#555',
  },

  nameInput: {
    flex: 1,
    maxWidth: 300,
    fontSize: 17,
    fontWeight: '700',
    color: '#171717',
    paddingVertical: 5,
    borderBottomWidth: 2,
    borderBottomColor: '#4F46E5',
  },

  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#4F46E5',
  },

  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },

  pressed: {
    opacity: 0.7,
  },

  /* Tabs */

  tabsContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1.5,
    borderBottomColor: '#E3E3E3',
  },

  tabs: {
    paddingHorizontal: 20,
  },

  tab: {
    paddingHorizontal: 16,
    paddingVertical: 13,
    marginRight: 4,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },

  tabActive: {
    borderBottomColor: '#4F46E5',
  },

  tabText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#888',
  },

  tabTextActive: {
    color: '#171717',
    fontWeight: '600',
  },

  /* Body */

  body: {
    flex: 1,
  },

  bodyContent: {
    padding: 20,
    paddingBottom: 50,
  },

  /* Cards */

  configContainer: {
    width: '100%',
    maxWidth: 700,
  },

  extrasContainer: {
    width: '100%',
    maxWidth: 700,
    gap: 16,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E3E3E3',
    borderRadius: 16,
    padding: 22,
  },

  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#171717',
    marginBottom: 5,
  },

  cardDescription: {
    fontSize: 13,
    color: '#777',
    lineHeight: 19,
    marginBottom: 22,
  },

  /* Form */

  formGrid: {
    gap: 14,
  },

  formFull: {
    marginBottom: 14,
  },

  field: {
    flex: 1,
  },

  fieldLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#666',
    marginBottom: 6,
  },

  fieldInput: {
    minHeight: 44,
    borderWidth: 1.5,
    borderColor: '#DADADA',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#171717',
    backgroundColor: '#FFFFFF',
  },

  /* Preview */

  preview: {
    marginTop: 22,
    backgroundColor: '#F7F7F5',
    borderRadius: 10,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#E3E3E3',
  },

  previewLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
  },

  previewList: {
    gap: 4,
  },

  previewLesson: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 7,
    borderWidth: 1,
    borderColor: '#E3E3E3',
  },

  previewNumber: {
    fontSize: 12,
    fontWeight: '600',
    color: '#171717',
  },

  previewTime: {
    fontSize: 12,
    color: '#666',
  },

  previewInterval: {
    paddingVertical: 5,
    paddingHorizontal: 8,
    alignItems: 'center',
  },

  previewIntervalText: {
    fontSize: 11,
    color: '#888',
    fontStyle: 'italic',
  },

  /* Dias */

  scheduleContainer: {
    gap: 16,
  },

  dayCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E3E3E3',
    borderRadius: 16,
    padding: 18,
  },

  dayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },

  dayTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#171717',
  },

  dayCount: {
    backgroundColor: '#F5F5F3',
    borderWidth: 1,
    borderColor: '#E3E3E3',
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 99,
  },

  dayCountText: {
    fontSize: 11,
    color: '#888',
    fontWeight: '500',
  },

  dayLessons: {
    gap: 6,
  },

  dayEmpty: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    fontStyle: 'italic',
    paddingVertical: 8,
  },

  lessonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: '#F7F7F5',
    borderWidth: 1,
    borderColor: '#E3E3E3',
    borderRadius: 9,
    padding: 7,
  },

  lessonTime: {
    width: 40,
    fontSize: 11,
    fontWeight: '600',
    color: '#888',
  },

  lessonNameContainer: {
    flex: 1,
    minWidth: 0,
    paddingVertical: 4,
  },

  lessonName: {
    fontSize: 13,
    fontWeight: '500',
    color: '#171717',
  },

  lessonInput: {
    flex: 1,
    minWidth: 0,
    borderWidth: 1,
    borderColor: '#4F46E5',
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 5,
    fontSize: 13,
    color: '#171717',
    backgroundColor: '#FFFFFF',
  },

  iconButton: {
    width: 28,
    height: 28,
    borderWidth: 1,
    borderColor: '#DADADA',
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },

  iconButtonDisabled: {
    opacity: 0.3,
  },

  iconButtonText: {
    fontSize: 12,
    color: '#555',
    fontWeight: '600',
  },

  deleteButton: {
    width: 28,
    height: 28,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEE2E2',
  },

  deleteButtonLarge: {
    width: 34,
    height: 34,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEE2E2',
  },

  deleteButtonText: {
    color: '#DC2626',
    fontSize: 11,
    fontWeight: '700',
  },

  /* Add */

  addRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },

  addInput: {
    flex: 1,
    minHeight: 44,
    borderWidth: 1.5,
    borderColor: '#DADADA',
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 13,
    color: '#171717',
    backgroundColor: '#FFFFFF',
  },

  addButton: {
    width: 46,
    minHeight: 44,
    borderRadius: 10,
    backgroundColor: '#4F46E5',
    alignItems: 'center',
    justifyContent: 'center',
  },

  addButtonText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '400',
  },

  /* Extras */

  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },

  switchText: {
    flex: 1,
    fontSize: 13,
    color: '#666',
  },

  errorText: {
    marginTop: 8,
    backgroundColor: '#FEE2E2',
    color: '#DC2626',
    fontSize: 12,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 7,
  },

  fullButton: {
    marginTop: 16,
    minHeight: 46,
    borderRadius: 11,
    backgroundColor: '#4F46E5',
    alignItems: 'center',
    justifyContent: 'center',
  },

  fullButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },

  extraListTitle: {
    marginBottom: 12,
  },

  extraItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    backgroundColor: '#F7F7F5',
    borderRadius: 10,
    marginBottom: 8,
  },

  extraItemInfo: {
    flex: 1,
    minWidth: 0,
  },

  extraItemName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#171717',
  },

  extraItemMeta: {
    fontSize: 11,
    color: '#888',
    marginTop: 3,
  },
})

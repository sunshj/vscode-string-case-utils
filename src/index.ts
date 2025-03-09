import {
  camelCase,
  capitalCase,
  constantCase,
  dotCase,
  kebabCase,
  noCase,
  pascalCase,
  pascalSnakeCase,
  pathCase,
  sentenceCase,
  snakeCase,
  trainCase
} from 'change-case'
import {
  computed,
  defineExtension,
  useActiveTextEditor,
  useCommand,
  useTextEditorSelections
} from 'reactive-vscode'
import { commands, displayName } from './generated/meta'
import { logger } from './utils'
import type { Selection } from 'vscode'

interface TextSelectionData {
  index: number
  text: string
  selection: Selection
}

const { activate, deactivate } = defineExtension(() => {
  logger.info(`Extension [${displayName}] activated`)
  const editor = useActiveTextEditor()
  const document = computed(() => editor.value?.document)
  const selections = useTextEditorSelections(editor)

  const textSelectionsData = computed<TextSelectionData[]>(() =>
    selections.value.map((selection, index) => ({
      index,
      text: document.value?.getText(selection) || '',
      selection
    }))
  )

  async function replace(replacer: (text: string) => string) {
    const newData = textSelectionsData.value.map(t => ({ ...t, text: replacer(t.text) }))
    for (const { selection, text, index } of textSelectionsData.value) {
      if (!text.trim()) return
      await editor.value?.edit(editBuilder => {
        editBuilder.replace(selection, newData.find(i => i.index === index)!.text)
      })
    }
  }

  // string case
  useCommand(commands.pascalCase, () => replace(pascalCase))
  useCommand(commands.camelCase, () => replace(camelCase))
  useCommand(commands.kebabCase, () => replace(kebabCase))
  useCommand(commands.snakeCase, () => replace(snakeCase))
  useCommand(commands.pascalSnakeCase, () => replace(pascalSnakeCase))
  useCommand(commands.trainCase, () => replace(trainCase))
  useCommand(commands.constantCase, () => replace(constantCase))
  useCommand(commands.upperCase, () => replace(t => t.toUpperCase()))
  useCommand(commands.lowerCase, () => replace(t => t.toLowerCase()))
  useCommand(commands.capitalCase, () => replace(capitalCase))
  useCommand(commands.sentenceCase, () => replace(sentenceCase))
  useCommand(commands.dotCase, () => replace(dotCase))
  useCommand(commands.pathCase, () => replace(pathCase))
  useCommand(commands.noCase, () => replace(noCase))

  // desensitize
  useCommand(commands.desensitizeStar, () => replace(t => t.replaceAll(/[A-Z0-9]/gi, '*')))
  useCommand(commands.desensitizeX, () => replace(t => t.replaceAll(/[A-Z0-9]/gi, 'x')))
})

export { activate, deactivate }

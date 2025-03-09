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

  async function replace(newTextSelectionsData: TextSelectionData[]) {
    for (const { selection, text, index } of textSelectionsData.value) {
      if (!text.trim()) return
      await editor.value?.edit(editBuilder => {
        editBuilder.replace(selection, newTextSelectionsData.find(i => i.index === index)!.text)
      })
    }
  }

  function mapText(converter: (input: string) => string): TextSelectionData[] {
    return textSelectionsData.value.map(t => ({ ...t, text: converter(t.text) }))
  }

  // string case
  useCommand(commands.pascalCase, () => replace(mapText(pascalCase)))
  useCommand(commands.camelCase, () => replace(mapText(camelCase)))
  useCommand(commands.kebabCase, () => replace(mapText(kebabCase)))
  useCommand(commands.snakeCase, () => replace(mapText(snakeCase)))
  useCommand(commands.pascalSnakeCase, () => replace(mapText(pascalSnakeCase)))
  useCommand(commands.trainCase, () => replace(mapText(trainCase)))
  useCommand(commands.constantCase, () => replace(mapText(constantCase)))
  useCommand(commands.upperCase, () => replace(mapText(t => t.toUpperCase())))
  useCommand(commands.lowerCase, () => replace(mapText(t => t.toLowerCase())))
  useCommand(commands.capitalCase, () => replace(mapText(capitalCase)))
  useCommand(commands.sentenceCase, () => replace(mapText(sentenceCase)))
  useCommand(commands.dotCase, () => replace(mapText(dotCase)))
  useCommand(commands.pathCase, () => replace(mapText(pathCase)))
  useCommand(commands.noCase, () => replace(mapText(noCase)))

  // desensitize
  useCommand(commands.desensitizeStar, () => replace(mapText(t => t.replaceAll(/[A-Z0-9]/gi, '*'))))
  useCommand(commands.desensitizeX, () => replace(mapText(t => t.replaceAll(/[A-Z0-9]/gi, 'x'))))
})

export { activate, deactivate }

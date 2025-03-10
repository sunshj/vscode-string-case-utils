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
import { logger, randomHash } from './utils'

const { activate, deactivate } = defineExtension(() => {
  logger.info(`Extension [${displayName}] activated`)
  const editor = useActiveTextEditor()
  const document = computed(() => editor.value?.document)
  const selections = useTextEditorSelections(editor)

  const textSelectionsData = computed(() =>
    selections.value.map(selection => ({
      text: document.value?.getText(selection) || '',
      selection
    }))
  )

  async function replace(replacer: (text: string) => string) {
    const newData = textSelectionsData.value.map(t => ({ ...t, text: replacer(t.text) }))
    for (const { selection, text } of newData) {
      if (!text.trim()) return
      await editor.value?.edit(editBuilder => {
        editBuilder.replace(selection, text)
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

  // random hash
  useCommand(commands.randomHash16, () => replace(() => randomHash(16)))
  useCommand(commands.randomHash32, () => replace(() => randomHash(32)))
  useCommand(commands.randomHash64, () => replace(() => randomHash(64)))
})

export { activate, deactivate }

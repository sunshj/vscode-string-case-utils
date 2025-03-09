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
  useTextEditorSelection
} from 'reactive-vscode'
import { commands, displayName } from './generated/meta'
import { logger } from './utils'

const { activate, deactivate } = defineExtension(() => {
  logger.info(`Extension [${displayName}] activated`)
  const editor = useActiveTextEditor()
  const document = computed(() => editor.value?.document)
  const selection = useTextEditorSelection(editor)
  const selectedText = computed(() => document.value?.getText(selection.value) || '')

  function replace(newText: string) {
    if (!selectedText.value.trim()) return
    editor.value?.edit(editBuilder => {
      editBuilder.replace(selection.value, newText)
    })
  }

  // string case
  useCommand(commands.pascalCase, () => replace(pascalCase(selectedText.value)))
  useCommand(commands.camelCase, () => replace(camelCase(selectedText.value)))
  useCommand(commands.kebabCase, () => replace(kebabCase(selectedText.value)))
  useCommand(commands.snakeCase, () => replace(snakeCase(selectedText.value)))
  useCommand(commands.pascalSnakeCase, () => replace(pascalSnakeCase(selectedText.value)))
  useCommand(commands.trainCase, () => replace(trainCase(selectedText.value)))
  useCommand(commands.constantCase, () => replace(constantCase(selectedText.value)))
  useCommand(commands.upperCase, () => replace(selectedText.value.toUpperCase()))
  useCommand(commands.lowerCase, () => replace(selectedText.value.toLowerCase()))
  useCommand(commands.capitalCase, () => replace(capitalCase(selectedText.value)))
  useCommand(commands.sentenceCase, () => replace(sentenceCase(selectedText.value)))
  useCommand(commands.dotCase, () => replace(dotCase(selectedText.value)))
  useCommand(commands.pathCase, () => replace(pathCase(selectedText.value)))
  useCommand(commands.noCase, () => replace(noCase(selectedText.value)))

  // desensitize
  useCommand(commands.desensitizeStar, () =>
    replace(selectedText.value.replaceAll(/[A-Z0-9]/gi, '*'))
  )
  useCommand(commands.desensitizeX, () => replace(selectedText.value.replaceAll(/[A-Z0-9]/gi, 'x')))
})

export { activate, deactivate }

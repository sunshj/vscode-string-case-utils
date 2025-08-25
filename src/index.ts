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
  useDisposable,
  useTextEditorSelections
} from 'reactive-vscode'
import { Range, workspace, WorkspaceEdit } from 'vscode'

import { config } from './config'
import { commands, displayName } from './generated/meta'
import { formatTagFunctions, getHash, logger, randomHash } from './utils'

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
  useCommand(commands.desensitize, () =>
    replace(t => t.replaceAll(/[A-Z0-9]/gi, config.desensitizeChar))
  )

  // hash
  useCommand(commands.randomHash16, () => replace(() => randomHash(16)))
  useCommand(commands.randomHash32, () => replace(() => randomHash(32)))
  useCommand(commands.randomHash64, () => replace(() => randomHash(64)))
  useCommand(commands.hash16, () => replace(t => getHash(t, 16)))
  useCommand(commands.hash32, () => replace(t => getHash(t, 32)))
  useCommand(commands.hash64, () => replace(t => getHash(t, 64)))

  // auto format on save
  useDisposable(
    workspace.onWillSaveTextDocument(async event => {
      if (!config.formatTemplateStringsOnSave) {
        return
      }

      if (document.value && document.value.uri.toString() === event.document.uri.toString()) {
        const isJsTs = /\.(?:js|cjs|mjs|jsx|ts|cts|mts|tsx)$/.test(event.document.fileName)
        if (!isJsTs) return

        const originalText = event.document.getText()
        const formattedText = await formatTagFunctions(originalText, event.document.fileName)

        if (formattedText !== originalText) {
          const edit = new WorkspaceEdit()
          const fullRange = new Range(
            event.document.positionAt(0),
            event.document.positionAt(originalText.length)
          )
          edit.replace(event.document.uri, fullRange, formattedText)
          event.waitUntil(workspace.applyEdit(edit))
        }
      }
    })
  )
})

export { activate, deactivate }

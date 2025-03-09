import { exec } from 'node:child_process'
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

/**
 *
 * @param {string} filePath
 * @returns {[Record<string,any>,(() => void)]} json and save function
 */
function loadJSON(filePath) {
  const pkg = readFileSync(filePath).toString('utf-8')
  const json = JSON.parse(pkg)
  function saveJson() {
    writeFileSync(filePath, JSON.stringify(json, null, 2))
    exec(`npx prettier package**.json --write`)
  }

  return [json, saveJson]
}

function main() {
  const [pkgJSON, savePkgJSON] = loadJSON(join(__dirname, '../package.json'))
  const [nls, saveNls] = loadJSON(join(__dirname, '../package.nls.json'))
  const [zhNls, saveZhNls] = loadJSON(join(__dirname, '../package.nls.zh-cn.json'))

  const commands = pkgJSON.contributes.commands

  const stringCaseUtilsMenu = commands.map((item, index) => ({
    command: item.command,
    group: `1_modification@${index}`
  }))

  pkgJSON.contributes.menus.stringCaseUtils = stringCaseUtilsMenu

  const nlsRecords = commands.reduce((acc, cur) => {
    acc[cur.title.replaceAll('%', '')] = cur.command.split('.').pop()
    return acc
  }, {})

  savePkgJSON()
  Object.assign(nlsRecords, nls)
  saveNls()
  Object.assign(nlsRecords, zhNls)
  saveZhNls()
}

main()

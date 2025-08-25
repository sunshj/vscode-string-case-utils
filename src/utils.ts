import { createHash, randomBytes } from 'node:crypto'
import process from 'node:process'
import { useLogger } from 'reactive-vscode'
import { config as extConfig } from './config'
import { displayName } from './generated/meta'
import type { BuiltInParserName } from 'prettier'

export const logger = useLogger(displayName)

export function randomHash(len: number) {
  return randomBytes(Math.ceil(len / 2))
    .toString('hex')
    .slice(0, len)
}

export function getHash(str: string, len: number) {
  return createHash('sha256').update(str).digest('hex').slice(0, len)
}

export interface TagMatch {
  fullMatch: string
  content: string
  startIndex: number
  endIndex: number
  tagName: string
}

const TAG_NAME_PARSER_MAP: Record<string, BuiltInParserName> = {
  css: 'css',
  gql: 'graphql',
  graphql: 'graphql',
  ng: 'angular',
  angular: 'angular',
  html: 'html',
  json: 'json',
  json5: 'json5',
  jsonc: 'jsonc',
  less: 'less',
  md: 'markdown',
  markdown: 'markdown',
  mdx: 'mdx',
  scss: 'scss',
  js: 'babel',
  jsx: 'babel',
  tsx: 'babel-ts',
  ts: 'typescript',
  typescript: 'typescript',
  vue: 'vue',
  yaml: 'yaml',
  yml: 'yaml'
}

export function findTagFunctions(code: string): TagMatch[] {
  const pattern = extConfig.formatTagFunctionNames.join('|')
  logger.info('Using tag function names for formatting:', pattern)
  const tagRegex = new RegExp(`(${pattern})\`((?:[^\`\\\\]|\\\\.|\`(?!\`))*?)\``, 'gs')
  const matches: TagMatch[] = []
  let match: RegExpMatchArray | null

  while ((match = tagRegex.exec(code)) !== null) {
    const content = match[2]
    if (content.trim()) {
      matches.push({
        fullMatch: match[0],
        content,
        startIndex: match.index!,
        endIndex: match.index! + match[0].length,
        tagName: match[1]
      })
    }
  }

  return matches
}

export async function formatContent(match: TagMatch, filePath?: string): Promise<string> {
  try {
    const prettier = await import('prettier')

    // Try to resolve prettier config from the project, using file path if available
    let config: any = {}
    try {
      const configPath = filePath || process.cwd()
      config = (await prettier.resolveConfig(configPath)) || {}
    } catch (configError) {
      logger.warn('Could not resolve prettier config, using defaults:', configError)
    }

    logger.info(
      `Formatting \`${match.tagName}\` tag function with \`${TAG_NAME_PARSER_MAP[match.tagName]}\` parser.`
    )
    const formatted = await prettier.format(match.content, {
      ...config,
      parser: TAG_NAME_PARSER_MAP[match.tagName],
      // Only override if not already configured
      ...(config.printWidth === undefined && { printWidth: 80 }),
      ...(config.proseWrap === undefined && { proseWrap: 'always' }),
      ...(config.tabWidth === undefined && { tabWidth: 2 })
    })
    return formatted.trim()
  } catch (error: any) {
    logger.warn('Failed to format content:', error.message)
    return match.content
  }
}

export async function formatTagFunctions(code: string, filePath?: string): Promise<string> {
  const matches = findTagFunctions(code)

  if (matches.length === 0) return code

  let result = code
  let offset = 0

  for (const match of matches) {
    const formattedContent = await formatContent(match, filePath)
    const newTagFunction = `${match.tagName}\`${formattedContent}\``

    const startPos = match.startIndex + offset
    const endPos = match.endIndex + offset

    result = result.slice(0, startPos) + newTagFunction + result.slice(endPos)
    offset += newTagFunction.length - match.fullMatch.length
  }

  return result
}

import { createHash, randomBytes } from 'node:crypto'
import { useLogger } from 'reactive-vscode'
import { displayName } from './generated/meta'

export const logger = useLogger(displayName)

export function randomHash(len: number) {
  return randomBytes(Math.ceil(len / 2))
    .toString('hex')
    .slice(0, len)
}

export function getHash(str: string, len: number) {
  return createHash('sha256').update(str).digest('hex').slice(0, len)
}

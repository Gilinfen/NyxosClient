import {
  listen,
  type EventCallback,
  type EventName,
  type Options,
  type UnlistenFn
} from '@tauri-apps/api/event'
import type { DouyinMessageType } from '~/db/douyin/message'

export type TsListenType = <T>(
  event: keyof DouyinMessageType,
  handler: EventCallback<T>,
  options?: Options
) => Promise<UnlistenFn>

export const tsListen: TsListenType = async (event, handler, options) => {
  return await listen(event, handler, options)
}

export type SoleTsListenType = <T>(
  event: 'douyin:sole:getDataByField',
  handler: EventCallback<T>,
  options?: Options
) => Promise<UnlistenFn>

export const appSoleListen: SoleTsListenType = async (
  event,
  handler,
  options
) => {
  return await listen(event, handler, options)
}

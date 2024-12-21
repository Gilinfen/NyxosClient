import type { DanmuMessage } from '~/components/BaseWebsocketAdmin/types'
import type { DouyinMessageType } from './message'
import type { WebSocketTaskType } from '../WebSocketdDB'

/**
 * 抖音 websocket 任务表
 */
export interface DouyinWebSocketTaskDb extends WebSocketTaskType {
  /**
   * 消息类型
   */
  message_type: keyof DouyinMessageType
  /**
   * 弹幕关键字
   */
  keywords: string
}

/**
 * 抖音 websocket 弹幕表
 */
export interface DouyinWebSocketDanmaDb extends DanmuMessage {}

/**
 * 抖音 websocket 用户表
 */
export interface DouyinWebSocketUserDb {
  /**
   * 任务 ID
   */
  readonly task_id: string
  /**
   * 用户的唯一标识符
   */
  readonly user_id: string
  /**
   * 用户的名称
   */
  readonly user_name: string
  /**
   * 用户 主页
   */
  readonly user_url: string
  /**
   * 进入时间
   */
  readonly timestamp: number
}

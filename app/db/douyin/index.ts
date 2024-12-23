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
export interface DouyinWebSocketDanmaDb
  extends Omit<DanmuMessage, 'user_url'> {}

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
   * 进入时间
   */
  readonly timestamp: number
}

/**
 * 抖音 websocket 礼物表
 */
export interface DouyinWebSocketGiftDb {
  /**
   * 用户ID
   */
  readonly user_id: string
  /**
   * 用户名称
   */
  readonly user_name: string
  /**
   * 礼物ID
   */
  readonly gift_id: number
  /**
   * 礼物名称
   */
  readonly gift_name: string
  /**
   * 礼物数量
   */
  readonly repeat_count: number
  /**
   * 礼物URL
   */
  readonly gift_url: string
  /**
   * 发送时间
   */
  readonly timestamp: number
  /**
   * 任务 ID
   */
  readonly task_id: string
}

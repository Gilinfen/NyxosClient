import type { DanmuMessage } from '~/components/BaseWebsocketAdmin/types'
import type { WebSocketTaskType } from '~/types/WebSocketdDB'
import type { MessageType } from './message'

/**
 * 抖音 websocket 任务表
 */
export interface DouyinWebSocketTaskDb extends WebSocketTaskType {
  /**
   * 消息类型
   */
  message_type: keyof MessageType
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
   * 用户的唯一标识符
   */
  user_id: string
  /**
   * 用户的名称
   */
  user_name: string
  /**
   * 用户 主页
   */
  user_url: string
}

import { type UpdateLiveProps } from './UpdateLive'
import type { ReactNode } from 'react'
import type { WebSocketAppType, WebSocketTaskType } from '~/db/WebSocketdDB'

export interface TaskListType extends WebSocketTaskType {
  /**
   * 在线人数
   */
  online_count: number
  /**
   * 用户连接后的信息
   */
  messages_info?: DanmuMessage
  /**
   * 二维码连接
   */
  loginUrl?: string
  /**
   * 登陆状态
   * - loggedIn: 用户已成功登录
   * - loggedOut: 用户未登录
   * - scanned: 二维码已成功扫描
   * - qrExpired: 二维码已过期
   * - cancel: 取消
   */
  loginStatus: 'loggedIn' | 'loggedOut' | 'scanned' | 'qrExpired' | 'cancel'
}

export type TaskItemStatus = 'start' | 'stop' | 'reload'

/**
 * 弹幕消息接口
 */
export interface DanmuMessage {
  /**
   * 任务 ID
   */
  readonly task_id: string
  /**
   * 用户的唯一标识符
   */
  readonly user_id: string
  /**
   * 消息的唯一标识符
   */
  readonly message_id: string
  /**
   * 用户的名称
   */
  readonly user_name: string
  /**
   * 用户发送的消息内容
   */
  readonly message: string
  /**
   * 发送时间
   */
  readonly timestamp: number
  /**
   * 用户 主页
   */
  readonly user_url: string
}

export interface BaseWebsocketAdminProps {
  children?: ReactNode
  /**
   * 应用类型
   */
  readonly app_type: WebSocketAppType
  /**
   * 整个组件 loading
   */
  readonly loading?: boolean

  /**
   * 添加自定义字段
   */
  readonly AddFormItems?: UpdateLiveProps['FormItems']

  /**
   * 添加/更新，任务
   * @param data
   * @param type
   * @returns
   */
  readonly updateWebSocketTask?: (
    type: 'add' | 'update' | 'delete',
    data?: TaskListType
  ) => Promise<void>
  /**
   * 获取单个或者全部任务的信息
   * @param task_id task_id 存在查询一个，否则查询全部
   * @returns
   */
  readonly getWebsocketTask?: (
    task_id?: TaskListType['task_id']
  ) => Promise<TaskListType[] | TaskListType | undefined>
  /**
   * 搜索
   * @returns
   */
  readonly onSearch?: () => Promise<void>
  /**
   * 导出所有任务配置
   * @returns
   */
  readonly exportExcel?: () => Promise<void>
  /**
   * 倒入 所有 任务配置
   * @returns
   */
  readonly importExcel?: () => Promise<void>
  /**
   * 单个任务的执行状态函数
   * @param data
   * @param status 任务的执行状态，可以是 'start'、'stop'、'delete' 或 'reload'
   * @returns
   */
  readonly updateWebSocketTaskItem?: (
    data: TaskListType,
    status: TaskItemStatus
  ) => Promise<void>
  /**
   * 清除所有 WebSocket 连接任务
   * @returns
   */
  readonly clearAllWebSocketTask?: () => Promise<void>
}

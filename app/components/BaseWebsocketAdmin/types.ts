import type { WebSocketTaskType } from '~/types/WebSocketdDB'
import { type UpdateLiveProps } from './UpdateLive'
import type { ReactNode } from 'react'
export type BaseAppTypes = 'douyin' | 'tiktok'

export interface TaskListType extends WebSocketTaskType {}

export type TaskItemStatus = 'start' | 'stop' | 'reload'

/**
 * 弹幕消息接口
 */
export interface DanmuMessage {
  /**
   * 用户的唯一标识符
   */
  user_id: string
  /**
   * 消息的唯一标识符
   */
  message_id: string
  /**
   * 用户的名称
   */
  user_name: string
  /**
   * 用户发送的消息内容
   */
  message: string
  /**
   * 用户 主页
   */
  user_url: string
}

export interface BaseWebsocketAdminProps {
  /**
   * 应用类型
   */
  app_type: BaseAppTypes
  /**
   * 整个组件 loading
   */
  loading?: boolean
  /**
   * 任务列表
   */
  taskList: TaskListType[]
  /**
   * 弹幕数量
   */
  barrage_ount: number

  /**
   * 在线人数
   */
  online_count: number

  /**
   * 用户连接后的信息
   */
  messages_info?: DanmuMessage

  /**
   * 添加自定义字段
   */
  AddFormItems?: UpdateLiveProps['FormItems']
  /**
   * 登陆组件参数
   */
  LoginComProms: {
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
     */
    loginStatus: 'loggedIn' | 'loggedOut' | 'scanned' | 'qrExpired'
    /**
     * 刷新函数
     * @returns
     */
    onExpired?: (url?: string) => Promise<void>
  }
  /**
   * message 自定义内容
   */
  MessageConent?: ({ data }: { data: TaskListType }) => ReactNode

  /**
   * 右下角 控制器
   * @param param0
   * @returns
   */
  MessageIconsArrCom?: ({ data }: { data: TaskListType }) => ReactNode[]

  /**
   * 添加/更新，任务
   * @param data
   * @param type
   * @returns
   */
  updateWebSocketTask?: (
    type: 'add' | 'update' | 'delete',
    data?: TaskListType
  ) => Promise<void>
  /**
   * 获取单个或者全部任务的信息
   * @param task_id task_id 存在查询一个，否则查询全部
   * @returns
   */
  getWebsocketTask?: (
    task_id?: TaskListType['task_id']
  ) => Promise<TaskListType[] | TaskListType | undefined>
  /**
   * 搜索
   * @returns
   */
  onSearch?: () => Promise<void>
  /**
   * 导出所有任务配置
   * @returns
   */
  exportExcel?: () => Promise<void>
  /**
   * 倒入 所有 任务配置
   * @returns
   */
  importExcel?: () => Promise<void>
  /**
   * 单个任务的执行状态函数
   * @param data
   * @param status 任务的执行状态，可以是 'start'、'stop'、'delete' 或 'reload'
   * @returns
   */
  updateWebSocketTaskItem?: (
    data: TaskListType,
    status: TaskItemStatus
  ) => Promise<void>
  /**
   * 清除所有 WebSocket 连接任务
   * @returns
   */
  clearAllWebSocketTask?: () => Promise<void>
}

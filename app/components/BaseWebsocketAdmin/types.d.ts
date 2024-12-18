import type { WebSocketTaskType } from '~/types/WebSocketdDB'
import { type UpdateLiveForm, type UpdateLiveProps } from './UpdateLive'
export type BaseAppTypes = 'douyin' | 'tiktok'

export interface TaskListType extends WebSocketTaskType {
  loading?: boolean
}

export type TaskItemStatus = 'start' | 'stop' | 'reload'

/**
 * 弹幕消息接口
 * @property {string} userId - 用户的唯一标识符
 * @property {string} messageId - 消息的唯一标识符
 * @property {string} userName - 用户的名称
 * @property {string} message - 用户发送的消息内容
 */
export interface DanmuMessage {
  /**
   * 用户的唯一标识符
   */
  userId: string
  /**
   * 消息的唯一标识符
   */
  messageId: string
  /**
   * 用户的名称
   */
  userName: string
  /**
   * 用户发送的消息内容
   */
  message: string
  /**
   * 用户 主页
   */
  userUrl: string
}

export interface BaseWebsocketAdminProps {
  /**
   * 应用类型
   */
  appType: BaseAppTypes
  /**
   * 弹幕数量
   */
  barrageCount: number

  /**
   * 在线人数
   */
  onlineCount: number

  /**
   * 用户连接后的信息
   */
  messagesInfo?: DanmuMessage
  /**
   * 添加自定义字段
   */
  AddFormItems?: UpdateLiveProps['FormItems']
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
   * @param taskId taskId 存在查询一个，否则查询全部
   * @returns
   */
  getWebsocketTask?: (
    taskId?: TaskListType['taskId']
  ) => Promise<TaskListType | undefined>
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
  /**
   * 关闭单个 WebSocket 连接
   * @param data
   * @returns
   */
  disconnecItemtWebSocketTask?: (data: TaskListType) => Promise<void>
}

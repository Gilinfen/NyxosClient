export interface WebSocketTaskType {
  /**
   * WebSocket 连接的任务ID
   */
  taskId: string
  /**
   * 应用名称
   */
  taskName: string
  /**
   * 应用类型
   */
  appType: string
  /**
   * 连接的URL
   */
  liveUrl: string
  /**
   *  connecting: 连接中
   *  disconnected: 断开
   *  reconnecting: 重连
   */
  status: 'connecting' | 'disconnected' | 'reconnecting'
  /**
   * 消息类型
   */
  messageType: string
  /**
   * 直播间描述
   */
  description?: string
  /**
   * 创建任务时间
   */
  timestamp: number
}

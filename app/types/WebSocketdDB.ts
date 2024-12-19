export interface WebSocketTaskType {
  /**
   * WebSocket 连接的任务ID
   */
  task_id: string
  /**
   * 应用名称
   */
  task_name: string
  /**
   * 应用类型
   */
  app_type: string
  /**
   * 连接的URL
   */
  live_url: string
  /**
   *  connecting: 连接中
   *  disconnected: 断开
   *  reconnecting: 重连
   */
  task_status: 'connecting' | 'disconnected' | 'reconnecting'
  /**
   * 直播间描述
   */
  description?: string
  /**
   * 创建任务时间
   */
  timestamp: number
}

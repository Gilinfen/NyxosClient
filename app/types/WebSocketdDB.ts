export interface WebSocketTaskType {
  /**
   * WebSocket 连接的任务ID
   */
  readonly task_id: string
  /**
   * 应用名称
   */
  task_name: string
  /**
   * 应用类型
   */
  readonly app_type: string
  /**
   * 连接的URL
   */
  readonly live_url: string
  /**
   *  connecting: 连接中
   *  disconnected: 断开
   *  reconnecting: 重连
   */
  task_status: 'connecting' | 'disconnected' | 'reconnecting'
  /**
   * 直播间描述
   */
  readonly description?: string
  /**
   * 创建任务时间
   */
  readonly timestamp: number
}

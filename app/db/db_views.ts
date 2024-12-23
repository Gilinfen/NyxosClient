export type DbNameTypes = 'douyin'

export const DB_TABLE_TYPES = {
  douyin: {
    tables: ['tasks', 'tasks_danmu', 'tasks_users', 'tasks_gift'],
    db_views: {
      tasks: ['tasks_danmu', 'tasks_users', 'tasks_gift']
    }
  }
} as const

export type DbTableTypes = typeof DB_TABLE_TYPES

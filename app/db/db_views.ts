export type DbNameTypes = 'douyin'

export const DB_TABLE_TYPES = {
  douyin: {
    tables: ['tasks', 'tasks_danmu', 'tasks_users'],
    db_views: {
      tasks: ['tasks_danmu', 'tasks_users']
    }
  }
} as const

export type DbTableTypes = typeof DB_TABLE_TYPES

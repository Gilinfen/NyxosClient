import Database from '@tauri-apps/plugin-sql'
import { DB_VIEWS } from './db_views'

export type DbNameTypes = 'douyin'

export type DbTableTypes = {
  douyin: 'tasks' | 'danmu' | 'users'
}

export const getDbData = async ({ dbName }: { dbName: DbNameTypes }) => {
  return await Database.load(`sqlite:${dbName}.db`)
}

export const insertData = async <T extends object>({
  table,
  data,
  dbName
}: {
  table: DbTableTypes[DbNameTypes]
  data: Partial<T>
  dbName: DbNameTypes
}) => {
  const db = await getDbData({ dbName })

  const keys = Object.keys(data).join(', ')
  const placeholders = Object.keys(data)
    .map(() => '?')
    .join(', ')
  const values = Object.values(data)

  await db.execute(
    `INSERT INTO ${table} (${keys}) VALUES (${placeholders})`,
    values
  )
}
export const deleteData = async ({
  table,
  params,
  dbName
}: {
  dbName: DbNameTypes
  table: DbTableTypes[DbNameTypes]
  params?: {
    key: string
    value: number | string
  }
}) => {
  const db = await getDbData({ dbName })

  if (params) {
    const { key, value } = params
    await db.execute(`DELETE FROM ${table} WHERE ${key} = ?`, [value])
    console.log(`正在删除表: ${table}，条件: ${key} = ${value}`)
  } else {
    // 删除所有数据
    await db.execute(`DELETE FROM ${table}`)
    console.log(`正在删除表: ${table}，所有数据已被删除`)

    // 根据 DB_VIEWS 删除子表
    const subTables = DB_VIEWS[table as keyof typeof DB_VIEWS] || []
    for (const subTable of subTables) {
      await db.execute(`DELETE FROM ${subTable}`)
      console.log(`正在删除子表: ${subTable}，所有数据已被删除`)
    }
  }
}

export const updateData = async <T extends object>({
  table,
  data,
  qkey,
  db_id,
  dbName
}: {
  table: DbTableTypes[DbNameTypes]
  data: Partial<T>
  qkey: string
  db_id: number | string
  dbName: DbNameTypes
}) => {
  const db = await getDbData({ dbName })

  const setClause = Object.keys(data)
    .map(key => `${key} = ?`)
    .join(', ')
  const values = [...Object.values(data), db_id]

  await db.execute(`UPDATE ${table} SET ${setClause} WHERE ${qkey} = ?`, values)
}

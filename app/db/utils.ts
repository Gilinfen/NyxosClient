import Database from '@tauri-apps/plugin-sql'
import { DB_TABLE_TYPES, type DbNameTypes, type DbTableTypes } from './db_views'

export const getDbData = async ({ dbName }: { dbName: DbNameTypes }) => {
  return await Database.load(`sqlite:${dbName}.db`)
}

/**
 * 添加
 * @param param0
 */
export const insertData = async <T extends object>({
  table,
  data,
  dbName
}: {
  table: DbTableTypes[DbNameTypes]['tables'][number]
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
    `INSERT OR IGNORE INTO ${table} (${keys}) VALUES (${placeholders})`,
    values
  )
}

/**
 * 删除
 * @param param0
 */
export const deleteData = async ({
  table,
  params,
  dbName
}: {
  dbName: DbNameTypes
  table: DbTableTypes[DbNameTypes]['tables'][number]
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

    // 根据 DB_TABLE_TYPES 删除子表
    const subTables =
      DB_TABLE_TYPES[dbName].db_views[
        table as keyof DbTableTypes[DbNameTypes]['db_views']
      ] || []
    for (const subTable of subTables) {
      await db.execute(`DELETE FROM ${subTable}`)
      console.log(`正在删除子表: ${subTable}，所有数据已被删除`)
    }

    console.log(`正在删除表: ${table}`)
    await db.execute(`DELETE FROM ${table}`)
    console.log(`所有数据已被删除`)
  }
}

/**
 * 更新
 * @param param0
 */
export const updateData = async <T extends object>({
  table,
  data,
  qkey,
  db_id,
  dbName
}: {
  table: DbTableTypes[DbNameTypes]['tables'][number]
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

/**
 * 查询表的所有数据
 * @param table 表名
 * @param dbName 数据库名称
 * @returns 返回表中的所有数据
 */
export const getAllData = async <T>(
  table: DbTableTypes[DbNameTypes]['tables'][number],
  dbName: DbNameTypes
): Promise<T> => {
  const db = await getDbData({ dbName })
  const rows = await db.select(`SELECT * FROM ${table}`)
  return rows as T
}

/**
 * 根据字段查询表的所有数据
 * @param table 表名
 * @param field 字段名
 * @param value 字段值
 * @param dbName 数据库名称
 * @returns 返回表中符合条件的数据
 */
export const getDataByField = async <T>(
  table: DbTableTypes[DbNameTypes]['tables'][number],
  field: string,
  value: string | number,
  dbName: DbNameTypes
): Promise<T> => {
  const db = await getDbData({ dbName })
  const rows = await db.select(`SELECT * FROM ${table} WHERE ${field} = ?`, [
    value
  ])
  return rows as T
}

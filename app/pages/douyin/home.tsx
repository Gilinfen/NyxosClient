import { useEffect, useState } from 'react'

import BaseWebsocketAdmin from '~/components/BaseWebsocketAdmin'
import MessageConent from './MessageConent'
import { DanmuAreaChartComponent } from './DanmeFenxi'
import type {
  BaseWebsocketAdminProps,
  DanmuMessage,
  TaskListType
} from '~/components/BaseWebsocketAdmin/types'
import { Form, Select } from 'antd'
import { KeywordsCom } from '~/components/BaseWebsocketAdmin/UpdateLive'
import type { DouyinWebSocketTaskDb } from '~/db/douyin'
import { deleteData, getDbData, insertData, updateData } from '~/db/utils'
import { v4 as uuidV4 } from 'uuid'
import { delay } from '~/utils'
import { Message } from './message'

export default function DouyinPage() {
  const [online_count, setonlineCount] = useState<number>(0)
  const [barrage_ount, setbarrageCount] = useState<number>(0)
  const [messages_info, setmessagesInfo] = useState<DanmuMessage>()
  const [taskList, setTaskList] = useState<TaskListType[]>([])
  const [loading, setLoading] = useState<boolean>()
  const [messageTypeState, setmessageTypeState] = useState<
    {
      label: string
      value: keyof Message
    }[]
  >([])

  useEffect(() => {
    getTaskAll()
    const dy_message_types = new Message()
    const messageArray = []
    for (const key in dy_message_types) {
      const value = key as keyof typeof dy_message_types
      const messageType = dy_message_types[value]
      if (messageType.dev_status) {
        messageArray.push({
          label: messageType.label,
          value
        })
      }
    }
    setmessageTypeState(messageArray)
  }, [])

  const getDbTask = async () => {
    try {
      const db = await getDbData({ dbName: 'douyin' })

      const dbTasks = await db.select<DouyinWebSocketTaskDb[]>(
        'SELECT * FROM tasks'
      )
      return dbTasks
    } catch (error) {
      console.log(error)
    }
  }

  const getTaskAll = async () => {
    const res = await getWebsocketTask?.()
    if (Array.isArray(res)) {
      setTaskList(res)
    } else if (res) {
      setTaskList(state => [...state, res])
    }
  }

  const updateWebSocketTask: BaseWebsocketAdminProps['updateWebSocketTask'] =
    async (type, item) => {
      try {
        if (!item) return
        // 这里可以添加具体的任务处理逻辑
        console.log(`任务类型: ${type}`, item)
        // 示例: 根据任务类型执行不同的操作
        switch (type) {
          case 'add':
            const value = item as DouyinWebSocketTaskDb
            await insertData<DouyinWebSocketTaskDb>({
              dbName: 'douyin',
              table: 'tasks',
              data: {
                ...value,
                task_id: uuidV4(),
                app_type: 'douyin',
                task_status: 'disconnected',
                timestamp: Date.now()
              }
            })
            break
          case 'update':
            console.log('更新任务:', item)
            break
          case 'delete':
            console.log('删除任务:', item)
            await deleteData({
              table: 'tasks',
              dbName: 'douyin',
              params: {
                key: 'task_id',
                value: item.task_id
              }
            })
            break
          default:
            console.warn('未知操作类型')
            break
        }
        await getTaskAll()
      } catch (error) {
        console.error('操作失败:', error)
      }
    }

  const getWebsocketTask: BaseWebsocketAdminProps['getWebsocketTask'] =
    async task_id => {
      try {
        if (task_id) {
          return []
        }
        return await getDbTask()
      } catch (error) {
        console.error('获取任务失败:', error)
      }
    }

  const onSearch: BaseWebsocketAdminProps['onSearch'] = async () => {
    try {
      // 这里可以添加搜索逻辑
      console.log('执行搜索')
    } catch (error) {
      console.error('搜索失败:', error)
    }
  }

  const exportExcel: BaseWebsocketAdminProps['exportExcel'] = async () => {
    try {
      // 这里可以添加导出 Excel 的逻辑
      console.log('导出 Excel')
    } catch (error) {
      console.error('导出失败:', error)
    }
  }

  const importExcel: BaseWebsocketAdminProps['importExcel'] = async () => {
    try {
      // 这里可以添加导入 Excel 的逻辑
      console.log('导入 Excel')
    } catch (error) {
      console.error('导入失败:', error)
    }
  }

  const clearAllWebSocketTask: BaseWebsocketAdminProps['clearAllWebSocketTask'] =
    async () => {
      try {
        setLoading(true)
        await delay(2000)
        await deleteData({
          table: 'tasks',
          dbName: 'douyin'
        })
        await getTaskAll()
        setLoading(false)
        // 这里可以添加清除所有任务的逻辑
        console.log('清除所有 WebSocket 任务')
      } catch (error) {
        console.error('清除任务失败:', error)
      }
    }

  const disconnecItemtWebSocketTask = async (data: TaskListType) => {
    try {
      await delay(2000)
      // 这里可以添加断开单个任务的逻辑
      console.log('断开任务:', data)
    } catch (error) {
      console.error('断开任务失败:', error)
    }
  }

  const connectingItemtWebSocketTask = async (data: TaskListType) => {
    try {
      await delay(2000)

      // 这里可以添加断开单个任务的逻辑
      console.log('连接任务:', data)
    } catch (error) {
      console.error('连接任务失败:', error)
    }
  }

  const updateWebSocketTaskItem: BaseWebsocketAdminProps['updateWebSocketTaskItem'] =
    async (data, status) => {
      try {
        let newData = data
        newData.task_status = 'reconnecting'

        const updateDatafn = async (value: TaskListType) => {
          await updateData({
            table: 'tasks',
            data: value,
            qkey: 'task_id',
            dbName: 'douyin',
            db_id: value.task_id
          })
          await getTaskAll()
        }

        // 先更新 reconnecting
        await updateDatafn(newData)

        // 在执行后端逻辑
        switch (status) {
          case 'start':
            await connectingItemtWebSocketTask(data)
            newData.task_status = 'connecting'
            break

          case 'stop':
            await disconnecItemtWebSocketTask(data)
            newData.task_status = 'disconnected'
            break
          case 'reload':
            // 先执行断开连接
            await disconnecItemtWebSocketTask(data)
            await connectingItemtWebSocketTask(data)
            newData.task_status = 'connecting'
            break
          default:
            break
        }

        await updateDatafn(newData)
      } catch (error) {
        console.error('更新任务状态失败:', error)
      }
    }

  return (
    <>
      <BaseWebsocketAdmin
        taskList={taskList}
        loading={loading}
        app_type="douyin"
        updateWebSocketTask={updateWebSocketTask}
        getWebsocketTask={getWebsocketTask}
        MessageConent={({ data }) => <MessageConent data={data} />}
        MessageIconsArrCom={({ data }) => [
          <DanmuAreaChartComponent key={'chats'} data={data} />
        ]}
        AddFormItems={[
          <Form.Item<DouyinWebSocketTaskDb>
            label="选择消息类型"
            key={'message_type'}
            name="message_type"
            rules={[{ required: true, message: '请选择消息类型' }]}
          >
            <Select placeholder="请选择消息类型" options={messageTypeState} />
          </Form.Item>,
          <Form.Item
            key={'noStyle_key'}
            noStyle
            shouldUpdate={(prevValues, currentValues) =>
              prevValues.message_type !== currentValues.message_type
            }
          >
            {({ getFieldValue }) => {
              const messageType = getFieldValue(
                'message_type'
              ) as DouyinWebSocketTaskDb['message_type']

              switch (messageType) {
                case 'WebcastChatMessage':
                  return (
                    <Form.Item<DouyinWebSocketTaskDb>
                      label="过滤关键词"
                      key={'keywords'}
                      name="keywords"
                    >
                      <KeywordsCom />
                    </Form.Item>
                  )
                default:
                  return null
              }
            }}
          </Form.Item>
        ]}
        onSearch={onSearch}
        exportExcel={exportExcel}
        importExcel={importExcel}
        updateWebSocketTaskItem={updateWebSocketTaskItem}
        clearAllWebSocketTask={clearAllWebSocketTask}
        messages_info={messages_info}
        barrage_ount={barrage_ount}
        online_count={online_count}
      />
    </>
  )
}

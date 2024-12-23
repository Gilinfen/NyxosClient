import { useEffect, useRef, useState } from 'react'

// 导入 BaseWebsocketAdmin 组件
import BaseWebsocketAdmin from '~/components/BaseWebsocketAdmin'

// 导入类型定义
import type {
  BaseWebsocketAdminProps,
  TaskListType
} from '~/components/BaseWebsocketAdmin/types'
// 导入 Ant Design 的表单和选择组件
import { message } from 'antd'

// 导入抖音 WebSocket 任务数据库类型
import type { DouyinWebSocketTaskDb } from '~/db/douyin/index'
// 导入数据库操作工具函数
import { deleteData, getDbData, initDbdata } from '~/db/utils'
import { saveExcelFile } from '~/utils'

import { DouyinMessage } from './message/index'
import * as XLSX from 'xlsx'
import dayjs from 'dayjs'
import {
  AddFormItems,
  pubupdateWebSocketTaskItem,
  pubWebcastMemberListen,
  updateWebSocketTask
} from './sole'
import ListLiveMoom, {
  type ListLiveMoomType
} from '~/components/BaseWebsocketAdmin/ListLiveMoom'
import { DanmuAreaChartComponent } from './DanmeFenxi'
import { GiiftFenxi } from './GiiftFenxi'
import { pubtsListen } from './GiftMessageConent'
import { pubdamutsListen } from './MessageConent'

const MessageIconsArrComMemo = ({ data }: { data: TaskListType }) => [
  <DanmuAreaChartComponent key={'chats'} data={data} />, // 传递弹幕区域图表组件
  <GiiftFenxi key={'gift'} data={data} />
]

// 定义抖音页面组件
export default function DouyinPage() {
  // 定义任务列表状态
  const [taskList, setTaskList] = useState<TaskListType[]>([])
  // 定义加载状态
  const [loading, setLoading] = useState<boolean>()

  const timeRef = useRef<{
    barrageCountEffectItm: NodeJS.Timeout | null
  }>({
    barrageCountEffectItm: null
  })

  // 清理定时器
  useEffect(() => {
    return () => {
      timeRef.current?.barrageCountEffectItm &&
        clearInterval(timeRef.current?.barrageCountEffectItm)
    }
  }, [])

  // 使用副作用钩子获取任务和消息类型
  useEffect(() => {
    initDbdata().then(e => {
      getTaskAll() // 获取所有任务
    })
  }, [])

  const tsListenEffect: ListLiveMoomType['tsListenEffect'] = data => {
    // 弹幕
    pubdamutsListen(data)
    // 礼物
    pubtsListen(data)
    // 人员进入
    pubWebcastMemberListen(data, value => {
      const updatedTask: Partial<TaskListType> = {
        // 根据需要更新的字段
        task_id: value.task_id,
        online_count: value.online_count,
        messages_info: value.messages_info
      }
      setTaskList(prevList =>
        prevList.map(task =>
          task.task_id === updatedTask.task_id
            ? { ...task, ...updatedTask }
            : task
        )
      )
    })
  }

  // 从数据库获取任务
  const getDbTask = async () => {
    try {
      const db = await getDbData({ dbName: 'douyin' }) // 获取数据库连接

      const dbTasks = await db.select<DouyinWebSocketTaskDb[]>(
        'SELECT * FROM tasks' // 查询任务
      )
      return dbTasks // 返回任务列表
    } catch (error) {
      console.log(error) // 处理错误
    }
  }

  // 获取所有任务
  const getTaskAll = async () => {
    const res = await getWebsocketTask?.() // 获取 WebSocket 任务
    if (Array.isArray(res)) {
      setTaskList(res) // 更新任务列表
    } else if (res) {
      setTaskList(state => [...state, res]) // 将新任务添加到列表
    }
  }

  // 获取 WebSocket 任务
  const getWebsocketTask: BaseWebsocketAdminProps['getWebsocketTask'] =
    async task_id => {
      try {
        if (task_id) {
          return [] // 如果有任务 ID 返回空数组
        }
        return (await getDbTask()) as any[] // 获取数据库任务
      } catch (error) {
        console.error('获取任务失败:', error) // 处理错误
      }
    }

  // 搜索功能
  const onSearch: BaseWebsocketAdminProps['onSearch'] = async () => {
    try {
      // 这里可以添加搜索逻辑
      console.log('执行搜索') // 打印搜索执行信息
    } catch (error) {
      console.error('搜索失败:', error) // 处理错误
    }
  }

  // 导出 Excel 功能
  const exportExcel: BaseWebsocketAdminProps['exportExcel'] = async () => {
    try {
      // 这里可以添加导出 Excel 的逻辑
      const douyinmes = new DouyinMessage()
      // 创建工作表
      const ws = XLSX.utils.json_to_sheet(
        (taskList as unknown as DouyinWebSocketTaskDb[]).map(item => {
          return {
            任务ID: item.task_id,
            直播间名称: item.task_name,
            平台: '抖音',
            直播间地址: item.description,
            直播间描述: item.description,
            消息类型: douyinmes[item.message_type].label,
            关键词: item.keywords,
            创建时间: dayjs(item.timestamp).format('YYYY-MM-DD HH:mm:ss')
          }
        })
      )

      // 创建工作簿
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')

      // 导出为 Excel 文件
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
      await saveExcelFile(excelBuffer, `抖音所有任务.xlsx`)
      console.log('导出 Excel') // 打印导出信息
    } catch (error) {
      console.error('导出失败:', error) // 处理错误
    }
  }

  // 导入 Excel 功能
  const importExcel: BaseWebsocketAdminProps['importExcel'] = async () => {
    try {
      // 这里可以添加导入 Excel 的逻辑
      console.log('导入 Excel') // 打印导入信息
    } catch (error) {
      console.error('导入失败:', error) // 处理错误
    }
  }

  // 清除所有 WebSocket 任务
  const clearAllWebSocketTask: BaseWebsocketAdminProps['clearAllWebSocketTask'] =
    async () => {
      try {
        setLoading(true) // 设置加载状态为 true
        await deleteData({
          table: 'tasks',
          dbName: 'douyin' // 删除任务表中的所有任务
        })

        await getTaskAll() // 更新任务列表
        setLoading(false) // 设置加载状态为 false

        message.success('已清除所有任务')
        // 这里可以添加清除所有任务的逻辑
        console.log('清除所有 WebSocket 任务') // 打印清除任务信息
      } catch (error) {
        console.error('清除任务失败:', error) // 处理错误
      }
    }

  const addWebSocketTask: BaseWebsocketAdminProps['updateWebSocketTask'] =
    async (type, item) => {
      await updateWebSocketTask?.(type, item)
      await getTaskAll() // 更新任务列表
    }
  return (
    <>
      <BaseWebsocketAdmin
        loading={loading} // 传递加载状态
        app_type="douyin" // 传递应用类型
        updateWebSocketTask={addWebSocketTask} // 传递更新任务函数
        AddFormItems={AddFormItems}
        onSearch={onSearch} // 传递搜索函数
        exportExcel={exportExcel} // 传递导出 Excel 函数
        importExcel={importExcel} // 传递导入 Excel 函数
        clearAllWebSocketTask={clearAllWebSocketTask} // 传递清除所有任务函数
      >
        <ListLiveMoom
          data={taskList}
          tsListenEffect={tsListenEffect}
          AddFormItems={AddFormItems}
          MessageIconsArrCom={MessageIconsArrComMemo}
          updateWebSocketTask={addWebSocketTask}
          updateWebSocketTaskItem={pubupdateWebSocketTaskItem}
        />
      </BaseWebsocketAdmin>
    </>
  )
}

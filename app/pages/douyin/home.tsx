import { useState } from 'react'

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

export default function DouyinPage() {
  const [onlineCount, setonlineCount] = useState<number>(0)
  const [barrageCount, setbarrageCount] = useState<number>(0)
  const [messagesInfo, setmessagesInfo] = useState<DanmuMessage>({
    message: '11',
    messageId: '2232',
    userName: '231231',
    userUrl: '',
    userId: '123213'
  })

  const updateWebSocketTask: BaseWebsocketAdminProps['updateWebSocketTask'] =
    async (type, item) => {
      try {
        // 这里可以添加具体的任务处理逻辑
        console.log(`任务类型: ${type}`, item)
        // 示例: 根据任务类型执行不同的操作
        switch (type) {
          case 'add':
            console.log('添加任务:', item)
            break
          case 'update':
            console.log('更新任务:', item)
            break
          case 'delete':
            console.log('删除任务:', item)
            break
          default:
            console.warn('未知操作类型')
            break
        }
      } catch (error) {
        console.error('操作失败:', error)
      }
    }

  const getWebsocketTask: BaseWebsocketAdminProps['getWebsocketTask'] =
    async taskId => {
      try {
        // 这里可以添加获取任务的逻辑
        console.log(`获取任务: ${taskId}`)
        // 示例: 返回一个假任务
        return {
          taskId: taskId || 'defaultId',
          taskName: '示例任务',
          appType: 'douyin',
          liveUrl: 'https://live.douyin.com',
          status: 'connecting',
          messageType: 'text',
          timestamp: Date.now()
        } as TaskListType
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

  const updateWebSocketTaskItem: BaseWebsocketAdminProps['updateWebSocketTaskItem'] =
    async (data, status) => {
      try {
        // 这里可以添加更新任务状态的逻辑
        console.log(`更新任务状态: ${status}`, data)
      } catch (error) {
        console.error('更新任务状态失败:', error)
      }
    }

  const clearAllWebSocketTask: BaseWebsocketAdminProps['clearAllWebSocketTask'] =
    async () => {
      try {
        // 这里可以添加清除所有任务的逻辑
        console.log('清除所有 WebSocket 任务')
      } catch (error) {
        console.error('清除任务失败:', error)
      }
    }

  const disconnecItemtWebSocketTask: BaseWebsocketAdminProps['disconnecItemtWebSocketTask'] =
    async data => {
      try {
        // 这里可以添加断开单个任务的逻辑
        console.log('断开任务:', data)
      } catch (error) {
        console.error('断开任务失败:', error)
      }
    }

  return (
    <>
      <BaseWebsocketAdmin
        appType="douyin"
        disconnecItemtWebSocketTask={disconnecItemtWebSocketTask}
        updateWebSocketTask={updateWebSocketTask}
        getWebsocketTask={getWebsocketTask}
        MessageConent={({ data }) => <MessageConent data={data} />}
        MessageIconsArrCom={({ data }) => [
          <DanmuAreaChartComponent data={data} />
        ]}
        AddFormItems={[
          <Form.Item
            label="选择消息类型"
            name="messageType"
            rules={[{ required: true, message: '请选择消息类型' }]}
          >
            <Select placeholder="请选择消息类型" options={[]} />
          </Form.Item>,
          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) =>
              prevValues.messageType !== currentValues.messageType
            }
          >
            {({ getFieldValue }) => {
              const messageType = getFieldValue('messageType')
              switch (messageType) {
                default:
                  return (
                    <Form.Item label="过滤关键词" name="keywords">
                      <KeywordsCom />
                    </Form.Item>
                  )
              }
            }}
          </Form.Item>
        ]}
        onSearch={onSearch}
        exportExcel={exportExcel}
        importExcel={importExcel}
        updateWebSocketTaskItem={updateWebSocketTaskItem}
        clearAllWebSocketTask={clearAllWebSocketTask}
        messagesInfo={messagesInfo}
        barrageCount={barrageCount}
        onlineCount={onlineCount}
      />
    </>
  )
}

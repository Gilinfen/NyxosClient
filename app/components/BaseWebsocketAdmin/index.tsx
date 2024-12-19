import { useEffect, useState } from 'react'
import { Button, Flex, Divider, Empty, Skeleton, message } from 'antd'
import {
  AppstoreOutlined,
  DownloadOutlined,
  HolderOutlined,
  PlusOutlined,
  UploadOutlined
} from '@ant-design/icons'
import CardLiveMoom from './CardLiveMoom'
import SearchInput from './search'
import UpdateLive from './UpdateLive'
import type { BaseWebsocketAdminProps, TaskListType } from './types'

const BaseWebsocketAdmin: React.FC<BaseWebsocketAdminProps> = ({
  app_type,
  loading,
  taskList,
  barrage_ount,
  messages_info,
  MessageConent,
  MessageIconsArrCom,
  online_count,
  AddFormItems,
  updateWebSocketTask: _updateWebSocketTask,
  getWebsocketTask,
  onSearch,
  exportExcel: _exportExcel,
  importExcel: _importExcel,
  updateWebSocketTaskItem: _updateWebSocketTaskItem,
  clearAllWebSocketTask,
  LoginComProms
}) => {
  const [isList, setIsList] = useState(false)
  const [messageApi, contextHolder] = message.useMessage()

  const updateWebSocketTask: BaseWebsocketAdminProps['updateWebSocketTask'] =
    async (type, item) => {
      try {
        await _updateWebSocketTask?.(type, item)

        switch (type) {
          case 'add':
            messageApi.success('任务添加成功')
            break
          case 'update':
            messageApi.success('任务更新成功')
            break
          case 'delete':
            messageApi.success('任务删除成功')
            break
          default:
            messageApi.warning('未知操作类型')
            break
        }
        // getTaskAll()
      } catch (error: any) {
        messageApi.error(`操作失败: ${error?.message}`)
      }
    }

  const updateWebSocketTaskItem: BaseWebsocketAdminProps['updateWebSocketTaskItem'] =
    async (item, type) => {
      try {
        await _updateWebSocketTaskItem?.(item, type)

        switch (type) {
          case 'start':
            // 处理启动逻辑
            messageApi.success('任务已启动')
            break
          case 'stop':
            // 处理停止逻辑
            messageApi.success('任务已停止')
            break
          case 'reload':
            // 处理重载逻辑
            messageApi.success('任务已重载')
            break
          default:
            messageApi.warning('未知操作类型')
            break
        }
        // getTaskAll()
      } catch (error: any) {
        messageApi.error(`操作失败: ${error?.message}`)
      }
    }

  const exportExcel = () => {
    // 创建工作表
    // const ws = XLSX.utils.json_to_sheet(
    //   taskList.map(item => {
    //     return {
    //       任务ID: item.task_id,
    //       直播间名称: item.taskName,
    //       平台: 'apptypename',
    //       直播间地址: item.liveUrl,
    //       直播间描述: item.description,
    //       消息类型: 'messageType',
    //       关键词: item.keywords,
    //       创建时间: dayjs(item.timestamp).format('YYYY-MM-DD HH:mm:ss')
    //     }
    //   })
    // )
    // // 创建工作簿
    // const wb = XLSX.utils.book_new()
    // XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')
    // // 导出为 Excel 文件
    // const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    // const blob = new Blob([excelBuffer], { type: 'application/octet-stream' })
    // saveAs(blob, `${dayjs().format('YYYY-MM-DD HH:mm:ss')}.xlsx`)
    _exportExcel?.()
  }

  const importExcel = () => {
    console.log('importExcel')
    _importExcel?.()
  }

  return (
    <div className="p-4">
      {contextHolder}
      <Flex
        gap="small"
        justify="between"
        align="center"
        wrap="wrap"
        className="w-full"
      >
        <Flex gap="small" className="w-full">
          <Button
            icon={isList ? <AppstoreOutlined /> : <HolderOutlined />}
            onClick={() => setIsList(!isList)}
          >
            {isList ? '卡片' : '列表'}
          </Button>
          <UpdateLive
            type="add"
            key={'add_UpdateLive'}
            app_type={app_type}
            FormItems={AddFormItems}
            updateWebSocketTask={updateWebSocketTask}
            className="flex-1"
          >
            <Button type="primary" block icon={<PlusOutlined />}>
              添加直播间
            </Button>
          </UpdateLive>
          <Button icon={<DownloadOutlined />} onClick={exportExcel}>
            导出 Excel
          </Button>
          <Button icon={<UploadOutlined />} onClick={importExcel}>
            导入 Excel
          </Button>
          <Button danger onClick={clearAllWebSocketTask}>
            清空
          </Button>
        </Flex>
        <SearchInput onSearch={onSearch} />
      </Flex>
      <Divider />
      <Skeleton active loading={loading}>
        {!taskList.length ? (
          <Empty />
        ) : isList ? (
          // <ListLiveMoom
          //   data={taskList}
          //   onStart={item => handleStatus(item, 'start')}
          //   onStop={item => handleStatus(item, 'stop')}
          //   onDelete={item => updateWebSocketTask?.(item, 'delete')}
          //   onReload={item => handleStatus(item, 'reload')}
          // />
          <></>
        ) : (
          <Flex gap="middle" wrap="wrap" justify="space-between" align="start">
            {taskList.map(item => (
              <CardLiveMoom
                key={item.task_id}
                MessageConent={MessageConent}
                messages_info={messages_info}
                AddFormItems={AddFormItems}
                MessageIconsArrCom={MessageIconsArrCom}
                barrage_ount={barrage_ount}
                online_count={online_count}
                data={item}
                app_type={app_type}
                updateWebSocketTask={updateWebSocketTask}
                updateWebSocketTaskItem={updateWebSocketTaskItem}
                LoginComProms={LoginComProms}
              />
            ))}
          </Flex>
        )}
      </Skeleton>
    </div>
  )
}

export default BaseWebsocketAdmin

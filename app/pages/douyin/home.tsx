import { useEffect, useState } from 'react'

// 导入 BaseWebsocketAdmin 组件
import BaseWebsocketAdmin from '~/components/BaseWebsocketAdmin'
// 导入消息内容组件
import MessageConent from './MessageConent'
// 导入弹幕区域图表组件
import { DanmuAreaChartComponent } from './DanmeFenxi'
// 导入类型定义
import type {
  BaseWebsocketAdminProps,
  DanmuMessage,
  TaskListType
} from '~/components/BaseWebsocketAdmin/types'
// 导入 Ant Design 的表单和选择组件
import { Form, Select } from 'antd'
// 导入关键词组件
import { KeywordsCom } from '~/components/BaseWebsocketAdmin/UpdateLive'
// 导入抖音 WebSocket 任务数据库类型
import type { DouyinWebSocketTaskDb } from '~/db/douyin'
// 导入数据库操作工具函数
import { deleteData, getDbData, insertData, updateData } from '~/db/utils'
// 导入 UUID 生成器
import { v4 as uuidV4 } from 'uuid'
// 导入延迟工具函数
import { delay, poll } from '~/utils'
// 导入消息类
import { Message } from './message'
import { DouyinAPIEndpoints } from './urls'
import type { DouyinAPIEndpointsInterface } from './url_params/index'
import { makeRequest, objectToParams } from '~/utils/request'
import { DouyinCookieApi } from './api/cookie'
import DouyinBaseInject from './api/base'

// 定义抖音页面组件
export default function DouyinPage() {
  // 定义在线用户数量状态
  const [online_count, setonlineCount] = useState<number>(0)
  // 定义弹幕数量状态
  const [barrage_ount, setbarrageCount] = useState<number>(0)
  // 定义消息信息状态
  const [messages_info, setmessagesInfo] = useState<DanmuMessage>()
  // 定义任务列表状态
  const [taskList, setTaskList] = useState<TaskListType[]>([])
  // 定义加载状态
  const [loading, setLoading] = useState<boolean>()
  // 定义消息类型状态
  const [messageTypeState, setmessageTypeState] = useState<
    {
      label: string
      value: keyof Message
    }[]
  >([])

  // 定义登录 URL 状态
  const [loginUrl, setLoginUrl] = useState<string | undefined>()
  // 定义二维码过期状态
  const [loginStatus, setloginStatus] =
    useState<BaseWebsocketAdminProps['LoginComProms']['loginStatus']>(
      'loggedOut'
    )

  // 使用副作用钩子获取任务和消息类型
  useEffect(() => {
    getTaskAll() // 获取所有任务
    const dy_message_types = new Message() // 创建消息实例
    const messageArray = [] // 存储消息类型的数组
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
    setmessageTypeState(messageArray) //

    // DouyinBaseInject.getWebsocketUrl(
    //   'https://live.douyin.com/156392868120'
    // ).then(res => {
    //   console.log(res)
    // })
  }, [])

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

  // 更新 WebSocket 任务
  const updateWebSocketTask: BaseWebsocketAdminProps['updateWebSocketTask'] =
    async (type, item) => {
      try {
        if (!item) return // 如果没有任务项则返回
        // 这里可以添加具体的任务处理逻辑
        console.log(`任务类型: ${type}`, item) // 打印任务类型和项
        // 示例: 根据任务类型执行不同的操作
        switch (type) {
          case 'add':
            const value = item as DouyinWebSocketTaskDb // 将项转换为任务数据库类型
            await insertData<DouyinWebSocketTaskDb>({
              dbName: 'douyin',
              table: 'tasks',
              data: {
                ...value,
                task_id: uuidV4(), // 生成唯一任务 ID
                app_type: 'douyin',
                task_status: 'disconnected', // 初始状态为断开
                timestamp: Date.now() // 记录时间戳
              }
            })
            break
          case 'update':
            console.log('更新任务:', item) // 打印更新任务信息
            break
          case 'delete':
            console.log('删除任务:', item) // 打印删除任务信息
            await deleteData({
              table: 'tasks',
              dbName: 'douyin',
              params: {
                key: 'task_id',
                value: item.task_id // 根据任务 ID 删除任务
              }
            })
            break
          default:
            console.warn('未知操作类型') // 处理未知操作类型
            break
        }
        await getTaskAll() // 更新任务列表
      } catch (error) {
        console.error('操作失败:', error) // 处理错误
      }
    }

  // 获取 WebSocket 任务
  const getWebsocketTask: BaseWebsocketAdminProps['getWebsocketTask'] =
    async task_id => {
      try {
        if (task_id) {
          return [] // 如果有任务 ID 返回空数组
        }
        return await getDbTask() // 获取数据库任务
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
        await delay(2000) // 延迟 2 秒
        await deleteData({
          table: 'tasks',
          dbName: 'douyin' // 删除任务表中的所有任务
        })
        await getTaskAll() // 更新任务列表
        setLoading(false) // 设置加载状态为 false
        // 这里可以添加清除所有任务的逻辑
        console.log('清除所有 WebSocket 任务') // 打印清除任务信息
      } catch (error) {
        console.error('清除任务失败:', error) // 处理错误
      }
    }

  // 断开单个 WebSocket 任务
  const disconnecItemtWebSocketTask = async (data: TaskListType) => {
    try {
      await delay(2000) // 延迟 2 秒
      // 这里可以添加断开单个任务的逻辑
      console.log('断开任务:', data) // 打印断开任务信息
    } catch (error) {
      console.error('断开任务失败:', error) // 处理错误
    }
  }

  // 连接单个 WebSocket 任务
  const connectingItemtWebSocketTask = async (data: TaskListType) => {
    try {
      await delay(2000) // 延迟 2 秒

      // 这里可以添加连接单个任务的逻辑
      console.log('连接任务:', data) // 打印连接任务信息
    } catch (error) {
      console.error('连接任务失败:', error) // 处理错误
    }
  }

  // 更新 WebSocket 任务状态
  const updateWebSocketTaskItem: BaseWebsocketAdminProps['updateWebSocketTaskItem'] =
    async (data, status) => {
      try {
        let newData = data // 创建新数据对象
        newData.task_status = 'reconnecting' // 更新状态为重连

        // 更新数据库中的任务数据
        const updateDatafn = async (value: TaskListType) => {
          await updateData({
            table: 'tasks',
            data: value,
            qkey: 'task_id',
            dbName: 'douyin',
            db_id: value.task_id // 更新指定任务 ID 的数据
          })
          await getTaskAll() // 更新任务列表
        }

        // 先更新 reconnecting
        await updateDatafn(newData)

        // 在执行后端逻辑
        switch (status) {
          case 'start':
            await connectingItemtWebSocketTask(data) // 连接任务
            newData.task_status = 'connecting' // 更新状态为连接中
            break

          case 'stop':
            await disconnecItemtWebSocketTask(data) // 断开任务
            newData.task_status = 'disconnected' // 更新状态为断开
            break
          case 'reload':
            // 先执行断开连接
            await disconnecItemtWebSocketTask(data) // 断开任务
            await connectingItemtWebSocketTask(data) // 连接任务
            newData.task_status = 'connecting' // 更新状态为连接中
            break
          default:
            break
        }

        await updateDatafn(newData) // 更新数据库中的任务数据
      } catch (error) {
        console.error('更新任务状态失败:', error) // 处理错误
      }
    }

  // 处理二维码过期
  const onExpired: BaseWebsocketAdminProps['LoginComProms']['onExpired'] =
    async url => {
      // 这里可以添加刷新二维码的逻辑
      try {
        if (url) {
          // 刷新url
        }
        const qtburl =
          DouyinAPIEndpoints.SSO_DOMAIN.BASE_URL +
          DouyinAPIEndpoints.SSO_DOMAIN.ROUTERS.SSO_LOGIN_GET_QR

        const ttwid = await DouyinCookieApi.getTtwid()

        const params_obj: DouyinAPIEndpointsInterface['SSO_DOMAIN']['ROUTERS']['SSO_LOGIN_GET_QR']['params'] =
          {
            service: 'https://www.douyin.com',
            need_logo: false,
            need_short_url: false,
            passport_jssdk_version: '2.0.11',
            passport_jssdk_type: 'pro',
            aid: 6383,
            language: 'zh',
            account_sdk_source: 'sso',
            account_sdk_source_info:
              '7e276d64776172647760466a6b66707777606b667c273f3435292772606761776c736077273f63646976602927666d776a686061776c736077273f63646976602927766d60696961776c736077273f63646976602927756970626c6b76273f302927756077686c76766c6a6b76273f5e7e276b646860273f276b6a716c636c6664716c6a6b762729277671647160273f2761606b6c606127785829276c6b6b60774d606c626d71273f3c303d29276c6b6b6077526c61716d273f3c353c29276a707160774d606c626d71273f3435323c29276a70716077526c61716d273f3432373d292776716a64776260567164717076273f7e276c6b61607d60614147273f7e276c6167273f276a676f6066712729276a75606b273f2763706b66716c6a6b2729276c6b61607d60614147273f276a676f6066712729274c41474e607c57646b6260273f2763706b66716c6a6b2729276a75606b4164716467647660273f27706b6160636c6b60612729276c7656646364776c273f636469766029276d6476436071666d273f6364697660782927696a66646956716a77646260273f7e276c76567075756a77714956716a77646260273f717770602927766c7f60273f32353d3c30292772776c7160273f7177706078292776716a7764626054706a7164567164717076273f7e277076646260273f373431313034292774706a7164273f303c33323c32303035303c3729276c7655776c73647160273f6364697660787829277260676269273f7e2773606b616a77273f27426a6a626960254c6b662b252d44757569602c27292777606b6160776077273f27444b424940252d44757569602925444b4249402548607164692557606b61607760773f2544757569602548342548647d2925506b767560666c636c606125536077766c6a6b2c277829276b6a716c636c6664716c6a6b556077686c76766c6a6b273f2761606b6c6061272927756077636a7768646b6660273f7e27716c68604a776c626c6b273f34323631303d3c3335363536362b322927707660614f564d606475566c7f60273f37323c34323c303c3729276b64736c6264716c6a6b516c686c6b62273f7e276160666a616061476a617c566c7f60273f3d32343534372927606b71777c517c7560273f276b64736c6264716c6a6b2729276c6b6c716c64716a77517c7560273f276b64736c6264716c6a6b2729276b646860273f276d717175763f2a2a7272722b616a707c6c6b2b666a682a3a7760666a6868606b61383427292777606b61607747696a666e6c6b62567164717076273f276b6a6b2867696a666e6c6b62272927766077736077516c686c6b62273f276c6b6b60772971715a6462722966616b286664666d602960616260296a776c626c6b272927627069605671647771273f3330332b333c3c3c3c3c3c373d3132313129276270696041707764716c6a6b273f34372b323535353535353132333d3632343378782927776074706076715a6d6a7671273f277272722b616a707c6c6b2b666a68272927776074706076715a7564716d6b646860273f272a27292767776a72766077273f7e7878',
            passport_ztsdk: '3.0.32-merge.8',
            passport_verify: '1.0.17',
            request_host: 'https://www.douyin.com',
            biz_trace_id: '5d6d30bd',
            device_platform: 'web_app',
            msToken:
              'KT6fLqz9WW6oHu9NBnTntpY6XUpQ3flQLpk3fb_lCOgNg9s4wSDJQJM30BHU2pKOwJTCx6GFnaAPGZJCfP5MB4gAfTQKIjIVjb4I6WIDP5fPycmcMG3R-fEkoOHYhd2pzMl0r8a0LBz8duYWbIZoeyPd3s6HMxOd1dLNyPYNxQ-I1p0N5uQAUeY=',
            a_bogus: ''
          }
        // @ts-ignore
        delete params_obj.a_bogus
        const ua =
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'

        params_obj.a_bogus = await DouyinBaseInject.getABougus16X(
          objectToParams(params_obj),
          ua
        )

        const params = objectToParams(params_obj)
        const qutl = `${qtburl}?${params}`
        const res = await makeRequest<any>({
          url: qutl,
          headers: {
            cookie: `ttwid=${ttwid}`
          }
        })

        const quurl = res?.[0]?.data.qrcode_index_url
        const token = res?.[0]?.data.token

        // 请求获取url
        setLoginUrl(quurl)
        setloginStatus('loggedOut')

        const check_qrconnect_url_ =
          DouyinAPIEndpoints.SSO_DOMAIN.BASE_URL +
          DouyinAPIEndpoints.SSO_DOMAIN.ROUTERS.SSO_LOGIN_CHECK_QR

        const check_qrconnect_params: DouyinAPIEndpointsInterface['SSO_DOMAIN']['ROUTERS']['SSO_LOGIN_CHECK_QR']['params'] =
          {
            ...params_obj,
            token,
            is_frontier: false
          }
        const check_qrconnect_url = `${check_qrconnect_url_}?${objectToParams(
          check_qrconnect_params
        )}`
        poll(async () => {
          const res = await makeRequest<
            DouyinAPIEndpointsInterface['SSO_DOMAIN']['ROUTERS']['SSO_LOGIN_CHECK_QR']['response']
          >({
            url: check_qrconnect_url,
            headers: {
              cookie: `ttwid=${ttwid}`
            }
          })
          const log_status = res[0].data.status
          switch (log_status) {
            case '1':
              setloginStatus('loggedOut')
              return false

            case '2':
              setloginStatus('scanned')
              return true

            case '5':
              setloginStatus('qrExpired')
              return true

            default:
              return false
          }
        }, 1000)
      } catch (error) {
        console.error('刷新二维码失败:', error) // 处理错误
      }
    }

  return (
    <>
      <BaseWebsocketAdmin
        taskList={taskList} // 传递任务列表
        loading={loading} // 传递加载状态
        app_type="douyin" // 传递应用类型
        updateWebSocketTask={updateWebSocketTask} // 传递更新任务函数
        getWebsocketTask={getWebsocketTask} // 传递获取任务函数
        MessageConent={({ data }) => <MessageConent data={data} />} // 传递消息内容组件
        MessageIconsArrCom={({ data }) => [
          <DanmuAreaChartComponent key={'chats'} data={data} /> // 传递弹幕区域图表组件
        ]}
        AddFormItems={[
          <Form.Item<DouyinWebSocketTaskDb>
            label="选择消息类型" // 表单项标签
            key={'message_type'}
            name="message_type"
            rules={[{ required: true, message: '请选择消息类型' }]} // 表单验证规则
          >
            <Select placeholder="请选择消息类型" options={messageTypeState} />{' '}
            // 选择消息类型
          </Form.Item>,
          <Form.Item
            key={'noStyle_key'}
            noStyle
            shouldUpdate={
              (prevValues, currentValues) =>
                prevValues.message_type !== currentValues.message_type // 监听消息类型变化
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
                      label="过滤关键词" // 表单项标签
                      key={'keywords'}
                      name="keywords"
                    >
                      <KeywordsCom /> // 关键词组件
                    </Form.Item>
                  )
                default:
                  return null // 默认返回 null
              }
            }}
          </Form.Item>
        ]}
        onSearch={onSearch} // 传递搜索函数
        exportExcel={exportExcel} // 传递导出 Excel 函数
        importExcel={importExcel} // 传递导入 Excel 函数
        updateWebSocketTaskItem={updateWebSocketTaskItem} // 传递更新任务状态函数
        clearAllWebSocketTask={clearAllWebSocketTask} // 传递清除所有任务函数
        messages_info={messages_info} // 传递消息信息
        barrage_ount={barrage_ount} // 传递弹幕数量
        online_count={online_count} // 传递在线用户数量
        LoginComProms={{
          loginStatus, // 传递二维码过期状态
          loginUrl, // 传递登录 URL
          onExpired // 传递二维码过期处理函数
        }}
      />
    </>
  )
}

import { useEffect, useState } from 'react'
import CardLiveMoom, {
  type CardLiveMoomProps
} from '~/components/BaseWebsocketAdmin/CardLiveMoom'
import type {
  BaseWebsocketAdminProps,
  TaskListType
} from '~/components/BaseWebsocketAdmin/types'
import MessageConent from './MessageConent'
import type { DouyinWebSocketTaskDb, DouyinWebSocketUserDb } from '~/db/douyin'
import { Form, message, Select } from 'antd'
import DouyinBaseInject from './api/base'
import { getUserAgent } from '~/common/api'
import { close_to_websocket, connect_to_websocket } from '~/utils/websocket'
import { DouyinCookieApi } from './api/cookie'
import {
  getDataByField,
  insertData,
  updateData,
  deleteData,
  initDbdata
} from '~/db/utils'
import { KeywordsCom } from '~/components/BaseWebsocketAdmin/UpdateLive'
import type { DouyinMessageType } from '~/db/douyin/message'
import { DouyinMessage } from './message'
import type { DouyinAPIEndpointsInterface } from './url_params'
import { makeRequest, objectToParams } from '~/utils/request'
import { poll } from '~/utils'
import { DouyinAPIEndpoints } from './urls'
import { tsListen } from '~/utils/listen'
import clsx from 'clsx'
import GiftVideo from './GiftVideo'

export const AddFormItems = () => {
  // 定义消息类型状态
  const [messageTypeState, setmessageTypeState] = useState<
    {
      label: string
      value: keyof DouyinMessageType
    }[]
  >([])

  // 使用副作用钩子获取任务和消息类型
  useEffect(() => {
    const dy_message_types = new DouyinMessage() // 创建消息实例
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
  }, [])

  return (
    <>
      <Form.Item<DouyinWebSocketTaskDb>
        label="选择消息类型" // 表单项标签
        key={'message_type'}
        name="message_type"
        rules={[{ required: true, message: '请选择消息类型' }]} // 表单验证规则
      >
        <Select placeholder="请选择消息类型" options={messageTypeState} />
      </Form.Item>
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
            case 'DouyinWebcastChatMessage':
              return (
                <Form.Item<DouyinWebSocketTaskDb>
                  label="过滤关键词" // 表单项标签
                  key={'keywords'}
                  name="keywords"
                >
                  <KeywordsCom />
                </Form.Item>
              )
            default:
              return null // 默认返回 null
          }
        }}
      </Form.Item>
    </>
  )
}

// 断开单个 WebSocket 任务
export const disconnecItemtWebSocketTask = async (data: TaskListType) => {
  try {
    await close_to_websocket({
      task_id: data.task_id
    })
    // 这里可以添加断开单个任务的逻辑
    console.log('断开任务:', data) // 打印断开任务信息
  } catch (error) {
    console.error('断开任务失败:', error) // 处理错误
  }
}

// 连接单个 WebSocket 任务
export const connectingItemtWebSocketTask = async (data: TaskListType) => {
  try {
    const wsurl = await DouyinBaseInject.getWebsocketUrl(data.live_url)

    if (!wsurl) return
    // 房间ID
    const userAgent = await getUserAgent()
    const ttwid = await DouyinCookieApi.getTtwid()

    await connect_to_websocket({
      url: wsurl.wsurl,
      task_id: data.task_id,
      headers: {
        cookie: `ttwid=${ttwid}`,
        'user-agent': userAgent
      }
    })

    // 这里可以添加连接单个任务的逻辑
    console.log('连接任务:', data) // 打印连接任务信息
    message.success('连接成功')
  } catch (error) {
    console.error('连接任务失败:', error) // 处理错误
    message.error('连接失败')
  }
}

// 更新 WebSocket 任务状态
export const pubupdateWebSocketTaskItem: BaseWebsocketAdminProps['updateWebSocketTaskItem'] =
  async (data, status) => {
    try {
      let value = data as unknown as DouyinWebSocketTaskDb // 创建新数据对象

      // 在执行后端逻辑
      switch (status) {
        case 'start':
          await connectingItemtWebSocketTask(data) // 连接任务
          value.task_status = 'connecting' // 更新状态为连接中
          break

        case 'stop':
          await disconnecItemtWebSocketTask(data) // 断开任务
          value.task_status = 'disconnected' // 更新状态为断开
          break

        case 'reload':
          // 先执行断开连接
          await disconnecItemtWebSocketTask(data) // 断开任务
          await connectingItemtWebSocketTask(data) // 连接任务
          value.task_status = 'connecting' // 更新状态为连接中
          break
        default:
          break
      }

      await updateData({
        table: 'tasks',
        data: {
          message_type: value.message_type,
          keywords: value.keywords,
          task_name: value.task_name,
          live_url: value.live_url,
          description: value.description,
          task_id: value.task_id, // 生成唯一任务 ID
          task_status: value.task_status, // 初始状态为断开
          timestamp: value.timestamp // 记录时间戳
        },
        qkey: 'task_id',
        dbName: 'douyin',
        db_id: value.task_id // 更新指定任务 ID 的数据
      })
      message.success('更新任务状态成功')
    } catch (error) {
      console.error('更新任务状态失败:', error) // 处理错误
      message.error('更新任务状态失败')
    }
  }

export const pubWebcastMemberListen = (
  task: TaskListType,
  callback?: (value: TaskListType) => void
) => {
  tsListen<DouyinMessageType['DouyinWebcastMemberMessage']['payload']>(
    'DouyinWebcastMemberMessage',
    async val => {
      const payload = val.payload
      if (payload && payload.task_id === task.task_id) {
        const menber: DouyinWebSocketUserDb = {
          ...payload,
          task_id: task.task_id,
          timestamp: Date.now()
        }

        callback?.({
          ...task,
          online_count: payload.member_count,
          messages_info: {
            ...menber,
            user_url: `https://www.douyin.com/user/${menber.user_id}`,
            message: '进人直播间',
            message_id: payload.message_id
          }
        })

        // await insertData<DouyinWebSocketUserDb>({
        //   table: 'tasks_users',
        //   data: {
        //     user_id: menber.user_id,
        //     task_id: menber.task_id,
        //     timestamp: menber.timestamp,
        //     user_name: menber.user_name
        //   },
        //   dbName: 'douyin' // 请替换为实际的数据库名称
        // })
      }
    }
  )
}

// 更新 WebSocket 任务
export const updateWebSocketTask: BaseWebsocketAdminProps['updateWebSocketTask'] =
  async (type, item) => {
    try {
      if (!item) return // 如果没有任务项则返回
      // 这里可以添加具体的任务处理逻辑
      console.log(`任务类型: ${type}`, item) // 打印任务类型和项
      // 示例: 根据任务类型执行不同的操作
      switch (type) {
        case 'add':
          const value = item as unknown as DouyinWebSocketTaskDb // 将项转换为任务数据库类型
          await insertData<DouyinWebSocketTaskDb>({
            dbName: 'douyin',
            table: 'tasks',
            data: {
              message_type: value.message_type,
              keywords: value.keywords,
              task_name: value.task_name,
              live_url: value.live_url,
              description: value.description,
              task_id: value.task_id, // 生成唯一任务 ID
              task_status: value.task_status, // 初始状态为断开
              timestamp: value.timestamp // 记录时间戳
            }
          })
          break
        case 'update':
          console.log('更新任务:', item) // 打印更新任务信息
          break
        case 'delete':
          console.log('删除任务:', item) // 打印删除任务信息
          // 先执行断开连接
          await disconnecItemtWebSocketTask(item) // 断开任务

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
    } catch (error) {
      console.error('操作失败:', error) // 处理错误
    }
  }

export default function Sole({ task_id }: { task_id?: string }) {
  const [task, setTask] = useState<TaskListType>()
  const [loading, setLoading] = useState(false)
  const [loginLoading, setloginLoading] = useState(false)

  const getTask = async () => {
    let ptask_id = task_id
    if (!ptask_id) {
      ptask_id =
        new URLSearchParams(window.location.search).get('task_id') || ''
    }
    if (!ptask_id) {
      message.error('ID 错误')
      return
    }

    getDataByField<TaskListType[]>('tasks', 'task_id', ptask_id, 'douyin').then(
      res => {
        if (!res?.[0]) return
        setTask(res[0])
      }
    )
  }

  // 使用副作用钩子获取任务和消息类型
  useEffect(() => {
    initDbdata().then(e => {
      getTask()
    })
  }, [])

  // 更新 WebSocket 任务
  const _updateWebSocketTask: BaseWebsocketAdminProps['updateWebSocketTask'] =
    async (type, item) => {
      try {
        await updateWebSocketTask?.(type, item)
        await getTask() // 更新任务列表
      } catch (error) {
        console.error('操作失败:', error) // 处理错误
      }
    }

  // 更新 WebSocket 任务状态
  const updateWebSocketTaskItem: BaseWebsocketAdminProps['updateWebSocketTaskItem'] =
    async (data, status) => {
      try {
        setLoading(true)
        await pubupdateWebSocketTaskItem?.(data, status)
        await getTask()
        setLoading(false)
        message.success('更新任务状态成功')
      } catch (error) {
        console.error('更新任务状态失败:', error) // 处理错误
        message.error('更新任务状态失败')
      }
    }

  const updateTaskById = (updatedValues: Partial<TaskListType>) => {
    if (!task) return
    setTask({
      ...task,
      ...updatedValues
    })
  }

  useEffect(() => {
    if (!task) return
    pubWebcastMemberListen(task, value => {
      updateTaskById(value)
    })
  }, [task])

  // 处理二维码过期
  const onExpired: CardLiveMoomProps['LoginComProms']['onExpired'] =
    async data => {
      setloginLoading(true)
      // 这里可以添加刷新二维码的逻辑
      try {
        if (data.live_url) {
          // 刷新url
        }
        const qtburl = DouyinAPIEndpoints.SSO_DOMAIN.ROUTERS.SSO_LOGIN_GET_QR

        const ttwid = await DouyinCookieApi.getTtwid()
        const msToken = await DouyinBaseInject.getmsToken()

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
            msToken,
            a_bogus: ''
          }
        // @ts-ignore
        delete params_obj.a_bogus
        const userange = await getUserAgent()

        params_obj.a_bogus = await DouyinBaseInject.getABougus16X(
          objectToParams(params_obj),
          userange
        )

        const params = objectToParams(params_obj)
        const qutl = `${qtburl}?${params}`
        const res = await makeRequest<any>({
          url: qutl,
          headers: {
            cookie: `ttwid=${ttwid}`,
            'user-agent': userange
          }
        })

        const quurl = res?.[0]?.data.qrcode_index_url
        const token = res?.[0]?.data.token

        updateTaskById({
          loginUrl: quurl,
          loginStatus: 'loggedOut'
        })

        const check_qrconnect_url_ =
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

        // 轮询
        poll(async () => {
          // 取消
          if (data.loginStatus === 'cancel') return true
          const res = await makeRequest<
            DouyinAPIEndpointsInterface['SSO_DOMAIN']['ROUTERS']['SSO_LOGIN_CHECK_QR']['response']
          >({
            url: check_qrconnect_url,
            headers: {
              cookie: `ttwid=${ttwid}`
            }
          })
          const error_code = res[0].error_code
          // 身份验证
          if (error_code === 2046) {
            return true
          }
          // 正常
          const log_status = res[0].data.status
          switch (log_status) {
            case '1':
              updateTaskById({
                loginUrl: quurl,
                loginStatus: 'loggedOut'
              })
              return false

            case '2':
              updateTaskById({
                loginUrl: quurl,
                loginStatus: 'scanned'
              })
              return true

            case '5':
              updateTaskById({
                loginUrl: quurl,
                loginStatus: 'qrExpired'
              })
              return true

            default:
              return false
          }
        }, 1000)
      } catch (error) {
        console.error('刷新二维码失败:', error) // 处理错误
      }
    }

  const qtloginClose: CardLiveMoomProps['LoginComProms']['onClose'] = data => {
    updateTaskById({
      loginStatus: 'cancel',
      loginUrl: void 0
    })
    setloginLoading(false)
  }

  return (
    <>
      <GiftVideo />
      {task && (
        <CardLiveMoom
          isCole={!task_id}
          className={clsx(!task_id && 'w-[370px]')}
          loading={loading}
          loginLoading={loginLoading}
          MessageConent={
            <MessageConent
              updateWebSocketTaskItem={updateWebSocketTaskItem}
              data={task}
            />
          }
          AddFormItems={AddFormItems}
          data={task}
          app_type={'douyin'}
          updateWebSocketTask={_updateWebSocketTask}
          updateWebSocketTaskItem={updateWebSocketTaskItem}
          LoginComProms={{
            onExpired, // 传递二维码过期处理函数
            onClose: qtloginClose
          }}
          barrageCountProps={{
            barrageCount: 0
          }}
        />
      )}
    </>
  )
}

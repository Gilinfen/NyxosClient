import {
  SettingOutlined,
  DeleteOutlined,
  TikTokOutlined,
  MessageOutlined,
  LoadingOutlined,
  ScanOutlined,
  TeamOutlined,
  BoldOutlined,
  ReloadOutlined,
  CommentOutlined
} from '@ant-design/icons'
import {
  Button,
  Card,
  Empty,
  Flex,
  Input,
  Popconfirm,
  Popover,
  QRCode,
  Space,
  Tooltip
} from 'antd'
import { motion } from 'framer-motion'
import { useEffect, useMemo, useState, type ReactNode } from 'react'
import cn from 'classnames'
import UpdateLive from './UpdateLive'
import type { BaseWebsocketAdminProps, TaskListType } from './types'

export const Setting = () => {
  return (
    <Tooltip title="编辑">
      <Button
        type="text"
        className="scale-[1.5] mt-[.2rem] "
        icon={<SettingOutlined />}
      />
    </Tooltip>
  )
}

const Reload = ({
  data,
  updateWebSocketTaskItem
}: {
  data: CardLiveMoomProps['data']
  updateWebSocketTaskItem: CardLiveMoomProps['updateWebSocketTaskItem']
}) => {
  const [isReloading, setIsReloading] = useState(false)

  const handleReload = async () => {
    setIsReloading(true)
    await updateWebSocketTaskItem?.(data, 'reload')
    setIsReloading(false)
  }

  return (
    <Tooltip title="刷新重启">
      <Button
        loading={isReloading}
        type="text"
        className="scale-[1.5] mt-[.2rem] "
        onClick={handleReload}
        icon={<ReloadOutlined />}
      />
    </Tooltip>
  )
}

export const ChatItem = ({
  messages_info,
  width,
  className,
  isAdmin
}: {
  messages_info?: BaseWebsocketAdminProps['messages_info']
  className?: string
  width?: string
  isAdmin?: boolean
}) => {
  // const user_url = `https://www.douyin.com/user/${messages_info?.user_id}?from_tab_name=live`

  return (
    <motion.div
      style={{ width }}
      {...(isAdmin
        ? {}
        : {
            initial: {
              opacity: 0,
              y: 100
            },
            animate: {
              opacity: 1,
              y: 0
            },
            transition: {
              duration: 1
            }
          })}
    >
      <Flex gap="small" className={cn('mb-[1rem] ', className)} wrap="wrap">
        <Flex gap="small" align="center">
          <a href={messages_info?.user_url} target="_blank" rel="noreferrer">
            {messages_info?.user_name}
          </a>
        </Flex>
        <Flex
          gap="small"
          justify="start"
          align="start"
          className={cn(' w-full')}
        >
          <Flex
            justify="center"
            align="center"
            className="relative rounded-[50%] bg-[#f1f3f5] w-[2.5rem] h-[2.5rem] "
          >
            <div className="absolute top-0 left-0 w-[2.5rem] h-[2.5rem] rounded-[50%] border-[.2rem] border-[#cdcdcd] flex items-center justify-center" />
            <ScanOutlineComponent
              url={messages_info?.user_url}
              title={messages_info?.user_name}
              className={'scale-[1.5]'}
            />
          </Flex>
          <Flex
            justify="start"
            align="center"
            className="bg-[#f1f3f5] min-h-[2.5rem] min-w-[2.5rem] flex-1 p-[.5rem] rounded-2xl   "
            wrap="wrap"
          >
            {messages_info?.message}
          </Flex>
        </Flex>
      </Flex>
    </motion.div>
  )
}

export const getActions = ({
  data,
  app_type,
  AddFormItems,
  updateWebSocketTask,
  updateWebSocketTaskItem
}: Omit<
  CardLiveMoomProps,
  'MessageIconsArrCom' | 'messages_info' | 'LoginComProms'
>): React.ReactNode[] => {
  return [
    <UpdateLive
      key="edit_UpdateLive"
      type="update"
      app_type={app_type}
      FormItems={AddFormItems}
      updateWebSocketTask={async (type, item) =>
        updateWebSocketTask?.(type, item)
      }
      data={{
        ...data
      }}
    >
      <Setting />,
    </UpdateLive>,
    <Flex key="expand" justify="center" align="center">
      <Reload data={data} updateWebSocketTaskItem={updateWebSocketTaskItem} />
    </Flex>,
    <Flex
      key="delete"
      justify="center"
      align="center"
      className="text-[#df4257] cursor-pointer h-full"
    >
      <Tooltip title="删除任务">
        <Popconfirm
          title="删除任务（不可逆）"
          description={
            <>
              <li>此操作会关闭当前连接</li>
              <li>以及当前任务所有数据</li>
            </>
          }
          onConfirm={() => updateWebSocketTask?.('delete', data)}
          okText="确定"
          cancelText="取消"
        >
          <Button
            danger
            type="text"
            className="scale-[1.5] mt-[.2rem] "
            icon={<DeleteOutlined />}
          />
        </Popconfirm>
      </Tooltip>
    </Flex>
  ]
}

const appTypeOptions: {
  [key in TaskListType['app_type']]: ReactNode
} = {
  douyin: <TikTokOutlined className="scale-[1.5]" />,
  tiktok: <TikTokOutlined className="scale-[1.5]" />
}

const LiveImage = ({ data }: { data: TaskListType }) => {
  return (
    <div className=" text-[var(--g-active-color)] flex w-[2rem] h-[2rem] items-center justify-center  rounded-[50%] border-[.2rem] border-[#282a35] ">
      {appTypeOptions[data.app_type]}
    </div>
  )
}

export const LiveLive = ({ data }: { data: TaskListType }) => {
  return (
    <motion.div className="relative  cursor-pointer">
      <div className="w-[2.5rem] h-[2.5rem] rounded-[50%] border-[.2rem] border-[#df4257] flex items-center justify-center">
        <motion.div
          className="w-[2rem] h-[2rem] rounded-[50%]"
          animate={{ scale: [1, 0.9, 1] }}
          transition={{ duration: 1.2, ease: 'linear', repeat: Infinity }}
        >
          <LiveImage data={data} />
        </motion.div>
      </div>
      <motion.div
        className=" absolute top-0 left-0 w-[2.5rem] h-[2.5rem] rounded-[50%] border-[.2rem] border-[#df4257] flex items-center justify-center"
        animate={{
          scale: [1, 1, 1.2],
          opacity: [0, 1, 0]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'linear',
          repeatDelay: 0 // 确保动画结束后没有闪动
        }}
      />
      <motion.div
        className=" absolute top-0 left-0 w-[2.5rem] h-[2.5rem] rounded-[50%] border-[.2rem] border-[#df4257] flex items-center justify-center"
        animate={{
          scale: [1, 1, 1.3],
          opacity: [0, 0.5, 0]
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: 'linear',
          repeatDelay: 0 // 确保动画结束后没有闪动
        }}
      />
      <div className=" absolute w-[2rem] bottom-[-.2rem] left-[50%] translate-x-[-50%] text-[.4rem]  text-center text-[#fff] bg-[#df4257] rounded-sm ">
        直播中
      </div>
    </motion.div>
  )
}

export const LiveLoading = ({
  data,
  updateWebSocketTaskItem
}: {
  data: TaskListType
  updateWebSocketTaskItem?: BaseWebsocketAdminProps['updateWebSocketTaskItem']
}) => {
  return (
    <Flex
      gap="small"
      align="center"
      className="relative cursor-pointer"
      onClick={() => {
        if (data.task_status === 'disconnected') {
          updateWebSocketTaskItem?.(data, 'start')
        } else {
          updateWebSocketTaskItem?.(data, 'stop')
        }
      }}
    >
      <Tooltip
        title={`${
          data.task_status === 'disconnected' ? '点击开启' : '点击暂停'
        }`}
      >
        <motion.div>
          {data.task_status === 'connecting' ? (
            <LiveLive data={data} />
          ) : (
            <LiveImage data={data} />
          )}
        </motion.div>
      </Tooltip>
    </Flex>
  )
}

export interface CardLiveMoomProps {
  data: TaskListType
  app_type: BaseWebsocketAdminProps['app_type']
  LoginComProms: BaseWebsocketAdminProps['LoginComProms']
  /**
   * message 自定义内容
   */
  MessageConent: BaseWebsocketAdminProps['MessageConent']
  MessageIconsArrCom: BaseWebsocketAdminProps['MessageIconsArrCom']
  AddFormItems?: BaseWebsocketAdminProps['AddFormItems']
  online_count: BaseWebsocketAdminProps['online_count']
  barrage_ount: BaseWebsocketAdminProps['barrage_ount']
  messages_info: BaseWebsocketAdminProps['messages_info']
  updateWebSocketTask?: BaseWebsocketAdminProps['updateWebSocketTask']
  updateWebSocketTaskItem?: BaseWebsocketAdminProps['updateWebSocketTaskItem']
}

export const CardTitle = ({ data }: { data: TaskListType }) => {
  return (
    <Flex gap="small" align="center" justify="start" className="">
      {/* {!data.isAnonymous ? (
        <Flex className="text-[#368c14]">
          <InsuranceOutlined className="scale-[1.2]  " />
        </Flex>
      ) : (
        <NumberOutlined className="scale-[1.2]  " />
      )} */}
      <ScanOutlineComponent url={data.live_url} title="扫码进入直播间" />
      <Tooltip title={`点击进入直播间`}>
        <a
          className="text-[#000] hover:text-[var(--g-active-color)] cursor-pointer "
          href={data.live_url}
          target="_blank"
          rel="noreferrer"
        >
          {data.task_name}
        </a>
      </Tooltip>
    </Flex>
  )
}

export const Duration = ({ data }: { data: TaskListType }) => {
  const [duration, setDuration] = useState('00:00:00')

  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now()
      const diff = now - data.timestamp

      const seconds = Math.floor(diff / 1000)
      const minutes = Math.floor(seconds / 60)
      const hours = Math.floor(minutes / 60)

      const formatNumber = (num: number) => num.toString().padStart(2, '0')

      const text = `${formatNumber(hours)}:${formatNumber(
        minutes % 60
      )}:${formatNumber(seconds % 60)}`
      setDuration(text)
    }, 1000)

    return () => clearInterval(timer)
  }, [data.timestamp])

  return (
    <Tooltip title={'任务持续时间'}>
      {data.task_status === 'connecting' ? (
        <span>{duration}</span>
      ) : (
        <span>00:00:00</span>
      )}
    </Tooltip>
  )
}

export const ScanOutlineComponent = ({
  url,
  title,
  className
}: {
  url?: string
  title?: string
  className?: string
}) => {
  return (
    <Popover
      placement="bottom"
      trigger="click"
      className="cursor-pointer"
      content={
        <Flex justify="center" align="center" wrap="wrap" className="w-[10rem]">
          <h1 className="text-[1.2rem] w-full text-center">{title}</h1>
          <QRCode value={url || '-'} />
        </Flex>
      }
    >
      <ScanOutlined className={cn('cursor-pointer', className)} />
    </Popover>
  )
}

export const Livepeople = ({
  online_count
}: {
  online_count: BaseWebsocketAdminProps['online_count']
}) => {
  return (
    <Flex gap="small" align="center" justify="start">
      <Tooltip title="在线">
        <Space>
          <TeamOutlined />
          {online_count}
          <span>人在线</span>
        </Space>
      </Tooltip>
    </Flex>
  )
}
export const DanmuCount = ({
  barrage_ount
}: {
  barrage_ount: BaseWebsocketAdminProps['barrage_ount']
}) => {
  return (
    <Flex gap="small" align="center" justify="start">
      <Tooltip title="弹幕">
        <Space>
          <BoldOutlined />
          {barrage_ount}
        </Space>
      </Tooltip>
    </Flex>
  )
}

export const CardLiveMoomLoading = ({ children }: { children?: ReactNode }) => {
  return (
    <>
      <motion.div
        className="absolute flex items-center justify-center top-0 left-0 right-0 bottom-0 backdrop-blur-sm bg-[rgba(0,0,0,0.3)] z-[12] rounded-lg border border-black"
        animate={{ opacity: [0, 1] }}
        transition={{ duration: 0.5 }}
      >
        {children ? (
          children
        ) : (
          <Flex
            justify="center"
            align="center"
            wrap="wrap"
            className="w-full text-[#fff] text-[1.2rem]"
          >
            <LoadingOutlined className="text-[#fff] text-[2rem]" />
            <Flex
              gap="small"
              align="center"
              justify="center"
              className="w-full"
            >
              加载中...
            </Flex>
          </Flex>
        )}
      </motion.div>
    </>
  )
}

const MemberEnter = ({
  messages_info,
  className
}: {
  messages_info?: any
  className: string
}) => {
  return (
    <Flex justify="start" align="center" className={className}>
      {messages_info && (
        <ChatItem
          key={messages_info.message_id}
          isAdmin={true}
          width="100%"
          className="w-full"
          messages_info={messages_info}
        />
      )}
    </Flex>
  )
}

export const CardLiveMoomChat = ({
  data,
  onClick,
  isLogin
}: {
  data: TaskListType
  onClick?: () => void
  isLogin?: boolean
}) => {
  return (
    <Flex justify="center" align="center" className="w-full ">
      {isLogin ? (
        <Input
          prefix={<MessageOutlined />}
          placeholder="开始聊天"
          variant="filled"
        />
      ) : (
        <Button onClick={onClick} type="primary" block icon={<ScanOutlined />}>
          扫码登陆开始聊天
        </Button>
      )}
    </Flex>
  )
}

const LoginCom = (props: CardLiveMoomProps['LoginComProms']) => {
  const LoginStatusCom = () => {
    const [loading, setLoading] = useState<boolean>()
    const isLoading = useMemo(() => loading, [loading, props])
    switch (props.loginStatus) {
      case 'qrExpired':
        return (
          <Flex
            justify="center"
            align="center"
            wrap="wrap"
            onClick={async () => {
              if (isLoading) return
              setLoading(true)
              await props.onExpired?.(props?.loginUrl)
              setLoading(false)
            }}
            className="absolute z-[2] opacity-[80%] cursor-pointer content-center  rounded-lg left-0 right-0 top-0 bottom-0 bg-[#ffffff]  "
          >
            <Flex justify="center" align="center" className="w-full">
              {isLoading ? <LoadingOutlined /> : <ReloadOutlined />}
            </Flex>
            <Flex justify="center" align="center" className="w-full">
              二维码失效
            </Flex>
            <Flex justify="center" align="center" className="w-full">
              点击刷新
            </Flex>
          </Flex>
        )
      case 'scanned':
        return (
          <Flex
            justify="center"
            align="center"
            wrap="wrap"
            className="absolute z-[2] opacity-[80%] cursor-pointer content-center  rounded-lg left-0 right-0 top-0 bottom-0 bg-[#ffffff]  "
          >
            <Flex justify="center" align="center" className="w-full">
              <ReloadOutlined />
            </Flex>
            <Flex justify="center" align="center" className="w-full">
              扫码成功
            </Flex>
          </Flex>
        )

      default:
        return null
    }
  }

  return (
    <Flex
      className="bg-white border border-gray-950 rounded-lg relative"
      justify="center"
      align="center"
      wrap="wrap"
    >
      <LoginStatusCom />
      {props?.loginUrl ? <QRCode value={props.loginUrl} /> : <></>}
    </Flex>
  )
}

export const MessagetypeRender = ({
  data,
  MessageConent
}: {
  data: TaskListType
  MessageConent: CardLiveMoomProps['MessageConent']
}) => {
  return (
    <Flex
      justify="center"
      align="center"
      className="h-[20rem] mb-[3rem] pl-[1rem] overflow-hidden scroll-smooth"
    >
      {MessageConent ? (
        <MessageConent data={data} />
      ) : (
        <Empty description="暂不支持该消息类型" />
      )}
    </Flex>
  )
}

const CardLiveMoom: React.FC<CardLiveMoomProps> = ({
  data,
  messages_info,
  barrage_ount,
  online_count,
  AddFormItems,
  MessageIconsArrCom,
  MessageConent,
  app_type,
  updateWebSocketTask,
  updateWebSocketTaskItem,
  LoginComProms
}) => {
  const [loading, setloading] = useState(false)

  const onCardLiveMoomChatClick = async () => {
    setloading(true)
    await LoginComProms?.onExpired?.(LoginComProms?.loginUrl)
  }

  return (
    <Flex justify="center" align="center" className="relative">
      {(data.task_status === 'reconnecting' || loading) && (
        <CardLiveMoomLoading>
          {loading ? (
            LoginComProms.loginUrl ? (
              <LoginCom
                loginStatus={LoginComProms.loginStatus}
                loginUrl={LoginComProms.loginUrl}
                onExpired={LoginComProms.onExpired}
              />
            ) : (
              ''
            )
          ) : (
            ''
          )}
        </CardLiveMoomLoading>
      )}
      <Card
        bordered
        title={
          <>
            <CardTitle data={data} />
            <Flex
              gap="small"
              align="center"
              justify="start"
              className="text-[.8rem] absolute top-[0rem] left-[1.6rem]"
            >
              <Livepeople online_count={online_count} />
            </Flex>
            <Flex
              gap="small"
              align="center"
              justify="start"
              className="text-[.8rem] absolute top-[2.1rem] left-[1.6rem]"
            >
              <DanmuCount barrage_ount={barrage_ount} />
            </Flex>
          </>
        }
        cover={
          <div className="relative w-[100%]">
            <MessagetypeRender MessageConent={MessageConent} data={data} />
            <MemberEnter
              messages_info={messages_info}
              className="absolute w-full  bottom-[-5.1rem] left-0 right-0 px-[1rem]"
            />
            <div className="absolute bottom-0 left-0 right-0 h-[2rem] bg-gradient-to-t from-white to-transparent"></div>
          </div>
        }
        hoverable
        extra={
          <LiveLoading
            data={data}
            updateWebSocketTaskItem={updateWebSocketTaskItem}
          />
        }
        actions={getActions({
          data,
          app_type,
          AddFormItems,
          MessageConent,
          barrage_ount,
          online_count,
          updateWebSocketTask,
          updateWebSocketTaskItem
        })}
        bodyStyle={{
          padding: '1rem',
          // color: '#fff',
          // background: '#282a35',
          border: 'none',
          borderRadius: 0
        }}
        // style={{ width: '15.3rem' }}
        style={{ width: '18.55rem' }}
      >
        <Flex
          justify="space-between"
          align="center"
          className="w-full text-[1.2rem] z-[10] relative pt-[1rem]"
          wrap="wrap"
        >
          <CardLiveMoomChat onClick={onCardLiveMoomChatClick} data={data} />
          <Flex justify="space-between" align="center" className="w-full">
            <Duration data={data} />
            <Flex gap="small" align="center" justify="center">
              {MessageIconsArrCom?.({ data })}
            </Flex>
          </Flex>
        </Flex>
      </Card>
    </Flex>
  )
}

export default CardLiveMoom
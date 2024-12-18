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
  Popover,
  QRCode,
  Space,
  Tooltip
} from 'antd'
import { motion } from 'framer-motion'
import { useEffect, useState, type ReactNode } from 'react'
import cn from 'classnames'
import UpdateLive from './UpdateLive'
import type { BaseWebsocketAdminProps, TaskListType } from './types'

export const Setting = () => {
  return (
    <Tooltip key="edit" title="编辑">
      <Button
        type="text"
        className="scale-[1.5] mt-[.2rem] "
        icon={<SettingOutlined />}
      />
    </Tooltip>
  )
}

const Reload = ({
  updateWebSocketTaskItem
}: {
  updateWebSocketTaskItem: CardLiveMoomProps['updateWebSocketTaskItem']
}) => {
  const [isReloading, setIsReloading] = useState(false)

  const handleReload = () => {
    setIsReloading(true)
    updateWebSocketTaskItem?.({} as any, 'reload')
    setTimeout(() => {
      setIsReloading(false)
    }, 1000)
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
  messagesInfo,
  width,
  className,
  isAdmin
}: {
  messagesInfo?: BaseWebsocketAdminProps['messagesInfo']
  className?: string
  width?: string
  isAdmin?: boolean
}) => {
  // const userUrl = `https://www.douyin.com/user/${messagesInfo?.userId}?from_tab_name=live`

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
          <a href={messagesInfo?.userUrl} target="_blank" rel="noreferrer">
            {messagesInfo?.userName}
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
              url={messagesInfo?.userUrl}
              title={messagesInfo?.userName}
              className={'scale-[1.5]'}
            />
          </Flex>
          <Flex
            justify="start"
            align="center"
            className="bg-[#f1f3f5] min-h-[2.5rem] min-w-[2.5rem] flex-1 p-[.5rem] rounded-2xl   "
            wrap="wrap"
          >
            {messagesInfo?.message}
          </Flex>
        </Flex>
      </Flex>
    </motion.div>
  )
}

export const getActions = ({
  data,
  appType,
  updateWebSocketTask,
  updateWebSocketTaskItem
}: Omit<
  CardLiveMoomProps,
  'MessageIconsArrCom' | 'messagesInfo'
>): React.ReactNode[] => {
  return [
    <UpdateLive
      key="edit"
      type="update"
      appType={appType}
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
      <Reload updateWebSocketTaskItem={updateWebSocketTaskItem} />
    </Flex>,
    <Flex
      key="delete"
      justify="center"
      align="center"
      className="text-[#df4257] cursor-pointer h-full"
    >
      <Tooltip title="删除">
        <Button
          danger
          type="text"
          className="scale-[1.5] mt-[.2rem] "
          icon={<DeleteOutlined />}
          onClick={() => updateWebSocketTask?.('delete')}
        />
      </Tooltip>
    </Flex>
  ]
}

const appTypeOptions: {
  [key in TaskListType['appType']]: ReactNode
} = {
  douyin: <TikTokOutlined className="scale-[1.5]" />,
  tiktok: <TikTokOutlined className="scale-[1.5]" />
}

const LiveImage = ({ data }: { data: TaskListType }) => {
  return (
    <div className=" text-[var(--g-active-color)] flex w-[2rem] h-[2rem] items-center justify-center  rounded-[50%] border-[.2rem] border-[#282a35] ">
      {appTypeOptions[data.appType]}
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
        if (data.status === 'disconnected') {
          updateWebSocketTaskItem?.(data, 'start')
        } else {
          updateWebSocketTaskItem?.(data, 'stop')
        }
      }}
    >
      <Tooltip
        title={`${data.status === 'disconnected' ? '点击开启' : '点击暂停'}`}
      >
        <motion.div>
          {data.status === 'connecting' ? (
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
  /**
   * message 自定义内容
   */
  MessageConent: BaseWebsocketAdminProps['MessageConent']
  MessageIconsArrCom: BaseWebsocketAdminProps['MessageIconsArrCom']
  onlineCount: BaseWebsocketAdminProps['onlineCount']
  barrageCount: BaseWebsocketAdminProps['barrageCount']
  messagesInfo: BaseWebsocketAdminProps['messagesInfo']
  appType: BaseWebsocketAdminProps['appType']
  updateWebSocketTask?: BaseWebsocketAdminProps['updateWebSocketTask']
  updateWebSocketTaskItem?: BaseWebsocketAdminProps['updateWebSocketTaskItem']
  loading?: boolean
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
      <ScanOutlineComponent url={data.liveUrl} title="扫码进入直播间" />
      <Tooltip title={`点击进入直播间`}>
        <a
          className="text-[#000] hover:text-[var(--g-active-color)] cursor-pointer "
          href={data.liveUrl}
          target="_blank"
          rel="noreferrer"
        >
          {data.taskName}
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
      {data.status === 'connecting' ? (
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
  onlineCount
}: {
  onlineCount: BaseWebsocketAdminProps['onlineCount']
}) => {
  return (
    <Flex gap="small" align="center" justify="start">
      <Tooltip title="在线">
        <Space>
          <TeamOutlined />
          {onlineCount}
          <span>人在线</span>
        </Space>
      </Tooltip>
    </Flex>
  )
}
export const DanmuCount = ({
  barrageCount
}: {
  barrageCount: BaseWebsocketAdminProps['barrageCount']
}) => {
  return (
    <Flex gap="small" align="center" justify="start">
      <Tooltip title="弹幕">
        <Space>
          <BoldOutlined />
          {barrageCount}
        </Space>
      </Tooltip>
    </Flex>
  )
}

export const CardLiveMoomLoading = () => {
  return (
    <>
      <motion.div
        className="absolute flex items-center justify-center top-0 left-0 right-0 bottom-0 backdrop-blur-sm bg-[rgba(0,0,0,0.3)] z-[12] rounded-lg"
        animate={{ opacity: [0, 1] }}
        transition={{ duration: 0.5 }}
      >
        <Flex
          justify="center"
          align="center"
          wrap="wrap"
          className="w-full text-[#fff] text-[1.2rem]"
        >
          <LoadingOutlined className="text-[#fff] text-[2rem]" />
          <Flex gap="small" align="center" justify="center" className="w-full">
            加载中...
          </Flex>
        </Flex>
      </motion.div>
    </>
  )
}

const MemberEnter = ({
  messagesInfo,
  className
}: {
  messagesInfo?: any
  className: string
}) => {
  return (
    <Flex justify="start" align="center" className={className}>
      {messagesInfo && (
        <ChatItem
          key={messagesInfo.messageId}
          isAdmin={true}
          width="100%"
          className="w-full"
          messagesInfo={messagesInfo}
        />
      )}
    </Flex>
  )
}

export const CardLiveMoomChat = ({
  data,
  isLogin
}: {
  data: TaskListType
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
        <Button type="primary" block icon={<CommentOutlined />}>
          登陆开始聊天
        </Button>
      )}
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
  messagesInfo,
  barrageCount,
  onlineCount,
  MessageIconsArrCom,
  MessageConent,
  appType,
  updateWebSocketTask,
  updateWebSocketTaskItem
}) => {
  return (
    <Flex justify="center" align="center" className="relative">
      {data.loading && <CardLiveMoomLoading />}
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
              <Livepeople onlineCount={onlineCount} />
            </Flex>
            <Flex
              gap="small"
              align="center"
              justify="start"
              className="text-[.8rem] absolute top-[2.1rem] left-[1.6rem]"
            >
              <DanmuCount barrageCount={barrageCount} />
            </Flex>
          </>
        }
        cover={
          <div className="relative w-[100%]">
            <MessagetypeRender MessageConent={MessageConent} data={data} />
            <MemberEnter
              messagesInfo={messagesInfo}
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
          appType,
          MessageConent,
          barrageCount,
          onlineCount,
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
          <CardLiveMoomChat data={data} />
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

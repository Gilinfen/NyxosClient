import { Button, Empty, Flex, Skeleton } from 'antd'
import { useEffect, useMemo, useState } from 'react'
import type {
  BaseWebsocketAdminProps,
  TaskListType
} from '~/components/BaseWebsocketAdmin/types'
import useAutoScrollToBottom from '~/hook/useAutoScrollToBottom'
import { ChatItem } from '~/components/BaseWebsocketAdmin/CardLiveMoom'
import { tsListen } from '~/utils/listen'
import type { DouyinMessageType } from '~/db/douyin/message'
import type { DouyinWebSocketDanmaDb } from '~/db/douyin'
import { insertData } from '~/db/utils'
import GiftMessageConent from './GiftMessageConent'
import { PlayCircleOutlined } from '@ant-design/icons'
import { useQueueStack } from '~/hook/useDelayStack.ts'

export const pubdamutsListen = (
  data: TaskListType,
  callback?: (value: DouyinWebSocketDanmaDb) => void
) => {
  tsListen<DouyinMessageType['DouyinWebcastChatMessage']['payload']>(
    'DouyinWebcastChatMessage',
    async ({ payload }) => {
      if (payload && payload.task_id === data.task_id) {
        const messageval: DouyinWebSocketDanmaDb = {
          ...payload,
          timestamp: Date.now()
        }

        // await insertData<DouyinWebSocketDanmaDb>({
        //   table: 'tasks_danmu',
        //   data: messageval,
        //   dbName: 'douyin' // 请替换为实际的数据库名称
        // })

        callback?.(messageval)
      }
    }
  )
}

/**
 * 弹幕组件
 * @param param0
 * @returns
 */
const MessageConent = ({
  data,
  isEmpty,
  updateWebSocketTaskItem,
  position = 'y',
  className
}: {
  updateWebSocketTaskItem: BaseWebsocketAdminProps['updateWebSocketTaskItem']
  data: TaskListType
  className?: string
  position?: 'x' | 'y'
  isEmpty?: boolean
}) => {
  const containerRef = useAutoScrollToBottom<HTMLDivElement>(position)
  const [startloading, setstartloading] = useState(false)
  const { list, addItems, maxSize, setMaxSize } =
    useQueueStack<DouyinWebSocketDanmaDb>({
      initialList: [],
      getKey: task => task.message_id, // 告诉 Hook 如何获取唯一键
      initialMaxSize: 10, // 初始最大长度为 5
      queueEnabled: false,
      skipDuplicates: false // 为 true 时跳过重复
    })

  useEffect(() => {
    pubdamutsListen(data, messageval => {
      addItems([messageval], 300)
    })
  }, [data.task_id])

  const FlexProps =
    position === 'x'
      ? {
          gap: 'small',
          className: ' h-[5rem] w-full scroll-smooth overflow-x-auto '
        }
      : {
          vertical: true,
          gap: 'small',
          justify: 'center',
          align: 'start',
          className:
            'w-full h-[26.1rem] relative overflow-y-auto  scroll-smooth'
        }

  const EmptyMemo = useMemo(() => {
    if (isEmpty || data.task_status === 'connecting') return () => null
    return () => (
      <Flex justify="center" align="center" className="w-full">
        <Empty
          image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
          description={null}
        >
          <Button
            className=" scale-[1.5]"
            shape="circle"
            loading={startloading}
            onClick={async () => {
              setstartloading(true)
              await updateWebSocketTaskItem?.(data, 'start')
              setstartloading(false)
            }}
            size="large"
            type="primary"
            icon={<PlayCircleOutlined />}
          />
        </Empty>
      </Flex>
    )
  }, [data, startloading, updateWebSocketTaskItem, isEmpty])

  const MessageListMemo = useMemo(() => {
    if (data.task_status !== 'connecting') return () => null

    return () => (
      <>
        {list.map(msg => (
          <ChatItem
            key={msg.message_id}
            messages_info={{
              ...msg,
              user_url: `https://www.douyin.com/user/${msg.user_id}`
            }}
            className={className}
          />
        ))}
      </>
    )
  }, [list, data, isEmpty])

  return (
    <>
      {data.task_status === 'connecting' && <GiftMessageConent data={data} />}
      <Flex ref={containerRef} {...FlexProps}>
        <Skeleton active loading={false}>
          <MessageListMemo />
          <EmptyMemo />
        </Skeleton>
      </Flex>
    </>
  )
}

export default MessageConent

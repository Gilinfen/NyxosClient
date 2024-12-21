import { Empty, Flex, Skeleton } from 'antd'
import { useEffect, useState } from 'react'
import type { TaskListType } from '~/components/BaseWebsocketAdmin/types'
import useAutoScrollToBottom from '~/hook/useAutoScrollToBottom'
import { ChatItem } from '~/components/BaseWebsocketAdmin/CardLiveMoom'
import { tsListen } from '~/utils/listen'
import type { DouyinMessageType } from '~/db/douyin/message'
import type { DouyinWebSocketDanmaDb } from '~/db/douyin'
import { getAllData, getDataByField, insertData } from '~/db/utils'
import GiftMessageConent from './GiftMessageConent'
import GiftVideo from './GiftVideo'
/**
 * 弹幕组件
 * @param param0
 * @returns
 */
const MessageConent = ({
  data,
  isEmpty,
  position = 'y',
  className
}: {
  data: TaskListType
  className?: string
  position?: 'x' | 'y'
  isEmpty?: boolean
}) => {
  const [messages, setMessages] = useState<DouyinWebSocketDanmaDb[]>([])
  const containerRef = useAutoScrollToBottom<HTMLDivElement>(position)

  const get_tasks_danmu = async () => {
    const res = await getDataByField<DouyinWebSocketDanmaDb[]>(
      'tasks_danmu',
      'task_id',
      data.task_id,
      'douyin'
    )
    setMessages(res.slice(-100))
  }

  useEffect(() => {
    get_tasks_danmu()
    tsListen<DouyinMessageType['DouyinWebcastChatMessage']['payload']>(
      'DouyinWebcastChatMessage',
      async ({ payload }) => {
        if (payload && payload.task_id === data.task_id) {
          const messageval: DouyinWebSocketDanmaDb = {
            ...payload,
            user_url: `https://www.douyin.com/user/${payload.user_id}`,
            timestamp: Date.now()
          }

          await insertData<DouyinWebSocketDanmaDb>({
            table: 'tasks_danmu',
            data: messageval,
            dbName: 'douyin' // 请替换为实际的数据库名称
          })

          setMessages(state => {
            const uniqueMessages = new Map(
              state.map(msg => [msg.message_id, msg])
            )
            uniqueMessages.set(messageval.message_id, messageval)
            return Array.from(uniqueMessages.values())
              .sort((a, b) => a.timestamp - b.timestamp) // 根据timestamp排序
              .slice(-100)
          })
        }
      }
    )
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
          className: 'w-full h-[20rem] relative overflow-y-auto  scroll-smooth'
        }

  return (
    <>
      <GiftVideo />
      <GiftMessageConent data={data} />
      <Flex ref={containerRef} {...FlexProps}>
        <Skeleton active loading={false}>
          {data.task_status === 'disconnected' && !isEmpty ? (
            <Flex justify="center" align="center" className="w-full">
              <Empty description="未连接" />
            </Flex>
          ) : (
            <>
              {messages.length > 0
                ? messages.map(msg => (
                    <ChatItem
                      key={msg.message_id}
                      messages_info={msg}
                      className={className}
                    />
                  ))
                : !isEmpty && (
                    <Flex justify="center" align="center" className="w-full">
                      <Empty description="暂无弹幕" />
                    </Flex>
                  )}
            </>
          )}
        </Skeleton>
      </Flex>
    </>
  )
}

export default MessageConent

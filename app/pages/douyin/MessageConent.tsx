import { Empty, Flex, Skeleton } from 'antd'
import { useEffect, useState } from 'react'
import type {
  DanmuMessage,
  TaskListType
} from '~/components/BaseWebsocketAdmin/types'
import useAutoScrollToBottom from '~/hook/useAutoScrollToBottom'
import { ChatItem } from '~/components/BaseWebsocketAdmin/CardLiveMoom'

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
  const [messages, setMessages] = useState<DanmuMessage[]>([])
  const containerRef = useAutoScrollToBottom<HTMLDivElement>(position)

  // useEffect(() => {
  //   const timer = setInterval(() => {
  //     setMessages(prevMessages => [
  //       ...prevMessages,
  //       {
  //         message: '新消息',
  //         message_id: Date.now().toString(),
  //         user_name: '用户',
  //         user_url: '',
  //         user_id: '用户ID'
  //       }
  //     ])
  //   }, 1000)

  //   return () => clearInterval(timer)
  // }, [])

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
          className: 'w-full h-[20rem]  overflow-y-auto  scroll-smooth'
        }

  return (
    <>
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

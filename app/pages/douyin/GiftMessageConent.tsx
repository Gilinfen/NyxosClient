import { Flex } from 'antd'
import { motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import { CardItemLogo } from '~/components/BaseWebsocketAdmin/CardLiveMoom'
import type { TaskListType } from '~/components/BaseWebsocketAdmin/types'
import type { DouyinMessageType } from '~/db/douyin/message'
import { tsListen } from '~/utils/listen'

const GiffItem = ({
  data
}: {
  data: DouyinMessageType['DouyinWebcastGiftMessage']['payload']
}) => {
  return (
    <motion.div
      className="w-full filter drop-shadow-xl"
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '-100%' }}
    >
      <Flex
        className="w-full rounded-3xl h-[3rem] pr-1"
        style={{
          background: `linear-gradient(to left, ${
            data?.image?.avg_color ?? 'black'
          }, rgba(0, 0, 0, .2))`
        }}
        justify="end"
        align="center"
      >
        <Flex
          className=" left-[-1rem] absolute w-[4rem]"
          justify="center"
          align="center"
        >
          <div className=" rotate-[5deg] text-[1.5rem] text-[#151515] font-bold top-[-1.5rem] absolute z-[3]">
            {data?.repeat_count}
          </div>
          <img
            className="transform scale-x-[-1]"
            src={data?.image?.url_list_list?.[0]}
          />
        </Flex>
        <Flex
          wrap="wrap"
          justify="end"
          flex={1}
          className="pr-1 text-[#ffffff]"
        >
          <Flex justify="end" align="center" className="w-full">
            {data &&
              (data.user_name.length > 5
                ? data.user_name.slice(0, 5)
                : data.user_name)}
          </Flex>
          <Flex justify="end" wrap="nowrap" align="center" className="w-full">
            {data?.gift.name}
          </Flex>
        </Flex>
        <CardItemLogo />
      </Flex>
    </motion.div>
  )
}

interface Props {
  data: DouyinMessageType['DouyinWebcastGiftMessage']['payload'][]
}

const BatchRenderer: React.FC<Props> = ({ data }) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prevIndex => {
        // 如果达到数组末尾，重新开始或停止
        return prevIndex + 2 >= data.length ? 0 : prevIndex + 2
      })
    }, 500)

    return () => clearInterval(interval) // 清理定时器
  }, [data])

  const currentBatch = data.slice(currentIndex, currentIndex + 2)

  return (
    <>
      {currentBatch.map(item => (
        <GiffItem key={item?.message_id} data={item} />
      ))}
    </>
  )
}

export default function GiffMessageConent({ data }: { data: TaskListType }) {
  const [giftstate, setgiftstate] = useState<
    DouyinMessageType['DouyinWebcastGiftMessage']['payload'][]
  >([])
  useEffect(() => {
    tsListen<DouyinMessageType['DouyinWebcastGiftMessage']['payload']>(
      'DouyinWebcastGiftMessage',
      async ({ payload }) => {
        if (payload && payload.task_id === data.task_id) {
          console.log(payload)
          setgiftstate(state => {
            const uniqueMessages = new Map(
              state.map(msg => [msg?.message_id, msg])
            )
            uniqueMessages.set(payload.message_id, payload)
            return Array.from(uniqueMessages.values())
          })
        }
      }
    )
  }, [data.task_id])

  return (
    <Flex
      className=" absolute right-0 bottom-[10%] z-[2] w-full overflow-hidden h-[13rem] "
      justify="end"
      align="center"
    >
      <Flex
        className="h-[10rem] absolute w-[60%]"
        justify="end"
        align="center"
        wrap={'wrap'}
      >
        <BatchRenderer data={giftstate} />
      </Flex>
    </Flex>
  )
}

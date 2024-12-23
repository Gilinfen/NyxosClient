import { Flex } from 'antd'
import { motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import { CardItemLogo } from '~/components/BaseWebsocketAdmin/CardLiveMoom'
import type { TaskListType } from '~/components/BaseWebsocketAdmin/types'
import type { DouyinMessageType } from '~/db/douyin/message'
import { tsListen } from '~/utils/listen'
import { useQueueStack } from '~/hook/useDelayStack.ts'
import type { DouyinWebSocketDanmaDb, DouyinWebSocketGiftDb } from '~/db/douyin'
import { getDataByField, insertData, updateData } from '~/db/utils'

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
  return (
    <>
      {data.map(item => (
        <GiffItem key={item?.message_id} data={item} />
      ))}
    </>
  )
}

export const pubtsListen = async (
  data: TaskListType,
  callback?: (
    value: DouyinMessageType['DouyinWebcastGiftMessage']['payload']
  ) => void
) => {
  tsListen<DouyinMessageType['DouyinWebcastGiftMessage']['payload']>(
    'DouyinWebcastGiftMessage',
    async ({ payload }) => {
      try {
        if (payload && payload.task_id === data.task_id) {
          const gits = await getDataByField<DouyinWebSocketGiftDb[]>(
            'tasks_gift',
            'user_id',
            payload.user_id,
            'douyin'
          )
          const giftitem = gits?.[0]

          // if (giftitem) {
          //   await updateData<DouyinWebSocketGiftDb>({
          //     table: 'tasks_gift',
          //     data: {
          //       ...giftitem,
          //       timestamp: Date.now(),
          //       repeat_count:
          //         parseInt(`${giftitem.repeat_count}`) +
          //         parseInt(`${payload.repeat_count}`)
          //     },
          //     qkey: 'user_id',
          //     db_id: payload.user_id,
          //     dbName: 'douyin'
          //   })
          // } else {
          //   await insertData<DouyinWebSocketGiftDb>({
          //     table: 'tasks_gift',
          //     data: {
          //       user_id: payload.user_id,
          //       user_name: payload.user_name,
          //       task_id: data.task_id,
          //       gift_id: payload.gift.id,
          //       gift_name: payload.gift.name,
          //       gift_url: payload.image?.url_list_list[0],
          //       repeat_count: payload.repeat_count
          //     },
          //     dbName: 'douyin' // 请替换为实际的数据库名称
          //   })
          // }

          callback?.(payload)
        }
      } catch (error) {
        console.error(error)
      }
    }
  )
}

export default function GiffMessageConent({ data }: { data: TaskListType }) {
  const { list, addItems } = useQueueStack<
    DouyinMessageType['DouyinWebcastGiftMessage']['payload']
  >({
    initialList: [],
    getKey: task => task!.message_id, // 告诉 Hook 如何获取唯一键
    initialMaxSize: 2, // 初始最大长度为 5
    queueEnabled: false,
    skipDuplicates: false // 为 true 时跳过重复
  })
  useEffect(() => {
    pubtsListen(data, payload => {
      addItems([payload], 300)
    })
  }, [data.task_id])

  return (
    <Flex
      className=" absolute right-0 bottom-[10%] z-[2] w-full overflow-hidden h-[13rem] "
      justify="end"
      align="center"
    >
      <Flex
        className="h-[10rem] absolute w-[50%]"
        justify="end"
        align="center"
        wrap={'wrap'}
      >
        <BatchRenderer data={list} />
      </Flex>
    </Flex>
  )
}

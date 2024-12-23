import {
  Alert,
  Button,
  Divider,
  Flex,
  List,
  message,
  Skeleton,
  Space,
  Tooltip
} from 'antd'
import {
  CardTitle,
  Duration,
  LiveLoading,
  Livepeople,
  Reload,
  Setting,
  type CardLiveMoomProps
} from './CardLiveMoom'
import { DeleteOutlined, MobileOutlined } from '@ant-design/icons'
import type { TaskListType } from './types'
import UpdateLive from './UpdateLive'
import { useEffect, useState } from 'react'
import {
  WebviewWindow,
  getAllWebviewWindows
} from '@tauri-apps/api/webviewWindow'
import { WindowsIDS } from './windwos'

const TitleItem = ({
  item,
  tsListenEffect
}: {
  item: TaskListType
  tsListenEffect: ListLiveMoomType['tsListenEffect']
}) => {
  useEffect(() => {
    tsListenEffect(item)
  }, [])

  return (
    <Flex gap="small" align="center" justify="start" className="text-[1.2rem]">
      <div className="flex items-center justify-start w-[5rem] ">
        <Duration data={item} />
      </div>
      <CardTitle data={item} />
      <Livepeople data={item} />
    </Flex>
  )
}

export type ListLiveMoomType = {
  data: TaskListType[]
  updateWebSocketTaskItem: CardLiveMoomProps['updateWebSocketTaskItem']
  updateWebSocketTask: CardLiveMoomProps['updateWebSocketTask']
  MessageIconsArrCom: CardLiveMoomProps['MessageIconsArrCom']
  AddFormItems: CardLiveMoomProps['AddFormItems']
  tsListenEffect: (item: TaskListType) => void
}

const ListLiveMoom: React.FC<ListLiveMoomType> = ({
  data,
  AddFormItems,
  updateWebSocketTaskItem,
  updateWebSocketTask,
  MessageIconsArrCom,
  tsListenEffect
}) => {
  const [taskAsyncLoadin, setTaskAsyncLoadin] = useState<string[]>([])
  const [taskAsyncList, settaskAsyncList] = useState<string[]>([])

  const getallwin = async () => {
    const res = await getAllWebviewWindows()
    const state = res.map(e => e.label).filter(e => !e.includes('main'))
    settaskAsyncList(state)
    return state
  }
  useEffect(() => {
    getallwin()
  }, [])

  const CreateWindwo = async (task_id: string, title: string) => {
    const res = await getallwin()
    const wid = Object.values(WindowsIDS).find(item =>
      res.every(v => item !== v)
    )

    if (wid && taskAsyncList.length < 100) {
      // loading embedded asset:
      const webview = new WebviewWindow(wid, {
        url: `/douyin_sole?task_id=${task_id}`,
        title,
        center: true,
        width: 370,
        height: 720,
        resizable: false
        // alwaysOnTop: true
        // skipTaskbar: false,
        // decorations: false,
        // closable: false
      })

      webview.once('tauri://created', async function () {
        // webview successfully created
        await getallwin()
      })
      webview.once('tauri://error', function (e) {
        // an error happened creating the webview
        console.log(e)
      })
      webview.once('tauri://close-requested', async function () {
        console.log(`Webview ${wid} closed`)
        // 如果决定关闭窗口
        webview.close().catch(console.error)

        setTimeout(async () => {
          await getallwin()
        }, 1000) // 延迟1秒执行
      })

      await getallwin()
    } else {
      message.error('没有合适窗口')
    }
  }

  return (
    <>
      <Alert
        message={
          <Space>
            当前活动窗口
            <span className="text-[#ae0000]"> {taskAsyncList.length} </span>个
            ， 可用窗口
            <span className="text-[#5aab0e]">{100 - taskAsyncList.length}</span>
            个
          </Space>
        }
        className="w-full font-bold text-[1.2rem]"
        type="info"
      />
      <List
        itemLayout="horizontal"
        className="w-full"
        dataSource={data}
        pagination={{
          onChange: page => {
            console.log(page)
          },
          pageSize: 10
        }}
        footer={<div>👏👏👏</div>}
        rowKey={item => item.task_id}
        renderItem={item => (
          <List.Item key={item.task_id}>
            <Skeleton
              avatar
              title={false}
              loading={taskAsyncLoadin.includes(item.task_id)}
              active
            >
              <List.Item.Meta
                avatar={
                  <Flex justify="center" align="center" className="w-[4rem]">
                    <LiveLoading
                      data={item}
                      updateWebSocketTaskItem={async (data, status) => {
                        setTaskAsyncLoadin(state => [...state, item.task_id])
                        await updateWebSocketTaskItem?.(data, status)
                        setTaskAsyncLoadin(state =>
                          state.filter(e => e !== item.task_id)
                        )
                      }}
                      app_type={'douyin'}
                    />
                  </Flex>
                }
                title={
                  <TitleItem tsListenEffect={tsListenEffect} item={item} />
                }
                description={<></>}
              />
              <Space className="px-[1rem]">
                {MessageIconsArrCom?.({ data: item })}
                <Tooltip title="打开窗口">
                  <Button
                    className="scale-[1.5] mt-[.2rem] "
                    type="text"
                    onClick={() =>
                      CreateWindwo(item.task_id, `${item.task_name} 直播间`)
                    }
                    icon={<MobileOutlined />}
                  />
                </Tooltip>
                <UpdateLive
                  key="edit_UpdateLive"
                  type="update"
                  app_type={'douyin'}
                  FormItems={AddFormItems}
                  updateWebSocketTask={async (type, item) =>
                    updateWebSocketTask?.(type, item)
                  }
                  data={{
                    ...item
                  }}
                >
                  <Setting disabled={item.task_status === 'connecting'} />
                </UpdateLive>
                <Flex key="expand" justify="center" align="center">
                  <Reload
                    data={item}
                    updateWebSocketTaskItem={async (data, status) => {
                      setTaskAsyncLoadin(state => [...state, item.task_id])
                      await updateWebSocketTaskItem?.(data, status)
                      setTaskAsyncLoadin(state =>
                        state.filter(e => e !== item.task_id)
                      )
                    }}
                  />
                </Flex>
                <Tooltip title="删除">
                  <Button
                    type="text"
                    className="scale-[1.5] mt-[.2rem] "
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => updateWebSocketTask?.('delete', item)}
                  />
                </Tooltip>
              </Space>
            </Skeleton>
          </List.Item>
        )}
      />
    </>
  )
}
export default ListLiveMoom

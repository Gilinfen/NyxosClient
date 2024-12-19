import { Flex, List, Skeleton, Space, Tooltip } from 'antd'
import {
  CardTitle,
  Danmu,
  DanmuAreaChartComponent,
  DanmuCount,
  Duration,
  LiveLoading,
  Livepeople,
  Setting
} from './CardLiveMoom'
import { DeleteOutlined } from '@ant-design/icons'
import type { TaskListType } from '.'

const ListLiveMoom: React.FC<{
  data: TaskListType[]
  onStart: (data: TaskListType) => void
  onStop: (data: TaskListType) => void
  onReload: (data: TaskListType) => void
  onDelete: (data: TaskListType) => void
}> = ({ data, onStart, onStop, onDelete }) => {
  return (
    <>
      <List
        itemLayout="horizontal"
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
            <Skeleton avatar title={false} loading={item.loading} active>
              <List.Item.Meta
                avatar={
                  <Flex justify="center" align="center" className="w-[4rem]">
                    <LiveLoading
                      data={item}
                      onStart={() => onStart(item)}
                      onStop={() => onStop(item)}
                    />
                  </Flex>
                }
                title={
                  <Flex
                    gap="small"
                    align="center"
                    justify="start"
                    className="text-[1.2rem]"
                  >
                    <div className="flex items-center justify-start w-[5rem] ">
                      <Duration data={item} />
                    </div>
                    <DanmuAreaChartComponent data={item} />
                    <CardTitle data={item} />
                    <DanmuCount data={item} />
                    <Livepeople data={item} />
                  </Flex>
                }
                description={
                  <>
                    <Danmu
                      data={item}
                      position="x"
                      isEmpty={true}
                      className=" whitespace-nowrap "
                    />
                  </>
                }
              />
              <Space direction="vertical" className="px-[1rem]">
                <Setting />
                <Tooltip title="删除">
                  <DeleteOutlined
                    className="scale-[1.5] mt-[.2rem] "
                    onClick={() => onDelete?.(item)}
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

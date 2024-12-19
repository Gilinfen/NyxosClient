import {
  Button,
  Flex,
  Input,
  message,
  Modal,
  Select,
  Space,
  Table,
  Tooltip
} from 'antd'
import type { ColumnType } from 'antd/es/table'
import { useState } from 'react'
import type { TaskListType } from '~/components/BaseWebsocketAdmin/types'
import { ScanOutlineComponent } from '~/components/BaseWebsocketAdmin/CardLiveMoom'
import {
  AreaChartOutlined,
  CopyOutlined,
  DeleteOutlined,
  DownloadOutlined,
  ReloadOutlined
} from '@ant-design/icons'
import dayjs from 'dayjs'

type WebSocketDanmakuMessage = any

const QueryDanmuAll = async ({
  data
}: {
  data: TaskListType
}): Promise<WebSocketDanmakuMessage[]> => {
  return []
}

export type DataListType = Awaited<ReturnType<typeof QueryDanmuAll>>

export const DanmuAreaChartComponent = ({ data }: { data: TaskListType }) => {
  const [open, setOpen] = useState(false)
  const [dataList, setDataList] = useState<DataListType>([])
  const [messageApi, contextHolder] = message.useMessage()
  const [loading, setLoading] = useState(false)

  const [type, setType] = useState<'task' | 'user' | 'message'>('message')

  const onOpen = async () => {
    setLoading(true)
    setOpen(true)
    const res = await QueryDanmuAll({ data })
    setDataList(res)
    await new Promise(resolve => setTimeout(resolve, 300))
    setLoading(false)
  }

  const columns: ColumnType<DataListType[number]>[] = [
    {
      title: '直播间',
      ellipsis: true,
      dataIndex: 'app_type',
      render: () => {
        return <>{/* <CardTitle data={data} /> */}</>
      }
    },
    {
      title: '用户',
      dataIndex: 'username',
      render: (text, record) => {
        const url = `https://www.douyin.com/user/${record.user_id}?from_tab_name=live`
        return (
          <Flex
            gap="small"
            align="center"
            justify="start"
            className="text-[var(--g-active-color)]"
          >
            <ScanOutlineComponent url={url} title="扫码私信" />
            <Tooltip title="点击进入用户主页">
              <a href={url} target="_blank" rel="noreferrer">
                {text}
              </a>
            </Tooltip>
            <Tooltip title="复制用户名">
              <CopyOutlined
                onClick={() => {
                  navigator.clipboard.writeText(text)
                  messageApi.success('复制用户名成功')
                }}
                className="cursor-pointer"
              />
            </Tooltip>
          </Flex>
        )
      }
    },
    {
      title: '弹幕',
      ellipsis: true,
      dataIndex: 'content'
    },
    {
      title: '发送时间',
      ellipsis: true,
      sorter: (a, b) => a.timestamp - b.timestamp,
      dataIndex: 'timestamp',
      render: (text: string) => {
        return <span>{dayjs(text).format('YYYY-MM-DD HH:mm:ss')}</span>
      }
    }
  ]

  const onChangeType = (value: string) => {
    setType(value as 'task' | 'user' | 'message')
  }

  const onSearch = async (value: string) => {
    const res = await QueryDanmuAll({ data })

    if (!value) {
      setDataList(res)
      return
    }
    const filtered = res?.filter(item => {
      if (type === 'task') {
        return item.task_id?.toLowerCase().includes(value.toLowerCase())
      }
      if (type === 'user') {
        return item.username?.toLowerCase().includes(value.toLowerCase())
      }
      if (type === 'message') {
        return item.content?.toLowerCase().includes(value.toLowerCase())
      }
      return false
    })
    setDataList(filtered || [])
  }

  const onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (!value) {
      const res = await QueryDanmuAll({ data })
      setDataList(res)
    } else {
      onSearch(value)
    }
  }

  const exportToExcel = () => {
    // if (!dataList.length) {
    //   messageApi.warning('暂无数据')
    //   return
    // }
    // // 创建工作表
    // const ws = XLSX.utils.json_to_sheet(
    //   dataList.map(item => ({
    //     用户主页: `https://www.douyin.com/user/${item.user_id}?from_tab_name=live`,
    //     用户名: item.username,
    //     弹幕: item.content,
    //     发送时间: dayjs(item.timestamp).format('YYYY-MM-DD HH:mm:ss')
    //   }))
    // )
    // // 设置列宽
    // ws['!cols'] = [
    //   { wch: 30 }, // 第一列宽度为20字符
    //   { wch: 30 }, // 第二列宽度为10字符
    //   { wch: 30 }, // 第三列宽度为30字符
    //   { wch: 30 } // 第四列宽度为30字符
    // ]
    // // 创建工作簿
    // const wb = XLSX.utils.book_new()
    // XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')
    // // 导出为 Excel 文件
    // const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    // const blob = new Blob([excelBuffer], { type: 'application/octet-stream' })
    // saveAs(blob, `${data.taskName}.xlsx`)
  }

  return (
    <>
      {contextHolder}
      <Tooltip title="分析">
        <AreaChartOutlined onClick={onOpen} />
      </Tooltip>
      <Modal
        open={open}
        width="80vw"
        title={`${dataList?.length ?? 0}条弹幕分析`}
        onCancel={() => setOpen(false)}
      >
        <Flex
          gap={12}
          justify="center"
          align="center"
          wrap="wrap"
          className="w-full"
        >
          <Flex className="w-full" justify="space-between" gap={8}>
            <Space.Compact className="flex-1">
              <Button
                icon={<ReloadOutlined />}
                type="primary"
                onClick={onOpen}
                loading={loading}
              >
                刷新
              </Button>
              <Select
                options={[
                  { label: '直播间', value: 'task' },
                  { label: '用户', value: 'user' },
                  { label: '弹幕', value: 'message' }
                ]}
                onChange={onChangeType}
                className="w-[8rem]"
                defaultValue="message"
                placeholder="选择类型"
              />
              <Input placeholder="输入关键词" onChange={onChange} allowClear />
              <Button htmlType="submit" type="primary">
                搜索
              </Button>
              <Button onClick={exportToExcel} icon={<DownloadOutlined />}>
                导出 Excel
              </Button>
              <Button danger icon={<DeleteOutlined />}>
                清空
              </Button>
            </Space.Compact>
          </Flex>
          <Table
            loading={loading}
            rowKey="message_id"
            size="large"
            dataSource={dataList}
            columns={columns}
          />
        </Flex>
      </Modal>
    </>
  )
}

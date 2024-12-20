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
import {
  CardTitle,
  ScanOutlineComponent
} from '~/components/BaseWebsocketAdmin/CardLiveMoom'
import {
  AreaChartOutlined,
  CopyOutlined,
  DeleteOutlined,
  DownloadOutlined,
  ReloadOutlined
} from '@ant-design/icons'
import dayjs from 'dayjs'
import type { DouyinWebSocketDanmaDb } from '~/db/douyin/index'
import { getAllData } from '~/db/utils'
import * as XLSX from 'xlsx'
import { saveExcelFile } from '~/utils'

const QueryDanmuAll = async ({
  data
}: {
  data: TaskListType
}): Promise<DouyinWebSocketDanmaDb[]> => {
  return await getAllData<DouyinWebSocketDanmaDb[]>('tasks_danmu', 'douyin')
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
      dataIndex: 'task_id',
      render: () => {
        return (
          <>
            <CardTitle data={data} />
          </>
        )
      }
    },
    {
      title: '用户',
      dataIndex: 'user_name',
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
      dataIndex: 'message'
    },
    {
      title: '发送时间',
      ellipsis: true,
      sorter: (a, b) => a.timestamp - b.timestamp,
      dataIndex: 'timestamp',
      render: (text: string) => {
        return <span>{dayjs(text).format('YYYY-MM-DD HH:mm:ss')}</span>
      }
    },
    {
      title: '操作',
      width: 150,
      align: 'center',
      render: (_, record) => {
        return (
          <Flex>
            <Button type="link">管理</Button>
            <Button danger type="link">
              删除
            </Button>
          </Flex>
        )
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
        return item.user_name?.toLowerCase().includes(value.toLowerCase())
      }
      if (type === 'message') {
        return item.message?.toLowerCase().includes(value.toLowerCase())
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

  const exportToExcel = async () => {
    if (!dataList.length) {
      message.warning('暂无数据')
      return
    }

    // 创建工作表
    const ws = XLSX.utils.json_to_sheet(
      dataList.map(item => ({
        用户主页: `https://www.douyin.com/user/${item.user_id}?from_tab_name=live`,
        用户名: item.user_name,
        弹幕: item.message,
        发送时间: dayjs(item.timestamp).format('YYYY-MM-DD HH:mm:ss')
      }))
    )

    // 设置列宽
    ws['!cols'] = [
      { wch: 30 }, // 第一列宽度为30字符
      { wch: 30 }, // 第二列宽度为30字符
      { wch: 30 }, // 第三列宽度为30字符
      { wch: 30 } // 第四列宽度为30字符
    ]

    // 创建工作簿
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')

    // 导出为 Excel 文件的二进制数据
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })

    await saveExcelFile(excelBuffer, `${data.task_name}_弹幕.xlsx`)
  }

  return (
    <>
      {contextHolder}
      <Tooltip title="分析弹幕">
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
            size="small"
            dataSource={dataList}
            columns={columns}
          />
        </Flex>
      </Modal>
    </>
  )
}

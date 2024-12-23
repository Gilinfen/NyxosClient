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
  CopyOutlined,
  DeleteOutlined,
  DownloadOutlined,
  GiftOutlined,
  ReloadOutlined
} from '@ant-design/icons'
import dayjs from 'dayjs'
import type { DouyinWebSocketGiftDb } from '~/db/douyin/index'
import { getAllData, getDataByField } from '~/db/utils'
import * as XLSX from 'xlsx'
import { saveExcelFile } from '~/utils'

const QueryDanmuAll = async ({
  data
}: {
  data: TaskListType
}): Promise<DouyinWebSocketGiftDb[]> => {
  return await getDataByField<DouyinWebSocketGiftDb[]>(
    'tasks_gift',
    'task_id',
    data.task_id,
    'douyin'
  )
}

export type DataListType = Awaited<ReturnType<typeof QueryDanmuAll>>

const searchoprions = [
  { label: '用户', value: 'user' },
  { label: '礼物', value: 'gift' }
]

export const GiiftFenxi = ({ data }: { data: TaskListType }) => {
  const [open, setOpen] = useState(false)
  const [dataList, setDataList] = useState<DataListType>([])
  const [messageApi, contextHolder] = message.useMessage()
  const [loading, setLoading] = useState(false)

  const [type, setType] = useState<'user' | 'gift'>('gift')

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
      title: '礼物',
      ellipsis: true,
      dataIndex: 'gift_name',
      sorter: (a, b) => a.repeat_count - b.repeat_count,
      render(value, record, index) {
        return (
          <Tooltip title={value}>
            <Space>
              <img src={record.gift_url} className="w-[2rem]" />
              {record.repeat_count}
            </Space>
          </Tooltip>
        )
      }
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
    setType(value as 'user' | 'gift')
  }

  const onSearch = async (value: string) => {
    const res = await QueryDanmuAll({ data })

    if (!value) {
      setDataList(res)
      return
    }
    const filtered = res?.filter(item => {
      if (type === 'user') {
        return item.user_name?.toLowerCase().includes(value.toLowerCase())
      }
      if (type === 'gift') {
        return item.gift_name?.toLowerCase().includes(value.toLowerCase())
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
        礼物: item.gift_name,
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

    await saveExcelFile(excelBuffer, `${data.task_name}_礼物.xlsx`)
  }

  return (
    <>
      {contextHolder}
      <Tooltip title="分析礼物">
        <Button
          type="text"
          className="scale-[1.5] mt-[.2rem] "
          onClick={onOpen}
          icon={<GiftOutlined />}
        />
      </Tooltip>
      <Modal
        open={open}
        width="80vw"
        title={
          <Space>
            <CardTitle data={data} />
            <span className="text-[red]">{dataList?.length ?? 0}</span>
            {`条礼物分析`}
          </Space>
        }
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
              ></Button>
              <Select
                options={searchoprions}
                onChange={onChangeType}
                className="w-[8rem]"
                defaultValue="gift"
                placeholder="选择类型"
              />
              <Input
                placeholder={`通过 ${
                  searchoprions.find(e => e.value === type)?.label
                } 关键词搜索`}
                onChange={onChange}
                allowClear
              />
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

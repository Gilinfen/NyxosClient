import { Button, Modal, Input, Form, Flex, Space, Alert, message } from 'antd'
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import React, { useEffect, useState } from 'react'
import type { ValidatorRule } from 'rc-field-form/lib/interface'

import cn from 'classnames'
import type { WebSocketTaskType } from '~/types/WebSocketdDB'
import type { BaseWebsocketAdminProps } from './types'

export interface UpdateLiveForm extends WebSocketTaskType {}

const urlvalidator: ValidatorRule['validator'] = (_, value) => {
  if (!value) return Promise.reject('请输入直播间链接')

  try {
    const url = new URL(value)

    // 验证URL必须包含协议、域名和路径
    if (!url.protocol || !url.hostname || !url.pathname) {
      return Promise.reject(
        '请输入完整的URL地址，包含协议(http/https)、域名和路径'
      )
    }

    // 验证协议必须是http或https
    if (!['http:', 'https:'].includes(url.protocol)) {
      return Promise.reject('URL协议必须是http或https')
    }

    // 验证域名格式
    const domainRegex = /^([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/
    if (!domainRegex.test(url.hostname)) {
      return Promise.reject('请输入有效的域名格式')
    }

    return Promise.resolve()
  } catch (err) {
    return Promise.reject('请输入有效的URL格式')
  }
}

export const KeywordsCom = ({
  value,
  onChange
}: {
  value?: string
  onChange?: (value?: string) => void
}) => {
  const [inputValue, setInputValue] = useState<string>()
  const handleAdd = () => {
    if (inputValue && !value?.split(',').includes(inputValue)) {
      onChange?.(value ? `${value},${inputValue}` : `${inputValue}`)
    }
    setInputValue(void 0)
  }
  return (
    <Flex gap={12} wrap align="center">
      <Space.Compact className="w-full">
        <Button
          type="dashed"
          icon={<DeleteOutlined />}
          danger
          onClick={() => {
            setInputValue(void 0)
            onChange?.(void 0)
          }}
        >
          清空
        </Button>
        <Input
          placeholder="请输入过滤关键词"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyUp={e => {
            e.preventDefault()
            e.stopPropagation()
            if (e.key === 'Enter') {
              handleAdd()
            }
          }}
          allowClear
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          添加
        </Button>
      </Space.Compact>
      {!!value?.length && (
        <Alert
          message="点击关键词可删除"
          className="w-full"
          type="warning"
          closable
        />
      )}
      {value ? (
        <Flex gap={4} wrap align="center" className="w-full">
          {value.split(',')?.map<React.ReactNode>(tag => (
            <Button
              type="text"
              key={tag}
              onClick={() => {
                onChange?.(
                  value
                    .split(',')
                    .filter(item => item !== tag)
                    .join(',')
                )
              }}
            >
              {tag}
            </Button>
          ))}
        </Flex>
      ) : null}
    </Flex>
  )
}

export interface UpdateLiveProps {
  type: 'add' | 'update'
  app_type: BaseWebsocketAdminProps['app_type']
  data?: UpdateLiveForm
  updateWebSocketTask?: BaseWebsocketAdminProps['updateWebSocketTask']
  className?: string
  children?: React.ReactNode
  FormItems?: React.ReactNode[]
}

export default function UpdateLive({
  type,
  app_type,
  data,
  updateWebSocketTask,
  className,
  children,
  FormItems
}: UpdateLiveProps) {
  const [open, setOpen] = useState(false)
  const [messageApi, contextHolder] = message.useMessage()

  const [form] = Form.useForm<UpdateLiveForm>()

  useEffect(() => {
    if (type === 'update' && data) {
      form.setFieldsValue(data)
    } else if (type === 'add') {
      form.setFieldsValue({
        task_name: '测试',
        app_type
      })
    }
  }, [data, form, type])

  const handleOk = async () => {
    await form.validateFields()
    const values = form.getFieldsValue()
    updateWebSocketTask?.(type, {
      ...values
    })
    messageApi.success(`${type === 'add' ? '添加' : '编辑'}直播间成功`)
    setOpen(false)
  }
  const handleCancel = () => {
    setOpen(false)
  }
  return (
    <>
      {contextHolder}
      <div
        className={cn('flex justify-center', className)}
        onClick={() => setOpen(true)}
      >
        {children}
      </div>
      <Modal
        title={type === 'add' ? '添加直播间' : '编辑直播间'}
        open={open}
        footer={null}
        onCancel={handleCancel}
        destroyOnClose
      >
        <Form<UpdateLiveForm> form={form} layout="vertical" onFinish={handleOk}>
          <Form.Item<UpdateLiveForm>
            label="直播间链接"
            name="live_url"
            rules={[
              {
                required: true,
                validator: urlvalidator
              }
            ]}
          >
            <Input allowClear placeholder="请输入直播间链接" />
          </Form.Item>
          <Form.Item<UpdateLiveForm>
            label="自定义直播间名称"
            name="task_name"
            rules={[{ required: true, message: '请输入自定义直播间名称' }]}
          >
            <Input placeholder="请输入自定义直播间名称" allowClear />
          </Form.Item>
          {FormItems}
          <Form.Item<UpdateLiveForm>
            label="直播间描述（选填）"
            name="description"
          >
            <Input.TextArea
              autoSize={{ minRows: 3, maxRows: 5 }}
              placeholder="请输入自定义直播间描述"
              allowClear
            />
          </Form.Item>
          <Form.Item>
            <Button
              icon={<PlusOutlined />}
              type="primary"
              block
              htmlType="submit"
            >
              添加
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

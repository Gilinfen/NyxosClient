import { useEffect, useState } from 'react'
import DouyinBaseInject, { type WebSocketParoams } from './class'
import { Button } from 'antd'
import { invoke } from '@tauri-apps/api/core'

export default function DouyinPage() {
  const obj = new DouyinBaseInject()
  const [wsobj, setwsobj] = useState<WebSocketParoams>()

  useEffect(() => {
    obj.getWebsocketUrl('https://live.douyin.com/786025753973').then(res => {
      if (!res) return
      setwsobj(res)
      console.log(res)
    })
  }, [])

  return (
    <div>
      <Button
        onClick={async () => {
          invoke('connect_to_websocket', {
            url: wsobj?.wsurl,
            headers: {
              'User-Agent':
                'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
              cookie: wsobj?.cookie
            }
          })
        }}
      >
        链接
      </Button>
      {wsobj?.wsurl}
    </div>
  )
}

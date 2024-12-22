import { useEffect, useState } from 'react'
import { invoke } from '@tauri-apps/api/core'
import { Button } from 'antd'

function App() {
  const [response, setResponse] = useState('')

  async function makeRequest() {
    try {
      const result = await invoke('make_https_request', {
        url: 'https://jsonplaceholder.typicode.com/posts/1',
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        body: null
      })
      setResponse(result as string)
    } catch (error) {
      console.error('Request failed:', error)
    }
  }
  useEffect(() => {}, [])

  return (
    <main className="container">
      <button onClick={makeRequest}>Make HTTPS Request</button>
      {/* 新增按钮 */}
      <p>{response}</p>
      <Button
        onClick={() => {
          invoke('pub_connect_to_websocket', {
            url: 'ws://localhost:8080',
            liveRoomId: 'live_room_id',
            taskId: 'task_id',
            headers: {
              cookie: '2'
            }
          })
        }}
      >
        连接
      </Button>
      <Button
        onClick={() => {
          invoke('close_to_websocket', {
            url: 'ws://localhost:8080',
            taskId: 'task_id',
            headers: {
              cookie: '2'
            }
          })
        }}
      >
        关闭
      </Button>
    </main>
  )
}

export default App

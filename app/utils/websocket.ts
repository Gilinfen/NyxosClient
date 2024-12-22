import { invoke } from '@tauri-apps/api/core'

export const connect_to_websocket = async ({
  url,
  task_id,
  headers
}: {
  url: string
  task_id: string
  headers: Record<string, string>
}): Promise<boolean> => {
  try {
    await invoke('connect_to_websocket', {
      url,
      taskId: task_id,
      headers
    })

    return true
  } catch (error) {
    console.log(error)
    return false
  }
}

export const close_to_websocket = async ({
  task_id
}: {
  task_id: string
}): Promise<boolean> => {
  try {
    await invoke('close_to_websocket', {
      taskId: task_id
    })

    return true
  } catch (error) {
    console.log(error)
    return false
  }
}

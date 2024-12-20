import { invoke } from '@tauri-apps/api/core'

export const connect_to_websocket = async ({
  url,
  live_room_id,
  headers
}: {
  url: string
  live_room_id: string
  headers: Record<string, string>
}): Promise<boolean> => {
  try {
    await invoke('connect_to_websocket', {
      url,
      liveRoomId: live_room_id,
      headers
    })

    return true
  } catch (error) {
    console.log(error)
    return false
  }
}

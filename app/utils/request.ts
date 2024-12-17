import { invoke } from '@tauri-apps/api/core'

export async function makeRequest<T>(
  url: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  headers: Record<string, string> = {},
  body: any = null
): Promise<T> {
  try {
    const response = await invoke<T>('make_https_request', {
      url,
      method,
      headers,
      body
    })
    return response
  } catch (error) {
    console.error('请求错误:', error)
    throw error
  }
}

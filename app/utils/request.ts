import { invoke } from '@tauri-apps/api/core'

export async function makeRequest<T>(
  url: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  headers: Record<string, string> = {},
  body: any = null
): Promise<[T, string[], any[]]> {
  try {
    const response = await invoke<[T, string[], any[]]>('make_https_request', {
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
/**
 * 将对象转换为URL参数字符串
 * @param obj 要转换的对象
 * @returns 返回格式化后的URL参数字符串
 */
export function objectToParams(obj: Record<string, any>): string {
  return Object.entries(obj)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    )
    .join('&')
}

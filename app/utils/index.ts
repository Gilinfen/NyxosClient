import { save } from '@tauri-apps/plugin-dialog'
import { writeFile } from '@tauri-apps/plugin-fs'
import { message } from 'antd'
import JSZip from 'jszip'

/**
 * 保存 Excel 文件到本地
 * @param {Uint8Array} excelBuffer - Excel 文件的二进制数据
 * @param {string} fileName - 默认的文件名，例如 '导出文件.xlsx'
 */
export const saveExcelFile = async (
  excelBuffer: Uint8Array,
  fileName: string = '导出文件.xlsx'
) => {
  try {
    // 打开保存文件对话框
    const filePath = await save({
      defaultPath: fileName,
      filters: [{ name: 'Excel Files', extensions: ['xlsx'] }]
    })

    if (!filePath) {
      message.warning('未选择保存路径')
      return
    }

    // 使用 Tauri 文件系统模块保存文件
    await writeFile(filePath, new Uint8Array(excelBuffer)) // 转为 Uint8Array 格式
    message.success(`文件已成功保存到: ${filePath}`)
  } catch (error) {
    console.error('保存文件失败:', error)
    message.error('保存文件失败，请重试')
  }
}

/**
 * 创建一个延迟函数
 * @param ms 延迟的毫秒数
 * @returns 返回一个 Promise，在指定的时间后解决
 */
export const delay = (ms: number): Promise<void> => {
  return new Promise<void>(resolve => {
    const timeid = setTimeout(() => {
      clearTimeout(timeid)
      resolve()
    }, ms)
  })
}

/**
 * 动态加载 JavaScript 文件
 * @param url 要加载的 JavaScript 文件的 URL
 * @returns 返回一个 Promise，加载成功则解决，失败则报错
 */
export const loadScript = (
  url: string,
  callback?: () => Promise<void>
): Promise<() => void> => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = url
    script.async = true

    script.onload = () => {
      resolve(async () => {
        await callback?.()
        document.body.removeChild(script)
      })
    }

    script.onerror = () => {
      reject(new Error(`加载脚本失败: ${url}`))
    }

    document.body.appendChild(script)
  })
}
/**
 * 轮询方法
 * @param task 要执行的异步任务
 * @param interval 轮询间隔时间（毫秒）
 * @param maxDuration 最大请求时间（毫秒）
 * @returns 返回一个 Promise，表示轮询的结果
 */
export const poll = async (
  task: () => Promise<boolean>,
  interval: number,
  maxDuration: number = 300000
): Promise<void> => {
  const startTime = Date.now()
  const intervalId = setInterval(async () => {
    if (Date.now() - startTime >= maxDuration) {
      clearInterval(intervalId)
    }
    try {
      const stop = await task()
      if (stop) {
        clearInterval(intervalId)
      }
    } catch (error) {
      clearInterval(intervalId)
      // 继续轮询，直到达到最大请求时间
    }
  }, interval)
}

/**
 * 将字符串转换为JSON对象
 * @param str 要转换的字符串
 * @returns 返回JSON对象或原字符串
 */
export const stringToJson = (str: string): any => {
  try {
    return JSON.parse(str)
  } catch {
    return str
  }
}
export async function fetchAndExtractZipAsBase64(
  zipUrl: string
): Promise<string[]> {
  try {
    console.log('Fetching ZIP file...')

    // 下载 ZIP 文件
    const response = await fetch(zipUrl)
    if (!response.ok) {
      throw new Error(`Failed to fetch ZIP file: ${response.statusText}`)
    }

    // 读取 ZIP 文件为 ArrayBuffer
    const zipData = await response.arrayBuffer()

    console.log('Unzipping file...')
    const zip = await JSZip.loadAsync(zipData) // 加载 ZIP 文件
    const base64Urls: string[] = []

    // 遍历 ZIP 中的文件
    for (const [filename, file] of Object.entries(zip.files)) {
      if (!file.dir && filename.endsWith('.mp4')) {
        // 检查是否为 MP4 文件
        console.log(`Extracting file: ${filename}`)

        // 读取文件为 Blob
        const fileBlob = await file.async('blob')

        // 将 Blob 转换为 Base64 URL
        const base64Url = await blobToBase64(fileBlob)
        base64Urls.push(base64Url)

        console.log(`Generated Base64 URL: ${base64Url}`)
      }
    }

    return base64Urls
  } catch (error) {
    console.error(`An error occurred: ${(error as Error).message}`)
    return []
  }
}
function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      if (reader.result && typeof reader.result === 'string') {
        resolve(reader.result)
      } else {
        reject(new Error('Failed to convert Blob to Base64.'))
      }
    }
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

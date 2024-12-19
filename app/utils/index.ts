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

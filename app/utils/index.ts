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

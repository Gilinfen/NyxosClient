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

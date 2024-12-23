import { useState, useRef, useCallback, useEffect } from 'react'

interface UseQueueStackOptions<T> {
  /** 初始数组 */
  initialList?: T[]
  /** 初始最大长度，超出后移除多余元素；仅队列模式下生效 */
  initialMaxSize?: number
  /** 用于识别元素唯一键的回调；仅队列模式下生效 */
  getKey?: (item: T) => string
  /** 若有重复 key，true=跳过新元素，false=覆盖旧元素；仅队列模式下生效 */
  skipDuplicates?: boolean
  /** 超出时移除最新('end')还是最旧('start')；仅队列模式下生效 */
  removeFrom?: 'end' | 'start'
  /**
   * 是否启用队列模式
   * - true: 采用排队 + 延迟 + 去重 + 超限
   * - false: 像普通 useState 一样，立即更新
   */
  queueEnabled?: boolean
}

interface QueueTask<T> {
  items: T[]
  duration: number
  // 若你还有 priority，可加进来
}

interface UseQueueStackReturn<T> {
  /** 当前数组 */
  list: T[]

  /**
   * 添加（或排队）若干元素
   * - items: 要插入的元素
   * - duration: 等待毫秒数；若 queueEnabled=false，则无效
   */
  addItems: (items: T[], duration?: number) => void

  /**
   * 取消全部队列任务；若 queueEnabled=false，则此操作可忽略
   */
  cancelAllTasks: () => void

  /** 当前最大长度；若 queueEnabled=false，则不生效 */
  maxSize: number
  /** 改变最大长度；若 queueEnabled=false，则不生效 */
  setMaxSize: (size: number) => void
}

/**
 * useQueueStack — 可切换“队列模式”或“普通模式”的 Hook
 */
export function useQueueStack<T>({
  initialList = [],
  initialMaxSize = Infinity,
  getKey,
  skipDuplicates = false,
  removeFrom = 'start',
  queueEnabled = true
}: UseQueueStackOptions<T>): UseQueueStackReturn<T> {
  // ————— 通用 state —————
  const [list, setList] = useState<T[]>(initialList)
  const [maxSize, setMaxSize] = useState<number>(initialMaxSize)

  // ————— 若队列模式关闭，就只用普通 useState —————
  // 直接定义一个函数：每次 addItems 就立刻 setList
  // 不去做队列、定时器、去重、maxSize 等操作
  if (!queueEnabled) {
    return {
      list,
      addItems: (items: T[]) => {
        setList(prev => {
          let updated = [...prev]
          for (const newItem of items) {
            if (!getKey) {
              // 如果没提供 getKey，就简单 push
              updated.push(newItem)
              continue
            }
            const key = getKey(newItem)
            const oldIndex = updated.findIndex(old => getKey(old) === key)
            if (oldIndex !== -1) {
              if (skipDuplicates) {
                // 跳过
                continue
              } else {
                // 覆盖
                updated[oldIndex] = newItem
              }
            } else {
              updated.push(newItem)
            }
          }

          // 若超过 maxSize => pop 或 shift
          while (updated.length > maxSize) {
            if (removeFrom === 'end') {
              updated.pop()
            } else {
              updated.shift()
            }
          }

          return updated
        })
      },
      cancelAllTasks: () => {
        // 对普通模式无意义，可留空
      },
      maxSize,
      setMaxSize
    }
  }

  // ————— 若队列模式开启 => 原先的“队列逻辑” —————

  // 任务队列
  const tasksRef = useRef<QueueTask<T>[]>([])
  // 是否在处理
  const isProcessingRef = useRef(false)
  // 当前 setTimeout id
  const timerIdRef = useRef<number | undefined>(undefined)

  // 处理一个任务
  const handleNext = useCallback(() => {
    const task = tasksRef.current.shift()
    if (!task) {
      isProcessingRef.current = false
      return
    }

    const { items, duration } = task
    // 插入逻辑(去重 + 超限)
    setList(prev => {
      let updated = [...prev]
      for (const newItem of items) {
        if (!getKey) {
          // 如果没提供 getKey，就简单 push
          updated.push(newItem)
          continue
        }
        const key = getKey(newItem)
        const oldIndex = updated.findIndex(old => getKey(old) === key)
        if (oldIndex !== -1) {
          if (skipDuplicates) {
            // 跳过
            continue
          } else {
            // 覆盖
            updated[oldIndex] = newItem
          }
        } else {
          updated.push(newItem)
        }
      }
      // 若超过 maxSize => pop 或 shift
      while (updated.length > maxSize) {
        if (removeFrom === 'end') {
          updated.pop()
        } else {
          updated.shift()
        }
      }
      return updated
    })

    // 等待 duration，再处理下一个
    timerIdRef.current = window.setTimeout(() => {
      timerIdRef.current = undefined
      handleNext()
    }, duration)
  }, [getKey, skipDuplicates, maxSize, removeFrom])

  // 启动处理
  const processQueue = useCallback(() => {
    if (isProcessingRef.current) return
    isProcessingRef.current = true
    handleNext()
  }, [handleNext])

  // 外部添加任务
  const addItems = useCallback(
    (items: T[], duration: number = 0) => {
      tasksRef.current.push({ items, duration })
      processQueue()
    },
    [processQueue]
  )

  // 取消所有任务
  const cancelAllTasks = useCallback(() => {
    tasksRef.current = []
    if (timerIdRef.current) {
      clearTimeout(timerIdRef.current)
      timerIdRef.current = undefined
    }
    isProcessingRef.current = false
  }, [])

  // 卸载时清理
  useEffect(() => {
    return () => {
      if (timerIdRef.current) {
        clearTimeout(timerIdRef.current)
        timerIdRef.current = undefined
      }
      tasksRef.current = []
      isProcessingRef.current = false
    }
  }, [])

  return {
    list,
    addItems,
    cancelAllTasks,
    maxSize,
    setMaxSize
  }
}

import * as CryptoJS from 'crypto-js'
import { makeRequest } from '~/utils/request'
import { DouyinCookieApi } from './cookie'
import { loadScript } from '~/utils'
import webmssdk from '~/assets/douyin/webmssdk?url'

interface WsParams {
  baseUrl: string
  params: Record<string, string | number | boolean>
}

export interface LiveRoomInfo {
  roomId: string
  roomTitle: string
  roomUserCount: string
  uniqueId: string
  avatar: string
}

/**
 * 抖音业务相关的命令处理类
 */
export class DouyinWebSocketCommands {
  /**
   * 获取房间信息
   * @param html 房间页面HTML
   * @returns Promise<LiveRoomInfo>
   */
  private static getRoomInfoApi(html: string): Omit<LiveRoomInfo, 'cookie'> {
    const matchRes_unique_id = html.match(/user_unique_id\\":\\"(\d+)\\"/)
    const matchRes_room_id = html.match(/roomId\\":\\"(\d+)\\"/)
    if (!matchRes_unique_id) throw new Error('获取user_unique_id失败')
    if (!matchRes_room_id) throw new Error('获取room_id失败')

    const uniqueId = matchRes_unique_id[1]
    const roomId = matchRes_room_id[1]
    const roomTitle = ''
    const roomUserCount = ''
    const avatar = ''

    return {
      roomId,
      roomTitle,
      roomUserCount,
      uniqueId,
      avatar
    }
  }

  /**
   * 获取直播间信息
   * @param url 直播间URL
   * @returns Promise<LiveRoomInfo>
   */
  public static async getLiveInfo(url: string): Promise<LiveRoomInfo> {
    try {
      const __ac_nonce = await DouyinCookieApi.get__ac_nonce()
      const __ac_signature = await DouyinCookieApi.get__ac_signature(__ac_nonce)

      // 发送HTTP请求获取直播间页面内容
      const response = await makeRequest<string>(
        url,
        'GET',
        {
          accept:
            'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
          'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8',
          'cache-control': 'no-cache',
          cookie: `xg_device_score=7.480792093470084; WallpaperGuide=%7B%22showTime%22%3A1734629129459%2C%22closeTime%22%3A0%2C%22showCount%22%3A1%2C%22cursor1%22%3A10%2C%22cursor2%22%3A2%7D; webcast_local_quality=ld; IsDouyinActive=false; __ac_nonce=${__ac_nonce}; __ac_signature=${__ac_signature}; __ac_referer=__ac_blank`,
          pragma: 'no-cache',
          priority: 'u=0, i',
          referer: 'https://live.douyin.com/156392868120',
          'sec-ch-ua':
            '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"macOS"',
          'sec-fetch-dest': 'document',
          'sec-fetch-mode': 'navigate',
          'sec-fetch-site': 'same-origin',
          'upgrade-insecure-requests': '1',
          'user-agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
        },
        null
      )

      const html = response[0]

      // 使用getRoomInfoApi解析页面内容获取直播间信息
      const roomInfo = this.getRoomInfoApi(html)
      return {
        ...roomInfo
      }
    } catch (error) {
      console.error('[DouyinCommands] getLiveInfo error:', error)
      throw error
    }
  }
}

export type WebSocketParoams = {
  wsurl: string
}

export default class DouyinBaseInject {
  public static async getWebsocketUrl(
    liveUrl: string
  ): Promise<WebSocketParoams | undefined> {
    const response = await DouyinWebSocketCommands.getLiveInfo(liveUrl)

    if (!response) return
    const { roomId, uniqueId } = response
    console.log(roomId, uniqueId, '--roomId, uniqueId')
    const sign = await this.generateLiveSignature(roomId, uniqueId)

    const buildWsUrl = (wsParams: WsParams) => {
      return (
        wsParams.baseUrl +
        '?' +
        Object.entries(wsParams.params)
          .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
          .join('&')
      )
    }

    function generateCursor(): string {
      const prefix = 'fh' // 固定前缀
      const mainId = BigInt(Math.floor(Math.random() * 10 ** 18)).toString() // 模拟随机生成的大数
      const timestamp = Date.now() // 当前时间戳（毫秒）
      const requestSeq = Math.floor(Math.random() * 10) // 模拟请求序列号（0-9 的随机数）
      const flagD = 1 // 固定标志位
      const flagU = 1 // 固定标志位

      return `${prefix}-${mainId}_t-${timestamp}_r-${requestSeq}_d-${flagD}_u-${flagU}`
    }
    function generateInternalExt(roomId: string, uniqueId: string): string {
      const internalSrc = 'dim' // 固定前缀
      const firstRequestMs = Date.now() - Math.floor(Math.random() * 10000) // 模拟首次请求时间戳
      const fetchTime = Date.now() // 当前请求时间戳
      const sequence = Math.floor(Math.random() * 100) // 模拟请求序列号
      const wssInfo = `0-${fetchTime}-0-0` // wss_info 格式推测为固定模式
      const wrdsValue = BigInt(Math.floor(Math.random() * 10 ** 18)).toString() // 随机生成大数

      return `internal_src:${internalSrc}|wss_push_room_id:${roomId}|wss_push_did:${uniqueId}|first_req_ms:${firstRequestMs}|fetch_time:${fetchTime}|seq:${sequence}|wss_info:${wssInfo}|wrds_v:${wrdsValue}`
    }

    // 示例
    const cursor = generateCursor()

    const wsParams: WsParams = {
      baseUrl: 'wss://webcast5-ws-web-lq.douyin.com/webcast/im/push/v2/',
      params: {
        app_name: 'douyin_web',
        version_code: '180800',
        webcast_sdk_version: '1.0.14-beta.0',
        update_version_code: '1.0.14-beta.0',
        compress: 'gzip',
        device_platform: 'web',
        cookie_enabled: true,
        screen_width: Math.floor(Math.random() * (1500 - 600 + 1)) + 600,
        screen_height: Math.floor(Math.random() * (1500 - 600 + 1)) + 600,
        browser_language: 'zh-CN',
        browser_platform: 'MacIntel',
        browser_name: 'Mozilla',
        browser_version:
          '5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
        browser_online: true,
        tz_name: 'Asia/Shanghai',
        cursor,
        // cursor: 'fh-7444025139325064228_t-1733197209644_r-1_d-1_u-1',
        internal_ext: generateInternalExt(roomId, uniqueId),
        // internal_ext: `internal_src:dim|wss_push_room_id:${roomId}|wss_push_did:${uniqueId}|first_req_ms:1733197209552|fetch_time:1733197209644|seq:1|wss_info:0-1733197209644-0-0|wrds_v:7444025330173480349`,
        host: 'https://live.douyin.com',
        aid: '6383',
        live_id: '1',
        did_rule: '3',
        endpoint: 'live_pc',
        support_wrds: '1',
        user_unique_id: uniqueId,
        im_path: '/webcast/im/fetch/',
        identity: 'audience',
        need_persist_msg_count: '15',
        insert_task_id: '',
        live_reason: '',
        room_id: roomId,
        heartbeatDuration: '0',
        signature: sign
      }
    }
    return {
      wsurl: buildWsUrl(wsParams)
    }
  }

  public static async generateLiveSignature(
    roomId: string,
    uniqueId: string
  ): Promise<string> {
    // 构建签名字符串
    //
    const signString = `live_id=1,aid=6383,version_code=180800,webcast_sdk_version=1.0.14-beta.0,room_id=${roomId},sub_room_id=,sub_channel_id=,did_rule=3,user_unique_id=${uniqueId},device_platform=web,device_type=,ac=,identity=audience`
    const signParams = {
      live_id: '1',
      aid: '6383',
      version_code: '180800',
      webcast_sdk_version: '1.0.14-beta.0',
      room_id: roomId,
      sub_room_id: '',
      sub_channel_id: '',
      did_rule: '3',
      user_unique_id: uniqueId,
      device_platform: 'web',
      device_type: '',
      ac: '',
      identity: 'audience'
    }

    const buildSignString = (params: Record<string, string>) => {
      return Object.entries(params)
        .map(([key, value]) => `${key}=${value}`)
        .join(',')
    }

    // const signString = buildSignString(signParams)
    const md5Hash = CryptoJS.MD5(signString).toString()
    let sign = ''
    const remjs = await loadScript(webmssdk, async () => {
      // 计算签名
      sign = window.byted_acrawler.frontierSign({
        'X-MS-STUB': md5Hash
      })['X-Bogus']
      // @ts-ignore
      window.byted_acrawler = null
    })
    remjs()

    return sign
  }
}

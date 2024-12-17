import * as CryptoJS from 'crypto-js'
import { makeRequest } from '../../utils/request'

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
  cookie: string
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
      // 发送HTTP请求获取直播间页面内容
      const response = await makeRequest<
        [
          string,
          {
            [key: string]: string
          }
        ]
      >(
        url,
        'GET',
        {
          accept:
            'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
          'accept-language': 'zh-CN,zh;q=0.9',
          'cache-control': 'no-cache',
          cookie:
            'ttwid=1%7C-9Xb17SzUTZ5P3xJXnJgbzwGVVfWCykiC-awYcxPTdM%7C1734405715%7C1a2adab5223be65699af46c48deb7385eb4b449ff0652bb580af033cd1a61084; UIFID_TEMP=0de8750d2b188f4235dbfd208e44abbb976428f0720eb983255afefa45d39c0c07d9b35f22281f824652c7d77c91c17baddfe58532ed9791835b929e5539d725a0d00d144f80ade85c3820c75e62596b; hevc_supported=true; home_can_add_dy_2_desktop=%220%22; stream_recommend_feed_params=%22%7B%5C%22cookie_enabled%5C%22%3Atrue%2C%5C%22screen_width%5C%22%3A1728%2C%5C%22screen_height%5C%22%3A1117%2C%5C%22browser_online%5C%22%3Atrue%2C%5C%22cpu_core_num%5C%22%3A10%2C%5C%22device_memory%5C%22%3A8%2C%5C%22downlink%5C%22%3A10%2C%5C%22effective_type%5C%22%3A%5C%224g%5C%22%2C%5C%22round_trip_time%5C%22%3A100%7D%22; strategyABtestKey=%221734405717.491%22; volume_info=%7B%22isUserMute%22%3Afalse%2C%22isMute%22%3Afalse%2C%22volume%22%3A0.5%7D; passport_csrf_token=0c2eff284eaed9c750c1c83a932400e2; passport_csrf_token_default=0c2eff284eaed9c750c1c83a932400e2; FORCE_LOGIN=%7B%22videoConsumedRemainSeconds%22%3A180%7D; biz_trace_id=1a7cfa15; bd_ticket_guard_client_data=eyJiZC10aWNrZXQtZ3VhcmQtdmVyc2lvbiI6MiwiYmQtdGlja2V0LWd1YXJkLWl0ZXJhdGlvbi12ZXJzaW9uIjoxLCJiZC10aWNrZXQtZ3VhcmQtcmVlLXB1YmxpYy1rZXkiOiJCTUd3THp5aEcwUE5UOUpSOEpkVFZHZkx6NFZld2U2dGFDSjd5Mlo5STg4OWVxcmE3VFZNcnNMY0xNeEx2c1pQbTVnaTFwS2tTbHFPSzZQUW5xZTR3aFU9IiwiYmQtdGlja2V0LWd1YXJkLXdlYi12ZXJzaW9uIjoyfQ%3D%3D; bd_ticket_guard_client_web_domain=2; sdk_source_info=7e276470716a68645a606960273f276364697660272927676c715a6d6069756077273f276364697660272927666d776a68605a607d71606b766c6a6b5a7666776c7571273f275e58272927666a6b766a69605a696c6061273f27636469766027292762696a6764695a7364776c6467696076273f275e5827292771273f273d313c3d3432303531313632342778; bit_env=E2SAD7d2AxFCA1TjcA0Mkz6KZ-X5MeO_7zFfAbhaHesBIUJTefQSU_b9wAQj96YBOWnqJFUkkN1nD1GcBdEvgYBG24pDQAVbMgHN1RLJk_R4V-RM20HMkT5jh-ndFUHR2JTNCC9NyRahycSKysol_OytIOfyeIHGdNJToORya6GRQVGOlRUX7I7oyyWAOvNnOw0mZYfpLD-hFh9a2uuRYTwer-pAQsRTFrlPh0Lw2-x2SkAd11bGNZCtW4pl4fTN7Fg3wtlx4CoDJ69GxSONS9Cm7WgBEf3Tq7KUH4Bamn5ybc5xPgwL0vNO39QpN8czm7gjYCj76IFAknBpkmMD3Cz00hFsnvewT1MPnG03YJi3SQQTUQIAUfO6r94EqNoKI5TzPMb9vqtGM8cYdCgU7H5GV5t6bGS6VmmliXUo9lJFlu5lf4cZMXF-ufr9G1hniuthpXI-kNGqRUqiTh1ZIQyV65opbqAHgnWsr0X3aB5jPjSVpP_RpkBJQvYepR1JlXA4JtxE6gnEtPBe8Jf9q9K537HyfWCNCshbqQWhL_A%3D; gulu_source_res=eyJwX2luIjoiMDhjOGQ3ZTJiODQyNjZkZWI5Y2VkMGJiODNlNmY1ZWY0ZjMyNTE2ZmYyZjAzNDMzZjI0OWU1Y2Q1NTczNTk5NyJ9; passport_auth_mix_state=t0m4d3gwy72xgsg0edsfnk3wbqmf2q2r; odin_tt=ece2909afed5fbfb24b64e38afa7ae0b70c12e839a985a4c0950cc7e1fdb50b28695f1cadc68b389daba33897b9c2b6de02c3598eb6e88fce8b9cc4e2535d6752833824c59256e4de68c45c7d9017992; stream_player_status_params=%22%7B%5C%22is_auto_play%5C%22%3A0%2C%5C%22is_full_screen%5C%22%3A0%2C%5C%22is_full_webscreen%5C%22%3A0%2C%5C%22is_mute%5C%22%3A0%2C%5C%22is_speed%5C%22%3A1%2C%5C%22is_visible%5C%22%3A0%7D%22; x-web-secsdk-uid=fc38192f-cd1a-4d11-9602-1615b6c94bdf; __live_version__=%221.1.2.6318%22; has_avx2=null; device_web_cpu_core=10; device_web_memory_size=8; live_can_add_dy_2_desktop=%220%22; live_use_vvc=%22false%22; csrf_session_id=fcc847f544f41fd021838c1212b735b2; fpk1=U2FsdGVkX1+q9kohLf/1UIxSwloTWNv6Dl4PDtPGV43ARiAWl5oCtLgxrCP9o5nNEyq8SpoBo8BAn3HeCs2Evw==; fpk2=0845b309c7b9b957afd9ecf775a4c21f; __ac_nonce=06760ee6000d3103149cb; __ac_signature=_02B4Z6wo00f01uBQJAgAAIDBsq8EEAGcg87gcCCAAN-C80; xgplayer_user_id=496289198707; h265ErrorNum=-1; webcast_local_quality=sd; IsDouyinActive=false',
          pragma: 'no-cache',
          priority: 'u=0, i',
          referer:
            'https://live.douyin.com/455857345628?cover_type=0&enter_from_merge=web_live&enter_method=web_card&game_name=&is_recommend=1&live_type=game&more_detail=&request_id=2024121711220055CD9DCE7CEB137122AB&room_id=7449185173100415782&stream_type=vertical&title_type=1&url_source=&web_live_page=hot_live&web_live_tab=all',
          'sec-ch-ua':
            '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"macOS"',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'navigate',
          'sec-fetch-site': 'same-origin',
          'upgrade-insecure-requests': '1',
          'user-agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
        },
        null
      )

      const html = response[0] as string

      // 使用getRoomInfoApi解析页面内容获取直播间信息
      const roomInfo = this.getRoomInfoApi(html)
      return {
        ...roomInfo,
        cookie: response[1]['set-cookie']
      }
    } catch (error) {
      console.error('[DouyinCommands] getLiveInfo error:', error)
      throw error
    }
  }
}

export type WebSocketParoams = {
  wsurl: string
  cookie: string
}

export default class DouyinBaseInject {
  public async getWebsocketUrl(
    liveUrl: string
  ): Promise<WebSocketParoams | undefined> {
    const response = await DouyinWebSocketCommands.getLiveInfo(liveUrl)

    if (!response) return
    const { roomId, uniqueId, cookie } = response
    console.log(roomId, uniqueId, '--roomId, uniqueId')
    const sign = this.generateLiveSignature(roomId, uniqueId)

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
        screen_width: 1728,
        screen_height: 1117,
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
      wsurl: buildWsUrl(wsParams),
      cookie
    }
  }

  public generateLiveSignature(roomId: string, uniqueId: string): string {
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

    // 计算签名
    const sign = window.byted_acrawler.frontierSign({
      'X-MS-STUB': md5Hash
    })['X-Bogus']

    return sign
  }
}

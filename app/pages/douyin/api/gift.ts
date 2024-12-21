import { makeRequest, objectToParams } from '~/utils/request'
import { DouyinAPIEndpoints } from '../urls'
import DouyinBaseInject, { DouyinWebSocketCommands } from './base'
import { getUserAgent } from '~/common/api'
import { DouyinCookieApi } from './cookie'

export class GiftMessageApi {
  public static async getGiftList(liveUrl: string) {
    const { roomId, sec_uid } = await DouyinWebSocketCommands.getLiveInfo(
      liveUrl
    )
    const userange = await getUserAgent()
    const ttwid = await DouyinCookieApi.getTtwid()
    const msToken = await DouyinBaseInject.getmsToken()

    const params_obj = {
      aid: 6383,
      app_name: 'douyin_web',
      live_id: 1,
      device_platform: 'web',
      language: 'zh-CN',
      cookie_enabled: true,
      screen_width: 1728,
      screen_height: 1117,
      browser_language: 'zh-CN',
      browser_platform: 'MacIntel',
      browser_name: 'Chrome',
      browser_version: '131.0.0.0',
      browser_online: true,
      engine_name: 'Blink',
      engine_version: '131.0.0.0',
      os_name: 'Mac OS',
      os_version: '10.15.7',
      cpu_core_num: 10,
      device_memory: 8,
      platform: 'PC',
      downlink: 10,
      effective_type: '4g',
      round_trip_time: 50,
      channel: 'channel_pc_web',
      webid: '',
      user_agent: userange,
      fp: '',
      did: 0,
      referer: liveUrl,
      target: '',
      device_id: '',
      webcast_sdk_version: 2450,
      room_id: roomId,
      to_room_id: roomId,
      sec_anchor_id: sec_uid,
      sec_to_user_id: sec_uid,
      gift_scene: 1,
      to_episode_id: 0,
      fetch_giftlist_from: 3,
      msToken: msToken,
      a_bogus: ''
    }

    // @ts-ignore
    delete params_obj.a_bogus

    params_obj.a_bogus = await DouyinBaseInject.getABougus16X(
      objectToParams(params_obj),
      userange
    )

    const params = objectToParams(params_obj)

    const url = `${DouyinAPIEndpoints.LIVE_DOMAIN.ROUTERS.WEBCAST_GIFT__LIST}?${params}`

    const val = await makeRequest<any[]>({
      url,
      headers: {
        cookie: `ttwid=${ttwid}`,
        'user-agent': userange
      }
    })

    return val
  }
}

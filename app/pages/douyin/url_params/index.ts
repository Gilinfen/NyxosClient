import type { SSO_DOMAIN_PARAMS } from './SSO_DOMAIN_PARAMS'

export interface DouyinAPIEndpointsInterface {
  /** 抖音域名 (Douyin Domain) */
  DOUYIN_DOMAIN: {
    BASE_URL: string
    ROUTERS: {
      /** 首页Feed */
      TAB_FEED: { params?: any; response: any }
      /** 用户短信息 */
      USER_SHORT_INFO: { params: { userId: string }; response: any }
      /** 用户详细信息 */
      USER_DETAIL: { params: { userId: string }; response: any }
      /** 作品基本 */
      BASE_AWEME: { params: { awemeId: string }; response: any }
      /** 用户作品 */
      USER_POST: { params: { userId: string }; response: any }
      /** 定位作品 */
      LOCATE_POST: { params: { location: string }; response: any }
      /** 综合搜索 */
      GENERAL_SEARCH: { params: { query: string }; response: any }
      /** 视频搜索 */
      VIDEO_SEARCH: { params: { query: string }; response: any }
      /** 用户搜索 */
      USER_SEARCH: { params: { query: string }; response: any }
      /** 直播间搜索 */
      LIVE_SEARCH: { params: { query: string }; response: any }
      /** 作品信息 */
      POST_DETAIL: { params: { postId: string }; response: any }
      /** 单个作品视频弹幕数据 */
      POST_DANMAKU: { params: { postId: string }; response: any }
      /** 用户喜欢A */
      USER_FAVORITE_A: { params: { userId: string }; response: any }
      /** 用户喜欢B */
      USER_FAVORITE_B: { params: { userId: string }; response: any }
      /** 关注用户 */
      USER_FOLLOWING: { params: { userId: string }; response: any }
      /** 粉丝用户 */
      USER_FOLLOWER: { params: { userId: string }; response: any }
      /** 合集作品 */
      MIX_AWEME: { params: { userId: string }; response: any }
      /** 用户历史 */
      USER_HISTORY: { params: { userId: string }; response: any }
      /** 用户收藏 */
      USER_COLLECTION: { params: { userId: string }; response: any }
      /** 用户收藏夹 */
      USER_COLLECTS: { params: { userId: string }; response: any }
      /** 用户收藏夹作品 */
      USER_COLLECTS_VIDEO: { params: { userId: string }; response: any }
      /** 用户音乐收藏 */
      USER_MUSIC_COLLECTION: { params: { userId: string }; response: any }
      /** 首页朋友作品 */
      FRIEND_FEED: { params: { userId: string }; response: any }
      /** 关注用户作品 */
      FOLLOW_FEED: { params: { userId: string }; response: any }
      /** 相关推荐 */
      POST_RELATED: { params: { postId: string }; response: any }
      /** 关注用户列表直播 */
      FOLLOW_USER_LIVE: { params: { userId: string }; response: any }
      /** 直播信息接口 */
      LIVE_INFO: { params: { roomId: string }; response: any }
      /** 直播信息接口2 */
      LIVE_INFO_ROOM_ID: { params: { roomId: string }; response: any }
      /** 直播间送礼用户排行榜 */
      LIVE_GIFT_RANK: { params: { roomId: string }; response: any }
      /** 直播用户信息 */
      LIVE_USER_INFO: { params: { userId: string }; response: any }
      /** 推荐搜索词 */
      SUGGEST_WORDS: { params: { query: string }; response: any }
      /** 作品评论 */
      POST_COMMENT: { params: { postId: string }; response: any }
      /** 评论回复 */
      POST_COMMENT_REPLY: { params: { commentId: string }; response: any }
      /** 回复评论 */
      POST_COMMENT_PUBLISH: {
        params: { postId: string; content: string }
        response: any
      }
      /** 删除评论 */
      POST_COMMENT_DELETE: { params: { commentId: string }; response: any }
      /** 点赞评论 */
      POST_COMMENT_DIGG: { params: { commentId: string }; response: any }
      /** 抖音热榜数据 */
      DOUYIN_HOT_SEARCH: { params?: any; response: any }
      /** 抖音视频频道 */
      DOUYIN_VIDEO_CHANNEL: { params?: any; response: any }
    }
  }

  /** 抖音短域名 (Short Domain) */
  IESDOUYIN_DOMAIN: {
    BASE_URL: string
    ROUTERS: {}
  }

  /** 直播域名 (Live Domain) */
  LIVE_DOMAIN: {
    BASE_URL: string
    ROUTERS: {}
  }

  /** 直播域名2 (Live Domain 2) */
  LIVE_DOMAIN2: {
    BASE_URL: string
    ROUTERS: {}
  }

  /** SSO域名 (SSO Domain) */
  SSO_DOMAIN: {
    BASE_URL: string
    ROUTERS: {
      /** SSO登录获取二维码 */
      SSO_LOGIN_GET_QR: {
        params: SSO_DOMAIN_PARAMS.SSO_LOGIN_GET_QR
        response: any
      }
      /** 登录检查 */
      SSO_LOGIN_CHECK_QR: {
        params: SSO_DOMAIN_PARAMS.SSO_LOGIN_CHECK_QR
        response: {
          data: {
            /**
             * - 1 查询确认
             * - 2 扫码成功
             * - 5 已过期
             */
            status: '1' | '2' | '5'
          }
          description: string
          /**
           * - 0 正常查询
           * - 2046 身份验证（登陆环境有问题）
           */
          error_code: 0 | 2046
          message: 'success'
        }
      }
      /** 登录确认 */
      SSO_LOGIN_CHECK_LOGIN: {
        params: SSO_DOMAIN_PARAMS.SSO_LOGIN_CHECK_QR
        response: any
      }
      /** 登录重定向 */
      SSO_LOGIN_REDIRECT: { params?: any; response: any }
      /** 登录回调 */
      SSO_LOGIN_CALLBACK: { params?: any; response: any }
    }
  }

  /** WSS域名 (WSS Domain) */
  WEBCAST_WSS_DOMAIN: {
    BASE_URL: string
    ROUTERS: {}
  }
}

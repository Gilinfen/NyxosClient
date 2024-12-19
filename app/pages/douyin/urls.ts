export class DouyinAPIEndpoints {
  /** 抖音域名 (Douyin Domain) */
  static readonly DOUYIN_DOMAIN = {
    /** 抖音的基础URL */
    BASE_URL: 'https://www.douyin.com',
    ROUTERS: {
      /** 首页Feed */
      TAB_FEED: '/aweme/v1/web/tab/feed/',
      /** 用户短信息 */
      USER_SHORT_INFO: '/aweme/v1/web/im/user/info/',
      /** 用户详细信息 */
      USER_DETAIL: '/aweme/v1/web/user/profile/other/',
      /** 作品基本 */
      BASE_AWEME: '/aweme/v1/web/aweme/',
      /** 用户作品 */
      USER_POST: '/aweme/v1/web/aweme/post/',
      /** 定位作品 */
      LOCATE_POST: '/aweme/v1/web/locate/post/',
      /** 综合搜索 */
      GENERAL_SEARCH: '/aweme/v1/web/general/search/single/',
      /** 视频搜索 */
      VIDEO_SEARCH: '/aweme/v1/web/search/item/',
      /** 用户搜索 */
      USER_SEARCH: '/aweme/v1/web/discover/search/',
      /** 直播间搜索 */
      LIVE_SEARCH: '/aweme/v1/web/live/search/',
      /** 作品信息 */
      POST_DETAIL: '/aweme/v1/web/aweme/detail/',
      /** 单个作品视频弹幕数据 */
      POST_DANMAKU: '/aweme/v1/web/danmaku/get_v2/',
      /** 用户喜欢A */
      USER_FAVORITE_A: '/aweme/v1/web/aweme/favorite/',
      /** 用户喜欢B */
      USER_FAVORITE_B: '/web/api/v2/aweme/like/',
      /** 关注用户 */
      USER_FOLLOWING: '/aweme/v1/web/user/following/list/',
      /** 粉丝用户 */
      USER_FOLLOWER: '/aweme/v1/web/user/follower/list/',
      /** 合集作品 */
      MIX_AWEME: '/aweme/v1/web/mix/aweme/',
      /** 用户历史 */
      USER_HISTORY: '/aweme/v1/web/history/read/',
      /** 用户收藏 */
      USER_COLLECTION: '/aweme/v1/web/aweme/listcollection/',
      /** 用户收藏夹 */
      USER_COLLECTS: '/aweme/v1/web/collects/list/',
      /** 用户收藏夹作品 */
      USER_COLLECTS_VIDEO: '/aweme/v1/web/collects/video/list/',
      /** 用户音乐收藏 */
      USER_MUSIC_COLLECTION: '/aweme/v1/web/music/listcollection/',
      /** 首页朋友作品 */
      FRIEND_FEED: '/aweme/v1/web/familiar/feed/',
      /** 关注用户作品 */
      FOLLOW_FEED: '/aweme/v1/web/follow/feed/',
      /** 相关推荐 */
      POST_RELATED: '/aweme/v1/web/aweme/related/',
      /** 关注用户列表直播 */
      FOLLOW_USER_LIVE: '/webcast/web/feed/follow/',
      /** 直播信息接口 */
      LIVE_INFO: '/webcast/room/web/enter/',
      /** 直播信息接口2 */
      LIVE_INFO_ROOM_ID: '/webcast/room/reflow/info/',
      /** 直播间送礼用户排行榜 */
      LIVE_GIFT_RANK: '/webcast/ranklist/audience/',
      /** 直播用户信息 */
      LIVE_USER_INFO: '/webcast/user/me/',
      /** 推荐搜索词 */
      SUGGEST_WORDS: '/aweme/v1/web/api/suggest_words/',
      /** 作品评论 */
      POST_COMMENT: '/aweme/v1/web/comment/list/',
      /** 评论回复 */
      POST_COMMENT_REPLY: '/aweme/v1/web/comment/list/reply/',
      /** 回复评论 */
      POST_COMMENT_PUBLISH: '/aweme/v1/web/comment/publish',
      /** 删除评论 */
      POST_COMMENT_DELETE: '/aweme/v1/web/comment/delete/',
      /** 点赞评论 */
      POST_COMMENT_DIGG: '/aweme/v1/web/comment/digg',
      /** 抖音热榜数据 */
      DOUYIN_HOT_SEARCH: '/aweme/v1/web/hot/search/list/',
      /** 抖音视频频道 */
      DOUYIN_VIDEO_CHANNEL: '/aweme/v1/web/channel/feed/'
    }
  }

  /** 抖音短域名 (Short Domain) */
  static readonly IESDOUYIN_DOMAIN = {
    /** 抖音短域名的基础URL */
    BASE_URL: 'https://www.iesdouyin.com',
    ROUTERS: {}
  }

  /** 直播域名 (Live Domain) */
  static readonly LIVE_DOMAIN = {
    /** 直播域名的基础URL */
    BASE_URL: 'https://live.douyin.com',
    ROUTERS: {}
  }

  /** 直播域名2 (Live Domain 2) */
  static readonly LIVE_DOMAIN2 = {
    /** 直播域名2的基础URL */
    BASE_URL: 'https://webcast.amemv.com',
    ROUTERS: {}
  }

  /** SSO域名 (SSO Domain) */
  static readonly SSO_DOMAIN = {
    /** SSO域名的基础URL */
    BASE_URL: 'https://sso.douyin.com',
    ROUTERS: {
      /** SSO登录获取二维码 */
      SSO_LOGIN_GET_QR: '/get_qrcode/',
      /** 登录检查 */
      SSO_LOGIN_CHECK_QR: '/check_qrconnect/',
      /** 登录确认 */
      SSO_LOGIN_CHECK_LOGIN: '/check_login/',
      /** 登录重定向 */
      SSO_LOGIN_REDIRECT: '/login/',
      /** 登录回调 */
      SSO_LOGIN_CALLBACK: '/passport/sso/login/callback/'
    }
  }

  /** WSS域名 (WSS Domain) */
  static readonly WEBCAST_WSS_DOMAIN = {
    /** WSS域名的基础URL */
    BASE_URL: 'wss://webcast5-ws-web-lf.douyin.com',
    ROUTERS: {}
  }
}

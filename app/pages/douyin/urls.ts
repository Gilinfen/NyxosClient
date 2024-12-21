export class DouyinAPIEndpoints {
  /** 抖音域名 (Douyin Domain) */
  static readonly DOUYIN_DOMAIN = {
    /** 抖音的基础URL */
    BASE_URL: 'https://www.douyin.com',
    get ROUTERS() {
      const baseUrl = this.BASE_URL // 访问 BASE_URL
      return {
        /** 首页Feed */
        TAB_FEED: `${baseUrl}/aweme/v1/web/tab/feed/`,
        /** 用户短信息 */
        USER_SHORT_INFO: `${baseUrl}/aweme/v1/web/im/user/info/`,
        /** 用户详细信息 */
        USER_DETAIL: `${baseUrl}/aweme/v1/web/user/profile/other/`,
        /** 作品基本 */
        BASE_AWEME: `${baseUrl}/aweme/v1/web/aweme/`,
        /** 用户作品 */
        USER_POST: `${baseUrl}/aweme/v1/web/aweme/post/`,
        /** 定位作品 */
        LOCATE_POST: `${baseUrl}/aweme/v1/web/locate/post/`,
        /** 综合搜索 */
        GENERAL_SEARCH: `${baseUrl}/aweme/v1/web/general/search/single/`,
        /** 视频搜索 */
        VIDEO_SEARCH: `${baseUrl}/aweme/v1/web/search/item/`,
        /** 用户搜索 */
        USER_SEARCH: `${baseUrl}/aweme/v1/web/discover/search/`,
        /** 直播间搜索 */
        LIVE_SEARCH: `${baseUrl}/aweme/v1/web/live/search/`,
        /** 作品信息 */
        POST_DETAIL: `${baseUrl}/aweme/v1/web/aweme/detail/`,
        /** 单个作品视频弹幕数据 */
        POST_DANMAKU: `${baseUrl}/aweme/v1/web/danmaku/get_v2/`,
        /** 用户喜欢A */
        USER_FAVORITE_A: `${baseUrl}/aweme/v1/web/aweme/favorite/`,
        /** 用户喜欢B */
        USER_FAVORITE_B: `${baseUrl}/web/api/v2/aweme/like/`,
        /** 关注用户 */
        USER_FOLLOWING: `${baseUrl}/aweme/v1/web/user/following/list/`,
        /** 粉丝用户 */
        USER_FOLLOWER: `${baseUrl}/aweme/v1/web/user/follower/list/`,
        /** 合集作品 */
        MIX_AWEME: `${baseUrl}/aweme/v1/web/mix/aweme/`,
        /** 用户历史 */
        USER_HISTORY: `${baseUrl}/aweme/v1/web/history/read/`,
        /** 用户收藏 */
        USER_COLLECTION: `${baseUrl}/aweme/v1/web/aweme/listcollection/`,
        /** 用户收藏夹 */
        USER_COLLECTS: `${baseUrl}/aweme/v1/web/collects/list/`,
        /** 用户收藏夹作品 */
        USER_COLLECTS_VIDEO: `${baseUrl}/aweme/v1/web/collects/video/list/`,
        /** 用户音乐收藏 */
        USER_MUSIC_COLLECTION: `${baseUrl}/aweme/v1/web/music/listcollection/`,
        /** 首页朋友作品 */
        FRIEND_FEED: `${baseUrl}/aweme/v1/web/familiar/feed/`,
        /** 关注用户作品 */
        FOLLOW_FEED: `${baseUrl}/aweme/v1/web/follow/feed/`,
        /** 相关推荐 */
        POST_RELATED: `${baseUrl}/aweme/v1/web/aweme/related/`,
        /** 关注用户列表直播 */
        FOLLOW_USER_LIVE: `${baseUrl}/webcast/web/feed/follow/`,
        /** 直播信息接口 */
        LIVE_INFO: `${baseUrl}/webcast/room/web/enter/`,
        /** 直播信息接口2 */
        LIVE_INFO_ROOM_ID: `${baseUrl}/webcast/room/reflow/info/`,
        /** 直播间送礼用户排行榜 */
        LIVE_GIFT_RANK: `${baseUrl}/webcast/ranklist/audience/`,
        /** 直播用户信息 */
        LIVE_USER_INFO: `${baseUrl}/webcast/user/me/`,
        /** 推荐搜索词 */
        SUGGEST_WORDS: `${baseUrl}/aweme/v1/web/api/suggest_words/`,
        /** 作品评论 */
        POST_COMMENT: `${baseUrl}/aweme/v1/web/comment/list/`,
        /** 评论回复 */
        POST_COMMENT_REPLY: `${baseUrl}/aweme/v1/web/comment/list/reply/`,
        /** 回复评论 */
        POST_COMMENT_PUBLISH: `${baseUrl}/aweme/v1/web/comment/publish`,
        /** 删除评论 */
        POST_COMMENT_DELETE: `${baseUrl}/aweme/v1/web/comment/delete/`,
        /** 点赞评论 */
        POST_COMMENT_DIGG: `${baseUrl}/aweme/v1/web/comment/digg`,
        /** 抖音热榜数据 */
        DOUYIN_HOT_SEARCH: `${baseUrl}/aweme/v1/web/hot/search/list/`,
        /** 抖音视频频道 */
        DOUYIN_VIDEO_CHANNEL: `${baseUrl}/aweme/v1/web/channel/feed/`
      }
    }
  }

  /** 抖音短域名 (Short Domain) */
  static readonly IESDOUYIN_DOMAIN = {
    /** 抖音短域名的基础URL */
    BASE_URL: 'https://www.iesdouyin.com',
    get ROUTERS() {
      return {}
    }
  }

  /** 直播域名 (Live Domain) */
  static readonly LIVE_DOMAIN = {
    /** 直播域名的基础URL */
    BASE_URL: 'https://live.douyin.com',
    get ROUTERS() {
      const baseUrl = this.BASE_URL // 访问 BASE_URL
      return {
        /** 获取礼物信息列表 */
        WEBCAST_GIFT__LIST: `${baseUrl}/webcast/gift/list/`
      }
    }
  }

  /** 直播域名2 (Live Domain 2) */
  static readonly LIVE_DOMAIN2 = {
    /** 直播域名2的基础URL */
    BASE_URL: 'https://webcast.amemv.com',
    get ROUTERS() {
      return {}
    }
  }

  /** SSO域名 (SSO Domain) */
  static readonly SSO_DOMAIN = {
    /** SSO域名的基础URL */
    BASE_URL: 'https://sso.douyin.com',
    get ROUTERS() {
      const baseUrl = this.BASE_URL // 访问 BASE_URL

      return {
        /** SSO登录获取二维码 */
        SSO_LOGIN_GET_QR: `${baseUrl}/get_qrcode/`,
        /** 检查二维码登录状态 */
        SSO_LOGIN_CHECK_QR: `${baseUrl}/check_qrconnect/`,
        /** 确认登录状态 */
        SSO_LOGIN_CHECK_LOGIN: `${baseUrl}/check_login/`,
        /** 重定向到登录页面 */
        SSO_LOGIN_REDIRECT: `${baseUrl}/login/`,
        /** 登录成功后的回调 */
        SSO_LOGIN_CALLBACK: `${baseUrl}/passport/sso/login/callback/`
      }
    }
  }

  /** WSS域名 (WSS Domain) */
  static readonly WEBCAST_WSS_DOMAIN = {
    /** WSS域名的基础URL */
    BASE_URL: 'wss://webcast5-ws-web-lf.douyin.com',
    get ROUTERS() {
      return {}
    }
  }
}

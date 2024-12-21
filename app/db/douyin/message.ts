export interface DouyinMessageType {
  /** 反对分数消息 */
  DouyinWebcastMatchAgainstScoreMessage: {
    label: '反对分数消息'
    dev_status: false
  }
  /** 点赞消息 */
  DouyinWebcastLikeMessage: {
    label: '点赞消息'
    dev_status: false
  }
  /** 成员进入直播间消息 */
  DouyinWebcastMemberMessage: {
    label: '成员进入直播间消息'
    dev_status: false
    payload?: {
      task_id: string
      message_id: string
      member_count: number
      user_id: string
      user_name: string
    }
  }
  /** 礼物消息 */
  DouyinWebcastGiftMessage: {
    label: '礼物消息'
    dev_status: false
    payload?: {
      /** 任务ID */
      task_id: string
      /** 消息ID */
      message_id: string
      /** 动作类型 */
      action_type: string
      /** 粉丝票数量 */
      fan_ticket_count: number
      /** 群组数量 */
      group_count: number
      /** 重复数量 */
      repeat_count: number
      /** 连击数量 */
      combo_count: number
      /** 用户ID */
      user_id: string
      /** 用户名 */
      user_name: string
      /** 发送时间 */
      send_time: number
      gift: {
        name: string
        id: number
      }
      /** 优先级 */
      priority?: {
        /** 队列大小列表 */
        queue_sizes_list: number[]
        /** 自己的队列优先级 */
        self_queue_priority: number
        /** 优先级 */
        priority: number
      }
      /** 礼物图片 */
      image?: {
        /** 图片列表 */
        url_list_list: string[]
        /** 图片URI */
        uri: string
        /** 图片高度 */
        height: number
        /** 图片宽度 */
        width: number
        /** 平均颜色 */
        avg_color: string
        /** 图片类型 */
        image_type: number
        /** 打开网页的URL */
        open_web_url: string
        /** 图片内容 */
        content?: {
          /** 名称 */
          name: string
          /** 字体颜色 */
          font_color: string
          /** 等级 */
          level: number
          /** 替代文本 */
          alternative_text: string
        }
        /** 是否为动画 */
        is_animated: boolean
        /** 弹性设置列表 */
        flex_setting_list?: {
          /** 设置列表 */
          setting_list_list: string[]
        }
        /** 文本设置列表 */
        text_setting_list?: {
          /** 设置列表 */
          setting_list_list: string[]
        }
      }
    }
  }
  /** 聊天消息 */
  DouyinWebcastChatMessage: {
    label: '聊天消息'
    dev_status: true
    payload?: {
      task_id: string
      message_id: string
      user_id: string
      user_name: string
      message: string
    }
  }
  /** 联谊会消息 */
  DouyinWebcastSocialMessage: {
    label: '联谊会消息'
    dev_status: false
  }
  /** 房间用户发送消息 */
  DouyinWebcastRoomUserSeqMessage: {
    label: '房间用户发送消息'
    dev_status: false
  }
  /** 更新粉丝票消息 */
  DouyinWebcastUpdateFanTicketMessage: {
    label: '更新粉丝票消息'
    dev_status: false
  }
  /** 公共文本消息 */
  DouyinWebcastCommonTextMessage: {
    label: '公共文本消息'
    dev_status: false
  }
  /** 商品改变消息 */
  DouyinWebcastProductChangeMessage: {
    label: '商品改变消息'
    dev_status: false
  }
  /** 房间统计消息 */
  DouyinWebcastRoomStatsMessage: {
    label: '房间统计消息'
    dev_status: false
  }
  /** 礼物投票消息 */
  DouyinWebcastGiftVoteMessage: {
    label: '礼物投票消息'
    dev_status: false
  }
  /** 排行榜小时入口消息 */
  DouyinWebcastRanklistHourEntranceMessage: {
    label: '排行榜小时入口消息'
    dev_status: false
  }
  /** 房间内横幅消息 */
  DouyinWebcastInRoomBannerMessage: {
    label: '房间内横幅消息'
    dev_status: false
  }
  /** 房间流适应消息 */
  DouyinWebcastRoomStreamAdaptationMessage: {
    label: '房间流适应消息'
    dev_status: false
  }
  // 其他字段可以根据需要添加
}

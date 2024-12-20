import type { DouyinMessageType } from '~/db/douyin/message'

export class DouyinMessage implements DouyinMessageType {
  DouyinWebcastChatMessage = { label: '聊天消息', dev_status: true } as const
  DouyinWebcastMatchAgainstScoreMessage = {
    label: '反对分数消息',
    dev_status: false
  } as const
  DouyinWebcastLikeMessage = { label: '点赞消息', dev_status: false } as const
  DouyinWebcastMemberMessage = {
    label: '成员进入直播间消息',
    dev_status: false
  } as const
  DouyinWebcastGiftMessage = { label: '礼物消息', dev_status: false } as const
  DouyinWebcastSocialMessage = {
    label: '联谊会消息',
    dev_status: false
  } as const
  DouyinWebcastRoomUserSeqMessage = {
    label: '房间用户发送消息',
    dev_status: false
  } as const
  DouyinWebcastUpdateFanTicketMessage = {
    label: '更新粉丝票消息',
    dev_status: false
  } as const
  DouyinWebcastCommonTextMessage = {
    label: '公共文本消息',
    dev_status: false
  } as const
  DouyinWebcastProductChangeMessage = {
    label: '商品改变消息',
    dev_status: false
  } as const
  DouyinWebcastRoomStatsMessage = {
    label: '房间统计消息',
    dev_status: false
  } as const
  DouyinWebcastGiftVoteMessage = {
    label: '礼物投票消息',
    dev_status: false
  } as const
  DouyinWebcastRanklistHourEntranceMessage = {
    label: '排行榜小时入口消息',
    dev_status: false
  } as const
  DouyinWebcastInRoomBannerMessage = {
    label: '房间内横幅消息',
    dev_status: false
  } as const
  DouyinWebcastRoomStreamAdaptationMessage = {
    label: '房间流适应消息',
    dev_status: false
  } as const
}

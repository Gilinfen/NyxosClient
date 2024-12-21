use tauri::AppHandle;

use crate::{douyin::live::message, proto::douyin_protos};

// 每一条直播间消息解析
pub async fn process_messages(
    app: &AppHandle,
    messages: &Vec<douyin_protos::Message>,
    live_room_id: &str,
    task_id: &str,
) {
    let contents: Vec<String> = messages.iter().map(|m| m.method.clone()).collect();
    println!("contents :{:?}", contents);

    for msg in messages {
        match msg.method.as_str() {
            // 反对分数消息
            "WebcastMatchAgainstScoreMessage" => {
                message::un_pack_match_against_score_message(&app, &task_id, &msg.payload)
            }
            // 点赞数
            "WebcastLikeMessage" => {
                message::un_pack_webcast_like_message(&app, &task_id, &msg.payload)
            }
            // 成员进入直播间消息
            "WebcastMemberMessage" => {
                message::un_pack_webcast_member_message(&app, &task_id, &msg.payload)
            }
            // 礼物消息
            "WebcastGiftMessage" => {
                message::un_pack_webcast_gift_message(&app, &task_id, &msg.payload)
            }
            // 聊天消息
            "WebcastChatMessage" => {
                message::un_pack_webcast_chat_message(&app, &task_id, &msg.payload)
            }
            // 联谊会消息
            "WebcastSocialMessage" => {
                message::un_pack_webcast_social_message(&app, &task_id, &msg.payload)
            }
            // 房间用户发送消息
            "WebcastRoomUserSeqMessage" => {
                message::un_pack_webcast_room_user_seq_message(&app, &task_id, &msg.payload)
            }
            // 更新粉丝票
            "WebcastUpdateFanTicketMessage" => {
                message::un_pack_webcast_update_fan_ticket_message(&app, &task_id, &msg.payload)
            }
            // 公共文本消息
            "WebcastCommonTextMessage" => {
                message::un_pack_webcast_common_text_message(&app, &task_id, &msg.payload)
            }
            // 商品改变消息
            "WebcastProductChangeMessage" => {
                message::un_pack_webcast_product_change_message(&app, &task_id, &msg.payload)
            }
            // "WebcastRoomStatsMessage"
            // "WebcastGiftVoteMessage"
            // "WebcastRanklistHourEntranceMessage"
            // "WebcastInRoomBannerMessage"
            // "WebcastRoomStreamAdaptationMessage"
            _ => println!(
                "[onMessage] 待解析方法 {} 等待解析～ 房间Id：{}",
                msg.method, live_room_id
            ),
        }
    }
}

use prost::Message;
use tauri::{AppHandle, Emitter};

use crate::proto::douyin_protos;

// 聊天消息
pub fn un_pack_webcast_chat_message(app: &AppHandle, payload: &[u8]) {
    let chat = douyin_protos::ChatMessage::decode(payload);
    // println!("chat :{:?}", chat);
    if let Ok(chat_message) = chat {
        let msg_id = chat_message.common.as_ref().map(|c| c.msg_id).unwrap_or(0);
        let content = chat_message.content.clone();
        let sec_uid = chat_message
            .user
            .as_ref()
            .map(|u| u.sec_uid.clone())
            .unwrap_or_default();
        let nick_name = chat_message
            .user
            .as_ref()
            .map(|u| u.nick_name.clone())
            .unwrap_or_default();

        let json_message = serde_json::json!({
            "message_id": msg_id,
            "message": content,
            "user_id": sec_uid,
            "user_name": nick_name,
        });

        // 发送到前端
        if let Err(e) = app.emit("DouyinWebcastChatMessage", json_message) {
            eprintln!("发送聊天消息到前端失败: {}", e);
        }
    } else {
        println!("解码聊天消息失败");
    }
    // 处理逻辑...
}

// 反对分数消息
pub fn un_pack_match_against_score_message(app: &AppHandle, payload: &[u8]) {
    let against_score = douyin_protos::MatchAgainstScoreMessage::decode(payload);
    // println!("against_score :{:?}", against_score);
    // 处理逻辑...
}

// 点赞数
pub fn un_pack_webcast_like_message(app: &AppHandle, payload: &[u8]) {
    let like: Result<douyin_protos::LikeMessage, prost::DecodeError> =
        douyin_protos::LikeMessage::decode(payload);
}

// 成员进入直播间消息
pub fn un_pack_webcast_member_message(app: &AppHandle, payload: &[u8]) {
    let member = douyin_protos::MemberMessage::decode(payload);
    // println!("member :{:?}", member);
    if let Ok(member_message) = member {
        let msg_id = member_message
            .common
            .as_ref()
            .map(|c| c.msg_id)
            .unwrap_or(0);
        let sec_uid = member_message
            .user
            .as_ref()
            .map(|u| u.sec_uid.clone())
            .unwrap_or_default();
        let nick_name = member_message
            .user
            .as_ref()
            .map(|u| u.nick_name.clone())
            .unwrap_or_default();
        let member_count = member_message.member_count.clone();
        let json_message = serde_json::json!({
            "message_id":msg_id,
            "member_count": member_count,
            "user_url": sec_uid,
            "user_name": nick_name,
        });

        // 发送到前端
        if let Err(e) = app.emit("DouyinWebcastMemberMessage", json_message) {
            eprintln!("成员进入消息到前端失败: {}", e);
        }
    } else {
        println!("解码成员进入消息失败");
    }
}

// 礼物消息
pub fn un_pack_webcast_gift_message(app: &AppHandle, payload: &[u8]) {
    let gift: Result<douyin_protos::GiftMessage, prost::DecodeError> =
        douyin_protos::GiftMessage::decode(payload);
}

// 联谊会消息
pub fn un_pack_webcast_social_message(app: &AppHandle, payload: &[u8]) {
    let social = douyin_protos::SocialMessage::decode(payload);
    // println!("social :{:?}", social);
    // 处理逻辑...
}
// 房间用户发送消息
pub fn un_pack_webcast_room_user_seq_message(app: &AppHandle, payload: &[u8]) {
    let room_user_seq = douyin_protos::RoomUserSeqMessage::decode(payload);
    // println!("room_user_seq :{:?}", room_user_seq);
    // 处理逻辑...
}
// 更新粉丝票
pub fn un_pack_webcast_update_fan_ticket_message(app: &AppHandle, payload: &[u8]) {
    let update_fan_ticket = douyin_protos::UpdateFanTicketMessage::decode(payload);
    // println!("update_fan_ticket :{:?}", update_fan_ticket);
    // 处理逻辑...
}
// 公共文本消息
pub fn un_pack_webcast_common_text_message(app: &AppHandle, payload: &[u8]) {
    let common_text = douyin_protos::CommonTextMessage::decode(payload);
    // println!("common_text :{:?}", common_text);
    // 处理逻辑...
}
// 这里是处理函数的示例
pub fn un_pack_webcast_product_change_message(app: &AppHandle, payload: &[u8]) {
    let product_change = douyin_protos::ProductChangeMessage::decode(payload);
    // println!("product_change :{:?}", product_change);
    // 处理逻辑...
}

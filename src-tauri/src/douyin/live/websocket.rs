use anyhow::Result;
use std::collections::HashMap;
use tauri::AppHandle;
use tokio_tungstenite::{
    tungstenite::protocol::Message, // 更新为正确的路径
};

// 引入 WebSocketManager
use crate::websocket_manager::WebSocketManager; // 使用相对路径引入模块

// use crate::douyin::live::on_messages::parse_on_message_response;

#[tauri::command]
pub async fn connect_to_websocket(
    app: AppHandle,
    url: &str,
    live_room_id: &str,               // 房间 id
    headers: HashMap<String, String>, // 将headers作为参数传入
) -> Result<(), String> {
    // 创建 WebSocket 管理器
    let manager = WebSocketManager::new();

    // 定义消息处理函数
    let message_handler = |message: Message| match message {
        Message::Text(text) => {
            println!("接收到文本消息: {}", text);
        }
        Message::Binary(binary) => {
            println!("接收到二进制消息: {:?}", binary);
        }
        Message::Ping(ping) => {
            println!("接收到 Ping: {:?}", ping);
        }
        Message::Pong(pong) => {
            println!("接收到 Pong: {:?}", pong);
        }
        Message::Close(close) => {
            println!("接收到 Close: {:?}", close);
        }
    };

    // 添加 WebSocket 连接
    let live_room_id = live_room_id.to_string();

    // 使用 manager 来添加 WebSocket 连接
    manager
        .add_connection(live_room_id.to_string(), url, headers, message_handler)
        .await
        .map_err(|e| e.to_string())?; // 转换错误为 String 类型并返回

    Ok(())
}

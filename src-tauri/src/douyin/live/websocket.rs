use anyhow::Result;
use std::collections::HashMap;
use std::future::Future;
use std::pin::Pin;
use tauri::{AppHandle, Manager};
use tokio_tungstenite::{
    tungstenite::protocol::Message, // 更新为正确的路径
};

use crate::{
    douyin::live::on_messages::parse_on_message_response, websocket_manager::WebSocketManager,
};

#[tauri::command]
pub async fn connect_to_websocket(
    app: AppHandle,
    url: &str,
    live_room_id: &str,               // 房间 id
    task_id: &str,                    // 任务 id
    headers: HashMap<String, String>, // 将 headers 作为参数传入
) -> Result<(), String> {
    let manager = app.state::<WebSocketManager>().clone();
    println!("开始连接到 WebSocket：{}", url);

    // 克隆 app 句柄以避免移动
    let app_handle = app.clone();
    let live_room_id = live_room_id.to_string(); // 克隆 live_room_id，传递给 WebSocket 管理器和回调

    // 定义异步消息处理函数，明确返回类型
    let message_handler: Box<
        dyn Fn(Message) -> Pin<Box<dyn Future<Output = ()> + Send>> + Send + 'static,
    > = Box::new(move |message: Message| {
        let app_handle = app_handle.clone(); // 在闭包中再次克隆 app_handle

        let live_room_id = live_room_id.clone(); // 在闭包中克隆 live_room_id

        Box::pin(async move {
            match message {
                Message::Text(_text) => {
                    // println!("接收到文本消息: {}", text);
                }
                Message::Binary(binary) => {
                    // println!("接收到二进制消息: {:?}", binary);
                    // 异步处理接收到的二进制消息
                    parse_on_message_response(&app_handle, &binary, &live_room_id).await;
                }
                Message::Ping(_ping) => {
                    // println!("接收到 Ping: {:?}", ping);
                }
                Message::Pong(_pong) => {
                    // println!("接收到 Pong: {:?}", pong);
                }
                Message::Close(_close) => {
                    // println!("接收到 Close: {:?}", close);
                }
            }
        })
    });

    // 使用 manager 来添加 WebSocket 连接
    manager
        .add_connection(task_id.to_string(), url, headers, message_handler) // 传递克隆的 task_id
        .await
        .map_err(|e| e.to_string())?; // 转换错误为 String 类型并返回

    Ok(())
}

#[tauri::command]
pub async fn close_to_websocket(
    app: AppHandle,
    task_id: &str, // 任务 id
) -> Result<(), String> {
    let manager = app.state::<WebSocketManager>().clone();

    manager
        .close_connection(task_id)
        .await
        .map_err(|e| e.to_string())?; // 转换错误为 String 类型并返回

    Ok(())
}

#[tauri::command]
pub async fn send_to_websocket(
    app: AppHandle,
    task_id: &str, // 任务 id
) -> Result<(), String> {
    let manager = app.state::<WebSocketManager>().clone();

    manager
        .send_message(task_id, "2222222")
        .await
        .map_err(|e| e.to_string())?; // 转换错误为 String 类型并返回

    Ok(())
}

use anyhow::Result;
use futures_util::{SinkExt, StreamExt};
use std::collections::HashMap;
use std::sync::Arc;
use tokio::net::TcpStream;
use tokio::sync::Mutex;
use tokio_tungstenite::MaybeTlsStream;
use tokio_tungstenite::{
    connect_async, tungstenite::http::Request, tungstenite::protocol::Message, WebSocketStream,
}; // 导入 anyhow crate 中的 Result 类型

pub struct WebSocketManager {
    connections:
        Arc<Mutex<HashMap<String, Arc<Mutex<WebSocketStream<MaybeTlsStream<TcpStream>>>>>>>,
}

impl WebSocketManager {
    // 创建一个新的 WebSocket 管理器
    pub fn new() -> Self {
        WebSocketManager {
            connections: Arc::new(Mutex::new(HashMap::new())),
        }
    }

    // 添加连接
    pub async fn add_connection<F>(
        &self,
        live_room_id: String,
        url: &str,
        headers: HashMap<String, String>,
        message_handler: F,
    ) -> Result<()>
    where
        F: Fn(Message) + Send + 'static, // 接收消息的回调函数
    {
        let connections = self.connections.clone();
        let url = url.to_string(); // 克隆 url，转换为 String

        // 构建请求并添加 headers
        let mut request_builder = Request::builder().uri(url);
        for (key, value) in headers {
            request_builder = request_builder.header(key, value);
        }

        let request = request_builder
            .body(())
            .map_err(|e| anyhow::anyhow!("Error building request: {}", e))?;

        // 创建新的任务来管理连接
        tokio::spawn(async move {
            match connect_async(request).await {
                Ok((stream, _response)) => {
                    let stream = Arc::new(Mutex::new(stream)); // 将流包装在 Arc 和 Mutex 中
                    {
                        let mut connections = connections.lock().await;
                        connections.insert(live_room_id.clone(), stream.clone());
                        // 将包装后的流存储在 connections 中
                    }

                    println!("WebSocket 连接成功: {}", live_room_id);

                    // 异步接收和处理消息
                    let stream = stream.clone(); // 再次克隆 Arc<Mutex<...>>，以便在 while 循环中使用
                    while let Some(message) = stream.lock().await.next().await {
                        match message {
                            Ok(msg) => {
                                println!("接收到消息: {:?}", msg);
                                // 调用外部的回调函数处理消息
                                message_handler(msg);
                            }
                            Err(e) => {
                                eprintln!("接收消息时出错: {}", e);
                                break;
                            }
                        }
                    }

                    // 移除连接
                    {
                        let mut connections = connections.lock().await;
                        connections.remove(&live_room_id);
                    }
                }
                Err(e) => {
                    eprintln!("WebSocket 连接失败: {}", e);
                }
            }
        });

        Ok(())
    }

    // 关闭指定的 WebSocket 连接
    pub async fn close_connection(&self, live_room_id: &str) -> Result<()> {
        let mut connections = self.connections.lock().await;
        if let Some(stream) = connections.remove(live_room_id) {
            if let Err(e) = stream.lock().await.close(None).await {
                eprintln!("关闭 WebSocket 连接失败: {}", e);
                return Err(anyhow::anyhow!("Failed to close connection: {}", e).into());
            }
            println!("WebSocket 连接已关闭: {}", live_room_id);
        } else {
            eprintln!("没有找到指定的 WebSocket 连接: {}", live_room_id);
            return Err(anyhow::anyhow!("Connection not found").into());
        }
        Ok(())
    }

    // 发送消息到指定的 WebSocket 连接
    pub async fn send_message(&self, live_room_id: &str, message: &str) -> Result<()> {
        let connections = self.connections.lock().await;
        if let Some(stream) = connections.get(live_room_id) {
            let mut stream = stream.lock().await;
            if let Err(e) = stream.send(Message::Text(message.to_string())).await {
                eprintln!("发送消息失败: {}", e);
                return Err(anyhow::anyhow!("Failed to send message: {}", e).into());
            }
            println!("消息发送成功: {}", message);
        } else {
            eprintln!("没有找到指定的 WebSocket 连接: {}", live_room_id);
            return Err(anyhow::anyhow!("Connection not found").into());
        }
        Ok(())
    }

    // 获取指定的 WebSocket 连接
    pub async fn get_connection(
        &self,
        live_room_id: &str,
    ) -> Result<Arc<Mutex<WebSocketStream<MaybeTlsStream<TcpStream>>>>> {
        let connections = self.connections.lock().await;
        if let Some(stream) = connections.get(live_room_id) {
            Ok(stream.clone())
        } else {
            Err(anyhow::anyhow!("Connection not found").into())
        }
    }
}

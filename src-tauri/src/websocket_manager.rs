use anyhow::Result;
use futures_util::{SinkExt, StreamExt};
use std::collections::HashMap;
use std::pin::Pin;
use std::sync::Arc;
use tokio::net::TcpStream;
use tokio::sync::Mutex;
use tokio_tungstenite::MaybeTlsStream;
use tokio_tungstenite::{
    connect_async, tungstenite::http::Request, tungstenite::protocol::Message, WebSocketStream,
};

pub struct WebSocketManager {
    // 使用 Mutex 来管理 WebSocket 连接
    connections:
        Arc<Mutex<HashMap<String, Arc<Mutex<WebSocketStream<MaybeTlsStream<TcpStream>>>>>>>,
}

impl WebSocketManager {
    pub fn new() -> Self {
        WebSocketManager {
            connections: Arc::new(Mutex::new(HashMap::new())),
        }
    }

    pub async fn add_connection<F>(
        &self,
        task_id: String,
        url: &str,
        headers: HashMap<String, String>,
        message_handler: F,
    ) -> Result<()>
    where
        F: Fn(Message) -> Pin<Box<dyn std::future::Future<Output = ()> + Send>> + Send + 'static,
    {
        let connections = self.connections.clone();
        let url = url.to_string();

        let mut request_builder = Request::builder().uri(url);
        for (key, value) in headers {
            request_builder = request_builder.header(key, value);
        }

        let request = request_builder
            .body(())
            .map_err(|e| anyhow::anyhow!("Error building request: {}", e))?;

        tokio::spawn(async move {
            match connect_async(request).await {
                Ok((stream, _response)) => {
                    let stream = Arc::new(Mutex::new(stream));
                    {
                        let mut connections = connections.lock().await;
                        connections.insert(task_id.clone(), stream.clone());
                    }

                    println!("WebSocket 连接成功: {}", task_id);

                    let stream = stream.clone();
                    // 获取锁并读取消息
                    while let Some(message) = stream.lock().await.next().await {
                        match message {
                            Ok(msg) => {
                                let handler = message_handler(msg);
                                handler.await;
                            }
                            Err(e) => {
                                eprintln!("接收消息时出错: {}", e);
                                break;
                            }
                        }
                    }

                    {
                        let mut connections = connections.lock().await;
                        connections.remove(&task_id);
                    }
                }
                Err(e) => {
                    eprintln!("WebSocket 连接失败: {}", e);
                }
            }
        });

        Ok(())
    }

    pub async fn close_connection(&self, task_id: &str) -> Result<()> {
        let mut connections = self.connections.lock().await;

        if let Some(stream) = connections.remove(task_id) {
            let mut stream = stream.lock().await; // 获取锁

            // 关闭 WebSocket 连接
            if let Err(e) = stream.close(None).await {
                eprintln!("关闭 WebSocket 连接失败: {}", e);
                return Err(anyhow::anyhow!("Failed to close connection: {}", e).into());
            }

            println!("WebSocket 连接已关闭: {}", task_id);
        } else {
            eprintln!("没有找到指定的 WebSocket 连接: {}", task_id);
            return Err(anyhow::anyhow!("Connection not found").into());
        }

        Ok(())
    }

    pub async fn send_message(&self, live_room_id: &str, message: &str) -> Result<()> {
        let mut connections = self.connections.lock().await;

        if let Some(stream) = connections.get(live_room_id) {
            let mut stream = stream.lock().await; // 获取锁

            // 发送 WebSocket 消息
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

    pub async fn get_connection(
        &self,
        task_id: &str,
    ) -> Result<Arc<Mutex<WebSocketStream<MaybeTlsStream<TcpStream>>>>> {
        let connections = self.connections.lock().await;

        if let Some(stream) = connections.get(task_id) {
            Ok(stream.clone())
        } else {
            eprintln!("未找到连接: {}", task_id);
            Err(anyhow::anyhow!("Connection not found").into())
        }
    }
}

use std::{
    collections::HashMap,
    sync::{Arc, Mutex},
};
use tauri::Manager;
use tokio::sync::mpsc::{UnboundedReceiver, UnboundedSender};
use tokio_tungstenite::tungstenite::Message;

#[derive(Debug)]
pub struct WebSocketConnection {
    // 用于发送消息给服务器的一端
    pub sender: UnboundedSender<Message>,
    // 用于在需要时取消或等待读协程结束
    pub join_handle: tokio::task::JoinHandle<()>,
}

#[derive(Default)]
pub struct WebSocketManager {
    // key: 自定义的连接 id
    // value: 对应的 WebSocketConnection
    connections: HashMap<String, WebSocketConnection>,
}

impl WebSocketManager {
    pub fn new() -> Self {
        Self {
            connections: HashMap::new(),
        }
    }

    pub fn insert(&mut self, id: String, connection: WebSocketConnection) {
        self.connections.insert(id, connection);
    }

    pub fn remove(&mut self, id: &str) {
        self.connections.remove(id);
    }

    pub fn get_sender(&self, id: &str) -> Option<UnboundedSender<Message>> {
        self.connections.get(id).map(|conn| conn.sender.clone())
    }

    pub fn has(&self, id: &str) -> bool {
        self.connections.contains_key(id)
    }

    pub fn list_ids(&self) -> Vec<String> {
        self.connections.keys().cloned().collect()
    }

    /// 移除指定连接，并返回被移除的 `WebSocketConnection`（如果存在）
    pub fn remove_connection(&mut self, id: &str) -> Option<WebSocketConnection> {
        self.connections.remove(id)
    }
}

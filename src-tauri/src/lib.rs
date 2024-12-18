use tauri::Manager;
// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use tauri_plugin_sql::{Migration, MigrationKind};

mod douyin;
mod https;
mod proto;
mod websocket_manager; // 引入模块

// 引入 WebSocketManager
use crate::websocket_manager::WebSocketManager; // 使用相对路径引入模块

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let migrations = vec![Migration {
        version: 1,
        description: "create users table",
        sql: "CREATE TABLE IF NOT EXISTS users (  
                id INTEGER PRIMARY KEY AUTOINCREMENT,  
                username TEXT NOT NULL,  
                password TEXT,
                status TEXT  
            )",
        kind: MigrationKind::Up,
    }];

    tauri::Builder::default()
        .setup(|app| {
            // 在启动时创建 WebSocket 管理器并注入到全局状态
            let manager = WebSocketManager::new();
            app.manage(manager);
            Ok(())
        })
        .plugin(tauri_plugin_sql::Builder::new().build())
        .plugin(
            tauri_plugin_sql::Builder::default()
                .add_migrations("sqlite:test.db", migrations)
                .build(),
        )
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            https::make_https_request,
            douyin::live::websocket::connect_to_websocket,
            douyin::live::websocket::close_to_websocket,
            douyin::live::websocket::send_to_websocket,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

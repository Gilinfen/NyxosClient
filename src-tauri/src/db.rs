use tauri_plugin_sql::{Migration, MigrationKind};

pub fn create_douyin_tables() -> Vec<Migration> {
    let migrations = vec![
        Migration {
            version: 1,
            description: "create tasks table",
            sql: "CREATE TABLE IF NOT EXISTS tasks (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    task_id TEXT NOT NULL,
                    task_name TEXT NOT NULL,
                    task_status TEXT,
                    app_type TEXT NOT NULL,
                    live_url TEXT NOT NULL,
                    message_type TEXT NOT NULL,
                    description TEXT,
                    keywords TEXT,
                    timestamp INTEGER NOT NULL,
                    UNIQUE (task_id) -- 确保 task_id 是唯一的
                )",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 2,
            description: "create tasks_danmu table",
            sql: "CREATE TABLE IF NOT EXISTS tasks_danmu (
                    user_id TEXT NOT NULL,
                    message_id TEXT NOT NULL,
                    user_name TEXT NOT NULL,
                    message TEXT NOT NULL,
                    user_url TEXT NOT NULL,
                    task_id TEXT NOT NULL, -- 关联到 tasks 表
                    PRIMARY KEY (message_id),
                    FOREIGN KEY (task_id) REFERENCES tasks(task_id) -- 外键关联到 tasks 表
                )",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 3,
            description: "create tasks_users table",
            sql: "CREATE TABLE IF NOT EXISTS tasks_users (
                    user_id TEXT NOT NULL,
                    user_name TEXT NOT NULL,
                    user_url TEXT NOT NULL,
                    task_id TEXT NOT NULL, -- 关联到 tasks 表
                    PRIMARY KEY (user_id),
                    FOREIGN KEY (task_id) REFERENCES tasks(task_id) -- 外键关联到 tasks 表
                )",
            kind: MigrationKind::Up,
        },
        // 可以在这里添加更多的表创建逻辑
    ];

    migrations // 返回 migrations
}

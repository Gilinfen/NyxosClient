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
                    user_id TEXT NOT NULL, -- 用户ID
                    message_id TEXT NOT NULL, -- 消息ID
                    user_name TEXT NOT NULL, -- 用户名称
                    message TEXT NOT NULL, -- 消息内容
                    user_url TEXT NOT NULL, -- 用户主页
                    timestamp INTEGER NOT NULL, -- 发送时间
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
                    user_id TEXT NOT NULL, -- 用户ID
                    user_name TEXT NOT NULL, -- 用户名称
                    user_url TEXT NOT NULL, -- 用户主页
                    timestamp INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
                    task_id TEXT NOT NULL, -- 关联到 tasks 表
                    PRIMARY KEY (user_id),
                    FOREIGN KEY (task_id) REFERENCES tasks(task_id) -- 外键关联到 tasks 表
                )",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 4,
            description: "create tasks_gift table",
            sql: "CREATE TABLE IF NOT EXISTS tasks_gift (
                    user_id TEXT NOT NULL, -- 用户ID
                    timestamp INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
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

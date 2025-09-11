-- Table for main server information
CREATE TABLE servers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    status TEXT,
    version TEXT,
    server_type TEXT, -- New column to indicate 'remote' or 'local' based on your custom logic
    meta_id TEXT UNIQUE, -- The UUID from the JSON, now in servers table
    published_at TEXT,
    updated_at TEXT,
    is_latest BOOLEAN
);

-- Table for repository details, linked to servers
CREATE TABLE repositories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    server_id INTEGER NOT NULL,
    url TEXT,
    source TEXT,
    subfolder TEXT,
    repo_id TEXT, -- Original 'id' field from repository object, renamed to avoid conflict
    FOREIGN KEY (server_id) REFERENCES servers(id)
);

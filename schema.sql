-- Table for main server information
CREATE TABLE servers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    status TEXT,
    version TEXT,
    server_type TEXT -- New column to indicate 'remote' or 'local' based on your custom logic
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

-- Table for official metadata, linked to servers
CREATE TABLE server_official_metadata (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    server_id INTEGER NOT NULL UNIQUE,
    meta_id TEXT NOT NULL UNIQUE, -- The UUID from the JSON
    published_at TEXT,
    updated_at TEXT,
    is_latest BOOLEAN,
    FOREIGN KEY (server_id) REFERENCES servers(id)
);

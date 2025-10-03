-- Table for main server information
CREATE TABLE servers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    developer TEXT NOT NULL,
    mcp_name TEXT NOT NULL,
    description TEXT,
    status TEXT,
    version TEXT,
    server_type TEXT, -- New column to indicate 'remote' or 'local' based on your custom logic
    meta_id TEXT UNIQUE, -- The UUID from the JSON, now in servers table
    published_at TEXT,
    updated_at TEXT,
    is_latest BOOLEAN,
    entry_name TEXT NOT NULL UNIQUE
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

-- View for total number of unique servers
CREATE VIEW TotalUniqueServers AS
SELECT COUNT(DISTINCT id) AS total_unique_servers
FROM servers;

-- View for number of local and remote servers
CREATE VIEW ServerTypeCounts AS
SELECT
    server_type,
    COUNT(id) AS count
FROM
    servers
GROUP BY
    server_type;

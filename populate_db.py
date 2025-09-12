import sqlite3
import httpx
import os

DATABASE_FILE = "official_mcp_registry.db"
SCHEMA_FILE = "schema.sql"


API_URL = "https://registry.modelcontextprotocol.io/v0/servers"


def create_tables(cursor):
    with open(SCHEMA_FILE, "r") as f:
        schema_sql = f.read()
    cursor.executescript(schema_sql)


def get_server_type(server_data):
    if server_data.get("remotes"):
        return "remote"
    elif server_data.get("packages"):
        return "local"
    return "unknown"


def populate_database():
    conn = None
    try:
        conn = sqlite3.connect(DATABASE_FILE)
        cursor = conn.cursor()

        # Create tables
        create_tables(cursor)

        # Fetch data from API with pagination
        next_cursor = None
        total_servers_processed = 0

        while True:
            params = {"limit": 100, "version": "latest"}
            if next_cursor:
                params["cursor"] = next_cursor

            response = httpx.get(API_URL, params=params)
            response.raise_for_status()  # Raise an exception for HTTP errors
            data = response.json()

            servers_data = data.get("servers", [])
            for server in servers_data:
                # Insert into servers table
                server_type = get_server_type(server)
                meta = server.get("_meta", {}).get("io.modelcontextprotocol.registry/official", {})

                full_name = server.get("name", "")
                if "/" in full_name:
                    developer, name = full_name.split("/", 1)
                else:
                    developer = ""
                    name = full_name

                cursor.execute(
                    "INSERT INTO servers (developer, name, description, status, version, server_type, meta_id, published_at, updated_at, is_latest) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                    (
                        developer,
                        name,
                        server.get("description"),
                        server.get("status"),
                        server.get("version"),
                        server_type,
                        meta.get("id"),
                        meta.get("published_at"),
                        meta.get("updated_at"),
                        meta.get("is_latest"),
                    ),
                )
                server_id = cursor.lastrowid

                # Insert into repositories table
                repository = server.get("repository")
                if repository:
                    cursor.execute(
                        "INSERT INTO repositories (server_id, url, source, subfolder, repo_id) VALUES (?, ?, ?, ?, ?)",
                        (
                            server_id,
                            repository.get("url"),
                            repository.get("source"),
                            repository.get("subfolder"),
                            repository.get("id"),
                        ),
                    )

            total_servers_processed += len(servers_data)
            next_cursor = data.get("metadata", {}).get("next_cursor")

            if not next_cursor:
                break

        conn.commit()
        print(
            f"Database '{DATABASE_FILE}' populated successfully with {total_servers_processed} servers."
        )

    except httpx.HTTPStatusError as e:
        print(f"HTTP error occurred: {e.response.status_code} - {e.response.text}")
        if conn:
            conn.rollback()
    except httpx.RequestError as e:
        print(f"An error occurred while requesting {e.request.url!r}: {e}")
        if conn:
            conn.rollback()
    except sqlite3.Error as e:
        print(f"SQLite error occurred: {e}")
        if conn:
            conn.rollback()
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        if conn:
            conn.rollback()
    finally:
        if conn:
            conn.close()


if __name__ == "__main__":
    # Remove existing database for a clean run
    if os.path.exists(DATABASE_FILE):
        os.remove(DATABASE_FILE)
        print(f"Removed existing database file: {DATABASE_FILE}")

    populate_database()

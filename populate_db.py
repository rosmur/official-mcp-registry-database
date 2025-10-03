import sqlite3
import httpx
import os
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

DATABASE_FILE = "official_mcp_registry.db"
SCHEMA_FILE = "schema.sql"


API_URL = "https://registry.modelcontextprotocol.io/v0/servers"


def create_tables(cursor):
    with open(SCHEMA_FILE, "r") as f:
        schema_sql = f.read()
    cursor.executescript(schema_sql)


def get_server_type(server_details):
    if server_details.get("remotes"):
        return "remote"
    elif server_details.get("packages"):
        return "local"
    return "unknown"


def populate_database():
    # Step 1: Initialize params

    params = {"limit": 100, "version": "latest"}

    # Setup for paginated API
    next_cursor = None
    total_servers_processed = 0

    # Step 2: Establish connnection to db
    conn = None

    try:
        logger.info(f"Connecting to database: {DATABASE_FILE}")
        conn = sqlite3.connect(DATABASE_FILE)
        cursor = conn.cursor()
        logger.info("Database connection established.")

        # Create tables
        logger.info("Creating tables from schema.")
        create_tables(cursor)
        logger.info("Tables created successfully.")

        while True:
            # Update API call params with cursor (from the 2nd loop)
            if next_cursor:
                params["cursor"] = next_cursor
                logger.info(f"Fetching next page with cursor: {next_cursor}")

            logger.info(f"Fetching data from API: {API_URL} with params: {params}")
            response = httpx.get(API_URL, params=params)
            response.raise_for_status()  # Raise an exception for HTTP errors
            data = response.json()
            logger.info("Successfully fetched data from API.")

            if not isinstance(data, dict):
                logger.error("Invalid JSON response from API: Expected a dictionary.")
                raise ValueError("Invalid JSON response from API")

            servers_data = data.get("servers", [])
            if not servers_data:
                logger.info("No server data found in current API response.")

            for server_entry in servers_data:
                server_details = server_entry.get("server", {})
                meta = server_entry.get("_meta", {}).get(
                    "io.modelcontextprotocol.registry/official", {}
                )
                full_name = server_details.get("name", "")
                logger.debug(f"Processing server: {full_name}")

                # Insert into servers table
                server_type = get_server_type(server_details)

                if "/" in full_name:
                    developer, subsring_name = full_name.split("/", 1)
                else:
                    developer = ""
                    subsring_name = full_name

                cursor.execute(
                    "INSERT INTO servers (developer, mcp_name, description, status, version, server_type, meta_id, published_at, updated_at, is_latest, entry_name) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                    (
                        developer,
                        subsring_name,
                        server_details.get("description"),
                        server_details.get("status"),
                        server_details.get("version"),
                        server_type,
                        meta.get("id"),
                        meta.get("publishedAt"),
                        meta.get("updatedAt"),
                        meta.get("isLatest"),
                        full_name,
                    ),
                )
                server_id = cursor.lastrowid
                logger.debug(f"Inserted server '{full_name}' with ID: {server_id}")

                # Insert into repositories table
                repository = server_details.get("repository")
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
                    logger.debug(f"Inserted repository for server '{full_name}'")

            total_servers_processed += len(servers_data)
            next_cursor = data.get("metadata", {}).get("nextCursor")

            if not next_cursor:
                logger.info("No more pages to fetch. Exiting pagination loop.")
                break
            else:
                logger.debug(f"Next cursor found: {next_cursor}")

        conn.commit()
        logger.info(
            f"Database '{DATABASE_FILE}' populated successfully with {total_servers_processed} servers."
        )

    except httpx.HTTPStatusError as e:
        logger.error(
            f"HTTP error occurred: {e.response.status_code} - {e.response.text}", exc_info=True
        )
        if conn:
            conn.rollback()
            logger.warning("Database transaction rolled back due to HTTP error.")
    except httpx.RequestError as e:
        logger.error(f"An error occurred while requesting {e.request.url!r}: {e}", exc_info=True)
        if conn:
            conn.rollback()
            logger.warning("Database transaction rolled back due to request error.")
    except sqlite3.Error as e:
        logger.error(f"SQLite error occurred: {e}", exc_info=True)
        if conn:
            conn.rollback()
            logger.warning("Database transaction rolled back due to SQLite error.")
    except Exception as e:
        logger.critical(f"An unexpected error occurred: {e}", exc_info=True)
        if conn:
            conn.rollback()
            logger.warning("Database transaction rolled back due to unexpected error.")
    finally:
        if conn:
            conn.close()
            logger.info("Database connection closed.")
    logger.info("Database population process finished.")


if __name__ == "__main__":
    logger.info("Script started.")
    # Remove existing database for a clean run
    if os.path.exists(DATABASE_FILE):
        os.remove(DATABASE_FILE)
        logger.info(f"Removed existing database file: {DATABASE_FILE}")
    else:
        logger.info(f"Database file '{DATABASE_FILE}' does not exist. No removal needed.")

    populate_database()
    logger.info("Script finished.")

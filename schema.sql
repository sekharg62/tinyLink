-- Create the links table for TinyLink
CREATE TABLE IF NOT EXISTS links (
    id SERIAL PRIMARY KEY,
    code VARCHAR(8) UNIQUE NOT NULL,
    url TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    clicks INTEGER DEFAULT 0,
    last_clicked_at TIMESTAMP
);

-- Create an index on code for faster lookups
CREATE INDEX IF NOT EXISTS idx_links_code ON links(code);

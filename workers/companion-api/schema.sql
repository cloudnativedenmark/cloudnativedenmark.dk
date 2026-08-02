-- D1 schema for the CND companion app backend.
-- Apply with: wrangler d1 execute cnd-companion --file=schema.sql

CREATE TABLE IF NOT EXISTS feedback (
  session_id TEXT NOT NULL,
  attendee_id TEXT NOT NULL,
  rating INTEGER NOT NULL,
  comment TEXT NOT NULL DEFAULT '',
  hidden INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT NOT NULL,
  PRIMARY KEY (session_id, attendee_id)
);

CREATE TABLE IF NOT EXISTS shout_messages (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS push_subscriptions (
  endpoint TEXT PRIMARY KEY,
  subscription_json TEXT NOT NULL,
  created_at TEXT NOT NULL
);

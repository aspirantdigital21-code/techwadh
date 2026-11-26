CREATE TABLE comments (
  id TEXT PRIMARY KEY,
  article TEXT NOT NULL,
  name TEXT NOT NULL,
  body TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  sender TEXT NOT NULL,
  created INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'approved', 'rejected', 'spam')),
  reply TEXT NOT NULL DEFAULT ''
);
CREATE INDEX comments_public ON comments(article, status, created);
CREATE INDEX comments_sender ON comments(sender, created);
CREATE INDEX comments_queue ON comments(status, created);

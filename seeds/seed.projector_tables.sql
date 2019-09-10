BEGIN;

TRUNCATE
  projector_users
  RESTART IDENTITY CASCADE;

INSERT INTO projector_users(username, email, password)
VALUES
('larsOlrick', 'lars@gmail.com', '$2y$04$8x5x50U1KOyoj8K3prCRn.XUvRvbsJxmp33Qpi1ouwQe9wbyppgOC'),
('smallcrustation', 'smallseas@yahoo.com', '$2y$04$8x5x50U1KOyoj8K3prCRn.XUvRvbsJxmp33Qpi1ouwQe9wbyppgOC'),
('krill', 'krilled@gmail.com', '$2y$04$8x5x50U1KOyoj8K3prCRn.XUvRvbsJxmp33Qpi1ouwQe9wbyppgOC');

COMMIT;
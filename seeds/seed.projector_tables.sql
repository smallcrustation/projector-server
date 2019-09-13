BEGIN;

TRUNCATE
  projector_users,
  projector_projects,
  projector_payments
  RESTART IDENTITY CASCADE;

INSERT INTO projector_users(username, email, password)
VALUES
('larsOlrick', 'lars@gmail.com', '$2b$10$wsUCq/GnY9NyZQNI.vQeGu3bMaZ.emofjsLRbXwj9SMJZLs6NhZwa'),
('smallcrustation', 'smallseas@yahoo.com', '$2b$10$wsUCq/GnY9NyZQNI.vQeGu3bMaZ.emofjsLRbXwj9SMJZLs6NhZwa'),
('krill', 'krilled@gmail.com', '$2b$10$wsUCq/GnY9NyZQNI.vQeGu3bMaZ.emofjsLRbXwj9SMJZLs6NhZwa');

INSERT INTO projector_projects(
  project_name,
  location,
  budget_original,
  budget_adjusted,
  amount_spent,
  user_id
)
VALUES
('2301 Castilla', 'Lauderdale Isles', 800.00, 200.00, 350.00, 3),
('2321 Las Olas', 'Lauderdale Isles', 430.00, 10.00, 0.00, 3),
('411 Native Dancer', 'Steeple Chase', 1000.00, 0.00, 500.00, 2),
('106 Halsey', 'Bridge Hampton', 300.00, 100.00, 200.00, 3);

INSERT INTO projector_payments(
  payment_number,
  total_amount,
  project_id,
  user_id
)
VALUES
(1, 100.00, 1, 3),
(2, 200.00, 1, 3),
(3, 300.00, 1, 3),
(1, 200.00, 2, 3),
(2, 300.00, 2, 3),
(1, 300.00, 3, 2),
(2, 400.00, 3, 2);


COMMIT;
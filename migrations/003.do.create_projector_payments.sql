CREATE TABLE projector_payments(
  id SERIAL PRIMARY KEY,
  payment_number INTEGER NOT NULL,
  total_amount DECIMAL(12,2),
  date_created TIMESTAMP NOT NULL DEFAULT now(),
  date_modified TIMESTAMP,
  project_id INTEGER
    REFERENCES projector_projects(id) ON DELETE CASCADE NOT NULL,
  user_id INTEGER
    REFERENCES projector_users(id) ON DELETE CASCADE NOT NULL
);
CREATE TABLE projector_projects(
  id SERIAL PRIMARY KEY,
  project_name TEXT NOT NULL,
  location TEXT NOT NULL,
  budget_original DECIMAL(12,2) NOT NULL,
  budget_adjusted DECIMAL(12,2),
  -- budget_total DECIMAL(12,2) NOT NULL,
  amount_spent DECIMAL(12,2),
  date_created TIMESTAMP NOT NULL DEFAULT now(),
  date_modified TIMESTAMP,
  user_id INTEGER 
    REFERENCES projector_users(id) ON DELETE CASCADE NOT NULL
);

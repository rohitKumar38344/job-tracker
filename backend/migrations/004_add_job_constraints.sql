ALTER TABLE jobs
ADD CONSTRAINT chk_job_closing_date
CHECK (
  closing_at is NULL
  OR closing_at >= discovered_date
);

ALTER TABLE jobs
ALTER COLUMN source
TYPE VARCHAR(50);
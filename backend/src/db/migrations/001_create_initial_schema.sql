-- =========================================================
-- USERS
-- =========================================================

CREATE TABLE IF NOT EXISTS users(
  user_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,

  created_at TIMESTAMPZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPZ NOT NULL DEFAULT NOW(),
)

-- =========================================================
-- COMPANIES
-- =========================================================

CREATE TABLE IF NOT EXISTS companies(
  company_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id INT NOT NULL,
  company_name VARCHAR(255) NOT NULL,
  industry VARCHAR(255)  ,
  location TEXT ,
  company_size INT CHECK (company_size > 0),
  notes TEXT,

  company_url TEXT,
  created_at TIMESTAMPZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPZ NOT NULL DEFAULT NOW(),

  CONSTRAINT fk_company_user
    FOREIGN KEY(user_id)
    REFERENCES users(user_id)
    ON DELETE CASCADE,

  CONSTRAINT uq_company_per_user
      UNIQUE (user_id, company_name)
)

-- =========================================================
-- JOBS
-- =========================================================

CREATE TABLE IF NOT EXISTS jobs(
  job_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  company_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT  ,
  location TEXT ,
  employment_type VARCHAR(20) NOT NULL
    CHECK( employment_type in (
            'FULL_TIME',
            'PART_TIME',
            'CONTRACT',
            'INTERNSHIP')),
  work_arrangement VARCHAR(20) CHECK(
    work_arrangement in (
        'REMOTE',
        'HYBRID',
        'ONSITE')),
  
  salary_min numeric(12, 2)
    CHECK (salary_min >= 0),
  salary_max numeric(12, 2)
    CHECK (salary_max >= 0),

  salary_currency CHAR(3),
  job_url TEXT,
  source VARCHAR(255),
  discovered_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  closing_at TIMESTAMPTZ,
  notes TEXT,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  CONSTRAINT fk_jb_company
      FOREIGN KEY (company_id)
      REFERENCES companies(company_id)
      ON DELETE CASCADE,
  
  CONSTRAINT chk_salary_range
   CHECK (
      salary_max IS NULL
      OR salary_min IS NULL
      OR salary_max >= salary_min
),
)

-- =========================================================
-- APPLICATIONS
-- =========================================================

CREATE TABLE IF NOT EXISTS applications (
  application_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  job_id INT NOT NULL UNIQUE,
  application_date DATE NOT NULL,
  current_status VARCHAR(20) NOT NULL
     CHECK (
      current_status in (
          'APPLIED'
          'SCREENING'
          'INTERVIEW'
          'OFFER'
          'REJECTED'
          'WITHDRAWN')),
  resume_name VARCHAR(120),
  cover_letter_used BOOLEAN NOT NULL DEFAULT FALSE
  referral source VARCHAR(120),
  notes TEXT,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_application_job
      FOREIGN KEY(job_id)
      REFERENCES jobs(job_id)
      ON DELETE CASCADE
)

-- =========================================================
-- APPLICATION HISTORY
-- =========================================================

CREATE TABLE IF NOT EXISTS application_history(
  application_history_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  application_id INT NOT NULL,
  status VARCHAR(30) NOT NULL CHECK (
    status IN (
        'APPLIED',
        'SCREENING',
        'INTERVIEW',
        'OFFER',
        'REJECTED',
        'WITHDRAWN'
    )
),
  changed_at TIMESTAMPTZ NOT NULL,
  CONSTRAINT fk_history_application
  FOREIGN KEY(application_id)
  REFERENCES applications(application_id)
  ON DELETE CASCADE
)

-- =========================================================
-- INTERVIEWS
-- =========================================================

CREATE TABLE IF NOT EXISTS interviews (
  interview_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  applicaton_id INT NOT NULL,
  interview_type VARCHAR(20) NOT NULL
   CHECK (
            interview_type IN (
                'PHONE_SCREEN',
                'TECHNICAL',
                'BEHAVIORAL',
                'SYSTEM_DESIGN',
                'HR',
                'FINAL'
            )
        ),
  scheduled_at TIMESTAMPTZ,
  duration_mintutes smallint
    CHECK (duration_mintutes > 0),
  meeting_link TEXT ,
  location TEXT,
  interviewer VARCHAR(200),
  notes text,
  result VARCHAR(50)
  CHECK (
    result IN (
      'PASSED'
      'FAILED'
      'PENDING'
      'CANCELLED'
      'NO_SHOW'
    )),

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_interview_application
  FOREIGN KEY(application_id)
  REFERENCES applications(application_id)
  ON DELETE CASCADE
)

CREATE INDEX IF NOT EXISTS idx_companies_user_id
    ON companies(user_id);

CREATE INDEX IF NOT EXISTS idx_jobs_company_id
    ON jobs(company_id);

CREATE INDEX IF NOT EXISTS idx_application_history_application_id
    ON application_history(application_id);

CREATE INDEX IF NOT EXISTS idx_interviews_application_id
    ON interviews(application_id);
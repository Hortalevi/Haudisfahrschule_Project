-- Core schema. gen_random_uuid() is built into PostgreSQL 13+, no extension needed.

CREATE TABLE app_user (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name          TEXT NOT NULL,
    email         TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    is_admin      BOOLEAN NOT NULL DEFAULT FALSE,
    is_instructor BOOLEAN NOT NULL DEFAULT FALSE,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT app_user_has_a_role CHECK (is_admin OR is_instructor)
);

CREATE TABLE course (
    slug             TEXT PRIMARY KEY,
    title            TEXT NOT NULL,
    tagline          TEXT NOT NULL,
    icon             TEXT NOT NULL,
    category         TEXT NOT NULL,
    audience         TEXT NOT NULL,
    price_from       INTEGER,
    price_unit       TEXT NOT NULL,
    price_note       TEXT,
    summary          TEXT NOT NULL,
    highlights       JSONB NOT NULL,
    languages        JSONB,
    duration         TEXT,
    cta_label        TEXT NOT NULL,
    sections         JSONB NOT NULL,
    cost_per_session NUMERIC(10, 2) NOT NULL DEFAULT 0,
    active           BOOLEAN NOT NULL DEFAULT TRUE,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE course_date (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_slug   TEXT NOT NULL REFERENCES course (slug) ON DELETE CASCADE,
    date_label    TEXT NOT NULL,
    time_slots    JSONB NOT NULL,
    starts_at     TIMESTAMPTZ NOT NULL,
    ends_at       TIMESTAMPTZ,
    location      TEXT NOT NULL,
    price         INTEGER NOT NULL,
    capacity      INTEGER NOT NULL DEFAULT 12,
    instructor_id UUID REFERENCES app_user (id) ON DELETE SET NULL,
    notes         TEXT,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_course_date_course_slug ON course_date (course_slug);
CREATE INDEX idx_course_date_starts_at ON course_date (starts_at);

CREATE TABLE registration (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_date_id UUID NOT NULL REFERENCES course_date (id) ON DELETE CASCADE,
    first_name     TEXT NOT NULL,
    last_name      TEXT NOT NULL,
    email          TEXT NOT NULL,
    phone          TEXT NOT NULL,
    language       TEXT NOT NULL,
    message        TEXT,
    status         TEXT NOT NULL DEFAULT 'CONFIRMED' CHECK (status IN ('CONFIRMED', 'CANCELLED')),
    created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_registration_course_date_id ON registration (course_date_id);

-- Singleton row (id fixed to 1) holding site-wide contact/settings info.
CREATE TABLE site_settings (
    id                  SMALLINT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
    name                TEXT NOT NULL,
    legal_name          TEXT NOT NULL,
    short_name          TEXT NOT NULL,
    url                 TEXT NOT NULL,
    description         TEXT NOT NULL,
    phone               TEXT NOT NULL,
    phone_display       TEXT NOT NULL,
    email               TEXT NOT NULL,
    address_street      TEXT NOT NULL,
    address_postal_code TEXT NOT NULL,
    address_city        TEXT NOT NULL,
    address_region      TEXT NOT NULL,
    address_country     TEXT NOT NULL,
    geo_latitude        DOUBLE PRECISION,
    geo_longitude       DOUBLE PRECISION,
    founders            JSONB NOT NULL DEFAULT '[]',
    opening_hours       JSONB NOT NULL DEFAULT '[]',
    socials             JSONB NOT NULL DEFAULT '[]',
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE faq_item (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question   TEXT NOT NULL,
    answer     TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX idx_faq_item_sort_order ON faq_item (sort_order);

CREATE TABLE testimonial (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name       TEXT NOT NULL,
    course     TEXT NOT NULL,
    rating     INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    quote      TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX idx_testimonial_sort_order ON testimonial (sort_order);

CREATE TABLE gallery_image (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    src        TEXT NOT NULL,
    alt        TEXT NOT NULL,
    category   TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX idx_gallery_image_sort_order ON gallery_image (sort_order);

CREATE TABLE regulation_section (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_type TEXT NOT NULL CHECK (vehicle_type IN ('AUTO', 'MOTORRAD')),
    question     TEXT NOT NULL,
    answer       JSONB NOT NULL,
    sort_order   INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX idx_regulation_section_sort_order ON regulation_section (vehicle_type, sort_order);

CREATE TABLE process_step (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    step        INTEGER NOT NULL,
    title       TEXT NOT NULL,
    description TEXT NOT NULL,
    sort_order  INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX idx_process_step_sort_order ON process_step (sort_order);

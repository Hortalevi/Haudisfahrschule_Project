-- Payment tracking and free-form staff notes per registration, plus the mock
-- data needed to demo both: instructors mark a sign-up as paid/pending and can
-- leave a note (e.g. "cash at first lesson"), independent of the student's own
-- optional message.

ALTER TABLE registration ADD COLUMN payment_status TEXT NOT NULL DEFAULT 'PENDING';
ALTER TABLE registration ADD COLUMN internal_notes TEXT;

UPDATE registration SET payment_status = 'PAID'
WHERE id IN (
    SELECT id FROM registration WHERE status = 'CONFIRMED' ORDER BY created_at LIMIT 20
);

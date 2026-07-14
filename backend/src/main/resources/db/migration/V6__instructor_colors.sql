-- Per-instructor identity color, for the color-coded calendar and the course/
-- instructor comparison charts. Assigned in the same fixed palette order as
-- InstructorColors.PALETTE (backend) so newly created users stay in sync with it.

ALTER TABLE app_user ADD COLUMN color TEXT;

WITH ordered AS (
    SELECT id, ROW_NUMBER() OVER (ORDER BY created_at) - 1 AS idx
    FROM app_user
)
UPDATE app_user
SET color = (ARRAY['#2a78d6','#1baf7a','#eda100','#008300','#4a3aa7','#e34948','#e87ba4','#eb6834'])[(ordered.idx % 8) + 1]
FROM ordered
WHERE app_user.id = ordered.id;

ALTER TABLE app_user ALTER COLUMN color SET NOT NULL;
ALTER TABLE app_user ALTER COLUMN color SET DEFAULT '#2a78d6';

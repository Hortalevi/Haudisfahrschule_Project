-- Mock test accounts so the site is usable immediately after setup.
-- CHANGE OR REMOVE THESE BEFORE GOING LIVE — see README "Handing off to the client".
--
--   admin@haudis.ch      / ChangeMe-Admin1!       (admin only)
--   instructor@haudis.ch / ChangeMe-Instructor1!  (instructor only)

INSERT INTO app_user (name, email, password_hash, is_admin, is_instructor) VALUES
    ('Admin (Test)', 'admin@haudis.ch', '$2b$12$n.IY.IChHDifV/Pyv5cateYRtI20dIw6u3x4BAoxl8TyJ.5B/Aa3u', TRUE, FALSE),
    ('Fahrlehrer (Test)', 'instructor@haudis.ch', '$2b$12$rMfAK5r6tuxmIQImB/VNzOdL2Hk2ERHIrG8QD.SITznMrSZla0h6m', FALSE, TRUE);

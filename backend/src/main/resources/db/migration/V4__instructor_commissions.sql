-- Instructor usernames, per-registration commission assignment, and a richer
-- mockup dataset (more instructors, course-date assignments, registrations)
-- so the admin/instructor CMS is fully demonstrable end to end.
--
-- Mock accounts below reuse the same test passwords as V2 (see that file's
-- comment) — CHANGE OR REMOVE BEFORE GOING LIVE:
--   bha / aha  -> admin@haudis.ch password      (ChangeMe-Admin1!)       - admin + instructor
--   lme/nfr/dke -> instructor@haudis.ch password (ChangeMe-Instructor1!) - instructor only

-- 1. Usernames --------------------------------------------------------------
-- Convention: first letter of the first name + first two letters of the last
-- name, lowercased (see UsernameGenerator). Existing accounts backfilled by hand
-- since SQL can't run the Java generator.
ALTER TABLE app_user ADD COLUMN username TEXT;

UPDATE app_user SET username = 'ate' WHERE email = 'admin@haudis.ch';
UPDATE app_user SET username = 'fte' WHERE email = 'instructor@haudis.ch';

ALTER TABLE app_user ALTER COLUMN username SET NOT NULL;
ALTER TABLE app_user ADD CONSTRAINT app_user_username_key UNIQUE (username);

-- 2. More mock driving instructors ------------------------------------------
INSERT INTO app_user (name, username, email, password_hash, is_admin, is_instructor) VALUES
    ('Bruno Haudenschild', 'bha', 'bruno@haudis.ch', '$2b$12$n.IY.IChHDifV/Pyv5cateYRtI20dIw6u3x4BAoxl8TyJ.5B/Aa3u', TRUE, TRUE),
    ('Ausilia Haudenschild', 'aha', 'ausilia@haudis.ch', '$2b$12$n.IY.IChHDifV/Pyv5cateYRtI20dIw6u3x4BAoxl8TyJ.5B/Aa3u', TRUE, TRUE),
    ('Livio Meier', 'lme', 'livio.meier@haudis.ch', '$2b$12$rMfAK5r6tuxmIQImB/VNzOdL2Hk2ERHIrG8QD.SITznMrSZla0h6m', FALSE, TRUE),
    ('Nadja Frei', 'nfr', 'nadja.frei@haudis.ch', '$2b$12$rMfAK5r6tuxmIQImB/VNzOdL2Hk2ERHIrG8QD.SITznMrSZla0h6m', FALSE, TRUE),
    ('Dario Keller', 'dke', 'dario.keller@haudis.ch', '$2b$12$rMfAK5r6tuxmIQImB/VNzOdL2Hk2ERHIrG8QD.SITznMrSZla0h6m', FALSE, TRUE);

-- 3. Assign existing course dates to instructors (who teaches each session) -
UPDATE course_date SET instructor_id = (SELECT id FROM app_user WHERE username = 'bha') WHERE id = 'a99539e0-b492-47e5-9f58-26b13398e16a';
UPDATE course_date SET instructor_id = (SELECT id FROM app_user WHERE username = 'aha') WHERE id = '81f34604-2961-46d2-853e-e5fe0f5845df';
UPDATE course_date SET instructor_id = (SELECT id FROM app_user WHERE username = 'lme') WHERE id = '08b6496a-715b-489c-b6df-5af66e7157f1';
UPDATE course_date SET instructor_id = (SELECT id FROM app_user WHERE username = 'nfr') WHERE id = 'c61558ea-fba5-4c8e-ae83-c126f768007a';
UPDATE course_date SET instructor_id = (SELECT id FROM app_user WHERE username = 'dke') WHERE id = 'e6a7386a-2147-4a73-a499-4249bf3f89ea';
UPDATE course_date SET instructor_id = (SELECT id FROM app_user WHERE username = 'bha') WHERE id = '73aaddff-9bf1-48c9-a59d-3e5599ceee1f';
UPDATE course_date SET instructor_id = (SELECT id FROM app_user WHERE username = 'aha') WHERE id = 'b70c20d9-a7cc-4118-976f-b2f42537ac7f';
UPDATE course_date SET instructor_id = (SELECT id FROM app_user WHERE username = 'lme') WHERE id = 'e9545366-ac78-4088-9f97-84f5ad33f6c5';
UPDATE course_date SET instructor_id = (SELECT id FROM app_user WHERE username = 'dke') WHERE id = '172062ad-586a-4f3b-94c2-01e2c30e71f7';
UPDATE course_date SET instructor_id = (SELECT id FROM app_user WHERE username = 'nfr') WHERE id = 'fb35e0a1-f6f4-45e3-9585-8e297c50d053';

-- 4. Per-registration commission credit --------------------------------------
-- Who gets commission credit for a sign-up - defaults to the teaching
-- instructor but an admin may reassign it (see RegistrationService.assignInstructor).
ALTER TABLE registration ADD COLUMN assigned_instructor_id UUID REFERENCES app_user (id) ON DELETE SET NULL;
CREATE INDEX idx_registration_assigned_instructor_id ON registration (assigned_instructor_id);

-- 5. Mock registrations ------------------------------------------------------
-- Mostly credited to the teaching instructor; a handful are credited to a
-- different instructor (mirrors an admin reallocating commission credit).
-- vku @ a99539e0 (cap 14) - bha
INSERT INTO registration (course_date_id, first_name, last_name, email, phone, language, status, assigned_instructor_id) VALUES
    ('a99539e0-b492-47e5-9f58-26b13398e16a', 'Lena', 'Frei', 'lena.frei@example.ch', '+41 79 100 10 01', 'Deutsch', 'CONFIRMED', (SELECT id FROM app_user WHERE username = 'bha')),
    ('a99539e0-b492-47e5-9f58-26b13398e16a', 'Noah', 'Meier', 'noah.meier@example.ch', '+41 79 100 10 02', 'Deutsch', 'CONFIRMED', (SELECT id FROM app_user WHERE username = 'bha')),
    ('a99539e0-b492-47e5-9f58-26b13398e16a', 'Selin', 'Yildiz', 'selin.yildiz@example.ch', '+41 79 100 10 03', 'Türkisch', 'CONFIRMED', (SELECT id FROM app_user WHERE username = 'bha')),
    ('a99539e0-b492-47e5-9f58-26b13398e16a', 'David', 'Suter', 'david.suter@example.ch', '+41 79 100 10 04', 'Deutsch', 'CONFIRMED', (SELECT id FROM app_user WHERE username = 'aha')),
    ('a99539e0-b492-47e5-9f58-26b13398e16a', 'Aylin', 'Kaya', 'aylin.kaya@example.ch', '+41 79 100 10 05', 'Türkisch', 'CONFIRMED', (SELECT id FROM app_user WHERE username = 'bha')),
    ('a99539e0-b492-47e5-9f58-26b13398e16a', 'Timo', 'Baumann', 'timo.baumann@example.ch', '+41 79 100 10 06', 'Deutsch', 'CONFIRMED', (SELECT id FROM app_user WHERE username = 'bha')),
    ('a99539e0-b492-47e5-9f58-26b13398e16a', 'Mia', 'Roth', 'mia.roth@example.ch', '+41 79 100 10 07', 'Französisch', 'CONFIRMED', (SELECT id FROM app_user WHERE username = 'aha')),
    ('a99539e0-b492-47e5-9f58-26b13398e16a', 'Elias', 'Huber', 'elias.huber@example.ch', '+41 79 100 10 08', 'Deutsch', 'CONFIRMED', (SELECT id FROM app_user WHERE username = 'bha')),
    ('a99539e0-b492-47e5-9f58-26b13398e16a', 'Jana', 'Widmer', 'jana.widmer@example.ch', '+41 79 100 10 09', 'Deutsch', 'CONFIRMED', (SELECT id FROM app_user WHERE username = 'bha')),
    ('a99539e0-b492-47e5-9f58-26b13398e16a', 'Luca', 'Rossi', 'luca.rossi@example.ch', '+41 79 100 10 10', 'Italienisch', 'CANCELLED', (SELECT id FROM app_user WHERE username = 'bha'));

-- vku @ 81f34604 (cap 14) - aha
INSERT INTO registration (course_date_id, first_name, last_name, email, phone, language, status, assigned_instructor_id) VALUES
    ('81f34604-2961-46d2-853e-e5fe0f5845df', 'Fabienne', 'Graf', 'fabienne.graf@example.ch', '+41 79 100 20 01', 'Deutsch', 'CONFIRMED', (SELECT id FROM app_user WHERE username = 'aha')),
    ('81f34604-2961-46d2-853e-e5fe0f5845df', 'Kevin', 'Zbinden', 'kevin.zbinden@example.ch', '+41 79 100 20 02', 'Deutsch', 'CONFIRMED', (SELECT id FROM app_user WHERE username = 'aha')),
    ('81f34604-2961-46d2-853e-e5fe0f5845df', 'Alessia', 'Conti', 'alessia.conti@example.ch', '+41 79 100 20 03', 'Italienisch', 'CONFIRMED', (SELECT id FROM app_user WHERE username = 'aha')),
    ('81f34604-2961-46d2-853e-e5fe0f5845df', 'Yannick', 'Moser', 'yannick.moser@example.ch', '+41 79 100 20 04', 'Deutsch', 'CONFIRMED', (SELECT id FROM app_user WHERE username = 'aha')),
    ('81f34604-2961-46d2-853e-e5fe0f5845df', 'Nina', 'Steiner', 'nina.steiner@example.ch', '+41 79 100 20 05', 'Deutsch', 'CONFIRMED', (SELECT id FROM app_user WHERE username = 'aha')),
    ('81f34604-2961-46d2-853e-e5fe0f5845df', 'Sara', 'Bianchi', 'sara.bianchi@example.ch', '+41 79 100 20 06', 'Italienisch', 'CONFIRMED', (SELECT id FROM app_user WHERE username = 'aha'));

-- vku @ 08b6496a (cap 3, full) - lme
INSERT INTO registration (course_date_id, first_name, last_name, email, phone, language, status, assigned_instructor_id) VALUES
    ('08b6496a-715b-489c-b6df-5af66e7157f1', 'Julian', 'Egger', 'julian.egger@example.ch', '+41 79 100 30 01', 'Deutsch', 'CONFIRMED', (SELECT id FROM app_user WHERE username = 'lme')),
    ('08b6496a-715b-489c-b6df-5af66e7157f1', 'Melanie', 'Wyss', 'melanie.wyss@example.ch', '+41 79 100 30 02', 'Deutsch', 'CONFIRMED', (SELECT id FROM app_user WHERE username = 'lme')),
    ('08b6496a-715b-489c-b6df-5af66e7157f1', 'Simon', 'Brunner', 'simon.brunner@example.ch', '+41 79 100 30 03', 'Englisch', 'CONFIRMED', (SELECT id FROM app_user WHERE username = 'lme'));

-- btu @ c61558ea (cap 14) - nfr
INSERT INTO registration (course_date_id, first_name, last_name, email, phone, language, status, assigned_instructor_id) VALUES
    ('c61558ea-fba5-4c8e-ae83-c126f768007a', 'Celine', 'Dubois', 'celine.dubois@example.ch', '+41 79 100 40 01', 'Französisch', 'CONFIRMED', (SELECT id FROM app_user WHERE username = 'nfr')),
    ('c61558ea-fba5-4c8e-ae83-c126f768007a', 'Patrick', 'Lehmann', 'patrick.lehmann@example.ch', '+41 79 100 40 02', 'Deutsch', 'CONFIRMED', (SELECT id FROM app_user WHERE username = 'nfr')),
    ('c61558ea-fba5-4c8e-ae83-c126f768007a', 'Vanessa', 'Keller', 'vanessa.keller@example.ch', '+41 79 100 40 03', 'Deutsch', 'CONFIRMED', (SELECT id FROM app_user WHERE username = 'nfr')),
    ('c61558ea-fba5-4c8e-ae83-c126f768007a', 'Robin', 'Hofer', 'robin.hofer@example.ch', '+41 79 100 40 04', 'Deutsch', 'CONFIRMED', (SELECT id FROM app_user WHERE username = 'dke')),
    ('c61558ea-fba5-4c8e-ae83-c126f768007a', 'Chiara', 'Ferrari', 'chiara.ferrari@example.ch', '+41 79 100 40 05', 'Italienisch', 'CONFIRMED', (SELECT id FROM app_user WHERE username = 'nfr')),
    ('c61558ea-fba5-4c8e-ae83-c126f768007a', 'Dominik', 'Ott', 'dominik.ott@example.ch', '+41 79 100 40 06', 'Deutsch', 'CONFIRMED', (SELECT id FROM app_user WHERE username = 'nfr')),
    ('c61558ea-fba5-4c8e-ae83-c126f768007a', 'Laura', 'Meyer', 'laura.meyer@example.ch', '+41 79 100 40 07', 'Deutsch', 'CONFIRMED', (SELECT id FROM app_user WHERE username = 'nfr')),
    ('c61558ea-fba5-4c8e-ae83-c126f768007a', 'Nico', 'Baumgartner', 'nico.baumgartner@example.ch', '+41 79 100 40 08', 'Deutsch', 'CONFIRMED', (SELECT id FROM app_user WHERE username = 'nfr')),
    ('c61558ea-fba5-4c8e-ae83-c126f768007a', 'Sophie', 'Aeschlimann', 'sophie.aeschlimann@example.ch', '+41 79 100 40 09', 'Deutsch', 'CANCELLED', (SELECT id FROM app_user WHERE username = 'nfr'));

-- btu @ e6a7386a (cap 14) - dke
INSERT INTO registration (course_date_id, first_name, last_name, email, phone, language, status, assigned_instructor_id) VALUES
    ('e6a7386a-2147-4a73-a499-4249bf3f89ea', 'Adrian', 'Weber', 'adrian.weber@example.ch', '+41 79 100 50 01', 'Deutsch', 'CONFIRMED', (SELECT id FROM app_user WHERE username = 'dke')),
    ('e6a7386a-2147-4a73-a499-4249bf3f89ea', 'Michelle', 'Gerber', 'michelle.gerber@example.ch', '+41 79 100 50 02', 'Deutsch', 'CONFIRMED', (SELECT id FROM app_user WHERE username = 'dke')),
    ('e6a7386a-2147-4a73-a499-4249bf3f89ea', 'Fabio', 'Marti', 'fabio.marti@example.ch', '+41 79 100 50 03', 'Italienisch', 'CONFIRMED', (SELECT id FROM app_user WHERE username = 'dke')),
    ('e6a7386a-2147-4a73-a499-4249bf3f89ea', 'Tanja', 'Wenger', 'tanja.wenger@example.ch', '+41 79 100 50 04', 'Deutsch', 'CONFIRMED', (SELECT id FROM app_user WHERE username = 'dke')),
    ('e6a7386a-2147-4a73-a499-4249bf3f89ea', 'Lukas', 'Schmid', 'lukas.schmid@example.ch', '+41 79 100 50 05', 'Deutsch', 'CONFIRMED', (SELECT id FROM app_user WHERE username = 'dke'));

-- nothelferkurs @ 73aaddff (cap 14) - bha
INSERT INTO registration (course_date_id, first_name, last_name, email, phone, language, status, assigned_instructor_id) VALUES
    ('73aaddff-9bf1-48c9-a59d-3e5599ceee1f', 'Rahel', 'Zurbruegg', 'rahel.zurbruegg@example.ch', '+41 79 100 60 01', 'Deutsch', 'CONFIRMED', (SELECT id FROM app_user WHERE username = 'bha')),
    ('73aaddff-9bf1-48c9-a59d-3e5599ceee1f', 'Enzo', 'Ferretti', 'enzo.ferretti@example.ch', '+41 79 100 60 02', 'Italienisch', 'CONFIRMED', (SELECT id FROM app_user WHERE username = 'bha')),
    ('73aaddff-9bf1-48c9-a59d-3e5599ceee1f', 'Priya', 'Nair', 'priya.nair@example.ch', '+41 79 100 60 03', 'Englisch', 'CONFIRMED', (SELECT id FROM app_user WHERE username = 'bha')),
    ('73aaddff-9bf1-48c9-a59d-3e5599ceee1f', 'Tobias', 'Kunz', 'tobias.kunz@example.ch', '+41 79 100 60 04', 'Deutsch', 'CONFIRMED', (SELECT id FROM app_user WHERE username = 'bha')),
    ('73aaddff-9bf1-48c9-a59d-3e5599ceee1f', 'Anouk', 'Buehler', 'anouk.buehler@example.ch', '+41 79 100 60 05', 'Deutsch', 'CONFIRMED', (SELECT id FROM app_user WHERE username = 'bha')),
    ('73aaddff-9bf1-48c9-a59d-3e5599ceee1f', 'Samuel', 'Rey', 'samuel.rey@example.ch', '+41 79 100 60 06', 'Französisch', 'CONFIRMED', (SELECT id FROM app_user WHERE username = 'aha')),
    ('73aaddff-9bf1-48c9-a59d-3e5599ceee1f', 'Jasmin', 'Iten', 'jasmin.iten@example.ch', '+41 79 100 60 07', 'Deutsch', 'CONFIRMED', (SELECT id FROM app_user WHERE username = 'bha')),
    ('73aaddff-9bf1-48c9-a59d-3e5599ceee1f', 'Christian', 'Vogel', 'christian.vogel@example.ch', '+41 79 100 60 08', 'Deutsch', 'CONFIRMED', (SELECT id FROM app_user WHERE username = 'bha')),
    ('73aaddff-9bf1-48c9-a59d-3e5599ceee1f', 'Nadine', 'Portmann', 'nadine.portmann@example.ch', '+41 79 100 60 09', 'Deutsch', 'CONFIRMED', (SELECT id FROM app_user WHERE username = 'bha')),
    ('73aaddff-9bf1-48c9-a59d-3e5599ceee1f', 'Diego', 'Ramos', 'diego.ramos@example.ch', '+41 79 100 60 10', 'Spanisch', 'CONFIRMED', (SELECT id FROM app_user WHERE username = 'bha'));

-- nothelferkurs @ b70c20d9 (cap 3, full) - aha
INSERT INTO registration (course_date_id, first_name, last_name, email, phone, language, status, assigned_instructor_id) VALUES
    ('b70c20d9-a7cc-4118-976f-b2f42537ac7f', 'Leila', 'Amir', 'leila.amir@example.ch', '+41 79 100 70 01', 'Deutsch', 'CONFIRMED', (SELECT id FROM app_user WHERE username = 'aha')),
    ('b70c20d9-a7cc-4118-976f-b2f42537ac7f', 'Matteo', 'Bianchi', 'matteo.bianchi@example.ch', '+41 79 100 70 02', 'Italienisch', 'CONFIRMED', (SELECT id FROM app_user WHERE username = 'aha')),
    ('b70c20d9-a7cc-4118-976f-b2f42537ac7f', 'Sina', 'Wuethrich', 'sina.wuethrich@example.ch', '+41 79 100 70 03', 'Deutsch', 'CONFIRMED', (SELECT id FROM app_user WHERE username = 'aha'));

-- motorradgrundkurs @ e9545366 (cap 3, full) - lme
INSERT INTO registration (course_date_id, first_name, last_name, email, phone, language, status, assigned_instructor_id) VALUES
    ('e9545366-ac78-4088-9f97-84f5ad33f6c5', 'Reto', 'Gassmann', 'reto.gassmann@example.ch', '+41 79 100 80 01', 'Deutsch', 'CONFIRMED', (SELECT id FROM app_user WHERE username = 'lme')),
    ('e9545366-ac78-4088-9f97-84f5ad33f6c5', 'Ivana', 'Petrovic', 'ivana.petrovic@example.ch', '+41 79 100 80 02', 'Deutsch', 'CONFIRMED', (SELECT id FROM app_user WHERE username = 'lme')),
    ('e9545366-ac78-4088-9f97-84f5ad33f6c5', 'Gabriel', 'Nyffeler', 'gabriel.nyffeler@example.ch', '+41 79 100 80 03', 'Deutsch', 'CONFIRMED', (SELECT id FROM app_user WHERE username = 'lme'));

-- motorradgrundkurs @ 172062ad (cap 14) - dke
INSERT INTO registration (course_date_id, first_name, last_name, email, phone, language, status, assigned_instructor_id) VALUES
    ('172062ad-586a-4f3b-94c2-01e2c30e71f7', 'Carla', 'Santos', 'carla.santos@example.ch', '+41 79 100 90 01', 'Spanisch', 'CONFIRMED', (SELECT id FROM app_user WHERE username = 'dke')),
    ('172062ad-586a-4f3b-94c2-01e2c30e71f7', 'Yves', 'Perret', 'yves.perret@example.ch', '+41 79 100 90 02', 'Französisch', 'CONFIRMED', (SELECT id FROM app_user WHERE username = 'dke')),
    ('172062ad-586a-4f3b-94c2-01e2c30e71f7', 'Melina', 'Hodel', 'melina.hodel@example.ch', '+41 79 100 90 03', 'Deutsch', 'CONFIRMED', (SELECT id FROM app_user WHERE username = 'dke')),
    ('172062ad-586a-4f3b-94c2-01e2c30e71f7', 'Jonas', 'Wirth', 'jonas.wirth@example.ch', '+41 79 100 90 04', 'Deutsch', 'CONFIRMED', (SELECT id FROM app_user WHERE username = 'dke')),
    ('172062ad-586a-4f3b-94c2-01e2c30e71f7', 'Alina', 'Frick', 'alina.frick@example.ch', '+41 79 100 90 05', 'Deutsch', 'CONFIRMED', (SELECT id FROM app_user WHERE username = 'dke')),
    ('172062ad-586a-4f3b-94c2-01e2c30e71f7', 'Remo', 'Bachmann', 'remo.bachmann@example.ch', '+41 79 100 90 06', 'Deutsch', 'CONFIRMED', (SELECT id FROM app_user WHERE username = 'nfr')),
    ('172062ad-586a-4f3b-94c2-01e2c30e71f7', 'Vera', 'Huggenberger', 'vera.huggenberger@example.ch', '+41 79 100 90 07', 'Deutsch', 'CONFIRMED', (SELECT id FROM app_user WHERE username = 'dke'));

-- boegle @ fb35e0a1 (cap 14, free walk-in) - nfr
INSERT INTO registration (course_date_id, first_name, last_name, email, phone, language, status, assigned_instructor_id) VALUES
    ('fb35e0a1-f6f4-45e3-9585-8e297c50d053', 'Denise', 'Kobel', 'denise.kobel@example.ch', '+41 79 101 00 01', 'Deutsch', 'CONFIRMED', (SELECT id FROM app_user WHERE username = 'nfr')),
    ('fb35e0a1-f6f4-45e3-9585-8e297c50d053', 'Marc', 'Iseli', 'marc.iseli@example.ch', '+41 79 101 00 02', 'Deutsch', 'CONFIRMED', (SELECT id FROM app_user WHERE username = 'nfr')),
    ('fb35e0a1-f6f4-45e3-9585-8e297c50d053', 'Wendy', 'Studer', 'wendy.studer@example.ch', '+41 79 101 00 03', 'Englisch', 'CONFIRMED', (SELECT id FROM app_user WHERE username = 'nfr')),
    ('fb35e0a1-f6f4-45e3-9585-8e297c50d053', 'Cyril', 'Antener', 'cyril.antener@example.ch', '+41 79 101 00 04', 'Französisch', 'CONFIRMED', (SELECT id FROM app_user WHERE username = 'nfr')),
    ('fb35e0a1-f6f4-45e3-9585-8e297c50d053', 'Petra', 'Zaugg', 'petra.zaugg@example.ch', '+41 79 101 00 05', 'Deutsch', 'CONFIRMED', (SELECT id FROM app_user WHERE username = 'nfr')),
    ('fb35e0a1-f6f4-45e3-9585-8e297c50d053', 'Fadil', 'Berisha', 'fadil.berisha@example.ch', '+41 79 101 00 06', 'Albanisch', 'CONFIRMED', (SELECT id FROM app_user WHERE username = 'nfr')),
    ('fb35e0a1-f6f4-45e3-9585-8e297c50d053', 'Giulia', 'Marchetti', 'giulia.marchetti@example.ch', '+41 79 101 00 07', 'Italienisch', 'CONFIRMED', (SELECT id FROM app_user WHERE username = 'nfr')),
    ('fb35e0a1-f6f4-45e3-9585-8e297c50d053', 'Hannes', 'Stucki', 'hannes.stucki@example.ch', '+41 79 101 00 08', 'Deutsch', 'CONFIRMED', (SELECT id FROM app_user WHERE username = 'nfr')),
    ('fb35e0a1-f6f4-45e3-9585-8e297c50d053', 'Amira', 'Haddad', 'amira.haddad@example.ch', '+41 79 101 00 09', 'Deutsch', 'CONFIRMED', (SELECT id FROM app_user WHERE username = 'nfr')),
    ('fb35e0a1-f6f4-45e3-9585-8e297c50d053', 'Kilian', 'Roos', 'kilian.roos@example.ch', '+41 79 101 00 10', 'Deutsch', 'CONFIRMED', (SELECT id FROM app_user WHERE username = 'nfr')),
    ('fb35e0a1-f6f4-45e3-9585-8e297c50d053', 'Ophelia', 'Wenk', 'ophelia.wenk@example.ch', '+41 79 101 00 11', 'Deutsch', 'CONFIRMED', (SELECT id FROM app_user WHERE username = 'nfr')),
    ('fb35e0a1-f6f4-45e3-9585-8e297c50d053', 'Bilal', 'Cetin', 'bilal.cetin@example.ch', '+41 79 101 00 12', 'Türkisch', 'CONFIRMED', (SELECT id FROM app_user WHERE username = 'nfr'));

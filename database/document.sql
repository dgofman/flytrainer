
--  Duplicate rows --
INSERT INTO flytrainer.document (version, reference, type, other, description, page_number, is_front_side, is_suspended, is_withdrawn, url, password, file, name, path, contenttype, size, issued_date, exp_date, parent_id, user_id, aircraft_id, created_date, modified_date) 
SELECT version, reference, type, other, description, page_number, is_front_side, is_suspended, is_withdrawn, url, password, file, name, path, contenttype, size, issued_date, exp_date, parent_id, user_id, aircraft_id, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP()
FROM flytrainer.document 
WHERE id = 1;
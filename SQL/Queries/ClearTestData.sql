DELETE FROM Questions WHERE id > 252;
ALTER TABLE Questions AUTO_INCREMENT = 253;

DELETE FROM Question_Keywords WHERE question_id > 252;
ALTER TABLE Question_Keywords AUTO_INCREMENT = 337;

DELETE FROM Question_Options WHERE question_id > 252;
ALTER TABLE Question_Options AUTO_INCREMENT = 1817;
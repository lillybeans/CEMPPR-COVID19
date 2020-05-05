DELETE FROM Questions WHERE id > 0;

ALTER TABLE Questions AUTO_INCREMENT = 1;

INSERT INTO Questions (question, survey_id, survey_item_number, sample_size, `group`, theme, created_at, created_by, updated_at, updated_by)
SELECT R.Question, S.id, Survey_Item, R.Sample_Size, `Group`, Theme, `Timestamp`, `Your_Initial`, `Timestamp`, `Your_Initial` from Responses as R
JOIN
(Select * from Surveys) as S
on R.Poll_Name = S.poll_name
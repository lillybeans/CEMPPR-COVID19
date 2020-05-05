Select * from question_options as qo
JOIN
(Select id as questionId, survey_id from questions) as q
ON qo.question_id = q.questionId
WHERE q.survey_id = 1
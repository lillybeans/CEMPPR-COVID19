Select * from question_keywords as qk
JOIN
(Select id as questionId, survey_id from questions) as q
ON qk.question_id = q.questionId
WHERE q.survey_id = 1
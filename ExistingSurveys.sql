SELECT * FROM Responses AS R1
JOIN
(SELECT MAX(Response_ID) as id FROM Responses Group By Poll_Name) AS R2
ON R1.Response_ID = R2.id
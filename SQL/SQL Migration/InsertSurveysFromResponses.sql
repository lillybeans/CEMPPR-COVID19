INSERT INTO Surveys (polling_group, poll_name, country, subnational, population, sample_size, sample_method, type_of_study, url, publication_date, start_date, end_date, created_at, created_by, updated_at, updated_by)
SELECT Polling_Group, Poll_Name, Country, Sub_National, Population, Sample_Size, Sample_Method, Type_of_Study, URL_of_Survey, Publication_Date, Start_Date, End_Date, `Timestamp`, Your_Initial, `Timestamp`, Your_Initial FROM Responses AS R1
JOIN
(SELECT MAX(Response_ID) as id FROM Responses Group By Poll_Name) AS R2
ON R1.Response_ID = R2.id
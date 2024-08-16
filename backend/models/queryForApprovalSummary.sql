/****** Script for SelectTopNRows command from SSMS  ******/
  SELECT TOP (1000) [AppID]
      ,[AppProcID]
      ,[UserID]
      ,[AppLevel]
  FROM [OTS_DB].[dbo].[AppProc_DetApp]


  SELECT * from [OTS_DB].[dbo].[AppProc_DetApp]

  SELECT * from [OTS_DB].[dbo].[AppProc_DetOrig]

  SELECT * from [OTS_DB].[dbo].[AppProc_Main]

  SELECT * from [OTS_DB].[dbo].[AppProc_Summary]

  SELECT AppTypeID from [OTS_DB].[dbo].[AppType]

  SELECT AppTypeID from [OTS_DB].[dbo].[AppType] where  AppType like '%Below Standard Discounting%'


  DELETE FROM [OTS_DB].[dbo].[AppProc_DetApp]
	WHERE AppProcID NOT IN (1038, 1039, 1040, 1041, 1042);

  SELECT m.*
	FROM [OTS_DB].[dbo].[AppProc_Main] m
	INNER JOIN [OTS_DB].[dbo].[AppType] t
    ON m.AppTypeID = t.AppTypeID
	WHERE t.AppType LIKE '%Below Standard Discounting%';

  
  SELECT AppTypeID from [OTS_DB].[dbo].[AppType] where  AppType like '%Below Standard Discounting%'

  SELECT m.AppProcID
	FROM [OTS_DB].[dbo].[AppProc_Main] m
	INNER JOIN [OTS_DB].[dbo].[AppType] t
		ON m.AppTypeID = t.AppTypeID
	WHERE t.AppTypeID = 1123123126;

  SELECT * from [OTS_DB].[dbo].[AppProc_DetOrig] Where AppProcID = 1038
  SELECT * from [OTS_DB].[dbo].[AppProc_DetApp] Where AppProcID = 1038

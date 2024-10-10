/****** Script for SelectTopNRows command from SSMS  ******/
SELECT * FROM [OTS_DB].[dbo].[AppProc_Summary]

SELECT * FROM [OTS_DB].[dbo].[AppProc_Main]

SELECT * FROM [OTS_DB].[dbo].[AppProc_DetApp]

SELECT APS.AppSummID, APS.Approver, AT.AppType, APS.ReqDate, APS.DraftNum, SH.DocDate, APS.DocType, SH.CustomerName, SH.TotalAmtDue, APS.Remarks, APS.Status
      FROM [OTS_DB].[dbo].[AppProc_Summary] APS
      INNER JOIN [OTS_DB].[dbo].[AppProc_Main] AM ON APS.AppProcID = AM.AppProcID
      INNER JOIN [OTS_DB].[dbo].[AppType] AT ON AT.AppTypeID = AM.AppTypeID
      INNER JOIN [OTS_DB].[dbo].[SO_Header] SH ON APS.DraftNum = SH.DraftNum
      WHERE APS.Approver = 71
      ORDER BY APS.AppSummID DESC

select AppProcID from [OTS_DB].[dbo].[AppProc_Summary] Where Approver = 71 and Status = 'pending'

select AppLevel, UserID from [OTS_DB].[dbo].[AppProc_DetApp] Where AppProcID = 1038

select AppProcID, Type FROM [OTS_DB].[dbo].[AppProc_Main]



SELECT 
    APS.AppProcID,
    APD.AppLevel,
    APD.UserID
FROM 
    [OTS_DB].[dbo].[AppProc_Summary] APS
INNER JOIN 
    [OTS_DB].[dbo].[AppProc_DetApp] APD ON APS.AppProcID = APD.AppProcID
WHERE 
    APS.Approver = 71
    AND APS.Status = 'pending'
    AND APS.AppProcID = 1038;

SELECT 
    APS.AppProcID, 
    APD.AppLevel, 
    APD.UserID,
    APM.Type
FROM 
    [OTS_DB].[dbo].[AppProc_Summary] APS
INNER JOIN 
    [OTS_DB].[dbo].[AppProc_DetApp] APD ON APS.AppProcID = APD.AppProcID
INNER JOIN 
    [OTS_DB].[dbo].[AppProc_Main] APM ON APS.AppProcID = APM.AppProcID
WHERE 
    APS.Approver = 71
    AND APS.Status = 'pending'
    AND APS.AppProcID = 1038;


SELECT 
    APS.AppProcID, 
    MAX(APD.AppLevel) AS MaxAppLevel,  -- Get the maximum AppLevel per AppProcID
    APD.UserID,
    APM.Type
FROM 
    [OTS_DB].[dbo].[AppProc_Summary] APS
INNER JOIN 
    [OTS_DB].[dbo].[AppProc_DetApp] APD ON APS.AppProcID = APD.AppProcID
INNER JOIN 
    [OTS_DB].[dbo].[AppProc_Main] APM ON APS.AppProcID = APM.AppProcID
WHERE 
    APS.Approver = 71
    AND APS.Status = 'pending'
GROUP BY 
    APS.AppProcID, 
    APD.UserID,
    APM.Type
ORDER BY 
    APS.AppProcID;



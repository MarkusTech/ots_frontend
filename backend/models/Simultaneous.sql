/****** Script for SelectTopNRows command from SSMS  ******/
SELECT * FROM [OTS_DB].[dbo].[AppProc_Summary]

UPDATE [OTS_DB].[dbo].[AppProc_Summary] SET Status = 'Approved' WHERE AppSummID = 1072

EXEC [dbo].[GetAppProcSummary] @Approver = 102;


  SELECT  APS.AppSummID, APS.Approver, AT.AppType, APS.ReqDate, APS.DraftNum, 
                SH.DocDate, APS.DocType, SH.CustomerName, SH.TotalAmtDue, APS.Remarks, 
                APS.Status, AM.Type, APD2.AppLevel,
                (SELECT Status 
                 FROM [AppProc_Summary] T0 
                 WHERE T0.Approver <> 102
                 AND T0.DraftNum = APS.DraftNum) NextStatus
        FROM [OTS_DB].[dbo].[AppProc_Summary] APS
        INNER JOIN [OTS_DB].[dbo].[AppProc_Main] AM ON APS.AppProcID = AM.AppProcID
        INNER JOIN [OTS_DB].[dbo].[AppType] AT ON AT.AppTypeID = AM.AppTypeID
        INNER JOIN [OTS_DB].[dbo].[SO_Header] SH ON APS.DraftNum = SH.DraftNum
        INNER JOIN [OTS_DB].[dbo].[AppProc_DetApp] APD ON AM.AppProcID = APD.AppProcID
        INNER JOIN [OTS_DB].[dbo].[AppProc_DetApp] APD2 ON AM.AppProcID = APD2.AppProcID
        WHERE APS.Approver = 102
        AND APD2.UserID = 102
        AND AM.Type = 'Simultaneous'
        ORDER BY APS.AppSummID DESC


SELECT DISTINCT 
    APS.AppSummID, 
    APS.Approver, 
    AT.AppType, 
    APS.ReqDate, 
    APS.DraftNum, 
    SH.DocDate, 
    APS.DocType, 
    SH.CustomerName, 
    SH.TotalAmtDue, 
    APS.Remarks, 
    APS.Status, 
    AM.Type, 
    APD2.AppLevel,
    (SELECT Status 
     FROM [AppProc_Summary] T0 
     WHERE T0.Approver <> 102
     AND T0.DraftNum = APS.DraftNum) AS NextStatus
FROM 
    [OTS_DB].[dbo].[AppProc_Summary] APS
INNER JOIN 
    [OTS_DB].[dbo].[AppProc_Main] AM ON APS.AppProcID = AM.AppProcID
INNER JOIN 
    [OTS_DB].[dbo].[AppType] AT ON AT.AppTypeID = AM.AppTypeID
INNER JOIN 
    [OTS_DB].[dbo].[SO_Header] SH ON APS.DraftNum = SH.DraftNum
INNER JOIN 
    [OTS_DB].[dbo].[AppProc_DetApp] APD ON AM.AppProcID = APD.AppProcID
INNER JOIN 
    [OTS_DB].[dbo].[AppProc_DetApp] APD2 ON AM.AppProcID = APD2.AppProcID
WHERE 
    APS.Approver = 102
    AND APD2.UserID = 102
    AND AM.Type = 'Simultaneous'
	AND APS.Status = 'Pending'
ORDER BY 
    APS.AppSummID DESC;


SELECT DISTINCT 
    APS.AppSummID, 
    APS.Approver, 
    AT.AppType, 
    APS.ReqDate, 
    APS.DraftNum, 
    SH.DocDate, 
    APS.DocType, 
    SH.CustomerName, 
    SH.TotalAmtDue, 
    APS.Remarks, 
    APS.Status, 
    AM.Type, 
    APD2.AppLevel,
    NextStatus.Status AS NextStatus
FROM 
    [OTS_DB].[dbo].[AppProc_Summary] APS
INNER JOIN 
    [OTS_DB].[dbo].[AppProc_Main] AM ON APS.AppProcID = AM.AppProcID
INNER JOIN 
    [OTS_DB].[dbo].[AppType] AT ON AT.AppTypeID = AM.AppTypeID
INNER JOIN 
    [OTS_DB].[dbo].[SO_Header] SH ON APS.DraftNum = SH.DraftNum
INNER JOIN 
    [OTS_DB].[dbo].[AppProc_DetApp] APD ON AM.AppProcID = APD.AppProcID
INNER JOIN 
    [OTS_DB].[dbo].[AppProc_DetApp] APD2 ON AM.AppProcID = APD2.AppProcID
LEFT JOIN 
    (SELECT DraftNum, Status 
     FROM [OTS_DB].[dbo].[AppProc_Summary]
     WHERE Approver <> 102) AS NextStatus 
     ON NextStatus.DraftNum = APS.DraftNum
WHERE 
    APS.Approver = 102
    AND APD2.UserID = 102
    AND AM.Type = 'Simultaneous'
    AND APS.Status = 'Pending'
    AND NextStatus.Status = 'Pending'
ORDER BY 
    APS.AppSummID DESC;


EXEC [OTS_DB].[dbo].[GetAppProcSummary] @Approver = 102, @UserID = 102;

SELECT APS.AppSummID, APS.Approver, AT.AppType, APS.ReqDate, APS.DraftNum, SH.DocDate, APS.DocType, SH.CustomerName, SH.TotalAmtDue, APS.Remarks, APS.Status
      FROM [OTS_DB].[dbo].[AppProc_Summary] APS
      INNER JOIN [OTS_DB].[dbo].[AppProc_Main] AM ON APS.AppProcID = AM.AppProcID
      INNER JOIN [OTS_DB].[dbo].[AppType] AT ON AT.AppTypeID = AM.AppTypeID
      INNER JOIN [OTS_DB].[dbo].[SO_Header] SH ON APS.DraftNum = SH.DraftNum
      WHERE APS.Approver = 71
      ORDER BY APS.AppSummID DESC

SELECT * FROM [OTS_DB].[dbo].[AppProc_Summary]
SELECT * FROM [OTS_DB].[dbo].[AppProc_DetApp] WHERE AppProcID = 1038 AND UserID = 102
SELECT * FROM [OTS_DB].[dbo].[AppProc_Main]

SELECT APS.AppSummID, APS.Approver, AT.AppType, APS.ReqDate, APS.DraftNum, SH.DocDate, APS.DocType, SH.CustomerName, SH.TotalAmtDue, APS.Remarks, APS.Status, AM.Type, APD.AppLevel
FROM [OTS_DB].[dbo].[AppProc_Summary] APS
INNER JOIN [OTS_DB].[dbo].[AppProc_Main] AM ON APS.AppProcID = AM.AppProcID
INNER JOIN [OTS_DB].[dbo].[AppType] AT ON AT.AppTypeID = AM.AppTypeID
INNER JOIN [OTS_DB].[dbo].[SO_Header] SH ON APS.DraftNum = SH.DraftNum
INNER JOIN [OTS_DB].[dbo].[AppProc_DetApp] APD ON AM.AppProcID = APD.AppProcID
WHERE APS.Approver = 71 
  AND (
    (AM.Type = 'sequential' AND APD.AppLevel = (
      SELECT MIN(APD2.AppLevel)
      FROM [OTS_DB].[dbo].[AppProc_DetApp] APD2
      WHERE APD2.AppProcID = AM.AppProcID
    ))
    OR AM.Type != 'sequential'
  )
ORDER BY APS.AppSummID DESC;
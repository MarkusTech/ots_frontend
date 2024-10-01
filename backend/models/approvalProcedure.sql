SELECT 
    MIN(APS.AppSummID) AS AppSummID, 
    AT.AppType,
    MAX(APS.ReqDate) AS ReqDate,
    APS.DraftNum,
    MAX(SH.DocDate) AS DocDate,
    APS.DocType,
    MAX(SH.CustomerName) AS CustomerName,
    MAX(SH.TotalAmtDue) AS TotalAmtDue,
    STRING_AGG(APS.Remarks, ', ') AS Remarks,
    MAX(APS.Status) AS Status
FROM 
    [OTS_DB].[dbo].[AppProc_Summary] APS
INNER JOIN 
    [OTS_DB].[dbo].[AppProc_Main] AM ON APS.AppProcID = AM.AppProcID
INNER JOIN 
    [OTS_DB].[dbo].[AppType] AT ON AT.AppTypeID = AM.AppTypeID
INNER JOIN 
    [OTS_DB].[dbo].[SO_Header] SH ON APS.DraftNum = SH.DraftNum
GROUP BY 
    AT.AppType,
    APS.DraftNum,
    APS.DocType
ORDER BY 
    APS.DraftNum; -- Optional: order by DraftNum
--First query for Approver 71
SELECT 
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
    StatusColumn.Status AS StatusColumn -- Renamed to align with second query
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
    (SELECT 
         DraftNum, Status 
     FROM 
         [OTS_DB].[dbo].[AppProc_Summary]
     WHERE 
         Approver <> 71) AS StatusColumn 
ON 
    StatusColumn.DraftNum = APS.DraftNum
WHERE 
    APS.Approver = 71
    AND APD2.UserID = 71
    AND (
        (AM.Type = 'Sequential' AND APD.AppLevel = (
            SELECT MIN(APD3.AppLevel)
            FROM [OTS_DB].[dbo].[AppProc_DetApp] APD3
            WHERE APD3.AppProcID = AM.AppProcID
        ))
        OR AM.Type != 'Sequential'
    )
	AND APS.Status = 'Pending'
    AND StatusColumn.Status = 'Pending'
	AND AM.Type = 'Sequential'

UNION ALL

SELECT 
    DISTINCT APS.AppSummID, 
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
    NextStatus.Status AS StatusColumn -- Aligning column name with the first query
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
    (SELECT 
         DraftNum, Status 
     FROM 
         [OTS_DB].[dbo].[AppProc_Summary]
     WHERE 
         Approver <> 71) AS NextStatus 
ON 
    NextStatus.DraftNum = APS.DraftNum
WHERE 
    APS.Approver = 71
    AND APD2.UserID = 71
    AND AM.Type = 'Simultaneous'
    AND APS.Status = 'Pending'
    AND NextStatus.Status = 'Pending'

ORDER BY 
    AppSummID DESC;


-- -------------------------------------------------------------------------------------
	-- First query for Approver 102
SELECT 
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
    StatusColumn.Status AS StatusColumn
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
    (SELECT 
         DraftNum, Status 
     FROM 
         [OTS_DB].[dbo].[AppProc_Summary]
     WHERE 
         Approver <> 102) AS StatusColumn 
ON 
    StatusColumn.DraftNum = APS.DraftNum
WHERE 
    APS.Approver = 102
    AND APD2.UserID = 102
    AND (
        (AM.Type = 'Sequential' AND APD.AppLevel = (
            SELECT MIN(APD3.AppLevel)
            FROM [OTS_DB].[dbo].[AppProc_DetApp] APD3
            WHERE APD3.AppProcID = AM.AppProcID
        ))
        OR AM.Type != 'Sequential'
    ) 
	AND APS.Status = 'Pending'
    AND StatusColumn.Status = 'Approved'
	AND AM.Type = 'Sequential'

UNION ALL

SELECT 
    DISTINCT APS.AppSummID, 
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
    NextStatus.Status AS StatusColumn
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
    (SELECT 
         DraftNum, Status 
     FROM 
         [OTS_DB].[dbo].[AppProc_Summary]
     WHERE 
         Approver <> 102) AS NextStatus 
ON 
    NextStatus.DraftNum = APS.DraftNum
WHERE 
    APS.Approver = 102
    AND APD2.UserID = 102
    AND AM.Type = 'Simultaneous'
    AND APS.Status = 'Pending'
    AND NextStatus.Status = 'Pending'

ORDER BY 
    AppSummID DESC;




















	-- First query for Approver 71
--SELECT 
--    APS.AppSummID, 
--    APS.Approver, 
--    AT.AppType, 
--    APS.ReqDate, 
--    APS.DraftNum, 
--    SH.DocDate, 
--    APS.DocType, 
--    SH.CustomerName, 
--    SH.TotalAmtDue, 
--    APS.Remarks, 
--    APS.Status, 
--    AM.Type, 
--    APD2.AppLevel,
--    StatusColumn.Status AS StatusColumn -- Renamed to align with second query
--FROM 
--    [OTS_DB].[dbo].[AppProc_Summary] APS
--INNER JOIN 
--    [OTS_DB].[dbo].[AppProc_Main] AM ON APS.AppProcID = AM.AppProcID
--INNER JOIN 
--    [OTS_DB].[dbo].[AppType] AT ON AT.AppTypeID = AM.AppTypeID
--INNER JOIN 
--    [OTS_DB].[dbo].[SO_Header] SH ON APS.DraftNum = SH.DraftNum
--INNER JOIN 
--    [OTS_DB].[dbo].[AppProc_DetApp] APD ON AM.AppProcID = APD.AppProcID
--INNER JOIN 
--    [OTS_DB].[dbo].[AppProc_DetApp] APD2 ON AM.AppProcID = APD2.AppProcID
--LEFT JOIN 
--    (SELECT 
--         DraftNum, Status 
--     FROM 
--         [OTS_DB].[dbo].[AppProc_Summary]
--     WHERE 
--         Approver <> 71) AS StatusColumn 
--ON 
--    StatusColumn.DraftNum = APS.DraftNum
--WHERE 
--    APS.Approver = 71
--    AND APD2.UserID = 71
--    AND (
--        (AM.Type = 'Sequential' AND APD.AppLevel = (
--            SELECT MIN(APD3.AppLevel)
--            FROM [OTS_DB].[dbo].[AppProc_DetApp] APD3
--            WHERE APD3.AppProcID = AM.AppProcID
--        ))
--        OR AM.Type != 'Sequential'
--    )
--	AND APS.Status = 'Pending'
--    AND StatusColumn.Status = 'Pending'
--	AND AM.Type = 'Sequential'

----UNION ALL

--SELECT 
--    DISTINCT APS.AppSummID, 
--    APS.Approver, 
--    AT.AppType, 
--    APS.ReqDate, 
--    APS.DraftNum, 
--    SH.DocDate, 
--    APS.DocType, 
--    SH.CustomerName, 
--    SH.TotalAmtDue, 
--    APS.Remarks, 
--    APS.Status, 
--    AM.Type, 
--    APD2.AppLevel,
--    NextStatus.Status AS StatusColumn -- Aligning column name with the first query
--FROM 
--    [OTS_DB].[dbo].[AppProc_Summary] APS
--INNER JOIN 
--    [OTS_DB].[dbo].[AppProc_Main] AM ON APS.AppProcID = AM.AppProcID
--INNER JOIN 
--    [OTS_DB].[dbo].[AppType] AT ON AT.AppTypeID = AM.AppTypeID
--INNER JOIN 
--    [OTS_DB].[dbo].[SO_Header] SH ON APS.DraftNum = SH.DraftNum
--INNER JOIN 
--    [OTS_DB].[dbo].[AppProc_DetApp] APD ON AM.AppProcID = APD.AppProcID
--INNER JOIN 
--    [OTS_DB].[dbo].[AppProc_DetApp] APD2 ON AM.AppProcID = APD2.AppProcID
--LEFT JOIN 
--    (SELECT 
--         DraftNum, Status 
--     FROM 
--         [OTS_DB].[dbo].[AppProc_Summary]
--     WHERE 
--         Approver <> 102) AS NextStatus 
--ON 
--    NextStatus.DraftNum = APS.DraftNum
--WHERE 
--    APS.Approver = 71
--    AND APD2.UserID = 71
--    AND AM.Type = 'Simultaneous'
--    AND APS.Status = 'Pending'
--    AND NextStatus.Status = 'Pending'

--ORDER BY 
--    AppSummID DESC;



	--EXEC [dbo].[GetAppProcSummaryV2] @Approver = 102;
	--EXEC [dbo].[GetAppProcSummaryV2] @Approver = 71;

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
    APS.DraftNum;


WITH SummaryData AS (
    SELECT 
        MIN(APS.AppSummID) AS AppSummID,         -- Get the minimum AppSummID for the group
        AT.AppType,                               -- Select the Application Type
        MAX(APS.ReqDate) AS ReqDate,             -- Get the latest Request Date
        APS.DraftNum,                             -- Draft Number (this is the unique key for grouping)
        MAX(SH.DocDate) AS DocDate,              -- Get the latest Document Date
        MAX(SH.CustomerName) AS CustomerName,    -- Get the latest Customer Name
        MAX(SH.TotalAmtDue) AS TotalAmtDue,      -- Get the maximum Total Amount Due
        STRING_AGG(APS.Remarks, ', ') AS Remarks,  -- Concatenate Remarks into a single string
        MAX(APS.Status) AS Status                 -- Get the highest Status
    FROM 
        [OTS_DB].[dbo].[AppProc_Summary] APS
    INNER JOIN 
        [OTS_DB].[dbo].[AppProc_Main] AM ON APS.AppProcID = AM.AppProcID
    INNER JOIN 
        [OTS_DB].[dbo].[AppType] AT ON AT.AppTypeID = AM.AppTypeID
    INNER JOIN 
        [OTS_DB].[dbo].[SO_Header] SH ON APS.DraftNum = SH.DraftNum
    GROUP BY 
        AT.AppType,                              -- Group by Application Type
        APS.DraftNum,                            -- Group by Draft Number
        APS.DocType                              -- Group by Document Type
)

SELECT 
    *,
    (SELECT COUNT(*) FROM SummaryData) AS TotalRecordCount  -- Count of all output rows
FROM 
    SummaryData
ORDER BY 
    DraftNum;  -- Optional: order by DraftNum


-----------------------------------------------------------------------------------------

WITH SummaryData AS (
    SELECT 
        MIN(APS.AppSummID) AS AppSummID,         -- Get the minimum AppSummID for the group
        AT.AppType,                               -- Select the Application Type
        MAX(APS.ReqDate) AS ReqDate,             -- Get the latest Request Date
        APS.DraftNum,                             -- Draft Number (this is the unique key for grouping)
        MAX(SH.DocDate) AS DocDate,              -- Get the latest Document Date
        APS.DocType,
        MAX(SH.CustomerName) AS CustomerName,    -- Get the latest Customer Name
        MAX(SH.TotalAmtDue) AS TotalAmtDue,      -- Get the maximum Total Amount Due
        MIN(APS.Remarks) AS Remarks,             -- Get the Remarks (assuming they're the same for the group)
        MAX(APS.Status) AS Status                -- Get the highest Status
    FROM 
        [OTS_DB].[dbo].[AppProc_Summary] APS
    INNER JOIN 
        [OTS_DB].[dbo].[AppProc_Main] AM ON APS.AppProcID = AM.AppProcID
    INNER JOIN 
        [OTS_DB].[dbo].[AppType] AT ON AT.AppTypeID = AM.AppTypeID
    INNER JOIN 
        [OTS_DB].[dbo].[SO_Header] SH ON APS.DraftNum = SH.DraftNum
    GROUP BY 
        AT.AppType,                              -- Group by Application Type
        APS.DraftNum,                            -- Group by Draft Number
        APS.DocType                              -- Group by Document Type
)

SELECT 
    *,
    (SELECT COUNT(*) FROM SummaryData) AS TotalRecordCount  -- Count of all output rows
FROM 
    SummaryData
ORDER BY 
    DraftNum;



SELECT APS.AppSummID,AT.AppType, APS.ReqDate, APS.DraftNum, SH.DocDate, APS.DocType, SH.CustomerName, SH.TotalAmtDue, APS.Remarks, APS.Status
        from [OTS_DB].[dbo].[AppProc_Summary] APS
        INNER JOIN [OTS_DB].[dbo].[AppProc_Main] AM
        ON APS.AppProcID = AM.AppProcID
        INNER JOIN [OTS_DB].[dbo].[AppType] AT
        ON AT.AppTypeID = AM.AppTypeID
        INNER JOIN [OTS_DB].[dbo].[SO_Header] SH
        ON APS.DraftNum = SH.DraftNum

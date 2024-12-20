USE [OTS_DB]
GO
/****** Object:  StoredProcedure [dbo].[GetAppProcSummaryBaseOnApprover]    Script Date: 12/19/2024 4:26:10 pm ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

ALTER PROCEDURE [dbo].[GetAppProcSummaryBaseOnApprover]
    @Approver INT
AS
BEGIN
    -- Query for Approver 102
    IF @Approver = 102
    BEGIN
        -- First query for Approver 102
        SELECT  
            APS.AppSummID, APS.Approver, AT.AppType, APS.ReqDate, APS.DraftNum, 
            SH.DocDate, APS.DocType, SH.CustomerName, SH.TotalAmtDue, APS.Remarks, 
            APS.Status, AM.Type, APD2.AppLevel,
            (SELECT Status 
             FROM [AppProc_Summary] T0 
             WHERE T0.Approver <> @Approver 
             AND T0.DraftNum = APS.DraftNum) AS StatusColumn -- Renamed column to generic name
        FROM [OTS_DB].[dbo].[AppProc_Summary] APS
        INNER JOIN [OTS_DB].[dbo].[AppProc_Main] AM ON APS.AppProcID = AM.AppProcID
        INNER JOIN [OTS_DB].[dbo].[AppType] AT ON AT.AppTypeID = AM.AppTypeID
        INNER JOIN [OTS_DB].[dbo].[SO_Header] SH ON APS.DraftNum = SH.DraftNum
        INNER JOIN [OTS_DB].[dbo].[AppProc_DetApp] APD ON AM.AppProcID = APD.AppProcID
        INNER JOIN [OTS_DB].[dbo].[AppProc_DetApp] APD2 ON AM.AppProcID = APD2.AppProcID
        WHERE APS.Approver = @Approver
        AND APD2.UserID = @Approver
        AND (
            (AM.Type = 'sequential' AND APD.AppLevel = (
                SELECT MIN(APD3.AppLevel)
                FROM [OTS_DB].[dbo].[AppProc_DetApp] APD3
                WHERE APD3.AppProcID = AM.AppProcID
            ))
            OR AM.Type != 'sequential'
        )
        AND (SELECT Status 
             FROM [AppProc_Summary] T0 
             WHERE T0.Approver <> 102 
             AND T0.DraftNum = APS.DraftNum) = 'approved'
        
        UNION ALL -- Using UNION ALL to combine both queries

        -- Second query for Approver 102
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
     WHERE Approver <> 71) AS NextStatus 
     ON NextStatus.DraftNum = APS.DraftNum
WHERE 
    APS.Approver = 102
    AND APD2.UserID = 102
    AND AM.Type = 'Simultaneous'
    AND APS.Status = 'Pending'
    AND NextStatus.Status = 'Pending'
ORDER BY 
    APS.AppSummID DESC;
    END

	-- -------------------------------------------------------------------------------------- --
	-- Query for Approver 71
	IF @Approver = 71
    BEGIN
        -- First query for Approver 71
        SELECT  
            APS.AppSummID, APS.Approver, AT.AppType, APS.ReqDate, APS.DraftNum, 
            SH.DocDate, APS.DocType, SH.CustomerName, SH.TotalAmtDue, APS.Remarks, 
            APS.Status, AM.Type, APD2.AppLevel,
            (SELECT Status 
             FROM [AppProc_Summary] T0 
             WHERE T0.Approver <> @Approver 
             AND T0.DraftNum = APS.DraftNum) AS StatusColumn -- Renamed column to generic name
        FROM [OTS_DB].[dbo].[AppProc_Summary] APS
        INNER JOIN [OTS_DB].[dbo].[AppProc_Main] AM ON APS.AppProcID = AM.AppProcID
        INNER JOIN [OTS_DB].[dbo].[AppType] AT ON AT.AppTypeID = AM.AppTypeID
        INNER JOIN [OTS_DB].[dbo].[SO_Header] SH ON APS.DraftNum = SH.DraftNum
        INNER JOIN [OTS_DB].[dbo].[AppProc_DetApp] APD ON AM.AppProcID = APD.AppProcID
        INNER JOIN [OTS_DB].[dbo].[AppProc_DetApp] APD2 ON AM.AppProcID = APD2.AppProcID
        WHERE APS.Approver = @Approver
        AND APD2.UserID = @Approver
        AND (
            (AM.Type = 'sequential' AND APD.AppLevel = (
                SELECT MIN(APD3.AppLevel)
                FROM [OTS_DB].[dbo].[AppProc_DetApp] APD3
                WHERE APD3.AppProcID = AM.AppProcID
            ))
            OR AM.Type != 'sequential'
        )
        AND (SELECT Status 
             FROM [AppProc_Summary] T0 
             WHERE T0.Approver <> 71 
             AND T0.DraftNum = APS.DraftNum) = 'approved'
        
        UNION ALL -- Using UNION ALL to combine both queries

        -- Second query for Approver 102
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
    APS.Approver = 71
    AND APD2.UserID = 71
    AND AM.Type = 'Simultaneous'
    AND APS.Status = 'Pending'
    AND NextStatus.Status = 'Pending'
ORDER BY 
    APS.AppSummID DESC;
    END

	-- -------------------------------------------------------------------------------------- --

    --ELSE
    --BEGIN
    --    -- Query for other Approvers
    --    SELECT  
    --        APS.AppSummID, APS.Approver, AT.AppType, APS.ReqDate, APS.DraftNum, 
    --        SH.DocDate, APS.DocType, SH.CustomerName, SH.TotalAmtDue, APS.Remarks, 
    --        APS.Status, AM.Type, APD2.AppLevel,
    --        (SELECT Status 
    --         FROM [AppProc_Summary] T0 
    --         WHERE T0.Approver <> @Approver 
    --         AND T0.DraftNum = APS.DraftNum) AS StatusColumn -- Renamed column to generic name
    --    FROM [OTS_DB].[dbo].[AppProc_Summary] APS
    --    INNER JOIN [OTS_DB].[dbo].[AppProc_Main] AM ON APS.AppProcID = AM.AppProcID
    --    INNER JOIN [OTS_DB].[dbo].[AppType] AT ON AT.AppTypeID = AM.AppTypeID
    --    INNER JOIN [OTS_DB].[dbo].[SO_Header] SH ON APS.DraftNum = SH.DraftNum
    --    INNER JOIN [OTS_DB].[dbo].[AppProc_DetApp] APD ON AM.AppProcID = APD.AppProcID
    --    INNER JOIN [OTS_DB].[dbo].[AppProc_DetApp] APD2 ON AM.AppProcID = APD2.AppProcID
    --    WHERE APS.Approver = @Approver
    --    AND APD2.UserID = @Approver
    --    AND (
    --        (AM.Type = 'sequential' AND APD.AppLevel = (
    --            SELECT MIN(APD3.AppLevel)
    --            FROM [OTS_DB].[dbo].[AppProc_DetApp] APD3
    --            WHERE APD3.AppProcID = AM.AppProcID
    --        ))
    --        OR AM.Type != 'sequential'
    --    )
    --    ORDER BY APS.AppSummID DESC
    --END
END


--EXEC [dbo].[GetAppProcSummaryBaseOnApprover] @Approver = 102;
--EXEC [dbo].[GetAppProcSummaryBaseOnApprover] @Approver = 71;



SELECT  
            APS.AppSummID, APS.Approver, AT.AppType, APS.ReqDate, APS.DraftNum, 
            SH.DocDate, APS.DocType, SH.CustomerName, SH.TotalAmtDue, APS.Remarks, 
            APS.Status, AM.Type, APD2.AppLevel,
            (SELECT Status 
             FROM [AppProc_Summary] T0 
             WHERE T0.Approver <> 102 
             AND T0.DraftNum = APS.DraftNum) AS StatusColumn -- Renamed column to generic name
        FROM [OTS_DB].[dbo].[AppProc_Summary] APS
        INNER JOIN [OTS_DB].[dbo].[AppProc_Main] AM ON APS.AppProcID = AM.AppProcID
        INNER JOIN [OTS_DB].[dbo].[AppType] AT ON AT.AppTypeID = AM.AppTypeID
        INNER JOIN [OTS_DB].[dbo].[SO_Header] SH ON APS.DraftNum = SH.DraftNum
        INNER JOIN [OTS_DB].[dbo].[AppProc_DetApp] APD ON AM.AppProcID = APD.AppProcID
        INNER JOIN [OTS_DB].[dbo].[AppProc_DetApp] APD2 ON AM.AppProcID = APD2.AppProcID
        WHERE APS.Approver = 102
        AND APD2.UserID = 102
        AND (
            (AM.Type = 'sequential' AND APD.AppLevel = (
                SELECT MIN(APD3.AppLevel)
                FROM [OTS_DB].[dbo].[AppProc_DetApp] APD3
                WHERE APD3.AppProcID = AM.AppProcID
            ))
            OR AM.Type != 'sequential'
        )
        AND (SELECT Status 
             FROM [AppProc_Summary] T0 
             WHERE T0.Approver <> 71 
             AND T0.DraftNum = APS.DraftNum) = 'approved'
        
        UNION ALL -- Using UNION ALL to combine both queries

        -- Second query for Approver 102
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



------------------------------------------------------------------------------
--12-20-2024
USE [OTS_DB]
GO
/****** Object:  StoredProcedure [dbo].[GetAppProcSummaryBaseOnApprover]    Script Date: 12/20/2024 2:52:24 pm ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

ALTER PROCEDURE [dbo].[GetAppProcSummaryBaseOnApprover]
    @Approver INT
AS
BEGIN
    -- Query for Approver 102
    IF @Approver = 102
    BEGIN
        -- First query for Approver 102
        SELECT  
            APS.AppSummID, APS.Approver, AT.AppType, APS.ReqDate, APS.DraftNum, 
            SH.DocDate, APS.DocType, SH.CustomerName, SH.TotalAmtDue, APS.Remarks, 
            APS.Status, AM.Type, APD2.AppLevel,
            (SELECT Status 
             FROM [AppProc_Summary] T0 
             WHERE T0.Approver <> @Approver 
             AND T0.DraftNum = APS.DraftNum) AS StatusColumn -- Renamed column to generic name
        FROM [OTS_DB].[dbo].[AppProc_Summary] APS
        INNER JOIN [OTS_DB].[dbo].[AppProc_Main] AM ON APS.AppProcID = AM.AppProcID
        INNER JOIN [OTS_DB].[dbo].[AppType] AT ON AT.AppTypeID = AM.AppTypeID
        INNER JOIN [OTS_DB].[dbo].[SO_Header] SH ON APS.DraftNum = SH.DraftNum
        INNER JOIN [OTS_DB].[dbo].[AppProc_DetApp] APD ON AM.AppProcID = APD.AppProcID
        INNER JOIN [OTS_DB].[dbo].[AppProc_DetApp] APD2 ON AM.AppProcID = APD2.AppProcID
        WHERE APS.Approver = @Approver
        AND APD2.UserID = @Approver
        AND (
            (AM.Type = 'sequential' AND APD.AppLevel = (
                SELECT MIN(APD3.AppLevel)
                FROM [OTS_DB].[dbo].[AppProc_DetApp] APD3
                WHERE APD3.AppProcID = AM.AppProcID
            ))
            OR AM.Type != 'sequential'
        )
        AND (SELECT Status 
             FROM [AppProc_Summary] T0 
             WHERE T0.Approver <> 102 
             AND T0.DraftNum = APS.DraftNum) = 'approved'
        
        UNION ALL -- Using UNION ALL to combine both queries

        -- Second query for Approver 102
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
    END

	-- -------------------------------------------------------------------------------------- --
	-- Query for Approver 71
	IF @Approver = 71
    BEGIN
        -- First query for Approver 71
        SELECT  
            APS.AppSummID, APS.Approver, AT.AppType, APS.ReqDate, APS.DraftNum, 
            SH.DocDate, APS.DocType, SH.CustomerName, SH.TotalAmtDue, APS.Remarks, 
            APS.Status, AM.Type, APD2.AppLevel,
            (SELECT Status 
             FROM [AppProc_Summary] T0 
             WHERE T0.Approver <> @Approver 
             AND T0.DraftNum = APS.DraftNum) AS StatusColumn -- Renamed column to generic name
        FROM [OTS_DB].[dbo].[AppProc_Summary] APS
        INNER JOIN [OTS_DB].[dbo].[AppProc_Main] AM ON APS.AppProcID = AM.AppProcID
        INNER JOIN [OTS_DB].[dbo].[AppType] AT ON AT.AppTypeID = AM.AppTypeID
        INNER JOIN [OTS_DB].[dbo].[SO_Header] SH ON APS.DraftNum = SH.DraftNum
        INNER JOIN [OTS_DB].[dbo].[AppProc_DetApp] APD ON AM.AppProcID = APD.AppProcID
        INNER JOIN [OTS_DB].[dbo].[AppProc_DetApp] APD2 ON AM.AppProcID = APD2.AppProcID
        WHERE APS.Approver = @Approver
        AND APD2.UserID = @Approver
        AND (
            (AM.Type = 'sequential' AND APD.AppLevel = (
                SELECT MIN(APD3.AppLevel)
                FROM [OTS_DB].[dbo].[AppProc_DetApp] APD3
                WHERE APD3.AppProcID = AM.AppProcID
            ))
            OR AM.Type != 'sequential'
        )
        AND (SELECT Status 
             FROM [AppProc_Summary] T0 
             WHERE T0.Approver <> 71 
             AND T0.DraftNum = APS.DraftNum) = 'approved'
        
        UNION ALL -- Using UNION ALL to combine both queries

        -- Second query for Approver 102
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
    APS.Approver = 71
    AND APD2.UserID = 71
    AND AM.Type = 'Simultaneous'
    AND APS.Status = 'Pending'
    AND NextStatus.Status = 'Pending'
ORDER BY 
    APS.AppSummID DESC;
    END
END


--EXEC [dbo].[GetAppProcSummaryBaseOnApprover] @Approver = 102;
--EXEC [dbo].[GetAppProcSummaryBaseOnApprover] @Approver = 71;

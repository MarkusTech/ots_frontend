USE [OTS_DB]
GO
/****** Object:  StoredProcedure [dbo].[GetAppProcSummary]    Script Date: 11/21/2024 11:12:35 am ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROCEDURE [dbo].[GetAppProcSummary]
    @Approver INT
AS
BEGIN
    -- Conditional logic based on the Approver value
    IF @Approver = 102
    BEGIN
        -- Query for Approver 102
        SELECT  APS.AppSummID, APS.Approver, AT.AppType, APS.ReqDate, APS.DraftNum, 
                SH.DocDate, APS.DocType, SH.CustomerName, SH.TotalAmtDue, APS.Remarks, 
                APS.Status, AM.Type, APD2.AppLevel,
                (SELECT Status 
                 FROM [AppProc_Summary] T0 
                 WHERE T0.Approver <> @Approver 
                 AND T0.DraftNum = APS.DraftNum) PreviousStatus
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
        ORDER BY APS.AppSummID DESC
    END
    ELSE
    BEGIN
        -- Query for other Approvers
        SELECT  APS.AppSummID, APS.Approver, AT.AppType, APS.ReqDate, APS.DraftNum, 
                SH.DocDate, APS.DocType, SH.CustomerName, SH.TotalAmtDue, APS.Remarks, 
                APS.Status, AM.Type, APD2.AppLevel,
                (SELECT Status 
                 FROM [AppProc_Summary] T0 
                 WHERE T0.Approver <> @Approver 
                 AND T0.DraftNum = APS.DraftNum) NextStatus
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
        ORDER BY APS.AppSummID DESC
    END
END

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


---------------------------------------------------------------------------
USE [OTS_DB]
GO
/****** Object:  StoredProcedure [dbo].[GetAppProcSummary]    Script Date: 10/23/2024 11:32:08 am ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	Procedure to fetch AppProc Summary based on Approver and UserID
-- =============================================
ALTER PROCEDURE [dbo].[GetAppProcSummary] 
    @Approver INT,
    @UserID INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT APS.AppSummID, APS.Approver, AT.AppType, APS.ReqDate, APS.DraftNum, 
           SH.DocDate, APS.DocType, SH.CustomerName, SH.TotalAmtDue, APS.Remarks, 
           APS.Status, AM.Type, APD2.*
    FROM [OTS_DB].[dbo].[AppProc_Summary] APS
    INNER JOIN [OTS_DB].[dbo].[AppProc_Main] AM ON APS.AppProcID = AM.AppProcID
    INNER JOIN [OTS_DB].[dbo].[AppType] AT ON AT.AppTypeID = AM.AppTypeID
    INNER JOIN [OTS_DB].[dbo].[SO_Header] SH ON APS.DraftNum = SH.DraftNum
    INNER JOIN [OTS_DB].[dbo].[AppProc_DetApp] APD ON AM.AppProcID = APD.AppProcID
    INNER JOIN [OTS_DB].[dbo].[AppProc_DetApp] APD2 ON AM.AppProcID = APD2.AppProcID
    WHERE APS.Approver = @Approver
    AND APD2.UserID = @UserID
    AND (
        (AM.Type = 'sequential' AND APD.AppLevel = (
            SELECT MIN(APD3.AppLevel)
            FROM [OTS_DB].[dbo].[AppProc_DetApp] APD3
            WHERE APD3.AppProcID = AM.AppProcID
        ))
        OR AM.Type != 'sequential'
    )
    ORDER BY APS.AppSummID DESC;
END

----------------------------------------------------------------------
-- Sir Braynt Query--
DECLARE @Approver INT = 71


  IF @Approver = 102
BEGIN
 SELECT  APS.AppSummID, APS.Approver, AT.AppType, APS.ReqDate, APS.DraftNum, 
           SH.DocDate, APS.DocType, SH.CustomerName, SH.TotalAmtDue, APS.Remarks, 
          APS.Status, AM.Type, APD2.AppLevel,(SELECT Status FROM [AppProc_Summary] T0 WHERE T0.Approver <> @Approver AND T0.DraftNum = APS.DraftNum ) PreviousStatus
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
    AND (SELECT Status FROM [AppProc_Summary] T0 WHERE T0.Approver <> 102 AND T0.DraftNum = APS.DraftNum ) = 'approve'
    ORDER BY APS.AppSummID DESC
END

ELSE

BEGIN
 SELECT  APS.AppSummID, APS.Approver, AT.AppType, APS.ReqDate, APS.DraftNum, 
           SH.DocDate, APS.DocType, SH.CustomerName, SH.TotalAmtDue, APS.Remarks, 
           APS.Status, AM.Type, APD2.AppLevel,(SELECT Status FROM [AppProc_Summary] T0 WHERE T0.Approver <> @Approver AND T0.DraftNum = APS.DraftNum ) NextStatus
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

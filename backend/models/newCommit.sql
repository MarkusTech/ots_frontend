USE [OTS_DB]
GO
/****** Object:  StoredProcedure [dbo].[SP_COMMIT_SO]    Script Date: 03/21/2024 3:57:09 pm ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

ALTER PROCEDURE [dbo].[SP_COMMIT_SO]
	@iDraftNum bigint
AS
BEGIN
	
	SET NOCOUNT ON;

	DECLARE @iDocNum as bigint

	SELECT @iDocNum =  MAX(DocNum) + 1  FROM SO_Header

	UPDATE SO_Header SET DocNum=@iDocNum  WHERE DraftNum=@iDraftNum

END

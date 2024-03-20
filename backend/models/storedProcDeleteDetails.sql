USE [OTS_DB]
GO
/****** Object:  StoredProcedure [dbo].[SP_DELETE_DETAILS]    Script Date: 03/20/2024 10:27:17 am ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
ALTER PROCEDURE [dbo].[SP_DELETE_DETAILS] 
	-- Add the parameters for the stored procedure here
	@DraftNum nvarchar(255)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	BEGIN TRY
			-- Start a transaction
			BEGIN TRANSACTION;
		
			DELETE FROM SO_Details WHERE DraftNum=@DraftNum

			select 'DETAIL DELETED SUCCESSFULLY'

			-- If an error occurs, this will roll back the transaction
			IF @@ERROR <> 0
				ROLLBACK TRANSACTION;
			ELSE
				-- If no error occurs, commit the transaction
				COMMIT TRANSACTION;
		END TRY

		BEGIN CATCH
			-- If an error occurs, rollback the transaction
			IF @@TRANCOUNT > 0
				ROLLBACK TRANSACTION;

			-- Handle the error or log it as needed
			-- For example:
			-- SELECT ERROR_MESSAGE(), ERROR_NUMBER(), ERROR_STATE();

			-- Optionally, re-throw the error
			-- THROW;
		END CATCH

	END

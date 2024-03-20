/****** Script for SelectTopNRows command from SSMS  ******/
SELECT TOP (1000) [EntryNum]
      ,[DocNum]
      ,[DraftNum]
      ,[PostingDate]
      ,[DocDate]
      ,[CustomerCode]
      ,[CustomerName]
      ,[WalkInName]
      ,[ShippingAdd]
      ,[TIN]
      ,[Reference]
      ,[SCPWDIdNo]
      ,[Branch]
      ,[DocStat]
      ,[BaseDoc]
      ,[Cash]
      ,[CreditCard]
      ,[DebitCard]
      ,[ODC]
      ,[PDC]
      ,[OnlineTransfer]
      ,[OnAccount]
      ,[COD]
      ,[TotalAmtBefTax]
      ,[TotalTax]
      ,[TotalAmtAftTax]
      ,[SCPWDDiscTotal]
      ,[TotalAmtDue]
      ,[Remarks]
      ,[CreatedBy]
      ,[DateCreated]
      ,[UpdatedBy]
      ,[DateUpdated]
      ,[SalesCrew]
      ,[ForeignName]
  FROM [OTS_DB].[dbo].[SO_Header] Order By draftNum desc


  // ----------------------------------------------------------------------------
  USE [OTS_DB]
GO
/****** Object:  StoredProcedure [dbo].[SP_ADD_SO_HEADER]    Script Date: 03/20/2024 10:23:24 am ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
ALTER PROCEDURE [dbo].[SP_ADD_SO_HEADER] 
	-- Add the parameters for the stored procedure here
	@EntryNum varchar(MAX),
	@DocNum bigint,
    --@DraftNum bigint,
    @PostingDate date,
    @DocDate date,
    @CustomerCode varchar(50),
    @CustomerName varchar(100),
    @WalkInName varchar(100),
    @ShippingAdd varchar(MAX),
    @TIN varchar(32),
    @Reference varchar(100),
    @SCPWDIdNo varchar(50),
    @Branch varchar(100),
    @DocStat varchar(10),
    @BaseDoc bigint,
    @Cash varchar(1),
    @CreditCard varchar(1),
    @DebitCard varchar(1),
    @ODC varchar(1),
    @PDC varchar(1),
    @OnlineTransfer varchar(1),
    @OnAccount varchar(1),
    @COD varchar(1),
    @TotalAmtBefTax float,
    @TotalTax float,
    @TotalAmtAftTax float,
    @SCPWDDiscTotal float,
    @TotalAmtDue float,
    @Remarks varchar(MAX),
    @CreatedBy varchar(200),
    @DateCreated datetime,
    @UpdatedBy int,
    @DateUpdated datetime,
	@SalesCrew varchar(MAX),
	@ForeignName varchar(MAX)

AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	BEGIN TRY
        -- Start a transaction
        BEGIN TRANSACTION;
		DECLARE @DraftNum bigint

		--select @DraftNum = ISNULL(MAX(DraftNum), 0)+1 from SO_Header
		--SET @PostingDate = CONVERT(DATE, GETDATE())
		--SET @DocDate = CONVERT(DATE, GETDATE())

        INSERT INTO [dbo].[SO_Header]
           ([EntryNum]
           ,[DocNum]
           --,[DraftNum]
           ,[PostingDate]
           ,[DocDate]
           ,[CustomerCode]
           ,[CustomerName]
           ,[WalkInName]
           ,[ShippingAdd]
           ,[TIN]
           ,[Reference]
           ,[SCPWDIdNo]
           ,[Branch]
           ,[DocStat]
           ,[BaseDoc]
           ,[Cash]
           ,[CreditCard]
           ,[DebitCard]
           ,[ODC]
           ,[PDC]
           ,[OnlineTransfer]
           ,[OnAccount]
           ,[COD]
           ,[TotalAmtBefTax]
           ,[TotalTax]
           ,[TotalAmtAftTax]
           ,[SCPWDDiscTotal]
           ,[TotalAmtDue]
           ,[Remarks]
           ,[CreatedBy]
           ,[DateCreated]
           ,[UpdatedBy]
           ,[DateUpdated]
		   ,[SalesCrew]
		   ,[ForeignName])
     VALUES
           (@EntryNum
           ,@DocNum
           --,@DraftNum
           ,@PostingDate
           ,@DocDate
           ,@CustomerCode
           ,@CustomerName
           ,@WalkInName
           ,@ShippingAdd
           ,@TIN
           ,@Reference
           ,@SCPWDIdNo
           ,@Branch
           ,@DocStat
           ,@BaseDoc
           ,@Cash
           ,@CreditCard
           ,@DebitCard
           ,@ODC
           ,@PDC
           ,@OnlineTransfer
           ,@OnAccount
           ,@COD
           ,@TotalAmtBefTax
           ,@TotalTax
           ,@TotalAmtAftTax
           ,@SCPWDDiscTotal
           ,@TotalAmtDue
           ,@Remarks
           ,@CreatedBy
           ,@DateCreated
           ,@UpdatedBy
           ,@DateUpdated
		   ,@SalesCrew
		   ,@ForeignName)

		SET @DraftNum = SCOPE_IDENTITY()
		select @DraftNum

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

/****** Script for SelectTopNRows command from SSMS  ******/
SELECT TOP (1000) [LineID]
      ,[DraftNum]
      ,[ItemCode]
      ,[ItemName]
      ,[Quantity]
      ,[UoM]
      ,[UoMConv]
      ,[Whse]
      ,[InvStat]
      ,[SellPriceBefDisc]
      ,[DiscRate]
      ,[SellPriceAftDisc]
      ,[LowerBound]
      ,[TaxCode]
      ,[TaxCodePerc]
      ,[TaxAmt]
      ,[BelPriceDisc]
      ,[Cost]
      ,[BelCost]
      ,[ModeReleasing]
      ,[SCPWDdisc]
      ,[GrossTotal]
  FROM [OTS_DB].[dbo].[SO_Details]


  // -------------------------------------

  USE [OTS_DB]
GO
/****** Object:  StoredProcedure [dbo].[SP_ADD_SO_DETAILS]    Script Date: 03/20/2024 10:24:50 am ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
ALTER PROCEDURE [dbo].[SP_ADD_SO_DETAILS] 
	-- Add the parameters for the stored procedure here
	@EntryNum varchar(255),
    @ItemCode varchar(20),
    @ItemName varchar(100),
    @Quantity float,
    @UoM varchar(20),
    @UoMConv float,
    @Whs varchar(20),
    @InvStat varchar(20),
    @SellPriceBefDisc float,
    @DiscRate float,
    @SellPriceAftDisc float,
    @LowerBound float,
    @TaxCode varchar(10),
    @TaxCodePerc float,
    @TaxAmt float,
    @BelPriceDisc float,
    @Cost float,
    @BelCost char(1),
    @ModeReleasing varchar(50),
    @SCPWDdisc char(1),
    @GrossTotal float
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
BEGIN TRY
        -- Start a transaction
        BEGIN TRANSACTION;
		
        INSERT INTO [dbo].[SO_Details]
           ([DraftNum]
           ,[ItemCode]
           ,[ItemName]
           ,[Quantity]
           ,[UoM]
           ,[UoMConv]
           ,[Whse]
           ,[InvStat]
           ,[SellPriceBefDisc]
           ,[DiscRate]
           ,[SellPriceAftDisc]
           ,[LowerBound]
           ,[TaxCode]
           ,[TaxCodePerc]
           ,[TaxAmt]
           ,[BelPriceDisc]
           ,[Cost]
           ,[BelCost]
           ,[ModeReleasing]
           ,[SCPWDdisc]
           ,[GrossTotal])
     VALUES
           (
		   @EntryNum,
			@ItemCode,
			@ItemName,
			@Quantity,
			@UoM,
			@UoMConv,
			@Whs,
			@InvStat,
			@SellPriceBefDisc,
			@DiscRate,
			@SellPriceAftDisc,
			@LowerBound,
			@TaxCode,
			@TaxCodePerc,
			@TaxAmt,
			@BelPriceDisc,
			@Cost,
			@BelCost,
			@ModeReleasing,
			@SCPWDdisc,
			@GrossTotal
			)

		select 'Details saved successfully'

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

CREATE PROCEDURE [dbo].[SP_ADD_SO_HEADER_COMMIT] 
    -- Add the parameters for the stored procedure here
    @EntryNum nvarchar(MAX),
    @DraftNum nvarchar(MAX),
    @PostingDate date,
    @DocDate date,
    @CustomerCode nvarchar(MAX),
    @CustomerName nvarchar(MAX),
    @WalkInName nvarchar(MAX),
    @ShippingAdd nvarchar(MAX),
    @TIN nvarchar(MAX),
    @Reference nvarchar(MAX),
    @SCPWDIdNo nvarchar(MAX),
    @Branch nvarchar(MAX),
    @DocStat nvarchar(MAX),
    @BaseDoc int,
    @Cash nvarchar(MAX),
    @CreditCard nvarchar(MAX),
    @DebitCard nvarchar(MAX),
    @ODC nvarchar(MAX),
    @PDC nvarchar(MAX),
    @OnlineTransfer nvarchar(MAX),
    @OnAccount nvarchar(MAX),
    @COD nvarchar(MAX),
    @TotalAmtBefTax float,
    @TotalTax float,
    @TotalAmtTax float,
    @SCPWDDiscTotal float,
    @TotalAmtDue float,
    @Remarks nvarchar(MAX),
    @CreatedBy nvarchar(MAX),
    @DateCreated date,
    @UpdatedBy bigint,
    @DateUpdated date,
    @SalesCrew nvarchar(MAX),
    @ForeignName nvarchar(MAX)

AS
BEGIN
    -- SET NOCOUNT ON added to prevent extra result sets from
    -- interfering with SELECT statements.
    SET NOCOUNT ON;

    BEGIN TRY
        -- Start a transaction
        BEGIN TRANSACTION;
        DECLARE @DocNum bigint

        INSERT INTO [dbo].[SO_Header_Commit]
           ([EntryNum]
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
           ,[TotalAmtTax]
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
           ,@DraftNum
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
           ,@TotalAmtTax
           ,@SCPWDDiscTotal
           ,@TotalAmtDue
           ,@Remarks
           ,@CreatedBy
           ,@DateCreated
           ,@UpdatedBy
           ,@DateUpdated
           ,@SalesCrew
           ,@ForeignName)

        SET @DocNum = SCOPE_IDENTITY()
        SELECT @DocNum AS 'DocNum'

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

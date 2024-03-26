USE [BCD_TEST_DB]
GO
/****** Object:  StoredProcedure [dbo].[SBO_SP_TransactionNotification]    Script Date: 3/26/2024 11:45:46 am ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

ALTER proc [dbo].[SBO_SP_TransactionNotification] 

@object_type nvarchar(30), 				-- SBO Object Type
@transaction_type nchar(1),			-- [A]dd, [U]pdate, [D]elete, [C]ancel, C[L]ose
@num_of_cols_in_key int,
@list_of_key_cols_tab_del nvarchar(255),
@list_of_cols_val_tab_del nvarchar(255)

AS

begin

--Return values
declare @error  int,				-- Result (0 for no error)
	@error_message nvarchar (200), 		-- Error string to be displayed
	@fSumDisc float, @iBaseRef int, @iBaseRef1 int, @iCntWhse int, @vWhseCode varchar(20), @vVATGroup varchar(20),
	@vTaxCode varchar(20), @vVATType varchar(20), @iEmpID int, @vDfltWhse varchar(20), @iOwnerCode int, @vSOWhse varchar(20),
	@cSOMOP char, @cBOMOP char, @iResInvNum int, @iARResNum int, @iApp int, @iIP int, @iRefDoc int, @iPONum int, @dPODocDueDate datetime,
	@dARDocDueDate datetime, @iDocEntry int, @fAP_Amount float, @fPO_Amount float, @iBPLId int, @nOcrCode nvarchar, @fU_ARRASTRE float,
	@fU_WHARFAGE float, @fU_LABOR float, @fU_FREIGHT float, @fU_TRUCKING float, @fU_DOC_STAMP float, @fU_OTHERS float, @iSONum int,
	@fU_BROKERAGE_FEE float, @iDocNum int, @vCardCode varchar(20), @nTotalPayment nvarchar(50), @vDocSeries varchar(30),
	@fActualWTax money, @fStandardWtax money, @fCountOP float, @fCountAPDP float, @fCheckNum float, @vBankCode varchar(10), @cType char,
	@vMainWhse varchar(10),@vExtWhse varchar(10), @vPOCardCode1 varchar(20), @vPOCardCode2 varchar(20), @iCashierID int,@dTransDate datetime,
	@iCntBO int,@iCntNBO int,@fPOQty float,@fSOLOQty float

select @error = 0
select @error_message = N'Ok'
select @fSumDisc = 0
select @iBaseRef=0
select @iBaseRef1=0
select @iCntWhse=0


--------------------------------------------------------------------------------------------------------------------------------

--SALES QOUTATION START---------------------------------------------------------------------------------------------------------

-- Validation for Sales Quotation

IF @object_type = '23'
  AND (@transaction_type = 'A'
  OR @transaction_type = 'U')

BEGIN


  --BRYLE--QUOUTATION--WAREHOUSE
  --To check if multiple warehouse exist in one document entry
  IF EXISTS (SELECT
        DocEntry
      FROM OQUT
      WHERE DocEntry = @list_of_cols_val_tab_del
      AND DocType = 'I')
  BEGIN
    SELECT
      @iCntWhse = COUNT(DISTINCT WhsCode)
    FROM QUT1
    WHERE DocEntry = @list_of_cols_val_tab_del
    IF @iCntWhse > 1
    BEGIN
      SET @error = 6
      SET @error_message = N'Multiple warehouses in one entry are not allowed'
    END
  END
--BRYLE--QUOUTATION--WAREHOUSE


--BRYLE--QUOTATION--CREDIT CARD NOT ALLOW DISCOUNTING
--To ensure that the card related paymemt is not applicable for discounting
IF EXISTS (SELECT
      T0.DocEntry
    FROM OQUT T0
    INNER JOIN OCRD T1
      ON T0.CardCode = T1.CardCode
    WHERE T0.DocEntry = @list_of_cols_val_tab_del
    AND (T0.[U_SO_CC] = 'Y'
    OR T0.[U_SO_DC] = 'Y'
    OR T0.[U_BO_CC] = 'Y'
    OR T0.[U_BO_DC] = 'Y'))
BEGIN
  SELECT
    @fSumDisc = SUM(T0.DiscPrcnt)
  FROM QUT1 T0
  WHERE T0.DocEntry = @list_of_cols_val_tab_del
  IF @fSumDisc > 0
  BEGIN
    SET @error = 8
    SET @error_message = N'Credit Card is not applicable for discounting.'
  END
END
--BRYLE--QUOTATION--CREDIT CARD NOT ALLOW DISCOUNTING


--BRYLE--QUOTATION-INVALID PRICE
IF EXISTS (SELECT
      DocNum
    FROM OQUT
    WHERE DocEntry = @list_of_cols_val_tab_del
    AND CONVERT(INT, (DocTotal % 1) * 100) NOT IN (25, 50, 75, 0))

BEGIN
  SET @error = 31
  SET @error_message = N'Invalid price rounding off.'
END
--BRYLE--QUOTATION-INVALID PRICE


--BRYLE--QUOTATION-SC/PWD DISCOUNT IS NOT ALLOWED
--To ensure that a Non-Senior Citizen/PWD cannot avail discounts
IF EXISTS (SELECT
      DocNum
    FROM OQUT
    WHERE DocNum = @list_of_cols_val_tab_del
    AND CardCode != 'C000112'
    AND U_SCPWD > 0
    AND CANCELED = 'N')
BEGIN

  SET @error = 27
  SET @error_message = N'SC/PWD Discount is not allowed.'

END
--BRYLE--QUOTATION-SC/PWD DISCOUNT IS NOT ALLOWED



			----To check if the amount discounted for SC/PWD is correct
			IF EXISTS(SELECT DocNum FROM OQUT WHERE DocNum=@list_of_cols_val_tab_del AND CardCode='C000112' AND U_SCPWD <> ROUND(ROUND((DocTotal/1.12),2) * 0.05,2) AND CANCELED='N')
			BEGIN
			
				SET @error=25
				SET @error_message =N'SC/PWD Discount computation is incorrect.'

			END

			--To require discount for Senior Citizen/PWD
			IF EXISTS(SELECT DocNum FROM OQUT WHERE DocNum=@list_of_cols_val_tab_del AND CardCode='C000112' AND (U_SCPWD=0 OR U_SCPWD IS NULL) AND CANCELED='N')
			BEGIN
			
				SET @error=26
				SET @error_message =N'SC/PWD Discount is required.'

			END

			--To ensure that a Non-Senior Citizen/PWD cannot avail discounts
			IF EXISTS(SELECT DocNum FROM OQUT WHERE DocNum=@list_of_cols_val_tab_del AND CardCode != 'C000112' AND U_SCPWD > 0 AND CANCELED='N')
			BEGIN
			
				SET @error=27
				SET @error_message =N'SC/PWD Discount is not allowed.'

			END

			--To check if the item is valid forf SC/PWDS Discounting
			IF EXISTS(SELECT T0.DocNum FROM OQUT T0 INNER JOIN QUT1 T1
					  ON T0.DocEntry=T1.DocEntry
					  WHERE T0.DocNum=@list_of_cols_val_tab_del  AND  CardCode='C000112' AND T1.ItemCode NOT IN (SELECT ItemCode FROM OSPP WHERE CardCode='C000112') AND CANCELED='N')
			BEGIN
			
				SET @error=28
				SET @error_message =N'Some items are not applicable for discounting.'

			END

			--To check if the SC/PWD customer has SC/PWD ID No.
			IF EXISTS(SELECT DocNum FROM OQUT 
					  WHERE DocNum=@list_of_cols_val_tab_del  AND  CardCode='C000112' AND (U_OscaPwd = '' OR U_OscaPwd IS NULL))
			BEGIN
			
				SET @error=29
				SET @error_message =N'Senior Citizen/PWD ID No. is required.'

			END


		--To Check if Document Series is generated
		IF exists (SELECT DocNum FROM OQUT WHERE [DocNum]=@list_of_cols_val_tab_del 
		AND (U_DocSeries LIKE '%N/A%' OR (U_DocSeries IS NULL OR U_DocSeries ='')))
		BEGIN
			SET @error=1
			SET @error_message =N'Document Series must be provided in this transaction.'
		END

		--To Check if there is duplicated Document Series
		SELECT @vDocSeries = U_DocSeries FROM OQUT WHERE DocNum=@list_of_cols_val_tab_del 

		IF (SELECT COUNT(U_DocSeries) FROM OQUT WHERE DocNum <> @list_of_cols_val_tab_del AND U_DocSeries=@vDocSeries AND CANCELED='N') > 0
		BEGIN
			SET @error=2
			SET @error_message =N'Duplicate document series is not allowed.'
		END


			--To check if multiple warehouse exist in one document entry
			  IF exists (SELECT DocEntry FROM OQUT   WHERE DocEntry=@list_of_cols_val_tab_del AND DocType='I')
			  BEGIN
					SELECT @iCntWhse =  COUNT(Distinct WhsCode) FROM QUT1  WHERE DocEntry=@list_of_cols_val_tab_del
					IF @iCntWhse > 1
					BEGIN
						SET @error=6
						SET @error_message =N'Multiple warehouses in one entry are not allowed' 
					END
			  END

			  --To check if multiple store perfomance exist in one document entry
			  IF exists (SELECT DocEntry FROM OQUT  WHERE DocEntry=@list_of_cols_val_tab_del)
			  BEGIN
					SELECT @iCntWhse =  COUNT(Distinct OcrCode) FROM QUT1  WHERE DocEntry=@list_of_cols_val_tab_del
					IF @iCntWhse > 1
					BEGIN
						SET @error=7
						SET @error_message =N'Multiple store performance is not allowed.' 
					END
			  END



			--To ensure that the walk-in customer has its actual customer name
			IF exists (SELECT T0.DocEntry FROM OQUT T0  WHERE T0.DocEntry=@list_of_cols_val_tab_del AND T0.CardCode IN ('C000107','C000132','C000111','C000112','C000091') AND (T0.U_Customer = '' OR T0.U_Customer IS NULL))
			BEGIN
					SET @error=13
					SET @error_message =N'Customer Name is required'
			END

			--To ensure that the walk-in customer has its actual customer name
			IF exists (SELECT T0.DocEntry FROM OQUT T0  WHERE T0.DocEntry=@list_of_cols_val_tab_del AND T0.CardCode NOT IN ('C000107','C000132','C000111','C000112','C000091') AND (T0.U_Customer != '' OR T0.U_Customer IS NOT NULL))
			BEGIN
					SET @error=13
					SET @error_message =N'Customer Name is not required.'
			END




			--To check if the Customer is allow to use Charge on Account (PO)  or Charge on Account (PDC) Payment Type
			IF exists (SELECT DocNum FROM OCRD T0 INNER JOIN OQUT T1 ON T0.CardCode=T1.CardCode AND T1.DocNum=@list_of_cols_val_tab_del AND (T0.U_AllowPDC='N' AND T0.U_AllowPO='N') AND (T1.U_SO_PO='Y' OR T1.U_SO_PDC='Y'))
			BEGIN
					SET @error=15
					SET @error_message =N'The Customer is not allowed to issue PO or PDC'
			END



			--To check if the Walk-In_WTax customer has TIN and Address.
			IF EXISTS(SELECT DocNum FROM OQUT 
					  WHERE DocNum=@list_of_cols_val_tab_del AND CardCode='C000111' AND (U_ALIAS_VENDOR = '' OR U_ALIAS_VENDOR IS NULL OR U_TIN = '' OR U_TIN IS NULL OR U_ADDRESS='' OR U_ADDRESS IS NULL))
			BEGIN
			
				SET @error=30
				SET @error_message =N'Name, TIN and Address is required.'

			END



            -- BRYLE 07/06/2022
            --To check if the Sales Employee is empty
			IF EXISTS(SELECT DocNum FROM OQUT						
						WHERE DocEntry=@list_of_cols_val_tab_del AND (U_slp_name is null or U_slp_name = ''))
			BEGIN
			
				SET @error=31
				SET @error_message =N'Sales Employee is required.'

			END
            -- BRYLE 07/06/2022




			IF EXISTS(SELECT DocNum FROM OQUT WHERE DocEntry=@list_of_cols_val_tab_del AND CONVERT(int, (Doctotal % 1) * 100)  NOT IN (25,50,75,0))
				
			BEGIN
				SET @error=31
				SET @error_message =N'Invalid price rounding off.'
			END




      --BRYLE 01/21/2023
       --To check if SQ has the same Item Code and Uom Code

      IF (SELECT DISTINCT TOP 1 Count(UomCode) AS UomCOde FROM QUT1 WHERE DocEntry = @list_of_cols_val_tab_del AND  FreeTxt IS NULL GROUP BY UomCode,ItemCode ORDER BY UomCOde DESC) >= 2
      BEGIN
        SET @error = 33
        SET @error_message = N'Cannot add document with the same Item Code and Uom Code.'
      END

	  	--To check the price discount approval
		IF EXISTS(SELECT DocNum FROM OQUT T0 INNER JOIN OCRD T1
						ON T0.CardCode=T1.CardCode INNER JOIN QUT1 T2
						ON T0.DocNum=T2.DocEntry INNER JOIN OHEM T3
						ON T0.OwnerCode=T3.empID					
						WHERE T0.DocNum=@list_of_cols_val_tab_del AND T2.U_BelowVolDisc='Y' AND T0.U_BelCostAp='N' AND T0.U_PriceApproval='N' AND T3.position = 1)
		BEGIN
			
			SET @error=31
			SET @error_message =N'An approval is required for prices below the allowable discount. Set the Price Discount Approval field to “Y”.'

		END
		ELSE IF EXISTS(SELECT DocNum FROM OQUT T0 INNER JOIN OCRD T1
						ON T0.CardCode=T1.CardCode INNER JOIN QUT1 T2
						ON T0.DocNum=T2.DocEntry INNER JOIN OHEM T3
						ON T0.OwnerCode=T3.empID							
						WHERE T0.DocNum=@list_of_cols_val_tab_del AND T1.U_AllowedDisc='N' AND (T0.U_SO_PO = 'Y' OR  T0.U_SO_PDC = 'Y' OR T0.U_BO_PO ='Y' OR T0.U_BO_PDC ='Y')
						AND T2.DiscPrcnt > 0 AND T0.U_PriceApproval='N' AND T0.U_BelCostAp='N' AND T3.position = 1)
		BEGIN
			
			SET @error=31
			SET @error_message =N'An approval is required for prices below the allowable discount. Set the Price Discount Approval field to “Y”.'

		END
            
		--To check if the Selling Price is lower than the Item Cost
		IF EXISTS(SELECT DocEntry FROM QUT1 WHERE DocEntry = @list_of_cols_val_tab_del AND CONVERT(numeric,REPLACE(U_GPBD,',','')) != PriceAfVAT)
		BEGIN
			IF EXISTS(SELECT DocNum FROM OQUT T0 INNER JOIN QUT1 T1
							ON T0.DocNum=T1.DocEntry INNER JOIN OITW T2 
							ON T1.ItemCode=T2.ItemCode	INNER JOIN OHEM T3
							ON T0.OwnerCode=T3.empID			
							WHERE T0.DocNum=@list_of_cols_val_tab_del AND T2.WhsCode=T1.WhsCode AND ROUND((T1.PriceAfVAT/1.12),2) < T2.AvgPrice AND T0.U_BelCostAp='N'
							AND CONVERT(numeric,REPLACE(U_GPBD,',','')) != PriceAfVAT AND T3.position IN (1,3,10) )
			BEGIN
				SET @error=31
				SET @error_message =N'An approval is required for prices below cost. Set the Below Cost Approval field to “Y”.'
			END
		END

	END
--SALES QOUTATION END-----------------------------------------------------------------------------------------------------------------------------------------------------------------


-- Validation for Sales Order


    --To block user Cancellation in Sales Order
 If (@object_type = '17') and (@transaction_type in ('C'))

 BEGIN
    
      -- Only allowed user can cancel document
        IF (SELECT U_USERIDINFO FROM ORDR WHERE DOCENTRY = @list_of_cols_val_tab_del) <> 'Y'
        BEGIN
        IF NOT EXISTS (SELECT DISTINCT T0.DocENTry FROM ORDR T0 INNER JOIN dbo.[@REASONCODE] T1 ON T0.U_USERIDINFO = T1.U_UserPosition WHERE T0.DocEntry = @list_of_cols_val_tab_del  AND T1.U_MktgDoc = 'SO' AND T0.CANCELED <> 'N' )
         BEGIN
		       SET @error = 1
		       SET @error_message = N'Only allowed User(s) can cancel this document.'
	       END
        END

    --To block user if Reason Code is Empty
    If NOT EXISTS (select T0.DocEntry FROM ORDR T0	where T0.CANCELED = 'Y'  AND T0.DocEntry = @list_of_cols_val_tab_del AND T0.U_ReasonCancelCode IS NOT NULL)
	      BEGIN
		      SET @error = 2
		      SET @error_message = N'Reason Code for cancellation  is required (SO).'
	      END

  End


IF @object_type = '17' AND (@transaction_type='A' OR @transaction_type='U')
      BEGIN   

		--To Check if Document Series is generated
		IF exists (SELECT DocNum FROM ORDR WHERE [DocNum]=@list_of_cols_val_tab_del 
		AND (U_DocSeries LIKE '%N/A%' OR (U_DocSeries IS NULL OR U_DocSeries ='')))
		BEGIN
			SET @error=1
			SET @error_message =N'Document Series must be provided in this transaction.'
		END

		--To Check if there is duplicated Document Series
		SELECT @vDocSeries = U_DocSeries FROM ORDR WHERE DocNum=@list_of_cols_val_tab_del 

		IF (SELECT COUNT(U_DocSeries) FROM ORDR WHERE DocNum <> @list_of_cols_val_tab_del AND U_DocSeries=@vDocSeries AND CANCELED='N') > 0
		BEGIN
			SET @error=2
			SET @error_message =N'Duplicate document series is not allowed.'
		END

	  --To ensure that the user should select at least one payment mode and releasing mode for Sales and Back Order (User Defined-Fields)
		   IF exists (SELECT T0.DocEntry FROM ORDR T0  WHERE T0.DocEntry=@list_of_cols_val_tab_del 
		   AND (T0.[U_SO_Cash]='N' AND T0.[U_BO_Cash]='N' AND T0.[U_BO_CC]= 'N' AND T0.[U_BO_DC]='N'  AND T0.[U_BO_ODC] ='N' AND T0.[U_BO_PDC] ='N'  AND T0.[U_BO_PO]='N' 
		   AND T0.[U_SO_CC] ='N' AND T0.[U_SO_COD] = 'N' AND T0.[U_SO_DC]='N' AND T0.[U_SO_ODC]='N' AND T0.[U_SO_PDC]='N' AND T0.[U_SO_PO]='N' AND T0.[U_SO_OT]='N' 
		   AND T0.[U_SO_DTC]='N' AND T0.[U_SO_CM]='N' AND T0.[U_BO_OT]='N'  AND T0.[U_SO_HO]='N' AND T0.[U_BO_HO]='N' AND T0.[U_BO_COD]='N'))
		   BEGIN
				SET @error=3
				SET @error_message =N'Select at least one mode of payment for Sales Order or Back Order.'
		   END
		   ELSE IF exists(SELECT T0.DocEntry FROM ORDR T0  INNER JOIN OCRD T1 ON T0.CardCode=T1.CardCode
		   WHERE T0.DocEntry=@list_of_cols_val_tab_del AND T1.GroupCode != 167  AND 
		   (T0.[U_SO_DO]='N' AND T0.[U_SO_DS]='N' AND T0.[U_SO_PKO]='N' AND T0.[U_SO_PKS] ='N' AND T0.[U_BO_DO]='N' AND T0.[U_BO_DS] ='N' 
		   AND T0.[U_BO_PKO] ='N'  AND T0.[U_BO_PKS]='N'  AND T0.[U_BO_DRS]='N' AND T0.U_BO_DSDD='N' AND T0.U_BO_DSDV='N' AND T0.U_BO_DSPD='N'))
		   BEGIN
				SET @error=4
				SET @error_message =N'Select at least one mode of releasing for Sales Order or Back Order.'
			END

			--To check the availability of stocks
			
			IF exists(SELECT ItemCode FROM ORDR T0 INNER JOIN RDR1 T1	
							ON T0.DocEntry=T1.DocEntry
							 WHERE T0.DocEntry=@list_of_cols_val_tab_del AND U_InvtyStatus='Out of Stocks' AND (U_BO_PKO='N' AND U_BO_PKS='N' AND U_BO_DO='N' AND U_BO_DS='N'))
			BEGIN
		
				SET @error=5
				SET @error_message =N'Insufficient quantity, please check other warehouses' 
			END   

			--To check if multiple warehouse exist in one document entry
			  IF exists (SELECT DocEntry FROM ORDR   WHERE DocEntry=@list_of_cols_val_tab_del AND DocType='I')
			  BEGIN
					SELECT @iCntWhse =  COUNT(Distinct WhsCode) FROM rdr1  WHERE DocEntry=@list_of_cols_val_tab_del
					IF @iCntWhse > 1
					BEGIN
						SET @error=6
						SET @error_message =N'Multiple warehouses in one entry are not allowed' 
					END
			  END

			  --To check if multiple store perfomance exist in one document entry
			  IF exists (SELECT DocEntry FROM ORDR  WHERE DocEntry=@list_of_cols_val_tab_del)
			  BEGIN
					SELECT @iCntWhse =  COUNT(Distinct OcrCode) FROM rdr1  WHERE DocEntry=@list_of_cols_val_tab_del
					IF @iCntWhse > 1
					BEGIN
						SET @error=7
						SET @error_message =N'Multiple store performance is not allowed.' 
					END
			  END

			--To ensure that the card related paymemt is not applicable for discounting
			  IF exists (SELECT T0.DocEntry FROM ORDR T0 INNER JOIN OCRD T1 
						ON T0.CardCode=T1.CardCode INNER JOIN RDR1 T2
						ON T0.DocNum=T2.DocEntry
						WHERE T0.DocEntry=@list_of_cols_val_tab_del AND (T0.[U_SO_CC]= 'Y' OR T0.[U_SO_DC]='Y' OR T0.[U_BO_CC]= 'Y' OR T0.[U_BO_DC]='Y') AND T2.Dscription NOT LIKE '%DELIVERY CHARGE%')
			  BEGIN
					SELECT @fSumDisc =  SUM(T0.DiscPrcnt) FROM RDR1 T0  WHERE T0.DocEntry=@list_of_cols_val_tab_del
					IF @fSumDisc > 0 
					BEGIN
						SET @error=8
						SET @error_message =N'Credit Card is not applicable for discounting.' 
					END
			  END

			  ----To ensure that the charge on account po and pdc is not applicable for discounting
			  --IF exists (SELECT T0.DocEntry FROM ORDR T0 INNER JOIN OCRD T1 ON T0.CardCode=T1.CardCode  WHERE T0.DocEntry=@list_of_cols_val_tab_del AND (T0.[U_SO_PO]= 'Y' OR T0.[U_SO_PDC]='Y' OR T0.[U_BO_PO]= 'Y' OR T0.[U_BO_PDC]='Y') AND T1.U_AllowedDisc='N')
			  --BEGIN
					--SELECT @fSumDisc =  SUM(T0.DiscPrcnt) FROM RDR1 T0  WHERE T0.DocEntry=@list_of_cols_val_tab_del
					--IF @fSumDisc > 0 
					--BEGIN
					--	SET @error=9
					--	SET @error_message =N'Charge on Account (PO/PDC) is not applicable for discounting.' 
					--END
			  --END

			--To ensure that the Back Order is separate from Sales Order
			IF exists (SELECT T0.DocEntry FROM ORDR T0  WHERE T0.DocEntry=@list_of_cols_val_tab_del 
			AND ((T0.[U_BO_Cash]='Y' OR T0.[U_BO_CC]= 'Y' OR T0.[U_BO_DC]='Y' OR T0.[U_BO_ODC] ='Y' OR T0.[U_BO_PDC] ='Y'  OR T0.[U_BO_PO]='Y' OR T0.[U_BO_OT]='Y'  OR T0.[U_BO_COD]='Y' OR T0.[U_BO_HO]='Y')
			OR (T0.[U_BO_DO]='Y' OR T0.[U_BO_DS] ='Y' OR T0.[U_BO_PKO] ='Y'  OR T0.[U_BO_PKS]='Y' OR T0.[U_BO_DRS]='Y' OR T0.U_BO_DSDD='Y' OR T0.U_BO_DSDV='Y' OR T0.U_BO_DSPD='Y'))
			AND ((T0.[U_SO_Cash]='Y' OR T0.[U_SO_CC] ='Y' OR T0.[U_SO_COD] = 'Y' OR T0.[U_SO_DC]='Y' OR T0.[U_SO_ODC]='Y' OR T0.[U_SO_PDC]='Y' OR T0.[U_SO_PO]='Y' OR T0.[U_SO_OT]='Y' OR T0.[U_SO_DTC]='Y' OR T0.[U_SO_CM]='Y' OR T0.[U_SO_HO]='Y')
			OR (T0.[U_SO_DO]='Y' OR T0.[U_SO_DS]='Y' OR T0.[U_SO_PKO]='Y' OR T0.[U_SO_PKS] ='Y')))
			BEGIN
					SET @error=10
					SET @error_message =N'Mode of Payment and Releasing for Back Order should not be mixed with the Sales Order'
			END

			--To ensure that the warehouse selected in Sales Order for ARDPI is different from default warehouse
			IF exists (SELECT T0.DocEntry FROM ORDR T0  WHERE T0.DocEntry=@list_of_cols_val_tab_del AND (T0.[U_SO_PKO]= 'Y' OR T0.[U_SO_DO]='Y' OR T0.[U_BO_PKO]= 'Y' OR T0.[U_BO_DO]='Y'))
			BEGIN
					 SELECT @iOwnerCode = OwnerCode  FROM ORDR WHERE DocEntry=@list_of_cols_val_tab_del

					 SELECT @iEmpID = userid FROM ohem WHERE empID = @iOwnerCode

					 SELECT @vDfltWhse = t2.Warehouse FROM OHEM T0 INNER JOIN OUSR T1
					 ON T0.userId=T1.USERID INNER JOIN OUDG T2
					 ON T1.DfltsGroup=T2.Code WHERE T0.userId=@iEmpID

					 IF @vDfltWhse IS NULL
					 BEGIN
							SELECT @vDfltWhse=DflWhs FROM OBPL WHERE BPLId=3
					 END

					 IF EXISTS (SELECT WhsCode FROM RDR1 WHERE DocEntry=@list_of_cols_val_tab_del AND WhsCode=@vDfltWhse)
					 BEGIN
							SET @error=11
							SET @error_message =N'Invalid warehouse code for pick up/delivery from other store or warehouse.'
					 END
			END

			--To ensure that the warehouse selected in Sales Order for standard Sales Invoicing should be the same with Sales Clerk's default warehouse
			IF exists (SELECT T0.DocEntry FROM ORDR T0  WHERE T0.DocEntry=@list_of_cols_val_tab_del AND (T0.[U_SO_PKS]= 'Y' OR T0.[U_SO_DS]='Y' OR T0.[U_BO_PKS]= 'Y' OR T0.[U_BO_DS]='Y'))
			BEGIN
					 SELECT @iOwnerCode = OwnerCode  FROM ORDR WHERE DocEntry=@list_of_cols_val_tab_del

					 SELECT @iEmpID = userid FROM ohem WHERE empID = @iOwnerCode

					 SELECT @vDfltWhse = t2.Warehouse FROM OHEM T0 INNER JOIN OUSR T1
					 ON T0.userId=T1.USERID INNER JOIN OUDG T2
					 ON T1.DfltsGroup=T2.Code WHERE T0.userId=@iEmpID

					 IF @vDfltWhse IS NULL
					 BEGIN
							SELECT @vDfltWhse=DflWhs FROM OBPL WHERE BPLId=3
					 END

					 SET @vMainWhse = (LEFT((SELECT DISTINCT WhsCode FROM RDR1 WHERE DocEntry=@list_of_cols_val_tab_del),6))
					 SET @vExtWhse =  (LEFT((SELECT T3.U_WhseExt FROM OHEM T0 INNER JOIN OUSR T1 ON T0.userId=T1.USERID INNER JOIN OUDG T2 ON T1.DfltsGroup=T2.Code INNER JOIN OWHS T3 ON T2.Warehouse=T3.WhsCode AND T1.DfltsGroup=T2.Code WHERE T0.empID =  @iOwnerCode),6))

					 IF @vMainWhse != LEFT(@vDfltWhse,6) AND @vMainWhse != CASE WHEN @vExtWhse IS NULL THEN '' ELSE @vExtWhse END
					 BEGIN
							SET @error=12
							SET @error_message =N'Invalid warehouse code for standard Sales Invoicing.'
					 END
			END

             --To ensure that the Ecommerce customer has its actual customer reference no |ACDC 8/15/2023
            IF exists (SELECT T0.DocEntry FROM ORDR T0  WHERE T0.DocEntry=@list_of_cols_val_tab_del AND T0.CardCode in('C000230') AND (T0.NumAtCard = '' OR T0.NumAtCard IS NULL))
			BEGIN
					SET @error=13
					SET @error_message =N'Ecommerce-SO Ref. No. is required'
			END


            --To ensure that the Ecommerce customer has its actual customer name |ACDC 8/15/2023
            IF exists (SELECT T0.DocEntry FROM ORDR T0  WHERE T0.DocEntry=@list_of_cols_val_tab_del AND T0.CardCode in('C000230') AND (T0.U_Customer = '' OR T0.U_Customer IS NULL))
			BEGIN
					SET @error=13
					SET @error_message =N'Customer name is required'
			END
            
			--To ensure that the walk-in customer has its actual customer name
			IF exists (SELECT T0.DocEntry FROM ORDR T0  WHERE T0.DocEntry=@list_of_cols_val_tab_del AND T0.CardCode IN ('C000107','C000132','C000111','C000112','C000091') AND (T0.U_Customer = '' OR T0.U_Customer IS NULL))
			BEGIN
					SET @error=13
					SET @error_message =N'Customer Name is required'
			END

			--To ensure that the walk-in customer has its actual customer name
			IF exists (SELECT T0.DocEntry FROM ORDR T0  WHERE T0.DocEntry=@list_of_cols_val_tab_del AND T0.CardCode NOT IN ('C000107','C000132','C000111','C000112','C000091','C000230') AND (T0.U_Customer != '' OR T0.U_Customer IS NOT NULL))
			BEGIN
					SET @error=13
					SET @error_message =N'Customer Name is not required.'
			END

			--To check if the Charge on Account (PO) transaction has a Reference No. 
			IF exists (SELECT T0.DocEntry FROM ORDR T0  WHERE T0.DocEntry=@list_of_cols_val_tab_del AND (U_SO_PO='Y' OR U_BO_PO='Y') AND (T0.NumAtCard = '' OR T0.NumAtCard IS NULL))
			BEGIN
					SET @error=14
					SET @error_message =N'PO Reference No. is required'
			END

			--To check if the Customer is allow to use Charge on Account (PO)  or Charge on Account (PDC) Payment Type
			IF exists (SELECT DocNum FROM OCRD T0 INNER JOIN ORDR T1 ON T0.CardCode=T1.CardCode AND T1.DocNum=@list_of_cols_val_tab_del AND (T0.U_AllowPDC='N' AND T0.U_AllowPO='N' AND T0.U_Allowlatepayment='N') AND (T1.U_SO_PO='Y' OR T1.U_SO_PDC='Y' OR T1.U_BO_PO='Y' OR T1.U_BO_PDC='Y'))
			BEGIN
					SET @error=15
					SET @error_message =N'The Customer is not allowed to issue PO or PDC'
			END

			--To check if the Mode of Payment is valid for Cash on Delivery Customer
			IF exists (SELECT DocNum FROM ORDR INNER JOIN RDR21 ON ORDR.DocEntry = RDR21.DocEntry  WHERE DocNum=@list_of_cols_val_tab_del AND CardName = 'CASH ON DELIVERY' AND RDR21.ObjectType=17 AND RDR21.RefObjType <> 14 AND 
			((U_SO_Cash='Y' OR U_SO_CC = 'Y' OR U_SO_DC='Y' OR U_SO_DTC='Y' OR U_SO_OT='Y' OR U_SO_PO='Y' OR U_SO_PDC='Y' OR U_SO_HO='Y' OR U_SO_ODC='Y' OR U_SO_CM='Y') OR
			(U_BO_Cash='Y' OR U_BO_CC = 'Y' OR U_BO_DC='Y' OR U_BO_OT='Y' OR U_BO_PO='Y' OR U_BO_PDC='Y' OR U_BO_HO='Y' OR U_BO_ODC='Y')))
			BEGIN
					SET @error=16
					SET @error_message =N'Invalid Mode of Payment for Cash on Delivery Customer'
			END

			--To check the existency of document reference and mode of payment used for Due to Customer and Credit Memo
			IF  EXISTS(SELECT DocEntry FROM ORDR WHERE DocEntry=@list_of_cols_val_tab_del AND (U_SO_DTC='Y' or U_SO_CM='Y'))
			BEGIN
					IF NOT EXISTS (SELECT DocEntry FROM RDR21 WHERE DocEntry=@list_of_cols_val_tab_del AND ObjectType=17 AND RefObjType = 14)
					BEGIN

						SET @error=17
						SET @error_message =N'AR Credit Memo in referenced document field is required for Credit Memo or Due to Customer mode of payment.'

					END

					ELSE
					BEGIN

						--IF (SELECT COUNT(T1.DocEntry) FROM ORDR T0 INNER JOIN RDR21 T1 ON T0.DocNum=T1.DocEntry
						--WHERE T0.DocNum=@list_of_cols_val_tab_del AND (U_SO_DTC='Y' or U_SO_CM='Y') AND T1.RefObjType=14) > 1
						--BEGIN
						--		SET @error=17
						--		SET @error_message =N'Only one AR Credit Memo is required in the referenced document field.'
						--END
						--ELSE

						--BEGIN
								SELECT @iRefDoc =  T1.RefDocNum FROM ORDR T0 INNER JOIN RDR21 T1 ON T0.DocNum=T1.DocEntry
								WHERE T0.DocNum=@list_of_cols_val_tab_del AND (U_SO_DTC='Y' or U_SO_CM='Y') AND T1.RefObjType=14

								--IF (SELECT COUNT(RefDocNum) FROM RDR21 WHERE RefDocNum = @iRefDoc AND RefObjType = 14) > 1
								--BEGIN
								--		SET @error=17
								--		SET @error_message =N'AR CM in referenced document field already exist.'
								--END

								--ELSE 
								IF EXISTS (SELECT T1.DocEntry FROM ORDR T0 INNER JOIN RDR21 T1 
													ON T0.DocNum=T1.DocEntry INNER JOIN ORIN T2
													ON T1.RefDocNum=T2.DocNum
													WHERE T0.DocNum=@list_of_cols_val_tab_del AND T0.CardCode != T2.CardCode)

								BEGIN
										SET @error=17
										SET @error_message =N'Customer tagged in referenced document field should be matched with the Sales Order.'
								END
								ELSE IF (SELECT COUNT(RefDocNum) FROM RDR21 INNER JOIN ORDR ON RDR21.DocEntry = ORDR.DocEntry INNER JOIN OCRD ON OCRD.CardCode = ORDR.CardCode WHERE RDR21.DocEntry=@list_of_cols_val_tab_del AND ObjectType=17 AND RefObjType != 14 AND (OCRD.U_DC IS NULL OR OCRD.U_DC = '') ) > 0
								BEGIN
										SET @error=17
										SET @error_message =N'Select AR Credit Memo as Transaction Type in the referenced document field.'
								END
								ELSE
								BEGIN

										IF EXISTS(SELECT T1.DocEntry FROM ORDR T0 INNER JOIN RDR21 T1 
												ON T0.DocNum=T1.DocEntry INNER JOIN ORIN T2
												ON T1.RefDocNum=T2.DocNum
												WHERE T0.DocNum=@list_of_cols_val_tab_del AND T0.U_SO_DTC='Y' AND (T2.U_SO_PO='Y' OR T2.U_SO_PDC='Y' OR T2.U_SO_CM='Y' OR T2.U_SO_COD='Y' OR T2.U_SO_HO='Y'))
										BEGIN
											SET @error=17
											SET @error_message =N'Select Credit Memo as mode of payment for charge related transactions.'
										END

										ELSE IF EXISTS(SELECT T1.DocEntry FROM ORDR T0 INNER JOIN RDR21 T1 
													ON T0.DocNum=T1.DocEntry INNER JOIN ORIN T2
													ON T1.RefDocNum=T2.DocNum
													WHERE T0.DocNum=@list_of_cols_val_tab_del AND T0.U_SO_CM='Y' AND (T2.U_SO_Cash='Y' OR T2.U_SO_ODC='Y' OR T2.U_SO_CC='Y'  OR T2.U_SO_DC='Y' OR T2.U_SO_OT='Y' OR T2.U_SO_DTC='Y'))
										BEGIN
											SET @error=17
											SET @error_message =N'Select Due to Customer as mode of payment for cash related transactions.'
										END

								END
		
							--END
					END
				
			END

			--To check if there is SO Type for Distribution Center
			IF exists (SELECT T0.DocEntry FROM ORDR T0  INNER JOIN OBPL T1
						ON T0.BPLId=T1.BPLId
						WHERE T0.DocEntry=@list_of_cols_val_tab_del AND T1.U_isDC='Y' AND (T0.U_SOType = '' OR T0.U_SOType IS NULL))
			BEGIN
					SET @error=18
					SET @error_message =N'Transaction Type is required.'
			END

			--To check the existency of PO as referenced document in Sales order from Distribution Center for Store Stocks Replenishment
			IF  EXISTS(SELECT DocEntry FROM ORDR WHERE DocEntry=@list_of_cols_val_tab_del AND U_SOType='SR')
				OR EXISTS(SELECT T0.DocEntry FROM ORDR T0 INNER JOIN OCRD T1 ON T0.CardCode=T1.CardCode
						WHERE T0.DocEntry=@list_of_cols_val_tab_del AND (U_SOType='DC' OR U_SOType='PC') AND (T1.U_DC IS NOT NULL OR T1.U_DC !=''))
			BEGIN
					IF NOT EXISTS (SELECT DocEntry FROM RDR21 WHERE DocEntry=@list_of_cols_val_tab_del AND ObjectType=17 AND RefObjType = 22)
					BEGIN

						SET @error=19
						SET @error_message =N'PO in referenced document field is required.'

					END

					ELSE
					BEGIN

						IF (SELECT COUNT(RefDocNum) FROM RDR21 WHERE DocEntry=@list_of_cols_val_tab_del AND ObjectType=17 AND RefObjType = 22) > 1
						BEGIN
								SET @error=19
								SET @error_message =N'Only one PO in referenced document is allowed.'
						END
						ELSE IF (SELECT COUNT(RefDocNum) FROM RDR21 INNER JOIN ORDR ON RDR21.DocEntry = ORDR.DocEntry INNER JOIN OCRD ON OCRD.CardCode = ORDR.CardCode WHERE RDR21.DocEntry=@list_of_cols_val_tab_del AND ObjectType=17 AND RefObjType != 22 AND (OCRD.U_DC IS NULL OR OCRD.U_DC = '') ) > 0
						BEGIN
								SET @error=19
								SET @error_message =N'Select PO as Transaction Type in the referenced document field.'
						END

					END
				
			END
					
			--To require to set up Drop Ship Warehouse for Drop Ship Mode of Releasing
			IF exists (SELECT T0.DocEntry FROM ORDR T0 INNER JOIN RDR1 T1 ON T0.DocNum=T1.DocEntry
			  WHERE T0.DocEntry=@list_of_cols_val_tab_del AND (T0.[U_BO_DRS]='Y' OR T0.U_BO_DSDD='Y' OR T0.U_BO_DSDV='Y' OR T0.U_BO_DSPD='Y') AND (RIGHT(T1.WhsCode,2) != 'DS'))
			BEGIN
					SET @error=21
					SET @error_message =N'Non-Drop Ship warehouse should not be selected for this mode of releasing.'
			END

			--To require to set up Non-Drop Ship Warehouse for Non-Drop Ship Mode of Releasing
			IF exists (SELECT T0.DocEntry FROM ORDR T0 INNER JOIN RDR1 T1 ON T0.DocNum=T1.DocEntry
			  WHERE T0.DocEntry=@list_of_cols_val_tab_del AND (T0.[U_BO_DRS] !='Y' AND T0.U_BO_DSDD !='Y' AND T0.U_BO_DSDV !='Y' AND T0.U_BO_DSPD !='Y') AND (RIGHT(T1.WhsCode,2) = 'DS'))
			BEGIN
					SET @error=21
					SET @error_message =N'Drop Ship warehouse should not be selected for this mode of releasing.'
			END

			--To require selecting Distribution Center if the mode of releasing is Drop Ship Pick Up-DC or Drop Ship Delivery-DC
			IF EXISTS(SELECT DocNum FROM ORDR WHERE DocNum=@list_of_cols_val_tab_del AND (U_BO_DSDD='Y' OR U_BO_DSPD='Y') AND (U_DC='' OR U_DC IS NULL))
			BEGIN
					SET @error=22
					SET @error_message =N'Distribution Center should not be empty.'
			END
			ELSE IF EXISTS(SELECT DocNum FROM ORDR WHERE DocNum=@list_of_cols_val_tab_del AND (U_BO_DSDD='N' AND U_BO_DSPD='N') AND (U_DC!='' OR U_DC IS NOT NULL))
			BEGIN
					SET @error=22
					SET @error_message =N'Distribution Center should be empty.'
			END

			--To check that only 5 line items are allowed for Sales Order
			IF (SELECT COUNT (LineNum) FROM RDR1  WHERE DocEntry=@list_of_cols_val_tab_del) > 5
			BEGIN
					SET @error=23
					SET @error_message =N'Only five (5) line items are allowed for Sales Order.'
			END

			--To check if theres only one Mode of Releasing selected from SO/BO
			IF (SELECT (CASE WHEN U_SO_PKS = 'Y' THEN 1 ELSE 0 END ) +
					   (CASE WHEN U_SO_PKO = 'Y' THEN 1 ELSE 0 END ) +
					   (CASE WHEN U_SO_DS = 'Y' THEN 1 ELSE 0 END ) +
					   (CASE WHEN U_SO_DO = 'Y' THEN 1 ELSE 0 END ) +
					   (CASE WHEN U_BO_PKS = 'Y' THEN 1 ELSE 0 END ) +
					   (CASE WHEN U_BO_PKO = 'Y' THEN 1 ELSE 0 END ) +
					   (CASE WHEN U_BO_DS = 'Y' THEN 1 ELSE 0 END ) +
					   (CASE WHEN U_BO_DO = 'Y' THEN 1 ELSE 0 END ) +
					   (CASE WHEN U_BO_DRS = 'Y' THEN 1 ELSE 0 END ) +
					   (CASE WHEN U_BO_DSDD = 'Y' THEN 1 ELSE 0 END ) +
					   (CASE WHEN U_BO_DSDV= 'Y' THEN 1 ELSE 0 END ) +
					   (CASE WHEN U_BO_DSPD = 'Y' THEN 1 ELSE 0 END )
				FROM ORDR WHERE DocEntry=@list_of_cols_val_tab_del) > 1
			BEGIN
					SET @error=24
					SET @error_message =N'Select only one(1) Mode of Releasing.'
			END

			----To check if the amount discounted for SC/PWD is correct
			IF EXISTS(SELECT DocNum FROM ORDR WHERE DocNum=@list_of_cols_val_tab_del AND CardCode='C000112' AND U_SCPWD <> ROUND(ROUND((DocTotal/1.12),2) * 0.05,2) AND CANCELED='N')
			BEGIN
			
				SET @error=25
				SET @error_message =N'SC/PWD Discount computation is incorrect.'

			END

			--To require discount for Senior Citizen/PWD
			IF EXISTS(SELECT DocNum FROM ORDR WHERE DocNum=@list_of_cols_val_tab_del AND CardCode='C000112' AND (U_SCPWD=0 OR U_SCPWD IS NULL) AND CANCELED='N')
			BEGIN
			
				SET @error=26
				SET @error_message =N'SC/PWD Discount is required.'

			END

			--To ensure that a Non-Senior Citizen/PWD cannot avail discounts
			IF EXISTS(SELECT DocNum FROM ORDR WHERE DocNum=@list_of_cols_val_tab_del AND CardCode != 'C000112' AND U_SCPWD > 0 AND CANCELED='N')
			BEGIN
			
				SET @error=27
				SET @error_message =N'SC/PWD Discount is not allowed.'

			END

			--To check if the item is valid forf SC/PWDS Discounting
			IF EXISTS(SELECT T0.DocNum FROM ORDR T0 INNER JOIN RDR1 T1
					  ON T0.DocEntry=T1.DocEntry
					  WHERE T0.DocNum=@list_of_cols_val_tab_del  AND  CardCode='C000112' AND T1.ItemCode NOT IN (SELECT ItemCode FROM OSPP WHERE CardCode='C000112') AND CANCELED='N')
			BEGIN
			
				SET @error=28
				SET @error_message =N'Some items are not applicable for discounting.'

			END

			--To check if the SC/PWD customer has SC/PWD ID No.
			IF EXISTS(SELECT DocNum FROM ORDR 
					  WHERE DocNum=@list_of_cols_val_tab_del  AND  CardCode='C000112' AND (U_OscaPwd = '' OR U_OscaPwd IS NULL))
			BEGIN
			
				SET @error=29
				SET @error_message =N'Senior Citizen/PWD ID No. is required.'

			END

			--To check if the Walk-In_WTax customer has TIN and Address.
			IF EXISTS(SELECT DocNum FROM ORDR 
					  WHERE DocNum=@list_of_cols_val_tab_del AND CardCode='C000111' AND (U_ALIAS_VENDOR = '' OR U_ALIAS_VENDOR IS NULL OR U_TIN = '' OR U_TIN IS NULL OR U_ADDRESS='' OR U_ADDRESS IS NULL))
			BEGIN
			
				SET @error=30
				SET @error_message =N'Name, TIN and Address is required.'

			END

			--To check if the Price is zero
			IF EXISTS(SELECT DocEntry FROM RDR1						
						WHERE DocEntry=@list_of_cols_val_tab_del AND ((U_GPBD='0.00' OR U_GPBD='' OR U_GPBD IS NULL) OR PriceAfVAT=0))
			BEGIN
			
				SET @error=31
				SET @error_message =N'Selling Price before and after discount is required.'

			END

			-- --To check if the Sales Employee is empty
			-- IF EXISTS(SELECT DocNum FROM ORDR						
			-- 			WHERE DocEntry=@list_of_cols_val_tab_del AND SlpCode=-1)
			-- BEGIN
			
			-- 	SET @error=31
			-- 	SET @error_message =N'Sales Employee is required.'

			-- END

            -- BRYLE 07/06/2022
            --To check if the Sales Employee is empty
			IF EXISTS(SELECT DocNum FROM ORDR						
						WHERE DocEntry=@list_of_cols_val_tab_del AND (U_slp_name is null or U_slp_name = ''))
			BEGIN
			
				SET @error=31
				SET @error_message =N'Sales Employee is required.'

			END
            -- BRYLE 07/06/2022

			--To check the price discount approval
			IF EXISTS(SELECT DocNum FROM ORDR T0 INNER JOIN OCRD T1
						  ON T0.CardCode=T1.CardCode INNER JOIN RDR1 T2
						  ON T0.DocNum=T2.DocEntry INNER JOIN OHEM T3
						  ON T0.OwnerCode=T3.empID
						  WHERE T0.DocNum=@list_of_cols_val_tab_del AND T2.U_BelowVolDisc='Y' AND T2.U_BelowCost='N'
						  AND T0.U_BelCostAp='N' AND T0.U_PriceApproval='N' AND T3.position = 1 AND T2.BaseRef =''
						  AND T2.Dscription NOT LIKE '%DELIVERY CHARGE%')
			BEGIN
			
				SET @error=31
				SET @error_message =N'An approval is required for prices below the allowable discount. Set the Price Discount Approval field to “Y”.'

			END
			ELSE IF EXISTS(SELECT DocNum FROM ORDR T0 INNER JOIN OCRD T1
						  ON T0.CardCode=T1.CardCode INNER JOIN RDR1 T2
						  ON T0.DocNum=T2.DocEntry INNER JOIN OHEM T3
						  ON T0.OwnerCode=T3.empID							
						  WHERE T0.DocNum=@list_of_cols_val_tab_del AND T1.U_AllowedDisc='N' AND T1.U_Allowlatepayment='N' AND (T0.U_SO_PO = 'Y' OR  T0.U_SO_PDC = 'Y' OR T0.U_BO_PO ='Y' OR T0.U_BO_PDC ='Y')
						  AND T2.DiscPrcnt > 0 AND T0.U_PriceApproval='N' AND T0.U_BelCostAp='N' AND T3.position = 1 AND T2.BaseRef =''  AND T2.Dscription NOT LIKE '%DELIVERY CHARGE%' AND RIGHT(T2.WhsCode,2) != '%DS%')
			BEGIN
			
				SET @error=31
				SET @error_message =N'An approval is required for prices below the allowable discount. Set the Price Discount Approval field to “Y”-.'

			END
            
			--To check if the Selling Price is lower than the Item Cost
			IF EXISTS(SELECT DocEntry FROM RDR1 WHERE DocEntry = @list_of_cols_val_tab_del AND CONVERT(numeric,REPLACE(U_GPBD,',','')) != PriceAfVAT)
			BEGIN
				IF EXISTS(SELECT DocNum FROM ORDR T0 INNER JOIN RDR1 T1
								ON T0.DocNum=T1.DocEntry INNER JOIN OHEM T2
								ON T0.OwnerCode=T2.empID	
								WHERE T0.DocNum=@list_of_cols_val_tab_del AND T1.U_BelowCost='Y' AND T0.U_BelCostAp='N'
								AND CONVERT(numeric,REPLACE(U_GPBD,',','')) != PriceAfVAT AND T2.position IN (1,3,10) AND T1.BaseRef ='' AND T1.Dscription NOT LIKE '%DELIVERY CHARGE%' AND RIGHT(T1.WhsCode,2) != 'DS')
				BEGIN
					SET @error=31
					SET @error_message =N'An approval is required for prices below cost. Set the Below Cost Approval field to “Y”.'
				END
			END
        
			--To check if there are Multiple Vendor Code for Drop Ship transactions
			IF (SELECT COUNT(DISTINCT U_Vendor) FROM RDR1 T0 INNER JOIN OWHS T1
				ON T0.WhsCode=T1.WhsCode
				WHERE DocEntry = @list_of_cols_val_tab_del AND T1.DropShip='Y' AND T0.Dscription NOT LIKE '%DELIVERY CHARGE%') > 1
			BEGIN
					SET @error=31
					SET @error_message =N'Multiple Vendor for Drop Ship transaction is not allowed.'
			END

			--To check if there is supplier assigned for drop ship order								
			IF EXISTS(SELECT T0.DocEntry FROM RDR1 T0 INNER JOIN OWHS T1		
				ON T0.WhsCode=T1.WhsCode	
				WHERE DocEntry = @list_of_cols_val_tab_del AND T1.DropShip='Y' AND (T0.U_Vendor IS NULL OR T0.U_Vendor ='') AND T0.Dscription NOT LIKE '%DELIVERY CHARGE%') 	
			BEGIN		
					SET @error=31
					SET @error_message =N'Vendor for Drop Ship transaction is required.'
			END	
			
			--To check if the SO for drop ship has a reference document (PR) for the items without SO baseref
			SELECT DISTINCT @iBaseRef = DocEntry FROM RDR1 WHERE DocEntry=@list_of_cols_val_tab_del AND RIGHT(WhsCode,2) = 'DS'
			SELECT DISTINCT @iDocNum=DocEntry FROM PRQ1 WHERE BaseRef = @iBaseRef AND BaseType=17

			IF EXISTS(SELECT DISTINCT DocEntry FROM PRQ1 WHERE DocEntry = @iDocNum AND BaseType=-1)
			BEGIN
			
					IF NOT EXISTS (SELECT DocEntry FROM RDR21 WHERE DocEntry=@list_of_cols_val_tab_del AND ObjectType=  17 AND RefObjType = 1470000113)
					BEGIN

						SET @error=19
						SET @error_message =N'PR in referenced document field is required.'

					END

					ELSE
					BEGIN

						IF (SELECT COUNT(T1.DocEntry) FROM ORDR T0 INNER JOIN RDR21 T1 ON T0.DocNum=T1.DocEntry
						WHERE T0.DocNum=@list_of_cols_val_tab_del AND T1.RefObjType=1470000113) > 1
						BEGIN
								SET @error=19
								SET @error_message =N'Only one PR is required in the referenced document field.'
						END
						ELSE
						BEGIN
								SELECT @iRefDoc =  T1.RefDocNum FROM ORDR T0 INNER JOIN RDR21 T1 ON T0.DocNum=T1.DocEntry
								WHERE T0.DocNum=@list_of_cols_val_tab_del AND T1.RefObjType=1470000113

								IF (SELECT COUNT(RefDocNum) FROM RDR21 WHERE RefDocNum = @iRefDoc AND RefObjType = 1470000113) > 1
								BEGIN
										SET @error=19
										SET @error_message =N'PR in referenced document field already exist.'
								END
								ELSE IF (SELECT COUNT(RefDocNum) FROM RDR21 WHERE DocEntry=@list_of_cols_val_tab_del AND ObjectType=17 AND RefObjType != 1470000113) > 0
								BEGIN
										SET @error=19
										SET @error_message =N'Select PR as Transaction Type in the referenced document field.'
								END

							END
					END
				
			END

			--To check if the Procure Non Drop-Ship Items was checked for Back Order transactions
			IF EXISTS(SELECT DocEntry FROM ORDR						
						WHERE DocEntry=@list_of_cols_val_tab_del AND (U_BO_PKS='Y' OR  U_BO_PKO='Y' OR U_BO_DS='Y' OR U_BO_DO='Y') AND PoPrss='N')
			BEGIN
			
				SET @error=10
				SET @error_message =N'Procure Non Drop-Ship Items should be checked for Back Order transaction.'

			END

			--To check the Pick Up Location for Delivery Charge
			IF EXISTS(SELECT DocEntry FROM RDR1 WHERE DocEntry=@list_of_cols_val_tab_del AND U_PickUpLoc='WHS')
			BEGIN
				IF EXISTS(SELECT DocEntry FROM RDR1 WHERE DocEntry=@list_of_cols_val_tab_del AND Dscription LIKE '%DELIVERY CHARGE%' AND U_PickUpLoc !='WHS')
				BEGIN
					SET @error=31
					SET @error_message =N'Select Warehouse as Pick up Location for transactions with delivery charges.'
				END
			END

			--To check the Pick Up Location for Extended Warehouse
			IF EXISTS(SELECT DocEntry FROM RDR1 T0 WHERE DocEntry=@list_of_cols_val_tab_del AND WhsCode IN (SELECT T1.U_WhseExt FROM OWHS T1 WHERE  T1.U_WhseExt =T0.WhsCode) AND T0.U_PickUpLoc !='WHS')
			BEGIN
					SET @error=31
					SET @error_message =N'Select Warehouse as Pick.Up Location'
			END

			--To check the Price Rounding Off
			IF EXISTS(SELECT DocNum FROM ORDR T0 INNER JOIN OCRD T1
						ON T0.CardCode=T1.CardCode
						WHERE T0.DocEntry=@list_of_cols_val_tab_del AND CONVERT(int, (Doctotal % 1) * 100)  NOT IN (25,50,75,0) 
						AND (T1.U_DC IS NULL OR T1.U_DC =''))
				
			BEGIN
				SET @error=31
				SET @error_message =N'Invalid price rounding off.'
			END

			--To check if the drop ship transaction is set into selling area - pick up location
			IF EXISTS(SELECT DocNum FROM ORDR T0 INNER JOIN RDR1 T1 ON T0.DocNum=T1.DocEntry
					 WHERE DocNum=@list_of_cols_val_tab_del AND CANCELED = 'N'AND T1.U_PickUpLoc='WHS' AND (U_BO_DSDD='Y' OR U_BO_DSDV='Y' OR U_BO_DSPD='Y' OR U_BO_DS='Y'))
			BEGIN
					SET @error=11
					SET @error_message = N'Warehouse pick up location is not allowed for Drop Ship transaction.'
			END


			--To check the price volume disc - 70% and above
			IF EXISTS(SELECT DocEntry FROM RDR1 WHERE DocEntry=@list_of_cols_val_tab_del AND Dscription NOT LIKE '%DELIVERY CHARGE%'  AND  (((PriceAfVAT- U_VolDiscPrice)/PriceAfVAT) * 100) >= 70)
			BEGIN
				SET @error=31
				SET @error_message =N'Invalid default volume discount price, re-entry the related item.'
			END

						--To check if the trucker was set up for drop ship / back order transactions
			IF EXISTS(SELECT DocNum FROM ORDR
						WHERE DocNum =  @list_of_cols_val_tab_del AND (U_BO_DO='Y' OR U_BO_DS ='Y' OR U_BO_PKO ='Y'  OR U_BO_PKS='Y'  OR U_BO_DRS='Y' 
						OR U_BO_DSDD='Y' OR U_BO_DSDV='Y' OR U_BO_DSPD='Y') AND U_Trucker='N/A')
			BEGIN
		
				SET @error=5
				SET @error_message =N'Trucker for Drop Ship/Back Order is required.' 
			
			END
			ELSE IF EXISTS(SELECT DocNum FROM ORDR
						WHERE DocNum =  @list_of_cols_val_tab_del AND (U_BO_DO='N' AND U_BO_DS ='N' AND U_BO_PKO ='N'  AND U_BO_PKS='N'  AND U_BO_DRS='N' 
						AND U_BO_DSDD='N' AND U_BO_DSDV='N' AND U_BO_DSPD='N') AND U_Trucker!='N/A')
			BEGIN
		
				SET @error=5
				SET @error_message =N'Trucker for Drop Ship/Back Order is not required.' 
			END  

			--To check if the drop ship items tagged as Required for Back Order was set into back order mode of payment
			SELECT @iCntBO = COUNT(T0.DocNum) FROM ORDR T0 INNER JOIN RDR1 T1
			ON T0.DocNum=T1.DocEntry
			WHERE T0.DocNum=@list_of_cols_val_tab_del AND 
			(T0.U_BO_DSDD='Y' OR T0.U_BO_DSDV='Y' OR T0.U_BO_DSPD='Y' OR T0.U_BO_DRS='Y')
			AND T1.U_ReqBO='Y'
			
			SELECT @iCntNBO = COUNT(T0.DocNum) FROM ORDR T0 INNER JOIN RDR1 T1
			ON T0.DocNum=T1.DocEntry
			WHERE T0.DocNum=@list_of_cols_val_tab_del AND 
			(T0.U_BO_DSDD='Y' OR T0.U_BO_DSDV='Y' OR T0.U_BO_DSPD='Y' OR T0.U_BO_DRS='Y')
			AND T1.U_ReqBO='N'

			IF @iCntBO > 0 AND @iCntNBO = 0
			BEGIN
				SET @error=5
				SET @error_message =N'Back Order is Required.' 
			END
			ELSE IF @iCntBO > 0 AND @iCntNBO > 0
			BEGIN
				SET @error=5
				SET @error_message =N'Some items is required for Back Order, please create another entry.' 
			END

			--To check if there is an items tagged as Not Required for Back Order mixed the with items tagged as Required for Back Order for back order transaction
			SELECT @iCntBO = COUNT(T0.DocNum) FROM ORDR T0 INNER JOIN RDR1 T1
			ON T0.DocNum=T1.DocEntry 
			WHERE T0.DocNum=@list_of_cols_val_tab_del AND 
			(T0.U_BO_DSDD='N' AND T0.U_BO_DSDV='N' AND T0.U_BO_DSPD='N' AND T0.U_BO_DRS='N')
			AND T1.U_ReqBO='Y'
			
			SELECT @iCntNBO = COUNT(T0.DocNum) FROM ORDR T0 INNER JOIN RDR1 T1
			ON T0.DocNum=T1.DocEntry 
			WHERE T0.DocNum=@list_of_cols_val_tab_del AND 
			(T0.U_BO_DSDD='N' AND T0.U_BO_DSDV='N' AND T0.U_BO_DSPD='N' AND T0.U_BO_DRS='N')
			AND T1.U_ReqBO='N'

			IF @iCntBO > 0 AND @iCntNBO > 0
			BEGIN
				SET @error=5
				SET @error_message =N'Some items for Back Order are below cost, please create another entry.' 
			END

			--To block Senior Citizen/PWD that exceeds allowable purchase amount of 750.00 per week
			IF exists(SELECT DocNum FROM ORDR WHERE DocEntry=@list_of_cols_val_tab_del AND CardCode='C000112') 	 
			BEGIN
				DECLARE @scID AS VARCHAR(50), @allowAmt FLOAT, @consumeAmt FLOAT, @curAmt FLOAT,@total FLOAT,
						@curDateNo INT, @wkFromNo INT, @wkToNo INT, @i INT,
						@dateFrom DATETIME, @dateTo DATETIME, @curDate DATETIME

				SET @allowAmt = 750
				SET @consumeAmt = 0
				SET @total = 0
				SELECT @scID = U_OscaPwd, @curDate = DocDate, @curAmt = U_SCPWD FROM ORDR WHERE DocEntry=@list_of_cols_val_tab_del
				SET @wkFromNo = 2
				SET @wkToNo = 7
				SET @i = -1
				SET @curDateNo = DATEPART(DW,@curDate)
				
				IF @curDateNo = @wkFromNo BEGIN
					SET @dateFrom = @curDate
					SET @dateTo = DATEADD(D,5,@curDate)
				END ELSE IF @curDateNo = @wkToNo BEGIN
					SET @dateFrom = DATEADD(D,-5,@curDate)
					SET @dateTo = @curDate
				END ELSE BEGIN 
					WHILE @curDateNo >= @wkFromNo BEGIN
						SET @i=@i+1
						SET @curDateNo=@curDateNo-1
					END 
					SET @dateFrom = DATEADD(D,@i*-1,@curDate)
					SET @i=-1
					SET @curDateNo = DATEPART(DW,@curDate)

					WHILE @curDateNo <= @wkToNo BEGIN
						SET @i=@i+1
						SET @curDateNo=@curDateNo+1
					END 
					SET @dateTo = DATEADD(D,@i,@curDate)
					SET @i=-1
					SET @curDateNo = DATEPART(DW,@curDate)
				END

				SET @dateFrom = CAST(CONVERT(VARCHAR(10),@dateFrom,101)AS DATETIME)
				SET @dateTo = CAST(CONVERT(VARCHAR(10),@dateTo,101)AS DATETIME)

				SELECT @consumeAmt =ISNULL(SUM(T0.U_SCPWD),0) FROM ORDR T0
				WHERE T0.CardCode='C000112' AND T0.U_OscaPwd=@scID AND DocNum <> @list_of_cols_val_tab_del AND T0.DocDate BETWEEN @dateFrom AND @dateTo

				SET @total = @consumeAmt + @curAmt
				IF @total > @allowAmt BEGIN
					SET @error=32
					SET @error_message = @scID
					SET @error_message =N'SC/PWD ID NO. "'+ @scID +'" has exceeded the weekly allowable purchase amount of Php750.00. The remaining discount is only Php' +  Format((750 - @consumeAmt),'N2') + '.'
				END

			END


    
			IF (SELECT DISTINCT TOP 1 Count(UomCode) AS UomCOde FROM RDR1 WHERE DocEntry = @list_of_cols_val_tab_del AND  FreeTxt IS NULL GROUP BY UomCode,ItemCode ORDER BY UomCOde DESC) >= 2
				BEGIN
					SET @error = 33
					SET @error_message = N'Cannot add document with the same Item Code and Uom Code.'
				END
        
			-- AC  
			-- To block Dropship whith uom not eqaul to purchasing uom
			IF  EXISTS (SELECT T0.DocEntry FROM RDR1 T0  INNER JOIN OITM T1 ON T0.ItemCode=T1.ItemCode INNER JOIN OUOM T2 ON T1.BuyUnitMsr=T2.UomName WHERE T0.DocEntry= @list_of_cols_val_tab_del AND RIGHT(WhsCode,2) = 'DS' AND T2.UomCode <> T0.UomCode )
				BEGIN
					SET @error=34
					SET @error_message =N'Invalid UOM. Use Purchasing UOM.'
				 END

            IF (SELECT COUNT(ItemCode)ctr FROM RDR1 T0 WHERE t0.DocEntry=@list_of_cols_val_tab_del GROUP BY UomCode,ItemCode,FreeTxt HAVING COUNT(ItemCode)>1)>1
			BEGIN
				SET @error = 35
				SET @error_message = N'Cannot add document with the same Item Code, Uom Code, and Freetext.'
			END


			--To Check if Sales Order is allowed for Catch-Up
			 -- DECLARE @SOWarehouse VARCHAR(10) = (SELECT DISTINCT LEFT(WhsCode,6) FROM RDR1 WHERE DocEntry = @list_of_cols_val_tab_del)
			 -- DECLARE @TodayDate AS DATE = (SELECT DISTINCT DocDate FROM ORDR WHERE DocEntry = @list_of_cols_val_tab_del)
      
			 -- IF EXISTS (SELECT DISTINCT LEFT(T0.WhsCode,6) FROM OWHS T0 WHERE T0.U_CatchUp = 'Y' AND T0.U_CatchUpDate != (SELECT DISTINCT S0.TaxDate FROM ORDR S0 WHERE S0.DocEntry = @list_of_cols_val_tab_del) AND LEFT(T0.WhsCode,6) = @SOWarehouse)
			 -- BEGIN
  			  --  SET @error=35
					  --SET @error_message =N'Adding a document that falls outside the allowed date is prohibited during catch up encoding.'	
			 -- END

    
--			  IF (SELECT DISTINCT CAST(T0.TaxDate  AS DATE) FROM ORDR T0 INNER JOIN RDR1 T1 ON T0.DocEntry = T1.DocEntry INNER JOIN OWHS T2 ON T1.WhsCode = T2.WhsCode WHERE T2.U_CatchUp = 'N' AND T0.DocEntry = @list_of_cols_val_tab_del) <> CAST(GETDATE() AS DATE)
--			  BEGIN
--  			    SET @error=36
--					  SET @error_message =N'Adding a document that falls outside the allowed date is prohibited during encoding.'
--			  END
--

			 --To check if theres only 1 line item in SO Entry for item that included in qty allocation in vendor's whse that requires LO
			IF EXISTS (SELECT T0.ItemCode FROM RDR1 T0 WHERE DocEntry=@list_of_cols_val_tab_del AND Itemcode IN (SELECT U_ItemCode FROM [@STOCKSALLOCATION] WHERE U_VendorName=T0.U_Vendor AND U_ReqLO='Y' AND U_Area=T0.U_Area))
			BEGIN
				IF (SELECT COUNT(ItemCode) FROM RDR1 WHERE DocEntry=@list_of_cols_val_tab_del AND Dscription NOT LIKE '%DELIVERY CHARGE%') > 1
				BEGIN
					SET @error=36
					SET @error_message =N'Only one item is allowed.'
				END

			END

			--To check if the item is existing in qty allocation in vendor's whse that requires LO
			IF EXISTS(SELECT DocNum FROM ORDR WHERE DocEntry=@list_of_cols_val_tab_del AND (U_SONum IS NOT NULL AND U_SONum !='') AND (U_LONum IS NOT NULL AND U_LONum !=''))
			BEGIN
	
				IF (SELECT COUNT(T0.ItemCode) FROM RDR1 T0 WHERE DocEntry=@list_of_cols_val_tab_del 
								AND T0.Itemcode NOT IN (SELECT U_ItemCode FROM [@STOCKSALLOCATION] WHERE U_VendorName=T0.U_Vendor AND U_ReqLO='Y' AND U_Area=T0.U_Area)
								AND T0.Dscription NOT LIKE '%DELIVERY CHARGE%') > 0
				BEGIN
						SET @error=36
						SET @error_message =N'Item should exist in the Stocks Allocation per Vendor Warehouse.'
				END

			END

			--To check if the Customer is branch for Stocks Replenishment and Inter-Branch DC Transactions
			IF EXISTS(SELECT T0.DocEntry FROM ORDR T0 INNER JOIN OCRD T1 ON T0.CardCode=T1.CardCode
						WHERE T0.DocEntry=@list_of_cols_val_tab_del AND (U_SOType='IB' OR U_SOType='SR') AND (T1.U_DC IS NULL OR T1.U_DC =''))
			BEGIN
					SET @error=51
					SET @error_message = N'Customer should be tagged as branch for this type of tansactions.'	
			END

			--To ensure that the Plate Number was Filled Up
			IF EXISTS (SELECT DocNum FROM ORDR T0 INNER JOIN OBPL T1 ON T0.BPLId=T1.BPLId WHERE T0.DocEntry=@list_of_cols_val_tab_del AND T1.U_isDC='Y' AND (T0.U_PltNumber IS NULL OR T0.U_PltNumber ='')) 
			BEGIN
				SET @error=10
				SET @error_message =N'Plate Number is required.'
			END

			--To ensure that the Driver was Filled Up
			IF EXISTS (SELECT DocNum FROM ORDR T0 INNER JOIN OBPL T1 ON T0.BPLId=T1.BPLId WHERE T0.DocEntry=@list_of_cols_val_tab_del AND T1.U_isDC='Y' AND (T0.U_Driver IS NULL OR T0.U_Driver ='')) 
			BEGIN
				SET @error=10
				SET @error_message =N'Driver is required.'
			END

			--To check if the quantity of LO does not match with the SO



			IF EXISTS(SELECT T0.U_LONum,T1.Quantity,T2.U_LONum,T2.U_LoadQty FROM ORDR T0 INNER JOIN 
			RDR1 T1 ON T0.DocNum=T1.DocEntry
			INNER JOIN [@SOLOREGDETAILS] T2
			ON T0.U_LONum = T2.U_LONum
			WHERE T0.DocNum=@list_of_cols_val_tab_del AND T1.Quantity <> T2.U_LoadQty AND T1.Dscription NOT LIKE '%DELIVERY CHARGE%'
			AND (SELECT COUNT(RefDocNum) From RDR21 WHERE RDR21.DocEntry = T1.DocEntry AND RDR21.RefObjType = 14) = 0 )
			BEGIN
				SET @error=10
				SET @error_message =N'Sales Order and LO quantity should be matched.'
			END

			--To check if the LO and SO number is empty for the items that included in qty allocation in vendor's whse that requires LO
			IF EXISTS(SELECT T1.DocEntry FROM RDR1 T0 INNER JOIN ORDR T1
			ON T0.DocEntry=T1.DocEntry
			WHERE T1.DocEntry=@list_of_cols_val_tab_del 
			AND T0.Itemcode IN (SELECT U_ItemCode FROM [@STOCKSALLOCATION] WHERE U_VendorName=T0.U_Vendor AND U_ReqLO='Y' AND U_Area=T0.U_Area)
			AND T0.Dscription NOT LIKE '%DELIVERY CHARGE%' AND ((T1.U_SONum IS NULL OR T1.U_SONum = '') OR (T1.U_LONum IS NULL OR T1.U_LONum = '')))
			BEGIN
					SET @error=51
					SET @error_message = N'Empty LO/SO Number is not allowed.'	
			END

			--To check if the SO-DTC created by other store for releasing
			IF EXISTS(SELECT DISTINCT T0.DocEntry FROM RDR21 T0 INNER JOIN ORIN T1
			ON T0.RefDocNum=T1.DocNum INNER JOIN RIN1 T2
			ON T1.DocNum=T2.DocEntry INNER JOIN OHEM T3
			ON T2.OwnerCode=T3.empID INNER JOIN OUSR T4
			ON T3.empID=T4.USERID INNER JOIN OUDG T5
			ON T4.DfltsGroup=T5.Code
			WHERE T0.DocEntry=@list_of_cols_val_tab_del AND LEFT(T2.WhsCode,6) <> LEFT(T5.Warehouse,6) AND T0.RefObjType=14)
			BEGIN
					SET @error=51
					SET @error_message = N'AR CM warehouse should match the users default warehouse.'	
			END
			
			--To ensure that the Broker was Filled Up
			IF EXISTS (SELECT DocNum FROM ORDR T0 INNER JOIN OBPL T1 ON T0.BPLId=T1.BPLId WHERE T0.DocEntry=@list_of_cols_val_tab_del AND T1.U_isDC='Y' AND (T0.U_BrokerCode IS NULL OR T0.U_BrokerCode ='') AND T0.U_SOType='DC') 
			BEGIN
				SET @error=10
				SET @error_message =N'Broker is required.'
			END

			--To check if the SO for stocks allocation is required for PO
			IF EXISTS (SELECT T0.DocEntry FROM RDR1 T0  INNER JOIN ORDR T1 
						ON T0.DocEntry=T1.DocNum
						WHERE T0.DocEntry=@list_of_cols_val_tab_del 
						AND T0.Itemcode IN (SELECT U_ItemCode FROM [@STOCKSALLOCATION] WHERE U_VendorName=T0.U_Vendor AND U_ReqLO='Y' AND U_Area=T0.U_Area AND U_ReqPO='Y')
						AND T0.Dscription NOT LIKE '%DELIVERY CHARGE%' AND T1.U_BO_PO ='N') 
			BEGIN
					SET @error=36
					SET @error_message =N'Charge on Account - PO mode of payment is required.'
			END

END	

--Validation for Purchase Request

-- To Block Cancellation
IF @object_type ='1470000113' AND (@transaction_type='C')

BEGIN

IF (SELECT U_USERIDINFO FROM OPRQ WHERE DOCENTRY = @list_of_cols_val_tab_del) <> 'Y'
  BEGIN
  If NOT EXISTS (SELECT T0.DocEntry FROM OPRQ T0 INNER JOIN dbo.[@REASONCODE] T1 ON T0.U_USERIDINFO = T1.U_UserPosition WHERE T0.CANCELED = 'Y'  AND T0.DocEntry = @list_of_cols_val_tab_del AND T1.U_MktgDoc = 'PR' )	
    BEGIN
      SET @error = 1
      SET @error_message = 'Only allowed user(s) can cancel this document.'
    END
  END


    If NOT EXISTS (select T0.DocEntry FROM OPRQ T0	where T0.CANCELED = 'Y'  AND T0.DocEntry = @list_of_cols_val_tab_del AND T0.U_ReasonCancelCode IS NOT NULL )	
    BEGIN
      SET @error = 2
      SET @error_message = 'Reason code is required for cancellation (PR).'    	
    END	

END



IF @object_type ='1470000113' AND (@transaction_type='A' OR @transaction_type='U')
	BEGIN

		--To check if multiple warehouse exist in one document entry
		IF exists (SELECT DocEntry FROM OPRQ WHERE DocEntry=@list_of_cols_val_tab_del AND DocType='I')
		BEGIN
			SELECT @iCntWhse =  COUNT(Distinct WhsCode) FROM PRQ1  WHERE DocEntry=@list_of_cols_val_tab_del
			IF @iCntWhse > 1
			BEGIN
				SET @error=1
				SET @error_message =N'Multiple warehouses is not allowed.' 
			END
		END
		ELSE IF exists (SELECT DocEntry FROM OPRQ  WHERE DocEntry=@list_of_cols_val_tab_del AND DocType='S')
		BEGIN
			SELECT @iCntWhse =  COUNT(Distinct OcrCode) FROM PRQ1  WHERE DocEntry=@list_of_cols_val_tab_del
			IF @iCntWhse > 1
			BEGIN
				SET @error=1
				SET @error_message =N'Multiple store performance is not allowed.' 
			END
		END

		--To check if there are Store Perfromance assigned for Service Type
		IF EXISTS(SELECT T0.DocEntry FROM OPRQ T0 INNER JOIN PRQ1 T1 ON T0.DocEntry=T1.DocEntry
					WHERE T0.DocEntry=@list_of_cols_val_tab_del AND T0.DocType='S' AND ((OcrCode = '' OR OcrCode IS NULL)))
		BEGIN
			SET @error=2
			SET @error_message = N'Store Performance is required.' 
		END
		
		--To check if there are Expenses by Function assigned for Service Type
		IF EXISTS(SELECT T0.DocEntry FROM OPRQ T0 INNER JOIN PRQ1 T1 ON T0.DocEntry=T1.DocEntry
					WHERE T0.DocEntry=@list_of_cols_val_tab_del AND T0.DocType='S' AND ((OcrCode2 = '' OR OcrCode2 IS NULL)))
		BEGIN
			SET @error=3
			SET @error_message = N'Expenses by Function is required.' 
		END

		--To check if the description field is empty for Service Type transaction
		IF EXISTS (SELECT T0.DocNum FROM OPRQ T0 INNER JOIN PRQ1 T1
		ON T0.DocNum=T1.DocEntry
		WHERE T0.DocNum=@list_of_cols_val_tab_del AND T0.CANCELED='N' AND T0.DocType='S' AND (T1.Dscription IS NULL OR T1.Dscription=''))
		BEGIN
				SET @error=4
				SET @error_message =N'Description is required.'
		END

		--To check if GL Account is empty
		IF EXISTS(SELECT T0.DocEntry FROM OPRQ T0 INNER JOIN PRQ1 T1 ON T0.DocEntry=T1.DocEntry
					WHERE T0.DocEntry=@list_of_cols_val_tab_del AND DocType='S' AND (T1.AcctCode = '' OR T1.AcctCode IS NULL) AND T0.CANCELED='N')
		BEGIN
			SET @error=5
			SET @error_message = N'G/L Account is required.' 
		END

		--To check if there's a remarks
		IF exists (SELECT DocEntry FROM OPRQ WHERE DocEntry=@list_of_cols_val_tab_del AND (Comments='' OR Comments IS NULL))
		BEGIN
			SET @error=6
			SET @error_message =N'Remarks is required.' 
		END

		-- ## Validation for Purchase Request Fixed Asset Quantity
		IF EXISTS(SELECT T0.DocEntry FROM OPRQ T0 INNER JOIN PRQ1 T1 ON T0.DocEntry=T1.DocEntry
					WHERE T0.DocEntry=@list_of_cols_val_tab_del AND T0.DocType='I' AND T1.ItemCode LIKE 'FA%' AND T1.Quantity > 1)
		BEGIN
				SET @error=7
				SET @error_message ='Quantity for Fixed Assets should not be greater than 1.' 
		END

		--To check if the store performance warehouse belongs to the assigned branch
		IF EXISTS (SELECT DISTINCT T0.DocNum FROM OPRQ T0 INNER JOIN PRQ1 T1
		ON T0.DocNum=T1.DocEntry INNER JOIN OOCR T2
		ON T1.OcrCode=T2.OcrCode INNER JOIN OWHS T3
		ON T2.U_Whse=T3.WhsCode
		WHERE T0.DocNum=@list_of_cols_val_tab_del AND T0.BPLId != T3.BPLid  AND T0.DocType='S')
		BEGIN
				SET @error=8
				SET @error_message =N'Store Performance should belongs to the assigned branch.'
		END

		--To require Fixed Asset Master Data tagging for capitalizable
		IF EXISTS (SELECT T0.DocEntry FROM OPRQ T0 INNER JOIN PRQ1 T1
					ON T0.DocEntry=T1.DocEntry
					WHERE T0.DocEntry=@list_of_cols_val_tab_del AND T0.DocType='S' AND T1.U_Capitalizable='Y' AND (T1.U_FACode='' OR T1.U_FACode IS NULL))
		BEGIN
				SET @error=8
				SET @error_message =N'Fixed Asset Code should be tagged for capitalizable items.'
		END
		ELSE IF EXISTS (SELECT T0.DocEntry FROM OPRQ T0 INNER JOIN PRQ1 T1
					ON T0.DocNum=T1.DocEntry
					WHERE T0.DocEntry=@list_of_cols_val_tab_del AND T0.DocType='S' AND T1.U_Capitalizable='N' AND (T1.U_FACode!='' OR T1.U_FACode IS NOT NULL))
		BEGIN
				SET @error=9
				SET @error_message =N'Fixed Asset Code should not be tagged for non-capitalizable items.'
		END

		--To require Fixed Asset Clearing Account tagging for capitalizable
		IF EXISTS (SELECT T2.DocEntry FROM PRQ1 T0 INNER JOIN OACT T1 
					ON T0.AcctCode=T1.AcctCode INNER JOIN OPRQ T2
					ON T0.DocEntry=T2.DocEntry
					WHERE T0.DocEntry=@list_of_cols_val_tab_del AND T2.DocType='S' AND T0.U_Capitalizable='Y' AND T1.AcctName NOT LIKE '%Fixed Asset Clearing Account%')
		BEGIN
				SET @error=10
				SET @error_message =N'Fixed Asset Clearing Account should be used for capitalizable items.'
		END
		ELSE IF EXISTS (SELECT T2.DocEntry FROM PRQ1 T0 INNER JOIN OACT T1 
						ON T0.AcctCode=T1.AcctCode INNER JOIN OPRQ T2
						ON T0.DocEntry=T2.DocEntry
					WHERE T0.DocEntry=@list_of_cols_val_tab_del AND T2.DocType='S' AND T0.U_Capitalizable='N' AND T1.AcctName  LIKE '%Fixed Asset Clearing Account%')
		BEGIN
				SET @error=10
				SET @error_message =N'Fixed Asset Clearing Account should not be used for non-capitalizable items.'
		END

		
		--To check the existency of SO as referenced document in PR for PO Type - TRPBO
			IF  EXISTS(SELECT T0.DocNum FROM OPRQ T0 INNER JOIN PRQ1 T1
						ON T0.DocNum=T1.DocEntry
						WHERE T0.DocEntry=@list_of_cols_val_tab_del AND (T1.BaseRef IS NULL OR T1.BaseRef='')
						AND T0.U_POType IN ('TRPDS','TRPBO'))
			BEGIN
					IF NOT EXISTS (SELECT DocEntry FROM PRQ21 WHERE DocEntry=@list_of_cols_val_tab_del AND ObjectType=1470000113 AND RefObjType = 17)
					BEGIN

						SET @error=19
						SET @error_message =N'SO in referenced document field is required.'

					END

					ELSE
					BEGIN

						IF (SELECT COUNT(T1.DocEntry) FROM OPRQ T0 INNER JOIN PRQ21 T1 ON T0.DocNum=T1.DocEntry
						WHERE T0.DocNum=@list_of_cols_val_tab_del AND T1.RefObjType=17) > 1
						BEGIN
								SET @error=19
								SET @error_message =N'Only one SO is required in the referenced document field.'
						END
						ELSE IF EXISTS (SELECT T2.DocNum FROM OPRQ T0 INNER JOIN PRQ21 T1 ON T0.DocNum=T1.DocEntry INNER JOIN ORDR T2 ON T1.RefDocNum=T2.DocNum
						WHERE T0.DocNum=@list_of_cols_val_tab_del AND T1.RefObjType=17 AND T0.U_POType='TRPBO' AND (T2.U_BO_PKS='N' AND T2.U_BO_PKO='N' AND T2.U_BO_DS='N' AND T2.U_BO_DO='N'))
						BEGIN
								SET @error=19
								SET @error_message =N'SO mode of releasing in referenced document should be tagged as Back Order.'
						END
						ELSE IF EXISTS (SELECT T2.DocNum FROM OPRQ T0 INNER JOIN PRQ21 T1 ON T0.DocNum=T1.DocEntry INNER JOIN ORDR T2 ON T1.RefDocNum=T2.DocNum
						WHERE T0.DocNum=@list_of_cols_val_tab_del AND T1.RefObjType=17 AND T0.U_POType='TRPDS' AND (T2.U_BO_DSDD='N' AND T2.U_BO_DSDV='N' AND T2.U_BO_DSPD='N' AND T2.U_BO_DRS='N'))
						BEGIN
								SET @error=19
								SET @error_message =N'SO mode of releasing in referenced document should be tagged as Drop Ship.'
						END
						ELSE
						BEGIN
								SELECT @iRefDoc =  T1.RefDocNum FROM OPRQ T0 INNER JOIN PRQ21 T1 ON T0.DocNum=T1.DocEntry
								WHERE T0.DocNum=@list_of_cols_val_tab_del AND T1.RefObjType=17

								IF (SELECT COUNT(RefDocNum) FROM PRQ21 WHERE RefDocNum = @iRefDoc AND RefObjType = 17) > 1
								BEGIN
										SET @error=19
										SET @error_message =N'SO in referenced document field already exist.'
								END
								ELSE IF (SELECT COUNT(RefDocNum) FROM PRQ21 WHERE DocEntry=@list_of_cols_val_tab_del AND ObjectType=1470000113 AND RefObjType != 17) > 0
								BEGIN
										SET @error=19
										SET @error_message =N'Select SO as Transaction Type in the referenced document field.'
								END

						 END
					END
				
			END

		--To check if PO Type is selected
		--IF exists (SELECT T1.DocEntry FROM OPRQ T0 INNER JOIN PRQ1 T1 ON T0.DocNum=T1.DocEntry
		--			 WHERE T1.DocEntry=@list_of_cols_val_tab_del AND (U_POType = '' OR U_POType IS NULL) AND (T1.BaseRef IS NULL OR T1.BaseRef=''))

		IF exists (SELECT DocEntry FROM OPRQ WHERE DocEntry=@list_of_cols_val_tab_del AND (U_POType = '' OR U_POType IS NULL))		 
		BEGIN
				SET @error=4
				SET @error_message =N'PO Type is required.' 
		END

		--To check the if there are more than one PR created for Drop-Ship transaction in particular SO
		IF EXISTS(SELECT T1.DocEntry FROM OPRQ T0 INNER JOIN PRQ1 T1 ON T0.DocNum=T1.DocEntry WHERE T0.DocNum=@list_of_cols_val_tab_del AND T0.CANCELED='N' AND T0.U_POType <> 'TRPDS'  AND RIGHT(T1.WhsCode,2) = 'DS' AND T1.BaseType=17)
		BEGIN

			SET @error=1
			SET @error_message ='PO Type should be set as Trade-PR from Store (Drop Ship) .'

		END

		--To check the if there are more than one PR created for Drop-Ship transaction in particular SO
		SELECT DISTINCT @iBaseRef =  BaseRef FROM PRQ1 WHERE DocEntry = @list_of_cols_val_tab_del AND BaseType=17

		IF (SELECT COUNT (DISTINCT T1.DocEntry) FROM OPRQ T0 INNER JOIN PRQ1 T1 ON T0.DocNum=T1.DocEntry WHERE T0.CANCELED='N' AND T1.BaseRef=@iBaseRef AND T0.U_POType='TRPDS' AND T1.BaseType=17) > 1
		BEGIN

			SET @error=1
			SET @error_message ='Only one (1) Purchase Request should be created for Drop Ship transaction.'

		END

					--To check if the trucker was set up for drop ship / back order transactions
--		IF EXISTS(SELECT DocNum FROM OPRQ WHERE DocNum=@list_of_cols_val_tab_del AND (U_POType = 'TRPDS' OR U_POType = 'TRPBO')  AND U_Trucker='N/A')
--		BEGIN
--
--			SET @error=1
--			SET @error_message ='Trucker for Drop Ship/Back Order is required.'
--
--		END
--		ELSE IF EXISTS(SELECT DocNum FROM OPRQ WHERE DocNum=@list_of_cols_val_tab_del AND (U_POType != 'TRPDS' AND U_POType != 'TRPBO')  AND U_Trucker !='N/A')
--		BEGIN
--
--			SET @error=1
--			SET @error_message ='Trucker for Drop Ship/Back Order is not required.'
--
--		END
		
		IF EXISTS(SELECT T0.DocEntry FROM PRQ1 T0 INNER JOIN ORDR T1
		ON T0.BaseRef=T1.DocNum 
		WHERE T0.BaseType=17 AND T0.DocEntry=@list_of_cols_val_tab_del AND RIGHT(T0.WhsCode,2) != 'DS')
		BEGIN
			SET @error=1
			SET @error_message ='Change warehouse to drop ship.'
		END

	--PR should have Sales Order
	
	IF EXISTS (SELECT T0.BaseEntry FROM PRQ1 T0 INNER JOIN OPRQ T1 ON T0.DocEntry = T1.DocEntry WHERE T0.DocEntry = @list_of_cols_val_tab_del AND T0.BaseType = 17 AND (T1.U_BO_DRS = 'Y' OR T1.U_BO_DSDD = 'Y' OR T1.U_BO_DSDV = 'Y' OR T1.U_BO_DSPD = 'Y') AND T1.U_POType <> 'TRPDS')
	  BEGIN
	    SET @error=5
	  	SET @error_message =N'PR Should have Sales Order.'
	  END 

	--To check if theres only 1 line item in PQ Entry for item that included in qty allocation in vendor's whse that requires LO
		IF EXISTS (SELECT T0.DocNum FROM OPRQ T0 INNER JOIN PRQ1 T1 ON T0.DocNum=T1.DocEntry
					WHERE T0.DocNum = @list_of_cols_val_tab_del AND U_POType='TTPRA' AND T1.ItemCode IN (SELECT U_ItemCode FROM [@STOCKSALLOCATION] WHERE U_VendorName=T1.U_Vendor AND U_ReqLO='Y' AND U_Area=T1.U_Area))
		BEGIN
			IF (SELECT COUNT(ItemCode) FROM PRQ1 WHERE DocEntry=@list_of_cols_val_tab_del) > 1
			BEGIN
				SET @error=36
				SET @error_message =N'Only one item is allowed.'
			END

		END

		--To check if the warehouse assigned for PO Type Allocation set into drop ship
		IF EXISTS (SELECT T0.DocNum FROM OPRQ T0 INNER JOIN PRQ1 T1 ON T0.DocNum=T1.DocEntry
				WHERE T0.DocNum = @list_of_cols_val_tab_del AND U_POType='TTPRA' AND RIGHT(T1.WhsCode,2) != 'DS')
		BEGIN
			SET @error=36
			SET @error_message =N'Drop Ship  warehouse is required.'
		END

		--To check if the item exist in Stocks Allocation UDT for PO Type TTPRA
		IF EXISTS (SELECT T0.DocNum FROM OPRQ T0 INNER JOIN PRQ1 T1 ON T0.DocNum=T1.DocEntry
					WHERE T0.DocNum = @list_of_cols_val_tab_del AND U_POType='TTPRA' AND T1.ItemCode NOT IN (SELECT U_ItemCode FROM [@STOCKSALLOCATION] WHERE U_VendorName=T1.U_Vendor AND U_Area=T1.U_Area))
		BEGIN
			
			SET @error=36
			SET @error_message =N'Item should exist in Stocks Allocation per Vendors Warehouse.'
			
		END

END

--Validation for Purchase Quotation

--To Block Cancellation
IF @object_type ='540000006' AND (@transaction_type='C')


BEGIN

  IF (SELECT U_USERIDINFO FROM OPQT WHERE DocEntry = @list_of_cols_val_tab_del) <> 'Y'
    BEGIN
      IF NOT EXISTS (SELECT T0.DocEntry FROM OPQT T0 INNER JOIN dbo.[@REASONCODE] T1 ON T0.U_USERIDINFO = T1.U_UserPosition WHERE T0.CANCELED <> 'N' AND T0.DocEntry = @list_of_cols_val_tab_del AND T1.U_MktgDoc = 'PQ')
        BEGIN
          SET @error = 1
          SET @error_message = N'Only allowed User(s) can cancel this document.'
        END	
    END



    If NOT EXISTS (select T0.DocEntry FROM OPQT T0	where T0.CANCELED = 'Y'  AND T0.DocEntry = @list_of_cols_val_tab_del AND T0.U_ReasonCancelCode IS NOT NULL )	
    BEGIN
      SET @error = 2
      SET @error_message = 'Reason Code for cancellation  is required (PQ).'    	
    END
END



IF @object_type ='540000006' AND (@transaction_type='A' OR @transaction_type='U')
	BEGIN

		--To check if the Series Number is empty
		IF (SELECT LEFT(T0.U_DocSeries, 6)  FROM OPQT T0 WHERE T0.[DocNum]=@list_of_cols_val_tab_del) IS NULL
		BEGIN
				SET @error=1
				SET @error_message ='Document Series must be provided in this transaction.'
		END

		--To check if the Series Number is already exist
		 SELECT @vDocSeries = U_DocSeries FROM OPQT WHERE DocNum=@list_of_cols_val_tab_del 

		IF (SELECT COUNT(U_DocSeries) FROM OPQT WHERE DocNum <> @list_of_cols_val_tab_del AND U_DocSeries=@vDocSeries AND CANCELED='N') > 0
		BEGIN
			SET @error=2
			SET @error_message =N'Duplicate document series is not allowed.'
		END

		--To require PR in PQ with Exemptions on PO Type 'TBooking'
		IF exists (SELECT PQT1.DocEntry FROM PQT1 INNER JOIN (SELECT DocEntry, U_POType FROM OPQT WHERE U_POType != 'TRBKG') AS PQ
			ON PQT1.DocEntry = PQ.DocEntry
				WHERE PQT1.DocEntry=@list_of_cols_val_tab_del AND (PQT1.BaseRef = ' ' OR PQT1.BaseRef IS NULL) 
					AND (PQT1.BaseType != 1470000113)) OR @transaction_type='Update'
		
		BEGIN
				SET @error=3
				SET @error_message =N'Purchase Request is required.' 
		END

		--To check if the user selects valid warehouse
		IF exists (SELECT  T0.DocEntry FROM OPQT T0 INNER JOIN PQT1 T1 ON T0.DocNum=T1.DocEntry 
					WHERE T0.DocEntry=@list_of_cols_val_tab_del AND DocType='I' AND T1.WhsCode='01')
		BEGIN
			SET @error=4
			SET @error_message =N'Please select valid warehouse.' 
		END

		--To check if the Document Series and Warehouse or Store Performance selected is matched and if multiple warehouses or store performances exist
		IF exists (SELECT DocEntry FROM OPQT WHERE DocEntry=@list_of_cols_val_tab_del AND DocType='I')
		BEGIN

			SELECT @iCntWhse =  COUNT(Distinct WhsCode) FROM PQT1  WHERE DocEntry=@list_of_cols_val_tab_del
			SET @vExtWhse = (SELECT DISTINCT LEFT(T1.WhsCode, 6)  FROM PQT1 T0 INNER JOIN OWHS T1 ON T0.WhsCode=T1.U_WhseExt WHERE T0.Docentry=@list_of_cols_val_tab_del)

			IF @iCntWhse > 1
			BEGIN
				SET @error=5
				SET @error_message =N'Multiple warehouses is not allowed.' 
			END
			--To check if the Series Store and Document Warehouse 
			ELSE IF((SELECT LEFT(T0.U_DocSeries, 6)  FROM OPQT T0
			WHERE T0.[DocNum]=@list_of_cols_val_tab_del) 
			<>
			(SELECT DISTINCT LEFT(T0.WhsCode, 6)  FROM PQT1 T0
			WHERE T0.Docentry=@list_of_cols_val_tab_del) 
			AND
			(SELECT LEFT(T0.U_DocSeries, 6)  FROM OPQT T0
			WHERE T0.[DocNum]=@list_of_cols_val_tab_del) 
			<> CASE WHEN @vExtWhse IS NULL THEN '' ELSE @vExtWhse END)
			BEGIN
				SET @error=5
				SET @error_message ='Document series should be matched with the selected warehouse.'
			END
		END
		ELSE IF exists (SELECT DocEntry FROM OPQT  WHERE DocEntry=@list_of_cols_val_tab_del AND DocType='S')
		BEGIN
			SELECT @iCntWhse =  COUNT(Distinct OcrCode) FROM PQT1  WHERE DocEntry=@list_of_cols_val_tab_del
			IF @iCntWhse > 1
			BEGIN
				SET @error=5
				SET @error_message =N'Multiple store performance is not allowed.' 
			END
			--To check if the Series Store and Document Warehouse 
			ELSE IF(SELECT LEFT(T0.U_DocSeries, 6)  FROM OPQT T0
			WHERE T0.[DocNum]=@list_of_cols_val_tab_del) 
			<>
			(SELECT TOP 1 LEFT(T1.U_Whse,6)  FROM PQT1 T0 INNER JOIN OOCR T1
			ON T0.OcrCode=T1.OcrCode
			WHERE T0.Docentry=@list_of_cols_val_tab_del)
			BEGIN
				SET @error=5
				SET @error_message ='Document series should be matched with the selected store performance.'
			END
		END


		--To check if there are Store Perfromance assigned for Service Type
		IF EXISTS(SELECT T0.DocEntry FROM OPQT T0 INNER JOIN PQT1 T1 ON T0.DocEntry=T1.DocEntry
					WHERE T0.DocEntry=@list_of_cols_val_tab_del AND T0.DocType='S' AND ((OcrCode = '' OR OcrCode IS NULL)))
		BEGIN
			SET @error=6
			SET @error_message = N'Store Performance is required.' 
		END
	
		--To check if there are Expenses by Function assigned for Service Type
		IF EXISTS(SELECT T0.DocEntry FROM OPQT T0 INNER JOIN PQT1 T1 ON T0.DocEntry=T1.DocEntry
					WHERE T0.DocEntry=@list_of_cols_val_tab_del AND T0.DocType='S' AND ((OcrCode2 = '' OR OcrCode2 IS NULL)))
		BEGIN
			SET @error=7
			SET @error_message = N'Expenses by Function is required.' 
		END

		--To check if GL Account is empty
		IF EXISTS(SELECT T0.DocEntry FROM OPQT T0 INNER JOIN PQT1 T1 ON T0.DocEntry=T1.DocEntry
					WHERE T0.DocEntry=@list_of_cols_val_tab_del AND T0.DocType='S' AND (T1.AcctCode = '' OR T1.AcctCode IS NULL) AND T0.CANCELED='N')
		BEGIN
			SET @error=11
			SET @error_message = N'G/L Account is required.' 
		END

		--To check if the description field is empty for Service Type transaction
		IF EXISTS (SELECT  T0.DocNum FROM OPQT T0 INNER JOIN PQT1 T1
		ON T0.DocNum=T1.DocEntry
		WHERE T0.DocNum=@list_of_cols_val_tab_del AND T0.CANCELED='N' AND T0.DocType='S' AND (T1.Dscription IS NULL OR T1.Dscription=''))
		BEGIN
				SET @error=12
				SET @error_message =N'Description is required.'
		END

		--To check if there's a remarks
		IF exists (SELECT DocEntry FROM OPQT WHERE DocEntry=@list_of_cols_val_tab_del AND (Comments='' OR Comments IS NULL))
		BEGIN
			SET @error=13
			SET @error_message =N'Remarks is required.' 
		END
		-- ## Validation for Purchase Request Fixed Asset Quantity
		IF EXISTS(SELECT T0.DocEntry FROM OPQT T0 INNER JOIN PQT1 T1 ON T0.DocEntry=T1.DocEntry
					WHERE T0.DocEntry=@list_of_cols_val_tab_del AND T0.DocType='I' AND T1.ItemCode LIKE 'FA%' AND T1.Quantity > 1)
		BEGIN
				SET @error=14
				SET @error_message ='Quantity for Fixed Assets should not be greater than 1.' 
		END

--BRYLE 09272022-- TO EXEMPT UNIT COST BEFORE AND AFTER ON SERVICES.
		-- To check if the Price is zero
		IF EXISTS(SELECT DocEntry FROM PQT1						
					WHERE DocEntry=@list_of_cols_val_tab_del AND ((U_PriceBfrDisc=0.00 OR U_PriceBfrDisc IS NULL) OR PriceAfVAT=0))
		BEGIN
			
			SET @error=15
			SET @error_message =N'Unit Cost before and after discount is required.'

		END
--BRYLE 09272022--

		--To check if the store performance warehouse belongs to the assigned branch
		IF EXISTS (SELECT DISTINCT T0.DocNum FROM OPQT T0 INNER JOIN PQT1 T1
		ON T0.DocNum=T1.DocEntry INNER JOIN OOCR T2
		ON T1.OcrCode=T2.OcrCode INNER JOIN OWHS T3
		ON T2.U_Whse=T3.WhsCode
		WHERE T0.DocNum=@list_of_cols_val_tab_del AND T0.BPLId != T3.BPLid  AND T0.DocType='S')
		BEGIN
				SET @error=16
				SET @error_message =N'Store Performance should belongs to the assigned branch.'
		END

		--To check if there is ARDPI for SO-Drop Ship Transaction
        --ACDC replace DISTINCT TO TOP 1 due to error(return more than one value). on July 04, 2023
		SET @iSONum = (SELECT top 1  TD.BaseRef FROM OPRQ TC INNER JOIN PRQ1 TD ON TC.DocNum=TD.DocEntry WHERE TC.CANCELED='N' AND TD.BaseType=17 AND TD.DocEntry=
		(SELECT top 1  TF.DocEntry FROM OPRQ TE INNER JOIN PRQ1 TF ON TE.DocNum=TF.DocEntry WHERE TE.CANCELED='N' AND TF.TrgetEntry =
		(SELECT top 1  TG.DocEntry FROM OPQT TG INNER JOIN PQT1 TH ON TG.DocNum=TH.DocEntry WHERE TG.CANCELED='N' AND TH.DocEntry=@list_of_cols_val_tab_del)))

		IF @iSONum > 0 
		BEGIN

			IF  EXISTS (SELECT DISTINCT ORDR.DocEntry FROM ORDR INNER JOIN RDR1 ON ORDR.DocNum = RDR1.DocEntry WHERE ORDR.DocNum=@iSONum AND (ORDR.U_BO_PO ='N' AND  (ORDR.U_BO_DSPD='N' AND ORDR.U_BO_DRS='N') ) AND RDR1.U_ReqBO = 'N' )
			BEGIN
		
				IF NOT EXISTS (SELECT DocEntry FROM DPI1 WHERE BaseType=17 AND BaseRef=@iSONum)
				BEGIN
					SET @error=16
					SET @error_message =N'AR Down Payment is required for Sales Order-Drop Ship Transaction.'
				END
			END

		END

		--To check if PO Type is selected
		IF exists (SELECT DocEntry FROM OPQT WHERE DocEntry=@list_of_cols_val_tab_del AND (U_POType = '' OR U_POType IS NULL))		 
		BEGIN
				SET @error=4
				SET @error_message =N'PO Type is required.' 
		END

		--To check if there is Vendor for Drop Ship and Area for PO Type Allocation
		IF EXISTS (SELECT T0.DocNum FROM OPQT T0 INNER JOIN PQT1 T1 ON T0.DocNum=T1.DocEntry
		WHERE T0.DocNum = @list_of_cols_val_tab_del AND U_POType='TTPRA')
		BEGIN 

			IF EXISTS(SELECT T0.DocNum FROM OPQT T0 INNER JOIN PQT1 T1 ON T0.DocNum=T1.DocEntry
				WHERE T0.DocNum = @list_of_cols_val_tab_del AND U_POType='TTPRA' AND ((T1.U_Vendor='' OR T1.U_Vendor IS NULL) OR (T1.U_Area='' OR T1.U_Area IS NULL)))
			BEGIN
					SET @error=4
					SET @error_message =N'Vendor for Drop Ship and Area are required.' 
			END
			ELSE IF (SELECT COUNT(T1.ItemCode) FROM OPQT T0 INNER JOIN PQT1 T1 ON T0.DocNum=T1.DocEntry
					WHERE T0.DocNum = @list_of_cols_val_tab_del AND U_POType='TTPRA' 
					AND T1.ItemCode NOT IN (SELECT U_ItemCode FROM [@STOCKSALLOCATION] WHERE U_VendorName=T1.U_Vendor  AND U_Area=T1.U_Area)) > 0
			BEGIN
					SET @error=4
					SET @error_message =N'Item should exist in the Stocks Allocation per Vendors Warehouse.' 
			END

		END

		--To check if theres only 1 line item in PQ Entry for item that included in qty allocation in vendor's whse that requires LO
		IF EXISTS (SELECT T0.DocNum FROM OPQT T0 INNER JOIN PQT1 T1 ON T0.DocNum=T1.DocEntry
					WHERE T0.DocNum = @list_of_cols_val_tab_del AND U_POType='TTPRA' AND T1.ItemCode IN (SELECT U_ItemCode FROM [@STOCKSALLOCATION] WHERE U_VendorName=T1.U_Vendor AND U_ReqLO='Y' AND U_Area=T1.U_Area))
		BEGIN
			IF (SELECT COUNT(ItemCode) FROM PQT1 WHERE DocEntry=@list_of_cols_val_tab_del) > 1
			BEGIN
				SET @error=36
				SET @error_message =N'Only one item is allowed.'
			END

		END

		--To check if the warehouse assigned for PO Type Allocation set into drop ship
		IF EXISTS (SELECT T0.DocNum FROM OPQT T0 INNER JOIN PQT1 T1 ON T0.DocNum=T1.DocEntry
				WHERE T0.DocNum = @list_of_cols_val_tab_del AND U_POType='TTPRA' AND RIGHT(T1.WhsCode,2) != 'DS')
		BEGIN
			SET @error=36
			SET @error_message =N'Drop Ship  warehouse is required.'
		END

		--To check if the PQ quantity exceeds with the qty allocated in vendor's whse
		IF EXISTS (SELECT T1.ItemCode,T2.SoldQty,T1.Quantity FROM OPQT T0 INNER JOIN PQT1 T1 ON T0.DocNum=T1.DocEntry
		INNER JOIN View_SOF_Allocation T2 ON T1.ItemCode=T2.U_ItemCode
		WHERE T0.DocNum = @list_of_cols_val_tab_del AND U_POType='TTPRA' AND T2.U_Area=T1.U_Area
		AND T2.U_VendorName=T1.U_Vendor AND  (T2.Available + T1.Quantity) > T2.U_QtyAlloc + [dbo].[fn_GetPrevQtyAlloc] (T1.ItemCode,T1.U_Vendor,T1.U_Area,T1.U_QtyAlloc))
		BEGIN
				SET @error=36
				SET @error_message =N'Order quantity exceeds the quantity allocated in Vendors warehouse.'
		END

--PQ should have Sales Order

--IF NOT EXISTS (SELECT T1.BaseRef FROM PQT1 T0 INNER JOIN PRQ1 T1 ON T0.BaseRef = T1.DocEntry AND T0.BaseType = 1470000113 WHERE T0.DocEntry = @list_of_cols_val_tab_del AND T1.BaseType = 17)
--  BEGIN
--    SET @error=37
--  	SET @error_message =N'PQ Should have Sales Order.'
--  END


--PQ  ItemCode and Order Qty should equal with the Sales Order

DECLARE @SOSUM AS INT = (SELECT SUM(T0.Quantity) FROM RDR1 T0 INNER JOIN PRQ1 T1 ON T0.PoTrgEntry = T1.DocEntry WHERE T1.TrgetEntry = @list_of_cols_val_tab_del AND T0.PcDocType = 1470000113 AND T0.Dscription  NOT LIKE '%DELIVERY%')
DECLARE @PQSUM AS INT = (SELECT SUM(T0.Quantity) FROM PQT1 T0 WHERE T0.DocEntry = @list_of_cols_val_tab_del AND T0.Dscription  NOT LIKE '%DELIVERY%')

IF @PQSUM <> @SOSUM
  BEGIN
    SET @error=38
  	SET @error_message =N'PQ Quantity should be the same with SO Quantity.'
  END

--
--DECLARE @SOITEMCODE AS VARCHAR(MAX) = (SELECT DISTINCT T0.ItemCode FROM RDR1 T0 INNER JOIN PRQ1 T1 ON T0.PoTrgEntry = T1.DocEntry WHERE T1.TrgetEntry = @list_of_cols_val_tab_del AND T0.PcDocType = 1470000113 AND T0.Dscription  NOT LIKE '%DELIVERY%')
--DECLARE @PQITEMCODE AS VARCHAR(MAX) = (SELECT DISTINCT T0.ItemCode FROM PQT1 T0 WHERE T0.DocEntry = @list_of_cols_val_tab_del)
--
--IF @PQITEMCODE <> @SOITEMCODE
--  BEGIN
--  	SELECT 'PQ ItemCode should be the same with SO ItemCode.'
--  END


END

--Validation for Purchase Order

--To Block Cancellation
IF @object_type ='22' AND (@transaction_type='C')

BEGIN

 IF (SELECT U_USERIDINFO FROM OPOR WHERE DOCENTRY = @list_of_cols_val_tab_del) <> 'Y'
  BEGIN
  If NOT EXISTS (select T0.DocEntry FROM OPOR T0 INNER JOIN dbo.[@REASONCODE] T1 ON T0.U_USERIDINFO = T1.U_UserPosition	where T0.CANCELED <> 'N'  AND T0.DocEntry = @list_of_cols_val_tab_del AND T1.U_MktgDoc = 'PO' )	
    BEGIN
      SET @error = 1
      SET @error_message = 'Only allowed User(s) can cancel this document.'
    END
  END

    If NOT EXISTS (select T0.DocEntry FROM OPOR T0	where T0.CANCELED = 'Y'  AND T0.DocEntry = @list_of_cols_val_tab_del AND T0.U_ReasonCancelCode IS NOT NULL )	
    BEGIN
      SET @error = 2
      SET @error_message = 'Reason Code for cancellation  is required (PO).'    	
    END	
END


IF @object_type ='22' AND (@transaction_type='A' OR @transaction_type='U')
BEGIN
		
		--To check if the Series Number is empty
		IF (SELECT LEFT(T0.U_DocSeries, 6)  FROM OPOR T0 WHERE T0.[DocNum]=@list_of_cols_val_tab_del) IS NULL
		BEGIN
			SET @error=1
			SET @error_message ='Document Series must be provided in this transaction.'
		END

		--To check if the Series Number is already exist
		 SELECT @vDocSeries = U_DocSeries FROM OPOR WHERE DocNum=@list_of_cols_val_tab_del 

		IF (SELECT COUNT(U_DocSeries) FROM OPOR WHERE DocNum <> @list_of_cols_val_tab_del AND U_DocSeries=@vDocSeries AND CANCELED='N') > 0
		BEGIN
			SET @error=2
			SET @error_message =N'Duplicate document series is not allowed.'
		END


--bryle--11052022
--commented kay dli matched ang docseries sa warehouse--


		-- --To check if the Document Series and Warehouse or Store Performance selected is matched
		-- IF exists (SELECT DocEntry FROM OPOR WHERE DocEntry=@list_of_cols_val_tab_del AND DocType='I')
		-- BEGIN
		-- 	IF(SELECT LEFT(T0.U_DocSeries, 6)  FROM OPOR T0
		-- 	WHERE T0.[DocNum]=@list_of_cols_val_tab_del) 
		-- 	<>
		-- 	(SELECT DISTINCT LEFT(T0.WhsCode, 6)  FROM POR1 T0
		-- 	WHERE T0.Docentry=@list_of_cols_val_tab_del)
		-- 	BEGIN
		-- 		SET @error=3
		-- 		SET @error_message ='Document series should be matched with the selected warehouse.'
		-- 	END
		-- END

		-- ELSE IF exists (SELECT DocEntry FROM OPOR WHERE DocEntry=@list_of_cols_val_tab_del AND DocType='S')
		-- BEGIN
		-- 	IF(SELECT LEFT(T0.U_DocSeries, 6)  FROM OPOR T0
		-- 	WHERE T0.[DocNum]=@list_of_cols_val_tab_del) 
		-- 	<>
		-- 	(SELECT DISTINCT LEFT(T1.U_Whse,6) FROM POR1 T0 INNER JOIN OOCR T1
		-- 	ON T0.OcrCode=T1.OcrCode
		-- 	WHERE T0.Docentry=@list_of_cols_val_tab_del)
		-- 	BEGIN
		-- 		SET @error=3
		-- 		SET @error_message ='Document series should be matched with the selected store performance.'
		-- 	END
		-- END



		--To check if the Document Series and Warehouse or Store Performance selected is matched
		IF exists (SELECT DocEntry FROM OPOR WHERE DocEntry=@list_of_cols_val_tab_del AND DocType='I')
		BEGIN

			SET @vExtWhse = (SELECT DISTINCT LEFT(T1.WhsCode, 6)  FROM POR1 T0 INNER JOIN OWHS T1 ON T0.WhsCode=T1.U_WhseExt WHERE T0.Docentry=@list_of_cols_val_tab_del)

			IF((SELECT LEFT(T0.U_DocSeries, 6)  FROM OPOR T0
			WHERE T0.[DocNum]=@list_of_cols_val_tab_del) 
			<>
			(SELECT DISTINCT LEFT(T0.WhsCode, 6)  FROM POR1 T0
			WHERE T0.Docentry=@list_of_cols_val_tab_del)
			AND 
			(SELECT LEFT(T0.U_DocSeries, 6)  FROM OPOR T0
			WHERE T0.[DocNum]=@list_of_cols_val_tab_del) <> CASE WHEN @vExtWhse IS NULL THEN '' ELSE @vExtWhse END)
			BEGIN
				SET @error=3
				SET @error_message ='Document series should be matched with the selected warehouse.'
			END
		END
		ELSE IF exists (SELECT DocEntry FROM OPOR WHERE DocEntry=@list_of_cols_val_tab_del AND DocType='S')
		BEGIN
			IF(SELECT LEFT(T0.U_DocSeries, 6)  FROM OPOR T0
			WHERE T0.[DocNum]=@list_of_cols_val_tab_del) 
			<>
			(SELECT TOP 1 LEFT(T1.U_Whse,6) FROM POR1 T0 INNER JOIN OOCR T1
			ON T0.OcrCode=T1.OcrCode
			WHERE T0.Docentry=@list_of_cols_val_tab_del)
			BEGIN
				SET @error=3
				SET @error_message ='Document series should be matched with the selected store performance.'
			END
		END

--bryle--11052022

		--To check if PO Type is selected
		IF exists (SELECT DocEntry FROM OPOR WHERE DocEntry=@list_of_cols_val_tab_del AND (U_POType = '' or U_POType IS NULL))
		BEGIN
				SET @error=4
				SET @error_message =N'PO Type is required.' 
		END

		--To check if Shipping Type is selected
		IF exists (SELECT DocEntry FROM OPOR WHERE DocEntry=@list_of_cols_val_tab_del AND (U_ShippingType = '' or U_ShippingType IS NULL) AND U_POType != 'NTSP')
		BEGIN
				SET @error=5
				SET @error_message =N'Shipping Type is required.' 
		END

		--To check if Mode of Releasing is selected
		IF exists (SELECT DocEntry FROM OPOR WHERE DocEntry=@list_of_cols_val_tab_del AND (U_ModeOfReleasing = '' or U_ModeOfReleasing IS NULL) AND U_POType != 'NTSP')
		BEGIN
				SET @error=6
				SET @error_message =N'Mode Of Releasing is required.' 
		END
		
		--To require PQ in all PO. Basis: BaseRef and BaseEntry
		--IF exists (SELECT DocEntry FROM POR1 WHERE DocEntry=@list_of_cols_val_tab_del AND ((BaseRef = ' ' OR BaseRef IS NULL) OR (BaseType != 540000006))) 
		
		--BEGIN
		--		SET @error=7
		--		SET @error_message =N'Purchase Quotation is required.' 
		--END
		
		--To check if there's a remarks
		IF exists (SELECT DocEntry FROM OPOR WHERE DocEntry=@list_of_cols_val_tab_del AND (Comments='' OR Comments IS NULL))
		BEGIN
			SET @error=8
			SET @error_message =N'Remarks is required.' 
		END

		--To check if the Price is zero
		IF EXISTS(SELECT DocEntry FROM POR1
					WHERE DocEntry=@list_of_cols_val_tab_del AND ((U_PriceBfrDisc=0.00 OR U_PriceBfrDisc IS NULL) OR PriceAfVAT=0))
		BEGIN
			
			SET @error=9
			SET @error_message =N'Unit Cost before and after discount is required.'

		END

		--To check if the Broker was set for the PO that with Landed Cost
		IF exists	(SELECT DocEntry FROM OPOR WHERE DocEntry=@list_of_cols_val_tab_del 
				AND (U_ShippingType='WF')
					AND (U_ARRASTRE > 0 
					OR U_WHARFAGE > 0
					OR U_FREIGHT > 0
					OR U_TRUCKING > 0
					OR U_DOC_STAMP > 0
					OR U_OTHERS > 0 
					OR U_BROKERAGE_FEE > 0)
					AND (U_BrokerCode IS NULL OR U_BrokerCode = '')
					)
		BEGIN
					SET @error=15
					SET @error_message =N'Broker is required.' 
		END

		--To check the existency of PO for Landed Cost as referenced document for PO-Broker
		IF  EXISTS(SELECT T0.DocEntry FROM OPOR T0 INNER JOIN OCRD T1 ON T0.U_BrokerCode=T1.CardCode
					WHERE T0.DocEntry=@list_of_cols_val_tab_del AND (T0.U_BrokerCode != '' OR T0.U_BrokerCode IS NOT NULL) AND T1.U_ReqPOLC='Y')
		BEGIN
				IF  EXISTS (SELECT DocEntry FROM POR21 WHERE DocEntry=@list_of_cols_val_tab_del AND ObjectType=22)
				BEGIN

						IF (SELECT COUNT(RefDocNum) FROM POR21 WHERE DocEntry=@list_of_cols_val_tab_del AND ObjectType=22 AND RefObjType != 22) > 0
						BEGIN
							SET @error=19
							SET @error_message =N'Select PO as Transaction Type in the referenced document field.'
						END

						ELSE
						BEGIN

							SELECT @vPOCardCode1 = U_BrokerCode FROM OPOR WHERE DocEntry=@list_of_cols_val_tab_del 
				
							SELECT @vPOCardCode2 = T1.CardCode FROM POR21 T0 INNER JOIN OPOR T1 ON T0.RefDocNum=T1.DocNum
							WHERE T0.DocEntry=@list_of_cols_val_tab_del AND T0.ObjectType=22 AND T0.RefObjType = 22

							IF @vPOCardCode1 != @vPOCardCode2
							BEGIN
								SET @error=19
								SET @error_message =N'Card Code for PO Landed Cost should be matched with the current Card Code.'
							END

						END
					
				END

				ELSE
				BEGIN

						IF EXISTS(SELECT TrgetEntry FROM POR1 WHERE DocEntry=@list_of_cols_val_tab_del AND (TrgetEntry !='' AND TrgetEntry IS NOT NULL))	
						BEGIN
							
								IF NOT EXISTS (SELECT DocEntry FROM POR21 WHERE DocEntry=@list_of_cols_val_tab_del AND ObjectType=22)
								BEGIN
										SET @error=19
										SET @error_message =N'PO for Landed Cost in referenced document field is required.'
								END
						END	

				END
		END

		--To check if the Landed Cost component was not set up for Without Freight shipping type
		IF exists	(SELECT DocEntry FROM OPOR WHERE DocEntry=@list_of_cols_val_tab_del 
				AND (U_ShippingType !='WF')
					AND (U_ARRASTRE > 0 
					OR U_WHARFAGE > 0
					OR U_FREIGHT > 0
					OR U_TRUCKING > 0
					OR U_DOC_STAMP > 0
					OR U_OTHERS > 0 
					OR U_LABOR > 0
					OR U_BROKERAGE_FEE > 0))
		BEGIN
					SET @error=15
					SET @error_message =N'Landed Cost component is not allowed for without freight transactions.' 
		END
		ELSE IF exists	(SELECT DocEntry FROM OPOR WHERE DocEntry=@list_of_cols_val_tab_del 
				AND (U_ShippingType ='WF')
					AND (U_ARRASTRE = 0 
					AND U_WHARFAGE = 0
					AND U_FREIGHT = 0
					AND U_TRUCKING = 0
					AND U_DOC_STAMP = 0
					AND U_OTHERS = 0 
					AND U_LABOR = 0
					AND U_BROKERAGE_FEE = 0))
		BEGIN
					SET @error=15
					SET @error_message =N'At lease one component of landed Cost is required for with freight transactions.' 
		END
  
		--To block user if Wslip Series is empty if mode of releasing is pick-up.
		--IF (SELECT U_WSlipSeries From OPOR WHERE DocNUm = @list_of_cols_val_tab_del AND U_ModeOfReleasing = 'Pick_Up' AND U_BO_DRS = 'N' AND U_BO_DSPD = 'N' ) IS NULL
		
		--Update 03/14/2024 -CHECK IF DOCUMENT IS ALREADY APPROVED.
		--TO DEPLOY IN LIVE
		IF EXISTS (SELECT U_WSlipSeries From OPOR WHERE DocNUm = @list_of_cols_val_tab_del AND DocType = 'I' AND U_ModeOfReleasing = 'Pick_Up' AND U_BO_DRS = 'N' AND U_BO_DSPD = 'N' and U_WSlipSeries IS NULL AND (U_PltNumber IS NULL OR U_PltNumber = '')  AND U_POType != 'TTPRA')
		  BEGIN
						SET @error=16
						SET @error_message =N'Update Remarks (WSlip should not be empty).'       	
		  END


		--To check if WslipSeries is duplicate
		 SELECT @vDocSeries = U_WslipSeries FROM OPOR WHERE DocNum=@list_of_cols_val_tab_del 

		IF (SELECT COUNT(U_WslipSeries) FROM OPOR WHERE U_WslipSeries =  @vDocSeries AND CANCELED='N') > 1
		BEGIN
			SET @error=17
			SET @error_message =N'Duplicate WSlipSeries series is not allowed.Please update remarks.'
		END

		--To check the existency of PO as referenced document in Sales order from Distribution Center for Store Stocks Replenishment
			IF  EXISTS(SELECT DocEntry FROM OPOR
						WHERE DocEntry=@list_of_cols_val_tab_del AND (U_SOType='DC' OR U_SOType='PC') AND U_POType='TRPDS')
			BEGIN
					IF NOT EXISTS (SELECT DocEntry FROM POR21 WHERE DocEntry=@list_of_cols_val_tab_del AND ObjectType=22 AND RefObjType = 22)
					BEGIN

						SET @error=19
						SET @error_message =N'Set PO for allocation in the referenced document field.'

					END

					ELSE
					BEGIN

						IF (SELECT COUNT(RefDocNum) FROM POR21 WHERE DocEntry=@list_of_cols_val_tab_del AND ObjectType=22 AND RefObjType = 22) > 1
						BEGIN
								SET @error=19
								SET @error_message =N'Only one PO in referenced document is allowed.'
						END
						ELSE IF (SELECT COUNT(RefDocNum) FROM POR21 WHERE DocEntry=@list_of_cols_val_tab_del AND ObjectType=22 AND RefObjType != 22) > 0
						BEGIN
								SET @error=19
								SET @error_message =N'Select PO as Transaction Type in the referenced document field.'
						END
						ELSE IF (SELECT COUNT(RefDocNum) FROM POR21 T0 INNER JOIN OPOR T1
								ON T0.RefDocNum=T1.DocNum
								WHERE T0.DocEntry=@list_of_cols_val_tab_del AND T0.ObjectType=22 AND T0.RefObjType = 22 AND T1.U_POType != 'TTPRA') > 0
						BEGIN
								SET @error=19
								SET @error_message =N'PO Type for reference document should be "Trade-PR from Store (Allocation)".'
						END


					END
				
			END

END

--Validation for AP Invoice

-- To Block Cancellation
IF @object_type = '18' AND (@transaction_type='A')

BEGIN

IF EXISTS (SELECT T0.DocEntry FROM OPCH T0 WHERE T0.DocEntry IN (SELECT A0.DocEntry FROM PCH1 A0 WHERE A0.BaseType = 18 ) AND T0.CANCELED <> 'N' AND T0.DocNum = @list_of_cols_val_tab_del AND T0.U_ReasonCancelCode IS NULL)
BEGIN
  SET @error = 1
  SET @error_message = N'Reason Code for cancellation  is required (AP Invoice).'
END 

IF EXISTS (SELECT A2.DocEntry FROM POR1 A1 
            INNER JOIN PCH1 A2 ON A1.DocEntry=A2.BaseEntry AND A2.BaseType=A1.ObjType
            WHERE  A1.OpenQty> A2.Quantity
            AND A1.ItemCode=A2.ItemCode
            -- AND A2.DocEntry NOT IN (SELECT DocEntry FROM PCH21 WHERE RefObjType=13)
            AND A2.DocEntry= @list_of_cols_val_tab_del)
BEGIN
  SET @error = 100
  SET @error_message = N'ADCCCCCC'
END 
 --To block user listed below from cancelling document 
--IF EXISTS (SELECT T0.DocEntry FROM OPCH T0 WHERE T0.DocEntry IN (SELECT A0.DocEntry FROM PCH1 A0 WHERE A0.BaseType = 18 ) AND T0.CANCELED <> 'N' AND T0.DocNum = @list_of_cols_val_tab_del AND T0.U_USERIDINFO NOT IN(@RESULT_APIN))
--BEGIN
--  SET @error = 2
--  SET @error_message = N'Only allowed User(s) can cancel this document.'
--END		

 --To block user listed below from cancelling document 
IF (SELECT CANCELED FROM OPCH WHERE DocNum = @list_of_cols_val_tab_del)  = 'C'
BEGIN
  IF (SELECT U_USERIDINFO FROM OPCH WHERE DOCENTRY = @list_of_cols_val_tab_del) <> 'Y'
    BEGIN
      IF NOT EXISTS (SELECT T0.DocEntry FROM OPCH T0 INNER JOIN dbo.[@REASONCODE] T1 ON T0.U_USERIDINFO = T1.U_UserPosition WHERE T0.CANCELED <> 'N' AND T0.DocNum = @list_of_cols_val_tab_del AND T1.U_MktgDoc = 'APIN' )
        BEGIN
          SET @error = 2
          SET @error_message = N'Only allowed User(s) can cancel this document.'
        END	
    END	
END

END



IF @object_type = '18' AND (@transaction_type='A' OR @transaction_type='U')
	BEGIN 

		--To check if there are Store Perfromance assigned for Service Type
		IF EXISTS(SELECT T0.DocEntry FROM OPCH T0 INNER JOIN PCH1 T1 ON T0.DocEntry=T1.DocEntry
					WHERE T0.DocEntry=@list_of_cols_val_tab_del AND T0.DocType='S' AND ((OcrCode = '' OR OcrCode IS NULL)))
		BEGIN
			SET @error=1
			SET @error_message = N'Store Performance is required.' 
		END



		--To check if there are Store Perfromance assigned for Item Type
		IF EXISTS(SELECT T0.DocEntry FROM OPCH T0 INNER JOIN PCH1 T1 ON T0.DocEntry=T1.DocEntry
					WHERE T0.DocEntry=@list_of_cols_val_tab_del AND T0.DocType='I' AND ((OcrCode = '' OR OcrCode IS NULL)) AND (T0.U_BO_DRS = 'Y' OR T0.U_BO_DSDD = 'Y' OR T0.U_BO_DSDV = 'Y' OR T0.U_BO_DSPD = 'Y'))
		BEGIN
			SET @error=18
			SET @error_message = N'Store Performance is required.' 
		END
	




	
		--To check if there are Expenses by Function assigned for Service Type
		IF EXISTS(SELECT T0.DocEntry FROM OPCH T0 INNER JOIN PCH1 T1 ON T0.DocEntry=T1.DocEntry
					WHERE T0.DocEntry=@list_of_cols_val_tab_del AND T0.DocType='S' AND ((OcrCode2 = '' OR OcrCode2 IS NULL)))
		BEGIN
			SET @error=2
			SET @error_message = N'Expenses by Function is required.' 
		END

		--To check if the user applied payment means
		IF @transaction_type='A'
		BEGIN
			IF EXISTS(SELECT DocNum,DocTotal,PaidToDate,U_DocSeries FROM OPCH WHERE DocNum=@list_of_cols_val_tab_del 
			AND (PaidToDate!=0) AND CANCELED='N')
			BEGIN
				SET @error=3
				SET @error_message =N'Payment means is not allowed.'
			END
		END

		--To check if multiple code for store performance exist in one document entry
		IF exists (SELECT DocEntry FROM OPCH  WHERE DocEntry=@list_of_cols_val_tab_del AND DocType='S')
		BEGIN
			SELECT @iCntWhse =  COUNT(Distinct OcrCode) FROM PCH1  WHERE DocEntry=@list_of_cols_val_tab_del
			IF @iCntWhse > 1
			BEGIN
				SET @error=4
				SET @error_message =N'Multiple store performance is not allowed.' 
			END
		END
		
		--To check if there are Store Perfromance assigned for Service Type
		IF @object_type ='22' AND (@transaction_type='A' OR @transaction_type='U')
		BEGIN
				IF EXISTS(SELECT T0.DocEntry FROM OPCH T0 INNER JOIN PCH1 T1 ON T0.DocEntry=T1.DocEntry
						   WHERE T0.DocEntry=@list_of_cols_val_tab_del AND T0.DocType='S' AND ((OcrCode = '' OR OcrCode IS NULL)))
				BEGIN
					SET @error=5
					SET @error_message = N'Store Performance for Services should be set up.' 
				END
		END

		--To check if there are Expenses by Function assigned for Service Type
		IF @object_type ='22' AND (@transaction_type='A' OR @transaction_type='U')
		BEGIN
				IF EXISTS(SELECT T0.DocEntry FROM OPCH T0 INNER JOIN PCH1 T1 ON T0.DocEntry=T1.DocEntry
						   WHERE T0.DocEntry=@list_of_cols_val_tab_del AND T0.DocType='S' AND ((OcrCode2 = '' OR OcrCode2 IS NULL)))
				BEGIN
					SET @error=6
					SET @error_message = N'Expenses by Function for Services should be set up.' 
				END
		END

		--To check if there's a remarks
		IF exists (SELECT DocEntry FROM OPCH  WHERE DocEntry=@list_of_cols_val_tab_del AND (Comments='' OR Comments IS NULL))
		BEGIN
			SET @error=7
			SET @error_message =N'Remarks is required.' 
		END

		--To check if the GRPO with Landed Cost Component was forwarded to Landed Cost Entry
		IF EXISTS (SELECT T0.DocEntry FROM OPCH T0 INNER JOIN PCH1 T1 ON T0.DocNum=T1.DocEntry WHERE T0.DocEntry=@list_of_cols_val_tab_del 
					AND (U_ARRASTRE > 0 OR U_BROKERAGE_FEE > 0 OR U_DOC_STAMP > 0 OR U_FREIGHT > 0 OR  U_LABOR > 0 OR
					U_INSURANCE > 0 OR U_TRUCKING > 0 OR U_WHARFAGE > 0 OR U_OTHERS > 0 ) AND T1.BaseType=20)
		BEGIN
		
			IF NOT EXISTS(SELECT DISTINCT t1.LineNum FROM OPCH T0 INNER JOIN PCH1 T1
					   ON T0.DocEntry=T1.DocEntry INNER JOIN IPF1 T2
					   ON T1.BaseRef=T2.OriBAbsEnt
						WHERE T0.DocEntry=@list_of_cols_val_tab_del)
			BEGIN
		
				SET @error=8
				SET @error_message =N'GRPO should be first forwarded to Landed Cost entry.' 
			END

		END

		--

		IF (SELECT SUM((T1.DocTotalFC - T1.VatSumFC) - T0.DrawnSumFc) AS NetAmt FROM PCH9 T0 INNER JOIN ODPO T1
		ON T0.BaseAbs=T1.DocNum INNER JOIN OPCH T2
		ON T2.DocNum=T1.DocEntry
		WHERE T0.DocEntry = @list_of_cols_val_tab_del AND T2.CANCELED='N') > 0
		BEGIN

				SET @error=9
				SET @error_message =N'Net Amount to Withdraw should be matched with the APDPR/APDPI Document Total (Net of VAT).'

		END

		--To check if the description field is empty for Service Type transaction
		IF EXISTS (SELECT T0.DocNum FROM OPCH T0 INNER JOIN PCH1 T1
		ON T0.DocNum=T1.DocEntry
		WHERE T0.DocNum=@list_of_cols_val_tab_del AND T0.CANCELED='N' AND T0.DocType='S' AND (T1.Dscription IS NULL OR T1.Dscription=''))
		BEGIN
				SET @error=10
				SET @error_message =N'Description is required.'
		END

		-- ## Validation for Purchase Request Fixed Asset Quantity
		IF EXISTS(SELECT T0.DocEntry FROM OPOR T0 INNER JOIN POR1 T1 ON T0.DocEntry=T1.DocEntry
				WHERE T0.DocEntry=@list_of_cols_val_tab_del AND T0.DocType='I' AND T1.ItemCode LIKE 'FA%' AND T1.Quantity > 1)
		BEGIN
				SET @error=11
				SET @error_message ='13- Quantity for Fixed Assets should not be greater than 1.' 
		END

		--To check if the serial number in AP Invoice matches with the GRPO
		DECLARE @Var1 as int
		DECLARE @Var2 as int

		SELECT @Var1 = COUNT(T0.SerialNum)  FROM PCH1 T0
				INNER JOIN OPCH T1 ON T0.DOCENTRY = T1.DocNum AND T1.CANCELED = 'N'
				WHERE T1.DocNum = @list_of_cols_val_tab_del AND T0.ITEMCODE LIKE 'FA%'
				AND T0.SerialNum IN (SELECT TA.SerialNo FROM PCH23 TA
				WHERE TA.SerialNo = T0.SerialNum AND TA.DocEntry =  @list_of_cols_val_tab_del AND T0.LineNum = TA.LineNum )
		SELECT @Var2 = COUNT(T0.SerialNum) FROM PCH1 T0
				INNER JOIN OPCH T1 ON T0.DOCENTRY = T1.DocNum AND T1.CANCELED = 'N' 
				WHERE T1.DocNum = @list_of_cols_val_tab_del AND T0.ITEMCODE LIKE 'FA%'
			IF @Var1 <> @Var2
			BEGIN
				SET @error=12
				SET @error_message =N'Fixed Asset serial number(s) in AP Invoice does not match with the GRPO.'
			END

		--To check the computation of Withholding Tax
		--SET @fActualWTax = (SELECT ROUND(SUM(WTAmnt),2) FROM PCH5 WHERE AbsEntry=@list_of_cols_val_tab_del)

		--SET @fStandardWtax = (SELECT ROUND(SUM(( Max1099 -T0.VatSum) * ROUND((T1.Rate/100),2)),2) FROM  OPCH T0 INNER JOIN PCH5 T1
		--ON T0.DocNum=T1.AbsEntry
		--WHERE T0.DocNum=@list_of_cols_val_tab_del)

		--IF @fActualWTax <> @fStandardWtax
		--BEGIN
		--	SET @error=13
		--	SET @error_message =N'Incorrect withholding tax computation.'
		--END

		--To ensure that there is a Vendor Reference Number
		IF EXISTS (SELECT DocEntry FROM OPCH
					WHERE DocEntry = @list_of_cols_val_tab_del  AND (NumAtCard='' OR NumAtCard IS NULL)) 
		BEGIN
			SET @error=14
			SET @error_message =N'Vendor reference number is required.'
		END

		--To Check if Document has GRPO Entry for Item Type
		IF EXISTS (SELECT T1.[DocNum] FROM OPCH T1 INNER JOIN PCH1 T2 ON T1.DocEntry=T2.DocEntry
		WHERE T1.[DocNum]=@list_of_cols_val_tab_del AND T1.DocType='I' AND T2.WhsCode NOT LIKE '%DS' AND ((T2.BaseRef='' OR T2.BaseRef IS NULL) OR T2.BaseType != 20) AND T1.CANCELED='N')
		BEGIN
			SET @error=15
			SET @error_message =N'Goods Receipt PO is required for Item Type transactions.'
		END

		--To check if the Price is zero
		IF EXISTS(SELECT DocEntry FROM PCH1
					WHERE DocEntry=@list_of_cols_val_tab_del AND ((U_PriceBfrDisc=0.00 OR U_PriceBfrDisc IS NULL) OR PriceAfVAT=0))
		BEGIN
			
			SET @error=16
			SET @error_message =N'Unit Cost before and after discount is required.'

		END

		--To check if the store performance warehouse belongs to the assigned branch
		IF EXISTS (SELECT DISTINCT T0.DocNum FROM OPCH T0 INNER JOIN PCH1 T1
		ON T0.DocNum=T1.DocEntry INNER JOIN OOCR T2
		ON T1.OcrCode=T2.OcrCode INNER JOIN OWHS T3
		ON T2.U_Whse=T3.WhsCode
		WHERE T0.DocNum=@list_of_cols_val_tab_del AND T0.BPLId != T3.BPLid  AND T0.DocType='S')
		BEGIN
				SET @error=17
				SET @error_message =N'Store Performance should belongs to the assigned branch.'
		END

		--To check the existency of document reference (AR invoice) used for Drop Ship Transaction
		-- IF  EXISTS(SELECT T0.DocEntry FROM OPCH T0 INNER JOIN PCH1 T1 ON T0.DocEntry=T1.DocEntry
		-- 			INNER JOIN OWHS T2 ON T1.WhsCode=T2.WhsCode
		-- 			 WHERE T0.DocEntry=@list_of_cols_val_tab_del AND T2.DropShip='Y' AND T0.CANCELED='N')
		-- BEGIN
		-- 		IF NOT EXISTS (SELECT DocEntry FROM PCH21 WHERE DocEntry=@list_of_cols_val_tab_del AND ObjectType=18 AND RefObjType = 13)
		-- 		BEGIN

		-- 			SET @error=7
		-- 			SET @error_message =N'AR Invoice referenced document is required.'

		-- 		END

		-- 		ELSE
		-- 		BEGIN

		-- 			SELECT @iRefDoc =  T1.RefDocNum FROM OPCH T0 INNER JOIN PCH21 T1 ON T0.DocNum=T1.DocEntry
		-- 			WHERE T0.DocNum=@list_of_cols_val_tab_del AND T1.RefObjType=13

		-- 			IF (SELECT COUNT(RefDocNum) FROM PCH21 WHERE RefDocNum = @iRefDoc AND RefObjType = 13) > 1
		-- 			BEGIN
		-- 					SET @error=7
		-- 					SET @error_message =N'AR Invoice referenced document already exist.'
		-- 			END
		-- 			ELSE IF (SELECT COUNT(RefDocNum) FROM PCH21 WHERE DocEntry=@list_of_cols_val_tab_del AND ObjectType=18 AND RefObjType != 13) > 0
		-- 			BEGIN
		-- 					SET @error=7
		-- 					SET @error_message =N'Select AR Invoice as Transaction Type in the referenced document field.'
		-- 			END

		-- 		END
				
		-- END
        --COMMENTED BY AC 2023/04/05
		
		--To check the valid control account of AP Invoice-Service Type
		IF EXISTS(SELECT DocNum FROM OPCH T0 INNER JOIN OACT T1 ON T0.CtlAccount=T1.AcctCode
					INNER JOIN PCH1 T2 ON T0.DocNum=T2.DocEntry
					WHERE T0.DocNum =@list_of_cols_val_tab_del AND T2.OcrCode != T1.AccntntCod AND T0.DocType='S' AND T0.CANCELED='N')
		BEGIN

			SET @error=7
			SET @error_message =N'Invalid Control Account, update remarks.'

		END

		--To check the valid control account of AP Invoice-Item Type
		IF EXISTS(SELECT DocNum FROM OPCH T0 INNER JOIN OACT T1 ON T0.CtlAccount=T1.AcctCode
					INNER JOIN PCH1 T2 ON T0.DocNum=T2.DocEntry
					WHERE T0.DocNum =@list_of_cols_val_tab_del AND T1.Details NOT LIKE '%' + T2.WhsCode + '%' AND T0.DocType='I' AND T0.CANCELED='N')
		BEGIN

			SET @error=7
			SET @error_message =N'Invalid Control Account, update remarks.'

		END

		--To check for any price changes from the Vendor
		SELECT @cType=DocType  FROM OPCH WHERE DocNum = @list_of_cols_val_tab_del

		IF  @cType = 'I'
		BEGIN

			IF EXISTS (SELECT PriceAfVAT FROM PCH1 T0 INNER JOIN OPCH T2 ON T0.DocEntry=T2.DocNum
						 WHERE T2.DocNum=@list_of_cols_val_tab_del AND T0.ItemCode LIKE 'FA%'
						AND PriceAfVAT != (SELECT T1.PriceAfVAT FROM PDN1  T1 WHERE T1.DocEntry = T0.BaseRef AND T1.ItemCode=T0.ItemCode AND T1.SerialNum=T0.SerialNum) 
						AND T0.BaseType=20 AND T2.U_APCPriceAp='N' AND T0.ItemCode LIKE 'FA%')
			BEGIN
				
					SET @error=7
					SET @error_message =N'An approval is required for price changes from Vendor. Set the Price Change Approval field to Y.'

			END
			ELSE IF EXISTS (SELECT PriceAfVAT FROM PCH1 T0 INNER JOIN OPCH T2 ON T0.DocEntry=T2.DocNum
						 WHERE T2.DocNum=@list_of_cols_val_tab_del AND T0.ItemCode NOT LIKE 'FA%'
						AND PriceAfVAT != (SELECT T1.PriceAfVAT FROM PDN1  T1 WHERE T1.DocEntry = T0.BaseRef AND T1.ItemCode=T0.ItemCode AND T0.FreeTxt = T1.FreeTxt)  -- BRYLE 01/20/2023 -- AP INVOICE SUBQUERY MORE THAN 1 ->  (AND T0.FreeTxt = T1.FreeTxt)
						AND T0.BaseType=20 AND T2.U_APCPriceAp='N' AND T0.ItemCode NOT LIKE 'FA%')
			BEGIN
				
					SET @error=7
					SET @error_message =N'An approval is required for price changes from Vendor. Set the Price Change Approval field to Y.'

			END

		END
		ELSE
		BEGIN

			IF EXISTS(SELECT PriceAfVAT FROM PCH1 T0 INNER JOIN OPCH T2 ON T0.DocEntry=T2.DocNum
						 WHERE T2.DocNum=@list_of_cols_val_tab_del
						AND PriceAfVAT != (SELECT T1.PriceAfVAT FROM POR1 T1 WHERE T1.DocEntry = T0.BaseRef AND T1.AcctCode=T0.AcctCode AND T1.Dscription=T0.Dscription) 
						AND T0.BaseType=22 AND T2.U_APCPriceAp='N')
			BEGIN

				SET @error=7
				SET @error_message =N'An approval is required for price changes from Vendor. Set the Price Change Approval field to Y.'

			END

		END

    --To block if store performance is empty-APINV
    IF EXISTS (SELECT DISTINCT OPCH.DocEntry FROM PCH1 INNER JOIN OPCH ON OPCH.DocEntry = PCH1.DocEntry WHERE OcrCode IS NULL AND OPCH.DocEntry = @list_of_cols_val_tab_del AND DocType = 'I')
    BEGIN
        SET @error=8
        SET @error_message =N'Store Perfomance is required.'
    END

END


--Validation for AP Down Payment Invoice
IF @object_type = '204' AND (@transaction_type='A' OR @transaction_type='U')
	BEGIN 

		--To check if the user applied payment means
		IF @transaction_type='A' 
		BEGIN
			IF EXISTS(SELECT DocNum,DocTotal,PaidToDate,U_DocSeries FROM ODPO WHERE DocNum=@list_of_cols_val_tab_del AND PaidToDate != 0)
			BEGIN
				SET @error=1
				SET @error_message =N'Payment means is not allowed.'
			END
		END

		--To check if multiple code for store performance exist in one document entry
		IF exists (SELECT DocEntry FROM ODPO  WHERE DocEntry=@list_of_cols_val_tab_del AND DocType='S')
		BEGIN
			SELECT @iCntWhse =  COUNT(Distinct OcrCode) FROM DPO1  WHERE DocEntry=@list_of_cols_val_tab_del
			IF @iCntWhse > 1
			BEGIN
				SET @error=2
				SET @error_message =N'Multiple store performance is not allowed.' 
			END
		END

		--To check if there's a remarks
		IF exists (SELECT DocEntry FROM ODPO WHERE DocEntry=@list_of_cols_val_tab_del AND (Comments='' OR Comments IS NULL))
		BEGIN
			SET @error=3
			SET @error_message =N'Remarks is required.' 
		END

		--To check if APDPI Amount is greater than PO Amount  
		SELECT DISTINCT @iBaseRef = BaseRef FROM DPO1 WHERE DocEntry = @list_of_cols_val_tab_del
		SELECT @fPO_Amount = CASE WHEN OPOR.DocTotalFC > 0 THEN OPOR.DocTotalFC ELSE OPOR.DocTotal END FROM OPOR WHERE OPOR.DocEntry = @iBaseRef 
		SELECT @fAP_Amount = SUM(AP.DocTotal) FROM  (SELECT DISTINCT t0.DocEntry, 
				(CASE WHEN t0.DocTotalFC > 0 then t0.DocTotalFC ELSE t0.DocTotalSy END) - (CASE WHEN t0.PaidFC > 0 then t0.PaidFC ELSE t0.PaidSys END) AS DocTotal 
				FROM ODPO t0 INNER JOIN DPO1 t1 ON t0.DocEntry = t1.DocEntry
		WHERE t1.BaseRef = @iBaseRef AND CANCELED = 'N') AS AP
	
		IF @fAP_Amount > @fPO_Amount + .05
		BEGIN 
			SET @error=4
			SET @error_message =N'AP Down Payment exceeds PO amount.' 
		END

		--To check if the Total Down Payment Amount (UDF) Exceeds the Document Total Amount (DocTotal) of APDPR
		IF EXISTS (SELECT DocEntry FROM ODPO WHERE DocEntry=@list_of_cols_val_tab_del AND CANCELED = 'N' AND CreateTran='N' 
				GROUP BY DocEntry, DocTotalFC
			HAVING (SUM(U_1st_PAYMENT+U_2nd_PAYMENT+U_3rd_PAYMENT+U_4th_PAYMENT+U_5th_PAYMENT+
			U_6th_PAYMENT+U_7th_PAYMENT+U_8th_PAYMENT+U_9th_PAYMENT+U_10th_PAYMENT) > DocTotalFC))
		
		BEGIN
			SET @error=5
			SET @error_message =N'Total down payment amount exceeds the document total amount.' 
 		END	

		--To check if the APDPR has multiple PO
		--IF (SELECT COUNT(DISTINCT T0.DocNum) FROM ODPO T0 INNER JOIN  DPO1 T1
		--ON T0.DocNum=T1.DocEntry
		--WHERE T0.CANCELED='N' AND T0.CreateTran='N' AND T1.BaseRef=(SELECT BaseRef FROM DPO1 WHERE DocEntry=@list_of_cols_val_tab_del)) > 1
		--BEGIN
		--	SET @error=10
		--	SET @error_message =N'Only one (1) APDPR should be created in particular PO' 
		--END
		
		--To check if the description field is empty for Service Type transaction
		IF EXISTS (SELECT T0.DocNum FROM ODPO T0 INNER JOIN DPO1 T1
		ON T0.DocNum=T1.DocEntry
		WHERE T0.DocNum=@list_of_cols_val_tab_del AND T0.CANCELED='N' AND T0.DocType='S' AND (T1.Dscription IS NULL OR T1.Dscription=''))
		BEGIN
				SET @error=6
				SET @error_message =N'Description is required.'
		END

		--To check the computation of Withholding Tax
		SET @fActualWTax = (SELECT ROUND(SUM(WTAmnt),2) FROM DPO5 WHERE AbsEntry=@list_of_cols_val_tab_del)

		SET @fStandardWtax = (SELECT ROUND(SUM((Max1099-T0.VatSum) * ROUND((T1.Rate/100),2)),2) FROM  ODPO T0 INNER JOIN DPO5 T1
		ON T0.DocNum=T1.AbsEntry
		WHERE T0.DocNum=@list_of_cols_val_tab_del)

		IF @fActualWTax <> @fStandardWtax
		BEGIN
			SET @error=7
			SET @error_message =N'Invalid withholding tax amount.'
		END

		--To ensure that there is a Vendor Reference Number
		IF EXISTS (SELECT DocEntry FROM ODPO
					WHERE DocEntry = @list_of_cols_val_tab_del  AND (NumAtCard='' OR NumAtCard IS NULL) AND CreateTran='N') 
		BEGIN
			SET @error=8
			SET @error_message =N'Vendor reference number is required.'
		END

		--To ensure that the Payment Batch Series is equivalent to the number of Outgoing Payment posted
		IF EXISTS (SELECT DocEntry FROM ODPO WHERE DocEntry = @list_of_cols_val_tab_del  AND CreateTran='N') 
		BEGIN
			SET @fCountOP = (SELECT COUNT(T1.DocNum) FROM VPM2 T0 INNER JOIN ODPO T1 ON T0.DocEntry=T1.DocNum
			WHERE T1.DocNum=@list_of_cols_val_tab_del AND T0.InvType=204 AND T1.CANCELED='N') + 1

			SET @fCountAPDP = (SELECT CASE WHEN U_1ST_PAYMENT_SERIES !='' OR  U_1ST_PAYMENT_SERIES IS NOT NULL THEN 1 ELSE 0 END +
					CASE WHEN U_2ND_PAYMENT_SERIES !='' OR  U_2ND_PAYMENT_SERIES IS NOT NULL THEN 1 ELSE 0 END +
					CASE WHEN U_3RD_PAYMENT_SERIES !='' OR  U_3RD_PAYMENT_SERIES IS NOT NULL THEN 1 ELSE 0 END +
					CASE WHEN U_4TH_PAYMENT_SERIES !='' OR  U_4TH_PAYMENT_SERIES IS NOT NULL THEN 1 ELSE 0 END +
					CASE WHEN U_5TH_PAYMENT_SERIES !='' OR  U_5TH_PAYMENT_SERIES IS NOT NULL THEN 1 ELSE 0 END +
					CASE WHEN U_6TH_PAYMENT_SERIES !='' OR  U_6TH_PAYMENT_SERIES IS NOT NULL THEN 1 ELSE 0 END +
					CASE WHEN U_7TH_PAYMENT_SERIES !='' OR  U_7TH_PAYMENT_SERIES IS NOT NULL THEN 1 ELSE 0 END +
					CASE WHEN U_8TH_PAYMENT_SERIES !='' OR  U_8TH_PAYMENT_SERIES IS NOT NULL THEN 1 ELSE 0 END +
					CASE WHEN U_9TH_PAYMENT_SERIES !='' OR  U_9TH_PAYMENT_SERIES IS NOT NULL THEN 1 ELSE 0 END +
					CASE WHEN U_10TH_PAYMENT_SERIES !='' OR  U_10TH_PAYMENT_SERIES IS NOT NULL THEN 1 ELSE 0 END
			FROM ODPO WHERE DocNum=@list_of_cols_val_tab_del)

			IF @fCountOP != @fCountAPDP
			BEGIN
				SET @error=9
				SET @error_message =N'Only one payment series should be generated for payment no. ' + CONVERT(varchar(2),@fCountOP)
			END
		END

		--To ensure that there is a Vendor Reference Number
		IF EXISTS (SELECT DocEntry FROM ODPO
					WHERE DocEntry = @list_of_cols_val_tab_del  AND (NumAtCard='' OR NumAtCard IS NULL)) 
		BEGIN
			SET @error=10
			SET @error_message =N'Vendor reference number is required.'
		END

		--To check if the Price is zero
		IF EXISTS(SELECT DocEntry FROM DPO1
					WHERE DocEntry=@list_of_cols_val_tab_del AND ((U_PriceBfrDisc=0.00 OR U_PriceBfrDisc IS NULL) OR PriceAfVAT=0))
		BEGIN
			
			SET @error=11
			SET @error_message =N'Unit Cost before and after discount is required.'

		END

		--To check if the store performance warehouse belongs to the assigned branch
		IF EXISTS (SELECT DISTINCT T0.DocNum FROM ODPO T0 INNER JOIN DPO1 T1
		ON T0.DocNum=T1.DocEntry INNER JOIN OOCR T2
		ON T1.OcrCode=T2.OcrCode INNER JOIN OWHS T3
		ON T2.U_Whse=T3.WhsCode
		WHERE T0.DocNum=@list_of_cols_val_tab_del AND T0.BPLId != T3.BPLid  AND T0.DocType='S')
		BEGIN
				SET @error=12
				SET @error_message =N'Store Performance should belong to the assigned branch.'
		END

		--To check the valid control account of AP Down Payment Invoice-Service Type
		IF EXISTS(SELECT DocNum FROM ODPO T0 INNER JOIN OACT T1 ON T0.CtlAccount=T1.AcctCode
					INNER JOIN DPO1 T2 ON T0.DocNum=T2.DocEntry
					WHERE T0.DocNum =@list_of_cols_val_tab_del AND T2.OcrCode != T1.AccntntCod AND T0.DocType='S' AND T0.CANCELED='N' AND T0.CreateTran='Y')
		BEGIN

			SET @error=7
			SET @error_message =N'Invalid Control Account, update remarks.'

		END

		--To check the valid control account of AP Down Payment Invoice-Item Type
		IF EXISTS(SELECT DocNum FROM ODPO T0 INNER JOIN OACT T1 ON T0.CtlAccount=T1.AcctCode
					INNER JOIN DPO1 T2 ON T0.DocNum=T2.DocEntry
					WHERE T0.DocNum =@list_of_cols_val_tab_del AND T1.Details NOT LIKE '%' +  T2.WhsCode + '%' AND T0.DocType='I' AND T0.CANCELED='N' AND T0.CreateTran='Y')
		BEGIN

			SET @error=7
			SET @error_message =N'Invalid Control Account, update remarks.'

		END

    --To block if store performance is empty-APDPI
    IF EXISTS (SELECT DISTINCT ODPO.DocEntry FROM DPO1 INNER JOIN ODPO ON ODPO.DocEntry = DPO1.DocEntry WHERE OcrCode IS NULL AND ODPO.DocEntry = @list_of_cols_val_tab_del AND DocType = 'I')
    BEGIN
        SET @error=8
        SET @error_message =N'Store Perfomance is required.'
    END

END

--Validation for AP Credit Memo
  -- To Block Cancellation
IF @object_type = '19' AND (@transaction_type='A')

BEGIN

  IF EXISTS (SELECT T0.DocEntry FROM ORPC T0 WHERE T0.DocEntry IN (SELECT A0.DocEntry FROM RPC1 A0 WHERE A0.BaseType = 19 ) AND T0.CANCELED <> 'N' AND T0.DocNum = @list_of_cols_val_tab_del AND T0.U_ReasonCancelCode IS NULL)
BEGIN
  SET @error = 1
  SET @error_message = N'Reason Code for cancellation  is required (APCM).'
END 

-- --To block user listed below from cancelling document 
--IF EXISTS (SELECT T0.DocEntry FROM ORPC T0 WHERE T0.DocEntry IN (SELECT A0.DocEntry FROM RPC1 A0 WHERE A0.BaseType = 19 ) AND T0.CANCELED <> 'N' AND T0.DocNum = @list_of_cols_val_tab_del AND T0.U_USERIDINFO NOT IN(@RESULT_APCM))
--BEGIN
--  SET @error = 2
--  SET @error_message = N'Only allowed User(s) can cancel this document.'
--END	

--To block user listed below from cancelling document 
IF (SELECT CANCELED FROM ORPC WHERE DocNum = @list_of_cols_val_tab_del)  = 'C'
BEGIN
  IF (SELECT U_USERIDINFO FROM ORPC WHERE DOCENTRY = @list_of_cols_val_tab_del) <> 'Y'
    BEGIN
      IF NOT EXISTS (SELECT T0.DocEntry FROM ORPC T0 INNER JOIN dbo.[@REASONCODE] T1 ON T0.U_USERIDINFO = T1.U_UserPosition WHERE T0.CANCELED <> 'N' AND T0.DocNum = @list_of_cols_val_tab_del AND T1.U_MktgDoc = 'APCM' )
        BEGIN
          SET @error = 2
          SET @error_message = N'Only allowed User(s) can cancel this document.'
        END	
    END
END	

END


IF @object_type = '19' AND (@transaction_type='A' OR @transaction_type='U')
	BEGIN 

		--To check if there's a remarks
		IF exists (SELECT DocEntry FROM ORPC WHERE DocEntry=@list_of_cols_val_tab_del AND (Comments='' OR Comments IS NULL))
		BEGIN
			SET @error=1
			SET @error_message =N'Remarks is required.' 
		END

		--To check if multiple code for store performance exist in one document entry
		IF exists (SELECT DocEntry FROM ORPC  WHERE DocEntry=@list_of_cols_val_tab_del)
		BEGIN
			SELECT @iCntWhse =  COUNT(Distinct OcrCode) FROM RPC1  WHERE DocEntry=@list_of_cols_val_tab_del
			IF @iCntWhse > 1
			BEGIN
				SET @error=2
				SET @error_message =N'Multiple store performance is not allowed.' 
			END
		END

		--To check if the description field is empty for Service Type transaction
		IF EXISTS (SELECT T0.DocNum FROM ORPC T0 INNER JOIN RPC1 T1
		ON T0.DocNum=T1.DocEntry
		WHERE T0.DocNum=@list_of_cols_val_tab_del AND T0.CANCELED='N' AND T0.DocType='S' AND (T1.Dscription IS NULL OR T1.Dscription=''))
		BEGIN
				SET @error=3
				SET @error_message =N'Description is required.'
		END

		--To check if there are Store Perfromance assigned for Service Type
		IF EXISTS(SELECT T0.DocEntry FROM ORPC T0 INNER JOIN RPC1 T1 ON T0.DocEntry=T1.DocEntry
					WHERE T0.DocEntry=@list_of_cols_val_tab_del AND T0.DocType='S' AND ((OcrCode = '' OR OcrCode IS NULL)))
		BEGIN
			SET @error=4
			SET @error_message = N'Store Performance is required.' 
		END
	
		--To check if there are Expenses by Function assigned for Service Type
		IF EXISTS(SELECT T0.DocEntry FROM ORPC T0 INNER JOIN RPC1 T1 ON T0.DocEntry=T1.DocEntry
					WHERE T0.DocEntry=@list_of_cols_val_tab_del AND T0.DocType='S' AND ((OcrCode2 = '' OR OcrCode2 IS NULL)))
		BEGIN
			SET @error=5
			SET @error_message = N'Expenses by Function is required.' 
		END

		--To check if there is Withholding Tax computation for the customer that has WTax Certificate
		IF EXISTS(SELECT T0.DocEntry FROM RPC1 T0 INNER JOIN OPCH T1
					ON T0.BaseRef=T1.DocNum INNER JOIN ORPC T2
					ON T0.DocEntry=T2.DocNum
					WHERE T0.DocEntry=@list_of_cols_val_tab_del AND T0.BaseType=18 AND T1.WTSumSC > 0 AND T1.CANCELED='N' AND T2.WTSumSC=0)
		BEGIN
			SET @error=6
			SET @error_message =N'Withholding tax computation is required.'
		END

		--To check the computation of Withholding Tax
		SET @fActualWTax = (SELECT ROUND(SUM(WTAmnt),2) FROM RPC5 WHERE AbsEntry=@list_of_cols_val_tab_del)

		SET @fStandardWtax = (SELECT ROUND(SUM((Max1099-T0.VatSum) * ROUND((T1.Rate/100),2)),2) FROM  ORPC T0 INNER JOIN RPC5 T1
		ON T0.DocNum=T1.AbsEntry
		WHERE T0.DocNum=@list_of_cols_val_tab_del)

		IF @fActualWTax <> @fStandardWtax
		BEGIN
			SET @error=7
			SET @error_message =N'Incorrect withholding tax computation.'
		END

		--To ensure that there is a Vendor Reference Number
		IF EXISTS (SELECT DocEntry FROM ORPC
					WHERE DocEntry = @list_of_cols_val_tab_del  AND (NumAtCard='' OR NumAtCard IS NULL)) 
		BEGIN
			SET @error=8
			SET @error_message =N'Vendor reference number is required.'
		END

		--To check if the store performance warehouse belongs to the assigned branch
		IF EXISTS (SELECT DISTINCT T0.DocNum FROM ORPC T0 INNER JOIN RPC1 T1
		ON T0.DocNum=T1.DocEntry INNER JOIN OOCR T2
		ON T1.OcrCode=T2.OcrCode INNER JOIN OWHS T3
		ON T2.U_Whse=T3.WhsCode
		WHERE T0.DocNum=@list_of_cols_val_tab_del AND T0.BPLId != T3.BPLid  AND T0.DocType='S')
		BEGIN
				SET @error=9
				SET @error_message =N'Store Performance should belongs to the assigned branch.'
		END

		--To check the valid control account of AP Credit Memo-Service Type
		IF EXISTS(SELECT DocNum FROM ORPC T0 INNER JOIN OACT T1 ON T0.CtlAccount=T1.AcctCode
					INNER JOIN RPC1 T2 ON T0.DocNum=T2.DocEntry
					WHERE T0.DocNum =@list_of_cols_val_tab_del AND T2.OcrCode != T1.AccntntCod AND T0.DocType='S' AND T0.CANCELED='N')
		BEGIN

			SET @error=7
			SET @error_message =N'Invalid Control Account, update remarks.'

		END

		--To check the valid control account of AP Credit Memo-Item Type
		IF EXISTS(SELECT DocNum FROM ORPC T0 INNER JOIN OACT T1 ON T0.CtlAccount=T1.AcctCode
					INNER JOIN RPC1 T2 ON T0.DocNum=T2.DocEntry
					WHERE T0.DocNum =@list_of_cols_val_tab_del AND T1.Details NOT LIKE '%' +  T2.WhsCode + '%' AND T0.DocType='I' AND T0.CANCELED='N')
		BEGIN

			SET @error=7
			SET @error_message =N'Invalid Control Account, update remarks.'

		END

    --To block if store performance is empty-APCM
    IF EXISTS (SELECT DISTINCT ORPC.DocEntry FROM RPC1 INNER JOIN ORPC ON ORPC.DocEntry = RPC1.DocEntry WHERE OcrCode IS NULL AND ORPC.DocEntry = @list_of_cols_val_tab_del AND DocType = 'I')
    BEGIN
        SET @error=8
        SET @error_message =N'Store Perfomance is required.'
    END

END

--IF @object_type = '60' AND (@transaction_type='A' OR @transaction_type='U')
--	BEGIN 

--		IF EXISTS(SELECT T0.DocEntry FROM OIGE T0 INNER JOIN IGE1 T1 ON T0.DocEntry=T1.DocEntry
--				   WHERE T0.DocEntry=@list_of_cols_val_tab_del AND T0.U_ReasonCode='For Disposal' AND (T1.U_TransInvNum='' or T1.U_TransInvNum IS NULL))
--		BEGIN
--			SET @error=10
--			SET @error_message =N'Transfer Inventory Reference# is required.' 
--		END
	
			
--END

--Validation for Landed Cost
IF @object_type = '69' AND (@transaction_type='A' OR @transaction_type='U')
	BEGIN 

		--To ensure that there is a Broker assigned
		IF EXISTS(SELECT DocEntry FROM OIPF WHERE DocEntry=@list_of_cols_val_tab_del AND AgentCode IS NULL)
		BEGIN
			SET @error=1
			SET @error_message =N'Broker is required.' 
		END

		--To ensure that there is a Reference Number in Landed Cost
		IF EXISTS (SELECT DocEntry FROM OIPF
				 WHERE DocEntry = @list_of_cols_val_tab_del  AND (Ref1='' OR Ref1 IS NULL)) 
		BEGIN
			SET @error=2
			SET @error_message =N'Reference Number is required.'
		END
		
		--To check if there's a remarks
		IF exists (SELECT DocEntry FROM OIPF WHERE DocEntry=@list_of_cols_val_tab_del AND (Descr='' OR Descr IS NULL))
		BEGIN
			SET @error=3
			SET @error_message =N'Remarks is required.' 
		END

END

--## Validation for AR Invoice ##--

    --To block user not allowed for Cancellation in AR Invoice
IF (@object_type = '13')  AND (@transaction_type='A') 

BEGIN  

DECLARE @USERPOSITION_ARIN VARCHAR(2)
SELECT @USERPOSITION_ARIN = U_UserPosition FROM [@REASONCODE] WHERE U_MktgDoc = 'ARIN'

DECLARE @RESULT VARCHAR(2)
SELECT @RESULT = (CASE WHEN U_USERIDINFO = 'Y' THEN 'Y' ELSE @USERPOSITION_ARIN END) FROM OINV WHERE DOCENTRY = @list_of_cols_val_tab_del


IF EXISTS (SELECT T0.DocEntry FROM OINV T0 WHERE T0.DocEntry IN (SELECT A0.DocEntry FROM INV1 A0 WHERE A0.BaseType = 13 ) AND T0.CANCELED <> 'N' AND T0.DocNum = @list_of_cols_val_tab_del AND T0.U_ReasonCancelCode IS NULL)
BEGIN
  SET @error = 1
  SET @error_message = N'Reason Code for cancellation  is required (AR Invoice).'
END 

 --To block user listed below from cancelling document 
IF EXISTS (SELECT T0.DocEntry FROM OINV T0 WHERE T0.DocEntry IN (SELECT A0.DocEntry FROM INV1 A0 WHERE A0.BaseType = 13 ) AND T0.CANCELED <> 'N' AND T0.DocNum = @list_of_cols_val_tab_del AND T0.U_USERIDINFO NOT IN(@RESULT))
BEGIN
	  SET @error = 2
	  SET @error_message = N'Only allowed User(s) can cancel this document.'

	END
END

IF (@object_type = '13')  AND (@transaction_type='A' OR @transaction_type='U')
	BEGIN 


			--To ensure that the walk-in customer has its actual customer name
			IF exists (SELECT T0.DocEntry FROM OINV T0  WHERE T0.DocEntry=@list_of_cols_val_tab_del AND T0.CardCode IN ('C000107','C000132','C000111','C000112','C000091') AND (T0.U_Customer = '' OR T0.U_Customer IS NULL) AND T0.isICT = 'Y')
			BEGIN
					SET @error=1
					SET @error_message =N'Customer Name is required'
			END


		--To Check if Document Series is generated
		IF exists (SELECT T1.[DocNum] FROM OINV T1 WHERE T1.[DocNum]=@list_of_cols_val_tab_del 
		AND (T1.[U_DocSeries]LIKE '%N/A%' OR (T1.[U_DocSeries] IS NULL OR T1.[U_DocSeries] ='')))
		BEGIN
			SET @error=1
			SET @error_message =N'Document Series must be provided in this transaction.'
		END


		--To Check if Document Series is generated
		IF exists (SELECT T1.[DocNum] FROM OINV T1 WHERE T1.[DocNum]=@list_of_cols_val_tab_del 
		AND (T1.[U_DocSeries]LIKE '%N/A%' OR (T1.[U_DocSeries] IS NULL OR T1.[U_DocSeries] ='')) AND T1.isICT = 'Y')
		BEGIN
			SET @error=1
			SET @error_message =N'Document Series must be provided in this transaction.'
		END



		 --To Check if there is duplicated Document Series
		 SELECT @vDocSeries = U_DocSeries FROM OINV WHERE DocNum=@list_of_cols_val_tab_del 

		IF (SELECT COUNT(U_DocSeries) FROM OINV WHERE DocNum <> @list_of_cols_val_tab_del AND U_DocSeries=@vDocSeries AND CANCELED='N') > 0
		BEGIN
			SET @error=2
			SET @error_message =N'Duplicate document series is not allowed.'
		END

		--To check if the Document Series and Warehouse or Store Performance selected is matched
--		IF exists (SELECT DocEntry FROM OINV WHERE DocEntry=@list_of_cols_val_tab_del AND DocType='I')
--		BEGIN
--
--			SET @vExtWhse = (SELECT DISTINCT LEFT(T1.WhsCode, 6)  FROM INV1 T0 INNER JOIN OWHS T1 ON T0.WhsCode=T1.U_WhseExt WHERE T0.Docentry=@list_of_cols_val_tab_del)
--
--			IF((SELECT LEFT(T0.U_DocSeries, 6)  FROM OINV T0
--			WHERE T0.[DocNum]=@list_of_cols_val_tab_del) 
--			<>
--			(SELECT DISTINCT LEFT(T0.WhsCode, 6)  FROM INV1 T0
--			WHERE T0.Docentry=@list_of_cols_val_tab_del)
--			AND 
--			(SELECT LEFT(T0.U_DocSeries, 6)  FROM OINV T0
--			WHERE T0.[DocNum]=@list_of_cols_val_tab_del) <> CASE WHEN @vExtWhse IS NULL THEN '' ELSE @vExtWhse END)
--			BEGIN
--				SET @error=3
--				SET @error_message ='Document series should be matched with the selected warehouse.'
--			END
--		END
--		ELSE IF exists (SELECT DocEntry FROM OINV WHERE DocEntry=@list_of_cols_val_tab_del AND DocType='S')
--		BEGIN
--			IF(SELECT LEFT(T0.U_DocSeries, 6)  FROM OINV T0
--			WHERE T0.[DocNum]=@list_of_cols_val_tab_del) 
--			<>
--			(SELECT TOP 1 LEFT(T1.U_Whse,6) FROM INV1 T0 INNER JOIN OOCR T1
--			ON T0.OcrCode=T1.OcrCode
--			WHERE T0.Docentry=@list_of_cols_val_tab_del)
--			BEGIN
--				SET @error=3
--				SET @error_message ='Document series should be matched with the selected store performance.'
--			END
--		END
		
		--To Check if Document has Sales Order Entry
		IF exists (SELECT T1.[DocNum] FROM OINV T1 INNER JOIN INV1 T2 ON T1.DocEntry=T2.DocEntry
		 WHERE T1.[DocNum]=@list_of_cols_val_tab_del AND T1.DocType='I' AND T1.U_SOType != 'IB' AND (T2.BaseRef='' OR T2.BaseRef IS NULL) AND T1.IsICT = 'N')
		BEGIN
			SET @error=4
			SET @error_message =N'Sales Order must be created for AR Invoice (Item Type).'
		END

		--To check if the user applied payment means for Credit Memo and Due to Customer
		IF @transaction_type='A'
		BEGIN
			IF EXISTS(SELECT DocNum,DocTotal,PaidToDate,U_DocSeries FROM oinv WHERE DocNum=@list_of_cols_val_tab_del AND PaidToDate > 0 AND (U_SO_CM='Y' OR U_SO_DTC='Y') AND DocType != 'S' AND CANCELED='N' )
			BEGIN
				SET @error=5
				SET @error_message =N'Payment means is not allowed for Cedit Memo or Due To Customer mode of payment.'
			END
		END

		--To check if the user applied payment means for Cash Invoice
		SELECT @iBaseRef = BaseRef FROM INV1 WHERE DocEntry=@list_of_cols_val_tab_del
		--Modify 01/30/2024
		IF EXISTS(SELECT DocNum FROM OINV WHERE DocNum=@list_of_cols_val_tab_del AND (U_SO_PDC='Y' OR U_BO_PDC='Y' OR U_SO_ODC = 'Y' OR U_BO_ODC = 'Y') AND CANCELED='N')
		BEGIN

				IF NOT EXISTS (SELECT DocEntry FROM  DPI1 WHERE BaseRef = @iBaseRef)
				BEGIN

						IF EXISTS(SELECT DocNum FROM OINV WHERE DocNum=@list_of_cols_val_tab_del AND U_UnAppAmt >= DocTotal AND PaidToDate > 0)
						BEGIN
								SET @iApp=0
								SET @error=6
								SET @error_message =N'Payment means is not applicable for this transaction. Unapplied amount is greater than the current invoice amount.'

						END
						--ELSE IF EXISTS(SELECT DocNum FROM OINV WHERE DocNum=@list_of_cols_val_tab_del AND U_UnAppAmt != 0 AND U_UnAppAmt < DocTotal AND U_UnAppAmt != (DocTotal-PaidToDate))
						--BEGIN
						--		SET @iApp=1
						--		SET @error=6
						--		SET @error_message =N'Payment means should be net of the unapplied invoice amount.'
						--END
						ELSE IF EXISTS(SELECT DocNum FROM OINV WHERE DocNum=@list_of_cols_val_tab_del AND U_UnAppAmt = 0 AND PaidToDate=0)
						BEGIN
								SET @iApp=0
								SET @error=6
								SET @error_message =N'Payment means is required for Post Dated Check.'
						END
						ELSE
						BEGIN
								SET @iApp=1
						END

						IF @iApp= 1 
						BEGIN

							IF EXISTS(SELECT T0.DocNum,T1.DocEntry,T0.CheckNum,T0.DueDate FROM RCT1 T0 INNER JOIN RCT2  T1
								ON T0.DocNum=T1.DocNum  INNER JOIN ORCT T2
								ON T1.DocNum=T2.DocNum
								WHERE T1.DocEntry=@list_of_cols_val_tab_del AND T1.InvType=13  AND T0.DueDate <= CONVERT( varchar, T2.taxdate, 101) AND T0.U_ChkType = 'Post Dated')
							BEGIN
									SET @error=6
									SET @error_message =N'For Post Dated Checks, due date should be greater than the current date.'
							END
							--MODIFY 01/30/2024
							ELSE IF EXISTS(SELECT T0.DocNum,T1.DocEntry,T0.CheckNum,T0.DueDate FROM RCT1 T0 INNER JOIN RCT2  T1
											ON T0.DocNum=T1.DocNum 
											WHERE T1.DocEntry=@list_of_cols_val_tab_del AND T1.InvType=13   AND (T0.U_PRNum='' OR T0.U_PRNum IS NULL) )
							BEGIN
									SET @error=611
									SET @error_message =N'CR No. is required for Check Payment.'
							END

						END
				END
						
		END

		--To check if the user applied payment means (whole amount) for Charge Invoice
--		IF @transaction_type='A'
--		BEGIN
--			IF EXISTS(SELECT DocNum,DocTotal,PaidToDate,U_DocSeries FROM oinv WHERE DocNum=@list_of_cols_val_tab_del AND (DocTotal = PaidToDate) AND (U_BO_PO ='Y'  OR U_SO_PO ='Y' OR U_SO_COD='Y' OR U_SO_HO='Y' OR U_BO_HO='Y' OR U_BO_COD='Y') AND DocType != 'S' AND CANCELED='N' )
--			BEGIN
--			
--				SET @error=7
--				SET @error_message =N'Full Payment is not allowed for Charge Invoice.'
--			END
--		END

		--To Check if WTax Received By is inputted when Wtax Certificate received.
		IF exists (SELECT T1.[DocNum] FROM OINV T1 WHERE T1.[DocNum]=@list_of_cols_val_tab_del 
		AND T1.U_WTax='Received' AND (T1.U_WTaxRecBy IS NULL OR T1.U_WTaxRecBy=''))
		BEGIN
			SET @error=8
			SET @error_message =N'WTax Received By is required.'
		END
		ELSE IF exists (SELECT T1.[DocNum] FROM OINV T1 WHERE T1.[DocNum]=@list_of_cols_val_tab_del 
		AND T1.U_WTax='Received' AND (T1.U_WTaxRecDate IS NULL OR T1.U_WTaxRecDate=''))
		BEGIN
			SET @error=9
			SET @error_message =N'WTax Received Date is required.'
		END
		ELSE IF exists (SELECT T1.[DocNum] FROM OINV T1 WHERE T1.[DocNum]=@list_of_cols_val_tab_del 
		AND (T1.U_WTax='N/A' OR T1.U_WTax='Not Received') AND (T1.U_WTaxRecBy IS NOT NULL OR T1.U_WTaxRecBy != ''))
		BEGIN
			SET @error=10
			SET @error_message =N'WTax Received By must be empty.'
		END
		ELSE IF exists (SELECT T1.[DocNum] FROM OINV T1 WHERE T1.[DocNum]=@list_of_cols_val_tab_del 
		AND (T1.U_WTax='N/A' OR T1.U_WTax='Not Received') AND (T1.U_WTaxRecDate IS NOT NULL OR T1.U_WTaxRecDate != ''))
		BEGIN
			SET @error=10
			SET @error_message =N'WTax Received Date must be empty.'
		END
		ELSE IF exists (SELECT T1.[DocNum] FROM OINV T1 WHERE T1.[DocNum]=@list_of_cols_val_tab_del 
		AND T1.U_WTax='Received' AND T1.U_WTaxRecDate <> T1.TaxDate)
		BEGIN
			SET @error=9
			SET @error_message =N'WTax Received Date should be matched the Document Date.'
		END

	--To check if the mode of releasing is applicable for AR Invoice/AR Reserve Invoice/AR Down Payment Invoice

--		SELECT DISTINCT @iBaseRef = BaseRef, @vWhseCode=WhsCode, @iOwnerCode = OwnerCode FROM INV1 WHERE DocEntry=@list_of_cols_val_tab_del
--
--		SET @vMainWhse = (LEFT((SELECT Warehouse FROM OHEM T0 INNER JOIN OUSR T1 ON T0.userId=T1.USERID INNER JOIN OUDG T2 ON T1.DfltsGroup=T2.Code WHERE T0.empID =  @iOwnerCode),6))
--		SET @vExtWhse =  (LEFT((SELECT T3.U_WhseExt FROM OHEM T0 INNER JOIN OUSR T1 ON T0.userId=T1.USERID INNER JOIN OUDG T2 ON T1.DfltsGroup=T2.Code INNER JOIN OWHS T3 ON T2.Warehouse=T3.WhsCode AND T1.DfltsGroup=T2.Code WHERE T0.empID =  @iOwnerCode),6))
--
--		IF EXISTS(SELECT DocNum FROM oinv WHERE DocNum=@list_of_cols_val_tab_del AND (U_SO_PKO = 'Y' OR U_SO_DO = 'Y' OR U_BO_PKO ='Y' OR U_BO_DO ='Y' OR U_BO_DSDD='Y' OR U_BO_DSDV='Y' OR U_BO_DSPD='Y' OR U_BO_DRS='Y') AND CANCELED='N')
--		BEGIN
--
--			IF LEFT(@vMainWhse,6) != LEFT(@vWhseCode,6) AND LEFT(CASE WHEN @vExtWhse IS NULL THEN '' ELSE @vExtWhse END,6) != LEFT(@vWhseCode,6)
--			BEGIN
--					SET @error=11
--					SET @error_message =N'User is not allowed to invoice transactions not matched with their default warehouse.'
--			END
--			IF (NOT EXISTS (SELECT DocEntry FROM  DPI1 WHERE BaseRef = @iBaseRef) AND EXISTS (SELECT DocNum FROM oinv WHERE DocNum=@list_of_cols_val_tab_del AND (U_SO_PO = 'N' AND U_BO_PO ='N' AND U_BO_DSPD='N' AND U_BO_DRS='N')))
--			BEGIN
--					SET @error=11
--					SET @error_message =N'AR Down Payment Invoice is required for pick up to other store transactions.'
--			END
--			IF EXISTS(SELECT DocNum FROM OINV T0 INNER JOIN INV1 T1 ON T0.DocNum=T1.DocEntry WHERE T0.DocNum=@list_of_cols_val_tab_del AND T0.isIns='N' AND T1.U_PickUpLoc ='WHS' AND T0.CANCELED = 'N' AND (T0.U_SO_PKO = 'Y' OR T0.U_BO_PKO = 'Y'))
--			BEGIN
--					SET @error=11
--					SET @error_message = N'Use AR Reserve Invoice for pick up to warehouse transactions.'
--			END
--			IF EXISTS(SELECT DocNum FROM OINV T0 INNER JOIN INV1 T1 ON T0.DocNum=T1.DocEntry WHERE T0.DocNum=@list_of_cols_val_tab_del AND T0.isIns='Y' AND T0.CANCELED = 'N')
--			BEGIN
--					IF  (SELECT COUNT(DocNum) FROM OINV T0 INNER JOIN INV1 T1 ON T0.DocNum=T1.DocEntry WHERE T0.DocNum=@list_of_cols_val_tab_del AND T1.U_PickUpLoc ='WHS' ) = 0
--					BEGIN
--						SET @error=11
--						SET @error_message = N'Use AR Invoice.'
--					END
--			END
--			IF EXISTS(SELECT DocNum FROM OINV WHERE DocNum=@list_of_cols_val_tab_del AND isIns='Y' AND CANCELED = 'N' AND (U_BO_DSDD='Y' OR U_BO_DSDV='Y' OR U_BO_DSPD='Y' OR U_BO_DS='Y'))
--			BEGIN
--					SET @error=11
--					SET @error_message = N'Use AR Invoice'
--			END
--
--		END
--		ELSE IF EXISTS(SELECT DocNum FROM oinv WHERE DocNum=@list_of_cols_val_tab_del AND (U_SO_PKO = 'N' AND U_SO_DO = 'N' AND U_BO_PKO ='N' AND U_BO_DO ='N' AND U_BO_DSDD='N' AND U_BO_DSDV='N' AND U_BO_DSPD='N' AND U_BO_DS='N') AND CANCELED='N')
--		BEGIN
--				
--				IF LEFT(@vMainWhse,6) != LEFT(@vWhseCode,6) AND LEFT(CASE WHEN @vExtWhse IS NULL THEN '' ELSE @vExtWhse END,6) != LEFT(@vWhseCode,6)
--				BEGIN
--						SET @error=11
--						SET @error_message =N'User is not allowed to invoice transactions not matched with their default warehouse.'
--				END
--				IF EXISTS(SELECT DocNum FROM OINV T0 INNER JOIN INV1 T1 ON T0.DocNum=T1.DocEntry WHERE T0.DocNum=@list_of_cols_val_tab_del AND T0.isIns='N' AND T1.U_PickUpLoc ='WHS' AND T0.CANCELED = 'N')
--				BEGIN
--						SET @error=11
--						SET @error_message = N'Use AR Reserve Invoice for pick up to warehouse transactions.'
--				END
--				IF EXISTS (SELECT DocNum FROM OINV T0 INNER JOIN INV1 T1 ON T0.DocNum=T1.DocEntry WHERE T0.DocNum=@list_of_cols_val_tab_del AND T0.isIns='Y' AND T0.CANCELED = 'N') 
--				BEGIN
--						IF  (SELECT COUNT(DocNum) FROM OINV T0 INNER JOIN INV1 T1 ON T0.DocNum=T1.DocEntry WHERE T0.DocNum=@list_of_cols_val_tab_del AND T1.U_PickUpLoc ='WHS' ) = 0
--						BEGIN
--							SET @error=11
--							SET @error_message = N'Use AR Invoice.'
--						END
--				END
--		END	
				
	--To check if multiple code for store performance exist in one document entry
--		IF exists (SELECT DocEntry FROM OINV  WHERE DocEntry=@list_of_cols_val_tab_del AND CANCELED='N')
--		BEGIN
--			SELECT @iCntWhse =  COUNT(Distinct OcrCode) FROM INV1 WHERE DocEntry=@list_of_cols_val_tab_del
--			IF @iCntWhse > 1
--			BEGIN
--				SET @error=12
--				SET @error_message =N'Multiple store performance is not allowed.' 
--			END
--		END
--
--		--To check if there's a remarks
--		IF exists (SELECT DocEntry FROM OINV WHERE DocEntry=@list_of_cols_val_tab_del AND (Comments='' OR Comments IS NULL))
--		BEGIN
--			SET @error=13
--			SET @error_message =N'Remarks is required.' 
--		END
--
--		 --to check if the cashier input a total cash received from the customer
--		IF exists (SELECT DocEntry FROM OINV WHERE DocEntry=@list_of_cols_val_tab_del AND (U_BO_Cash='Y' OR U_SO_Cash='Y') AND U_SO_DTC = 'N' AND U_TotalCash='0.00' AND CANCELED='N' AND DocTotal !=0)
--		BEGIN
--			SET @error=14
--			SET @error_message =N'Please input the cash received.' 
--		END
--		ELSE IF exists (SELECT DocEntry FROM OINV WHERE DocEntry=@list_of_cols_val_tab_del AND (U_BO_Cash = 'N' AND U_SO_Cash ='N') AND U_TotalCash!='0.00' AND CANCELED='N')
--		BEGIN
--			SET @error=15
--			SET @error_message =N'Cash received is not require for non-cash payment.' 
--		END
--
--		-- to check if customer are subject for withholding tax
		IF exists(SELECT ItemCode FROM INV1 WHERE DocEntry=@list_of_cols_val_tab_del)
		BEGIN
			DECLARE @WTax VARCHAR(20), @WTaxLiable CHAR(1)

			SELECT @WTax=OINV.U_WTAX, @WTaxLiable=OCRD.WTLiable FROM OINV 
			INNER JOIN OCRD ON OINV.CardCode = OCRD.CardCode
			WHERE OINV.DocEntry=@list_of_cols_val_tab_del
				
			IF @WTaxLiable = 'N' BEGIN
				IF @WTax !='N/A' BEGIN
					SET @error=16
					SET @error_message =N'Customer is not subject for withholding tax. Tagging of withholding tax certificate is not applicable.' 
				END
			END ELSE BEGIN
				IF @WTax = 'N/A' BEGIN
					SET @error=16
					SET @error_message =N'Customer is subject for withholding tax. Withholding tax certificate must be tagged with Received or Not Received.'
				END
			END
				 
		END	
		
		--To ensure that the mode of payment selected matched with the Payment Means window

		--For Cash
		IF EXISTS(SELECT DocNum,DocTotal,PaidToDate,U_DocSeries FROM OINV WHERE DocNum=@list_of_cols_val_tab_del AND (U_BO_Cash ='Y' OR U_SO_Cash='Y') AND DocTotal > 0 AND CANCELED='N')
		BEGIN
			IF NOT EXISTS (SELECT T0.DocNum FROM ORCT T0 INNER JOIN RCT2 T1
			ON T0.DocNum=T1.DocNum INNER JOIN OINV T2
			ON T1.DocEntry =  T2.DocNum
			WHERE T2.DocNum=@list_of_cols_val_tab_del AND T0.CashSum > 0 AND T1.InvType=13)
			BEGIN

				SET @error=17
				SET @error_message =N'Cash Payment is required'

			END
		END
		
		--For Bank Transfer	
		IF EXISTS(SELECT DocNum,DocTotal,PaidToDate,U_DocSeries FROM OINV WHERE DocNum=@list_of_cols_val_tab_del AND U_SO_OT = 'Y' AND DocTotal > 0 AND CANCELED='N')
		BEGIN
			IF NOT EXISTS (SELECT T0.DocNum FROM ORCT T0 INNER JOIN RCT2 T1
			ON T0.DocNum=T1.DocNum INNER JOIN OINV T2
			ON T1.DocEntry =  T2.DocNum
			WHERE T2.DocNum=@list_of_cols_val_tab_del AND T0.TrsfrSum > 0  AND T1.InvType=13)
			BEGIN

				SET @error=18
				SET @error_message =N'Online Transfer Payment is required'

			END
		END

		--For Credit Card
		IF EXISTS(SELECT DocNum,DocTotal,PaidToDate,U_DocSeries FROM OINV WHERE DocNum=@list_of_cols_val_tab_del AND (U_SO_CC = 'Y') AND DocTotal > 0 AND CANCELED='N')
		BEGIN
			IF NOT EXISTS (SELECT T0.DocNum FROM ORCT T0 INNER JOIN RCT2 T1
			ON T0.DocNum=T1.DocNum INNER JOIN OINV T2
			ON T1.DocEntry =  T2.DocNum INNER JOIN RCT3 T3
			ON T0.DocNum=T3.DocNum
			WHERE T2.DocNum=@list_of_cols_val_tab_del AND T0.CreditSum > 0  AND T1.InvType=13 AND (T3.CrTypeCode=1 AND T3.CreditCard!=3))
			BEGIN

				SET @error=19
				SET @error_message =N'Credit Card Payment is required'

			END
		END

		--For Debit Card
		IF EXISTS(SELECT DocNum,DocTotal,PaidToDate,U_DocSeries FROM OINV WHERE DocNum=@list_of_cols_val_tab_del AND (U_SO_DC = 'Y') AND DocTotal > 0 AND CANCELED='N')
		BEGIN
			IF NOT EXISTS (SELECT T0.DocNum FROM ORCT T0 INNER JOIN RCT2 T1
			ON T0.DocNum=T1.DocNum INNER JOIN OINV T2
			ON T1.DocEntry =  T2.DocNum INNER JOIN RCT3 T3
			ON T0.DocNum=T3.DocNum
			WHERE T2.DocNum=@list_of_cols_val_tab_del AND T0.CreditSum > 0  AND T1.InvType=13 AND (T3.CrTypeCode=2 AND T3.CreditCard = 3))
			BEGIN

				SET @error=20
				SET @error_message =N'Debit Card Payment is required'

			END
		END

		--For On Date Check
		IF EXISTS(SELECT DocNum,DocTotal,PaidToDate,U_DocSeries FROM OINV WHERE DocNum=@list_of_cols_val_tab_del AND U_SO_ODC = 'Y' AND DocTotal > 0 AND CANCELED='N')
		BEGIN
			IF NOT EXISTS (SELECT T0.DocNum FROM ORCT T0 INNER JOIN RCT2 T1
			ON T0.DocNum=T1.DocNum INNER JOIN OINV T2
			ON T1.DocEntry =  T2.DocNum
			WHERE T2.DocNum=@list_of_cols_val_tab_del AND T0.CheckSum > 0  AND T1.InvType=13)
			BEGIN

				SET @error=21
				SET @error_message =N'On Date Check Payment is required'

			END
		END

		--To check the due date based on the CheckType (On Date)
		IF EXISTS(SELECT T0.DocNum,T1.DocEntry,T0.CheckNum,T0.DueDate FROM RCT1 T0 INNER JOIN RCT2  T1
				 ON T0.DocNum=T1.DocNum 
				 WHERE T1.DocEntry=@list_of_cols_val_tab_del AND T1.InvType=13  AND T0.DueDate > CONVERT( varchar, GETDATE(), 101) AND T0.U_ChkType = 'On Date')
		BEGIN
				SET @error=22
				SET @error_message =N'Check Date should less than or equal to the current date.'
		END

		--To ensure that the On Date Check has no CR No.
		--IF EXISTS(SELECT T0.DocNum,T1.DocEntry,T0.CheckNum,T0.DueDate FROM RCT1 T0 INNER JOIN RCT2  T1
		--				ON T0.DocNum=T1.DocNum 
		--				WHERE T1.DocEntry=@list_of_cols_val_tab_del AND T1.InvType=13 AND (T0.U_PRNum!='' OR T0.U_PRNum IS NOT NULL) AND T0.U_ChkType = 'On Date')
		--BEGIN
		--		SET @error=23
		--		SET @error_message =N'Collection Receipt number is not applicable for On Date Checks.'
		--END

		--To ensure that the Check Type was inputted
		IF EXISTS(SELECT T0.DocNum,T1.DocEntry,T0.CheckNum,T0.DueDate FROM RCT1 T0 INNER JOIN RCT2  T1
						ON T0.DocNum=T1.DocNum 
						WHERE T1.DocEntry=@list_of_cols_val_tab_del AND T1.InvType=13 AND (T0.U_ChkType = '' OR T0.U_ChkType IS NULL))
		BEGIN
				SET @error=24
				SET @error_message =N'Check Type is required'
		END

		--To check the due date of antedate check (not more than 180 days)
		IF EXISTS(SELECT T0.DocNum,T1.DocEntry,T0.CheckNum,T0.DueDate FROM RCT1 T0 INNER JOIN RCT2  T1
				 ON T0.DocNum=T1.DocNum 
				 WHERE T1.DocEntry=@list_of_cols_val_tab_del AND T1.InvType=13  AND DATEDIFF(day,T0.DueDate,GetDate()) >= 180 AND T0.U_ChkType = 'On Date')
		BEGIN
				SET @error=25
				SET @error_message =N'The check date should not exceed 180 days from the date of issuance.'
		END
		---12/03/2022
		--To check if the PO Date is equal or less than the AR Invoice Date from Drop Ship Transaction
		--IF EXISTS(SELECT DocDate FROM OINV WHERE DocNum=@list_of_cols_val_tab_del AND CANCELED='N' AND (U_BO_DSDD='Y' OR U_BO_DSDV='Y'))
		--BEGIN

		--	SET @iPONum = (SELECT DISTINCT TB.DocEntry FROM OPOR TA INNER JOIN POR1 TB ON TA.DocNum=TB.DocEntry WHERE TA.CANCELED='N' AND BaseRef=
		--	(SELECT DISTINCT TD.DocEntry FROM OPQT TC INNER JOIN PQT1 TD ON TC.DocNum=TD.DocEntry WHERE TC.CANCELED='N' AND TD.BaseRef = 
		--	(SELECT DISTINCT TF.DocEntry FROM OPRQ TE INNER JOIN PRQ1 TF ON TE.DocNum=TF.DocEntry WHERE TE.CANCELED='N' AND TF.BaseRef=
		--	(SELECT DISTINCT BaseRef FROM OINV TG INNER JOIN INV1 TH ON TG.DocNum=TH.DocEntry WHERE TG.CANCELED='N' AND TH.DocEntry=@list_of_cols_val_tab_del))))

		--	IF @iPONum IS NULL
		--	BEGIN

		--			SET @error=26
		--			SET @error_message =N'Purchase Quotation and Purchase Order are not yet created.'

		--	END
		--	ELSE
		--	BEGIN

		--		SELECT @dPODocDueDate = DocDueDate FROM OPOR WHERE DocNum=@iPONum
		--		SELECT @dARDocDueDate = DocDate FROM OINV WHERE DocNum=@list_of_cols_val_tab_del

		--		IF @dPODocDueDate > @dARDocDueDate
		--		BEGIN

		--				SET @error=26
		--				SET @error_message =N'AR Invoice Doc. Date should be equal or greater than PO Delivery Date.'

		--		END

		--	END

		--END

		--To check the existency of PO as referenced document in Sales order from Distribution Center for Store Stocks Replenishment
		--IF  EXISTS(SELECT DocEntry FROM OINV WHERE DocEntry=@list_of_cols_val_tab_del AND U_SOType='PC')
		--BEGIN
		--		SELECT @iBaseRef = T1.BaseRef FROM OINV T0 INNER JOIN INV1 T1 ON T0.DocNum=T1.DocEntry 
		--		WHERE T0.DocNum=@list_of_cols_val_tab_del

		--		IF NOT EXISTS (SELECT DocEntry FROM RDR21 WHERE DocEntry=@iBaseRef AND ObjectType=17 AND RefObjType = 22)
		--		BEGIN

		--			SET @error=27
		--			SET @error_message =N'PO referenced document from Sales Order is required.'

		--		END
		--END

		--To check if there is SO Type for Distribution Center
		IF exists (SELECT T0.DocEntry FROM OINV T0 INNER JOIN OBPL T1
					ON T0.BPLId=T1.BPLId
					WHERE T0.DocEntry=@list_of_cols_val_tab_del AND T1.U_isDC='Y' AND (T0.U_SOType = '' OR T0.U_SOType IS NULL))
		BEGIN
				SET @error=28
				SET @error_message =N'Transaction Type is required.'
		END

		--To check if SO with SO Type 'DC' and 'SR' forwarded to AR Invoice
		--IF  EXISTS(SELECT T0.DocNum FROM OINV T0 INNER JOIN INV1 T1 ON T0.DocNum=T1.DocEntry
		--			WHERE T0.DocNum=@list_of_cols_val_tab_del AND (U_SOType='SR' OR U_SOType='DC') AND T1.BaseType=17)
		--BEGIN
		--		SET @error=29
		--		SET @error_message =N'SO-Delivery to Customer or Store Replenishment transactions should have a Delivery entry.'
		--END

		--To ensure that the item from GRPO is existing in AR Invoice
		IF EXISTS(SELECT DocNum FROM OINV T0 INNER JOIN INV1 T1 ON T0.DocNum=T1.DocEntry
					WHERE T0.DocNum=@list_of_cols_val_tab_del AND (T0.U_SOType = 'IB') AND T1.ItemCode NOT IN (SELECT ItemCode FROM PDN1 WHERE DocEntry=T0.U_GRPODocnum))
		BEGIN
				SET @error=30
				SET @error_message =N'Item Code should exist in Goods Receipt PO.'
		END
		
		--To check if there is GRPO document number for Inter-Branch Transaction (DC only)
		IF  EXISTS(SELECT T0.DocNum FROM OINV T0 INNER JOIN INV1 T1 ON T0.DocNum=T1.DocEntry
					WHERE T0.DocNum=@list_of_cols_val_tab_del AND (U_SOType='IB') AND (T0.U_GRPODocnum IS NULL OR T0.U_GRPODocnum = ''))
		BEGIN
				SET @error=31
				SET @error_message =N'GRPO document number is required.'
		END
		

		 --To check the existency of document reference in AR Invoice (from GRPO) for DC only
		IF  EXISTS(SELECT T0.DocEntry FROM OINV T0 WHERE T0.DocEntry=@list_of_cols_val_tab_del AND T0.U_SOType='IB' AND T0.CANCELED='N')
		BEGIN
				IF NOT EXISTS (SELECT DocEntry FROM INV21 WHERE DocEntry=@list_of_cols_val_tab_del AND ObjectType=13 AND RefObjType = 20)
				BEGIN

					SET @error=31
					SET @error_message =N'Goods Receipt PO referenced document is requireds.'

				END

				ELSE
				BEGIN

					IF (SELECT COUNT(T1.DocEntry) FROM OINV T0 INNER JOIN INV21 T1 ON T0.DocNum=T1.DocEntry
					WHERE T0.DocNum=@list_of_cols_val_tab_del AND T1.RefObjType=20) > 1
					BEGIN
							SET @error=31
							SET @error_message =N'Only one Goods Receipt PO is required in referenced document field.'
					END
					ELSE
					BEGIN
							SELECT @iRefDoc =  T1.RefDocNum FROM OINV T0 INNER JOIN INV21 T1 ON T0.DocNum=T1.DocEntry
							WHERE T0.DocNum=@list_of_cols_val_tab_del AND T1.RefObjType=20

							IF (SELECT COUNT(RefDocNum) FROM OINV T0 INNER JOIN INV21 T1 ON T0.DocNum=T1.DocEntry WHERE T1.RefDocNum = @iRefDoc AND T1.RefObjType = 20 AND T0.CANCELED='N') > 1
							BEGIN
									SET @error=31
									SET @error_message =N'Goods Receipt PO referenced document already exist.'
							END
							ELSE IF (SELECT COUNT(RefDocNum) FROM INV21 WHERE DocEntry=@list_of_cols_val_tab_del AND ObjectType=13 AND RefObjType != 20) > 0
							BEGIN
									SET @error=31
									SET @error_message =N'Select Goods Receipt PO as Transaction Type in the referenced document field.'
							END
							ELSE IF EXISTS (SELECT T0.DocNum FROM OINV T0 INNER JOIN INV21 T1 ON T0.DocNum=T1.DocEntry 
											WHERE T0.DocNum=@list_of_cols_val_tab_del AND T1.ObjectType=13 AND T1.RefObjType=20 AND (CONVERT(INT,T0.U_GRPODocnum) != T1.RefDocNum)) 
							BEGIN
									SET @error=31
									SET @error_message =N'Referenced document number is not matched with the Goods Receipt PO document number.'
							END
							ELSE
							BEGIN
									IF EXISTS(SELECT T0.DocNum FROM OINV T0 INNER JOIN OPDN T1
									ON T0.U_GRPODocnum=T1.DocNum
									WHERE T0.DocNum = @list_of_cols_val_tab_del AND T0.DocTotal != T1.DocTotal)
									BEGIN
											SET @error=31
											SET @error_message =N'AR Invoice total amount should be matched with the Goods Receipt PO.'
									END

							END

						END
				END
				
		END

		--To ensure that the user is using a Drop Ship Warehouse for GRPO from Store (for DC only)
--		IF EXISTS(SELECT T0.DocNum FROM OINV T0
--					INNER JOIN INV1 T1 ON T0.DocNum=T1.DocEntry
--					INNER JOIN OWHS T2 ON T1.WhsCode=T2.WhsCode
--					WHERE T0.DocNum=@list_of_cols_val_tab_del AND T2.DropShip='N' AND T0.U_SOType='IB')
--		BEGIN
--				SET @error=32
--				SET @error_message =N'Non-Drop Ship warehouse is not allowed for this type of transaction'
--		END

		--To ensure that the Incoming Payment Discount is match with the AR Invoice SC/PWD Discount
		IF EXISTS(SELECT T0.DocNum FROM OINV T0 INNER JOIN RCT2 T1 
		ON T0.DocNum=T1.DocEntry 
		WHERE T0.CardCode='C000112' AND InvType=13 AND T0.DocNum=@list_of_cols_val_tab_del AND T0.CANCELED='N' AND T0.U_SCPWD <> T1.DcntSum)
		BEGIN
				SET @error=33
				SET @error_message =N'Incoming Payment Discount should be matched with the AR Invoice SC/PWD Discount.'
		END

		--To check if the description field is empty for Service Type transaction
		IF EXISTS (SELECT T0.DocNum FROM OINV T0 INNER JOIN INV1 T1
		ON T0.DocNum=T1.DocEntry
		WHERE T0.DocNum=@list_of_cols_val_tab_del AND T0.CANCELED='N' AND T0.DocType='S' AND (T1.Dscription IS NULL OR T1.Dscription=''))
		BEGIN
				SET @error=34
				SET @error_message =N'Description is required.'
		END

		--To check if there is Withholding Tax computation for the customer that has WTax Certificate
		IF EXISTS(SELECT DocNum FROM OINV T0 WHERE DocNum=@list_of_cols_val_tab_del AND U_WTax='Received' AND DocNum NOT IN (SELECT AbsEntry FROM INV5 WHERE AbsEntry=T0.DocNum))
		BEGIN
			SET @error=35
			SET @error_message =N'Withholding tax computation is required.'
		END

		--To check the computation of Withholding Tax
		SET @fActualWTax = (SELECT ROUND(SUM(WTAmnt),2) FROM INV5 WHERE AbsEntry=@list_of_cols_val_tab_del)

		SET @fStandardWtax = (SELECT ROUND(SUM((Max1099-T0.VatSum) * ROUND((T1.Rate/100),2)),2) FROM  OINV T0 INNER JOIN INV5 T1
		ON T0.DocNum=T1.AbsEntry
		WHERE T0.DocNum=@list_of_cols_val_tab_del)

		IF convert(int,@fActualWTax - (@fActualWTax % 1))  <> convert(int,@fStandardWtax - (@fStandardWtax % 1))
		BEGIN
			SET @error=36
			SET @error_message =N'Incorrect withholding tax computation.'
		END
	
		--To check if the Walk-In_WTax customer has TIN and Address.
		IF EXISTS(SELECT DocNum FROM OINV 
					WHERE DocNum=@list_of_cols_val_tab_del AND CardCode='C000111' AND (U_ALIAS_VENDOR = '' OR U_ALIAS_VENDOR IS NULL OR U_TIN = '' OR U_TIN IS NULL OR U_ADDRESS='' OR U_ADDRESS IS NULL))
		BEGIN
			
			SET @error=37
			SET @error_message =N'Name, TIN and Address is required.'

		END
		
		--To check if the Price is zero
		IF EXISTS(SELECT T0.DocEntry FROM INV1 T0
					INNER JOIN OINV T1
					ON T0.DocEntry=T1.DocNum						
					WHERE T0.DocEntry=@list_of_cols_val_tab_del AND ((U_GPBD='0.00' OR U_GPBD='' OR U_GPBD IS NULL) OR PriceAfVAT=0) AND (T1.U_SOType IS NULL OR T1.U_SOType=''))
		BEGIN
			
			SET @error=38
			SET @error_message =N'Selling Price before and after discount is required.'

		END

		--To check if the WTax Liable field was set to YES if the Customer is subject for WTax
		IF EXISTS(SELECT T0.DocNum FROM OINV T0 INNER JOIN INV1 T1 ON T0.DocNum=T1.DocEntry
			INNER JOIN OCRD T2 ON T0.CardCode=T2.CardCode
			WHERE T0.DocNum=@list_of_cols_val_tab_del AND T2.WTLiable ='Y' AND T1.WtLiable='N')
		BEGIN

				SET @error=39
				SET @error_message =N'WTax Liable field should be set into "YES".'

		END

		--To check if the store performance warehouse belongs to the assigned branch
--		IF EXISTS (SELECT DISTINCT T0.DocNum FROM OINV T0 INNER JOIN INV1 T1
--		ON T0.DocNum=T1.DocEntry INNER JOIN OOCR T2
--		ON T1.OcrCode=T2.OcrCode INNER JOIN OWHS T3
--		ON T2.U_Whse=T3.WhsCode
--		WHERE T0.DocNum=@list_of_cols_val_tab_del AND T0.BPLId != T3.BPLid  AND T0.DocType='S')
--		BEGIN
--				SET @error=40
--				SET @error_message =N'Store Performance should belong to the assigned branch.'
--		END

		--To check if there is WTax Common Code assigned from the Wtax Certificate received 
		IF EXISTS(SELECT DocNum FROM OINV
		WHERE DocNum=@list_of_cols_val_tab_del AND U_WTax='Received' AND U_wTaxComCode IS NULL) 
		BEGIN
				SET @error=40
				SET @error_message =N'Wtax Common Code is required.'
		END

		--To check if there is WTax Common Code assigned from the Wtax Certificate received 
		IF EXISTS(SELECT DocNum FROM OINV
		WHERE DocNum=@list_of_cols_val_tab_del AND U_WTax != 'Received' AND U_wTaxComCode IS NOT NULL) 
		BEGIN
				SET @error=40
				SET @error_message =N'Wtax Common Code is not required.'
		END

		--To check if there is already WTax Common Code assigned from Incoming Payment
		IF EXISTS(SELECT T0.DocNum FROM OINV T0 INNER JOIN RCT2 T1
		ON T0.DocNum=T1.DocEntry
		WHERE T0.DocNum=@list_of_cols_val_tab_del AND T1.InvType=13 AND T0.U_WTax='Received' AND T1.U_wTaxComCode IS NOT NULL AND T0.U_wTaxComCode IS NOT NULL) 
		BEGIN
				SET @error=40
				SET @error_message =N'WTax common code already assigned in Incoming Payment.'
		END

		--To check the valid control account of AR Invoice-Service Type
		IF EXISTS(SELECT DocNum FROM OINV T0 INNER JOIN OACT T1 ON T0.CtlAccount=T1.AcctCode
					INNER JOIN INV1 T2 ON T0.DocNum=T2.DocEntry
					WHERE T0.DocNum =@list_of_cols_val_tab_del AND T2.OcrCode != T1.AccntntCod AND T0.DocType='S' AND T0.CANCELED='N')
		BEGIN

			SET @error=7
			SET @error_message =N'Invalid Control Account, update remarks.'

		END

		--To check the valid control account of AR Invoice-Item Type
		IF EXISTS(SELECT DocNum FROM OINV T0 INNER JOIN OACT T1 ON T0.CtlAccount=T1.AcctCode
					INNER JOIN INV1 T2 ON T0.DocNum=T2.DocEntry
					WHERE T0.DocNum =@list_of_cols_val_tab_del AND T1.Details NOT LIKE '%' + T2.WhsCode + '%' AND T0.DocType='I' AND T0.CANCELED='N')
		BEGIN

			SET @error=7
			SET @error_message =N'Invalid Control Account, update remarks.'

		END

		--To Check if the OwnerCode is match with the User ID
		IF EXISTS(SELECT T0.DocNum FROM OINV T0 INNER JOIN OHEM T1
			ON T0.UserSign=T1.userId
			WHERE DocNum=@list_of_cols_val_tab_del AND T0.OwnerCode != T1.empID AND T0.CANCELED='N')
		BEGIN

			SET @error=7
			SET @error_message =N'Invalid Owner Code.'

		END

		--To Check if the Mode of Payment On Date Check is used for AR Invoice
		IF EXISTS(SELECT DocNum FROM OINV 
			WHERE DocNum=@list_of_cols_val_tab_del AND (U_SO_ODC='Y' OR U_BO_ODC='Y') AND DocTotal > 0 AND CardCode IN ('C000107','C000111'))
		BEGIN

			SET @error=7
			SET @error_message = N'Use AR Down Payment Invoice for check payment.'

		END

		--To check if the Due Date of PDC exceeds the Payment Terms Due Date less than or equal to 3 days
		IF EXISTS(SELECT DISTINCT T1.DocDueDate,T2.DueDate FROM RCT2 T0 INNER JOIN OINV T1
		ON T0.DocEntry=T1.DocNum INNER JOIN RCT1 T2
		ON T0.DocNum=T2.DocNum
		WHERE T0.InvType=13 AND T1.DocNum=@list_of_cols_val_tab_del AND (T1.U_SO_PDC='Y' OR T1.U_BO_PDC='Y') AND T1.U_ChkPyTrmsApp='N'
		AND DATEDIFF (DAY, T1.DocDueDate, T2.DueDate) BETWEEN 1 AND 3)
		BEGIN
			SET @error=7
			SET @error_message =N'Check date exceeds the document due date. Set the Check Payment Terms Approval (not exceeding 3 days) to Y.'
		END

		----To check if the Due Date of PDC exceeds the Payment Terms Due Date greater than 3 days
		IF EXISTS(SELECT DISTINCT T1.DocDueDate,T2.DueDate FROM RCT2 T0 INNER JOIN OINV T1
		ON T0.DocEntry=T1.DocNum INNER JOIN RCT1 T2
		ON T0.DocNum=T2.DocNum
		WHERE T0.InvType=13 AND T1.DocNum=@list_of_cols_val_tab_del AND (T1.U_SO_PDC='Y' OR T1.U_BO_PDC='Y') AND T1.U_ChkPyTrmsApp1='N'
		AND DATEDIFF (DAY, T1.DocDueDate, T2.DueDate) > 3)
		BEGIN
			SET @error=7
			SET @error_message =N'Check date exceeds the document due date. Set the Check Payment Terms Approval (exceeds 3 days) to Y.'
		END

	    --To check if Allow to print without Document Date is set to "Y" then Reason for Reprinting must be "For Goverment"
		IF (SELECT ISNULL(T0.U_RPReason,'NA') FROM OINV T0 WHERE T0.DocEntry = @list_of_cols_val_tab_del AND T0.U_allowgovprintnodate = 'Y') <> 'FG' 
		BEGIN
			SET @error=20
			SET @error_message =N'Reason for reprinting must be "For Government" if Print receipt without document date is set as "Y"'
		END

		--To check if For Government is selected but Allow Customer to print without Document Date is set to N
		IF (SELECT ISNULL(T0.U_allowgovprintnodate,'N') FROM OINV T0 WHERE T0.DocEntry = @list_of_cols_val_tab_del AND T0.U_RPReason = 'FG') = 'N' 
		BEGIN
			SET @error=21
			SET @error_message =N'Print receipt without document date must be set to "Y" if Reason for reprinting is "For Government" '
		END


		--To check the existency of PO as referenced document in AR Invoice for Drop Ship Transaction (Non-DC)
			IF  EXISTS(SELECT T0.DocNum FROM OINV T0 INNER JOIN OBPL T1 ON T0.BPLId=T1.BPLId WHERE T0.DocNum=@list_of_cols_val_tab_del AND T1.U_isDC='N' AND (U_BO_DSDD='Y' OR U_BO_DSDV='Y' OR U_BO_DSPD='Y' OR U_BO_DRS='Y'))
			BEGIN
					IF NOT EXISTS (SELECT DocEntry FROM INV21 WHERE DocEntry=@list_of_cols_val_tab_del AND ObjectType=13 AND RefObjType = 22)
					BEGIN

						SET @error=19
						SET @error_message =N'PO in referenced document field is required.'

					END

					ELSE
					BEGIN

						IF (SELECT COUNT(T1.DocEntry) FROM OINV T0 INNER JOIN INV21 T1 ON T0.DocNum=T1.DocEntry
						WHERE T0.DocNum=@list_of_cols_val_tab_del AND T1.RefObjType=22) > 1
						BEGIN
								SET @error=19
								SET @error_message =N'Only one PO is required in the referenced document field.'
						END
						ELSE
						BEGIN
								SELECT @iRefDoc =  T1.RefDocNum FROM OINV T0 INNER JOIN INV21 T1 ON T0.DocNum=T1.DocEntry
								WHERE T0.DocNum=@list_of_cols_val_tab_del AND T1.RefObjType=22

								IF (SELECT COUNT(T0.RefDocNum) FROM INV21 T0 INNER JOIN OINV T1 ON T0.DocEntry = T1.Docnum WHERE T0.RefDocNum = @iRefDoc AND T0.RefObjType = 22 AND T1.Canceled = 'N') > 1
								BEGIN
										SET @error=19
										SET @error_message =N'PO in referenced document field already exist.'
								END
								ELSE IF (SELECT COUNT(RefDocNum) FROM INV21 WHERE DocEntry=@list_of_cols_val_tab_del AND ObjectType=13 AND RefObjType != 22) > 0
								BEGIN
										SET @error=19
										SET @error_message =N'Select PO as Transaction Type in the referenced document field.'
								END
								ELSE
								BEGIN
										
										DECLARE @iPRNo1 int, @iPRNo2 int, @iBaseRefAR int

										SELECT DISTINCT @iBaseRefAR = BaseRef FROM INV1 WHERE DocEntry=@list_of_cols_val_tab_del AND BaseType = 17

										SELECT DISTINCT @iPRNo1 = DocEntry FROM PRQ21 WHERE RefDocNum=@iBaseRefAR AND RefObjType = 17

										IF (@iPRNo1 IS NULL OR @iPRNo1 = '')
										BEGIN

												SET  @iPRNo1 = (SELECT DISTINCT T0.DocEntry FROM PRQ1 T0 INNER JOIN OPRQ T1 ON T0.DocEntry = T1.DocEntry WHERE T1.Canceled = 'N' AND T0.BASEREF =@iBaseRefAR)

										END

										SET @iPRNo2 =  (SELECT DISTINCT BaseRef FROM PQT1 WHERE DocEntry= (SELECT DISTINCT BaseRef FROM POR1 WHERE DocEntry=@iRefDoc AND BaseType=540000006) AND BaseType=1470000113)

										IF (@iPRNo1 != CASE WHEN @iPRNo2 IS NULL THEN 0 ELSE @iPRNo2 END)
										BEGIN

												SET @error=19
												SET @error_message =N'Selected PO is not related to the Sales Order entry.'
											
										END
										ELSE IF ((@iPRNo1 IS NULL OR @iPRNo1='') AND (@iPRNo2 IS NULL OR @iPRNo2=''))
										BEGIN
												
												SET @error=19
												SET @error_message =N'PO is not yet created.'
										END
										ELSE
										BEGIN

												SELECT @dPODocDueDate = DocDueDate FROM OPOR WHERE DocNum=@iRefDoc
												SELECT @dARDocDueDate =  TaxDate FROM OINV WHERE DocNum=@list_of_cols_val_tab_del

												IF (DATENAME(dw, @dPODocDueDate)) ='Monday'
												BEGIN
														SET @dPODocDueDate =  DATEADD(day, -2, CAST(@dPODocDueDate AS date))
												END
												ELSE
												BEGIN
														SET @dPODocDueDate =  DATEADD(day, -1, CAST(@dPODocDueDate AS date))
												END


												IF (@dPODocDueDate > @dARDocDueDate)
												BEGIN
														SET @error=19
														SET @error_message =N'AR Invoice Doc. Date should be equal or greater than PO Delivery Date.'
												END

										END
							
									
								END

						 END
					END
				
			END

		--To check the existency of PO as referenced document in AR Invoice for Drop Ship Transaction (DC)
			--IF  EXISTS(SELECT T0.DocNum FROM OINV T0 INNER JOIN OBPL T1 ON T0.BPLId=T1.BPLId
			--			WHERE T0.DocNum=@list_of_cols_val_tab_del AND T1.U_isDC='Y' AND (U_BO_DSDD='Y' OR U_BO_DSDV='Y' OR U_BO_DSPD='Y' OR U_BO_DRS='Y')
			--			AND T0.DocNum IN (SELECT TA.DocEntry FROM INV21 TA WHERE TA.DocEntry=T0.DocNum AND TA.ObjectType=13))
			--BEGIN
			--		IF NOT EXISTS (SELECT DocEntry FROM INV21 WHERE DocEntry=@list_of_cols_val_tab_del AND ObjectType=13 AND RefObjType = 22)
			--		BEGIN

			--			SET @error=19
			--			SET @error_message =N'PO in referenced document field is required.'

			--		END

			--		ELSE
			--		BEGIN

			--			IF (SELECT COUNT(T1.DocEntry) FROM OINV T0 INNER JOIN INV21 T1 ON T0.DocNum=T1.DocEntry
			--			WHERE T0.DocNum=@list_of_cols_val_tab_del AND T1.RefObjType=22) > 1
			--			BEGIN
			--					SET @error=19
			--					SET @error_message =N'Only one PO is required in the referenced document field.'
			--			END
			--			ELSE
			--			BEGIN
			--					SELECT @iRefDoc =  T1.RefDocNum FROM OINV T0 INNER JOIN INV21 T1 ON T0.DocNum=T1.DocEntry
			--					WHERE T0.DocNum=@list_of_cols_val_tab_del AND T1.RefObjType=22

			--					IF (SELECT COUNT(T0.RefDocNum) FROM INV21 T0 INNER JOIN OINV T1 ON T0.DocEntry = T1.Docnum WHERE T0.RefDocNum = @iRefDoc AND T0.RefObjType = 22 AND T1.Canceled = 'N') > 1
			--					BEGIN
			--							SET @error=19
			--							SET @error_message =N'PO in referenced document field already exist.'
			--					END
			--					ELSE IF (SELECT COUNT(RefDocNum) FROM INV21 WHERE DocEntry=@list_of_cols_val_tab_del AND ObjectType=13 AND RefObjType != 22) > 0
			--					BEGIN
			--							SET @error=19
			--							SET @error_message =N'Select PO as Transaction Type in the referenced document field.'
			--					END
			--					ELSE
			--					BEGIN
										
			--							DECLARE @iPRNo3 int, @iPRNo4 int
			--							SET  @iPRNo3 = (SELECT DISTINCT T0.DocEntry FROM PRQ1 T0 INNER JOIN OPRQ T1 ON T0.DocEntry = T1.DocEntry WHERE T1.Canceled = 'N' AND T0.BASEREF =(SELECT DISTINCT BaseRef FROM INV1 WHERE DocEntry=@list_of_cols_val_tab_del))

			--							SET @iPRNo4 =  (SELECT DISTINCT BaseRef FROM PQT1 T0 INNER JOIN OPQT T1 ON T0.DocEntry=T1.DocNum WHERE T0.DocEntry= 
			--							(SELECT DISTINCT BaseRef FROM POR1 TX INNER JOIN OPOR TY ON TX.DocEntry=TY.DocNum  WHERE TX.DocEntry=@iRefDoc AND TX.BaseType=540000006 AND TY.DocType='I') AND T0.BaseType=1470000113 AND T1.DocType='I')

			--							IF (CASE WHEN @iPRNo3 IS NULL THEN 0 ELSE @iPRNo3 END != CASE WHEN @iPRNo4 IS NULL THEN 0 ELSE @iPRNo4 END)
			--							BEGIN

			--									SET @error=19
			--									SET @error_message =N'Selected PO is not related to the Sales Order entry.'
											
			--							END
			--							ELSE IF ((@iPRNo3 IS NULL OR @iPRNo3='') AND (@iPRNo4 IS NULL OR @iPRNo4=''))
			--							BEGIN
												
			--									SET @error=19
			--									SET @error_message =N'PO is not yet created.'
			--							END
			--							ELSE
			--							BEGIN

			--									SELECT @dPODocDueDate = DocDueDate FROM OPOR WHERE DocNum=@iRefDoc
			--									SELECT @dARDocDueDate =  TaxDate FROM OINV WHERE DocNum=@list_of_cols_val_tab_del

			--									IF (DATENAME(dw, @dPODocDueDate)) ='Monday'
			--									BEGIN
			--											SET @dPODocDueDate =  DATEADD(day, -2, CAST(@dPODocDueDate AS date))
			--									END
			--									ELSE
			--									BEGIN
			--											SET @dPODocDueDate =  DATEADD(day, -1, CAST(@dPODocDueDate AS date))
			--									END


			--									IF (@dPODocDueDate > @dARDocDueDate)
			--									BEGIN
			--											SET @error=19
			--											SET @error_message =N'AR Invoice Doc. Date should be equal or greater than PO Delivery Date.'
			--									END

			--							END
							
									
			--					END

			--			 END
			--		END
				
			--END

		--to check if the cash invoice tagged as Not Received for Wtax Certificate 
		IF exists(SELECT DocNum FROM OINV T0 INNER JOIN OCRD T1
					ON T0.CardCode=T1.CardCode
					WHERE T0.DocEntry=@list_of_cols_val_tab_del AND (U_SO_Cash='Y' OR U_SO_CC='Y' OR U_SO_DC='Y' OR U_SO_ODC='Y' OR U_SO_OT='Y' OR U_SO_DTC='Y' OR
					U_BO_Cash='Y' OR U_BO_CC='Y' OR U_BO_DC='Y' OR U_BO_ODC='Y' OR U_BO_OT='Y') AND U_WTax='Not Received' AND T1.WTLiable='Y' AND T0.WTSum > 0)
		BEGIN
				SET @error=10
				SET @error_message =N'WTAX must not be tagged with Not Received for cash related payment.'
		END
		

		--MODIFY 01/31/2024
		--To Chech if Document Series is either CASH or CHARGED

		DECLARE @DC VARCHAR(10) = (SELECT OCRD.U_DC FROM OCRD INNER JOIN OINV ON OCRD.CardCode = OINV.CardCode WHERE OINV.DocNum = @list_of_cols_val_tab_del )



		IF EXISTS (SELECT U_DocSeries FROM OINV WHERE DocEntry = @list_of_cols_val_tab_del AND U_DocSeries NOT LIKE '%CASH%' AND U_DocSeries NOT LIKE '%CHARGE%' AND (@DC IS NULL OR @DC = '') ) 
		  BEGIN
			SET @error=50
				  SET @error_message =N'Document Series should be with cash or charge only. Please update remarks.'	
		  END


		--To Check if AR Invoice is allowed for Catch-Up
--		  DECLARE @Warehouse VARCHAR(10) = (SELECT DISTINCT WhsCode FROM INV1 WHERE DocEntry = @list_of_cols_val_tab_del)
--
--		  IF (@transaction_type='A') AND EXISTS (SELECT DISTINCT T0.WhsCode FROM OWHS T0 WHERE T0.U_CatchUp = 'Y' AND T0.U_CatchUpDate != (SELECT DISTINCT S0.TaxDate FROM OINV S0 WHERE S0.DocEntry = @list_of_cols_val_tab_del) AND T0.WhsCode = @Warehouse)
--		  BEGIN
--  			SET @error=51
--				  SET @error_message =N'Adding a document that falls outside the allowed date is prohibited during catch up encoding.'	
--		  END
--
--
--      IF (@transaction_type='A') AND (SELECT DISTINCT CAST(T0.TaxDate  AS DATE) FROM OINV T0 INNER JOIN INV1 T1 ON T0.DocEntry = T1.DocEntry INNER JOIN OWHS T2 ON T1.WhsCode = T2.WhsCode WHERE T2.U_CatchUp = 'N' AND T0.DocEntry = @list_of_cols_val_tab_del) <> CAST(GETDATE() AS DATE)
--      BEGIN
--  	    SET @error=52
--			  SET @error_message =N'Adding a document that falls outside the allowed date is prohibited during encoding.'
--      END
--
--
--
--	

		 --To check if the cashier input a total cash received from the customer
		IF exists (SELECT DocEntry FROM OINV WHERE DocEntry=@list_of_cols_val_tab_del AND U_SO_Cash='Y' AND isICT = 'Y' AND U_TotalCash='0.00' AND CANCELED='N')
		BEGIN
			SET @error=52
			SET @error_message =N'Please input the cash received.' 
		END

		-- AR Quantity should be the same with PO Quantity.
		DECLARE @POQuantity AS INT
		DECLARE @ARQuantity AS INT

		SELECT @POQuantity = SUM(T1.Quantity) FROM INV21 T0 INNER JOIN POR1 T1 ON T0.RefDocNum = T1.DocEntry INNER JOIN OINV T2 ON T0.DocEntry = T2.DocEntry WHERE T0.RefObjType = 22 AND T0.DocEntry = @list_of_cols_val_tab_del AND  T1.Dscription NOT LIKE '%DELIVERY%' AND (T2.U_BO_DRS = 'Y' OR T2.U_BO_DSDD = 'Y' OR T2.U_BO_DSDV = 'Y' OR T2.U_BO_DSPD = 'Y')
		SELECT @ARQuantity = SUM(T0.Quantity) FROM INV1 T0 INNER JOIN OINV T1 ON T0.DocEntry = T1.DocEntry WHERE T0.DocEntry = @list_of_cols_val_tab_del AND T0.Dscription NOT LIKE '%DELIVERY%' AND (T1.U_BO_DRS = 'Y' OR T1.U_BO_DSDD = 'Y' OR T1.U_BO_DSDV = 'Y' OR T1.U_BO_DSPD = 'Y' )

		--IF (SELECT COUNT(T0.RefDocNum) FROM INV21 T0 INNER JOIN POR1 T1 ON T0.RefDocNum = T1.DocEntry INNER JOIN OINV T2 ON T0.DocEntry = T2.DocEntry WHERE T0.RefObjType = 22 AND T0.DocEntry = @list_of_cols_val_tab_del AND (T2.U_BO_DRS = 'Y' OR T2.U_BO_DSDD = 'Y' OR T2.U_BO_DSDV = 'Y' OR T2.U_BO_DSPD = 'Y') ) > 2
		--  BEGIN
		--    SET @error=53
		--  	SET @error_message =N'Only 1 PO is required in the Referenced Document during Dropship.'
		--  END

		IF @ARQuantity <> @POQuantity 
		  BEGIN
			SET @error=53
			SET @error_message =N'AR Quantity should be the same with PO Quantity.'
		  END


		--To block if store performance is empty-ARINV
		IF EXISTS (SELECT DISTINCT OINV.DocEntry FROM INV1 INNER JOIN OINV ON OINV.DocEntry = INV1.DocEntry WHERE OcrCode IS NULL AND OINV.DocEntry = @list_of_cols_val_tab_del AND DocType = 'I' )
			BEGIN
				SET @error=54
				SET @error_message =N'Store Perfomance is required.'
			END


		--AR Itemcode should matched with the PO Itemcode in Ref. Doc.
		--DECLARE @POItemCode AS VARCHAR(MAX) = (SELECT DISTINCT T1.ItemCode FROM INV21 T0 INNER JOIN POR1 T1 ON T0.RefDocNum = T1.DocEntry WHERE T0.DocEntry = @list_of_cols_val_tab_del AND T0.RefObjType = 22)
		--DECLARE @ARItemCode AS VARCHAR(MAX) = (SELECT DISTINCT ItemCode FROM INV1 WHERE DocEntry = @list_of_cols_val_tab_del AND Dscription NOT LIKE '%DELIVERY%')
		--
		--IF @ARItemCode <> @POItemCode  
		--  BEGIN
		--    SET @error=54
		--  	SET @error_message =N'AR Itemcode should matched with the PO Itemcode in Ref. Doc.'
		--  END

		--For Bank Transfer approval for SS - direct invoice
		IF EXISTS(SELECT DISTINCT T1.DocNum FROM RCT2 T0 INNER JOIN OINV T1
		ON T0.DocEntry=T1.DocNum INNER JOIN ORCT T2
		ON T0.DocNum=T2.DocNum
		WHERE T0.InvType=13 AND T1.DocNum=@list_of_cols_val_tab_del AND T1.U_BTAppSS='N'
		AND T2.TrsfrSum BETWEEN 1 AND 300000)
		BEGIN
			SET @error=7
			SET @error_message =N'Set the Bank Transfer Approval-ACCT to Y.'
		END

		--For Bank Transfer approval for MD - direct invoice
		IF EXISTS(SELECT DISTINCT T1.DocNum FROM RCT2 T0 INNER JOIN OINV T1
		ON T0.DocEntry=T1.DocNum INNER JOIN ORCT T2
		ON T0.DocNum=T2.DocNum
		WHERE T0.InvType=13 AND T1.DocNum=@list_of_cols_val_tab_del AND T1.U_BTAppMD='N'
		AND T2.TrsfrSum > 300000)
		BEGIN
			SET @error=7
			SET @error_message =N'Set the Bank Transfer Approval-MD to Y.'
		END

		--For Bank Transfer approval for ACCT - from ARDPI
		IF EXISTS(SELECT TB.DocNum,TA.BaseAbs FROM INV9 TA INNER JOIN OINV TB
		ON TA.DocEntry=TB.DocEntry
		WHERE TB.DocEntry=@list_of_cols_val_tab_del AND BaseAbs IN (SELECT T1.DocNum FROM RCT2 T0 INNER JOIN ODPI T1
				ON T0.DocEntry=T1.DocNum INNER JOIN ORCT T2
				ON T0.DocNum=T2.DocNum
				WHERE T0.InvType=203 AND T1.DocNum=TA.BaseAbs
				AND T2.TrsfrSum BETWEEN 1 AND 300000)
		AND TB.U_BTAppSS='N')
		BEGIN
			SET @error=7
			SET @error_message =N'Set the Bank Transfer Approval-ACCT to Y.'
		END

		--For Bank Transfer approval for MD - from ARDPI
		IF EXISTS(SELECT TB.DocNum,TA.BaseAbs FROM INV9 TA INNER JOIN OINV TB
		ON TA.DocEntry=TB.DocEntry
		WHERE TB.DocEntry=@list_of_cols_val_tab_del AND BaseAbs IN (SELECT T1.DocNum FROM RCT2 T0 INNER JOIN ODPI T1
				ON T0.DocEntry=T1.DocNum INNER JOIN ORCT T2
				ON T0.DocNum=T2.DocNum
				WHERE T0.InvType=203 AND T1.DocNum=TA.BaseAbs
				AND T2.TrsfrSum > 300000)
		AND TB.U_BTAppMD='N')
		BEGIN
			SET @error=7
			SET @error_message =N'Set the Bank Transfer Approval-MD to Y.'
		END

		--For On Date Check approval for ACCT - from ARDPI
		IF EXISTS(SELECT TB.DocNum,TA.BaseAbs FROM INV9 TA INNER JOIN OINV TB
		ON TA.DocEntry=TB.DocEntry
		WHERE TB.DocEntry=@list_of_cols_val_tab_del AND BaseAbs IN (SELECT T1.DocNum FROM RCT2 T0 INNER JOIN ODPI T1
				ON T0.DocEntry=T1.DocNum INNER JOIN ORCT T2
				ON T0.DocNum=T2.DocNum  INNER JOIN RCT1 T3
				ON T0.DocNum=T3.DocNum
				WHERE T0.InvType=203 AND T1.DocNum=TA.BaseAbs AND T2.CheckSum BETWEEN 0 AND 300000 AND (T1.U_SO_ODC='Y' OR T1.U_BO_ODC='Y'))
		AND TB.U_ODCAppSS='N' AND TB.CardCode IN ('C000107','C000111','C000112') )
		BEGIN
			SET @error=7
			SET @error_message =N'Set the On Date Check Approval-ACCT to Y.'
		END

		--For On Date Check approval for MD - from ARDPI
		IF EXISTS(SELECT TB.DocNum,TA.BaseAbs FROM INV9 TA INNER JOIN OINV TB
		ON TA.DocEntry=TB.DocEntry
		WHERE TB.DocEntry=@list_of_cols_val_tab_del AND BaseAbs IN (SELECT T1.DocNum FROM RCT2 T0 INNER JOIN ODPI T1
				ON T0.DocEntry=T1.DocNum INNER JOIN ORCT T2
				ON T0.DocNum=T2.DocNum  INNER JOIN RCT1 T3
				ON T0.DocNum=T3.DocNum
				WHERE T0.InvType=203 AND T1.DocNum=TA.BaseAbs AND T2.CheckSum > 300000 AND (T1.U_SO_ODC='Y' OR T1.U_BO_ODC='Y'))
		AND TB.U_ODCAppMD='N' AND TB.CardCode IN ('C000107','C000111','C000112') )
		BEGIN
			SET @error=7
			SET @error_message =N'Set the On Date Check Approval-MD to Y.'
		END


		--DR No. and Date Delivery is required when LO Number is not empty.
		IF EXISTS (SELECT DocNum From OINV WHERE DocNum = @list_of_cols_val_tab_del AND (TrackNo IS NOT NULL OR TrackNo <> '') AND (U_DelDate IS NULL OR U_DelDate = '') )
		BEGIN
			SET @error=55
			SET @error_message =N'Delivery Date is required (Logistics Tab).'
		END


END	
--## END Validation for AR Invoice ##--

--## Validation for AR Down Payment Invoice ##--
IF (@object_type = '203')  AND (@transaction_type='A' OR @transaction_type='U')
	BEGIN 

		--To Check if Document Series is generated
		IF exists (SELECT T1.[DocNum] FROM ODPI T1 WHERE T1.[DocNum]=@list_of_cols_val_tab_del 
		AND (T1.[U_DocSeries]LIKE '%N/A%' OR (T1.[U_DocSeries] IS NULL OR T1.[U_DocSeries] ='')))
		BEGIN
			SET @error=1
			SET @error_message =N'Document Series must be provided in this transaction.'
		END

		--To Check if Document Series have ARDPI
    IF EXISTS (SELECT U_DocSeries FROM ODPI WHERE DocEntry = @list_of_cols_val_tab_del AND U_DocSeries NOT LIKE '%ARDPI%') 
      BEGIN
        SET @error=1
			  SET @error_message =N'Document Series should have ARDPI on it. Please update remarks.'	
      END


		--To Check if there is duplicated Document Series
		 SELECT @vDocSeries = U_DocSeries FROM ODPI WHERE DocNum=@list_of_cols_val_tab_del 

		IF (SELECT COUNT(U_DocSeries) FROM ODPI WHERE DocNum <> @list_of_cols_val_tab_del AND U_DocSeries=@vDocSeries AND CANCELED='N') > 0
		BEGIN
			SET @error=2
			SET @error_message =N'Duplicate document series is not allowed.'
		END

		--To check if the Document Series and Warehouse or Store Performance selected is matched
		IF exists (SELECT DocEntry FROM ODPI WHERE DocEntry=@list_of_cols_val_tab_del AND DocType='S')
		BEGIN
			IF(SELECT LEFT(T0.U_DocSeries, 6)  FROM ODPI T0
			WHERE T0.[DocNum]=@list_of_cols_val_tab_del) 
			<>
			(SELECT TOP 1 LEFT(T1.U_Whse,6) FROM DPI1 T0 INNER JOIN OOCR T1
			ON T0.OcrCode=T1.OcrCode
			WHERE T0.Docentry=@list_of_cols_val_tab_del)
			BEGIN
				SET @error=3
				SET @error_message ='Document series should be matched with the selected store performance.'
			END
		END


		--to Check if the mode of payment is charge related
		IF exists (SELECT T1.[DocNum] FROM ODPI T1 WHERE T1.[DocNum]=@list_of_cols_val_tab_del
		AND (T1.[U_BO_PO]='Y' OR T1.[U_SO_COD] = 'Y' OR T1.[U_SO_PO]='Y' OR T1.[U_SO_CM]='Y'  OR T1.[U_BO_COD]='Y' OR T1.[U_SO_HO]='Y' OR T1.[U_BO_HO]='Y'))
		BEGIN
			SET @error=4
			SET @error_message =N'Charge related (except for PDC) transactions are not applicable in AR Down Payment Invoice.'
		END

		--To Check if Document has Sales Order Entry
		IF exists (SELECT T1.[DocNum] FROM ODPI T1 INNER JOIN DPI1 T2 ON T1.DocEntry=T2.DocEntry
		 WHERE T1.[DocNum]=@list_of_cols_val_tab_del AND T1.DocType='I' AND T2.BaseRef='' AND (U_SOType ='' OR U_SOType IS NULL))
		BEGIN
			SET @error=5
			SET @error_message =N'Sales Order is required.'
		END
		

		--modify 01/30/2024
		--To check if the user applied payment means for Cash Invoice
		IF EXISTS(SELECT DocNum FROM ODPI WHERE DocNum=@list_of_cols_val_tab_del AND (U_SO_PDC='Y' OR U_BO_PDC='Y' OR U_SO_ODC = 'Y' OR U_BO_ODC = 'Y') AND CANCELED='N')
		BEGIN

			IF EXISTS(SELECT DocNum FROM ODPI WHERE DocNum=@list_of_cols_val_tab_del AND U_UnAppAmt >= DocTotal AND PaidToDate > 0)
			BEGIN
					SET @iApp=0
					SET @error=6
					SET @error_message =N'Payment is not applicable for this transaction. Unapplied amount is greater than the document total.'

			END
			--ELSE IF EXISTS(SELECT DocNum FROM ODPI WHERE DocNum=@list_of_cols_val_tab_del AND U_UnAppAmt != 0 AND U_UnAppAmt < DocTotal AND U_UnAppAmt != (DocTotal-PaidToDate))
			--BEGIN
			--		SET @iApp=1
			--		SET @error=6
			--		SET @error_message =N'Payment means should be net of the unapplied invoice amount.'
			--END
			ELSE IF EXISTS(SELECT DocNum FROM ODPI WHERE DocNum=@list_of_cols_val_tab_del AND U_UnAppAmt = 0 AND PaidToDate=0)
			BEGIN
					SET @iApp=0
					SET @error=10
					SET @error_message =N'Payment means is required for Post Dated Check.'
			END
			ELSE
			BEGIN
					SET @iApp=1
			END

			IF @iApp= 1 
			BEGIN
					
					IF EXISTS(SELECT T0.DocNum,T1.DocEntry,T0.CheckNum,T0.DueDate FROM RCT1 T0 INNER JOIN RCT2  T1
							ON T0.DocNum=T1.DocNum INNER JOIN ORCT T2
							ON T1.DocNum=T2.DocNum
							WHERE T1.DocEntry=@list_of_cols_val_tab_del AND T1.InvType=203  AND T0.DueDate <= CONVERT( varchar, T2.TaxDate, 101) AND T0.U_ChkType='Post Dated')
					BEGIN
						SET @error=6
						SET @error_message =N'For Post Dated Checks, due date should be greater than the current date.'
					END
					ELSE IF EXISTS(SELECT T0.DocNum,T1.DocEntry,T0.CheckNum,T0.DueDate FROM RCT1 T0 INNER JOIN RCT2  T1
										ON T0.DocNum=T1.DocNum INNER JOIN ORCT T2 ON T2.DocNum = T1.DocNum
										WHERE T1.DocEntry=@list_of_cols_val_tab_del AND T1.InvType=203  AND (T0.U_PRNum='' OR T0.U_PRNum IS NULL) AND T2.CardCode NOT IN ('C000107','C000111','C000112') )
					BEGIN
							SET @error=6
							SET @error_message =N'CR No. is required for Check Payment.'
					END

			END

		END	
		--To check if there's a remarks
		IF exists (SELECT DocEntry FROM ODPI WHERE DocEntry=@list_of_cols_val_tab_del AND (Comments='' OR Comments IS NULL))
		BEGIN
			SET @error=7
			SET @error_message =N'Remarks is required.' 
		END

		 --To check if the cashier input a total cash received from the customer
		IF exists (SELECT DocEntry FROM ODPI WHERE DocEntry=@list_of_cols_val_tab_del AND (U_BO_Cash='Y' OR U_SO_Cash='Y') AND U_SO_DTC = 'N' AND U_TotalCash='0.00' AND CANCELED='N')
		BEGIN
			SET @error=8
			SET @error_message =N'Please input the cash received.' 
		END
		ELSE IF exists (SELECT DocEntry FROM ODPI WHERE DocEntry=@list_of_cols_val_tab_del AND (U_BO_Cash = 'N' AND U_SO_Cash ='N') AND U_TotalCash!='0.00' AND CANCELED='N')
		BEGIN
			SET @error=9
			SET @error_message =N'Cash received is not require for non-cash payment.' 
		END



		-- to check if customer are subject for withholding tax
		IF exists(SELECT ItemCode FROM DPI1 WHERE DocEntry=@list_of_cols_val_tab_del)
		BEGIN
			DECLARE @WTax1 VARCHAR(20), @WTaxLiable1 CHAR(1)

			SELECT @WTax1=ODPI.U_WTAX, @WTaxLiable1=OCRD.WTLiable FROM ODPI 
			INNER JOIN OCRD ON ODPI.CardCode = OCRD.CardCode
			WHERE ODPI.DocEntry=@list_of_cols_val_tab_del
				
			IF @WTaxLiable1 = 'N' BEGIN
				IF @WTax1 !='N/A' BEGIN
					SET @error=10
					SET @error_message =N'Customer is not subject for withholding tax. Tagging of withholding tax certificate is not applicable.' 
				END
			END ELSE BEGIN
				IF @WTax1 = 'N/A' BEGIN
					SET @error=10
					SET @error_message =N'Customer is subject for withholding tax. Withholding tax certificate must be tagged with Received or Not Received.'
				END
			END
		END		 	

		--To ensure that the mode of payment selected matched with the Payment Means window

		--For Cash
		IF EXISTS(SELECT DocNum,DocTotal,PaidToDate,U_DocSeries FROM ODPI WHERE DocNum=@list_of_cols_val_tab_del AND  (U_BO_Cash ='Y' OR U_SO_Cash='Y') AND CANCELED='N')
		BEGIN
			IF NOT EXISTS (SELECT T0.DocNum FROM ORCT T0 INNER JOIN RCT2 T1
			ON T0.DocNum=T1.DocNum INNER JOIN ODPI T2
			ON T1.DocEntry =  T2.DocNum
			WHERE T2.DocNum=@list_of_cols_val_tab_del AND T0.CashSum > 0 AND T1.InvType = 203)
			BEGIN

				SET @error=11
				SET @error_message =N'Cash Payment is required'

			END
		END
		
		--For Bank Transfer	
		IF EXISTS(SELECT DocNum,DocTotal,PaidToDate,U_DocSeries FROM ODPI WHERE DocNum=@list_of_cols_val_tab_del AND (U_BO_OT ='Y' OR U_SO_OT='Y') AND CANCELED='N')
		BEGIN
			IF NOT EXISTS (SELECT T0.DocNum FROM ORCT T0 INNER JOIN RCT2 T1
			ON T0.DocNum=T1.DocNum INNER JOIN ODPI T2
			ON T1.DocEntry =  T2.DocNum
			WHERE T2.DocNum=@list_of_cols_val_tab_del AND T0.TrsfrSum > 0 AND T1.InvType = 203)
			BEGIN

				SET @error=12
				SET @error_message =N'Online Transfer Payment is required'

			END
		END

		--For Credit Card
		IF EXISTS(SELECT DocNum,DocTotal,PaidToDate,U_DocSeries FROM ODPI WHERE DocNum=@list_of_cols_val_tab_del AND ( U_BO_CC ='Y' OR  U_SO_CC ='Y') AND CANCELED='N')
		BEGIN
			IF NOT EXISTS (SELECT T0.DocNum FROM ORCT T0 INNER JOIN RCT2 T1
			ON T0.DocNum=T1.DocNum INNER JOIN ODPI T2
			ON T1.DocEntry =  T2.DocNum INNER JOIN RCT3 T3
			ON T0.DocNum=T3.DocNum
			WHERE T2.DocNum=@list_of_cols_val_tab_del AND T0.CreditSum > 0 AND T1.InvType = 203 AND (T3.CrTypeCode=1 AND T3.CreditCard!=3))
			BEGIN

				SET @error=13
				SET @error_message =N'Credit Card Payment is required'

			END
		END

		--For Debit Card
		IF EXISTS(SELECT DocNum,DocTotal,PaidToDate,U_DocSeries FROM ODPI WHERE DocNum=@list_of_cols_val_tab_del AND (U_BO_DC='Y' OR U_SO_DC='Y') AND CANCELED='N')
		BEGIN
			IF NOT EXISTS (SELECT T0.DocNum FROM ORCT T0 INNER JOIN RCT2 T1
			ON T0.DocNum=T1.DocNum INNER JOIN ODPI T2
			ON T1.DocEntry =  T2.DocNum INNER JOIN RCT3 T3
			ON T0.DocNum=T3.DocNum
			WHERE T2.DocNum=@list_of_cols_val_tab_del AND T0.CreditSum > 0 AND T1.InvType = 203 AND (T3.CrTypeCode=2 AND T3.CreditCard=3))
			BEGIN

				SET @error=14
				SET @error_message =N'Debit Card Payment is required'

			END
		END

		--For On Date Check
		IF EXISTS(SELECT DocNum FROM ODPI WHERE DocNum=@list_of_cols_val_tab_del AND  (U_BO_ODC ='Y' OR U_SO_ODC ='Y') AND CANCELED='N')
		BEGIN
			IF NOT EXISTS (SELECT T0.DocNum FROM ORCT T0 INNER JOIN RCT2 T1
			ON T0.DocNum=T1.DocNum INNER JOIN ODPI T2
			ON T1.DocEntry =  T2.DocNum
			WHERE T2.DocNum=@list_of_cols_val_tab_del AND T0.CheckSum > 0 AND T1.InvType = 203)
			BEGIN

				SET @error=15
				SET @error_message =N'On Date Check Payment is required'

			END
		END
		
		--To check the due date based on the CheckType (On Date)
		IF EXISTS(SELECT T0.DocNum FROM RCT1 T0 INNER JOIN RCT2  T1
				 ON T0.DocNum=T1.DocNum INNER JOIN ORCT T2
				 ON T2.DocNum=T1.DocNum
				 WHERE T1.DocEntry=@list_of_cols_val_tab_del AND T1.InvType=203 AND T0.DueDate > CONVERT( varchar, T2.DocDate, 101) AND T0.U_ChkType = 'On Date')
		BEGIN
				SET @error=16
				SET @error_message =N'For On Date Check, due date should less than or equal to the current date.'
		END

		--To ensure that the On Date Check has no CR No.
		--IF EXISTS(SELECT T0.DocNum FROM RCT1 T0 INNER JOIN RCT2  T1
		--				ON T0.DocNum=T1.DocNum 
		--				WHERE T1.DocEntry=@list_of_cols_val_tab_del AND T1.InvType=203 AND (T0.U_PRNum!='' OR T0.U_PRNum IS NOT NULL) AND T0.U_ChkType = 'On Date')
		--BEGIN
		--		SET @error=17
		--		SET @error_message =N'Collection Receipt number is not applicable for On Date Checks.'
		--END

		--To ensure that the Check Type was inputted
		IF EXISTS(SELECT T0.DocNum,T1.DocEntry,T0.CheckNum,T0.DueDate FROM RCT1 T0 INNER JOIN RCT2  T1
						ON T0.DocNum=T1.DocNum 
						WHERE T1.DocEntry=@list_of_cols_val_tab_del AND T1.InvType=203 AND (T0.U_ChkType = '' OR T0.U_ChkType IS NULL))
		BEGIN
				SET @error=18
				SET @error_message =N'Check Type is required'
		END

		--To require the set up in Mode of Releasing as "Pick Up/Delivery to Other Store" from Sales Order
		IF EXISTS(SELECT T0.DocNum FROM ODPI T0 INNER JOIN DPI1 T1 ON T0.DocNum=T1.DocEntry 
				   WHERE T0.DocNum = @list_of_cols_val_tab_del AND (U_SO_PKO='N' AND U_BO_PKO='N' AND U_SO_DO='N' AND U_BO_DO='N' AND U_BO_DS='N' AND U_BO_DSDD='N' AND U_BO_DSDV='N' AND U_BO_DSPD='N' AND U_BO_PKS='N')
					AND (T1.BaseRef != '') AND (U_SO_ODC ='N' AND U_BO_ODC ='N'))
		BEGIN
		
				SET @error=20
				SET @error_message =N'Please use AR Invoice for standard Sales Invoicing.'

		END

		--To check for the right user to add ARDPI
		IF EXISTS(SELECT DocNum FROM ODPI WHERE DocNum=@list_of_cols_val_tab_del AND (U_BO_PKO='Y' OR U_BO_DO='Y') AND CANCELED='N')
		BEGIN

			SELECT DISTINCT @vWhseCode=WhsCode, @iOwnerCode = OwnerCode FROM DPI1 WHERE DocEntry=@list_of_cols_val_tab_del
			IF LEFT((SELECT Warehouse FROM OHEM T0 INNER JOIN OUSR T1 ON T0.userId=T1.USERID INNER JOIN OUDG T2 ON T1.DfltsGroup=T2.Code WHERE T0.empID =  @iOwnerCode),6) = LEFT(@vWhseCode,6)
			BEGIN
					SET @error=10
					SET @error_message =N'AR Down Payment Invoice should be created by another Cashier.'
			END

		END

		--To ensure that the Incoming Payment Discount is match with the AR Invoice SC/PWD Discount
		IF EXISTS(SELECT T0.DocNum FROM ODPI T0 INNER JOIN RCT2 T1 
		ON T0.DocNum=T1.DocEntry 
		WHERE T0.CardCode='C000112' AND InvType=203 AND T0.DocNum=@list_of_cols_val_tab_del AND T0.CANCELED='N' AND T0.U_SCPWD <> T1.DcntSum)
		BEGIN
				SET @error=21
				SET @error_message =N'Incoming Payment Discount should be matched with the AR Invoice SC/PWD Discount.'
		END

		--To check if the description field is empty for Service Type transaction
		IF EXISTS (SELECT T0.DocNum FROM ODPI T0 INNER JOIN DPI1 T1
		ON T0.DocNum=T1.DocEntry
		WHERE T0.DocNum=@list_of_cols_val_tab_del AND T0.CANCELED='N' AND T0.DocType='S' AND (T1.Dscription IS NULL OR T1.Dscription=''))
		BEGIN
				SET @error=22
				SET @error_message =N'Description is required.'
		END
		
		--To check if there is Withholding Tax computation for the customer that has WTax Certificate
		IF EXISTS(SELECT DocNum FROM ODPI WHERE DocNum=@list_of_cols_val_tab_del AND U_WTax='Received' AND DocNum NOT IN (SELECT AbsEntry FROM DPI5 WHERE AbsEntry=@list_of_cols_val_tab_del))
		BEGIN
			SET @error=23
			SET @error_message =N'Withholding tax computation is required.'
		END

		--To check the computation of Withholding Tax
		SET @fActualWTax = (SELECT ROUND(SUM(WTAmnt),2) FROM DPI5 WHERE AbsEntry=@list_of_cols_val_tab_del)

		SET @fStandardWtax = (SELECT ROUND(SUM((Max1099-T0.VatSum) * ROUND((T1.Rate/100),2)),2) FROM  ODPI T0 INNER JOIN DPI5 T1
		ON T0.DocNum=T1.AbsEntry
		WHERE T0.DocNum=@list_of_cols_val_tab_del)

		IF convert(int,@fActualWTax - (@fActualWTax % 1))  <> convert(int,@fStandardWtax - (@fStandardWtax % 1))
		BEGIN
			SET @error=24
			SET @error_message =N'Incorrect withholding tax computation.'
		END

		--To check if multiple code for store performance exist in one document entry
		IF exists (SELECT DocEntry FROM ODPI  WHERE DocEntry=@list_of_cols_val_tab_del AND CANCELED='N')
		BEGIN
			SELECT @iCntWhse =  COUNT(Distinct OcrCode) FROM DPI1 WHERE DocEntry=@list_of_cols_val_tab_del
			IF @iCntWhse > 1
			BEGIN
				SET @error=25
				SET @error_message =N'Multiple store performance is not allowed.' 
			END
		END

		--To check if the Price is zero
		IF EXISTS(SELECT DocEntry FROM DPI1						
					WHERE DocEntry=@list_of_cols_val_tab_del AND ((U_GPBD='0.00' OR U_GPBD='' OR U_GPBD IS NULL) OR PriceAfVAT=0))
		BEGIN
			
			SET @error=26
			SET @error_message =N'Selling Price before and after discount is required.'

		END

		--To check if the WTax Liable field was set to YES if the Customer is subject for WTax
		IF EXISTS(SELECT T0.DocNum FROM ODPI T0 INNER JOIN DPI1 T1 ON T0.DocNum=T1.DocEntry
			INNER JOIN OCRD T2 ON T0.CardCode=T2.CardCode
			WHERE T0.DocNum=@list_of_cols_val_tab_del AND T2.WTLiable ='Y' AND T1.WtLiable='N')
		BEGIN

				SET @error=27
				SET @error_message =N'WTax Liable field should be set into "YES".'

		END

		--To check if there are multiple ARDPI in one Sales Order
		SELECT @iBaseRef= BaseRef FROM DPI1 WHERE DocEntry = @list_of_cols_val_tab_del
		IF (SELECT COUNT (DISTINCT DocEntry) FROM DPI1 WHERE BaseRef = @iBaseRef AND BaseType=17 AND TrgetEntry = 0) > 1
		BEGIN

				SET @error=28
				SET @error_message =N'Multiple AR Down Payment Invoice in one Sales Order is not allowed.'

		END

		--To check if the down payment is 100% for Non-DTC
		IF EXISTS(SELECT DocNum FROM ODPI WHERE DocEntry = @list_of_cols_val_tab_del AND DpmPrcnt <> 100 AND U_SO_DTC='N')
		BEGIN

				SET @error=29
				SET @error_message =N'100% Down Payment is required.'

		END

		--To check if the down payment is not 100% for DTC
		IF EXISTS(SELECT DocNum FROM ODPI WHERE DocEntry = @list_of_cols_val_tab_del AND DpmPrcnt = 100 AND U_SO_DTC='Y')
		BEGIN

				SET @error=29
				SET @error_message =N'100% Down Payment is not required for replacement.'

		END

		--To check if the store performance warehouse belongs to the assigned branch
		IF EXISTS (SELECT DISTINCT T0.DocNum FROM ODPI T0 INNER JOIN DPI1 T1
		ON T0.DocNum=T1.DocEntry INNER JOIN OOCR T2
		ON T1.OcrCode=T2.OcrCode INNER JOIN OWHS T3
		ON T2.U_Whse=T3.WhsCode
		WHERE T0.DocNum=@list_of_cols_val_tab_del AND T0.BPLId != T3.BPLid  AND T0.DocType='S')
		BEGIN
				SET @error=30
				SET @error_message =N'Store Performance should belong to the assigned branch.'
		END

		--To check if there is WTax Common Code assigned from the Wtax Certificate received 
		IF EXISTS(SELECT DocNum FROM ODPI
		WHERE DocNum=@list_of_cols_val_tab_del AND U_WTax='Received' AND U_wTaxComCode IS NULL) 
		BEGIN
				SET @error=40
				SET @error_message =N'Wtax Common Code is required.'
		END

		--To check if there is WTax Common Code assigned from the Wtax Certificate received 
		IF EXISTS(SELECT DocNum FROM ODPI
		WHERE DocNum=@list_of_cols_val_tab_del AND U_WTax != 'Received' AND U_wTaxComCode IS NOT NULL) 
		BEGIN
				SET @error=40
				SET @error_message =N'Wtax Common Code is not required.'
		END

		--To check if there is already WTax Common Code assigned from Incoming Payment
		IF EXISTS(SELECT T0.DocNum FROM ODPI T0 INNER JOIN RCT2 T1
		ON T0.DocNum=T1.DocEntry
		WHERE T0.DocNum=@list_of_cols_val_tab_del AND T1.InvType=203 AND T0.U_WTax='Received' AND T1.U_wTaxComCode IS NOT NULL AND T0.U_wTaxComCode IS NOT NULL) 
		BEGIN
				SET @error=40
				SET @error_message =N'WTax common code already assigned in Incoming Payment.'
		END

		--To check the valid control account of ARDPI-Service Type
		IF EXISTS(SELECT DocNum FROM ODPI T0 INNER JOIN OACT T1 ON T0.CtlAccount=T1.AcctCode
					INNER JOIN DPI1 T2 ON T0.DocNum=T2.DocEntry
					WHERE T0.DocNum =@list_of_cols_val_tab_del AND T2.OcrCode != T1.AccntntCod AND T0.DocType='S' AND T0.CANCELED='N')
		BEGIN

			SET @error=7
			SET @error_message =N'Invalid Control Account, update remarks.'

		END

		--To check the valid control account of ARDPI-Item Type
		IF EXISTS(SELECT DocNum FROM ODPI T0 INNER JOIN OACT T1 ON T0.CtlAccount=T1.AcctCode
					INNER JOIN DPI1 T2 ON T0.DocNum=T2.DocEntry
					WHERE T0.DocNum =@list_of_cols_val_tab_del AND T1.Details NOT LIKE '%' + T2.WhsCode + '%' AND T0.DocType='I' AND T0.CANCELED='N')
		BEGIN

			SET @error=7
			SET @error_message =N'Invalid Control Account, update remarks.'

		END


		--Modify 01/31/2024
		--To ensure that the SO for Drop Ship Pick Up to Vendor or DC is forwarded to AR Invoice
		IF EXISTS(SELECT DocNum FROM ODPI WHERE DocNum =  @list_of_cols_val_tab_del AND (U_BO_DSPD='Y' OR U_BO_DRS ='Y') AND ODPI.CardCode NOT IN ('C000107','C000111','C000112'))
		BEGIN
			
			SET @error=7
			SET @error_message =N'Drop Ship Pick Up to Vendor or Distribution Center should be forwarded to AR Invoice.'

		END


    --To Check if AR Down Payment is allowed for Catch-Up
    DECLARE @DPOWarehouse VARCHAR(10) = (SELECT DISTINCT LEFT(WhsCode,6) FROM DPI1 WHERE DocEntry = @list_of_cols_val_tab_del)

    IF EXISTS (SELECT DISTINCT LEFT(T0.WhsCode,6) FROM OWHS T0 WHERE T0.U_CatchUp = 'Y' AND T0.U_CatchUpDate != (SELECT DISTINCT S0.TaxDate FROM ODPI S0 WHERE S0.DocEntry = @list_of_cols_val_tab_del) AND LEFT(T0.WhsCode,6) = @DPOWarehouse)
    BEGIN
  	    SET @error=8
			  SET @error_message =N'Adding a document that falls outside the allowed date is prohibited during catch up encoding.'	
    END


--To block if store performance is empty-ARDPI
IF EXISTS (SELECT DISTINCT ODPI.DocEntry FROM DPI1 INNER JOIN ODPI ON ODPI.DocEntry = DPI1.DocEntry WHERE OcrCode IS NULL AND ODPI.DocEntry = @list_of_cols_val_tab_del AND DocType = 'I')
    BEGIN
        SET @error=9
        SET @error_message =N'Store Perfomance is required.'
    END

	END	

-- ## Validation for Goods Issue ## --
IF @object_type = '60' AND (@transaction_type='A' OR @transaction_type='U')

	BEGIN  
	
		--- match series with whse



		SET @vExtWhse = (SELECT DISTINCT LEFT(T1.WhsCode, 6)  FROM IGE1 T0 INNER JOIN OWHS T1 ON T0.WhsCode=T1.U_WhseExt WHERE T0.Docentry=@list_of_cols_val_tab_del)

		IF 
		((SELECT LEFT(T0.U_DocSeries, 6)  FROM OIGE T0 WHERE T0.[DocNum]=@list_of_cols_val_tab_del) 
		<>
		(SELECT DISTINCT LEFT(T0.WhsCode, 6)  FROM IGE1 T0 WHERE T0.Docentry=@list_of_cols_val_tab_del)
		AND
		(SELECT LEFT(T0.U_DocSeries, 6)  FROM OIGE T0 WHERE T0.[DocNum]=@list_of_cols_val_tab_del) <>  CASE WHEN @vExtWhse IS NULL THEN '' ELSE @vExtWhse END)
		BEGIN
				SET @error=1
				SET @error_message ='Document series should be matched with the selected warehouse.'
		END


--		IF 
--		((SELECT LEFT(T0.U_DocSeries, 6)  FROM OIGE T0 WHERE T0.[DocNum]=@list_of_cols_val_tab_del) 
--		<>
--		(SELECT DISTINCT LEFT(T0.WhsCode, 6)  FROM IGE1 T0 WHERE T0.Docentry=@list_of_cols_val_tab_del)
--		AND
--		(SELECT LEFT(T0.U_DocSeries, 6)  FROM OIGE T0 WHERE T0.[DocNum]=@list_of_cols_val_tab_del) <>  CASE WHEN @vExtWhse IS NULL THEN '' ELSE @vExtWhse END)
--		BEGIN
--				SET @error=1
--				SET @error_message ='Document series should be matched with the selected warehouse.'
--		END

		--To check if the Series Number is empty
		IF (SELECT LEFT(T0.U_DocSeries, 6)  FROM OIGE T0 WHERE T0.[DocNum]=@list_of_cols_val_tab_del) IS NULL
		BEGIN
				SET @error=2
				SET @error_message ='Document series must be provided in this transaction.'
		END

		--To Check if there is duplicated Document Series
		SELECT @vDocSeries = U_DocSeries FROM OIGE WHERE DocNum=@list_of_cols_val_tab_del 

		IF (SELECT COUNT(U_DocSeries) FROM OIGE WHERE DocNum <> @list_of_cols_val_tab_del AND U_DocSeries=@vDocSeries AND CANCELED='N') > 0
		BEGIN
			SET @error=3
			SET @error_message =N'Duplicate document series is not allowed.'
		END

		--To check if there's a Reason Code
		IF exists (SELECT T0.[DocNum] FROM OIGE T0 WHERE T0.[DocNum]=@list_of_cols_val_tab_del 
		AND (T0.[U_ReasonCode]='' OR T0.[U_ReasonCode] IS NULL))
		BEGIN
			SET @error=4
			SET @error_message =N'Reason code is required.'
		END

		--To require Store performance
		IF exists (SELECT T0.[DocNum] FROM OIGE T0 INNER JOIN IGE1 T1
		ON T0.DocNum=T1.DocEntry
		WHERE T0.[DocNum]=@list_of_cols_val_tab_del 
		AND (T1.OcrCode='' OR T1.OcrCode IS NULL))
		BEGIN
			SET @error=5
			SET @error_message =N'Store Performance is required'
		END

		--To require Expenses by Function
		IF exists (SELECT T0.[DocNum] FROM OIGE T0 INNER JOIN IGE1 T1
		ON T0.DocNum=T1.DocEntry
		WHERE T0.[DocNum]=@list_of_cols_val_tab_del 
		AND (T1.OcrCode2='' OR T1.OcrCode2 IS NULL))
		BEGIN
			SET @error=6
			SET @error_message =N'Expenses by Function is required'
		END

		--To check the existency of document reference (AR invoice) used for Goods Return as Replenishment
		IF  EXISTS(SELECT DocEntry FROM OIGE WHERE DocEntry=@list_of_cols_val_tab_del AND U_ReasonCode=205)
		BEGIN
				IF NOT EXISTS (SELECT DocEntry FROM IGE21 WHERE DocEntry=@list_of_cols_val_tab_del AND ObjectType=60 AND RefObjType = 13)
				BEGIN

					SET @error=7
					SET @error_message =N'AR Invoice referenced document is required.'

				END

				ELSE
				BEGIN

					IF (SELECT COUNT(T1.DocEntry) FROM OIGE T0 INNER JOIN IGE21 T1 ON T0.DocNum=T1.DocEntry
					WHERE T0.DocNum=@list_of_cols_val_tab_del AND T1.RefObjType=13) > 1
					BEGIN
							SET @error=7
							SET @error_message =N'Only one AR Invoice is required in referenced document field.'
					END
					ELSE
					BEGIN
							SELECT @iRefDoc =  T1.RefDocNum FROM OIGE T0 INNER JOIN IGE21 T1 ON T0.DocNum=T1.DocEntry
							WHERE T0.DocNum=@list_of_cols_val_tab_del AND T1.RefObjType=13

							IF (SELECT COUNT(RefDocNum) FROM IGE21 TA WHERE RefDocNum = @iRefDoc AND RefObjType = 13 AND DocEntry NOT IN 
								(SELECT BaseRef FROM IGN1 WHERE BaseRef=TA.DocEntry AND BaseType=60)) > 1
							 
							BEGIN
									SET @error=7
									SET @error_message =N'AR Invoice referenced document already exist.'
							END
							ELSE IF (SELECT COUNT(RefDocNum) FROM IGE21 WHERE DocEntry=@list_of_cols_val_tab_del AND ObjectType=60 AND RefObjType != 13) > 0
							BEGIN
									SET @error=7
									SET @error_message =N'Select AR Invoice as Transaction Type in the referenced document field.'
							END

						END
				END
				
		END


		--To require Fixed Asset Master Data tagging for capitalizable
		IF EXISTS (SELECT DocNum FROM OIGE T0 INNER JOIN IGE1 T1 ON T0.DocNum=T1.DocEntry
					WHERE T0.DocNum=@list_of_cols_val_tab_del AND T0.U_ReasonCode=206 AND (T1.U_FACode='' OR U_FACode IS NULL))
		BEGIN
				SET @error=8
				SET @error_message =N'Fixed Asset Code should be tagged for capitalizable items.'
		END
		ELSE IF EXISTS (SELECT DocNum FROM OIGE T0 INNER JOIN IGE1 T1 ON T0.DocNum=T1.DocEntry
					WHERE T0.DocNum=@list_of_cols_val_tab_del AND T0.U_ReasonCode != 206 AND (T1.U_FACode !='' OR U_FACode IS NOT NULL))
		BEGIN
				SET @error=8
				SET @error_message =N'Fixed Asset Code should not be tagged for non-capitalizable items.'
		END

		--To require Fixed Asset Clearing Account tagging for capitalizable
		IF EXISTS (SELECT DocNum FROM OIGE T0 INNER JOIN IGE1 T1 ON T0.DocNum=T1.DocEntry
					INNER JOIN OACT T2 ON T1.AcctCode=T2.AcctCode
					WHERE T0.DocNum=@list_of_cols_val_tab_del AND T0.U_ReasonCode=206 AND T2.AcctName NOT LIKE '%Fixed Asset Clearing Account%')
		BEGIN
				SET @error=9
				SET @error_message =N'Fixed Asset Clearing Account should be used for capitalizable items.'
		END
		ELSE IF EXISTS (SELECT DocNum FROM OIGE T0 INNER JOIN IGE1 T1 ON T0.DocNum=T1.DocEntry
					INNER JOIN OACT T2 ON T1.AcctCode=T2.AcctCode
					WHERE T0.DocNum=@list_of_cols_val_tab_del AND T0.U_ReasonCode !=206 AND T2.AcctName LIKE '%Fixed Asset Clearing Account%')
		BEGIN
				SET @error=9
				SET @error_message =N'Fixed Asset Clearing Account should not be used for non-capitalizable items.'
		END

		--To check if GL Account is empty
		IF EXISTS(SELECT T0.DocEntry FROM OIGE T0 INNER JOIN IGE1 T1 ON T0.DocEntry=T1.DocEntry
					WHERE T0.DocEntry=@list_of_cols_val_tab_del AND (T1.AcctCode = '' OR T1.AcctCode IS NULL) AND T0.CANCELED='N')
		BEGIN
			SET @error=10
			SET @error_message = N'G/L Account is required.' 
		END

		--To check if there's a remarks
		IF exists (SELECT DocEntry FROM OIGE WHERE DocEntry=@list_of_cols_val_tab_del AND (Comments='' OR Comments IS NULL))
		BEGIN
			SET @error=11
			SET @error_message =N'Remarks is required.' 
		END

		--To check the existency of document reference (GRPO) for reason code - repacking adjustment and vendor repacking
		IF  EXISTS(SELECT DocEntry FROM OIGE WHERE DocEntry=@list_of_cols_val_tab_del AND  U_ReasonCode=208)
		BEGIN
				IF NOT EXISTS (SELECT DocEntry FROM IGE21 WHERE DocEntry=@list_of_cols_val_tab_del AND ObjectType=60 AND RefObjType = 20)
				BEGIN

					SET @error=12
					SET @error_message =N'Goods Receipt PO referenced document is required.'

				END

				ELSE
				BEGIN

					IF (SELECT COUNT(T1.DocEntry) FROM OIGE T0 INNER JOIN IGE21 T1 ON T0.DocNum=T1.DocEntry
					WHERE T0.DocNum=@list_of_cols_val_tab_del AND T1.RefObjType=20) > 1
					BEGIN
							SET @error=12
							SET @error_message =N'Only one Goods Receipt PO is required in referenced document field.'
					END
					ELSE
					BEGIN
							SELECT @iRefDoc =  T1.RefDocNum FROM OIGE T0 INNER JOIN IGE21 T1 ON T0.DocNum=T1.DocEntry
							WHERE T0.DocNum=@list_of_cols_val_tab_del AND T1.RefObjType=20

							--IF (SELECT COUNT(RefDocNum) FROM IGE21 WHERE RefDocNum = @iRefDoc AND RefObjType = 20) > 1
							--BEGIN
							--		SET @error=12
							--		SET @error_message =N'Goods Receipt PO referenced document already exist.'
							--END
							--ELSE 
							IF (SELECT COUNT(RefDocNum) FROM IGE21 WHERE DocEntry=@list_of_cols_val_tab_del AND ObjectType=60 AND RefObjType != 20) > 0
							BEGIN
									SET @error=12
									SET @error_message =N'Select Goods Receipt PO as Transaction Type in the referenced document field.'
							END

						END
				END
				
		END

    --To block if store performance is empty-GOODS-ISSUE
    IF EXISTS (SELECT DISTINCT OIGE.DocEntry FROM IGE1 INNER JOIN OIGE ON OIGE.DocEntry = IGE1.DocEntry WHERE OcrCode IS NULL AND OIGE.DocEntry = @list_of_cols_val_tab_del AND DocType = 'I')
    BEGIN
        SET @error=27
        SET @error_message =N'Store Perfomance is required.'
    END



	END

-- ## Validation for AR Credit Memo ## --

--To Block cancellation
IF @object_type = '14' AND (@transaction_type='A')

BEGIN

IF (SELECT CANCELED FROM ORIN WHERE DocNum = @list_of_cols_val_tab_del)  = 'C'
BEGIN
  IF (SELECT U_USERIDINFO FROM ORIN WHERE DOCENTRY = @list_of_cols_val_tab_del) <> 'Y'
    BEGIN
      IF NOT EXISTS (SELECT T0.DocEntry FROM ORIN T0 INNER JOIN dbo.[@REASONCODE] T1 ON T0.U_USERIDINFO = T1.U_UserPosition WHERE T0.CANCELED <> 'N' AND T0.DocNum = @list_of_cols_val_tab_del AND T1.U_MktgDoc = 'ARCMC')
        BEGIN
          SET @error = 2
          SET @error_message = N'Only allowed User(s) can cancel this document.'
        END	
    END
END

      
    IF EXISTS (SELECT T0.DocEntry FROM ORIN T0 WHERE T0.DocEntry IN (SELECT A0.DocEntry FROM RIN1 A0 WHERE A0.BaseType = 14 ) AND T0.CANCELED <> 'N' AND T0.DocNum = @list_of_cols_val_tab_del AND T0.U_ReasonCancelCode IS NULL)
    BEGIN
      SET @error = 1
      SET @error_message = N'Reason Code for cancellation  is required (ARCM).'
    END 

END


IF @object_type = '14' AND (@transaction_type='A' OR @transaction_type='U')
	BEGIN   

		--To Check if Document Series is generated
		IF exists (SELECT T0.[DocNum] FROM ORIN T0 WHERE T0.[DocNum]=@list_of_cols_val_tab_del 
		AND (T0.[U_DocSeries]='' OR (T0.[U_DocSeries] IS NULL OR T0.[U_DocSeries] = '')))
		BEGIN
			SET @error=1
			SET @error_message =N'Document Series must be provided in this transaction.'
		END

		--To Check if Document Series have CM
		--Modify 02/01/2024
    --IF EXISTS (SELECT U_DocSeries FROM ORIN WHERE DocEntry = @list_of_cols_val_tab_del AND U_DocSeries NOT LIKE '%CM%' --AND U_ARCMType NOT IN ('GS','IB')) 
    --  BEGIN
    --    SET @error=1
			 -- SET @error_message =N'Document Series should have CM on it. Please update remarks.'	
    --  END

		
		--To Check if there is duplicated Document Series
		 SELECT @vDocSeries = U_DocSeries FROM ORIN WHERE DocNum=@list_of_cols_val_tab_del 

		IF (SELECT COUNT(U_DocSeries) FROM ORIN WHERE DocNum <> @list_of_cols_val_tab_del AND U_DocSeries=@vDocSeries AND CANCELED='N') > 0
		BEGIN
			SET @error=2
			SET @error_message =N'Duplicate document series is not allowed.'
		END

		--To check if the Document Series and Warehouse or Store Performance selected is matched
		IF exists (SELECT DocEntry FROM ORIN WHERE DocEntry=@list_of_cols_val_tab_del AND DocType='I')
		BEGIN

			SET @vExtWhse = (SELECT DISTINCT LEFT(T1.WhsCode, 6)  FROM RIN1 T0 INNER JOIN OWHS T1 ON T0.WhsCode=T1.U_WhseExt WHERE T0.Docentry=@list_of_cols_val_tab_del)

			IF((SELECT LEFT(T0.U_DocSeries, 6)  FROM ORIN T0
			WHERE T0.[DocNum]=@list_of_cols_val_tab_del) 
			<>
		   (SELECT DISTINCT LEFT(T0.WhsCode, 6)  FROM RIN1 T0
			WHERE T0.Docentry=@list_of_cols_val_tab_del)
			AND 
			(SELECT LEFT(T0.U_DocSeries, 6)  FROM ORIN T0
			WHERE T0.[DocNum]=@list_of_cols_val_tab_del) <> CASE WHEN @vExtWhse IS NULL THEN '' ELSE @vExtWhse END)
			BEGIN
				SET @error=3
				SET @error_message ='Document series should be matched with the selected warehouse.'
			END
		END
		ELSE IF exists (SELECT DocEntry FROM ORIN WHERE DocEntry=@list_of_cols_val_tab_del AND DocType='S')
		BEGIN
			IF(SELECT LEFT(T0.U_DocSeries, 6)  FROM ORIN T0
			WHERE T0.[DocNum]=@list_of_cols_val_tab_del) 
			<>
			(SELECT TOP 1 LEFT(T1.U_Whse,6) FROM RIN1 T0 INNER JOIN OOCR T1
			ON T0.OcrCode=T1.OcrCode
			WHERE T0.Docentry=@list_of_cols_val_tab_del)
			BEGIN
				SET @error=3
				SET @error_message ='Document series should be matched with the selected store performance.'
			END
		END

		--To check if there is Reason Code
		IF exists (SELECT T0.[DocNum] FROM ORIN T0 INNER JOIN OCRD T1
					ON T0.CardCode=T1.CardCode
					WHERE T0.[DocNum]=@list_of_cols_val_tab_del 
					AND (T0.[U_ReasonCode] = '' OR T0.[U_ReasonCode] IS NULL) AND T1.GroupCode <> 167  )
		BEGIN
			SET @error=4
			SET @error_message =N'Reason code must be selected for this transaction.'
		END

		--To check if there's a remarks
		IF exists (SELECT DocEntry FROM ORIN WHERE DocEntry=@list_of_cols_val_tab_del AND (Comments='' OR Comments IS NULL))
		BEGIN
			SET @error=5
			SET @error_message =N'Remarks is required.' 
		END

		--To check if multiple code for store performance exist in one document entry
		IF exists (SELECT DocEntry FROM ORIN  WHERE DocEntry=@list_of_cols_val_tab_del)
		BEGIN
			SELECT @iCntWhse =  COUNT(Distinct OcrCode) FROM rin1  WHERE DocEntry=@list_of_cols_val_tab_del
			IF @iCntWhse > 1
			BEGIN
				SET @error=6
				SET @error_message =N'Multiple store performance is not allowed.' 
			END
		END

		--To Check if Goods Return document number is inputted (for DC only)
		--IF exists (SELECT T0.[DocNum] FROM ORIN T0 INNER JOIN OBPL T1 ON T0.BPLId=T1.BPLID WHERE T0.[DocNum]=@list_of_cols_val_tab_del 
		--AND (T0.U_GRDocNum='' OR T0.U_GRDocNum IS NULL) AND T0.DocType != 'S' AND T1.U_isDC='Y') 
		--BEGIN
		--	SET @error=7
		--	SET @error_message =N'Goods Return document number is required.'
		--END

		--To Check if ARDPI is not applied in CM related to AR Invoice applied from Down Payment. For Sales Cancellation after AR Invoice in other store.
		IF exists (SELECT DISTINCT DocEntry FROM DPI1 WHERE BaseRef=(SELECT DISTINCT DocEntry FROM RDR1 WHERE 
					DocEntry=(SELECT DISTINCT BaseRef FROM INV1 WHERE DocEntry=(SELECT DISTINCT BaseRef FROM rin1 WHERE DocEntry=@list_of_cols_val_tab_del ))))
		BEGIN
			
			IF exists(SELECT DocEntry FROM RIN9 WHERE DocEntry=@list_of_cols_val_tab_del)	
			BEGIN
				SET @error=8
				SET @error_message =N'AR Down Payment should not be applied in the AR Credit Memo.'
			END

		END

		--To avoid user in creating stand-alone AR CM except for Distribution Center and Services
		IF exists (SELECT T0.DocNum FROM ORIN T0 INNER JOIN RIN1 T1 ON T0.DocEntry=T1.DocEntry
					INNER JOIN OBPL T2 ON T0.BPLId=T2.BPLId
					WHERE T0.DocEntry=@list_of_cols_val_tab_del AND T0.DocType='I' AND (T1.BaseRef='' OR T1.BaseRef is null) AND (T2.U_isDC ='N' OR T2.U_isDC IS NULL)) AND @transaction_type='A'
		BEGIN
			SET @error=9
			SET @error_message =N'Stand-alone AR Credit Memo is not allowed.'
		END

		--To ensure that the user select bad stocks warehouse in AR CM under the reason code "AR CM - Damaged Item"
		IF exists (SELECT DocNum FROM ORIN T0 INNER JOIN RIN1 T1 ON T0.DocEntry=T1.DocEntry WHERE T0.DocEntry=@list_of_cols_val_tab_del AND T0.U_ReasonCode=103 AND T1.WhsCode not like '%BS%' AND RIGHT(T1.WhsCode,2) !='DS')
		BEGIN
			SET @error=10
			SET @error_message =N'Use bad stocks as warehouse code for damaged items.'
		END

		--To ensure that the Actual Location Received was filled up
		IF exists (SELECT T0.DocEntry FROM ORIN T0 INNER JOIN RIN1 T1 ON T0.DocEntry=T1.DocEntry
				 WHERE T0.DocEntry=@list_of_cols_val_tab_del AND (U_ActRcv='' OR U_ActRcv IS NULL) AND T1.BaseType <> 203 AND U_ARCMType != 'IB' AND T0.DocType='I' AND RIGHT(T1.WhsCode,2) !='DS')
		BEGIN
			SET @error=11
			SET @error_message =N'Actual location received is required.' 
		END

		--To check if the Actual Location Received match with the Warehouse Code per Item
		IF exists (SELECT T0.DocEntry FROM ORIN T0 INNER JOIN RIN1 T1 ON T0.DocEntry=T1.DocEntry 
					WHERE T0.DocEntry=@list_of_cols_val_tab_del AND  T0.U_ActRcv != T1.WhsCode AND T1.BaseType <> 203 AND DocType='I' AND RIGHT(T1.WhsCode,2) !='DS')
		BEGIN
			SET @error=12
			SET @error_message =N'Actual location received should match with the warehouse code.'
		END

		--To check if the reason code is matched with the DR Status
		IF exists (SELECT T0.DocEntry FROM ORIN T0 INNER JOIN RIN1 T1 ON T0.DocEntry=T1.DocEntry 
					WHERE T0.DocEntry=@list_of_cols_val_tab_del AND T0.U_ReasonCode=105 AND (T1.ActBaseNum IS NOT NULL OR T1.ActBaseNum != ''))
		BEGIN
			SET @error=13
			SET @error_message =N'Select items without Delivery entry.'
		END
		ELSE IF exists (SELECT T0.DocEntry FROM ORIN T0 INNER JOIN RIN1 T1 ON T0.DocEntry=T1.DocEntry 
					WHERE T0.DocEntry=@list_of_cols_val_tab_del AND T0.U_ReasonCode=106 AND (T1.ActBaseNum IS NULL OR T1.ActBaseNum = ''))
		BEGIN
			SET @error=14
			SET @error_message =N'Select items with Delivery entry.'
		END

		--To check the existency of docuement reference in AR CM (from Goods Return) for DC only
		--IF  EXISTS(SELECT DocEntry FROM ORIN T0 WHERE T0.DocNum=@list_of_cols_val_tab_del AND (T0.U_ARCMType !='') AND T0.CANCELED='N')
		--BEGIN
		--		IF NOT EXISTS (SELECT DocEntry FROM RIN21 WHERE DocEntry=@list_of_cols_val_tab_del AND ObjectType=14 AND RefObjType = 21)
		--		BEGIN

		--			SET @error=15
		--			SET @error_message =N'Goods Return referenced document is required.'

		--		END

		--		ELSE
		--		BEGIN

		--			IF (SELECT COUNT(T1.DocEntry) FROM ORIN T0 INNER JOIN RIN21 T1 ON T0.DocNum=T1.DocEntry
		--			WHERE T0.DocNum=@list_of_cols_val_tab_del AND T1.RefObjType=21) > 1
		--			BEGIN
		--					SET @error=15
		--					SET @error_message =N'Only one Goods Return is required in referenced document field.'
		--			END
		--			ELSE
		--			BEGIN
		--					SELECT @iRefDoc =  T1.RefDocNum FROM ORIN T0 INNER JOIN RIN21 T1 ON T0.DocNum=T1.DocEntry
		--					WHERE T0.DocNum=@list_of_cols_val_tab_del AND T1.RefObjType=21

		--					IF (SELECT COUNT(RefDocNum) FROM ORIN T0 INNER JOIN  RIN21 T1 ON T0.DocNum=T1.DocEntry
		--					WHERE RefDocNum = @iRefDoc AND RefObjType = 21 AND CANCELED='N') > 1
		--					BEGIN
		--							SET @error=15
		--							SET @error_message =N'Goods Return referenced document already exist.'
		--					END
		--					ELSE IF (SELECT COUNT(RefDocNum) FROM RIN21 WHERE DocEntry=@list_of_cols_val_tab_del AND ObjectType=14 AND RefObjType != 21) > 0
		--					BEGIN
		--							SET @error=10
		--							SET @error_message =N'Select Goods Return as Transaction Type in the referenced document field.'
		--					END
		--					ELSE IF EXISTS (SELECT T0.DocNum FROM ORIN T0 INNER JOIN RIN21 T1 ON T0.DocNum=T1.DocEntry WHERE T0.DocNum=@list_of_cols_val_tab_del AND T1.ObjectType=14 AND T1.RefObjType=21 AND (CONVERT(INT,T0.U_GRDocNum) != T1.RefDocNum)) 
		--					BEGIN
		--							SET @error=15
		--							SET @error_message =N'Referenced document number is not matched with the Goods Return document number.'
		--					END
		--					ELSE
		--					BEGIN
		--							IF EXISTS(SELECT T0.DocNum FROM ORIN T0 INNER JOIN ORPD T1
		--							ON T0.U_GRDocNum=T1.DocNum
		--							WHERE T0.DocNum = @list_of_cols_val_tab_del AND T0.DocTotal != T1.DocTotal)
		--							BEGIN
		--									SET @error=15
		--									SET @error_message =N'AR Credit Memo total amount should be matched with the Goods Return.'
		--							END

		--					END

		--				END
		--		END
				
		--END

		--To ensure that the user is using a Non-Drop Ship Warehouse for Goods Return from Store (for DC only)
		--IF  EXISTS(SELECT T0.DocNum FROM ORIN T0
		--			INNER JOIN RIN1 T1 ON T0.DocNum=T1.DocEntry
		--			INNER JOIN OWHS T2 ON T1.WhsCode=T2.WhsCode
		--			WHERE T0.DocNum=@list_of_cols_val_tab_del AND T2.DropShip='Y' AND T0.U_ARCMType='GS')
		--BEGIN
		--		SET @error=16
		--		SET @error_message =N'Drop Ship warehouse is not allowed for this type of transaction.'
		--ENDELSE 
		IF EXISTS(SELECT T0.DocNum FROM ORIN T0
					INNER JOIN RIN1 T1 ON T0.DocNum=T1.DocEntry
					INNER JOIN OWHS T2 ON T1.WhsCode=T2.WhsCode
					WHERE T0.DocNum=@list_of_cols_val_tab_del AND T2.DropShip='N' AND T0.U_ARCMType='IB')
		BEGIN
				SET @error=17
				SET @error_message =N'Non-Drop Ship warehouse is not allowed for this type of transaction.'
		END

		--To ensure that the item from Goods Return is existing in AR CM
		--IF EXISTS(SELECT DocNum FROM ORIN T0 INNER JOIN RIN1 T1 ON T0.DocNum=T1.DocEntry
		--			WHERE T0.DocNum=@list_of_cols_val_tab_del  AND T1.ItemCode NOT IN (SELECT ItemCode FROM RPD1 WHERE DocEntry=T0.U_GRDocNum) AND (T0.U_ARCMType !=''))
		--BEGIN
		--		SET @error=18
		--		SET @error_message =N'Item Code does not exist in Goods Return.'
		--END

		--To check if the description field is empty for Service Type transaction
		IF EXISTS (SELECT T0.DocNum FROM ORIN T0 INNER JOIN RIN1 T1
		ON T0.DocNum=T1.DocEntry
		WHERE T0.DocNum=@list_of_cols_val_tab_del AND T0.CANCELED='N' AND T0.DocType='S' AND (T1.Dscription IS NULL OR T1.Dscription=''))
		BEGIN
				SET @error=19
				SET @error_message =N'Description is required.'
		END

		--To check if there is Withholding Tax computation for the customer that has WTax Certificate
		IF EXISTS(SELECT DocNum FROM ORIN T0 WHERE DocNum=@list_of_cols_val_tab_del AND U_WTax='Received' AND DocNum NOT IN (SELECT AbsEntry FROM RIN5 WHERE AbsEntry=T0.DocNum))
		BEGIN
			SET @error=20
			SET @error_message =N'Withholding tax computation is required.'
		END

		--To check the computation of Withholding Tax
		SET @fActualWTax = (SELECT ROUND(SUM(WTAmnt),2) FROM RIN5 WHERE AbsEntry=@list_of_cols_val_tab_del)

		SET @fStandardWtax = (SELECT ROUND(SUM((Max1099-T0.VatSum) * ROUND((T1.Rate/100),2)),2) FROM  ORIN T0 INNER JOIN RIN5 T1
		ON T0.DocNum=T1.AbsEntry
		WHERE T0.DocNum=@list_of_cols_val_tab_del)

		IF convert(int,@fActualWTax - (@fActualWTax % 1))  <> convert(int,@fStandardWtax - (@fStandardWtax % 1))
		BEGIN
			SET @error=21
			SET @error_message =N'Incorrect withholding tax computation.'
		END
		
		--To check if the Price is zero
		IF EXISTS(SELECT T0.DocEntry FROM RIN1	T0
					INNER JOIN ORIN T1
					ON T0.DocEntry=T1.DocNum					
					WHERE T0.DocEntry=@list_of_cols_val_tab_del AND ((U_GPBD='0.00' OR U_GPBD='' OR U_GPBD IS NULL) OR PriceAfVAT=0) AND (T1.U_ARCMType IS NULL OR T1.U_ARCMType = ''))
		BEGIN
			
			SET @error=22
			SET @error_message =N'Selling Price before and after discount is required.'

		END

		--To check if the Price is zero
		--IF EXISTS(SELECT DocEntry FROM RIN1
		--			WHERE DocEntry=@list_of_cols_val_tab_del AND ((U_PriceBfrDisc=0.00 OR U_PriceBfrDisc IS NULL) OR PriceAfVAT=0))
		--BEGIN
			
		--	SET @error=23
		--	SET @error_message =N'Unit Cost before and after discount is required.'

		--END

		--To check if the WTax Liable field was set to YES if the Customer is subject for WTax
		IF EXISTS(SELECT T0.DocNum FROM ORIN T0 INNER JOIN RIN1 T1 ON T0.DocNum=T1.DocEntry
			INNER JOIN OCRD T2 ON T0.CardCode=T2.CardCode
			WHERE T0.DocNum=@list_of_cols_val_tab_del AND T2.WTLiable ='Y' AND T1.WtLiable='N')
		BEGIN

				SET @error=24
				SET @error_message =N'WTax Liable field should be set into "YES".'

		END

		--To check if the store performance warehouse belongs to the assigned branch
		IF EXISTS (SELECT DISTINCT T0.DocNum FROM ORIN T0 INNER JOIN RIN1 T1
		ON T0.DocNum=T1.DocEntry INNER JOIN OOCR T2
		ON T1.OcrCode=T2.OcrCode INNER JOIN OWHS T3
		ON T2.U_Whse=T3.WhsCode
		WHERE T0.DocNum=@list_of_cols_val_tab_del AND T0.BPLId != T3.BPLid  AND T0.DocType='S')
		BEGIN
				SET @error=25
				SET @error_message =N'Store Performance should belongs to the assigned branch.'
		END

		--To check the valid control account of ARCM-Service Type
		IF EXISTS(SELECT DocNum FROM ORIN T0 INNER JOIN OACT T1 ON T0.CtlAccount=T1.AcctCode
					INNER JOIN RIN1 T2 ON T0.DocNum=T2.DocEntry
					WHERE T0.DocNum =@list_of_cols_val_tab_del AND T2.OcrCode != T1.AccntntCod AND T0.DocType='S' AND T0.CANCELED='N')
		BEGIN

			SET @error=7
			SET @error_message =N'Invalid Control Account, update remarks.'

		END

		--To check the valid control account of ARCM-Item Type
		IF EXISTS(SELECT DocNum FROM ORIN T0 INNER JOIN OACT T1 ON T0.CtlAccount=T1.AcctCode
					INNER JOIN RIN1 T2 ON T0.DocNum=T2.DocEntry
					WHERE T0.DocNum =@list_of_cols_val_tab_del AND T1.Details NOT LIKE '%' + T2.WhsCode + '%' AND T0.DocType='I' AND T0.CANCELED='N')
		BEGIN

			SET @error=7
			SET @error_message =N'Invalid Control Account, update remarks.'

		END

		--To check if the warehouse code was changed from the doc based AR Reserve Invoice where not yet delivered
		IF EXISTS (SELECT T0.DocEntry FROM RIN1 T0 INNER JOIN  OINV T1
		ON T0.BaseRef=T1.DocNum  INNER JOIN INV1 T2
		ON T1.DocNum=T2.DocEntry
		WHERE T0.DocEntry=@list_of_cols_val_tab_del AND T1.isIns='Y' AND T0.ActBaseNum IS NULL AND T0.WhsCode <> T2.WhsCode)
		BEGIN
				SET @error=25
				SET @error_message =N'Changing the warehouse for undelivered items is not allowed.'
		END


    --To Check if AR Credit Memo is allowed for Catch-Up
    DECLARE @CMWarehouse VARCHAR(10) = (SELECT DISTINCT WhsCode FROM RIN1 WHERE DocEntry = @list_of_cols_val_tab_del)

    IF EXISTS (SELECT DISTINCT T0.WhsCode FROM OWHS T0 WHERE T0.U_CatchUp = 'Y' AND T0.U_CatchUpDate != (SELECT DISTINCT S0.TaxDate FROM ORIN S0 WHERE S0.DocEntry = @list_of_cols_val_tab_del) AND T0.WhsCode = @CMWarehouse)
    BEGIN
  	    SET @error=26
			  SET @error_message =N'Adding a document that falls outside the allowed date is prohibited during catch up encoding.'	
    END

		--To Check if Document Series has CM
		--Modify 02/01/2024
		DECLARE @DCCM VARCHAR(10) = (SELECT OCRD.U_DC FROM OCRD INNER JOIN ORIN ON OCRD.CardCode = ORIN.CardCode WHERE ORIN.DocNum = @list_of_cols_val_tab_del )
    IF EXISTS (SELECT U_DocSeries FROM ORIN WHERE DocEntry = @list_of_cols_val_tab_del AND U_DocSeries NOT LIKE '%CM%' AND (@DCCM IS NULL OR @DCCM = ''))--AND U_ARCMType NOT IN ('GS','IB')) 
      BEGIN
        SET @error=27
	    SET @error_message =N'Document Series should be with CM only. Please update remarks.'	
      END


--To block if store performance is empty-ARCM
IF EXISTS (SELECT DISTINCT ORIN.DocEntry FROM RIN1 INNER JOIN ORIN ON ORIN.DocEntry = RIN1.DocEntry WHERE OcrCode IS NULL AND ORIN.DocEntry = @list_of_cols_val_tab_del  AND DocType = 'I' )
    BEGIN
        SET @error=28
        SET @error_message =N'Store Perfomance is required.'
    END

	END


-- ## Validation for Delivery## --

--To Block Cancellation
IF @object_type = '15' AND (@transaction_type='A')

BEGIN

IF (SELECT CANCELED FROM ODLN WHERE DocNum = @list_of_cols_val_tab_del)  = 'C'
BEGIN
  IF (SELECT U_USERIDINFO FROM ODLN WHERE DOCENTRY = @list_of_cols_val_tab_del) <> 'Y'
    BEGIN
      IF NOT EXISTS (SELECT T0.DocEntry FROM ODLN T0 INNER JOIN dbo.[@REASONCODE] T1 ON T0.U_USERIDINFO = T1.U_UserPosition WHERE T0.CANCELED <> 'N' AND T0.DocNum = @list_of_cols_val_tab_del AND T1.U_MktgDoc = 'DR')
        BEGIN
          SET @error = 1
          SET @error_message = N'Only allowed User(s) can cancel this document.'
        END	
    END
END


  IF EXISTS (SELECT T0.DocEntry FROM ODLN T0 WHERE T0.DocEntry IN (SELECT A0.DocEntry FROM DLN1 A0 WHERE A0.BaseType = 15 ) AND T0.CANCELED <> 'N' AND T0.DocNum = @list_of_cols_val_tab_del AND T0.U_ReasonCancelCode IS NULL)
    BEGIN
      SET @error = 2
      SET @error_message = N'Reason Code for cancellation  is required (Delivery).'
    END
END




IF @object_type = '15' AND (@transaction_type='A' OR @transaction_type='U')
	BEGIN   
	
		 --To Check if Document Series is generated
		IF exists (SELECT DocNum FROM ODLN WHERE [DocNum]=@list_of_cols_val_tab_del 
		AND (U_DocSeries LIKE '%N/A%' OR (U_DocSeries IS NULL OR U_DocSeries ='')))
		BEGIN
			SET @error=1
			SET @error_message =N'Document Series must be provided in this transaction.'
		END

		--To Check if there is duplicated Document Series
		 SELECT @vDocSeries = U_DocSeries FROM ODLN WHERE DocNum=@list_of_cols_val_tab_del 

		IF (SELECT COUNT(U_DocSeries) FROM ODLN WHERE DocNum <> @list_of_cols_val_tab_del AND U_DocSeries=@vDocSeries AND CANCELED='N') > 0
		BEGIN
			SET @error=2
			SET @error_message =N'Duplicate document series is not allowed.'
		END

		--To check if the Document Series and Warehouse or Store Performance selected is matched
--		IF exists (SELECT DocEntry FROM ODLN WHERE DocEntry=@list_of_cols_val_tab_del AND DocType='I')
--		BEGIN
--
--			SET @vExtWhse = (SELECT DISTINCT LEFT(T1.WhsCode, 6)  FROM DLN1 T0 INNER JOIN OWHS T1 ON T0.WhsCode=T1.U_WhseExt WHERE T0.Docentry=@list_of_cols_val_tab_del)
--
--			IF((SELECT LEFT(T0.U_DocSeries, 6)  FROM ODLN T0
--			WHERE T0.[DocNum]=@list_of_cols_val_tab_del) 
--			<>
--			(SELECT DISTINCT LEFT(T0.WhsCode, 6)  FROM DLN1 T0
--			WHERE T0.Docentry=@list_of_cols_val_tab_del)
--			AND 
--			(SELECT LEFT(T0.U_DocSeries, 6)  FROM ODLN T0
--			WHERE T0.[DocNum]=@list_of_cols_val_tab_del) <> CASE WHEN @vExtWhse IS NULL THEN '' ELSE @vExtWhse END)
--			BEGIN
--				SET @error=3
--				SET @error_message ='Document series should be matched with the selected warehouse.'
--			END
--
--		END

		--To check the existency of PO as referenced document in Sales order from Distribution Center for Delivery to Customer
		--IF  EXISTS(SELECT DocEntry FROM ODLN WHERE DocEntry=@list_of_cols_val_tab_del AND U_SOType='DC')
		--BEGIN
		--		SELECT @iBaseRef = T1.BaseRef FROM ODLN T0 INNER JOIN DLN1 T1 ON T0.DocNum=T1.DocEntry 
		--		WHERE T0.DocNum=@list_of_cols_val_tab_del

		--		IF NOT EXISTS (SELECT DocEntry FROM RDR21 WHERE DocEntry=@iBaseRef AND ObjectType=17 AND RefObjType = 22)
		--		BEGIN

		--			SET @error=4
		--			SET @error_message =N'PO referenced document from Sales Order is required.'

		--		END

		--END

		--To check if SO with SO Type 'PC' forwarded to Delivery
		--IF  EXISTS(SELECT DocEntry FROM ODLN WHERE DocEntry=@list_of_cols_val_tab_del AND U_SOType='PC')
		--BEGIN
		--		SET @error=5
		--		SET @error_message =N'Delivery is not allowed for Pick Up by Customer transaction.'
		--END

		--To check if there's a remarks
		IF exists (SELECT DocEntry FROM ODLN WHERE DocEntry=@list_of_cols_val_tab_del AND (Comments='' OR Comments IS NULL))
		BEGIN
			SET @error=6
			SET @error_message =N'Remarks is required.' 
		END

		--To check if multiple store perfomance exist in one document entry
		IF exists (SELECT DocEntry FROM ODLN  WHERE DocEntry=@list_of_cols_val_tab_del)
		BEGIN
			SELECT @iCntWhse =  COUNT(Distinct OcrCode) FROM DLN1  WHERE DocEntry=@list_of_cols_val_tab_del
			IF @iCntWhse > 1
			BEGIN
				SET @error=7
				SET @error_message =N'Multiple store performance is not allowed.' 
			END
		END

    --To Check if Delivery is allowed for Catch-Up
    DECLARE @ODLNWarehouse VARCHAR(10) = (SELECT DISTINCT LEFT(WhsCode,6) FROM DLN1 WHERE DocEntry = @list_of_cols_val_tab_del)

    IF (@transaction_type='A') AND EXISTS (SELECT DISTINCT LEFT(T0.WhsCode,6) FROM OWHS T0 WHERE T0.U_CatchUp = 'Y' AND T0.U_CatchUpDate != (SELECT DISTINCT S0.TaxDate FROM ODLN S0 WHERE S0.DocEntry = @list_of_cols_val_tab_del) AND LEFT(T0.WhsCode,6) = @ODLNWarehouse)
    BEGIN
  	    SET @error=8
			  SET @error_message =N'Adding a document that falls outside the allowed date is prohibited during catch up encoding.'	
    END

		--To Check if Document Series is either CASH or CHARGED
    IF EXISTS (SELECT U_DocSeries FROM ODLN WHERE DocEntry = @list_of_cols_val_tab_del AND U_DocSeries NOT LIKE '%DR%') 
      BEGIN
        SET @error=9
			  SET @error_message =N'Document Series should be with DR only. Please update remarks.'	
      END




	END

-- ## Validation for Goods Return Request ## --
IF @object_type = '234000032' AND (@transaction_type='A' OR @transaction_type='U')
      
	  BEGIN   

		--To Check if Document Series is generated
		IF (SELECT LEFT(T0.U_DocSeries, 6)  FROM OPRR T0 WHERE T0.[DocNum]=@list_of_cols_val_tab_del) IS NULL
		BEGIN
			SET @error=1
			SET @error_message ='Document Series must be provided in this transaction.'
		END

		--To Check if there is duplicated Document Series
		 SELECT @vDocSeries = U_DocSeries FROM OPRR WHERE DocNum=@list_of_cols_val_tab_del 

		IF (SELECT COUNT(U_DocSeries) FROM OPRR WHERE DocNum <> @list_of_cols_val_tab_del AND U_DocSeries=@vDocSeries AND CANCELED='N') > 0
		BEGIN
			SET @error=2
			SET @error_message =N'Duplicate document series is not allowed.'
		END


		--To ensure that there is "Transfer To" for stand alone GRPO for Distribution Center
		IF EXISTS (SELECT T0.DocEntry FROM OPRR T0 INNER JOIN OCRD T1
		ON T0.CardCode=T1.CardCode
		WHERE T0.DocEntry = @list_of_cols_val_tab_del  AND ([U_TransferTo] IS NULL OR [U_TransferTo]='') AND (T1.U_DC !='' OR T1.U_DC IS NOT NULL)) 
		BEGIN
			SET @error=3
			SET @error_message =N'Transfer To is required.'
		END

		--To check if there is a Reason Code
		IF EXISTS(SELECT DocNum FROM OPRR WHERE DocEntry=@list_of_cols_val_tab_del AND (U_ReasonCode IS NULL OR U_ReasonCode=''))
		BEGIN
			SET @error=4
			SET @error_message =N'Reason Code is required.' 
		END

		--To check if the Unit Price is greater than zero(0)
		IF EXISTS(SELECT DocNum FROM OPRR T0 INNER JOIN PRR1 T1
		ON T0.DocNum=T1.DocEntry 
		WHERE T0.DocNum=@list_of_cols_val_tab_del AND T1.Price <= 0)
		BEGIN
			SET @error=4
			SET @error_message =N'Unit Price should be greater than zero.' 
		END

END

-- ## Validation for Goods Return ## --
--To Block Cancellation
IF @object_type = '21' AND (@transaction_type='A')

BEGIN


DECLARE @USERPOSITION_GDRTC VARCHAR(2)

SELECT @USERPOSITION_GDRTC = U_UserPosition FROM [@REASONCODE] WHERE U_MktgDoc = 'GDRTC'


DECLARE @RESULT_GDRTC VARCHAR(2)
SELECT @RESULT_GDRTC = (CASE WHEN U_USERIDINFO = 'Y' THEN 'Y' ELSE @USERPOSITION_GDRTC END) FROM ORPD WHERE DOCENTRY = @list_of_cols_val_tab_del



  IF EXISTS (SELECT T0.DocEntry FROM ORPD T0 WHERE T0.DocEntry IN (SELECT A0.DocEntry FROM RPD1 A0 WHERE A0.BaseType = 21 ) AND T0.CANCELED <> 'N' AND T0.DocNum = @list_of_cols_val_tab_del AND T0.U_ReasonCancelCode IS NULL)
BEGIN
  SET @error = 1
  SET @error_message = N'Reason Code for cancellation is required (Goods Return).'
END 

 --To block user listed below from cancelling document 
IF (SELECT CANCELED FROM ORPD WHERE DocNum = @list_of_cols_val_tab_del)  = 'C'
BEGIN
  IF (SELECT U_USERIDINFO FROM ORPD WHERE DOCENTRY = @list_of_cols_val_tab_del) <> 'Y'
    BEGIN
      IF NOT EXISTS (SELECT T0.DocEntry FROM ORPD T0 INNER JOIN dbo.[@REASONCODE] T1 ON T0.U_USERIDINFO = T1.U_UserPosition WHERE T0.CANCELED <> 'N' AND T0.DocNum = @list_of_cols_val_tab_del AND T1.U_MktgDoc = 'GDRTC')
        BEGIN
          SET @error = 2
          SET @error_message = N'Only allowed User(s) can cancel this document.'
        END	
    END
END

	
END



IF @object_type = '21' AND (@transaction_type='A' OR @transaction_type='U')
  BEGIN   
		
		--To Check if Document Series is generated
		IF (SELECT LEFT(T0.U_DocSeries, 6)  FROM ORPD T0 WHERE T0.[DocNum]=@list_of_cols_val_tab_del) IS NULL
		BEGIN
			SET @error=1
			SET @error_message ='Document series must be provided in this transaction.'
		END

		--To Check if there is duplicated Document Series
		 SELECT @vDocSeries = U_DocSeries FROM ORPD WHERE DocNum=@list_of_cols_val_tab_del 

		IF (SELECT COUNT(U_DocSeries) FROM ORPD WHERE DocNum <> @list_of_cols_val_tab_del AND U_DocSeries=@vDocSeries AND CANCELED='N') > 0
		BEGIN
			SET @error=2
			SET @error_message =N'Duplicate document series is not allowed.'
		END

		--To ensure that there is "Transfer To" for stand alone Goods Return for Distribution Center
		IF EXISTS (SELECT T0.DocEntry FROM ORPD T0 INNER JOIN OCRD T1
		ON T0.CardCode=T1.CardCode
		INNER JOIN RPD1 T2 ON T0.DocNum=T2.DocEntry
		WHERE T0.DocEntry = @list_of_cols_val_tab_del  AND (T0.[U_TransferTo] IS NULL OR T0.[U_TransferTo]='') AND (T1.U_DC !='' OR T1.U_DC IS NOT NULL) AND T2.BaseRef !='') 
		BEGIN
			SET @error=3
			SET @error_message =N'Transfer To is required.'
		END
		ELSE IF  EXISTS (SELECT T0.DocEntry FROM ORPD T0 INNER JOIN OCRD T1
		ON T0.CardCode=T1.CardCode
		INNER JOIN RPD1 T2 ON T0.DocNum=T2.DocEntry
		WHERE T0.DocEntry = @list_of_cols_val_tab_del  AND (T0.[U_TransferTo] IS NOT NULL OR T0.[U_TransferTo]!='')  AND T2.BaseRef ='') 
		BEGIN
			SET @error=4
			SET @error_message =N'Transfer To is not required.'
		END

		--To check if there is a Reason Code
		IF EXISTS(SELECT DocNum FROM ORPD WHERE DocEntry=@list_of_cols_val_tab_del AND (U_ReasonCode IS NULL OR U_ReasonCode=''))
		BEGIN
			SET @error=5
			SET @error_message =N'Reason Code is required.' 
		END

		--To check if there's a remarks
		IF exists (SELECT DocEntry FROM ORPD WHERE DocEntry=@list_of_cols_val_tab_del AND (Comments='' OR Comments IS NULL))
		BEGIN
			SET @error=6
			SET @error_message =N'Remarks is required.' 
		END

		--To check if the unit price is greater than zero(0)
		IF EXISTS(SELECT DocNum FROM ORPD T0 INNER JOIN RPD1 T1
		ON T0.DocNum=T1.DocEntry 
		WHERE T0.DocNum=@list_of_cols_val_tab_del AND T1.Price <= 0)
		BEGIN
			SET @error=4
			SET @error_message =N'Unit Price should be greater than zero.' 
		END

    --To block if store performance is empty-GOODS-RETURN
    IF EXISTS (SELECT DISTINCT ORPD.DocEntry FROM RPD1 INNER JOIN ORPD ON ORPD.DocEntry = RPD1.DocEntry WHERE OcrCode IS NULL AND ORPD.DocEntry = @list_of_cols_val_tab_del  AND DocType = 'I')
    BEGIN
        SET @error=7
        SET @error_message =N'Store Perfomance is required.'
    END

END


-- ## Validation for Goods Receipt ## --
IF @object_type = '59' AND (@transaction_type='A' OR @transaction_type='U')
	BEGIN  
		
		--- match series with whse
		
		SET @vExtWhse = (SELECT DISTINCT LEFT(T1.WhsCode, 6)  FROM IGN1 T0 INNER JOIN OWHS T1 ON T0.WhsCode=T1.U_WhseExt WHERE T0.Docentry=@list_of_cols_val_tab_del)

		IF 
		((SELECT LEFT(T0.U_DocSeries, 6)  FROM OIGN T0 WHERE T0.[DocNum]=@list_of_cols_val_tab_del) 
		<>
		(SELECT DISTINCT LEFT(T0.WhsCode, 6)  FROM IGN1 T0 WHERE T0.Docentry=@list_of_cols_val_tab_del)
		AND
		(SELECT LEFT(T0.U_DocSeries, 6)  FROM OIGN T0 WHERE T0.[DocNum]=@list_of_cols_val_tab_del) <>  CASE WHEN @vExtWhse IS NULL THEN '' ELSE @vExtWhse END)
		BEGIN
				SET @error=1
				SET @error_message ='Document series should be matched with the selected warehouse.'
		END

		--To Check if Document Series is generated
		IF (SELECT LEFT(T0.U_DocSeries, 6)  FROM OIGN T0 WHERE T0.[DocNum]=@list_of_cols_val_tab_del) IS NULL
		BEGIN
			SET @error=2
			SET @error_message ='Document Series must be provided in this transaction.'
		END

		--To Check if there is duplicated Document Series
		 SELECT @vDocSeries = U_DocSeries FROM OIGN WHERE DocNum=@list_of_cols_val_tab_del 

		IF (SELECT COUNT(U_DocSeries) FROM OIGN WHERE DocNum <> @list_of_cols_val_tab_del AND U_DocSeries=@vDocSeries AND CANCELED='N') > 0
		BEGIN
			SET @error=3
			SET @error_message =N'Duplicate document series is not allowed.'
		END

		--To check if there is a Reason Code
		IF exists (SELECT T0.[DocNum] FROM OIGN T0 WHERE T0.[DocNum]=@list_of_cols_val_tab_del 
		AND (T0.[U_ReasonCode]='' OR T0.[U_ReasonCode] IS NULL))
		BEGIN
			SET @error=4
			SET @error_message =N'Reason Code is required.'
		END

		--To require Store performance
		IF exists (SELECT T0.[DocNum] FROM OIGN T0 INNER JOIN IGN1 T1
		ON T0.DocNum=T1.DocEntry
		WHERE T0.[DocNum]=@list_of_cols_val_tab_del 
		AND (T1.OcrCode='' OR T1.OcrCode IS NULL))
		BEGIN
			SET @error=5
			SET @error_message =N'Store Performance is required.'
		END

		--To require Expenses by Function
		IF exists (SELECT T0.[DocNum] FROM OIGN T0 INNER JOIN IGN1 T1
		ON T0.DocNum=T1.DocEntry
		WHERE T0.[DocNum]=@list_of_cols_val_tab_del 
		AND (T1.OcrCode2='' OR T1.OcrCode2 IS NULL))
		BEGIN
			SET @error=6
			SET @error_message =N'Expenses by Function is required.'
		END

		--To check the existency of document reference for Goods Receipt (Freebies from PO)
		IF  EXISTS(SELECT DocEntry FROM OIGN WHERE DocEntry=@list_of_cols_val_tab_del AND U_ReasonCode=603)
		BEGIN
				IF NOT EXISTS (SELECT DocEntry FROM IGN21 WHERE DocEntry=@list_of_cols_val_tab_del AND ObjectType=59 AND RefObjType = 22)
				BEGIN

					SET @error=7
					SET @error_message =N'Purchase Order referenced document is required.'

				END

				ELSE
				BEGIN

					IF (SELECT COUNT(T1.DocEntry) FROM OIGN T0 INNER JOIN IGN21 T1 ON T0.DocNum=T1.DocEntry
					WHERE T0.DocNum=@list_of_cols_val_tab_del AND T1.RefObjType=22) > 1
					BEGIN
							SET @error=7
							SET @error_message =N'Only one Purchase Order is required in referenced document field.'
					END
					ELSE
					BEGIN
							SELECT @iRefDoc =  T1.RefDocNum FROM OIGN T0 INNER JOIN IGN21 T1 ON T0.DocNum=T1.DocEntry
							WHERE T0.DocNum=@list_of_cols_val_tab_del AND T1.RefObjType=22

							IF (SELECT COUNT(RefDocNum) FROM IGN21 WHERE RefDocNum = @iRefDoc AND RefObjType = 22) > 1
							BEGIN
									SET @error=7
									SET @error_message =N'Purchase Order referenced document already exist.'
							END
							ELSE IF (SELECT COUNT(RefDocNum) FROM IGN21 WHERE DocEntry=@list_of_cols_val_tab_del AND ObjectType=59 AND RefObjType != 22) > 0
							BEGIN
									SET @error=7
									SET @error_message =N'Select Purchase Order as Transaction Type in the referenced document field.'
							END

						END
				END
				
		END

			--To check the existency of documents reference for Goods Receipt (Excess/Damaged from Drop Ship)
			IF  EXISTS(SELECT DocEntry FROM OIGN WHERE DocEntry=@list_of_cols_val_tab_del AND U_ReasonCode=602)
			BEGIN
					IF NOT EXISTS (SELECT DocEntry FROM IGN21 WHERE DocEntry=@list_of_cols_val_tab_del AND ObjectType=59 AND RefObjType = 13)
					BEGIN

						SET @error=8
						SET @error_message =N'AR Invoice referenced document is required.'

					END
					ELSE IF NOT EXISTS (SELECT DocEntry FROM IGN21 WHERE DocEntry=@list_of_cols_val_tab_del AND ObjectType=59 AND RefObjType = 22)
					BEGIN

						SET @error=8
						SET @error_message =N'Purchase Order referenced document is required.'

					END
					ELSE
					BEGIN

						IF (SELECT COUNT(T1.DocEntry) FROM OIGN T0 INNER JOIN IGN21 T1 ON T0.DocNum=T1.DocEntry
						WHERE T0.DocNum=@list_of_cols_val_tab_del AND T1.RefObjType=13) > 1
						BEGIN
								SET @error=8
								SET @error_message =N'Only one AR Invoice is required in referenced document field.'
						END
						ELSE
						BEGIN
								SELECT @iRefDoc =  T1.RefDocNum FROM OIGN T0 INNER JOIN IGN21 T1 ON T0.DocNum=T1.DocEntry
								WHERE T0.DocNum=@list_of_cols_val_tab_del AND T1.RefObjType=13

								IF (SELECT COUNT(RefDocNum) FROM IGN21 WHERE RefDocNum = @iRefDoc AND RefObjType = 13) > 1
								BEGIN
										SET @error=8
										SET @error_message =N'AR Invoice referenced document already exist.'
								END

						 END

						 IF (SELECT COUNT(T1.DocEntry) FROM OIGN T0 INNER JOIN IGN21 T1 ON T0.DocNum=T1.DocEntry
							WHERE T0.DocNum=@list_of_cols_val_tab_del AND T1.RefObjType=22) > 1
							BEGIN
									SET @error=8
									SET @error_message =N'Only one Purchase Order is required in referenced document field.'
							END
							ELSE
							BEGIN
									SELECT @iRefDoc =  T1.RefDocNum FROM OIGN T0 INNER JOIN IGN21 T1 ON T0.DocNum=T1.DocEntry
									WHERE T0.DocNum=@list_of_cols_val_tab_del AND T1.RefObjType=22

									IF (SELECT COUNT(RefDocNum) FROM IGN21 WHERE RefDocNum = @iRefDoc AND RefObjType = 22) > 1
									BEGIN
											SET @error=8
											SET @error_message =N'Purchase Order referenced document already exist.'
									END
									ELSE IF (SELECT COUNT(RefDocNum) FROM IGN21 WHERE DocEntry=@list_of_cols_val_tab_del AND ObjectType=59 AND (RefObjType != 22 AND RefObjType != 13)) > 0
									BEGIN
											SET @error=8
											SET @error_message =N'Select Purchase Order as Transaction Type in the referenced document field.'
									END

							END

					END

					
			END

		--To ensure that the amount inputted in Goods Receipt for Repacking is zero

		IF EXISTS (SELECT DocNum FROM OIGN T0 INNER JOIN IGN1 T1 ON T0.DocNum=T1.DocEntry WHERE T0.DocNum=@list_of_cols_val_tab_del AND T0.U_ReasonCode=604 AND T1.Price > 0)
		BEGIN
			
				SET @error=9
				SET @error_message =N'Item unit price should be zero(0) for repacking.'

		END

		--To check if GL Account is empty
		IF EXISTS(SELECT T0.DocEntry FROM OIGN T0 INNER JOIN IGN1 T1 ON T0.DocEntry=T1.DocEntry
					WHERE T0.DocEntry=@list_of_cols_val_tab_del AND (T1.AcctCode = '' OR T1.AcctCode IS NULL) AND T0.CANCELED='N')
		BEGIN
			SET @error=10
			SET @error_message = N'G/L Account is required.' 
		END

		--To check if there's a remarks
		IF exists (SELECT DocEntry FROM OIGN WHERE DocEntry=@list_of_cols_val_tab_del AND (Comments='' OR Comments IS NULL))
		BEGIN
			SET @error=11
			SET @error_message =N'Remarks is required.' 
		END

		--To check the existency of document reference (GRPO) for reason code - repacking adjustment
		--IF  EXISTS(SELECT DocEntry FROM OIGN WHERE DocEntry=@list_of_cols_val_tab_del AND U_ReasonCode=604)
		--BEGIN
		--		IF NOT EXISTS (SELECT DocEntry FROM IGN21 WHERE DocEntry=@list_of_cols_val_tab_del AND ObjectType=59 AND RefObjType = 20)
		--		BEGIN

		--			SET @error=12
		--			SET @error_message =N'Goods Receipt PO referenced document is required.'

		--		END

		--		ELSE
		--		BEGIN

		--			IF (SELECT COUNT(T1.DocEntry) FROM OIGN T0 INNER JOIN IGN21 T1 ON T0.DocNum=T1.DocEntry
		--			WHERE T0.DocNum=@list_of_cols_val_tab_del AND T1.RefObjType=20) > 1
		--			BEGIN
		--					SET @error=12
		--					SET @error_message =N'Only one Goods Receipt PO  is required in referenced document field.'
		--			END
		--			ELSE
		--			BEGIN
		--					SELECT @iRefDoc =  T1.RefDocNum FROM OIGN T0 INNER JOIN IGN21 T1 ON T0.DocNum=T1.DocEntry
		--					WHERE T0.DocNum=@list_of_cols_val_tab_del AND T1.RefObjType=22

		--					--IF (SELECT COUNT(RefDocNum) FROM IGN21 WHERE RefDocNum = @iRefDoc AND RefObjType = 20) > 1
		--					--BEGIN
		--					--		SET @error=12
		--					--		SET @error_message =N'Goods Receipt PO referenced document already exist.'
		--					--END
		--					--ELSE 
		--					IF (SELECT COUNT(RefDocNum) FROM IGN21 WHERE DocEntry=@list_of_cols_val_tab_del AND ObjectType=59 AND RefObjType != 20) > 0
		--					BEGIN
		--							SET @error=12
		--							SET @error_message =N'Select Goods Receipt PO as Transaction Type in the referenced document field.'
		--					END

		--				END
		--		END
				
		--END


			--To check the existency of document reference (GRPO) for reason code - vendor repacking
			IF  EXISTS(SELECT DocEntry FROM OIGN WHERE DocEntry=@list_of_cols_val_tab_del AND U_ReasonCode=605)
			BEGIN
					IF NOT EXISTS (SELECT DocEntry FROM IGN21 WHERE DocEntry=@list_of_cols_val_tab_del AND ObjectType=59 AND RefObjType = 20)
					BEGIN

						SET @error=13
						SET @error_message =N'Goods Receipt PO referenced document is required.'

					END
					ELSE IF NOT EXISTS (SELECT DocEntry FROM IGN21 WHERE DocEntry=@list_of_cols_val_tab_del AND ObjectType=59 AND RefObjType = 60)
					BEGIN

						SET @error=13
						SET @error_message =N'Goods Issue referenced document is required.'

					END
					ELSE
					BEGIN

						IF (SELECT COUNT(T1.DocEntry) FROM OIGN T0 INNER JOIN IGN21 T1 ON T0.DocNum=T1.DocEntry
						WHERE T0.DocNum=@list_of_cols_val_tab_del AND T1.RefObjType=20) > 1
						BEGIN
								SET @error=13
								SET @error_message =N'Only one Goods Receipt PO is required in referenced document field.'
						END
						--ELSE
						--BEGIN
						--		--SELECT @iRefDoc =  T1.RefDocNum FROM OIGN T0 INNER JOIN IGN21 T1 ON T0.DocNum=T1.DocEntry
						--		--WHERE T0.DocNum=@list_of_cols_val_tab_del AND T1.RefObjType=20

						--		--IF (SELECT COUNT(RefDocNum) FROM IGN21 WHERE RefDocNum = @iRefDoc AND RefObjType = 20) > 1
						--		--BEGIN
						--		--		SET @error=13
						--		--		SET @error_message =N'Goods Receipt PO referenced document already exist.'
						--		--END

						-- END

						 IF (SELECT COUNT(T1.DocEntry) FROM OIGN T0 INNER JOIN IGN21 T1 ON T0.DocNum=T1.DocEntry
							WHERE T0.DocNum=@list_of_cols_val_tab_del AND T1.RefObjType=60) > 1
							BEGIN
									SET @error=13
									SET @error_message =N'Only one Goods Issue is required in referenced document field.'
							END
							ELSE
							BEGIN
									SELECT @iRefDoc =  T1.RefDocNum FROM OIGN T0 INNER JOIN IGN21 T1 ON T0.DocNum=T1.DocEntry
									WHERE T0.DocNum=@list_of_cols_val_tab_del AND T1.RefObjType=60

									IF (SELECT COUNT(RefDocNum) FROM IGN21 WHERE RefDocNum = @iRefDoc AND RefObjType = 60) > 1
									BEGIN
											SET @error=13
											SET @error_message =N'Goods Issue referenced document already exist.'
									END
									ELSE IF (SELECT COUNT(RefDocNum) FROM IGN21 WHERE DocEntry=@list_of_cols_val_tab_del AND ObjectType=59 AND (RefObjType != 60 AND RefObjType != 20)) > 0
									BEGIN
											SET @error=13
											SET @error_message =N'Select Goods Issue as Transaction Type in the referenced document field.'
									END

							END

					END

					
			END


    --To block if store performance is empty-GOODS-RECEIPT
    IF EXISTS (SELECT DISTINCT OIGN.DocEntry FROM IGN1 INNER JOIN OIGN ON OIGN.DocEntry = IGN1.DocEntry WHERE OcrCode IS NULL AND OIGN.DocEntry = @list_of_cols_val_tab_del AND DocType = 'I')
    BEGIN
        SET @error=27
        SET @error_message =N'Store Perfomance is required.'
    END


	END


-- ## Validation for Inventory Transfer Request ## --
IF @object_type = '1250000001' AND (@transaction_type='A' OR @transaction_type='U')
	BEGIN 


--bryle--11052022
--gchange para ma.matched ang docseries sa warehouse

		-- --To Match Whse details to Series number
		-- IF 
		-- 	(SELECT LEFT(T0.U_DocSeries, 6)  FROM OWTQ T0
		-- 	WHERE T0.[DocNum]=@list_of_cols_val_tab_del) 
		-- 	<>
		-- 	(SELECT DISTINCT LEFT(T0.FromWhsCod, 6)  FROM WTQ1 T0
		-- 	WHERE T0.Docentry=@list_of_cols_val_tab_del)
		-- 		BEGIN
		-- 			SET @error=1
		-- 			SET @error_message ='Document series should be matched with the selected warehouse.'
		-- 		END

		--To check if the Document Series and Warehouse or Store Performance selected is matched
		-- IF exists (SELECT DocEntry FROM OWTQ WHERE DocEntry=@list_of_cols_val_tab_del AND DocType='I')
		-- BEGIN

		-- 	SET @vExtWhse = (SELECT DISTINCT LEFT(T1.WhsCode, 6)  FROM WTQ1 T0 INNER JOIN OWHS T1 ON T0.WhsCode=T1.U_WhseExt WHERE T0.Docentry=@list_of_cols_val_tab_del)

		-- 	IF((SELECT LEFT(T0.U_DocSeries, 6)  FROM OWTQ T0
		-- 	WHERE T0.[DocNum]=@list_of_cols_val_tab_del) 
		-- 	<>
		-- 	(SELECT DISTINCT LEFT(T0.FromWhsCod, 6)  FROM WTQ1 T0
		-- 	WHERE T0.Docentry=@list_of_cols_val_tab_del)
		-- 	AND 
		-- 	(SELECT LEFT(T0.U_DocSeries, 6)  FROM OWTQ T0
		-- 	WHERE T0.[DocNum]=@list_of_cols_val_tab_del) <> CASE WHEN @vExtWhse IS NULL THEN '' ELSE @vExtWhse END)
		-- 	BEGIN
		-- 		SET @error=1
		-- 		SET @error_message ='Document series should be matched with the selected warehouse.'
		-- 	END
		-- END




--bryle--11052022


		--To Check if Document Series is generated
		IF (SELECT LEFT(T0.U_DocSeries, 6)  FROM OWTQ T0 WHERE T0.[DocNum]=@list_of_cols_val_tab_del) IS NULL
		BEGIN
				SET @error=2
				SET @error_message ='Document Series must be provided in this transaction.'
		END

		--To Check if there is duplicated Document Series
		 SELECT @vDocSeries = U_DocSeries FROM OWTQ WHERE DocNum=@list_of_cols_val_tab_del 

		IF (SELECT COUNT(U_DocSeries) FROM OWTQ WHERE DocNum <> @list_of_cols_val_tab_del AND U_DocSeries=@vDocSeries AND CANCELED='N') > 0
		BEGIN
			SET @error=3
			SET @error_message =N'Duplicate document series is not allowed.'
		END

		--To ensure that there is a reason code
		IF exists (SELECT T0.[DocNum] FROM OWTQ T0 WHERE T0.[DocNum]=@list_of_cols_val_tab_del 
		AND (T0.[U_ReasonCode]='' OR T0.[U_ReasonCode] IS NULL))
		BEGIN
			SET @error=4
			SET @error_message =N'Reason code is required.'
		END

		--To ensure that the GRPO document number is valid
		IF exists (SELECT T0.[DocNum] FROM OWTQ T0 WHERE T0.[DocNum]=@list_of_cols_val_tab_del 
		AND T0.[U_ReasonCode]=503 AND T0.[U_GRPO] NOT IN (SELECT DocNum FROM OPDN WHERE DocNum=T0.[U_GRPO]))
		BEGIN
			SET @error=5
			SET @error_message =N'Invalid GRPO document number.'
		END

		--To ensure that the Transfer From and Transfer to has a different Warehouse
		IF EXISTS (SELECT DocNum FROM OWTQ WHERE DocNum=@list_of_cols_val_tab_del AND Filler = ToWhsCode)
		BEGIN
				SET @error=6
				SET @error_message =N'From Warehouse and To Warehouse field should not be the same.'
		END


	END

-- ## Validation for Inventory Transfer ## --

--To block Cancellation
IF @object_type = '67' AND (@transaction_type='C')

BEGIN 


IF (SELECT U_USERIDINFO FROM OWTR WHERE DOCENTRY = @list_of_cols_val_tab_del) <> 'Y'
    BEGIN
      IF NOT EXISTS (SELECT T0.DocEntry FROM OWTR T0 INNER JOIN dbo.[@REASONCODE] T1 ON T0.U_USERIDINFO = T1.U_UserPosition WHERE T0.CANCELED <> 'N' AND T0.DocNum = @list_of_cols_val_tab_del AND T1.U_MktgDoc = 'IVT')
        BEGIN
          SET @error = 1
          SET @error_message = N'Only allowed User(s) can cancel this document.'
        END	
    END

    If NOT EXISTS (select T0.DocEntry FROM OWTR T0	where T0.CANCELED <> 'N'  AND T0.DocEntry = @list_of_cols_val_tab_del AND T0.U_ReasonCancelCode IS NOT NULL)
	      BEGIN
		      SET @error = 2
          SET @error_message = 'Reason Code for cancellation  is required (Inventory Transfer).'
	      END 
       
  END




IF @object_type = '67' AND (@transaction_type='A' OR @transaction_type='U')
	BEGIN 


--bryle--11052022
--gchange para mag matched and warehouse ug docseries


		-- --To Match Whse details to Series number
		-- IF 
		-- 	(SELECT LEFT(T0.U_DocSeries, 6)  FROM OWTR T0
		-- 	WHERE T0.[DocNum]=@list_of_cols_val_tab_del) 
		-- 	<>
		-- 	--(SELECT DISTINCT LEFT(T0.FromWhsCod, 6)  FROM WTR1 t0 -- bryle - 08/24/2022, gchange kay baliktad
        --     (SELECT DISTINCT LEFT(T0.WhsCode, 6)  FROM WTR1 T0
		-- 	WHERE T0.Docentry=@list_of_cols_val_tab_del)
		-- 		BEGIN
		-- 			SET @error=1
		-- 			SET @error_message ='Document series should be matched with the selected warehouse.'
		-- 		END


        
		--To check if the Document Series and Warehouse or Store Performance selected is matched
		IF exists (SELECT DocEntry FROM OWTR WHERE DocEntry=@list_of_cols_val_tab_del AND DocType='I')
		BEGIN

			SET @vExtWhse = (SELECT DISTINCT LEFT(T1.WhsCode, 6)  FROM WTR1 T0 INNER JOIN OWHS T1 ON T0.WhsCode=T1.U_WhseExt WHERE T0.Docentry=@list_of_cols_val_tab_del)

			IF((SELECT LEFT(T0.U_DocSeries, 6)  FROM OWTR T0
			WHERE T0.[DocNum]=@list_of_cols_val_tab_del) 
			<>
			(SELECT DISTINCT LEFT(T0.WhsCode, 6)  FROM WTR1 T0
			WHERE T0.Docentry=@list_of_cols_val_tab_del)
			AND 
			(SELECT LEFT(T0.U_DocSeries, 6)  FROM OWTR T0
			WHERE T0.[DocNum]=@list_of_cols_val_tab_del) <> CASE WHEN @vExtWhse IS NULL THEN '' ELSE @vExtWhse END)
			BEGIN
				SET @error=1
				SET @error_message ='Document series should be matched with the selected warehouse.'
			END
		END
		ELSE IF exists (SELECT DocEntry FROM OWTR WHERE DocEntry=@list_of_cols_val_tab_del AND DocType='S')
		BEGIN
			IF(SELECT LEFT(T0.U_DocSeries, 6)  FROM OWTR T0
			WHERE T0.[DocNum]=@list_of_cols_val_tab_del) 
			<>
			(SELECT TOP 1 LEFT(T1.U_Whse,6) FROM WTR1 T0 INNER JOIN OOCR T1
			ON T0.OcrCode=T1.OcrCode
			WHERE T0.Docentry=@list_of_cols_val_tab_del)
			BEGIN
				SET @error=1
				SET @error_message ='Document series should be matched with the selected store performance.'
			END
		END

--bryle--11052022




		--To Check if Document Series is generated
		IF (SELECT LEFT(T0.U_DocSeries, 6)  FROM OWTR T0 WHERE T0.[DocNum]=@list_of_cols_val_tab_del) IS NULL
		BEGIN
				SET @error=2
				SET @error_message ='Document Series must be provided in this transaction.'
		END

		--To Check if there is duplicated Document Series
		 SELECT @vDocSeries = U_DocSeries FROM OWTR WHERE DocNum=@list_of_cols_val_tab_del 

		IF (SELECT COUNT(U_DocSeries) FROM OWTR WHERE DocNum <> @list_of_cols_val_tab_del AND U_DocSeries=@vDocSeries AND CANCELED='N') > 0
		BEGIN
			SET @error=3
			SET @error_message =N'Duplicate document series is not allowed.'
		END

		--To ensure that there is a reason code
		IF exists (SELECT T0.[DocNum] FROM OWTR T0 WHERE T0.[DocNum]=@list_of_cols_val_tab_del 
		AND (T0.[U_ReasonCode]='' OR T0.[U_ReasonCode] IS NULL))
		BEGIN
			SET @error=4
			SET @error_message =N'Reason code is required.'
		END

		--To ensure that there is a base document except for Repair to Vendor from Service
		IF exists (SELECT T0.[DocNum] FROM OWTR T0 INNER JOIN WTR1 T1
					ON T0.DocNum=T1.DocEntry INNER JOIN OBPL T2
					ON T0.BPLId=T2.BPLId
					WHERE T0.[DocNum]=@list_of_cols_val_tab_del 
					AND (T1.BaseRef='' OR T1.BaseRef IS NULL) AND U_ReasonCode != 505 AND (SELECT position FROM OHEM WHERE userId = T0.UserSign) != 1 AND T2.U_isDC='N')
		BEGIN
			SET @error=5
			SET @error_message =N'Inventory Transfer Request is required.'
		END

		--To ensure that "Only for Repair to Vendor" reason code is allowed to create as stand-alone
		IF exists (SELECT T0.[DocNum] FROM OWTR T0 INNER JOIN WTR1 T1
					ON T0.DocNum=T1.DocEntry
					WHERE T0.[DocNum]=@list_of_cols_val_tab_del 
					AND U_ReasonCode != 505 AND (SELECT position FROM OHEM WHERE userId = T0.UserSign) = 1)
		BEGIN
			SET @error=6
			SET @error_message =N'Only for Repair to Vendor - Reason Code is allowed to use for Sales Clerk.'
		END

		--To ensure that the Transfer From and Transfer to has a different Warehouse
		IF EXISTS (SELECT DocNum FROM OWTR WHERE DocNum=@list_of_cols_val_tab_del AND Filler = ToWhsCode)
		BEGIN
				SET @error=7
				SET @error_message =N'From Warehouse and To Warehouse field should not be the same.'
		END

		--To ensure that the Transfer From and Transfer to has a different Warehouse
		IF EXISTS (SELECT DISTINCT T0.DocNum FROM OWTR T0 INNER JOIN WTR1 T1 ON T0.DocNum=T1.DocEntry 
				WHERE DocNum=@list_of_cols_val_tab_del AND T0.ToWhsCode != T1.WhsCode)
		BEGIN
				SET @error=8
				SET @error_message =N'To Warehouse header and details field should be the same.'
		END

       IF (SELECT LEN(U_DocSeries) FROM OWTR WHERE DocNum = @list_of_cols_val_tab_del) != 16
      BEGIN
        SET @error = 9
        SET @error_message = 'Document series number should be 9 digit only.'
      END


--BRYLE--02072023
    --To block if inventory transfer document series is the same with inventory trainsfer request for KOROST.
    DECLARE @BASEREF INT

    SET @BASEREF = (SELECT TOP 1 BaseRef FROM WTR1 WHERE DocEntry = @list_of_cols_val_tab_del)

    IF (SELECT TOP 1 U_DocSeries FROM OWTR WHERE U_DocSeries LIKE '%KOROST%' AND DocNum = @list_of_cols_val_tab_del   ORDER BY U_DocSeries DESC) = 
       (SELECT TOP 1 U_DocSeries FROM OWTQ WHERE U_DocSeries LIKE '%KOROST%' AND DocNum = @BASEREF  ORDER BY U_DocSeries DESC)
          BEGIN
				    SET @error=10
				    SET @error_message =N'Inventory Transfer Document Series should not be the same with Inventory Transfer Request.'
          END

    --To block if inventory transfer document series is the same with inventory trainsfer request for KORATP.
    IF (SELECT TOP 1 U_DocSeries FROM OWTR WHERE U_DocSeries LIKE '%KORATP%' AND DocNum = @list_of_cols_val_tab_del   ORDER BY U_DocSeries DESC) = 
       (SELECT TOP 1 U_DocSeries FROM OWTQ WHERE U_DocSeries LIKE '%KORATP%' AND DocNum = @BASEREF  ORDER BY U_DocSeries DESC)
          BEGIN
				    SET @error=11
				    SET @error_message =N'Inventory Transfer Document Series should not be the same with Inventory Transfer Request.'
          END  


    --To block if inventory transfer document series is the same with inventory trainsfer request for GSCNAP.
    IF (SELECT TOP 1 U_DocSeries FROM OWTR WHERE U_DocSeries LIKE '%GSCNAP%' AND DocNum = @list_of_cols_val_tab_del   ORDER BY U_DocSeries DESC) = 
       (SELECT TOP 1 U_DocSeries FROM OWTQ WHERE U_DocSeries LIKE '%GSCNAP%' AND DocNum = @BASEREF  ORDER BY U_DocSeries DESC)
          BEGIN
				    SET @error=11
				    SET @error_message =N'Inventory Transfer Document Series should not be the same with Inventory Transfer Request.'
          END  


    --To block if inventory transfer document series is the same with inventory trainsfer request for GSCDCC.
    IF (SELECT TOP 1 U_DocSeries FROM OWTR WHERE U_DocSeries LIKE '%GSCDCC%' AND DocNum = @list_of_cols_val_tab_del   ORDER BY U_DocSeries DESC) = 
       (SELECT TOP 1 U_DocSeries FROM OWTQ WHERE U_DocSeries LIKE '%GSCDCC%' AND DocNum = @BASEREF  ORDER BY U_DocSeries DESC)
          BEGIN
				    SET @error=11
				    SET @error_message =N'Inventory Transfer Document Series should not be the same with Inventory Transfer Request.'
          END  

--BRYLE--02072023

	END


-- ## Validation for GRPO ## --
--To Block Cancellation
IF @object_type = '20' AND (@transaction_type='A')

BEGIN

  IF EXISTS (SELECT T0.DocEntry FROM OPDN T0 WHERE T0.DocEntry IN (SELECT A0.DocEntry FROM PDN1 A0 WHERE A0.BaseType = 20 ) AND T0.CANCELED <> 'N' AND T0.DocNum = @list_of_cols_val_tab_del AND T0.U_ReasonCancelCode IS NULL)
BEGIN
  SET @error = 1
  SET @error_message = N'Reason Code for cancellation  is required (GRPO).'
END 

 --To block user listed below from cancelling document 
IF (SELECT CANCELED FROM OPDN WHERE DocNum = @list_of_cols_val_tab_del)  = 'C'
BEGIN
  IF (SELECT U_USERIDINFO FROM OPDN WHERE DOCENTRY = @list_of_cols_val_tab_del) <> 'Y'
    BEGIN
      IF NOT EXISTS (SELECT T0.DocEntry FROM OPDN T0 INNER JOIN dbo.[@REASONCODE] T1 ON T0.U_USERIDINFO = T1.U_UserPosition WHERE T0.CANCELED <> 'N' AND T0.DocNum = @list_of_cols_val_tab_del AND T1.U_MktgDoc = 'GRPOC')
        BEGIN
          SET @error = 2
          SET @error_message = N'Only allowed User(s) can cancel this document.'
        END	
    END
END


END


IF @object_type = '20' AND (@transaction_type='A' OR @transaction_type='U')
	BEGIN   

		--To Check if Document Series is generated
		IF EXISTS(SELECT DocNum FROM OPDN WHERE [DocNum]=@list_of_cols_val_tab_del AND CANCELED='N')
		BEGIN
			IF (SELECT LEFT(T0.U_DocSeries, 6)  FROM OPDN T0 WHERE T0.[DocNum]=@list_of_cols_val_tab_del) IS NULL
			BEGIN
				SET @error=1
				SET @error_message ='Document Series must be provided in this transaction.'
			END
		END
		
		--To check if the Series Number is already exist
		 SELECT @vDocSeries = U_DocSeries FROM OPDN WHERE DocNum=@list_of_cols_val_tab_del 

		IF (SELECT COUNT(U_DocSeries) FROM OPDN WHERE DocNum <> @list_of_cols_val_tab_del AND U_DocSeries=@vDocSeries AND CANCELED='N') > 0
		BEGIN
			SET @error=2
			SET @error_message =N'Duplicate document series is not allowed.'
		END

		--To ensure that there is a reason code
		IF exists (SELECT T0.[DocNum] FROM OPDN T0 INNER JOIN OCRD T1
		ON T0.CardCode=T1.CardCode
		INNER JOIN PDN1 T2 ON T0.DocNum=T2.DocEntry
		WHERE T0.[DocNum]=@list_of_cols_val_tab_del 
		AND (T0.[U_ReasonCode]='' OR T0.[U_ReasonCode] IS NULL) AND (T1.U_DC !='' OR T1.U_DC IS NOT NULL) AND (T2.BaseRef='' OR T2.BaseRef IS NULL)) 
		BEGIN
			SET @error=3
			SET @error_message =N'Reason code must be selected for this transaction.'
		END

		--To ensure that the PO for Drop Ship will not be forwarded into GRPO
		IF EXISTS (SELECT T0.DocEntry FROM PDN1 T0 INNER JOIN OWHS T1 ON T0.WhsCode=T1.WhsCode WHERE DocEntry = @list_of_cols_val_tab_del  AND T1.DropShip='Y') 
		BEGIN
			SET @error=4
			SET @error_message =N'GRPO is not allowed for Drop Ship transactions.'
		END

		--To ensure that the PO Service Type will not be forwarded into GRPO
		IF EXISTS (SELECT DocNum FROM OPDN WHERE DocNum = @list_of_cols_val_tab_del  AND DocType='S') 
		BEGIN
			SET @error=5
			SET @error_message =N'GRPO is not allowed for Service Type transactions.'
		END

		--To Check if Document has Purchase Order Entry for non inter-branch transaction
		IF EXISTS (SELECT T1.[DocNum] FROM OPDN T1 INNER JOIN PDN1 T2 ON T1.DocEntry=T2.DocEntry
		 WHERE T1.[DocNum]=@list_of_cols_val_tab_del AND T1.DocType='I' AND (T1.U_GRRQDocNum = '' OR T1.U_GRRQDocNum IS NULL)  AND ((T2.BaseRef='' OR T2.BaseRef IS NULL) OR T2.BaseType != 22) AND T1.CANCELED='N')
		BEGIN
			SET @error=6
			SET @error_message =N'Purchase Order is required for non Inter-Branch transactions.'
		END

		--To Check if Document has Purchase Order Entry for non inter-branch transaction
		IF EXISTS (SELECT T1.[DocNum] FROM OPDN T1 INNER JOIN PDN1 T2 ON T1.DocEntry=T2.DocEntry
		 WHERE T1.[DocNum]=@list_of_cols_val_tab_del AND T1.DocType='I' AND (T1.U_GRRQDocNum != '' OR T1.U_GRRQDocNum IS NOT NULL)  AND T2.BaseRef !='')
		BEGIN
			SET @error=7
			SET @error_message =N'Base document is not required for inter-branch transactions.'
		END

		--To ensure that the Actual Location Received was filled up
		IF EXISTS (SELECT T0.DocEntry  FROM OPDN T0 INNER JOIN PDN1 T1 ON T0.DocEntry=T1.DocEntry
				 WHERE T0.DocEntry = @list_of_cols_val_tab_del   
				  AND (U_ActRcv= '' OR U_ActRcv IS NULL) AND T0.U_POType NOT LIKE 'NT%' AND T1.U_ReqBO='N')
		BEGIN
			SET @error=8
			SET @error_message =N'Actual location received is required.'
		END

		--To ensure that the Actual Location Received exists in Warehouse List
		IF EXISTS (SELECT T0.DocEntry  FROM OPDN T0 INNER JOIN PDN1 T1 ON T0.DocEntry=T1.DocEntry
					WHERE T0.DocEntry = @list_of_cols_val_tab_del 
					AND U_ActRcv NOT IN (SELECT WhsCode FROM OWHS) 
					AND T0.U_POType NOT LIKE 'NT%')
		BEGIN
			SET @error=9
			SET @error_message =N'Actual location received should exist in the warehouse list.'
		END

		--To ensure that the Plate Number was Filled Up
		IF EXISTS (SELECT T0.DocEntry FROM OPDN T0 INNER JOIN PDN1 T1 ON T0.DocEntry=T1.DocEntry
					WHERE T0.DocEntry = @list_of_cols_val_tab_del  AND (U_PltNumber='' OR U_PltNumber IS NULL)  
					AND T0.U_POType NOT LIKE 'NT%' AND T0.U_ModeOfReleasing = 'Delivery' AND T1.U_ReqBO='N') 
		BEGIN
			SET @error=10
			SET @error_message =N'Plate Number is required.'
		END

		--To ensure that the Driver was Filled Up
		IF EXISTS (SELECT T0.DocEntry FROM OPDN T0 INNER JOIN PDN1 T1 ON T0.DocEntry=T1.DocEntry
				INNER JOIN OITM T2 ON T1.ItemCode=T2.ItemCode
				WHERE T0.DocEntry = @list_of_cols_val_tab_del  AND (U_Driver='' OR U_Driver IS NULL) AND T0.U_POType NOT LIKE 'NT%' AND T0.U_ModeOfReleasing = 'Delivery') 
		BEGIN
			SET @error=11
			SET @error_message =N'Driver is required.'
		END

		--To ensure that there is a Reference Number in GRPO
		IF EXISTS (SELECT T0.DocEntry FROM OPDN T0 INNER JOIN OCRD T1
					ON T0.CardCode=T1.CardCode
					WHERE T0.DocEntry = @list_of_cols_val_tab_del  AND (NumAtCard='' OR NumAtCard IS NULL) AND (T1.U_DC ='' OR T1.U_DC IS NULL)) 
		BEGIN
			SET @error=12
			SET @error_message =N'Vendor reference number is required.'
		END

		--To ensure that there is "Transfer From" for stand alone GRPO for Distribution Center
		IF EXISTS (SELECT T0.DocEntry FROM OPDN T0 INNER JOIN OCRD T1
			ON T0.CardCode=T1.CardCode
			INNER JOIN PDN1 T2 ON T0.DocNum=T2.DocEntry
			WHERE T0.DocEntry = @list_of_cols_val_tab_del  AND ([U_TransferFrom] IS NULL OR [U_TransferFrom]='') AND (T1.U_DC !='' OR T1.U_DC IS NOT NULL) AND (T2.BaseRef='' OR T2.BaseRef IS NULL)) 
		   BEGIN
				SET @error=13
				SET @error_message =N'Transfer from is required.'
		 END

		 --To ensure that there is Goods Return Request document number for stand alone GRPO for Distribution Center
		IF EXISTS (SELECT T0.DocEntry FROM OPDN T0 INNER JOIN OCRD T1
			ON T0.CardCode=T1.CardCode
			INNER JOIN PDN1 T2 ON T0.DocNum=T2.DocEntry
			WHERE T0.DocEntry = @list_of_cols_val_tab_del  AND (U_GRRQDocNum ='' OR U_GRRQDocNum IS NULL)  AND (T1.U_DC !='' OR T1.U_DC IS NOT NULL) AND (T2.BaseRef='' OR T2.BaseRef IS NULL)) 
		   BEGIN
				SET @error=14
				SET @error_message =N'Goods Return Request document number is required.'
		 END

		--To check if Landed Cost UDF contains amount in Shipping Type - With Freight
		IF exists	(SELECT DocEntry FROM OPDN WHERE DocEntry=@list_of_cols_val_tab_del 
				AND (U_ShippingType='WF')
					AND (U_ARRASTRE = 0 
					AND U_WHARFAGE = 0
					AND U_FREIGHT = 0
					AND U_TRUCKING = 0
					AND U_DOC_STAMP = 0
					AND U_OTHERS = 0 
					AND U_LABOR = 0
					AND U_BROKERAGE_FEE = 0)
					)
		BEGIN
					SET @error=15
					SET @error_message =N'At least one landed cost component is required.' 
		END

		--To check if there's a remarks
		IF exists (SELECT DocEntry FROM OPDN WHERE DocEntry=@list_of_cols_val_tab_del AND (Comments='' OR Comments IS NULL))
		BEGIN
			SET @error=16
			SET @error_message =N'Remarks is required.' 
		END

		-- ## Validation for GRPO Fixed Asset Serial Number Requirement ## --
		IF EXISTS(SELECT T0.DocEntry FROM OPDN T0 INNER JOIN PDN1 T1 ON T0.DocEntry=T1.DocEntry
					WHERE T0.DocEntry=@list_of_cols_val_tab_del AND T1.ITEMCODE LIKE 'FA%' AND T0.DocType='I' AND ((SERIALNUM = '' OR SERIALNUM IS NULL))) 
		BEGIN
			SET @error=17
			SET @error_message =N'Serial number for Fixed Asset is required.' 
		END

		-- ## Validation for GRPO Fixed Asset Serial Number should not be duplicate ## --
		IF EXISTS(SELECT T0.SerialNum FROM PDN1 T0
			INNER JOIN OPDN T1 ON T0.DOCENTRY = T1.DocNum AND T1.CANCELED = 'N' AND T0.ItemCode LIKE 'FA%'
			WHERE T1.DocNum = @list_of_cols_val_tab_del 
			AND T0.SerialNum IN (SELECT TA.SerialNum FROM PDN1 TA
			INNER JOIN OPDN TB ON TB.DOCNUM = TA.DOCENTRY WHERE TB.CANCELED = 'N' AND TA.ItemCode LIKE 'FA%' AND ((TA.SerialNum IS NOT NULL AND TA.SerialNum != '') AND TB.DocEntry <> @list_of_cols_val_tab_del  )
			OR (T0.SerialNum IN (SELECT ASSETSERNO FROM OITM))))
		BEGIN
				SET @error = 18
				SET @error_message = N'Serial number already exists'
		END

	-- ## Validation for GRPO Fixed Asset Serial Number should not be duplicate in Document ## --
		IF EXISTS(SELECT TblHold.Cnt FROM (SELECT COUNT(t1.SerialNum) AS Cnt FROM PDN1 t1
				inner join opdn t0 ON t0.docnum = t1.docentry 
				WHERE t1.DOCENTRY = @list_of_cols_val_tab_del AND T0.CANCELED = 'N' AND T1.ITEMCODE LIKE 'FA%'
				GROUP BY T1.SerialNum
				) AS TblHold 
				WHERE CNT > 1 )

		BEGIN
			SET @error = 19
			SET @error_message = N'Duplicate serial numbers detected'
		END

		 --To check the existency of document reference in GRPO (from Goods Return Request) for DC only
		IF  EXISTS(SELECT T0.DocEntry FROM OPDN T0 INNER JOIN OCRD T1
			ON T0.CardCode=T1.CardCode 
			INNER JOIN PDN1 T2 ON T0.DocNum=T2.DocEntry
			WHERE T0.DocEntry=@list_of_cols_val_tab_del AND (T1.U_DC !='' OR T1.U_DC IS NOT NULL) AND (T2.BaseRef='' OR T2.BaseRef IS NULL))
		BEGIN
				IF NOT EXISTS (SELECT DocEntry FROM PDN21 WHERE DocEntry=@list_of_cols_val_tab_del AND ObjectType=20 AND RefObjType = 234000032)
				BEGIN

					SET @error=20
					SET @error_message =N'Goods Return Request referenced document is required.'

				END

				ELSE
				BEGIN

					IF (SELECT COUNT(T1.DocEntry) FROM OPDN T0 INNER JOIN PDN21 T1 ON T0.DocNum=T1.DocEntry
					WHERE T0.DocNum=@list_of_cols_val_tab_del AND T1.RefObjType=234000032) > 1
					BEGIN
							SET @error=20
							SET @error_message =N'Only one Goods Return Request is required in referenced document field.'
					END
					ELSE
					BEGIN
							SELECT @iRefDoc =  T1.RefDocNum FROM OPDN T0 INNER JOIN PDN21 T1 ON T0.DocNum=T1.DocEntry
							WHERE T0.DocNum=@list_of_cols_val_tab_del AND T1.RefObjType=234000032

							IF (SELECT COUNT(RefDocNum) FROM PDN21 WHERE RefDocNum = @iRefDoc AND RefObjType = 234000032) > 1
							BEGIN
									SET @error=20
									SET @error_message =N'Goods Return Request referenced document already exist.'
							END
							ELSE IF (SELECT COUNT(RefDocNum) FROM PDN21 WHERE DocEntry=@list_of_cols_val_tab_del AND ObjectType=20 AND RefObjType != 234000032) > 0
							BEGIN
									SET @error=20
									SET @error_message =N'Select Goods Return Request as Transaction Type in the referenced document field.'
							END
							ELSE IF EXISTS (SELECT T0.DocNum FROM OPDN T0 INNER JOIN PDN21 T1 ON T0.DocNum=T1.DocEntry 
											WHERE T0.DocNum=@list_of_cols_val_tab_del AND T1.ObjectType=20 AND T1.RefObjType=234000032 AND (CONVERT(INT,T0.U_GRRQDocNum) != T1.RefDocNum)) 
							BEGIN
									SET @error=20
									SET @error_message =N'Referenced document number is not matched with the Goods Return Request document number.'
							END


						END
				END
				
		END

		--To check the existency of PO for Landed Cost as referenced document for PO with Broker
		SELECT DISTINCT @iPONum=BaseRef FROM PDN1 WHERE DocEntry=@list_of_cols_val_tab_del AND BaseType=22

		IF  EXISTS(SELECT T0.DocEntry FROM OPOR T0 INNER JOIN OCRD T1 ON T0.U_BrokerCode=T1.CardCode
				WHERE T0.DocEntry=@iPONum AND (T0.U_BrokerCode != '' OR T0.U_BrokerCode IS NOT NULL) AND T1.U_ReqPOLC='Y')
		BEGIN
				 IF NOT EXISTS (SELECT DocEntry FROM POR21 WHERE DocEntry=@iPONum AND ObjectType=22)
				 BEGIN

				 	SET @error=19
				 	SET @error_message =N'PO for Landed Cost in Base Doc-referenced document field is required.'

				 END
		END

    --To ensure that the warehouse selected in GRPO should be the same with User's default warehouse
	--Modify Default Warehouse --INNER JOIN OUDG T3 ON T3.Code = T2.DfltsGroup
    DECLARE @OWNER INT
    SELECT @OWNER = OwnerCode FROM OPDN WHERE DOcEntry = @list_of_cols_val_tab_del

    IF (SELECT DISTINCT CASE WHEN LEFT(T1.WhsCode,6) = 'KORKM2' THEN 'KOROST' ELSE LEFT(T1.WhsCode,6) END FROM PDN1 T1 WHERE T1.DocEntry = @list_of_cols_val_tab_del) <> 
       (SELECT DISTINCT LEFT(T3.Warehouse,6) FROM OPDN T0 INNER JOIN OHEM T1 ON T0.OwnerCode = T1.empID INNER JOIN OUSR T2 ON T2.INTERNAL_K = T1.userId INNER JOIN OUDG T3 ON T3.Code = T2.DfltsGroup  WHERE T0.OwnerCode = @OWNER AND T0.DocEntry = @list_of_cols_val_tab_del)
      BEGIN
  	    SET @error=21
				--SET @error_message =N'Invalid warehouse code for GRPO.'
        SET @error_message =N'Document warehouse should be the same with the user default warehouse.'
      END

	END


--------------------------------------------------------------------------------------------------------------------------------

--Validation for Incoming Payment

--To Block Cancellation
IF @object_type = '24' AND (@transaction_type='C')

BEGIN

 --To block user listed below from cancelling document 
 IF (SELECT U_USERIDINFO FROM ORCT WHERE DOCENTRY = @list_of_cols_val_tab_del) <> 'Y'
 BEGIN
  If NOT EXISTS (select T0.DocEntry FROM ORCT T0 INNER JOIN dbo.[@REASONCODE] T1 ON T0.U_USERIDINFO = T1.U_UserPosition	where T0.CANCELED = 'Y'  AND T0.DocEntry = @list_of_cols_val_tab_del AND T1.U_MktgDoc = 'INPT' )	
    BEGIN
      SET @error = 1
      SET @error_message = 'Only allowed user(s) can cancel this document.'
     END
END


-- To Block Cancellation
    If NOT EXISTS (select T0.DocEntry FROM ORCT T0	where T0.CANCELED = 'Y'  AND T0.DocEntry = @list_of_cols_val_tab_del AND T0.U_ReasonCancelCode IS NOT NULL )	
    BEGIN
      SET @error = 2
      SET @error_message = 'Reason code is required for cancellation (Incoming Payment).'    	
    END
	
END



IF @object_type = '24' AND (@transaction_type='A' OR @transaction_type='U')
	BEGIN 

		-- To ensure not to set payment location for excess payment from return and replace transactions from cash sales invoices
		IF EXISTS(SELECT T0.DocNum FROM ORCT T0 INNER JOIN RCT2 T1 ON T0.DocNum=T1.DocNum
				   WHERE T0.DocNum=@list_of_cols_val_tab_del AND T0.U_PayLoc !='' AND T0.Canceled='N' AND
				   (SELECT COUNT(DocEntry) FROM OINV WHERE U_DocSeries like '%CASH%' AND DocEntry=T1.DocEntry AND T1.InvType = 13) > 0)
		BEGIN
			SET @error=1
			SET @error_message =N'Payment location should be empty.' 
		END

		-- To ensure to set payment location for charge related invoices
		IF EXISTS(SELECT T0.DocNum FROM ORCT T0 INNER JOIN RCT2 T1 ON T0.DocNum=T1.DocNum
				   WHERE T0.DocNum=@list_of_cols_val_tab_del AND T0.U_PayLoc ='' AND T0.Canceled='N' AND
				   (SELECT COUNT(DocEntry) FROM OINV TA
				   WHERE TA.U_DocSeries like '%CHARGE%' AND TA.DocEntry=T1.DocEntry AND T1.InvType = 13 AND TA.UserSign <> T0.UserSign) > 0)
		BEGIN
			SET @error=2
			SET @error_message =N'Select payment location.' 
		END

		-- To ensure that the Reference/Owner Code is filled up if the Payment Location was set to "Store Collections"
		IF EXISTS(SELECT DocNum FROM ORCT WHERE DocNum=@list_of_cols_val_tab_del AND U_PayLoc='Store Collections' AND (CounterRef='' OR CounterRef IS NULL))
		BEGIN
			SET @error=3
			SET @error_message =N'Reference/Owner Code is required.' 
		END

		--To check the due date based on the CheckType
		IF EXISTS(SELECT T0.DocNum,T1.DocEntry,T0.CheckNum,T0.DueDate FROM RCT1 T0 INNER JOIN ORCT  T1
				 ON T0.DocNum=T1.DocNum
				 WHERE T1.DocNum=@list_of_cols_val_tab_del AND (T1.U_PayLoc != '' OR T1.U_PayLoc IS NOT NULL) AND T0.DueDate > CONVERT( varchar, T1.DocDate, 101) AND T0.U_ChkType = 'On Date')
		BEGIN
				SET @error=4
				SET @error_message =N'For On Date Check, due date should be less than or equal to the current date.'
		END
		-- ELSE IF EXISTS(SELECT T0.DocNum,T1.DocEntry,T0.CheckNum,T0.DueDate FROM RCT1 T0 INNER JOIN ORCT  T1
		-- 		 ON T0.DocNum=T1.DocNum
		-- 		 WHERE T1.DocNum=@list_of_cols_val_tab_del AND (T1.U_PayLoc != '' OR T1.U_PayLoc IS NOT NULL) AND T0.DueDate <= CONVERT( varchar, GETDATE(), 101) AND T0.U_ChkType = 'Post Dated')
		-- BEGIN
		-- 		SET @error=5
		-- 		SET @error_message =N'For Post Dated Checks, due date should be greater than the current date.'
		-- END

		--To check the due date of antedate check (not more than 180 days)
		IF EXISTS(SELECT T0.DocNum,T1.DocEntry,T0.CheckNum,T0.DueDate FROM RCT1 T0 INNER JOIN ORCT  T1
				 ON T0.DocNum=T1.DocNum 
				 WHERE T1.DocNum=@list_of_cols_val_tab_del AND (T1.U_PayLoc != '' OR T1.U_PayLoc IS NOT NULL)  AND DATEDIFF(day,T0.DueDate,GetDate()) >= 180 AND T0.U_ChkType = 'On Date')
		BEGIN
				SET @error=6
				SET @error_message =N'The check date should not exceed 180 days from the date of issuance.'
		END

		--To ensure that the Check Type was inputted
		IF EXISTS(SELECT T0.DocNum,T1.DocEntry,T0.CheckNum,T0.DueDate FROM RCT1 T0 INNER JOIN ORCT  T1
						ON T0.DocNum=T1.DocNum 
						WHERE T1.DocNum=@list_of_cols_val_tab_del AND (T1.U_PayLoc != '' OR T1.U_PayLoc IS NOT NULL)  AND (T0.U_ChkType = '' OR T0.U_ChkType IS NULL))
		BEGIN
				SET @error=7
				SET @error_message =N'Check Type is required'
		END

		--To check that the Collection Receipt and Collector's details are inputted
		IF EXISTS(SELECT DocNum FROM ORCT WHERE DocNum=@list_of_cols_val_tab_del AND U_PayLoc !='' AND (U_Collector='' OR U_Collector IS NULL) AND Canceled='N')
		BEGIN
			SET @error=8
			SET @error_message =N'Collector is required.' 
		END
		ELSE IF EXISTS(SELECT DocNum FROM ORCT WHERE DocNum=@list_of_cols_val_tab_del AND U_PayLoc !='' AND (U_CollRcptDate='' OR U_CollRcptDate IS NULL) AND Canceled='N')
		BEGIN
			SET @error=9
			SET @error_message =N'Collection Receipt Date is required.' 
		END
		ELSE IF EXISTS(SELECT DocNum FROM ORCT WHERE DocNum=@list_of_cols_val_tab_del AND U_PayLoc !='' AND (U_CollRcptNo='' OR U_CollRcptNo IS NULL) AND Canceled='N')
		BEGIN
			SET @error=10
			SET @error_message =N'Collection Receipt No. is required.' 
		END

		--To check if there is already WTax Common Code assigned from Incoming Payment
		IF EXISTS(SELECT T0.DocNum FROM OINV T0 INNER JOIN RCT2 T1
		ON T0.DocNum=T1.DocEntry
		WHERE T1.DocNum=@list_of_cols_val_tab_del AND T1.InvType=13 AND T0.U_WTax='Received' AND (T1.U_wTaxComCode IS NOT NULL OR T1.U_wTaxComCode <> '')) 
		BEGIN
				SET @error=40
				SET @error_message =N'WTax common code already exists in some documents.'
		END
	
		--To check if the target documents with Wtax tagged with WTax Common Code
		
			--For AR/Reserve Invoice
			IF EXISTS (SELECT T0.DocNum FROM ORCT T0 INNER JOIN RCT2 T1 ON T0.DocNum=T1.DocNum
						INNER JOIN OINV T2 ON T1.DocEntry=T2.DocNum
						WHERE T0.DocNum=@list_of_cols_val_tab_del AND T1.U_WTax <> 0 AND T1.U_wTaxComCode IS NULL AND T0.U_PayLoc != ''
						AND T1.InvType=13 AND T2.U_wTaxComCode IS NULL AND T0.U_WTax='Received')
			BEGIN
				SET @error=21
				SET @error_message =N'WTax Common Code is required for target document(s) with WTax amount.'
			END
			--For AR CM
			IF EXISTS (SELECT T0.DocNum FROM ORCT T0 INNER JOIN RCT2 T1 ON T0.DocNum=T1.DocNum
						INNER JOIN ORIN T2 ON T1.DocEntry=T2.DocNum
						WHERE T0.DocNum=@list_of_cols_val_tab_del AND T1.U_WTax <> 0 AND T1.U_wTaxComCode IS NULL AND T0.U_PayLoc != '' 
						AND T1.InvType=203 AND T2.U_wTaxComCode IS NULL AND T0.U_WTax='Received')
			BEGIN
				SET @error=21
				SET @error_message =N'WTax Common Code is required for target document(s) with WTax amount.'
			END
			--For ARDPI
			IF EXISTS (SELECT T0.DocNum FROM ORCT T0 INNER JOIN RCT2 T1 ON T0.DocNum=T1.DocNum
						INNER JOIN ODPI T2 ON T1.DocEntry=T2.DocNum
						WHERE T0.DocNum=@list_of_cols_val_tab_del AND T1.U_WTax <> 0 AND T1.U_wTaxComCode IS NULL AND T0.U_PayLoc != '' 
						AND T1.InvType=14 AND T2.U_wTaxComCode IS NULL AND T0.U_WTax='Received')
			BEGIN
				SET @error=21
				SET @error_message =N'WTax Common Code is required for target document(s) with WTax amount.'
			END

		--To check if there is Wtax Common Code tagged in the target document without WTax Amount
		IF EXISTS (SELECT T0.DocNum FROM ORCT T0 INNER JOIN RCT2 T1 ON T0.DocNum=T1.DocNum
						INNER JOIN OINV T2 ON T1.DocEntry=T2.DocNum
						WHERE T0.DocNum=@list_of_cols_val_tab_del AND T1.U_WTax = 0 AND T1.U_wTaxComCode IS NOT NULL AND T0.U_WTax='Received')
		BEGIN
			SET @error=21
			SET @error_message =N'WTax Common Code is not required for target document(s) without WTax amount.'
		END  

		--To check if the Wtax Common Code exist at least one of the target document for WTax Received status
		IF EXISTS(SELECT T1.DocEntry FROM ORCT T0 INNER JOIN RCT2 T1 ON T0.DocNum=T1.DocNum
		WHERE T0.DocNum=@list_of_cols_val_tab_del AND T0.U_PayLoc !='' AND T0.U_WTax='Received')
		BEGIN
			IF(SELECT COUNT(DocEntry) FROM RCT2
			WHERE DocNum=@list_of_cols_val_tab_del AND U_wTaxComCode IS NOT NULL) = 0
			BEGIN

				SET @error=21
				SET @error_message =N'At least one target document should be tagged with WTax Common Code.'
			END
		END

		--To check if the Wtax Common Code not exist in any target document for WTax Not Received or N/A status
		IF(SELECT COUNT(T1.DocEntry) FROM ORCT T0 INNER JOIN RCT2 T1 ON T0.DocNum=T1.DocNum
		WHERE T0.DocNum=@list_of_cols_val_tab_del AND T0.U_PayLoc !='' AND (T0.U_WTax='Not Received' OR T0.U_WTax='N/A') AND T1.U_wTaxComCode IS NOT NULL) > 0
		BEGIN
			SET @error=21
			SET @error_message =N'WTax Common Code is not required for target document(s).'
		END

		-- To check if customer are subject for withholding tax
		IF EXISTS(SELECT T0.DocNum FROM ORCT T0 INNER JOIN OCRD T1 ON T0.CardCode=T1.CardCode
		WHERE T0.DocNum=@list_of_cols_val_tab_del AND T1.WTLiable='N' AND T0.U_WTax !='N/A' AND T0.U_PayLoc !='')
		BEGIN
			SET @error=21
			SET @error_message =N'Tagging of withholding tax certificate is not applicable.'
		END
		ELSE IF EXISTS(SELECT T0.DocNum FROM ORCT T0 INNER JOIN OCRD T1 ON T0.CardCode=T1.CardCode
		WHERE T0.DocNum=@list_of_cols_val_tab_del AND T1.WTLiable='Y' AND T0.U_WTax ='N/A' AND T0.U_PayLoc !='')
		BEGIN
			SET @error=21
			SET @error_message =N'Withholding tax certificate must be tagged with Received or Not Received.'
		END
		
		--To check if the Customer has Bank Account Number that allowed to issue PDC or PO
		IF EXISTS(SELECT T1.DocNum,t0.CardCode FROM OCRD T0 INNER JOIN ORCT T1
		ON T0.CardCode=T1.CardCode INNER JOIN RCT1 T2
		ON T1.DocNum=T2.DocNum
		WHERE T1.DocNum=@list_of_cols_val_tab_del AND (T0.U_AllowPDC='Y' OR U_AllowPO='Y') AND (T2.AcctNum='' OR T2.AcctNum IS NULL))
		BEGIN
				SET @error=40
				SET @error_message =N'Bank Account Number is required.'
		END

		--To check if the Incoming Payment has a referenced document for bounced check
			IF  EXISTS(SELECT T0.DocEntry FROM RCT2 T0 INNER JOIN OJDT T1
						ON T0.DocEntry=T1.TransId INNER JOIN OVPM T2
						ON T1.BaseRef=T2.DocNum
						WHERE T0.DocNum=@list_of_cols_val_tab_del AND T0.InvType=46 AND T2.U_PaymentType='BC')
			BEGIN
					IF NOT EXISTS (SELECT DocEntry FROM RCT9 WHERE DocEntry=@list_of_cols_val_tab_del AND ObjType=24 AND (RefObjType = 13 OR RefObjType = 203))
					BEGIN

						SET @error=17
						SET @error_message =N'AR Invoice or Down Payment Invoice in referenced document field is required.'

					END

					ELSE
					BEGIN

						IF (SELECT COUNT(RefDocNum) FROM RCT9 WHERE DocEntry=@list_of_cols_val_tab_del AND ObjType=24 AND (RefObjType != 13 AND RefObjType != 203)) > 0
						BEGIN
								SET @error=20
								SET @error_message =N'Select AR Invoice  or Down Payment Invoice as Transaction Type in the referenced document field.'
						END
						ELSE IF NOT EXISTS (SELECT DocEntry FROM VPM9 WHERE RefDocNum IN (SELECT DISTINCT DocNum FROM RCT2 WHERE DocEntry IN 
								(SELECT RefDocNum FROM RCT9 WHERE DocEntry=@list_of_cols_val_tab_del)AND (Invtype = 13 OR InvType=203)))
						BEGIN

								SET @error=20
								SET @error_message =N'Incoming Payment for AR Invoice selected should exist in the Outgoing Payment referenced document.'

						END

								
					END
				
			END

	END

-- Validation for Outgoing Payment

-- To Block Cancellation
IF @object_type = '46' AND (@transaction_type='C')

BEGIN

 IF (SELECT U_USERIDINFO FROM OVPM WHERE DOCENTRY = @list_of_cols_val_tab_del) <> 'Y'
 BEGIN
  If NOT EXISTS (select T0.DocEntry FROM OVPM T0 INNER JOIN dbo.[@REASONCODE] T1 ON T0.U_USERIDINFO = T1.U_UserPosition	where T0.CANCELED <> 'N'  AND T0.DocEntry = @list_of_cols_val_tab_del AND T1.U_MktgDoc = 'OGPT' )	
    BEGIN
      SET @error = 1
      SET @error_message = 'Only allowed user(s) can cancel this document.'
    END
  END

 If NOT EXISTS (select T0.DocEntry FROM OVPM T0	where T0.CANCELED = 'Y'  AND T0.DocEntry = @list_of_cols_val_tab_del AND T0.U_ReasonCancelCode IS NOT NULL )	
    BEGIN
      SET @error = 2
      SET @error_message = 'Reason code is required for cancellation (Outgoing Payment).'    	
    END	
END


IF @object_type = '46' AND (@transaction_type='A' OR @transaction_type='U')
 BEGIN 
			--To required remarks  
			IF EXISTS (SELECT DocEntry FROM OVPM WHERE Comments IS NULL AND DocEntry=@list_of_cols_val_tab_del)
			BEGIN
				SET @error=1
				SET @error_message ='Remarks is required.' 
			END

			--To ensure that the only Managing Director can add the approved Outgoing Payment Entry
            --Bryle 06/28/2022
			-- IF EXISTS(SELECT T0.UserSign FROM OVPM T0 INNER JOIN OUSR T1
			-- 		  ON T0.UserSign=T1.USERID
			-- 		  WHERE T0.DocEntry =  @list_of_cols_val_tab_del AND (T1.SUPERUSER='N' AND T1.USER_CODE !='ACCT1') 
			-- 		  AND ((T0.U_PaymentType = 'RC'  AND  T0.DocTotal  > 1000) OR (T0.U_PaymentType != 'RC' AND T0.U_PaymentType != 'BC')))
			-- BEGIN
			-- 	SET @error=2
			-- 	SET @error_message ='Only the Managing Director can add the Outgoing Payment entry' 
			-- END
            --Bryle 06/28/2022

			--To ensure that the Date Issued was inputted
			IF (SELECT T1.CHECKSUM FROM OVPM T1 WHERE T1.DocNum = @list_of_cols_val_tab_del ) > 0
			AND (SELECT U_ISSUEDATE FROM VPM1 T1 WHERE T1.docnum = @list_of_cols_val_tab_del ) is null
			BEGIN
					SET @error=3
					SET @error_message = 'Date issued is required.'
			END

			--To ensure that the Check Number was inputted
			IF EXISTS (SELECT DocNum FROM VPM1 WHERE	DocNum = @list_of_cols_val_tab_del AND (U_ChkNumExt IS NULL OR U_ChkNumExt =''))
			BEGIN
					SET @error=4
					SET @error_message = 'Check number is required.'
			END

			--To require Payment Type when Adding the Outgoing Payment
			IF EXISTS (SELECT DocEntry FROM OVPM WHERE DocEntry=@list_of_cols_val_tab_del
						AND (U_PaymentType IS NULL OR U_PaymentType =''))
			BEGIN
				SET @error=5
				SET @error_message ='Payment type is required.' 
			END

			--To check if the Total Payment in Outgoing is equal to the last batch of APDPR payment made	
			IF EXISTS(SELECT t0.DocNum FROM OVPM t0 
			INNER JOIN VPM2 t1 ON t0.DocNum=t1.DocNum INNER JOIN ODPO t2 ON t1.DocEntry=t2.DocNum
			WHERE t0.DocNum=@list_of_cols_val_tab_del
			AND t1.AppliedFC != (CASE 
				WHEN t2.U_10th_PAYMENT <> 0 THEN t2.U_10th_PAYMENT 
				WHEN t2.U_9th_PAYMENT <> 0 THEN t2.U_9th_PAYMENT
				WHEN t2.U_8th_PAYMENT <> 0 THEN t2.U_8th_PAYMENT
				WHEN t2.U_7th_PAYMENT <> 0 THEN t2.U_7th_PAYMENT
				WHEN t2.U_6th_PAYMENT <> 0 THEN t2.U_6th_PAYMENT
				WHEN t2.U_5th_PAYMENT <> 0 THEN t2.U_5th_PAYMENT
				WHEN t2.U_4th_PAYMENT <> 0 THEN t2.U_4th_PAYMENT
				WHEN t2.U_3rd_PAYMENT <> 0 THEN t2.U_3rd_PAYMENT
				WHEN t2.U_2nd_PAYMENT <> 0 THEN t2.U_2nd_PAYMENT
				WHEN t2.U_1st_PAYMENT <> 0 THEN t2.U_1st_PAYMENT END)
			AND t0.CardCode=t2.CardCode 
			AND t1.DocEntry=t2.DocNum
			AND t2.CANCELED ='N' 
			AND t2.CreateTran='N'
			AND InvType=204)

			BEGIN
				SET @error=6
				SET @error_message ='Total payment amount is not equal to downpayment amount in AP Down Payment Request.' 
			END
			

			--To check if the check number is duplicate in particular bank code
			SELECT @fCheckNum = U_ChkNumExt, @vBankCode=BankCode FROM VPM1 WHERE DocNum = @list_of_cols_val_tab_del

			IF (SELECT COUNT(T1.DocNum) FROM OVPM T0 INNER JOIN VPM1 T1
				ON T0.DocNum=T1.DocNum
			    WHERE T1.U_ChkNumExt=@fCheckNum AND T1.BankCode=@vBankCode AND T0.Canceled='N') > 1
			BEGIN
				SET @error=6
				SET @error_message ='Check number is duplicated.' 
			END

			--To ensure if there is a check set up for Refund to Customer-Check transaction
			IF EXISTS(SELECT DocNum FROM OVPM WHERE DocNum=@list_of_cols_val_tab_del AND U_PaymentType='RH' AND CheckSum=0)
			BEGIN
					SET @error=21
					SET @error_message =N'Check for refund is required.'
			END

			
			--To check if the target documents with Wtax tagged with WTax Common Code
			IF EXISTS (SELECT DocNum FROM VPM2 WHERE DocNum=@list_of_cols_val_tab_del AND U_WTaxPay <> 0 AND U_wTaxComCode IS NULL)
			BEGIN
				SET @error=21
				SET @error_message =N'WTax Common Code is required for target document(s) with WTax amount.'
			END
			--ELSE IF EXISTS (SELECT DocNum FROM VPM2 WHERE DocNum=@list_of_cols_val_tab_del AND U_WTax = 0 AND U_wTaxComCode IS NOT NULL)
			--BEGIN
			--	SET @error=21
			--	SET @error_message =N'WTax Common Code is not required for target document(s) without WTax amount.'
			--END

			--To check if the Posting Date, Document Date, and Check Date are the same
			IF EXISTS (SELECT T0.DocNum FROM OVPM T0 INNER JOIN VPM1 T1 ON T0.DocNum=T1.DocNum
			WHERE T0.DocNum=@list_of_cols_val_tab_del AND (T1.DueDate <> T0.DocDate OR T1.DueDate <> T0.TaxDate))
			BEGIN
				SET @error=21
				SET @error_message =N'Posting Date and Document Date should be matched with the Check Date.'
			END

			--To check if the Check Mode of Releasing is filled up when the Check Endorsed set into Y
			IF EXISTS(SELECT DocNum FROM OVPM WHERE DocNum=@list_of_cols_val_tab_del AND U_CheckEndorsed='Y' AND (U_ChckModeRel = '' OR U_ChckModeRel IS NULL))
			BEGIN
					SET @error=21
					SET @error_message =N'Check Mode of Releasing is required.'
			END

			--To check if the Check Released Date is filled up when the Check Endorsed set into Y
			IF EXISTS(SELECT DocNum FROM OVPM WHERE DocNum=@list_of_cols_val_tab_del AND U_CheckEndorsed='Y' AND (U_CheckRelDate = '' OR U_CheckRelDate IS NULL))
			BEGIN
					SET @error=21
					SET @error_message =N'Check Released Date is required.'
			END

			--To check if the Outgoing Payment has a referenced document for bounced check
			IF  EXISTS(SELECT DocEntry FROM OVPM WHERE DocEntry=@list_of_cols_val_tab_del AND U_PaymentType='BC')
			BEGIN
					IF NOT EXISTS (SELECT DocEntry FROM VPM9 WHERE DocEntry=@list_of_cols_val_tab_del AND ObjType=46 AND RefObjType = 24)
					BEGIN

						SET @error=17
						SET @error_message =N'Incoming Payment in referenced document field is required.'

					END

					ELSE
					BEGIN

						IF (SELECT COUNT(T1.DocEntry) FROM OVPM T0 INNER JOIN VPM9 T1 ON T0.DocNum=T1.DocEntry
						WHERE T0.DocNum=@list_of_cols_val_tab_del AND T1.RefObjType=24) > 1
						BEGIN
								SET @error=17
								SET @error_message =N'Only one Incoming Payment is required in the referenced document field.'
						END
						ELSE IF (SELECT COUNT(RefDocNum) FROM VPM9 WHERE DocEntry=@list_of_cols_val_tab_del AND ObjType=46 AND RefObjType != 24) > 0
						BEGIN
								SET @error=20
								SET @error_message =N'Select Incoming Payment as Transaction Type in the referenced document field.'
						END
						ELSE
						BEGIN
								IF EXISTS (SELECT T0.DocNum FROM OVPM T0 INNER JOIN VPM9 T1 ON T0.DocNum=T1.DocEntry
											INNER JOIN ORCT T2 ON T1.RefDocNum=T2.DocNum
								WHERE T0.DocNum=@list_of_cols_val_tab_del AND T1.RefObjType=24 AND (T0.DocTotal > T2.DocTotal)) 
								BEGIN
										SET @error=17
										SET @error_message =N'Document Total for Outgoing Payment should not exceed to Incoming Payment.'
								END
						END
								
					END
				
			END
	END


--Validation for Business Partners
IF @object_type = '2' AND (@transaction_type='A' OR @transaction_type='U')
BEGIN 

		--To required remarks  
		IF EXISTS (SELECT CardCode FROM OCRD WHERE CardCode=@list_of_cols_val_tab_del AND CardType='C' AND (U_AllowPDC='Y' AND U_AllowPO='Y'))
		BEGIN
			SET @error=1
			SET @error_message ='Only select either to Allow PO or Allow PDC Issuance. Selecting both is not allowed.' 
		END

		--Requiring Distribution Center ID if the BP grouped as Distribution Center
		--IF EXISTS (SELECT CardCode FROM OCRD WHERE CardCode=@list_of_cols_val_tab_del AND GroupCode=169 AND (U_DC='' OR U_DC IS NULL))
		--BEGIN
		--	SET @error=2
		--	SET @error_message ='Distribution Center ID is required.' 
		--END
		--ELSE IF EXISTS (SELECT CardCode FROM OCRD WHERE CardCode=@list_of_cols_val_tab_del AND GroupCode != 169 AND U_DC != '')
		--BEGIN
		--	SET @error=3
		--	SET @error_message ='Distribution Center ID should be blank.' 
		--END

		------To check if the Customer that subject for Withholding Tax has TIN
		--IF EXISTS(SELECT * FROM OCRD WHERE CardCode=@list_of_cols_val_tab_del AND WTLiable = 'Y' AND (LicTradNum='' OR LicTradNum IS NULL))
		--BEGIN
		--	SET @error=1
		--	SET @error_message ='Federal Tax ID is required' 
		--END

		----To check if the Customer that subject for Withholding Tax has Billing/Shipping Address
		--IF EXISTS(SELECT T0.CardCode FROM OCRD T0 INNER JOIN CRD1 T1 ON T0.CardCode=T1.CardCode WHERE T0.CardCode = @list_of_cols_val_tab_del AND WTLiable = 'Y' AND
		--((Street IS NULL OR Street ='') AND (T1.Block IS NULL or T1.Block ='') AND (T1.ZipCode IS NULL OR T1.ZipCode ='') AND (T1.City IS NULL OR T1.City='') AND (T1.County IS NULL OR T1.County ='')))
		--OR NOT EXISTS(SELECT CardCode FROM  CRD1 WHERE CardCode = @list_of_cols_val_tab_del)
		--BEGIN
		--	SET @error=1
		--	SET @error_message ='Billing and Shipping address is required.' 
		--END

		--To check if the Customer that subject for Withholding Tax has Bank Account
		--IF EXISTS(SELECT T0.CardCode FROM OCRD T0 WHERE T0.CardCode=@list_of_cols_val_tab_del AND T0.CardType='C' AND T0.WTLiable = 'Y' AND (T0.U_AllowPO='Y' OR T0.U_AllowPDC='Y')
		--			AND T0.CardCode NOT IN (SELECT CardCode FROM OCRB WHERE CardCode=T0.CardCode))
		--BEGIN
		--	SET @error=1
		--	SET @error_message ='Business Partner Bank is required.' 
		--END
END

--Validation for Item Master Data
	IF @object_type = '4' AND (@transaction_type='A' OR @transaction_type='U')
	BEGIN 

			------Not allowing to set up the pick up qty both store and warehouse.
			IF EXISTS (SELECT T0.ItemCode,t1.WhsCode,U_WhsePQty,U_StoragePQty FROM OITM T0 INNER JOIN OITW T1
				ON T0.ItemCode=T1.ItemCode
				WHERE T0.ItemCode=@list_of_cols_val_tab_del AND SellItem='Y' AND (((CONVERT(VARCHAR(10),U_WhsePQty) IS NOT NULL OR CONVERT(VARCHAR(10),U_WhsePQty) !='') AND U_WhsePQty != 0) 
				AND ((CONVERT(VARCHAR(10),U_StoragePQty) IS NOT NULL OR CONVERT(VARCHAR(10),U_StoragePQty) !='') AND U_StoragePQty != 0)))
			BEGIN
				SET @error=1
				SET @error_message ='Inputting quantity on both Whse Pick Qty and Storage Pick Up Qty field is not allowed.' 
			END

			---To prevent user from adding/updating Item when Inventory Item and Sales Item is check. Set G/L Accounts By should be Item Group if certain Item Group is selected.
			IF (SELECT InvntItem FROM OITM WHERE ItemCode = @list_of_cols_val_tab_del AND ItmsGrpCod IN (125,123,127,126,129)) = 'Y'
				BEGIN
					SET @error=2
					SET @error_message ='Uncheck Inventory Item.' 
				END
			IF (SELECT SellItem FROM OITM WHERE ItemCode = @list_of_cols_val_tab_del AND ItmsGrpCod IN (125,123,127,126,129)) = 'Y'
				BEGIN
					SET @error=2
					SET @error_message ='Uncheck Sales Item.' 
				END

			---To prevent user from add/updating Item when Janitorial,Office,Other Supplies,Small Tools and Supplies Expense-Drinking is selected in Item Group and Set G/L Accounts By is not Item Group.
			IF (SELECT GLMethod FROM OITM WHERE ItemCode = @list_of_cols_val_tab_del AND ItmsGrpCod IN (125,123,127,126,129)) <> 'C'
				BEGIN
					SET @error=3
					SET @error_message ='Set G/L Account under Inventory Data to Item Group.' 
				END
			
END

	
--Validation for Deposit


--To Block Cancellation
	IF @object_type = '25' AND (@transaction_type='C')
	BEGIN 

DECLARE @USERPOSITION_DPT VARCHAR(2)

SELECT @USERPOSITION_DPT = U_UserPosition FROM [@REASONCODE] WHERE U_MktgDoc = 'DPT'

DECLARE @RESULT_DPT VARCHAR(2)
SELECT @RESULT_DPT = (CASE WHEN U_USERIDINFO = 'Y' THEN 'Y' ELSE CAST(@USERPOSITION_DPT AS VARCHAR(2)) END) FROM ODPS WHERE DeposNum = @list_of_cols_val_tab_del

    IF EXISTS (SELECT T0.CnclDps FROM ODPS T0 WHERE T0.DeposId NOT IN (SELECT A0.CnclDps FROM ODPS A0 ) AND T0.DeposNum = @list_of_cols_val_tab_del AND T0.U_USERIDINFO NOT IN (@RESULT_DPT))
			BEGIN
				SET @error=1
				SET @error_message = 'Only allowed User(s) can cancel this document.'
			END


    IF EXISTS (SELECT T0.CnclDps FROM ODPS T0 WHERE T0.DeposId NOT IN (SELECT A0.CnclDps FROM ODPS A0 ) AND T0.DeposNum = @list_of_cols_val_tab_del AND T0.U_ReasonCancelCode IS NULL)
			BEGIN
				SET @error=2
				SET @error_message = 'Reason code for Cancellation is required (Deposit).'
			END

	END




	IF @object_type = '25' AND (@transaction_type='A' OR @transaction_type='U')
	BEGIN 

			--To check if there is Distribution Rule assigned
			IF EXISTS (SELECT DeposId FROM ODPS WHERE DeposId=@list_of_cols_val_tab_del AND (OcrCode IS NULL  OR OcrCode='') AND DeposType='V')
			BEGIN
				SET @error=1
				SET @error_message ='Distribution Rules for Store Performance is required.' 
			END
			
	END

-- Validation for Manual Journal Entry
IF @object_type = '30' AND (@transaction_type='A' OR @transaction_type='U')
BEGIN 
		--To require Transaction Code 
		IF EXISTS (SELECT TransId FROM OJDT WHERE TransType=30 AND TransId = @list_of_cols_val_tab_del AND TransCode='')
		BEGIN
			SET @error=1
			SET @error_message ='Transaction Code is required.' 
		END

		--Validation for Senior Citizen
		IF EXISTS (SELECT TransId FROM OJDT WHERE TransType=30 AND TransId = @list_of_cols_val_tab_del AND TransCode='SCN' 
					AND TransId NOT IN (SELECT StornoToTr from OJDT WHERE StornoToTr IS NOT NULL)
					AND TransId NOT IN (SELECT TransId from OJDT WHERE StornoToTr IS NOT NULL))
		BEGIN
				--To check the correct GL Account used for Senior Citizen - Debit Side
			IF EXISTS (SELECT TransId FROM JDT1
						WHERE TransType=30 AND TransId = @list_of_cols_val_tab_del AND TransCode='SCN' AND Debit > 0 AND Account !='RV010-0300-0000')
			BEGIN
				SET @error=1
				SET @error_message ='Select Sales Discount as GL Account.' 
			END
			ELSE
			BEGIN
					--To require Store Performance
					IF EXISTS (SELECT TransId FROM JDT1
					WHERE TransType=30 AND TransId = @list_of_cols_val_tab_del AND Account='RV010-0300-0000' AND (ProfitCode IS NULL OR ProfitCode = ''))
					BEGIN
						SET @error=1
						SET @error_message ='Store Performance is required for Sales Discount.' 
					END

			END

			--To check the correct GL Account used for Senior Citizen - Credit Side
			IF EXISTS (SELECT TransId FROM JDT1
						WHERE TransType=30 AND TransId = @list_of_cols_val_tab_del AND TransCode='SCN' AND Credit > 0 AND Account NOT LIKE 'CL020-2600%')
			BEGIN
				SET @error=1
				SET @error_message ='Select the related Output Tax as GL Account.' 
			END
			ELSE
			BEGIN
					--To not require Store Performance
					IF EXISTS (SELECT TransId FROM JDT1
						WHERE TransType=30 AND TransId = @list_of_cols_val_tab_del  AND Account LIKE 'CL020-2600%' AND (ProfitCode IS NOT NULL AND ProfitCode != ''))
					BEGIN
						SET @error=1
						SET @error_message ='Store Performance is not required for Output Tax.' 
					END

			END

		END

		--Validation for Debit/Credit Card
		IF EXISTS(SELECT TransId FROM OJDT WHERE TransType=30 AND TransId = @list_of_cols_val_tab_del AND TransCode='CDR' 
					AND TransId NOT IN (SELECT StornoToTr from OJDT WHERE StornoToTr IS NOT NULL)
					AND TransId NOT IN (SELECT TransId from OJDT WHERE StornoToTr IS NOT NULL))
		BEGIN
				--To check the correct GL Account used for Debit/Credit Card -  Refund - Debit Side
			IF EXISTS (SELECT TransId FROM JDT1
						WHERE TransType=30 AND TransId = @list_of_cols_val_tab_del AND TransCode='CDR' AND Debit > 0 AND ShortName NOT IN (SELECT CardCode FROM OCRD WHERE frozenFor='N'))
			BEGIN
				SET @error=1
				SET @error_message ='Select BP Code for Accounts Receivable.' 
			END
			ELSE
			BEGIN
					--To not require Store Performance
					IF EXISTS (SELECT TransId FROM JDT1
					WHERE TransType=30 AND TransId = @list_of_cols_val_tab_del AND ShortName IN (SELECT CardCode FROM OCRD WHERE frozenFor='N') AND (ProfitCode IS NOT NULL AND ProfitCode != ''))
					BEGIN
						SET @error=1
						SET @error_message ='Store Performance is not required for Accounts Receivable.' 
					END

			END

			--To check the correct GL Account used for Debit/Credit Card -  Refund - Credit Side
			IF EXISTS (SELECT TransId FROM JDT1 
						WHERE TransType=30 AND TransId = @list_of_cols_val_tab_del AND TransCode='CDR' AND Credit > 0 AND (Account != 'OP190-0700-0200' AND Account !='OI010-0700-0000'))
			BEGIN
				SET @error=1
				SET @error_message ='Select Merchant Account Fees or Miscellaneous Income as GL Account.' 
			END
			ELSE
			BEGIN
					--To require Store Performance
					IF EXISTS (SELECT TransId FROM JDT1
						WHERE TransType=30 AND TransId = @list_of_cols_val_tab_del AND (Account = 'OP190-0700-0200' OR Account ='OI010-0700-0000') AND (ProfitCode IS NULL OR ProfitCode = ''))
					BEGIN
						SET @error=1
						SET @error_message ='Store Performance is required for Merchant Account Fees and Miscellaneous Income.' 
					END

			END

		END

		--Validation for Fixed Asset - Interbranch Transfer
		IF EXISTS(SELECT TransId FROM OJDT WHERE TransType=30 AND TransId = @list_of_cols_val_tab_del AND TransCode='FIT'
					AND TransId NOT IN (SELECT StornoToTr from OJDT WHERE StornoToTr IS NOT NULL)
					AND TransId NOT IN (SELECT TransId from OJDT WHERE StornoToTr IS NOT NULL))
		BEGIN
				--To check the correct GL Account used for Fixed Asset - Interbranch Transfer - Debit Side
			IF EXISTS (SELECT TransId FROM JDT1 
						WHERE TransType=30 AND TransId = @list_of_cols_val_tab_del AND TransCode='FIT' AND Debit > 0 AND (Account != 'OI010-1200-0000' AND Account NOT LIKE 'NA010%' AND Account NOT LIKE 'NA020%'))
			BEGIN
				SET @error=1
				SET @error_message ='Select Gain or Loss from Asset Disposal or related Fixed Asset as GL Account.' 
			END
			ELSE
			BEGIN
					--To require Store Performance
					IF EXISTS (SELECT TransId FROM JDT1
						WHERE TransType=30 AND TransId = @list_of_cols_val_tab_del AND Account = 'OI010-1200-0000' AND (ProfitCode IS NULL OR ProfitCode = ''))
					BEGIN
						SET @error=1
						SET @error_message ='Store Performance is required for Gain or Loss from Asset Disposal.' 
					END
					--To not require Store Performance
					IF EXISTS (SELECT TransId FROM JDT1
						WHERE TransType=30 AND TransId = @list_of_cols_val_tab_del AND (Account LIKE 'NA010%' OR Account LIKE 'NA020%') AND (ProfitCode IS NOT NULL AND ProfitCode != ''))
					BEGIN
						SET @error=1
						SET @error_message ='Store Performance is not required for Fixed Asset related account .' 
					END

			END

			--To check the correct GL Account used for Fixed Asset - Interbranch Transfer - Credit Side
			IF EXISTS (SELECT TransId FROM JDT1 
						WHERE TransType=30 AND TransId = @list_of_cols_val_tab_del AND TransCode='FIT' AND Credit > 0 AND (Account != 'OI010-1200-0000' AND Account NOT LIKE 'NA060-0300%'))
			BEGIN
				SET @error=1
				SET @error_message ='Select Gain or Loss from Asset Disposal or related Fixed Asset Clearing Account as GL Account.' 
			END
			ELSE
			BEGIN
					--To require Store Performance
					IF EXISTS (SELECT TransId FROM JDT1
						WHERE TransType=30 AND TransId = @list_of_cols_val_tab_del AND Account = 'OI010-1200-0000' AND (ProfitCode IS NULL OR ProfitCode = ''))
					BEGIN
						SET @error=1
						SET @error_message ='Store Performance is required for Gain or Loss from Asset Disposal.' 
					END
					--To not require Store Performance
					IF EXISTS (SELECT TransId FROM JDT1
						WHERE TransType=30 AND TransId = @list_of_cols_val_tab_del AND Account  LIKE 'NA060-0300%'  AND (ProfitCode IS NOT NULL AND ProfitCode != ''))
					BEGIN
						SET @error=1
						SET @error_message ='Store Performance is not required for Fixed Asset Clearing Account .' 
					END

			END

		END

		--Validation for Account Adjustment
		IF EXISTS(SELECT TransId FROM OJDT WHERE TransType=30 AND TransId = @list_of_cols_val_tab_del AND TransCode='AAT'
					AND TransId NOT IN (SELECT StornoToTr from OJDT WHERE StornoToTr IS NOT NULL)
					AND TransId NOT IN (SELECT TransId from OJDT WHERE StornoToTr IS NOT NULL))
		BEGIN
			--To check the correct GL Account used for Account Adjustment
			IF EXISTS (SELECT TransId FROM JDT1
						WHERE TransType=30 AND TransId = @list_of_cols_val_tab_del AND TransCode='AAT' AND (ShortName NOT IN (SELECT CardCode FROM OCRD WHERE frozenFor='N') 
						AND (Account NOT LIKE 'OP%' AND Account NOT LIKE 'OE%' AND Account NOT LIKE 'CS%' AND Account NOT LIKE 'RV%' AND Account NOT LIKE 'OI%')))
			BEGIN
				SET @error=1
				SET @error_message ='Invalid GL Account.' 
			END
			ELSE
			BEGIN

					--To check if the BP Code exist for receivable/payable
					IF (SELECT COUNT(TransId) FROM JDT1
								WHERE TransType=30 AND TransId = @list_of_cols_val_tab_del AND TransCode='AAT' AND (ShortName IN (SELECT CardCode FROM OCRD WHERE frozenFor='N'))) = 0
					BEGIN
						SET @error=1
						SET @error_message ='Select BP Code for receivable/payable.' 
					END

					--To check if the related GL Account exist for income/expenses
					IF (SELECT COUNT(TransId) FROM JDT1
								WHERE TransType=30 AND TransId = @list_of_cols_val_tab_del AND TransCode='AAT' AND  
								(Account LIKE 'OP%' OR Account LIKE 'OE%' OR Account LIKE 'CS%' OR Account LIKE 'RV%' OR Account LIKE 'OI%')) = 0
					BEGIN
						SET @error=1
						SET @error_message ='Select related income/expenses as GL Account.' 
					END

					--To require Store Performance
					IF EXISTS (SELECT TransId FROM JDT1
					WHERE TransType=30 AND TransId = @list_of_cols_val_tab_del AND (Account LIKE 'OP%' OR Account LIKE 'OE%' OR Account LIKE 'CS%' OR Account LIKE 'RV%' OR Account LIKE 'OI%') 
					AND (ProfitCode IS NULL OR ProfitCode = ''))
					BEGIN
						SET @error=1
						SET @error_message ='Store Performance is required for income or expenses.' 
					END

					--To not require Store Performance
					IF EXISTS (SELECT TransId FROM JDT1
					WHERE TransType=30 AND TransId = @list_of_cols_val_tab_del AND ShortName IN (SELECT CardCode FROM OCRD WHERE frozenFor='N') AND (ProfitCode IS NOT NULL AND ProfitCode != ''))
					BEGIN
						SET @error=1
						SET @error_message ='Store Performance is not required for Accounts Receivable or Payables.' 
					END

			END
		END

		--Validation for Account Correction
		IF EXISTS(SELECT TransId FROM OJDT WHERE TransType=30 AND TransId = @list_of_cols_val_tab_del AND TransCode='ACR'
					AND TransId NOT IN (SELECT StornoToTr from OJDT WHERE StornoToTr IS NOT NULL)
					AND TransId NOT IN (SELECT TransId from OJDT WHERE StornoToTr IS NOT NULL))
		BEGIN

			--To check the correct GL Account used for Account Correction
			IF EXISTS (SELECT TransId FROM JDT1
						WHERE TransType=30 AND TransId = @list_of_cols_val_tab_del AND TransCode='ACR'
						AND (Account NOT LIKE 'OP%' AND Account NOT LIKE 'OE%' AND Account NOT LIKE 'CS%' AND Account NOT LIKE 'RV%' AND Account NOT LIKE 'OI%'))
			BEGIN
				SET @error=1
				SET @error_message ='Select related income/expenses as GL Account.' 
			END
			ELSE
			BEGIN
					--To require Store Performance
					IF EXISTS (SELECT TransId FROM JDT1
					WHERE TransType=30 AND TransId = @list_of_cols_val_tab_del AND (Account LIKE 'OP%' OR Account LIKE 'OE%' OR Account LIKE 'CS%' OR Account LIKE 'RV%' OR Account LIKE 'OI%')
					AND (ProfitCode IS NULL OR ProfitCode = ''))
					BEGIN
						SET @error=1
						SET @error_message ='Store Performance is required for income or expenses.' 
					END
			END

		END

		--Validation for Outstanding Checks
		IF EXISTS(SELECT TransId FROM OJDT WHERE TransType=30 AND TransId = @list_of_cols_val_tab_del AND TransCode='OCS'
					AND TransId NOT IN (SELECT StornoToTr from OJDT WHERE StornoToTr IS NOT NULL)
					AND TransId NOT IN (SELECT TransId from OJDT WHERE StornoToTr IS NOT NULL))
		BEGIN
			--To check the correct GL Account used for Outstanding Checks
			IF EXISTS (SELECT TransId FROM JDT1
						WHERE TransType=30 AND TransId = @list_of_cols_val_tab_del AND TransCode='OCS' AND (ShortName NOT IN (SELECT CardCode FROM OCRD WHERE frozenFor='N') 
						AND (Account NOT LIKE 'CA010-0600%' AND Account NOT LIKE 'CA010-0200%' )))
			BEGIN
				SET @error=1
				SET @error_message ='Invalid GL Account.' 
			END
			ELSE
			BEGIN
					
					--To check if the BP Code exist for receivable/payable
					IF (SELECT COUNT(TransId) FROM JDT1
								WHERE TransType=30 AND TransId = @list_of_cols_val_tab_del AND TransCode='OCS' AND (ShortName IN (SELECT CardCode FROM OCRD WHERE frozenFor='N'))) = 0
					BEGIN
						SET @error=1
						SET @error_message ='Select BP Code for receivable/payable.' 
					END

					--To check if the related GL Account exist for income/expenses
					IF (SELECT COUNT(TransId) FROM JDT1
								WHERE TransType=30 AND TransId = @list_of_cols_val_tab_del AND TransCode='OCS' AND  
								 (Account LIKE 'CA010-0600%' OR Account LIKE 'CA010-0200%' )) = 0
					BEGIN
						SET @error=1
						SET @error_message ='Select related Check Clearing/Cash as GL Account.' 
					END

					--To not require Store Performance
					IF EXISTS (SELECT TransId FROM JDT1
					WHERE TransType=30 AND TransId = @list_of_cols_val_tab_del AND (ShortName IN (SELECT CardCode FROM OCRD WHERE frozenFor='N') OR (Account LIKE 'CA010-0600%' OR Account LIKE 'CA010-0200%' )) AND (ProfitCode IS NOT NULL AND ProfitCode != ''))
					BEGIN
						SET @error=1
						SET @error_message ='Store Performance is not required.' 
					END

			END
		END

		--Validation for Bank Interest
		IF EXISTS(SELECT TransId FROM OJDT WHERE TransType=30 AND TransId = @list_of_cols_val_tab_del AND TransCode='BIT'
					AND TransId NOT IN (SELECT StornoToTr from OJDT WHERE StornoToTr IS NOT NULL)
					AND TransId NOT IN (SELECT TransId from OJDT WHERE StornoToTr IS NOT NULL))
		BEGIN
			--To check the correct GL Account used for Bank Interest - Debit Side
			IF EXISTS (SELECT TransId FROM JDT1
						WHERE TransType=30 AND TransId = @list_of_cols_val_tab_del AND TransCode='BIT' AND Debit > 0 AND Account NOT LIKE 'CA010-0200%')
			BEGIN
				SET @error=1
				SET @error_message ='Select related Cash in Bank as GL Account.' 
			END
			ELSE
			BEGIN
					--To not require Store Performance
					IF EXISTS (SELECT TransId FROM JDT1
						WHERE TransType=30 AND TransId = @list_of_cols_val_tab_del  AND Account LIKE 'CA010-0200%' AND (ProfitCode IS NOT NULL AND ProfitCode != ''))
					BEGIN
						SET @error=1
						SET @error_message ='Store Performance is not required for Cash in Bank.' 
					END
			END

			--To check the correct GL Account used for Bank Interest - Credit Side
			IF EXISTS (SELECT TransId FROM JDT1
						WHERE TransType=30 AND TransId = @list_of_cols_val_tab_del AND TransCode='BIT' AND Credit > 0 AND Account != 'OI010-0200-0100')
			BEGIN
				SET @error=1
				SET @error_message ='Select related account for Interest Income-Bank.' 
			END
			ELSE
			BEGIN
					--To not require Store Performance
					IF EXISTS (SELECT TransId FROM JDT1
						WHERE TransType=30 AND TransId = @list_of_cols_val_tab_del  AND Account = 'OI010-0200-0100' AND (ProfitCode IS NULL OR ProfitCode = ''))
					BEGIN
						SET @error=1
						SET @error_message ='Store Performance is required for Interest Income-Bank.' 
					END
			END

		END
		
		--Validation for Prepaid Expense Amortization
		IF EXISTS(SELECT TransId FROM OJDT WHERE TransType=30 AND TransId = @list_of_cols_val_tab_del AND TransCode='PEA'
					AND TransId NOT IN (SELECT StornoToTr from OJDT WHERE StornoToTr IS NOT NULL)
					AND TransId NOT IN (SELECT TransId from OJDT WHERE StornoToTr IS NOT NULL))
		BEGIN
			--To check the correct GL Account used for Prepaid Expense Amortization - Debit Side
			IF EXISTS (SELECT TransId FROM JDT1
						WHERE TransType=30 AND TransId = @list_of_cols_val_tab_del AND TransCode='PEA' AND Debit > 0 AND Account NOT LIKE 'OP%')
			BEGIN
				SET @error=1
				SET @error_message ='Select related operating expenses as GL Account.' 
			END
			ELSE
			BEGIN
					--To require Store Performance
					IF EXISTS (SELECT TransId FROM JDT1
						WHERE TransType=30 AND TransId = @list_of_cols_val_tab_del  AND Account LIKE 'OP%' AND (ProfitCode IS NULL OR ProfitCode = ''))
					BEGIN
						SET @error=1
						SET @error_message ='Store Performance is required for operating expenses.' 
					END
			END

			--To check the correct GL Account used for Prepaid Expense Amortization - Credit Side
			IF EXISTS (SELECT TransId FROM JDT1
						WHERE TransType=30 AND TransId = @list_of_cols_val_tab_del AND TransCode='PEA' AND Credit > 0 AND Account NOT LIKE 'CA050%')
			BEGIN
				SET @error=1
				SET @error_message ='Use related Prepaid Expenses as GL Account.' 
			END
			ELSE
			BEGIN
					--To not require Store Performance
					IF EXISTS (SELECT TransId FROM JDT1
						WHERE TransType=30 AND TransId = @list_of_cols_val_tab_del  AND Account LIKE 'CA050%' AND (ProfitCode IS NOT NULL AND ProfitCode != ''))
					BEGIN
						SET @error=1
						SET @error_message ='Store Performance is not required for Prepaid Expenses.' 
					END
			END

		END

		--Validation for Aging
		IF EXISTS(SELECT TransId FROM OJDT WHERE TransType=30 AND TransId = @list_of_cols_val_tab_del AND TransCode='PBD'
					AND TransId NOT IN (SELECT StornoToTr from OJDT WHERE StornoToTr IS NOT NULL)
					AND TransId NOT IN (SELECT TransId from OJDT WHERE StornoToTr IS NOT NULL))
		BEGIN
			--To check the correct GL Account used for Aging - Debit Side
			IF EXISTS (SELECT TransId FROM JDT1
						WHERE TransType=30 AND TransId = @list_of_cols_val_tab_del AND TransCode='PBD' AND Debit > 0 AND Account != 'OP150-0000-0000')
			BEGIN
				SET @error=1
				SET @error_message ='Use Doubtful Account Expense.' 
			END
			ELSE
			BEGIN
					--To require Store Performance
					IF EXISTS (SELECT TransId FROM JDT1
						WHERE TransType=30 AND TransId = @list_of_cols_val_tab_del  AND Account = 'OP150-0000-0000' AND (ProfitCode IS NULL OR ProfitCode = ''))
					BEGIN
						SET @error=1
						SET @error_message ='Store Performance is required for Doubtful Account Expense.' 
					END
			END

			--To check the correct GL Account used for Aging - Credit Side
			IF EXISTS (SELECT TransId FROM JDT1
						WHERE TransType=30 AND TransId = @list_of_cols_val_tab_del AND TransCode='PBD' AND Credit > 0 AND Account NOT LIKE 'CA030-0200%')
			BEGIN
				SET @error=1
				SET @error_message ='Use related account for Allowance for Doubtful Accounts.' 
			END
			ELSE
			BEGIN
					--To not require Store Performance
					IF EXISTS (SELECT TransId FROM JDT1
						WHERE TransType=30 AND TransId = @list_of_cols_val_tab_del  AND Account LIKE 'CA030-0200%' AND (ProfitCode IS NOT NULL AND ProfitCode != ''))
					BEGIN
						SET @error=1
						SET @error_message ='Store Performance is not required for Allowance for Doubtful Accounts.' 
					END
			END

		END
		
		--Validation for Interest for Unpaid Goods
		IF EXISTS (SELECT TransId FROM OJDT WHERE TransType=30 AND TransId = @list_of_cols_val_tab_del AND TransCode='IUG'
					AND TransId NOT IN (SELECT StornoToTr from OJDT WHERE StornoToTr IS NOT NULL)
					AND TransId NOT IN (SELECT TransId from OJDT WHERE StornoToTr IS NOT NULL))
		BEGIN
				--To check the correct GL Account used for Interest for Unpaid Goods - Debit Side
			IF EXISTS (SELECT TransId FROM JDT1
						WHERE TransType=30 AND TransId = @list_of_cols_val_tab_del AND TransCode='IUG' AND Debit > 0 AND Account NOT LIKE 'OE010-0100%')
			BEGIN
				SET @error=1
				SET @error_message ='Select related Interest Expense as GL Account.' 
			END
			ELSE
			BEGIN
					--To require Store Performance
					IF EXISTS (SELECT TransId FROM JDT1
					WHERE TransType=30 AND TransId = @list_of_cols_val_tab_del AND Account LIKE 'OE010-0100%' AND (ProfitCode IS NULL OR ProfitCode = ''))
					BEGIN
						SET @error=1
						SET @error_message ='Store Performance is required for Interest Expense.' 
					END

			END

			--To check the correct GL Account used for Interest for Unpaid Goods - Credit Side
			IF EXISTS (SELECT TransId FROM JDT1 
						WHERE TransType=30 AND TransId = @list_of_cols_val_tab_del AND TransCode='IUG' AND Credit > 0 AND ShortName NOT IN (SELECT CardCode FROM OCRD WHERE frozenFor='N' AND CardType='S'))
			BEGIN
				SET @error=1
				SET @error_message ='Select related BP Code for Accounts Payable.' 
			END
			ELSE
			BEGIN
					--To not require Store Performance
					IF EXISTS (SELECT TransId FROM JDT1
						WHERE TransType=30 AND TransId = @list_of_cols_val_tab_del  AND ShortName IN (SELECT CardCode FROM OCRD WHERE frozenFor='N' AND CardType='S') AND (ProfitCode IS NOT NULL AND ProfitCode != ''))
					BEGIN
						SET @error=1
						SET @error_message ='Store Performance is not required for Accounts Payable.' 
					END

			END

		END

		--Validation for Cost of Sales Adjustment
		IF EXISTS(SELECT TransId FROM OJDT WHERE TransType=30 AND TransId = @list_of_cols_val_tab_del AND TransCode='CSA'
					AND TransId NOT IN (SELECT StornoToTr from OJDT WHERE StornoToTr IS NOT NULL)
					AND TransId NOT IN (SELECT TransId from OJDT WHERE StornoToTr IS NOT NULL))
		BEGIN
			--To check the correct GL Account used for Sales Adjustment
			IF EXISTS (SELECT TransId FROM JDT1
						WHERE TransType=30 AND TransId = @list_of_cols_val_tab_del AND TransCode='CSA'
						AND Account NOT LIKE 'CS010%' AND Account NOT LIKE 'CA040%')
			BEGIN
				SET @error=1
				SET @error_message ='Select related Cost of Sales or Inventories as GL Account.' 
			END
			ELSE
			BEGIN

					--To require Store Performance
					IF EXISTS (SELECT TransId FROM JDT1
					WHERE TransType=30 AND TransId = @list_of_cols_val_tab_del AND (Account LIKE 'CS010%') AND (ProfitCode IS NULL OR ProfitCode = ''))
					BEGIN
						SET @error=1
						SET @error_message ='Store Performance is required for Cost of Sales.' 
					END

					--To not require Store Performance
					IF EXISTS (SELECT TransId FROM JDT1
					WHERE TransType=30 AND TransId = @list_of_cols_val_tab_del AND (Account LIKE 'CA040%') AND (ProfitCode IS NOT NULL AND ProfitCode != ''))
					BEGIN
						SET @error=1
						SET @error_message ='Store Performance is not required for Inventories.' 
					END

			END
		END

		--Validation for Cancelled Invoices
		IF EXISTS (SELECT TransId FROM OJDT WHERE TransType=30 AND TransId = @list_of_cols_val_tab_del AND TransCode='CIS'
					AND TransId NOT IN (SELECT StornoToTr from OJDT WHERE StornoToTr IS NOT NULL)
					AND TransId NOT IN (SELECT TransId from OJDT WHERE StornoToTr IS NOT NULL))
		BEGIN
			--To check the correct GL Account used for Cancelled Invoices - Debit Side
			IF EXISTS (SELECT TransId FROM JDT1
						WHERE TransType=30 AND TransId = @list_of_cols_val_tab_del AND TransCode='CIS' AND Debit > 0 AND Account NOT LIKE 'CA060-0200%')
			BEGIN
				SET @error=1
				SET @error_message ='Select related DFE-Fines/Penalty as GL Account.' 
			END
			ELSE
			BEGIN
					--To not require Store Performance
					IF EXISTS (SELECT TransId FROM JDT1
						WHERE TransType=30 AND TransId = @list_of_cols_val_tab_del  AND Account LIKE 'CA060-0200%' AND (ProfitCode IS NOT NULL AND ProfitCode != ''))
					BEGIN
						SET @error=1
						SET @error_message ='Store Performance is not required for DFE-Fines/Penalty.' 
					END

			END

			--To check the correct GL Account used for Cancelled Invoices - Credit Side
			IF EXISTS (SELECT TransId FROM JDT1 
						WHERE TransType=30 AND TransId = @list_of_cols_val_tab_del AND TransCode='CIS' AND Credit > 0 AND Account != 'OI010-0700-0000')
			BEGIN
				SET @error=1
				SET @error_message ='Select Miscellaneous Income as GL Account.' 
			END
			ELSE
			BEGIN
					--To require Store Performance
					IF EXISTS (SELECT TransId FROM JDT1
					WHERE TransType=30 AND TransId = @list_of_cols_val_tab_del AND  Account='OI010-0700-0000' AND (ProfitCode IS NULL OR ProfitCode = ''))
					BEGIN
						SET @error=1
						SET @error_message ='Store Performance is required for Miscellaneous Income.' 
					END

			END

		END

		--Validation for 13th Month Accrual
		IF EXISTS (SELECT TransId FROM OJDT WHERE TransType=30 AND TransId = @list_of_cols_val_tab_del AND TransCode='13M'
					AND TransId NOT IN (SELECT StornoToTr from OJDT WHERE StornoToTr IS NOT NULL)
					AND TransId NOT IN (SELECT TransId from OJDT WHERE StornoToTr IS NOT NULL))
		BEGIN
				--To check the correct GL Account used for Interest for 13th Month Accrual - Debit Side
			IF EXISTS (SELECT TransId FROM JDT1
						WHERE TransType=30 AND TransId = @list_of_cols_val_tab_del AND TransCode='13M' AND Debit > 0 AND Account != 'OP010-0200-0100')
			BEGIN
				SET @error=1
				SET @error_message ='Select Other Compensation-13th Month Pay as GL Account.' 
			END
			ELSE
			BEGIN
					--To require Store Performance
					IF EXISTS (SELECT TransId FROM JDT1
					WHERE TransType=30 AND TransId = @list_of_cols_val_tab_del AND Account = 'OP010-0200-0100' AND (ProfitCode IS NULL OR ProfitCode = ''))
					BEGIN
						SET @error=1
						SET @error_message ='Store Performance is required for Other Compensation-13th Month Pay.' 
					END

			END

			--To check the correct GL Account used for Interest for 13th Month Accrual - Credit Side
			IF EXISTS (SELECT TransId FROM JDT1 
						WHERE TransType=30 AND TransId = @list_of_cols_val_tab_del AND TransCode='13M' AND Credit > 0 AND Account NOT LIKE 'CL020-1200%')
			BEGIN
				SET @error=1
				SET @error_message ='Select related Due To Employee-13th Month as GL Account.' 
			END
			ELSE
			BEGIN
					--To not require Store Performance
					IF EXISTS (SELECT TransId FROM JDT1
						WHERE TransType=30 AND TransId = @list_of_cols_val_tab_del  AND Account LIKE 'CL020-1200%' AND (ProfitCode IS NOT NULL AND ProfitCode != ''))
					BEGIN
						SET @error=1
						SET @error_message ='Store Performance is not required for Due To Employee-13th Month.' 
					END

			END

		END

		--Validation for VAT Payable
		IF EXISTS (SELECT TransId FROM OJDT WHERE TransType=30 AND TransId = @list_of_cols_val_tab_del AND TransCode='VAT'
					AND TransId NOT IN (SELECT StornoToTr from OJDT WHERE StornoToTr IS NOT NULL)
					AND TransId NOT IN (SELECT TransId from OJDT WHERE StornoToTr IS NOT NULL))
		BEGIN
			--To check the correct GL Account used for VAT Payable - Debit Side
			IF EXISTS (SELECT TransId FROM JDT1
						WHERE TransType=30 AND TransId = @list_of_cols_val_tab_del AND TransCode='VAT' AND Debit > 0 AND (Account NOT LIKE 'CL020-2600%' AND Account NOT LIKE 'CL020-2100%' AND Account NOT LIKE 'OI010-0700%' AND Account NOT LIKE 'CA030-0400%'))
			BEGIN
				SET @error=1
				SET @error_message ='Select related Output Tax or Net VAT Payable as GL Account.' 
			END
			ELSE
			BEGIN
					--To not require Store Performance
					IF EXISTS (SELECT TransId FROM JDT1
						WHERE TransType=30 AND TransId = @list_of_cols_val_tab_del  AND (Account LIKE 'CL020-2600%' OR Account LIKE 'CL020-2100%') AND (ProfitCode IS NOT NULL AND ProfitCode != ''))
					BEGIN
						SET @error=1
						SET @error_message ='Store Performance is not required for Output Tax or Net VAT Payable.' 
					END
					
			END

			--To check the correct GL Account used for VAT Payable - Credit Side
			IF EXISTS (SELECT TransId FROM JDT1 
						WHERE TransType=30 AND TransId = @list_of_cols_val_tab_del AND TransCode='VAT' AND Credit > 0 AND (Account NOT LIKE 'CA060-1100%' AND Account NOT LIKE 'CA060-1200%' AND  Account NOT LIKE 'CA060-1400%' 
             AND Account NOT LIKE 'CL020-2100%' AND Account NOT LIKE 'OI010-0700%' AND Account NOT LIKE 'CA030-0400%' AND Account NOT LIKE 'CL020-0200%')) --
			BEGIN
				SET @error=1
				SET @error_message ='Select related Input Tax or Net VAT Payable as GL Account.' 
			END
			ELSE
			BEGIN
					--To require Store Performance
					IF EXISTS (SELECT TransId FROM JDT1
					WHERE TransType=30 AND TransId = @list_of_cols_val_tab_del AND (Account LIKE 'CA060-1100%' OR Account LIKE 'CA060-1200%' OR Account  LIKE 'CA060-1400%'  OR Account LIKE 'CL020-2100%'  ) AND (ProfitCode IS NOT NULL AND ProfitCode != ''))
					BEGIN
						SET @error=1
						SET @error_message ='Store Performance is not required for Input Tax or Net VAT Payable.' 
					END

			END

		END

		
		--Validation for Depreciation Adjustment
		IF EXISTS(SELECT TransId FROM OJDT WHERE TransType=30 AND TransId = @list_of_cols_val_tab_del AND TransCode='DPA'
					AND TransId NOT IN (SELECT StornoToTr from OJDT WHERE StornoToTr IS NOT NULL)
					AND TransId NOT IN (SELECT TransId from OJDT WHERE StornoToTr IS NOT NULL))
		BEGIN
			--To check the correct GL Account used for Depreciation Adjustment
			IF EXISTS (SELECT TransId FROM JDT1
						WHERE TransType=30 AND TransId = @list_of_cols_val_tab_del AND TransCode='DPA' AND (Account NOT LIKE 'NA010%' AND Account NOT LIKE 'NA020%' AND Account NOT LIKE 'OP160%'))
			BEGIN
				SET @error=1
				SET @error_message ='Use related account for Accumulated Depreciation or Depreciation Expense.' 
			END
			ELSE
			BEGIN

					--To require Store Performance
					IF EXISTS (SELECT TransId FROM JDT1
					WHERE TransType=30 AND TransId = @list_of_cols_val_tab_del AND Account LIKE 'OP160%' AND (ProfitCode IS NULL OR ProfitCode = ''))
					BEGIN
						SET @error=1
						SET @error_message ='Store Performance is required for Depreciation Expense.' 
					END

					--To not require Store Performance
					IF EXISTS (SELECT TransId FROM JDT1
					WHERE TransType=30 AND TransId = @list_of_cols_val_tab_del AND (Account LIKE 'NA010%' OR Account LIKE 'NA020%') AND (ProfitCode IS NOT NULL AND ProfitCode != ''))
					BEGIN
						SET @error=1
						SET @error_message ='Store Performance is not required for Accumulated Depreciation.' 
					END

			END
		END

		--Validation for Other Adjustment
		IF EXISTS(SELECT TransId FROM OJDT WHERE TransType=30 AND TransId = @list_of_cols_val_tab_del AND TransCode='OAS'
					AND TransId NOT IN (SELECT StornoToTr from OJDT WHERE StornoToTr IS NOT NULL)
					AND TransId NOT IN (SELECT TransId from OJDT WHERE StornoToTr IS NOT NULL))
		BEGIN
			
			--To require Store Performance
			IF EXISTS (SELECT TransId FROM JDT1
			WHERE TransType=30 AND TransId = @list_of_cols_val_tab_del AND (Account LIKE 'RV010%' OR Account LIKE 'CS010%' OR Account LIKE 'OP%' OR Account LIKE 'OI010%' OR Account LIKE 'TE010%') AND (ProfitCode IS NULL OR ProfitCode = ''))
			BEGIN
				SET @error=1
				SET @error_message ='Store Performance is required for income and expenses account.' 
			END

			--To not require Store Performance
			IF EXISTS (SELECT TransId FROM JDT1
			WHERE TransType=30 AND TransId = @list_of_cols_val_tab_del AND (Account NOT LIKE 'RV010%' AND Account NOT LIKE 'CS010%' AND Account NOT LIKE 'OP%' AND Account NOT LIKE 'OI010%' AND Account NOT LIKE 'OE010%' AND Account NOT LIKE 'TE010%') AND (ProfitCode IS NOT NULL AND ProfitCode != ''))
			BEGIN
				SET @error=1
				SET @error_message ='Store Performance is not required for non-income/expenses account.' 
			END

		END
		
		--Validation for Opening Balance - BP
		--IF EXISTS (SELECT TransId FROM OJDT WHERE TransType=30 AND TransId = @list_of_cols_val_tab_del AND TransCode='OBB'
		--			AND TransId NOT IN (SELECT StornoToTr from OJDT WHERE StornoToTr IS NOT NULL)
		--			AND TransId NOT IN (SELECT TransId from OJDT WHERE StornoToTr IS NOT NULL))
		--BEGIN
		--		--To check the correct GL Account used for Opening Balance - BP - Debit Side
		--	IF EXISTS (SELECT TransId FROM JDT1
		--				WHERE TransType=30 AND TransId = @list_of_cols_val_tab_del AND TransCode='OBB' AND Debit > 0 AND ShortName NOT IN (SELECT CardCode FROM OCRD WHERE frozenFor='N' AND CardType='C') AND 
		--				(Account NOT LIKE 'EQ010-0500%' AND Account NOT LIKE 'EQ010-0600%' AND Account !=  'CA060-1000-0000' AND Account != 'CA060-1400-0000' AND Account NOT LIKE 'CA060-1100%'))
		--	BEGIN
		--		SET @error=1
		--		SET @error_message ='Invalid GL Account.' 
		--	END
		--	ELSE
		--	BEGIN
				
		--		--To check if the related GL Account exist for income/expenses
		--		IF (SELECT COUNT(TransId) FROM JDT1
		--					WHERE TransType=30 AND TransId = @list_of_cols_val_tab_del AND TransCode='OBB' AND  
		--					(Account LIKE 'EQ010-0500%' OR Account LIKE 'EQ010-0600%' OR Account =  'CA060-1000-0000' OR Account = 'CA060-1400-0000' OR Account LIKE 'CA060-1100%')) = 0
		--		BEGIN
		--			SET @error=1
		--			SET @error_message ='Select related retained earnings, Creditable/Final Wtax, or Input Tax as GL Account.' 
		--		END
		--	END
			
		--	--To check the correct GL Account used for Interest for for Opening Balance - BP - Credit Side
		--	IF EXISTS (SELECT TransId FROM JDT1 
		--				WHERE TransType=30 AND TransId = @list_of_cols_val_tab_del AND TransCode='OBB' AND Credit > 0 AND ShortName NOT IN (SELECT CardCode FROM OCRD WHERE frozenFor='N' AND CardType='S') AND 
		--				(Account NOT LIKE 'EQ010-0500%' AND Account NOT LIKE 'EQ010-0600%' AND Account !=  'CL020-1800-0000' AND Account NOT LIKE 'CL020-2600%'))
		--	BEGIN
		--		SET @error=1
		--		SET @error_message ='Invalid GL Account.' 
		--	END
		--	ELSE
		--	BEGIN
		--		--To check if the related GL Account exist for income/expenses
		--		IF (SELECT COUNT(TransId) FROM JDT1
		--					WHERE TransType=30 AND TransId = @list_of_cols_val_tab_del AND TransCode='OBB' AND  
		--					(Account LIKE 'EQ010-0500%' OR Account LIKE 'EQ010-0600%' OR Account =  'CL020-1800-0000' OR Account LIKE 'CL020-2600%')) = 0
		--		BEGIN
		--			SET @error=1
		--			SET @error_message ='Select related Retained Earnings, Expanded Wtax, or Output Tax as GL Account.' 
		--		END
		--	END

		--	--To check if the BP Code exist for receivable/payable
		--	IF (SELECT COUNT(TransId) FROM JDT1
		--				WHERE TransType=30 AND TransId = @list_of_cols_val_tab_del AND TransCode='OBB' AND (ShortName IN (SELECT CardCode FROM OCRD WHERE frozenFor='N'))) = 0
		--	BEGIN
		--		SET @error=1
		--		SET @error_message ='Select BP Code for receivable/payable.' 
		--	END

		--	--To not require Store Performance
		--	IF EXISTS (SELECT TransId FROM JDT1
		--		WHERE TransType=30 AND TransId = @list_of_cols_val_tab_del AND (ShortName IN (SELECT CardCode FROM OCRD WHERE frozenFor='N') OR 
		--				(Account LIKE 'EQ010-0500%' OR Account LIKE 'EQ010-0600%' OR Account =  'CA060-1000-0000' OR Account = 'CA060-1400-0000' OR Account LIKE 'CA060-1100%' 
		--				OR Account =  'CL020-1800-0000' OR Account LIKE 'CL020-2600%')) AND (ProfitCode IS NOT NULL AND ProfitCode != ''))
		--	BEGIN
		--		SET @error=1
		--		SET @error_message ='Store Performance is not required.' 
		--	END

		--	--To check if there is Wtax Code assigned in WTax Table
		--	IF EXISTS (SELECT TransId FROM JDT1 WHERE TransId = @list_of_cols_val_tab_del AND Account IN ('CA060-1000-0000','CA060-1400-0000', 'CL020-1800-0000') )
		--	BEGIN
		--			IF NOT EXISTS (SELECT AbsEntry FROM JDT2 
		--				WHERE AbsEntry = @list_of_cols_val_tab_del)
		--			BEGIN
		--				SET @error=1
		--				SET @error_message ='Use WTax Table for setting Withholding Tax.' 
		--			END
		--	END

		--END

		--Validation for Withholding Tax Adjustment
		IF EXISTS(SELECT TransId FROM OJDT WHERE TransType=30 AND TransId = @list_of_cols_val_tab_del AND TransCode='WTA'
					AND TransId NOT IN (SELECT StornoToTr from OJDT WHERE StornoToTr IS NOT NULL)
					AND TransId NOT IN (SELECT TransId from OJDT WHERE StornoToTr IS NOT NULL))
		BEGIN

			--To check the correct GL Account used for Withholding Tax Adjustment
			IF EXISTS (SELECT TransId FROM JDT1
						WHERE TransType=30 AND TransId = @list_of_cols_val_tab_del AND TransCode='WTA'
						AND ShortName NOT IN (SELECT CardCode FROM OCRD WHERE frozenFor='N') AND 
						(Account !=  'CA060-1000-0000' AND Account != 'CA060-1400-0000' AND Account != 'CL020-1800-0000'))
			BEGIN
				SET @error=1
				SET @error_message ='Invalid GL Account.' 
			END
			ELSE
			BEGIN
					
					--To check if the BP Code exist for receivable/payable
					IF (SELECT COUNT(TransId) FROM JDT1
								WHERE TransType=30 AND TransId = @list_of_cols_val_tab_del AND TransCode='WTA' AND (ShortName IN (SELECT CardCode FROM OCRD WHERE frozenFor='N'))) = 0
					BEGIN
						SET @error=1
						SET @error_message ='Select BP Code for receivable/payable.' 
					END

					--To check if the related GL Account exist for income/expenses
					IF (SELECT COUNT(TransId) FROM JDT1
								WHERE TransType=30 AND TransId = @list_of_cols_val_tab_del AND TransCode='WTA' AND  
								(Account =  'CA060-1000-0000' OR Account = 'CA060-1400-0000' OR Account = 'CL020-1800-0000')) = 0
					BEGIN
						SET @error=1
						SET @error_message ='Select related Withholding Tax as GL Account.' 
					END
					
					--To not require Store Performance
					IF EXISTS (SELECT TransId FROM JDT1
						WHERE TransType=30 AND TransId = @list_of_cols_val_tab_del AND ((ShortName IN (SELECT CardCode FROM OCRD WHERE frozenFor='N') OR 
								(Account =  'CA060-1000-0000' OR Account = 'CA060-1400-0000' OR Account = 'CL020-1800-0000')) AND (ProfitCode IS NOT NULL AND ProfitCode != '')))
					BEGIN
						SET @error=1
						SET @error_message ='Store Performance is not required.' 
					END

					--To check if the Business Partner is duplicate or more than one
					IF  (SELECT COUNT (ShortName) FROM JDT1 WHERE TransType=30 AND TransId = @list_of_cols_val_tab_del AND ShortName IN (SELECT CardCode FROM OCRD WHERE frozenFor='N')) > 1
					BEGIN
						SET @error=1
						SET @error_message ='Only one BP Code is allowed per entry.' 
					END

					--To check if the Non-Business Partner is duplicate or more than one
					IF  (SELECT COUNT (ShortName) FROM JDT1 WHERE TransType=30 AND TransId = @list_of_cols_val_tab_del AND ShortName NOT IN (SELECT CardCode FROM OCRD WHERE frozenFor='N')) > 1
					BEGIN
						SET @error=1
						SET @error_message ='Only one Withholding Tax is allowed per entry.' 
					END

					--To check if the Business Partner tagged with the WTax Code
					IF EXISTS (SELECT TransId FROM JDT1 WHERE TransType=30 AND TransId = @list_of_cols_val_tab_del AND ShortName IN (SELECT CardCode FROM OCRD WHERE frozenFor='N') AND U_WTaxCode IS NULL)
					BEGIN
						SET @error=1
						SET @error_message ='Select the related WTax Code in BP row.' 
					END

					--To check if the Non-Business Partner tagged with the WTax Code
					IF EXISTS (SELECT TransId FROM JDT1 WHERE TransType=30 AND TransId = @list_of_cols_val_tab_del AND ShortName NOT IN (SELECT CardCode FROM OCRD WHERE frozenFor='N') AND U_WTaxCode IS NOT NULL)
					BEGIN
						SET @error=1
						SET @error_message ='WTax Code should be tagged only in Business Partner.' 
					END

			END

		END
		
END

--Validation for Opening Amount Add-On
IF @object_type = 'OpeningAmt' AND (@transaction_type='A' OR @transaction_type='U')
BEGIN
		
	--To check the duplication of entry
	SELECT @iCashierID=U_CashierID,@dTransDate=U_TransDate FROM  [@OPENAMT] WHERE DocEntry=@list_of_cols_val_tab_del

	IF EXISTS(SELECT DocEntry FROM [@OPENAMT] WHERE U_CashierID=@iCashierID AND U_TransDate=@dTransDate AND DocEntry!=@list_of_cols_val_tab_del )
	BEGIN

		SET @error=1
		SET @error_message ='Cashier ID is already exist on this transaction date.'

	END

END

--Validation for Closing Amount Add-On
IF @object_type = 'ClosingAmt' AND (@transaction_type='A' OR @transaction_type='U')
BEGIN
		
	--To check the duplication of entry
	SELECT @iCashierID=U_CashierID,@dTransDate=U_TransDate FROM  [@CLOSING] WHERE DocEntry=@list_of_cols_val_tab_del

	IF EXISTS(SELECT DocEntry FROM [@CLOSING] WHERE U_CashierID=@iCashierID AND U_TransDate=@dTransDate AND DocEntry!=@list_of_cols_val_tab_del )
	BEGIN

		SET @error=1
		SET @error_message ='Cashier ID is already exist on this transaction date.'

	END

END

--Validation for Bills and Coins Breakdown Add-On
IF @object_type = 'Denomination' AND (@transaction_type='A' OR @transaction_type='U')
BEGIN
		
	--To check the duplication of entry
	SELECT @iCashierID=U_CashierID,@dTransDate=U_TransDate FROM  [@DENOMINATION] WHERE DocEntry=@list_of_cols_val_tab_del

	IF EXISTS(SELECT DocEntry FROM [@DENOMINATION] WHERE U_CashierID=@iCashierID AND U_TransDate=@dTransDate AND DocEntry!=@list_of_cols_val_tab_del )
	BEGIN

		SET @error=1
		SET @error_message ='Cashier ID is already exist on this transaction date.'

	END

END

--Validation for SO and LO Registration
IF @object_type = 'SOLOReg' AND (@transaction_type='A' OR @transaction_type='U')
BEGIN
	
	--To Check if the SO is empty
	IF EXISTS(SELECT DocEntry FROM [@SOLOREGDETAILS] WHERE DocEntry=@list_of_cols_val_tab_del AND (U_SONum='' OR U_SONum IS NULL))
	BEGIN
		SET @error=1
		SET @error_message ='Empty SO Number is not allowed.'
	END
	ELSE IF EXISTS(SELECT DocEntry FROM [@SOLOREGDETAILS] WHERE DocEntry=@list_of_cols_val_tab_del AND (U_LONum='' OR U_LONum IS NULL))
	BEGIN
		SET @error=1
		SET @error_message ='Empty LO Number is not allowed.'
	END

	--To Check if the SO conatins multiple value
	IF (SELECT COUNT  (DISTINCT U_SONum) FROM [@SOLOREGDETAILS] WHERE DocEntry=@list_of_cols_val_tab_del) > 1
	BEGIN
		SET @error=1
		SET @error_message ='SO Number should only have one value.'
	END

	--To Check the duplication of SO Number
	IF EXISTS(SELECT DocEntry FROM [@SOLOREGDETAILS] WHERE U_SONum IN (SELECT DISTINCT U_SONum FROM [@SOLOREGDETAILS] WHERE DocEntry=@list_of_cols_val_tab_del)
			AND DocEntry != @list_of_cols_val_tab_del)
	BEGIN
		SET @error=1
		SET @error_message ='Duplicate SO Number is not allowed.'
	END

	--To Check the duplication of LO Number
	IF EXISTS(SELECT DocEntry FROM [@SOLOREGDETAILS] WHERE U_LONum IN (SELECT DISTINCT U_LONum FROM [@SOLOREGDETAILS] WHERE DocEntry=@list_of_cols_val_tab_del)
				AND DocEntry != @list_of_cols_val_tab_del)
	BEGIN
		SET @error=1
		SET @error_message ='Duplicate LO Number is not allowed.'
	END
	ELSE IF  EXISTS (SELECT * FROM (SELECT COUNT(U_LONum) AS CountLO FROM [@SOLOREGDETAILS] WHERE DocEntry=@list_of_cols_val_tab_del
	GROUP BY U_LONum) AS TBL_A WHERE CountLO > 1)
	BEGIN
		SET @error=1
		SET @error_message ='Duplicate LO Number is not allowed.'
	END

	--To check if the total LO Qty exceeds the SO Qty
	SELECT @fPOQty = SUM(Quantity) FROM POR1 WHERE DocEntry=(SELECT U_PODocNum FROM [@SOLOREGHEADER] WHERE DocEntry=@list_of_cols_val_tab_del)

	SELECT @fSOLOQty = SUM(U_LoadQty) FROM [@SOLOREGDETAILS] WHERE DocEntry=@list_of_cols_val_tab_del

	IF @fSOLOQty <> @fPOQty
	BEGIN
		SET @error=1
		SET @error_message ='Total LO quantity should be matched with the PO quantity.'
	END

END

--Validation for Reprinting By ACDC
IF @object_type = 'REPRINT' AND (@transaction_type='A' OR @transaction_type='U')
BEGIN
	DECLARE @DOCTYPE VARCHAR(50),@DOCNO INT, @msg VARCHAR (50)
	--To check the duplication of entry
	SELECT @DOCTYPE=U_Doctype,@DOCNO=U_DocNam,@msg=(CONCAT(U_Doctype,'. ',U_DocNam))  FROM  [@REPRINT] WHERE DocEntry=@list_of_cols_val_tab_del

	IF (SELECT COUNT(DocEntry) FROM [@REPRINT] WHERE U_Printed='N' AND U_Doctype=@DOCTYPE AND U_DocNam=@DOCNO)>1
	BEGIN

		SET @error=1
		SET @error_message = @msg+ ' already added and not printed'

	END

END

SELECT @error, @error_message

END































































































































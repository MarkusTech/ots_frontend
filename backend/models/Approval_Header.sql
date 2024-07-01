INSERT INTO [dbo].[SO_Header]
           ([EntryNum]
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
           ,[BaseDoc]  -- Assuming BaseDoc is an int column
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
           ,[SalesCrew]
           ,[ForeignName]
           ,[ApprovalStat]
           ,[CreatedBy]
           ,[DateCreated]
           ,[UpdatedBy]
           ,[DateUpdated])
     VALUES
           ('12345',                 -- EntryNum (nvarchar(max))
            67890,                   -- DocNum (bigint)
            10202,                   -- DraftNum (bigint)
            '2024-06-30',            -- PostingDate (date)
            '2024-06-30',            -- DocDate (date)
            'CUST001',               -- CustomerCode (nvarchar(max))
            'John Doe',              -- CustomerName (nvarchar(max))
            'Jane Doe',              -- WalkInName (nvarchar(max))
            '123 Main St',           -- ShippingAdd (nvarchar(max))
            '123-456-789',           -- TIN (nvarchar(max))
            'REF123',                -- Reference (nvarchar(max))
            'PWD123',                -- SCPWDIdNo (nvarchar(max))
            'Branch001',             -- Branch (nvarchar(max))
            'Draft',                 -- DocStat (nvarchar(max))
            1,                       -- BaseDoc (int)
            'Y',                -- Cash (nvarchar(10)) - Adjusted assuming it's a string representation
            'N',                -- CreditCard (nvarchar(10)) - Adjusted assuming it's a string representation
            'N',                -- DebitCard (nvarchar(10)) - Adjusted assuming it's a string representation
            'N',                  -- ODC (nvarchar(10)) - Adjusted assuming it's a string representation
            'N',                -- PDC (nvarchar(10)) - Adjusted assuming it's a string representation
            'N',                -- OnlineTransfer (nvarchar(10)) - Adjusted assuming it's a string representation
            'N',                  -- OnAccount (nvarchar(10)) - Adjusted assuming it's a string representation
            'N',                -- COD (nvarchar(10)) - Adjusted assuming it's a string representation
            800.00,                -- TotalAmtBefTax (nvarchar(10)) - Adjusted assuming it's a string representation
            80.00,                 -- TotalTax (nvarchar(10)) - Adjusted assuming it's a string representation
            880.00,                -- TotalAmtAftTax (nvarchar(10)) - Adjusted assuming it's a string representation
            40.00,                 -- SCPWDDiscTotal (nvarchar(10)) - Adjusted assuming it's a string representation
            840.00,                -- TotalAmtDue (nvarchar(10)) - Adjusted assuming it's a string representation
            'This is a remark',      -- Remarks (nvarchar(255))
            'Sales001',              -- SalesCrew (nvarchar(max))
            'ForeignName001',        -- ForeignName (nvarchar(max))
            1,                       -- ApprovalStat (int)
            'admin',                 -- CreatedBy (nvarchar(200))
            '2024-06-30 00:00:00',   -- DateCreated (datetime)
            1,                 -- UpdatedBy (nvarchar(200))
            '2024-06-30 00:00:00'    -- DateUpdated (datetime)
           );
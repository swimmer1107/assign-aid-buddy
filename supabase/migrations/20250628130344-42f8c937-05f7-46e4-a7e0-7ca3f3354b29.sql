
-- Add missing payment-related columns to the orders table
ALTER TABLE public.orders 
ADD COLUMN payment_method_id TEXT,
ADD COLUMN payment_status TEXT DEFAULT 'pending',
ADD COLUMN transaction_id TEXT,
ADD COLUMN payment_amount DECIMAL(10,2);

-- Keep message history append-only for authenticated users.
REVOKE DELETE, UPDATE ON public.messages FROM authenticated;

DROP POLICY IF EXISTS "messages_mark_read" ON public.messages;

CREATE OR REPLACE FUNCTION public.can_send_message(
  message_listing_id uuid,
  message_sender_id uuid,
  message_receiver_id uuid
) RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT auth.uid() = message_sender_id
    AND message_sender_id <> message_receiver_id
    AND EXISTS (
      SELECT 1
      FROM public.listings
      WHERE listings.id = message_listing_id
        AND (
          listings.seller_id = message_receiver_id
          OR (
            listings.seller_id = auth.uid()
            AND EXISTS (
              SELECT 1
              FROM public.messages previous_message
              WHERE previous_message.listing_id = message_listing_id
                AND (
                  previous_message.sender_id = message_receiver_id
                  OR previous_message.receiver_id = message_receiver_id
                )
            )
          )
        )
    );
$$;

DROP POLICY IF EXISTS "messages_send" ON public.messages;
CREATE POLICY "messages_send" ON public.messages
FOR INSERT TO authenticated
WITH CHECK (public.can_send_message(listing_id, sender_id, receiver_id));
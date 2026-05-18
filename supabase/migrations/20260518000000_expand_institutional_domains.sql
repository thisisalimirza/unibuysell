-- Expand institutional email validation to include international academic domains
-- UK (.ac.uk), Australia (.edu.au), NZ (.ac.nz), South Africa (.ac.za),
-- Singapore (.edu.sg), Hong Kong (.edu.hk), India (.ac.in),
-- Mexico (.edu.mx), Brazil (.edu.br), Colombia (.edu.co), Argentina (.edu.ar)

alter table public.profiles
  drop constraint if exists institutional_email_only;

alter table public.profiles
  add constraint institutional_email_only check (
    email ~* '^[^@]+@[^@]+$'
    and lower(split_part(email, '@', 2)) not in (
      'aol.com',
      'gmail.com',
      'googlemail.com',
      'hotmail.com',
      'icloud.com',
      'live.com',
      'mail.com',
      'me.com',
      'msn.com',
      'outlook.com',
      'proton.me',
      'protonmail.com',
      'yahoo.com',
      'ymail.com'
    )
    and (
      lower(split_part(email, '@', 2)) like '%.edu'
      or lower(split_part(email, '@', 2)) like '%.ac.uk'
      or lower(split_part(email, '@', 2)) like '%.edu.au'
      or lower(split_part(email, '@', 2)) like '%.ac.nz'
      or lower(split_part(email, '@', 2)) like '%.ac.za'
      or lower(split_part(email, '@', 2)) like '%.edu.sg'
      or lower(split_part(email, '@', 2)) like '%.edu.hk'
      or lower(split_part(email, '@', 2)) like '%.ac.in'
      or lower(split_part(email, '@', 2)) like '%.edu.mx'
      or lower(split_part(email, '@', 2)) like '%.edu.br'
      or lower(split_part(email, '@', 2)) like '%.edu.co'
      or lower(split_part(email, '@', 2)) like '%.edu.ar'
    )
  );

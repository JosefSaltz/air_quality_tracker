# Air Quality Tracker

## About
Air Quality Tracker is a open-source project commisioned by citizens of Vallejo, CA to help trace
a recurring odor issue in the city dealing with local municipalities. The app aims to record and 
visualize data to more actively identify the root cause and help the citizens communicate with their
local authorities. The app is currently geared towards the local city area but can be adapted to any
region with some minor value changes. The current tech stack is Svelte Kit (Svelte 5), Supabase(Auth/DB), Postgres, and Drizzle ORM at a later date.



## Development
### Requirements
Supabase local development environment is needed to access auth, api, and db related services. Please see
documentation found [here](https://supabase.com/docs/guides/local-development/overview).

The following env values are required:
```
#Prod
DATABASE_URL
PUBLIC_SUPABASE_URL
PUBLIC_SUPABASE_ANON_KEY
PUBLIC_AUTH_REDIRECT_URL
#Local
LOCAL_DATABASE_URL
PUBLIC_LOCAL_SUPABASE_ANON_KEY
PUBLIC_LOCAL_SUPABASE_URL
PUBLIC_DEV_AUTH_REDIRECT_URL
#Shared
OPEN_METEO_URL
RESEND_API_KEY
PUBLIC_DOMAIN
PUBLIC_GOOGLE_CLIENT_ID
PRIVATE_GOOGLE_CLIENT_SECRET
PUBLIC_RECAPTCHA_SITE
PRIVATE_RECAPTCHA_SECRET
ORIGIN
SENTRY_AUTH_TOKEN
SENTRY_ORG
SENTRY_PROJECT
PRIVATE_HCAPTCHA_SECRET
PUBLIC_HCAPTCHA_SITE_KEY
PUBLIC_TURNSTILE_KEY
PRIVATE_TURNSTILE_SECRET
```

### Run Dev Server
Deno is recommended and what is currently used for deployments. Run `deno install` to install dependencies
followed by `deno task dev` to start the development server.

# Deploy
Prod service containers are defined in the docker-compose file for deployment to your preferred provider.



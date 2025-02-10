# 👃💩 Air Quality Tracker

Air Quality Tracker is an open-source application commissioned by the citizens of Vallejo, CA, to tackle recurring odor issues in the community. By systematically collecting, recording, and visualizing environmental data, the app empowers residents to identify potential sources of air quality disturbances and engage local authorities with concrete, actionable insights.

Originally developed for Vallejo, the platform is designed with flexibility in mind—it can be easily adapted to serve any region with only minor modifications. Built upon a robust, modern tech stack that emphasizes performance, scalability, and reliability, Air Quality Tracker not only provides a user-friendly interface for data monitoring but also fosters community-driven environmental advocacy. The current tech stack is: 
* Svelte Kit (Svelte 5) 
* Supabase(Auth/DB)
* Postgres 
* Drizzle ORM (Soon)



## Development
### Requirements
Supabase local development environment is needed to access auth, api, and db related services. Please see
documentation found [here](https://supabase.com/docs/guides/local-development/overview).

The following env values are required:
```
# Prod
DATABASE_URL
PUBLIC_SUPABASE_URL
PUBLIC_SUPABASE_ANON_KEY
PUBLIC_AUTH_REDIRECT_URL
# Local Dev
LOCAL_DATABASE_URL
PUBLIC_LOCAL_SUPABASE_ANON_KEY
PUBLIC_LOCAL_SUPABASE_URL
PUBLIC_DEV_AUTH_REDIRECT_URL
# Shared
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
PUBLIC_CITY_NAME
```

### Run Dev Server
Deno is recommended and what is currently used for deployments. Run `deno install` to install dependencies
followed by `deno task dev` to start the development server.

## Deploy
Prod service containers are defined in the docker-compose file for deployment to your preferred provider.
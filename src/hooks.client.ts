import * as Sentry from "@sentry/sveltekit";

Sentry.init({
  dsn: "https://18b27370300a72c50f62bfda6c9ba9a7@o4508782595866624.ingest.us.sentry.io/4508782597308416",

  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 1.0,

  // Optional: Initialize Session Replay:
  integrations: [Sentry.replayIntegration()],
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});

const myErrorHandler = ({ error, event }) => {
  console.error("An error occurred on the client side:", error, event);
};

export const handleError = Sentry.handleErrorWithSentry(myErrorHandler);

// or alternatively, if you don't have a custom error handler:
// export const handleError = handleErrorWithSentry();
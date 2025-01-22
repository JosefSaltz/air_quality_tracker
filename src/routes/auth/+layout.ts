import { dev } from "$app/environment";
import type { LayoutLoad } from "../$types";
import { PUBLIC_DOMAIN } from "$env/static/public";

export const load: LayoutLoad = async ({ data }) => {
  const getLoginURI = () => dev ? 'http://localhost:54321' : PUBLIC_DOMAIN;
  const { session, cookies, profile } = data; 
  return { getLoginURI, session, cookies, profile };
}
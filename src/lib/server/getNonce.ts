import crypto from "node:crypto";

export default function getNonce() {
  return crypto.randomUUID();
}
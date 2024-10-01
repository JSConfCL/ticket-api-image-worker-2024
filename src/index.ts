/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.toml`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { ImageResponse, loadGoogleFont } from "workers-og";
import { corsHeaders } from "./cors";
import { template } from "./template";

export interface Env {
  OG_BUCKET: R2Bucket;
  BUCKET_AUTH_KEY_SECRET: string;
  API_URL: string;
}

export const PATTERNS = {
  bucket: new URLPattern({ pathname: "/bucket/:key" }),
};

interface PublicTicketInfo {
  id: string;
  userName: string;
  userUsername: string;
}

const getApiInformation = async (URL: string, ticketId: string) => {
  const headers = new Headers();
  headers.append("Content-Type", "text/javascript");

  console.log(`Fetching API information for ticket ${ticketId} in ${URL}`);

  try {
    const response  = await fetch(URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `query PublicTicketInfo ($publicTicketId: String!) { publicTicketInfo (input: { publicTicketId: $publicTicketId } ) { id userName userUsername } }`,
        variables: { publicTicketId: ticketId },
      }),
    });
    console.log(`Parsing Data`);
    const baseData: { data: { publicTicketInfo: PublicTicketInfo } } = await response.json();
    const publicTicketInfo: PublicTicketInfo = baseData.data.publicTicketInfo;
    console.log(`Returning Data`);
    return {
      name: publicTicketInfo?.userName ?? "",
      username: publicTicketInfo?.userUsername ?? ""
    };
  } catch (error) {
    throw new Error(`Failed to fetch API information for ticket ${ticketId} in ${URL}`);
  }
};

export default {
  async fetch(
    request: Request,
    env: Env,
    _ctx: ExecutionContext
  ): Promise<Response> {
    const params = new URL(request.url).searchParams;

    const format = params.get("format");
    const debug = params.get("debug");
    const ticketId = params.get("ticketId");
    const url = env.API_URL;

    if (!ticketId) {
      throw new Error("no ticket");
    }

    const data = await getApiInformation(url, ticketId);
    const element = template({
      name: data.name, username: data.username
    });

    return new ImageResponse(element, {
      format: format as "svg" | "png",
      debug: debug === "true",
      fonts: [
        {
          name: "Barlow",
          data: await loadGoogleFont({ family: "Barlow", weight: 600 }),
          weight: 600,
          style: "normal",
        },
        {
          name: "Inconsolata",
          data: await loadGoogleFont({ family: "Inconsolata", weight: 700 }),
          weight: 700,
          style: "normal",
        },
      ],
      headers: {
        ...corsHeaders
      },
    });
  },
};
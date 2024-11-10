//File: example/example-node.ts

import { z } from "zod";
import axios from "axios";

import {
  defineDAINService,
  ToolConfig,
  ServiceConfig,
  ToolboxConfig,
  ServiceContext,
} from "@dainprotocol/service-sdk";
import { get } from "http";

const getSummaryConfig: ToolConfig = {
  id: "get-video-summary",
  name: "Get Video Summary",
  description: "Fetches video summary for a given video url",
  input: z
    .object({
      url: z.string().describe("Video url"),
    })
    .describe("Input url for the video summary request"),
  output: z
    .object({
      summary: z.string().describe("Current summary of video"),
      // windSpeed: z.number().describe("Current wind speed in km/h"),
    })
    .describe("Current video summary information"),
  pricing: { pricePerUse: 0, currency: "USD" },
  handler: async ({ url }, agentInfo) => {
    console.log(
      `User / Agent ${agentInfo.id} requested summery of video: ${url}`
    );

    const response = await axios.get(
      `https://127.0.0.0/api/text-summary`
    );

    const { summary } = response.data.current;

    return {
      text: `The video summary for given url:: ${summary}`,
      data: {
        temperature: summary,
      },
      ui: {},
    };
  },
};

const dainService = defineDAINService({
  metadata: {
    title: "Video Summary DAIN Service",
    description:
      "A DAIN service for current weather and forecasts using Open-Meteo API",
    version: "1.0.0",
    author: "Your Name",
    tags: ["video", "summary", "youtube"],
    logo: "https://cdn-icons-png.flaticon.com/512/252/252035.png"
  },
  identity: {
    apiKey: process.env.DAIN_API_KEY,
  },
  tools: [getSummaryConfig],
});

dainService.startNode({ port: 2022 }).then(() => {
  console.log("Weather DAIN Service is running on port 2022");
});


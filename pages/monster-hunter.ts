import type { HubPageConfig } from "./types";

export const monsterHunterHub: HubPageConfig = {
  id: "monster-hunter",
  title: "Monster Hunter",
  sections: [
    {
      id: "latest-guides",
      component: "content-carousel",
      title: "Latest guides",
      selection: { kind: "tags", tags: ["monster-hunter", "guides"], limit: 8 },
      options: { imageRatio: "landscape" },
    },
  ],
};

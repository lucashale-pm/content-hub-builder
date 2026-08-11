# Steam data

- Purpose: Display SteamDB game data for one Steam application.
- Inputs: Steam app ID only.
- States: Default embed; invalid or unavailable app ID follows SteamDB's embedded response.
- Constraints: Uses SteamDB's official embed URL; no fetched or duplicated Steam data; lazy iframe; fixed 389px height from supplied embed code.
- Reuse: Any hub may set its own app ID. Theme does not alter third-party embed internals.

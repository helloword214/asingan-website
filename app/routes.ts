import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("history", "routes/history.tsx"),
  route("leadership", "routes/leadership.tsx"),
  route("personnel", "routes/personnel.tsx", [
    index("routes/personnel._index.tsx"),
    route(":personId", "routes/personnel.$personId.tsx"),
  ]),
  route("assets", "routes/assets.tsx"),
] satisfies RouteConfig;

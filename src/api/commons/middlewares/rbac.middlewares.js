import { ForbiddenError, UnauthorizedError } from "../http-errors";

// POST routes that only READ: they take their query in the body (a list too
// long for a URL). Viewers and readers may call them like a GET.
export const READ_ONLY_POSTS = ["/dialogue/structures"];
const isReadOnlyPost = (req) =>
  req.method === "POST" && READ_ONLY_POSTS.includes(req.path);

export function requireAuth(req, res, next) {
  if (["development", "testing"].includes(process.env.NODE_ENV)) return next();
  if (["/signup", "/signin", "/token", "/recovery/password"].includes(req.path))
    return next();
  if (req.path.startsWith("/opendata")) return next();
  if (req.path.startsWith("/exports/annelis")) return next();
  if (req.path.startsWith("/curiexplore")) return next();
  if (req.path.startsWith("/assets/avatars")) return next();
  if (req.path.startsWith("/assets/logos")) return next();
  if (!req?.currentUser?.id) {
    throw new UnauthorizedError("You must be connected");
  }
  if (req.currentUser.isDeleted) {
    throw new ForbiddenError("Inactive user");
  }
  if (
    req.method !== "GET" &&
    req.currentUser.role === "viewer" &&
    !isReadOnlyPost(req)
  ) {
    throw new ForbiddenError("Insufficient user rights");
  }
  return next();
}

export function requireRoles(roles) {
  return (req, res, next) => {
    if (["development", "testing"].includes(process.env.NODE_ENV))
      return next();
    if (!req.currentUser.id) {
      throw new UnauthorizedError("You must be connected");
    }
    if (!roles.includes(req.currentUser.role)) {
      throw new ForbiddenError("Insufficient user rights");
    }
    return next();
  };
}

export function forbidReadersToWrite(req, res, next) {
  if (["development", "testing"].includes(process.env.NODE_ENV)) return next();
  if (
    [
      "/signup",
      "/signin",
      "/token",
      "/recovery/password",
      "/me",
      "/me/password",
      "/me/avatar",
    ].includes(req.path)
  )
    return next();
  if (
    req.currentUser.role === "reader" &&
    req.method !== "GET" &&
    !isReadOnlyPost(req)
  ) {
    throw new ForbiddenError("Insufficient user rights");
  }
  return next();
}

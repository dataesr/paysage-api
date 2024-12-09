import express from "express";

import updates from "./updates/updates.routes";

const router = new express.Router();

router.use(updates);

export default router;

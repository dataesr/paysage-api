import express from "express";

import controllers from "../../commons/middlewares/crud.middlewares";

import readQuery from "../../commons/queries/sirene-updates.query";
import { sireneUpdatesRepository as repository } from "../../commons/repositories";

const router = new express.Router();

router.route("/sirene/updates").get(controllers.list(repository, readQuery));

export default router;

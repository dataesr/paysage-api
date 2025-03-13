import express from "express";

import { db } from "../../../services/mongo.service";
import { requireRoles } from "./commons/middlewares/rbac.middlewares";

const router = new express.Router();

router.route("/utilities/dedup-legal-category-sirene")
  .get(async (req, res) => db.collection("_deduped_legal_category_sirene").find({}).toArray()
    .then((data) => res.status(200).json(data))
    .catch((error) => res.status(500).json({ error })));

export default router;

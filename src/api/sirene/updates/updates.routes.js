import express from "express";
import { ObjectId } from "mongodb";

import controllers from "../../commons/middlewares/crud.middlewares";

import readQuery from "../../commons/queries/sirene-updates.query";
import { sireneUpdatesRepository as repository } from "../../commons/repositories";
import { patchContext } from "../../commons/middlewares/context.middlewares";
import { db } from "../../../services/mongo.service";

const router = new express.Router();

router.route("/sirene/updates").get(controllers.list(repository, readQuery));
router.route("/sirene/updates/:id")
  .patch(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const { value } = await db.collection("_sirene_updates").findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { status } },
      { returnDocument: "after" },
    );

    res.json(value);
  })

export default router;

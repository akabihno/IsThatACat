import * as tf from "@tensorflow/tfjs-node";
import coco_ssd from "@tensorflow-models/coco-ssd";

import express from "express";
import busboy from "busboy";
import { config } from "dotenv";
config();

let model = undefined;
(async () => {
    model = await coco_ssd.load({
        base: "mobilenet_v1",
    });
})();

const app = express();
const PORT = process.env.PORT || 8888;
app.use(express.json());

app.post("/isthatacat", (req, res) => {
    if (!model) {
        res.status(500).send("Internal service error");
        return;
    }

    const bb = busboy({ headers: req.headers });
    bb.on("file", (fieldname, file) => {
        let response = false;
        const buffer = [];
        file.on("data", (data) => {
            buffer.push(data);
        });
        file.on("end", async () => {
            const image = tf.node.decodeImage(Buffer.concat(buffer));
            const predictions = await model.detect(image, 3, 0.25);

            predictions.forEach(element => {
                if (element['class'] === 'cat') {
                    response = true;
                }
            });
            res.json(response);
        });
    });
    req.pipe(bb);
});

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});

import type { PlasmoMessaging } from "@plasmohq/messaging"
import { type WikiMessage } from "~background"
const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
    const message = `Hello, ${req.body.name}`

    res.send({
        message
    })
}

export default handler
import React from 'react'
import { useState, useEffect } from "react"
import { Storage } from "@plasmohq/storage"

const Generate = (text) => {
    console.log(text)
    const [existText, setexistText] = useState("");
    const storage = new Storage()

    useEffect(() => {
        const fetch = async () => {
            console.log(text.text)
            const data = await storage.get("textexist")
            console.log(data)
            const updatedData = data ? data + text.text : text.text;
            setexistText(updatedData);
            console.log(existText)
            await storage.set("textexist", existText)
            console.log(existText)
        }
        fetch()
    }, [text])
    return (
        <div><p>{existText}</p></div>
    )
}
export default Generate;
import { useState, useEffect } from "react"
import Generate from "./components/generate"

function IndexPopup() {
  const [data, setData] = useState("")
  const [SelectionText, setSelectionText] = useState("")
  const [resultText, setresultText] = useState(null)

  const summarise = async (text: String) => {
    const { Configuration, OpenAIApi } = require("openai");

    // console.log(process.env.OPENAI_API_KEY)

    // const configuration = new Configuration({
    //   organization: "org-Rm0qdn9Qbh5zlQp9JpVZpTUU",
    //   apiKey: "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",
    // });
    // const openai = new OpenAIApi(configuration);
    // console.log(openai);

    // const response = await openai.createCompletion({
    //   model: "text-davinci-003",
    //   prompt: `Summarize this :\n\n${text}`,
    //   temperature: 0.7,
    //   max_tokens: 64,
    //   top_p: 1.0,
    //   frequency_penalty: 0.0,
    //   presence_penalty: 0.0,
    // });
    const key = process.env.OPENAI_API_KEY
    // console.log(key)
    const response = await fetch("https://api.openai.com/v1/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`
      },
      body: JSON.stringify({
        model: "text-davinci-003",
        prompt: `Summarize this as short notes:\n\n${text}`,
        temperature: 0.7,
        max_tokens: 256,
        top_p: 1.0,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
      })
    });

    if (response.status === 429) {
      const retryAfter = parseInt(response.headers.get("Retry-After"));
      await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
      // Retry the request here
    }
    console.log(response)
    const data = await response.json()
    console.log(data.choices[0].text)
    setresultText(data.choices[0].text)
  }

  useEffect(() => {
    console.log("changes any on first load")
    setresultText("")
    // chrome.storage.onChanged.addListener(function (changes) {
    // console.log(changes.dict1)
    // if (changes) {
    // sync
    chrome.storage.local.get(["dict1"], function (result) {
      console.log(result)
      setSelectionText(result.dict1)
    })
    // }
    // });
  }, [])
  useEffect(() => {
    setData(SelectionText)
  }, [SelectionText])

  chrome.storage.onChanged.addListener(function (changes) {
    console.log(changes.dict1)
    if (changes) {
      chrome.storage.local.get(["dict1"], function (result) {
        console.log(result)
        setSelectionText(changes.dict1.newValue)
      })
    }
  });
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        padding: 16
      }}>
      {/* <input onChange={(e) => setData(e.target.value)} value={SelectionText} /> */}
      <p>{data}</p>
      {/* <a href="https://docs.plasmo.com" target="_blank">
        View Docs
      </a> */}
      {/* <Generate text={SelectionText}/> */}
      <button onClick={() => summarise(data)}>Summarize</button>
      {resultText&&(<div><h1>Summary is </h1><p>{resultText}</p></div>)}
      <button onClick={() => {
        setresultText(null)
        chrome.storage.local.set({ dict1: "" });
      }}>Clear</button>
    </div>
  )
}

export default IndexPopup

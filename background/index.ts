export { }

chrome.runtime.onInstalled.addListener(function () {
    console.log("Shortcut created")
    chrome.contextMenus.create({
        title: 'Create notes',
        contexts: ["selection"],
        id: "myContextMenuId"
    });

    chrome.contextMenus.create({
        title: "Add to Content",
        contexts: ["selection"],
        id: "addToContent"
    });

})
type WikiTldrThumbnail = {
    source: string
    width: number
    height: number
}

export type WikiTldr = {
    query: string
    type: string
    title: string
    displaytitle: string
    thumbnail: WikiTldrThumbnail
    originalimage: WikiTldrThumbnail
    lang: string
    description: string
    extract: string
    extract_html: string
}

export type WikiMessage = {
    type: string
    text: string
}
chrome.contextMenus.onClicked.addListener(function (info, tab) {
    // const dict = info.selectionText;
    if (info.menuItemId === "addToContent") {
        const selectedText = info.selectionText;
        chrome.storage.local.get(["dict1"], function (result) {
            console.log(result)
            const existingContent = result.dict1 || "";
            const updatedContent = existingContent + selectedText;
            chrome.storage.local.set({ dict1: updatedContent }, function () {
                console.log("Content updated:", updatedContent);
            });
        });
    }
    else {
        // chrome.storage.sync.set
        chrome.storage.local.set({ dict1: info.selectionText }, function () {
            chrome.windows.create({
                url: "popup.html",
                type: "popup",
                width: 400,
                height: 600
            }, function (popupWindow) {
                chrome.tabs.query({ active: true, windowId: popupWindow.id }, function (tabs) {
                    const tabId = tabs[0].id;
                    chrome.tabs.sendMessage(tabId, { type: "lookup" });
                });
            });
        });
    }
});
// chrome.runtime.onInstalled.addListener(function () {
//     chrome.contextMenus.create({
//         title: "Add to Content",
//         contexts: ["selection"],
//         id: "addToContent"
//     });
// });

// chrome.contextMenus.onClicked.addListener(function (info) {
//     if (info.menuItemId === "addToContent") {
//         const selectedText = info.selectionText;
//         chrome.storage.local.get(["dict1"], function (result) {
//             const existingContent = result.content || "";
//             const updatedContent = existingContent + selectedText;
//             chrome.storage.local.set({ content: updatedContent }, function () {
//                 console.log("Content updated:", updatedContent);
//             });
//         });
//     }
// });

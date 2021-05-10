export function get_Search_Results(textSearch, query, inputShortcut, selectedProgram, tabsValue) {
    return fetch("api/getSearchResults", {
            method: "POST",
            cache: "no-cache",
            headers: {
                "content_type": "application/json",
            },
            body: JSON.stringify({
                textSearch: textSearch,
                query: query,
                inputShortcut: inputShortcut,
                selectedProgram: selectedProgram,
                tabsValue: tabsValue,
            })
        }
    ).then(res => res.json())
}
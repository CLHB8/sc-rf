export function get_Search_Results(textSearch, query, inputShortcut, selectedProgram, tabsValue) {
    return fetch("api/getSearchResults", {
            method: "POST",
            cache: "no-cache",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'dataType': 'json'
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
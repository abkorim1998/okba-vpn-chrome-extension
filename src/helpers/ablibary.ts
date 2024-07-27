//https://freeproxylists.net/?c=&pt=&pr=&a%5B%5D=0&a%5B%5D=1&a%5B%5D=2&u=0
// get table data from freeproxylists.net by table selector return as array
// load full page and get table data
//-----------------------------------------------------
export async function getTableData({url, tableSelector, fromRow = 1}:{ url: string, tableSelector: string, fromRow: number}) {
    var response = await fetch(url, {
        mode: 'no-cors'
    });
    var k = await response.text();
    var html = new DOMParser().parseFromString(k, "text/html");
    var table = html.querySelector(tableSelector) as HTMLElement;
    var tableData = [];
    var tableRows = table.querySelectorAll("tr");
    for (var i = fromRow; i < tableRows.length; i++) {
        var tableRow = tableRows[i];
        var tableCells = tableRow.querySelectorAll("td");
        var tableRowData = [];
        for (var j = 0; j < tableCells.length; j++) {
            var tableCell = tableCells[j];
            var tableCellData = tableCell.innerText;
            tableRowData.push(tableCellData);
        }
        tableData.push(tableRowData);
    }
    return tableData;
}
const api_base_url = "https://api.twelvedata.com";
const apiKey = "56d9349ae7f748b6851fe79270ca2a4b";
const symbols = ["GME", "MSFT", "DIS", "BNTX"];

async function getStocksFromApi() {
    try {
        const response = await fetch(
            `${api_base_url}/time_series?symbol=${symbols.join(
                ","
            )}&interval=1day&apikey=${apiKey}`
        );
        const data = await response.json();
        return symbols.map((symbol) => data[symbol]);
    } catch (error) {
        console.error("Error getting stocks from API", error);
    }
}

function getColor(stock) {
    const colorMap = {
        GME: "rgba(61, 161, 61, 0.7)",
        MSFT: "rgba(209, 4, 25, 0.7)",
        DIS: "rgba(18, 4, 209, 0.7)",
        BNTX: "rgba(166, 43, 158, 0.7)",
    };
    return colorMap[stock];
}
async function main() {
    const response = await fetch(
        `https://api.twelvedata.com/time_series?symbol=GME,MSFT,DIS,BNTX&interval=1day&apikey=56d9349ae7f748b6851fe79270ca2a4b`
    )

    const result = await response.json()

    const { GME, MSFT, DIS, BNTX } = result

    const stocks = [GME, MSFT, DIS, BNTX]

    stocks.forEach((stock) => stock.values.reverse())

    const timeChartCanvas = document.querySelector("#time-chart")
    //Start coding the first chart here since it references the canvas on line 3
    new Chart(timeChartCanvas.getContext("2d"), {
        type: "line",
        data: {
            labels: stocks[0].values.map((value) => value.datetime),
            datasets: stocks.map((stock) => ({
                label: stock.meta.symbol,
                backgroundColor: getColor(stock.meta.symbol),
                borderColor: getColor(stock.meta.symbol),
                data: stock.values.map((value) => parseFloat(value.high)),
            })),
        },
    });

    const highestPriceChartCanvas = document.querySelector(
        "#highest-price-chart"
    );
    //build your second chart
    new Chart(highestPriceChartCanvas.getContext("2d"), {
        type: "bar",
        data: {
            labels: stocks.map((stock) => stock.meta.symbol),
            datasets: [
                {
                    label: "Highest",
                    backgroundColor: stocks.map((stock) => getColor(stock.meta.symbol)),
                    borderColor: stocks.map((stock) => getColor(stock.meta.symbol)),
                    data: stocks.map((stock) => findHighest(stock.values)),
                },
            ],
        },
    });

    const averagePriceChartCanvas = document.querySelector(
        "#average-price-chart"
    );
    //this is the bonus you don't have to do it
    new Chart(averagePriceChartCanvas.getContext("2d"), {
        type: "pie",
        data: {
            labels: stocks.map((stock) => stock.meta.symbol),
            datasets: [
                {
                    label: "Average",
                    backgroundColor: stocks.map((stock) => getColor(stock.meta.symbol)),
                    borderColor: stocks.map((stock) => getColor(stock.meta.symbol)),
                    data: stocks.map((stock) => calculateAverage(stock.values)),
                },
            ],
        },
    });
}
function findHighest(values) {
    let highest = 0;
    values.forEach((value) => {
        if (parseFloat(value.high) > highest) {
            highest = value.high;
        }
    });
    return highest;
}

function calculateAverage(values) {
    let total = 0;
    values.forEach((value) => {
        total += parseFloat(value.high);
    });
    return total / values.length;
}

getStocksFromApi();
main();

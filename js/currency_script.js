const apiKey = '15a9188eb1348918502667ab';
const apiUrlLatest = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/`;
const apiUrlCodes = `https://v6.exchangerate-api.com/v6/${apiKey}/codes/`;

let exchangeRates = {};
let popularRates = {};
let availableCodes = {};
const amountInput = document.getElementById('amount');
const fromCurrencySelect = document.getElementById('fromCurrency');
const toCurrencySelect = document.getElementById('toCurrency');
const resultInput = document.getElementById('result');

amountInput.addEventListener('input', convertCurrency);
fromCurrencySelect.addEventListener('change', convertCurrency);
toCurrencySelect.addEventListener('change', convertCurrency);

/********************
    ERROR HANDLING
 ********************/

function showError(message) {
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.innerText = message;
    errorMessage.style.display = 'block';
}
function hideError() {
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.style.display = 'none';
}

/*****************
    AT APP LOAD
 *****************/
window.onload = async function() {
    const lastFetch = parseInt(localStorage.getItem('lastFetch'), 10);
    const isFreshData = Date.now() - lastFetch < 30 * 24 * 60 * 60 * 1000;

    if (navigator.onLine) {
        await fetchCurrencyData();
        await fetchFullCurrencyName();
    } else {
        if (isFreshData) {
            showError("You are offline. Unable to fetch currency data. Using cached data no older than 30 days");
            loadCachedData();
        } else {
            showError("You are offline. Unable to fetch currency data. Using cached data older than 30 days");
            loadCachedData();
        }
    }
    loadRates();
}

/*****************
    FETCH DATA
 *****************/

async function fetchCurrencyData() {
    await fetch (`${apiUrlLatest}RON`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data && data.conversion_rates) {
                exchangeRates = data.conversion_rates;
                popularRates = data.conversion_rates;
                localStorage.setItem('exchangeRates', JSON.stringify(exchangeRates));
                localStorage.setItem('lastFetch', Date.now().toString());
            } else {
                showError("Unexpected API response format.");
            }
        })
        .catch(error => {
            showError("Failed to fetch data. Using cached data if available.");
            console.error("Fetch error:", error);
            loadCachedData();
        });
        popularRates[0] = exchangeRates.EUR;
        popularRates[1] = exchangeRates.USD;
        popularRates[2] = exchangeRates.GBP;
        popularRates[3] = exchangeRates.CHF;
        popularRates[4] = exchangeRates.INR;
}

function loadCachedData() {
    const cachedRates = JSON.parse(localStorage.getItem('exchangeRates'));
    if (cachedRates) {
        exchangeRates = cachedRates;
        populateCurrencyOptions(Object.keys(exchangeRates));
    } else {
        showError("No cached data available. Please connect to the internet.");
    }
}

function populateCurrencyOptions(currencies) {
    const fromCurrency = document.getElementById('fromCurrency');
    const toCurrency = document.getElementById('toCurrency');
    fromCurrency.innerHTML = '';
    toCurrency.innerHTML = '';

    currencies.forEach(currency => {
        const option1 = document.createElement('option');
        option1.value = currency;
        option1.text = currency;

        const option2 = document.createElement('option');
        option2.value = currency;
        option2.text = currency;

        fromCurrency.appendChild(option1);
        toCurrency.appendChild(option2);
    });
}

function fetchFullCurrencyName() {
    fetch (`${apiUrlCodes}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data) {
                availableCodes = data.supported_codes;
                populateFullCurrencyName(availableCodes);
                localStorage.setItem('availableCodes', JSON.stringify(availableCodes));
            } else {
                showError("Unexpected API response format.");
            }
        })
        .catch(error => {
            showError("Failed to fetch data. Using cached data if available.");
            loadCachedData();
        });
}

function populateFullCurrencyName(availableCodes) {
    const fromCurrency = document.getElementById('fromCurrency');
    const toCurrency = document.getElementById('toCurrency');
    fromCurrency.innerHTML = '';
    toCurrency.innerHTML = '';

    availableCodes.forEach(availableCode => {
        const option1 = document.createElement('option');
        option1.value = availableCode[1];
        option1.text = availableCode[1];

        const option2 = document.createElement('option');
        option2.value = availableCode[1];
        option2.text = availableCode[1];

        fromCurrency.appendChild(option1);
        toCurrency.appendChild(option2);
    });
}

/*********************
    DATA VALIDATION
 *********************/

document.getElementById('amount').addEventListener('keypress', function(event) {
    const charCode = event.key.charCodeAt(0);
    const inputValue = this.value;

    if (!((charCode >= 48 && charCode <= 57) || charCode === 46)) {
        event.preventDefault();
        showError("⚠ VALUE TOO LOW! Only positive numbers!");
    } else {
        if (charCode === 46 && inputValue.includes('.')) {
            event.preventDefault();
            showError("⚠ VALUE TOO LOW! Only positive numbers!");
        } else if (inputValue.includes('.')) {
            const decimalPart = inputValue.split('.')[1];
            if (decimalPart && decimalPart.length >= 2) {
                event.preventDefault();
                showError("⚠ VALUE TOO LOW! Only positive numbers!");
            } else {
                hideError();
            }
        } else {
            hideError();
        }
    }
});

/*****************
    CONVERSIONS
 *****************/

function convertCurrency() {
    const amount = parseFloat(amountInput.value);
    const fromCurrency = fromCurrencySelect.value;
    const toCurrency = toCurrencySelect.value;
    let fromCurrencySanitized;
    let toCurrencySanitized;

    availableCodes.forEach(availableCode => {
        if (fromCurrency == availableCode [1]){
            fromCurrencySanitized = availableCode [0];
        }
        if (toCurrency == availableCode [1]){
            toCurrencySanitized = availableCode [0];
        }
    });

    if (amount > 0 && exchangeRates[fromCurrencySanitized] && exchangeRates[toCurrencySanitized]) {
        const convertedAmount = (amount / exchangeRates[fromCurrencySanitized]) * exchangeRates[toCurrencySanitized];
        resultInput.value = convertedAmount.toFixed(2);
        document.getElementById('copy').style.display = 'block';
    } else if (amount == 0 || isNaN(amount)){
        hideError();
    } else {
        showError("Invalid amount or currencies.");
    }
}

/*****************
    COPY RESULT
 *****************/

    function copyResult() {
        const resultInput = document.getElementById('result');
        const from = document.getElementById('fromCurrency');
        let textToCopy = resultInput.value;

        if (!textToCopy || textToCopy === '' || textToCopy === '0') {
            showError("⚠ NOTHING TO COPY");
            setTimeout(() => {
                hideError();
            }, 2000);
            return;
        }
        textToCopy = resultInput.value + " " + from.value;

        const tempTextArea = document.createElement('textarea');
        tempTextArea.value = textToCopy.trim();

        document.body.appendChild(tempTextArea);
        tempTextArea.select();
        document.execCommand('copy');
        document.body.removeChild(tempTextArea);

        showError("Copied to clipboard!");
        setTimeout(() => {
            hideError();
        }, 2000);
    }

/*****************
    SWAP CURRENCY
 *****************/

function swapCurrencies() {
    const fromCurrencyDropdown = document.getElementById('fromCurrency');
    const toCurrencyDropdown = document.getElementById('toCurrency');

    const temp = fromCurrencyDropdown.value;
    fromCurrencyDropdown.value = toCurrencyDropdown.value;
    toCurrencyDropdown.value = temp;

    convertCurrency();
}

/*****************
    RESET FIELDS
 *****************/

function resetFields() {
    document.getElementById('amount').value = "Enter amount to convert";
    document.getElementById('result').value = "Here come's the answer";
    document.getElementById('fromCurrency').value = 'Romanian Leu';
    document.getElementById('toCurrency').value = 'Romanian Leu';
    document.getElementById('copy').style.display = 'none';
}

async function loadRates() {
    try {
        const response = await fetch('currency.json');
        const rates = await response.json();
        const ratesContainer = document.querySelector('.currency-cards-container');
        let ct = 0;

        ratesContainer.innerHTML = '';

        rates.forEach(rate => {
            const rateCard = `
                <div class="currency-card">
                    <img src="${rate.flag}" alt="Country Flag" class="flag-icon">
                    <div class="currency-info">
                        <p class="currency-title">${rate.currencies}</p>
                        <p class="exchange-rate">${popularRates[ct].toFixed(3)}</p>
                    </div>
                </div>
                `;
            ratesContainer.innerHTML += rateCard;
            ct++;
        });
    } catch (error) {
        console.error('Eroare la încărcarea datelor .json:', error);
    }
}

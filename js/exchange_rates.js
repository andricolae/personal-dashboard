async function loadProjects() {
    try {
        const response = await fetch('currency.json');
        const rates = await response.json();

        const ratesContainer = document.querySelector('.currency-cards-container');

        ratesContainer.innerHTML = '';

        rates.forEach(rate => {
            const rateCard = `
                <div class="currency-card">
                    <img src="${rate.flag}" alt="Country Flag" class="flag-icon">
                    <div class="currency-info">
                        <p class="currency-title">${rate.currencies}</p>
                        <p class="exchange-rate">${rate.rate}</p>
                    </div>
                </div>
                `;
            ratesContainer.innerHTML += rateCard;
        });
    } catch (error) {
        console.error('Eroare la încărcarea datelor .json:', error);
    }
}
window.onload = loadProjects;

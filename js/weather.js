cityInputField = document.getElementById("city-input");

cityInputField.addEventListener("input", function (e) {
    this.value = this.value.replace(/[^A-Za-z\s]/g, "");
});
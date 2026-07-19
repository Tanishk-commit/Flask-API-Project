function diagnose() {
    let checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
    let symptoms = [];

    checkboxes.forEach(cb => {
        if (!cb.disabled) {
            symptoms.push(cb.value);
        }
    });

    fetch("/diagnose", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ symptoms: symptoms })
    })
    .then(res => res.json())
    .then(data => {
        if (data.disease.length > 0) {
            document.getElementById("result").innerHTML =
                "<b style='color:red; font-size:40px'>" + data.disease.join(", ") + "</b>";
        } else {
            document.getElementById("result").innerHTML =
                "<b style='color:red;'>No disease matched</b>";
        }
    });
}
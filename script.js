function login() {
    window.location.href = "home.html";
}

function logout() {
    window.location.href = "index.html";
}


function redirectToTemplate() {
    const brandName = document.getElementById("brandName").value;
    if (brandName.trim() === "") {
        alert("Please enter a brand name before proceeding.");
        return;
    }
    localStorage.setItem("brandName", brandName);
    window.location.href = "template.html"; // Redirects to template selection page
}

let selectedTemplate = null;

function selectTemplate(template) {
    selectedTemplate = template;
    localStorage.setItem("selectedTemplate", template);
    
    // Optional: Highlight the selected template visually
    document.querySelectorAll(".template").forEach((el) => el.classList.remove("selected"));
    document.getElementById(template).classList.add("selected");
}

function proceedToForm() {
    if (!selectedTemplate) {
        alert("Please select a template before proceeding.");
        return;
    }
    window.location.href = "form.html";
}
function addRow() {
    const table = document.getElementById("nutrientTable");
    const row = table.insertRow(-1);
    row.innerHTML = `
        <td><input type="text" name="nutrient"></td>
        <td><input type="text" name="amount"></td>
        <td><input type="text" name="daily"></td>
        <td><button type="button" onclick="removeRow(this)">Remove</button></td>
    `;
}

function removeRow(button) {
    const row = button.parentElement.parentElement;
    row.parentElement.removeChild(row);
}


function downloadLabel(format) {
    const labelElement = document.getElementById("label");
    if (!labelElement) {
        alert("Label preview is missing. Please generate the label first.");
        return;
    }

    html2canvas(labelElement).then((canvas) => {
        const imageData = canvas.toDataURL("image/png");
        const link = document.createElement("a");

        if (format === "png") {
            link.href = imageData;
            link.download = "label.png";
        } else if (format === "pdf") {
            const pdf = new jsPDF();
            pdf.addImage(imageData, "PNG", 10, 10, 190, 100);
            link.href = pdf.output("bloburl");
            link.download = "label.pdf";
        } else {
            alert("Unsupported format");
            return;
        }

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
}
function submitProduct() {
    // Gather product data from the form or inputs
    const productData = {
        product_name: document.getElementById('productName').value,
        ingredients: document.getElementById('ingredients').value.split(',').map(item => item.trim()), // Convert comma-separated string to array
        dosage: document.getElementById('dosage').value,
        expiry_date: document.getElementById('expiryDate').value
    };

    // Send POST request to Flask backend
    fetch('http://127.0.0.1:5000/submit-product', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(productData) // Convert data to JSON
    })
    .then(response => response.json()) // Parse JSON response
    .then(result => {
        if (result.message) {
            console.log('Success:', result.message);
            console.log('Product Data:', result.product_data);
            alert('Product processed successfully! Check the console for details.');
        } else {
            console.error('Error:', result.error || result.message);
            alert('Failed to process product. Check the console for details.');
        }
    })
    .catch(error => {
        console.error('Network error:', error);
        alert('Network error. Please try again.');
    });
}

// ✅ Add event listener for "Proceed" button in form.html
document.addEventListener('DOMContentLoaded', () => {
    const proceedButton = document.getElementById('proceedButton');
    if (proceedButton) {
        proceedButton.addEventListener('click', submitProduct);
    }
});
//login-form
document.getElementById("login-form").addEventListener("submit", function(e){
    e.preventDefault();
    const formData = new FormData(e.target);
    const formObj = {};
    formData.forEach((value, key) => formObj[key] = value);
    console.log(formObj);
    // Add your AJAX request here
    // Example:
    // fetch('/login', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify(formObj)
    // })
    //    .then(response => response.json())
    //    .then(data => console.log(data));
    
});
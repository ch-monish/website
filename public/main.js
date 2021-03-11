

function getInfo() {
    console.log("function")
    var username = document.getElementById("username").value
    var password = document.getElementById("password").value


    if (username == "" || password == "") {
        alert("Incorrect Username or Password")
    }
    else {

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({ "username": username, "password": password });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow',

        };

        fetch("http://localhost:3000/", requestOptions)
            .then(response => response.text())
            .then(result => {
                console.log(result);
                var res = JSON.parse(result)
                if (res.message == "login successful")
                    location.replace("Dashboard.html")
                if (res.message == "Incorrect credentials") {
                    alert("Incorrect credentials")
                    location.reload()
                }
            })
            .catch(error => console.log('error', error));



    }
}
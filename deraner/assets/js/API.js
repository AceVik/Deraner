class API {
    login(mail, pass) {
        let data = new FormData();

        data.append('_username', mail);
        data.append('_password', pass);

        axios.post('#route:security_login', data).then(response => {
            console.log(response);
        }).catch(error => {
            console.error(error);
        });
    }
}
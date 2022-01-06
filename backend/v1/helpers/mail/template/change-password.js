const ChangePasswordTemplate = ({ firstName, url }) => {
    console.log(url);
    console.log(firstName);
    let html = 
    `
        <html>
            <body style="background-color:#e2e1e0;font-family: Open Sans, sans-serif;font-size:100%;font-weight:400;line-height:1.4;color:#000;">
                <h1> Hello ${firstName.charAt(0).toUpperCase() + firstName.slice(1) } </h1>
                <h2>Change the password by using the following url :</h2>
                <br/>
                <a href="${url}">change-password</a>
                <p> Thank you for being with us. </p>
            </body>

        </html>
    `

    return html;
}

module.exports = ChangePasswordTemplate;
const app = require('express')(),
    bodyParser = require('body-parser'),
    dir = __dirname,
    port = process.env.PORT || 5555,
    host = '0.0.0.0',
    payU = require('payumoney-node'),
    swig = require('swig-templates');

// keys
const merchantKey = 'BA6ZPUkx',
    merchantSalt = 'sHn0c2B0BB',
    authHeader = 'OikOv5L9iLsvv8vHF/OgR116e6pN89JNEJe9hO96Rk0=';

// auths

var paymentData = {
    productinfo: "",
    txnid: "",
    amount: "",
    email: "",
    phone: "",
    lastname: "",
    firstname: "",
    surl: "http://localhost:5555/payu/success", //""
    furl: "http://localhost:5555/payu/fail", //""
};

   console.log(dir);

app.get('/', (req, res) => {
    res.sendFile(dir + '/index.html')
});

app.get('/receive', (req, res) => {
    let amt = req.query.amount;
    console.warn('amount received is '+ amt);
    payU.setKeys(merchantKey, merchantSalt, authHeader);
    payU.isProdMode(false);
    paymentData.productinfo = "test cases";
    paymentData.txnid = '988898aa';
    paymentData.amount = amt;
    paymentData.email = 'false@false.mail';
    paymentData.phone = '7978672907';
    paymentData.lastname = "singh";
    paymentData.firstname = "hsingh";

    payU.makePayment(paymentData, (e, resp) => {
        if(e) throw e;
        else {
            console.warn("succes with "+resp);
            setTimeout(() => {
                getStatus()
            }, 2000);
        }
    });
    res.send("thanks");
})

function getStatus() {
    payU.paymentResponse(paymentData.txnid, (e, rep) => {
        if(e) throw e
        else {
            console.warn("payment status : "+rep);
        }
    })
}



const server = app.listen(port, host, (e) => {
    if(e) throw e;
    else {
        console.warn('serving at '+ server.address().address + '  '+server.address().port);
    }
});
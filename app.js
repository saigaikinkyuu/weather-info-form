// app.js

// Quagga.jsの設定
Quagga.init({
    inputStream: {
        name: "Live",
        type: "LiveStream",
        target: document.querySelector("#interactive"),
    },
    decoder: {
        readers: ["ean_reader", "code_128_reader"],
    },
}, function (err) {
    if (err) {
        console.error(err);
        return;
    }
    console.log("Quagga.js initialized");

    // カメラからのバーコード読み取り開始
    Quagga.start();
});

// バーコードが読み取られたときの処理
Quagga.onDetected(function (result) {
    var code = result.codeResult.code;

    // 読み取ったバーコードを表示
    document.getElementById("result").textContent = "バーコード: " + code;

    // フォームにバーコードを自動入力
    document.getElementById("barcodeInput").value = code;
});

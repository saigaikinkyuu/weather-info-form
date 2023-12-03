// app.js
document.addEventListener("DOMContentLoaded", function () {
    const video = document.getElementById('video');
    const barcodeResultInput = document.getElementById('barcodeResult');
    const barcodeForm = document.getElementById('barcodeForm');

    // カメラにアクセスする
    navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
            video.srcObject = stream;

            // バーコードリーダーライブラリの初期化
            const codeReader = new ZXing.BrowserMultiFormatReader();
            
            // バーコードが読み取られたときの処理
            codeReader.decodeFromVideoDevice(undefined, video, (result, err) => {
                if (result) {
                    // 読み取ったバーコードの値をテキストボックスに表示
                    barcodeResultInput.value = result.text;
                }
                if (err) {
                    console.error(err);
                }
            });

        })
        .catch((error) => {
            console.error("Error accessing camera:", error);
        });

    // フォームが送信されたときの処理
    barcodeForm.addEventListener('submit', function (event) {
        event.preventDefault();
        // バーコードの値をフォームの処理に渡すなど、必要な処理を追加
        alert('Barcode value submitted: ' + barcodeResultInput.value);
    });
});

document.addEventListener('DOMContentLoaded', (event) => {
    const barcodeForm = document.getElementById('barcodeForm');
    const barcodeInput = document.getElementById('barcodeInput');

    // カメラからバーコードを読み取る関数
    function startBarcodeScanner() {
        const constraints = { video: true };

        navigator.mediaDevices.getUserMedia(constraints)
            .then((stream) => {
                const video = document.createElement('video');
                document.body.appendChild(video);
                video.srcObject = stream;
                video.play();

                // バーコードリーダーライブラリの初期化
                const barcodeReader = new ZXing.BrowserMultiFormatReader();

                // カメラからのフレームを処理するコールバック
                function onFrameCallback(video, barcodeReader, barcodeInput) {
                    const canvas = document.createElement('canvas');
                    const context = canvas.getContext('2d');
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;
                    context.drawImage(video, 0, 0, canvas.width, canvas.height);

                    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
                    const barcodeResult = barcodeReader.decodeFromImage(imageData);

                    if (barcodeResult) {
                        barcodeInput.value = barcodeResult.text;
                        stopBarcodeScanner(stream, video);
                    } else {
                        requestAnimationFrame(() => onFrameCallback(video, barcodeReader, barcodeInput));
                    }
                }

                // バーコードスキャナーの開始
                onFrameCallback(video, barcodeReader, barcodeInput);
            })
            .catch((error) => {
                console.error('Error accessing the camera:', error);
            });
    }

    // カメラアクセスの権限を確認してからスキャナーを開始
    navigator.permissions.query({ name: 'camera' })
        .then((permissionStatus) => {
            if (permissionStatus.state === 'granted') {
                startBarcodeScanner();
            } else {
                console.warn('Camera access permission is not granted.');
            }
        });
});

// カメラとビデオ要素を停止
function stopBarcodeScanner(stream, video) {
    if (video.srcObject) {
        const tracks = video.srcObject.getTracks();
        tracks.forEach(track => track.stop());
    }

    document.body.removeChild(video);
}

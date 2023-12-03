document.addEventListener('DOMContentLoaded', (event) => {
    const qrCodeForm = document.getElementById('qrCodeForm');
    const qrCodeInput = document.getElementById('qrCodeInput');

    // カメラからQRコードを読み取る関数
    function startQRCodeScanner() {
        const scanner = new Instascan.Scanner({ video: document.getElementById('preview') });

        scanner.addListener('scan', function (content) {
            qrCodeInput.value = content;
            stopQRCodeScanner(scanner);
        });

        Instascan.Camera.getCameras().then(function (cameras) {
            if (cameras.length > 0) {
                scanner.start(cameras[0]);
            } else {
                console.error('No cameras found.');
            }
        }).catch(function (error) {
            console.error('Error accessing the camera:', error);
        });
    }

    // カメラとスキャナーを停止
    function stopQRCodeScanner(scanner) {
        scanner.stop();
    }

    // QRコードスキャナーの開始
    startQRCodeScanner();
});

document.addEventListener('DOMContentLoaded', (event) => {
    const qrCodeForm = document.getElementById('qrCodeForm');
    const qrCodeInput = document.getElementById('qrCodeInput');

    // カメラからQRコードを読み取る関数
    function startQRCodeScanner() {
        const video = document.createElement('video');
        document.body.appendChild(video);

        navigator.mediaDevices.getUserMedia({ video: true })
            .then((stream) => {
                video.srcObject = stream;
                video.play();

                // カメラのメタデータが読み込まれた後にcanvasを生成
                video.addEventListener('loadedmetadata', () => {
                    const canvasElement = document.createElement('canvas');
                    const canvas = canvasElement.getContext('2d');
                    canvasElement.width = video.videoWidth;
                    canvasElement.height = video.videoHeight;

                    document.body.appendChild(canvasElement);

                    requestAnimationFrame(tick);

                    function tick() {
                        canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
                        const imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);
                        const code = jsQR(imageData.data, imageData.width, imageData.height);

                        if (code) {
                            qrCodeInput.value = code.data;
                            stopQRCodeScanner(stream, video, canvasElement);
                        } else {
                            requestAnimationFrame(tick);
                        }
                    }
                });
            })
            .catch((error) => {
                console.error('Error accessing the camera:', error);
            });
    }

    // カメラとビデオ要素を停止
    function stopQRCodeScanner(stream, video, canvasElement) {
        if (video.srcObject) {
            const tracks = video.srcObject.getTracks();
            tracks.forEach(track => track.stop());
        }

        document.body.removeChild(video);
        document.body.removeChild(canvasElement);
    }

    // QRコードスキャナーの開始
    startQRCodeScanner();
});

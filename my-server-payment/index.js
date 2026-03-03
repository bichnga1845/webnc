const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
const https = require('https');

const app = express();
const PORT = 3003;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MoMo Configuration (Test Environment)
const MOMO_CONFIG = {
    partnerCode: 'MOMO',
    accessKey: 'F8BBA842ECF85',
    secretKey: 'K951B6PE1waDMi640xX08PD3vg6EkVlz',
    endpoint: 'https://test-payment.momo.vn/v2/gateway/api/create',
    redirectUrl: 'http://localhost:3003/api/payment/return',
    ipnUrl: 'http://localhost:3003/api/payment/ipn'
};

// In-memory storage (trong thực tế nên dùng database)
const payments = new Map();

/**
 * Tạo chữ ký HMAC SHA256
 */
function createSignature(rawSignature, secretKey) {
    return crypto
        .createHmac('sha256', secretKey)
        .update(rawSignature)
        .digest('hex');
}

/**
 * API: Tạo payment request
 * POST /api/payment/create
 */
app.post('/api/payment/create', async (req, res) => {
    try {
        const { amount, orderInfo, extraData } = req.body;

        // Validate input
        if (!amount || !orderInfo) {
            return res.status(400).json({
                success: false,
                message: 'Thiếu thông tin bắt buộc: amount, orderInfo'
            });
        }

        // Generate unique IDs
        const orderId = uuidv4();
        const requestId = uuidv4();
        const requestType = 'payWithMethod';

        // Tạo raw signature
        const rawSignature = 
            'accessKey=' + MOMO_CONFIG.accessKey +
            '&amount=' + amount +
            '&extraData=' + (extraData || '') +
            '&ipnUrl=' + MOMO_CONFIG.ipnUrl +
            '&orderId=' + orderId +
            '&orderInfo=' + orderInfo +
            '&partnerCode=' + MOMO_CONFIG.partnerCode +
            '&redirectUrl=' + MOMO_CONFIG.redirectUrl +
            '&requestId=' + requestId +
            '&requestType=' + requestType;

        console.log('🔐 Raw Signature:', rawSignature);

        // Tạo signature
        const signature = createSignature(rawSignature, MOMO_CONFIG.secretKey);
        console.log('✅ Signature:', signature);

        // Tạo request body gửi đến MoMo
        const requestBody = JSON.stringify({
            partnerCode: MOMO_CONFIG.partnerCode,
            partnerName: 'Test Merchant',
            storeId: 'TestStore',
            requestId: requestId,
            amount: amount,
            orderId: orderId,
            orderInfo: orderInfo,
            redirectUrl: MOMO_CONFIG.redirectUrl,
            ipnUrl: MOMO_CONFIG.ipnUrl,
            lang: 'vi',
            requestType: requestType,
            autoCapture: true,
            extraData: extraData || '',
            orderGroupId: '',
            signature: signature
        });

        console.log('📤 Request to MoMo:', requestBody);

        // Gửi request đến MoMo
        const options = {
            hostname: 'test-payment.momo.vn',
            port: 443,
            path: '/v2/gateway/api/create',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(requestBody)
            }
        };

        const momoRequest = https.request(options, (momoRes) => {
            let data = '';

            momoRes.on('data', (chunk) => {
                data += chunk;
            });

            momoRes.on('end', () => {
                console.log('📥 Response from MoMo:', data);
                const response = JSON.parse(data);

                if (response.resultCode === 0) {
                    // Lưu thông tin payment
                    payments.set(orderId, {
                        orderId,
                        requestId,
                        amount,
                        orderInfo,
                        status: 'pending',
                        createdAt: new Date(),
                        momoResponse: response
                    });

                    res.json({
                        success: true,
                        payUrl: response.payUrl,
                        orderId: orderId,
                        message: 'Tạo link thanh toán thành công'
                    });
                } else {
                    res.status(400).json({
                        success: false,
                        message: response.message || 'Lỗi khi tạo thanh toán',
                        resultCode: response.resultCode
                    });
                }
            });
        });

        momoRequest.on('error', (error) => {
            console.error('❌ Error calling MoMo API:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi kết nối đến MoMo',
                error: error.message
            });
        });

        momoRequest.write(requestBody);
        momoRequest.end();

    } catch (error) {
        console.error('❌ Error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server',
            error: error.message
        });
    }
});

/**
 * API: Xử lý redirect từ MoMo (sau khi user thanh toán)
 * GET /api/payment/return
 */
app.get('/api/payment/return', (req, res) => {
    console.log('🔙 Payment return callback:', req.query);

    const {
        partnerCode,
        orderId,
        requestId,
        amount,
        orderInfo,
        orderType,
        transId,
        resultCode,
        message,
        payType,
        responseTime,
        extraData,
        signature
    } = req.query;

    // Verify signature
    const rawSignature = 
        'accessKey=' + MOMO_CONFIG.accessKey +
        '&amount=' + amount +
        '&extraData=' + (extraData || '') +
        '&message=' + message +
        '&orderId=' + orderId +
        '&orderInfo=' + orderInfo +
        '&orderType=' + orderType +
        '&partnerCode=' + partnerCode +
        '&payType=' + payType +
        '&requestId=' + requestId +
        '&responseTime=' + responseTime +
        '&resultCode=' + resultCode +
        '&transId=' + transId;

    const calculatedSignature = createSignature(rawSignature, MOMO_CONFIG.secretKey);

    if (signature !== calculatedSignature) {
        console.error('⚠️ Invalid signature!');
    }

    // Update payment status
    if (payments.has(orderId)) {
        const payment = payments.get(orderId);
        payment.status = resultCode === '0' ? 'success' : 'failed';
        payment.transId = transId;
        payment.resultCode = resultCode;
        payment.message = message;
        payments.set(orderId, payment);
        console.log('✅ Payment updated:', payment);
    }

    // Redirect to frontend with result
    const redirectUrl = `http://localhost:4200/momo-payment/result?` +
        `orderId=${orderId}&` +
        `resultCode=${resultCode}&` +
        `message=${encodeURIComponent(message)}&` +
        `amount=${amount}&` +
        `transId=${transId}`;

    res.redirect(redirectUrl);
});

/**
 * API: IPN callback từ MoMo (thông báo kết quả)
 * POST /api/payment/ipn
 */
app.post('/api/payment/ipn', (req, res) => {
    console.log('📬 IPN callback:', req.body);

    const {
        partnerCode,
        orderId,
        requestId,
        amount,
        orderInfo,
        orderType,
        transId,
        resultCode,
        message,
        payType,
        responseTime,
        extraData,
        signature
    } = req.body;

    // Verify signature
    const rawSignature = 
        'accessKey=' + MOMO_CONFIG.accessKey +
        '&amount=' + amount +
        '&extraData=' + (extraData || '') +
        '&message=' + message +
        '&orderId=' + orderId +
        '&orderInfo=' + orderInfo +
        '&orderType=' + orderType +
        '&partnerCode=' + partnerCode +
        '&payType=' + payType +
        '&requestId=' + requestId +
        '&responseTime=' + responseTime +
        '&resultCode=' + resultCode +
        '&transId=' + transId;

    const calculatedSignature = createSignature(rawSignature, MOMO_CONFIG.secretKey);

    if (signature === calculatedSignature) {
        // Signature hợp lệ
        if (payments.has(orderId)) {
            const payment = payments.get(orderId);
            payment.status = resultCode === 0 ? 'success' : 'failed';
            payment.transId = transId;
            payment.resultCode = resultCode;
            payment.message = message;
            payment.verifiedAt = new Date();
            payments.set(orderId, payment);

            console.log('✅ Payment verified via IPN:', payment);
        }

        // Trả về 204 No Content để MoMo biết đã nhận được
        res.status(204).end();
    } else {
        // Signature không hợp lệ
        console.error('❌ Invalid signature from MoMo IPN');
        res.status(400).json({
            success: false,
            message: 'Invalid signature'
        });
    }
});

/**
 * API: Query payment status
 * GET /api/payment/status/:orderId
 */
app.get('/api/payment/status/:orderId', (req, res) => {
    const { orderId } = req.params;

    if (payments.has(orderId)) {
        const payment = payments.get(orderId);
        res.json({
            success: true,
            payment: payment
        });
    } else {
        res.status(404).json({
            success: false,
            message: 'Không tìm thấy đơn hàng'
        });
    }
});

/**
 * API: Get all payments (for testing)
 * GET /api/payments
 */
app.get('/api/payments', (req, res) => {
    const allPayments = Array.from(payments.values());
    res.json({
        success: true,
        total: allPayments.length,
        payments: allPayments
    });
});

// Home page
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>MoMo Payment Server</title>
            <style>
                body { font-family: Arial; padding: 40px; background: #f5f5f5; }
                .container { background: white; padding: 30px; border-radius: 10px; max-width: 800px; margin: 0 auto; }
                h1 { color: #d82d8b; }
                code { background: #f4f4f4; padding: 2px 6px; border-radius: 3px; }
                pre { background: #2d2d2d; color: #f8f8f8; padding: 15px; border-radius: 5px; overflow-x: auto; }
                .api-list { background: #f9f9f9; padding: 15px; border-left: 4px solid #d82d8b; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>🚀 MoMo Payment Integration Server</h1>
                <p>Server đang chạy trên port <strong>${PORT}</strong></p>
                
                <h2>📡 Available APIs:</h2>
                <div class="api-list">
                    <ul>
                        <li><code>POST /api/payment/create</code> - Tạo payment request</li>
                        <li><code>GET /api/payment/return</code> - Return URL từ MoMo</li>
                        <li><code>POST /api/payment/ipn</code> - IPN callback từ MoMo</li>
                        <li><code>GET /api/payment/status/:orderId</code> - Kiểm tra trạng thái</li>
                        <li><code>GET /api/payments</code> - Danh sách tất cả payments</li>
                    </ul>
                </div>

                <h2>🧪 Test Payment:</h2>
                <pre>curl -X POST http://localhost:3003/api/payment/create \\
  -H "Content-Type: application/json" \\
  -d '{
    "amount": "50000",
    "orderInfo": "Thanh toán đơn hàng test",
    "extraData": ""
  }'</pre>

                <h2>📱 Frontend URL:</h2>
                <p>Angular app: <a href="http://localhost:4200/momo-payment">http://localhost:4200/momo-payment</a></p>
            </div>
        </body>
        </html>
    `);
});

// Start server
app.listen(PORT, () => {
    console.log('═══════════════════════════════════════════════════════');
    console.log('🚀 MoMo Payment Server STARTED');
    console.log('═══════════════════════════════════════════════════════');
    console.log(`📍 URL: http://localhost:${PORT}`);
    console.log(`📝 API Docs: http://localhost:${PORT}`);
    console.log('');
    console.log('⚠️  IMPORTANT NOTES:');
    console.log('   - Angular app cần chạy trên: http://localhost:4200');
    console.log('   - Để test IPN, cần dùng ngrok hoặc deploy public');
    console.log('   - Đang dùng test credentials của MoMo');
    console.log('═══════════════════════════════════════════════════════');
});

module.exports = app;

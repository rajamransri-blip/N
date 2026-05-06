const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Railway/Render automatically PORT assign karte hain, warna local pe 3000
const PORT = process.env.PORT || 3000;

// ==========================================
// 1. DYNAMIC UI API (Controls Android App)
// ==========================================
app.get('/api/dynamic-ui', (req, res) => {
    const uiScript = {
        theme: {
            backgroundColor: "#050505", // Deep Black
            cardColor: "#1A1A1A",       // Dark Grey
            glowColor: "#00FF41",       // Hacker Neon Green
            animationType: "slide_up"
        },
        prizePaths: [
            {
                id: "p1",
                title: "PREMIUM CONFIG SETUP",
                price: "₹199",
                imageUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=600&auto=format&fit=crop", // Hacker Matrix Image
                action: "open_payment"
            },
            {
                id: "p2",
                title: "120 FPS OPTIMIZATION",
                price: "₹299",
                imageUrl: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=600&auto=format&fit=crop", // Code Image
                action: "open_payment"
            },
            {
                id: "p3",
                title: "VIP SERVER ACCESS",
                price: "₹499",
                imageUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=600&auto=format&fit=crop", // Cyberpunk Image
                action: "open_payment"
            }
        ]
    };
    res.json(uiScript);
});

// ==========================================
// 2. SERVER UPDATE CHECKER API
// ==========================================
app.get('/api/check-update', (req, res) => {
    res.json({
        status: "success",
        message: "rCore System is up to date.",
        latestVersion: "v2.1"
    });
});

// ==========================================
// 3. PAYMENT / UTR RECEIVER API
// ==========================================
let paymentDatabase = []; // Temporary memory. Real app me MongoDB use karein.

app.post('/api/submit-payment', (req, res) => {
    const { gameId, utr, planId } = req.body;
    
    if(!utr || !gameId) {
        return res.status(400).json({ success: false, message: "Missing Details!" });
    }

    const newPayment = {
        gameId,
        utr,
        planId,
        date: new Date().toISOString(),
        status: "PENDING_VERIFICATION"
    };
    
    paymentDatabase.push(newPayment);
    console.log("🔥 NEW PAYMENT RECEIVED:", newPayment);

    res.json({ 
        success: true, 
        message: "Payment Logged Successfully. Verifying UTR..." 
    });
});

// ==========================================
// 4. CHATBOT PROTOCOL API
// ==========================================
app.post('/api/chatbot', (req, res) => {
    const userMessage = req.body.message ? req.body.message.toLowerCase() : "";

    let reply = "Command not recognized. Type 'help' for options.";
    
    if (userMessage.includes("120fps")) {
        reply = "Optimization Protocol ready. File sent to secure buffer.";
    } else if (userMessage.includes("smooth")) {
        reply = "Lag fix module activated. Awaiting injection.";
    }

    res.json({ reply: reply });
});

// Start the Server
app.listen(PORT, () => {
    console.log(`🚀 rCore Master Server running on port ${PORT}`);
    console.log(`-> Dynamic UI Endpoint: http://localhost:${PORT}/api/dynamic-ui`);
});

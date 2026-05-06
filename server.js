const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Railway automatically assigns a PORT
const PORT = process.env.PORT || 3000;
const ADMIN_SECRET = "raaz_admin_99"; // Yeh aapka secret password hai

// ==========================================
// 🧠 IN-MEMORY DATABASE (Live UI State)
// ==========================================
let currentUiState = {
    theme: {
        backgroundColor: "#050505",
        cardColor: "#1A1A1A",
        glowColor: "#00FF41",
        animationType: "slide_up"
    },
    prizePaths: [
        {
            id: "p1",
            title: "PREMIUM CONFIG SETUP",
            price: "₹199",
            imageUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=600&auto=format&fit=crop",
            action: "open_payment"
        },
        {
            id: "p2",
            title: "120 FPS OPTIMIZATION",
            price: "₹299",
            imageUrl: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=600&auto=format&fit=crop",
            action: "open_payment"
        }
    ]
};

let paymentHistory = [];

// ==========================================
// 📱 ANDROID APP APIs (Users Ke Liye)
// ==========================================

// App khulte hi yeh API hit hogi UI load karne ke liye
app.get('/api/dynamic-ui', (req, res) => {
    res.json(currentUiState);
});

// User jab payment submit karega
app.post('/api/submit-payment', (req, res) => {
    const { gameId, utr, planId } = req.body;
    
    if(!utr || !gameId) {
        return res.status(400).json({ success: false, message: "Details Missing!" });
    }

    paymentHistory.push({ gameId, utr, planId, date: new Date().toISOString(), status: "PENDING" });
    res.json({ success: true, message: "Payment Verified! Processing..." });
});

// ==========================================
// 🛠️ ADMIN APIs (Sirf Aapke Liye)
// ==========================================

// Admin API: App ka UI Change karein bina code edit kiye
app.post('/admin/update-ui', (req, res) => {
    const { adminKey, newUi } = req.body;
    
    // Security Check
    if (adminKey !== ADMIN_SECRET) {
        return res.status(403).json({ success: false, message: "ACCESS DENIED: Invalid Admin Key" });
    }

    if (newUi && newUi.theme && newUi.prizePaths) {
        currentUiState = newUi; // Naya UI save ho gaya
        res.json({ success: true, message: "SYSTEM OVERRIDE: UI Updated for all Android users!" });
    } else {
        res.status(400).json({ success: false, message: "Invalid UI Format" });
    }
});

// Admin API: Saari Payment History dekhein
app.get('/admin/payments', (req, res) => {
    const { adminKey } = req.query;
    
    if (adminKey !== ADMIN_SECRET) {
        return res.status(403).send("ACCESS DENIED");
    }
    
    res.json({ total_payments: paymentHistory.length, data: paymentHistory });
});

// ==========================================
// 🚀 SERVER START (Fixed for Railway)
// ==========================================
// NOTE: '0.0.0.0' lagana zaroori hai Railway ke liye!
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 rCore Master Server Online!`);
    console.log(`-> Port: ${PORT}`);
});

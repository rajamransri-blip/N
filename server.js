const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;
const ADMIN_SECRET = "raaz_admin_99"; // Admin login password

// ==========================================
// 🧠 IN-MEMORY DATABASE (Live App State)
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
// 📱 ANDROID APP APIs (/api/...)
// ==========================================
app.get('/api/dynamic-ui', (req, res) => {
    res.json(currentUiState);
});

app.post('/api/submit-payment', (req, res) => {
    const { gameId, utr, planId } = req.body;
    if(!utr || !gameId) {
        return res.status(400).json({ success: false, message: "Details Missing!" });
    }
    paymentHistory.push({ gameId, utr, planId, date: new Date().toLocaleString(), status: "PENDING" });
    res.json({ success: true, message: "Payment Processing..." });
});

app.get('/api/check-update', (req, res) => {
    res.json({ status: "success", latestVersion: "v2.1" });
});

// ==========================================
// 💻 WEB ADMIN DASHBOARD (/admin)
// ==========================================

// 1. Serve the Visual Web Page (UI for you)
app.get('/admin', (req, res) => {
    // Injecting current JSON into the webpage
    const currentJsonString = JSON.stringify(currentUiState, null, 2);
    
    const htmlPage = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>rCore Admin Panel</title>
        <style>
            body { background-color: #0a0a0a; color: #00ff41; font-family: monospace; padding: 20px; }
            h1 { border-bottom: 2px solid #00ff41; padding-bottom: 10px; }
            .container { max-width: 800px; margin: auto; }
            .box { background: #111; padding: 15px; margin-bottom: 20px; border: 1px solid #333; border-radius: 5px; }
            input, textarea { width: 100%; background: #000; color: #00ff41; border: 1px solid #00ff41; padding: 10px; margin-top: 5px; font-family: monospace; box-sizing: border-box; }
            textarea { height: 250px; }
            button { background: #00ff41; color: #000; border: none; padding: 10px 20px; font-weight: bold; cursor: pointer; margin-top: 10px; width: 100%; font-family: monospace; }
            button:hover { background: #00cc33; }
            .payment-item { background: #222; padding: 10px; margin-top: 5px; border-left: 3px solid #00ff41; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>⚙️ rCore Master Control</h1>
            
            <div class="box">
                <h3>🔑 Admin Authentication</h3>
                <input type="password" id="adminKey" placeholder="Enter Admin Password (raaz_admin_99)">
            </div>

            <div class="box">
                <h3>🛠️ Update Android App UI (JSON Editor)</h3>
                <p>Edit the JSON below to change App Images, Prices, and Colors instantly.</p>
                <textarea id="uiJson">${currentJsonString}</textarea>
                <button onclick="updateUi()">PUSH UPDATE TO APP ⚡</button>
            </div>

            <div class="box">
                <h3>💸 Live Payment History</h3>
                <button onclick="fetchPayments()">REFRESH PAYMENTS</button>
                <div id="paymentList" style="margin-top: 15px;">No payments loaded yet.</div>
            </div>
        </div>

        <script>
            // Function to push new UI to the server
            async function updateUi() {
                const key = document.getElementById('adminKey').value;
                const newUiText = document.getElementById('uiJson').value;
                try {
                    const parsedUi = JSON.parse(newUiText);
                    const res = await fetch('/admin/api/update-ui', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ adminKey: key, newUi: parsedUi })
                    });
                    const data = await res.json();
                    alert(data.message);
                } catch(e) {
                    alert("ERROR: Invalid JSON Format!");
                }
            }

            // Function to fetch payments from the server
            async function fetchPayments() {
                const key = document.getElementById('adminKey').value;
                const res = await fetch('/admin/api/payments?adminKey=' + key);
                if(res.status === 403) {
                    alert("ACCESS DENIED: Wrong Password");
                    return;
                }
                const data = await res.json();
                const listDiv = document.getElementById('paymentList');
                listDiv.innerHTML = "";
                if(data.data.length === 0) listDiv.innerHTML = "No payments found.";
                
                data.data.forEach(p => {
                    listDiv.innerHTML += \`<div class="payment-item">
                        <b>Game ID:</b> \${p.gameId} <br>
                        <b>UTR:</b> \${p.utr} <br>
                        <b>Date:</b> \${p.date} <br>
                        <b>Status:</b> \${p.status}
                    </div>\`;
                });
            }
        </script>
    </body>
    </html>
    `;
    res.send(htmlPage);
});

// 2. Internal Admin APIs (Called by the Web Page above)
app.post('/admin/api/update-ui', (req, res) => {
    const { adminKey, newUi } = req.body;
    if (adminKey !== ADMIN_SECRET) return res.status(403).json({ success: false, message: "ACCESS DENIED" });
    
    currentUiState = newUi;
    res.json({ success: true, message: "✅ UI Updated for all Android users!" });
});

app.get('/admin/api/payments', (req, res) => {
    const { adminKey } = req.query;
    if (adminKey !== ADMIN_SECRET) return res.status(403).send("ACCESS DENIED");
    res.json({ data: paymentHistory });
});

// ==========================================
// 🚀 SERVER START
// ==========================================
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Master Server Online on Port ${PORT}`);
});

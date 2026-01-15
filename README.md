# 🔐 End-to-End Encrypted Real-Time Chat Backend

A **security-first, production-style real-time chat backend** built with **Node.js, Express, and Socket.IO**, implementing **true End-to-End Encryption (E2EE)** using **AES-256-GCM + RSA hybrid cryptography**.

> 🔒 Even the backend server **cannot read messages**  
> ⚡ Messages are delivered in **real time**  
> 🧠 Designed with **system design & security principles**, not tutorials

---

## 🚀 Features

### 🔐 End-to-End Encryption (E2EE)
- AES-256-GCM for message encryption
- RSA-based key exchange (hybrid encryption)
- Unique AES key per message
- Backend stores only encrypted data
- Database breach ≠ message leak

### ⚡ Real-Time Messaging
- Socket.IO (WebSockets)
- JWT-authenticated socket connections
- Online / offline user handling
- Encrypted message relay
- Offline message persistence

### 🟣 Chat UX Features
- Read receipts (sent → delivered → read)
- Typing indicators
- Secure metadata handling (content encrypted, metadata not)

### 🛡️ Security-First Backend
- JWT-based stateless authentication
- Secure password hashing (bcrypt)
- Rate-limited login (brute-force protection)
- Helmet security headers
- Zero plaintext message exposure

### 🧱 Clean Backend Architecture
- Modular Express structure
- Feature-based folders
- Separation of routes, controllers, sockets, and crypto logic

---

## 🧠 Tech Stack

**Backend**
- Node.js
- Express.js

**Real-Time**
- Socket.IO

**Security**
- JWT
- bcrypt
- Helmet
- express-rate-limit

**Cryptography**
- AES-256-GCM
- RSA (OAEP padding)
- Hybrid encryption

**Database**
- MongoDB
- Mongoose

---

## 🏗️ System Architecture (High Level)

```text
┌──────────────┐           Encrypted Payload           ┌──────────────┐
│  Client A    │ ───────────────────────────────────▶ │  Client B    │
│ (Sender)     │                                       │ (Receiver)   │
│              │ ◀─────────────────────────────────── │              │
└──────┬───────┘           Encrypted Payload           └──────┬───────┘
       │                                                      │
       │                    (Blind Relay)                    │
       ▼                                                      ▼
┌────────────────────────────────────────────────────────────────────┐
│                     Backend Server (Node.js)                         │
│                                                                      │
│  - JWT Auth (HTTP + WebSocket)                                       │
│  - Socket.IO (Real-time relay)                                       │
│  - Stores ONLY encrypted blobs                                       │
│  - Cannot decrypt messages                                           │
│                                                                      │
│  MongoDB                                                            │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │ encryptedMessage | encryptedAESKey | iv | authTag | metadata  │ │
│  └───────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────┘
```
## 🔐 Encryption Flow (Hybrid E2EE)

### Sender Side
```text
Plain Message
   ↓
AES-256-GCM Encryption (Random AES Key)
   ↓
Encrypted Message + IV + Auth Tag
   ↓
AES Key Encrypted Using Receiver’s RSA Public Key
```
### Backend Server
```text
Receives encrypted payload
Stores encrypted message and encrypted AES key
Relays encrypted payload to receiver
(No decryption possible)
```
### Receiver Side
```text
Encrypted AES Key → RSA Private Key → AES Key
Encrypted Message → AES Key → Plain Message
```

## 🔑 Why Hybrid Encryption?

| Algorithm | Purpose |
|---------|--------|
| AES-256-GCM | Fast and secure encryption of message content |
| RSA (OAEP) | Secure exchange of AES encryption keys |
| Hybrid Model | Combines high performance with strong security |

> ❌ RSA is **not** used to encrypt messages directly  
> ✅ RSA is used only to encrypt the AES key  

This approach is widely used in secure messaging systems to achieve both efficiency and strong cryptographic guarantees.

## 🔄 Message Lifecycle

```text
User A sends message
   ↓
Client encrypts message using AES-256-GCM
   ↓
AES key encrypted using receiver’s RSA public key
   ↓
Encrypted payload sent via Socket.IO
   ↓
Backend stores encrypted message in MongoDB
   ↓
If receiver is online → real-time delivery
If receiver is offline → stored and delivered on reconnect
   ↓
Receiver decrypts message locally
```

## 🛡️ Security Guarantees

- Backend server never has access to plaintext messages
- Database compromise does not expose chat content
- Message tampering is detected via AES-GCM authentication tags
- All APIs and WebSocket connections are secured using JWT
- Brute-force login attempts are mitigated using rate limiting

## 📌 Disclaimer

This project is built for **learning, system design demonstration, and portfolio purposes**.  
While it implements correct cryptographic primitives and secure architectural patterns, advanced production features such as **key rotation, forward secrecy, and multi-device key management** can be added in future iterations.

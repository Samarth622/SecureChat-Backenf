# 🔐 SecureChat Backend

**End-to-End Encrypted Real-Time Chat Backend built with Node.js, Express, and Socket.IO**

SecureChat is a privacy-focused backend system where **messages remain encrypted end-to-end**, meaning even the server cannot read user messages.  
This project demonstrates how modern secure chat systems work at a **real-world backend architecture level**.

---

## 🚀 Why This Project Exists

Most chat applications store or process messages in plaintext on the server, which means:

❌ Server admins can read messages  
❌ Database breaches expose conversations  
❌ User privacy is compromised  

SecureChat solves this by implementing **Hybrid End-to-End Encryption (AES + RSA)** so that:

✅ Messages are encrypted on the client  
✅ Server only relays encrypted payloads  
✅ Messages are decrypted only by the receiver  
✅ Even a compromised database cannot leak message content  

This backend is designed to simulate how **secure messaging systems (like Signal/WhatsApp)** work internally.

---

## 🔐 Core Features

- 🔒 **End-to-End Encryption** using AES-256-GCM + RSA (Hybrid Encryption)
- ⚡ **Real-time messaging** with Socket.IO
- 🔑 **JWT-based authentication**
- 🚫 Server never sees plaintext messages
- 💾 **Offline message storage**
- 🧱 Clean **Controller–Service architecture**
- 🔐 Secure password hashing with bcrypt
- 🛡️ Security middlewares (Helmet, Rate Limiting)
- 📂 Modular and scalable folder structure

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

![SecureChat System Architecture](./architecture.png)

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

## 🙌 Author

Built by **Samarth Gupta**.

Backend-focused fresher passionate about system design, security, and scalable APIs.

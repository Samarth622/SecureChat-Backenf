import crypto from "crypto";
import { encryptAES, decryptAES } from "./aes.js";
import { encryptWithPublicKey, decryptWithPrivateKey } from "./rsa.js";

const encryptMessageForReceiver = (message, receiverPublicKey) => {
  const aesKey = crypto.randomBytes(32);

  const encryptedMessage = encryptAES(message, aesKey);

  const encryptedAESKey = encryptWithPublicKey(aesKey, receiverPublicKey);

  return {
    encryptedMessage: encryptedMessage.encryptedData,
    iv: encryptedMessage.iv,
    authTag: encryptedMessage.authTag,
    encryptedAESKey: encryptedAESKey.toString("hex"),
  };
};

const decryptMessageFromSender = (payload, receiverPrivateKey) => {
  const { encryptedMessage, iv, authTag, encryptedAESKey } = payload;

  const aesKey = decryptWithPrivateKey(
    Buffer.from(encryptedAESKey, "hex"),
    receiverPrivateKey
  );

  const decryptedMessage = decryptAES(
    encryptedMessage,
    aesKey,
    iv,
    authTag
  );

  return decryptedMessage;
};

export { encryptMessageForReceiver, decryptMessageFromSender };

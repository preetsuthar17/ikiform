import type { Form, FormSchema } from "@/lib/database";

const ENVELOPE_FORMAT = "ikiform-form-export";
const ENVELOPE_VERSION = 1;
const PAYLOAD_VERSION = 1;
const AAD_CONTEXT = "ikiform-form-export-v1";
const PASS_PHRASE_MIN_LENGTH = 8;
export const MAX_IMPORT_FILE_SIZE_BYTES = 5 * 1024 * 1024;

const KDF_ITERATIONS = 310_000;
const KDF_SALT_LENGTH = 16;
const AES_GCM_IV_LENGTH = 12;

export interface DecryptedFormPayloadV1 {
	description: string | null;
	exportedAt: string;
	payloadVersion: 1;
	schema: FormSchema;
	title: string;
}

export interface EncryptedFormExportV1 {
	ciphertext: string;
	encryption: {
		name: "AES-GCM";
		keyLength: 256;
		iv: string;
		aad: typeof AAD_CONTEXT;
	};
	format: typeof ENVELOPE_FORMAT;
	kdf: {
		name: "PBKDF2";
		hash: "SHA-256";
		iterations: number;
		salt: string;
	};
	metadata: {
		exportedAt: string;
		title: string;
	};
	version: 1;
}

function getWebCrypto(): Crypto {
	if (!(globalThis.crypto?.subtle)) {
		throw new Error("Secure transfer is not supported in this environment.");
	}
	return globalThis.crypto;
}

function ensurePassphrase(passphrase: string): void {
	if (passphrase.trim().length < PASS_PHRASE_MIN_LENGTH) {
		throw new Error(
			`Passphrase must be at least ${PASS_PHRASE_MIN_LENGTH} characters.`
		);
	}
}

function getRandomBytes(length: number): Uint8Array {
	const cryptoApi = getWebCrypto();
	const bytes = new Uint8Array(length);
	cryptoApi.getRandomValues(bytes);
	return bytes;
}

function bytesToBase64(bytes: Uint8Array): string {
	if (typeof btoa === "undefined") {
		throw new Error("Base64 encoding is not supported in this environment.");
	}

	let binary = "";
	const chunkSize = 0x80_00;
	for (let i = 0; i < bytes.length; i += chunkSize) {
		binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
	}
	return btoa(binary);
}

function base64ToBytes(base64: string): Uint8Array {
	if (typeof atob === "undefined") {
		throw new Error("Base64 decoding is not supported in this environment.");
	}

	const binary = atob(base64);
	const bytes = new Uint8Array(binary.length);
	for (let i = 0; i < binary.length; i += 1) {
		bytes[i] = binary.charCodeAt(i);
	}
	return bytes;
}

function toArrayBuffer(bytes: Uint8Array): ArrayBuffer {
	const copy = new Uint8Array(bytes.length);
	copy.set(bytes);
	return copy.buffer;
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return !!value && typeof value === "object" && !Array.isArray(value);
}

function assertEncryptedEnvelope(
	value: unknown
): asserts value is EncryptedFormExportV1 {
	if (!isRecord(value)) {
		throw new Error("Invalid encrypted file format.");
	}

	const allowedTopLevelKeys = new Set([
		"format",
		"version",
		"kdf",
		"encryption",
		"metadata",
		"ciphertext",
	]);
	for (const key of Object.keys(value)) {
		if (!allowedTopLevelKeys.has(key)) {
			throw new Error("Encrypted file contains unsupported fields.");
		}
	}

	if (value.format !== ENVELOPE_FORMAT || value.version !== ENVELOPE_VERSION) {
		throw new Error("Unsupported encrypted file version.");
	}

	if (!isRecord(value.kdf)) {
		throw new Error("Invalid key derivation metadata.");
	}

	if (
		value.kdf.name !== "PBKDF2" ||
		value.kdf.hash !== "SHA-256" ||
		typeof value.kdf.iterations !== "number" ||
		value.kdf.iterations <= 0 ||
		typeof value.kdf.salt !== "string"
	) {
		throw new Error("Unsupported key derivation configuration.");
	}

	if (!isRecord(value.encryption)) {
		throw new Error("Invalid encryption metadata.");
	}

	if (
		value.encryption.name !== "AES-GCM" ||
		value.encryption.keyLength !== 256 ||
		typeof value.encryption.iv !== "string" ||
		value.encryption.aad !== AAD_CONTEXT
	) {
		throw new Error("Unsupported encryption configuration.");
	}

	if (!isRecord(value.metadata)) {
		throw new Error("Invalid export metadata.");
	}

	if (
		typeof value.metadata.exportedAt !== "string" ||
		typeof value.metadata.title !== "string"
	) {
		throw new Error("Invalid export metadata.");
	}

	if (typeof value.ciphertext !== "string") {
		throw new Error("Encrypted payload is missing.");
	}
}

function assertDecryptedPayload(
	value: unknown
): asserts value is DecryptedFormPayloadV1 {
	if (!isRecord(value)) {
		throw new Error("Imported payload is invalid.");
	}

	const allowedPayloadKeys = new Set([
		"payloadVersion",
		"exportedAt",
		"title",
		"description",
		"schema",
	]);
	for (const key of Object.keys(value)) {
		if (!allowedPayloadKeys.has(key)) {
			throw new Error("Imported payload contains unsupported fields.");
		}
	}

	if (value.payloadVersion !== PAYLOAD_VERSION) {
		throw new Error("Unsupported payload version.");
	}

	if (typeof value.exportedAt !== "string" || typeof value.title !== "string") {
		throw new Error("Imported payload metadata is invalid.");
	}

	if (!(value.description === null || typeof value.description === "string")) {
		throw new Error("Imported payload description is invalid.");
	}

	if (!isRecord(value.schema)) {
		throw new Error("Imported form schema is invalid.");
	}
}

async function deriveAesKey(
	passphrase: string,
	salt: Uint8Array,
	iterations: number
): Promise<CryptoKey> {
	const cryptoApi = getWebCrypto();
	const passphraseBytes = new TextEncoder().encode(passphrase);
	const keyMaterial = await cryptoApi.subtle.importKey(
		"raw",
		toArrayBuffer(passphraseBytes),
		"PBKDF2",
		false,
		["deriveKey"]
	);

	return cryptoApi.subtle.deriveKey(
		{
			name: "PBKDF2",
			hash: "SHA-256",
			salt: toArrayBuffer(salt),
			iterations,
		},
		keyMaterial,
		{
			name: "AES-GCM",
			length: 256,
		},
		false,
		["encrypt", "decrypt"]
	);
}

export async function exportFormSecure(
	form: Form,
	passphrase: string
): Promise<Blob> {
	ensurePassphrase(passphrase);

	const exportedAt = new Date().toISOString();
	const payload: DecryptedFormPayloadV1 = {
		payloadVersion: PAYLOAD_VERSION,
		exportedAt,
		title: form.title || form.schema?.settings?.title || "Untitled Form",
		description: form.description ?? null,
		schema: form.schema,
	};

	const salt = getRandomBytes(KDF_SALT_LENGTH);
	const iv = getRandomBytes(AES_GCM_IV_LENGTH);
	const aesKey = await deriveAesKey(passphrase, salt, KDF_ITERATIONS);

	const plaintext = new TextEncoder().encode(JSON.stringify(payload));
	const aad = new TextEncoder().encode(AAD_CONTEXT);
	const ciphertextBuffer = await getWebCrypto().subtle.encrypt(
		{
			name: "AES-GCM",
			iv: toArrayBuffer(iv),
			additionalData: toArrayBuffer(aad),
			tagLength: 128,
		},
		aesKey,
		toArrayBuffer(plaintext)
	);

	const encryptedEnvelope: EncryptedFormExportV1 = {
		format: ENVELOPE_FORMAT,
		version: ENVELOPE_VERSION,
		kdf: {
			name: "PBKDF2",
			hash: "SHA-256",
			iterations: KDF_ITERATIONS,
			salt: bytesToBase64(salt),
		},
		encryption: {
			name: "AES-GCM",
			keyLength: 256,
			iv: bytesToBase64(iv),
			aad: AAD_CONTEXT,
		},
		metadata: {
			exportedAt,
			title: payload.title,
		},
		ciphertext: bytesToBase64(new Uint8Array(ciphertextBuffer)),
	};

	return new Blob([JSON.stringify(encryptedEnvelope)], {
		type: "application/json",
	});
}

export async function decryptImportedFormFile(
	file: File,
	passphrase: string
): Promise<DecryptedFormPayloadV1> {
	ensurePassphrase(passphrase);

	if (file.size > MAX_IMPORT_FILE_SIZE_BYTES) {
		throw new Error("File exceeds the 5MB import limit.");
	}

	let parsedEnvelope: unknown;
	try {
		const encryptedContent = await file.text();
		parsedEnvelope = JSON.parse(encryptedContent);
	} catch {
		throw new Error("Unable to parse encrypted import file.");
	}

	assertEncryptedEnvelope(parsedEnvelope);

	const salt = base64ToBytes(parsedEnvelope.kdf.salt);
	const iv = base64ToBytes(parsedEnvelope.encryption.iv);
	const ciphertext = base64ToBytes(parsedEnvelope.ciphertext);

	const aesKey = await deriveAesKey(
		passphrase,
		salt,
		parsedEnvelope.kdf.iterations
	);

	let plaintextBuffer: ArrayBuffer;
	try {
		const decryptedAad = new TextEncoder().encode(
			parsedEnvelope.encryption.aad
		);
		plaintextBuffer = await getWebCrypto().subtle.decrypt(
			{
				name: "AES-GCM",
				iv: toArrayBuffer(iv),
				additionalData: toArrayBuffer(decryptedAad),
				tagLength: 128,
			},
			aesKey,
			toArrayBuffer(ciphertext)
		);
	} catch {
		throw new Error("Invalid passphrase or corrupted file.");
	}

	let parsedPayload: unknown;
	try {
		parsedPayload = JSON.parse(new TextDecoder().decode(plaintextBuffer));
	} catch {
		throw new Error("Decrypted payload is not valid JSON.");
	}

	assertDecryptedPayload(parsedPayload);
	return parsedPayload;
}

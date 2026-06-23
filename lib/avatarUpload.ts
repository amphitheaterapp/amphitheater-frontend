// lib/avatarUpload.ts

import api from "@/lib/axios";

export const ALLOWED_AVATAR_TYPES = ["image/jpeg", "image/png", "image/webp"];

// Client-side only check.
export const MAX_AVATAR_SIZE_BYTES = 5 * 1024 * 1024;

export function validateAvatarFile(file: File): string | null {
    if (!ALLOWED_AVATAR_TYPES.includes(file.type)) {
        return "Please upload a JPEG, PNG, or WebP image.";
    }
    if (file.size > MAX_AVATAR_SIZE_BYTES) {
        return "Image must be under 5MB.";
    }
    return null;
}

// Requires an authenticated session.
export async function uploadAvatar(file: File): Promise<string> {
    const presign = await api.post("/api/v1/auth/avatar/presign/", {
        content_type: file.type,
    });

    // Plain fetch, not the api axios instance, on purpose. This PUT
    // goes straight to R2
    await fetch(presign.data.upload_url, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
    });

    const confirm = await api.post("/api/v1/auth/avatar/confirm/", {
        key: presign.data.key,
    });

    return confirm.data.avatar_url;
}
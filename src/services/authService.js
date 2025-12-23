import axios from "axios";

export async function refresh() {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admin/auth/refresh`, {
        withCredentials: true,
    });
    return res.data;
}

export async function logout(accessToken) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/auth/logout`, {
        method: "POST",
        credentials: "include",
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error("Logout failed: " + text);
    }
    return res.json();
}

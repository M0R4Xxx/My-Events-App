    import { DashboardContent } from "@/components/dashboard-content"
    import { getSession } from "@/lib/auth/server"
    import { redirect } from "next/navigation"

    export default async function DashboardPage() {

        // Proteksi halaman: pastikan sesi valid dan ada data user,
        // kalau nggak ada, lempar user ke halaman login.
        const session = await getSession()
        if (!session || !session.data || !session.data.user) {
            redirect("/login")
        }
        return <DashboardContent userId={session.data.user.id} />
    }
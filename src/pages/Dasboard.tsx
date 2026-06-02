import { useAuth } from "../contexts/AuthContext"

export default function Dashboard() {

    const { user } = useAuth()
    { console.log(user) }

    return (
        <div className="page-container dashboard fade-in">
            <div className="dashboard-header">
                <div>

                    <h1 className="page-title">Good {getGreeting()}, {user?.username} 👋</h1>
                    <p className="page-subtitle">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                </div>

            </div>
        </div>

    )
}

function getGreeting() {
    const h = new Date().getHours()
    if (h < 12) return 'morning'
    if (h < 18) return 'afternoon'
    return 'evening'
}

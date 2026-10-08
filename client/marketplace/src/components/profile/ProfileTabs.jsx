const ProfileTabs = ({ tabs, activeTab, onChange }) => {
    return (
        <nav>
            {
                tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => onChange(tab.id)}
                        disabled={tab.id === activeTab}
                    >
                        {tab.label}
                    </button>
                ))
            }
        </nav>
    )
}

export default ProfileTabs

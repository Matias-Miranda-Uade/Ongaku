const ProfileTabs = ({ tabs, activeTab, onChange }) => {
    return (
        <nav className="profile-tabs" aria-label="Secciones del perfil">
            {
                tabs.map((tab) => (
                    <button
                        key={tab.id}
                        type="button"
                        onClick={() => onChange(tab.id)}
                        disabled={tab.id === activeTab}
                        aria-current={tab.id === activeTab ? 'page' : undefined}
                    >
                        {tab.label}
                    </button>
                ))
            }
        </nav>
    )
}

export default ProfileTabs

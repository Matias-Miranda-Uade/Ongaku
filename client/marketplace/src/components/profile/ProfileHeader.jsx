import ProfileAvatar from "./ProfileAvatar"

const ProfileHeader = ({ user }) => {
    const fullName = typeof user.name === 'string' ? user.name.trim() : ''
    const nameParts = fullName ? fullName.split(/\s+/) : []
    const firstName = user.firstName || nameParts[0] || ''
    const lastName = user.lastName || nameParts.slice(1).join(' ')
    const displayName = fullName || `${firstName} ${lastName}`.trim() || 'Mi cuenta'

    return (
        <header className="profile-header">
        <ProfileAvatar firstName={firstName} lastName={lastName} />
        <div>
            <h1>{displayName}</h1>
            <p>{user.email || 'Cuenta de demostración'}</p>
        </div>
        </header>
    )
}

export default ProfileHeader

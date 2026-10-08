import ProfileAvatar from "./ProfileAvatar"

const ProfileHeader = ({ user }) => {
    const firstName = user.firstName || user.name.split(/\s+/)[0] || ''
    const lastName = user.lastName || user.name.split(/\s+/).slice(1).join(' ')

    return (
        <header className="profile-header">
        <ProfileAvatar firstName={firstName} lastName={lastName} />
        <div>
            <h1>{user.name || `${firstName} ${lastName}`.trim()}</h1>
            <p>{user.email || 'Cuenta de demostración'}</p>
        </div>
        </header>
    )
}

export default ProfileHeader

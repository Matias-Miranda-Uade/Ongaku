// Avatar con las iniciales del usuario
const ProfileAvatar = ({ firstName, lastName }) => {
    const initials = `${firstName?.charAt(0) ?? ''}${lastName?.charAt(0) ?? ''}`.toUpperCase() || 'O'

    return (
        <div className="profile-avatar" aria-label={`Avatar de ${firstName} ${lastName}`}>
            <strong>{initials}</strong>
        </div>
    )
}

export default ProfileAvatar

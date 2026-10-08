import ProfileAvatar from "./ProfileAvatar"

const ProfileHeader = ({ user }) => {
    return (
        <>
        <ProfileAvatar firstName={user.firstName} lastName={user.lastName} />
        <h1>{user.firstName} {user.lastName}</h1>
        <p>{user.email}</p>
        </>
    )
}

export default ProfileHeader

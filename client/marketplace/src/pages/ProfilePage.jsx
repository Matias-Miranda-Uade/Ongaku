import { useState } from "react"
import useCart from "../hooks/useCart"
import useFavorites from "../hooks/useFavorites"
import { user, addresses as initialAddresses, orders } from "../data/mockData"
import ProfileHeader from "../components/profile/ProfileHeader"
import ProfileStats from "../components/profile/ProfileStats"
import ProfileTabs from "../components/profile/ProfileTabs"
import ShipmentCard from "../components/profile/ShipmentCard"
import AuthenticationCard from "../components/profile/AuthenticationCard"

const tabs = [
    { id: 'shipments', label: 'Direcciones' },
    { id: 'authentication', label: 'Seguridad' },
]

const ProfilePage = () => {

    const { totalProducts } = useCart()
    const { favorites } = useFavorites()

    const [activeTab, setActiveTab] = useState('shipments')
    const [addresses, setAddresses] = useState(initialAddresses)

    const setDefault = (id) => {
        setAddresses(addresses.map((a) => ({ ...a, isDefault: a.id === id })))
    }

    const removeAddress = (id) => {
        const remaining = addresses.filter((a) => a.id !== id)
        if (remaining.length > 0 && !remaining.some((a) => a.isDefault)) {
            remaining[0] = { ...remaining[0], isDefault: true }
        }
        setAddresses(remaining)
    }

    return (
        <>
        <ProfileHeader user={user} />
        <ProfileStats orders={orders.length} favorites={favorites.length} cartProducts={totalProducts} />
        <ProfileTabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
        {activeTab === 'shipments' && (
            addresses.length === 0
                ? <p>No tenés direcciones de envío</p>
                : addresses.map((address) => (
                    <ShipmentCard
                        key={address.id}
                        address={address}
                        onSetDefault={setDefault}
                        onRemove={removeAddress}
                    />
                ))
        )}
        {activeTab === 'authentication' && <AuthenticationCard email={user.email} />}
        </>
    )
}

export default ProfilePage

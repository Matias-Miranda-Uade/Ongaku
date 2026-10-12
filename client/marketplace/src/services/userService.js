import {
  cancelOrder,
  changePassword,
  getOrder,
  getOrders,
  getProfile,
  updateProfile,
} from './api'

const userService = { getProfile, updateProfile, changePassword, getOrders, getOrder, cancelOrder }

export { getProfile, updateProfile, changePassword, getOrders, getOrder, cancelOrder }
export default userService

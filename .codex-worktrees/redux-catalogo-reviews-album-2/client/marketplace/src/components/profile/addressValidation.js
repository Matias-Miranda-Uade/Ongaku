export const normalizeAddress = (address) => Object.fromEntries(Object.entries(address).map(([field, value]) => [field, field === 'zipCode' ? String(value ?? '').trim().toUpperCase() : String(value ?? '').trim()]))

export const validateAddress = (address) => {
  const data = normalizeAddress(address)
  const errors = {}
  const limits = { recipient: 120, street: 200, city: 100, province: 100, zipCode: 20, country: 100, phone: 40, instructions: 500 }
  for (const [field, max] of Object.entries(limits)) {
    if (field !== 'instructions' && !data[field]) errors[field] = 'Este campo es obligatorio.'
    else if ((data[field] ?? '').length > max) errors[field] = `Máximo ${max} caracteres.`
  }
  if (data.recipient && !/^[\p{L}\p{M}][\p{L}\p{M} .’'-]*[\p{L}\p{M}]$/u.test(data.recipient)) errors.recipient = 'Ingresá un nombre válido, sin números ni símbolos.'
  for (const field of ['city', 'province', 'country']) {
    if (data[field] && (!/\p{L}/u.test(data[field]) || !/^[\p{L}\p{M}\d .’'-]+$/u.test(data[field]))) errors[field] = 'Ingresá un nombre válido.'
  }
  if (data.street && (!/\p{L}/u.test(data.street) || !/(\d|s\/n)/i.test(data.street) || !/^[\p{L}\p{M}\d .,’'°º/#()-]+$/u.test(data.street))) errors.street = 'Indicá la calle y su número (o s/n), incluyendo piso y departamento si corresponde.'
  else if (data.street && /\d{6,}/.test(data.street)) errors.street = 'La altura debe tener entre 1 y 5 dígitos.'
  const argentina = data.country?.toLowerCase() === 'argentina'
  if (data.country && !/^[\p{L}\p{M}][\p{L}\p{M} .’'-]*[\p{L}\p{M}]$/u.test(data.country)) errors.country = 'Ingresá un país válido, sin números.'
  if (data.zipCode && !(argentina ? /^(?:[1-9]\d{3}|[A-HJ-NP-Z][1-9]\d{3}[A-Z]{3})$/ : /^[A-Z0-9][A-Z0-9 -]{1,10}[A-Z0-9]$/).test(data.zipCode)) errors.zipCode = argentina ? 'Usá 4 números (1000) o un CPA completo (C1000ABC).' : 'Usá entre 3 y 12 letras o números; solo espacios y guiones como separadores.'
  if (data.phone && (!/^\+?[\d ()-]+$/.test(data.phone) || !/^\d{8,15}$/.test(data.phone.replace(/\D/g, '')))) errors.phone = 'Ingresá entre 8 y 15 dígitos. Podés usar +, espacios, guiones y paréntesis.'
  if (data.instructions && /[\u0000-\u001f\u007f]/.test(data.instructions)) errors.instructions = 'No se permiten caracteres de control.'
  return errors
}

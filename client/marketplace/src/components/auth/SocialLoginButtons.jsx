import Button from '../ui/Button'

const SocialLoginButtons = ({ onLogin }) => (
  <div>
    <Button onClick={() => onLogin('Google')}>Simular acceso con Google</Button>
    <Button onClick={() => onLogin('Apple')}>Simular acceso con Apple</Button>
  </div>
)
export default SocialLoginButtons

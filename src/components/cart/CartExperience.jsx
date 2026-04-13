import { useLocation } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import CheckoutModal from '../CheckoutModal/CheckoutModal';
import CartDrawer from './CartDrawer';

const HIDDEN_PATH_PREFIXES = ['/admin'];
const HIDDEN_EXACT_PATHS = ['/login', '/register'];

export default function CartExperience() {
  const { pathname } = useLocation();
  const { checkoutState, closeCheckout, completeCheckout } = useCart();

  const shouldHide =
    HIDDEN_EXACT_PATHS.includes(pathname) ||
    HIDDEN_PATH_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  if (shouldHide) return null;

  return (
    <>
      <CartDrawer />
      <CheckoutModal
        isOpen={checkoutState.isOpen}
        items={checkoutState.items}
        mode={checkoutState.mode}
        onClose={closeCheckout}
        onOrderSuccess={completeCheckout}
      />
    </>
  );
}

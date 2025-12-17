import { texts } from '@/app/content/texts';

interface QuantityControlProps {
  quantity: number;
  onDecrease: () => void;
  onIncrease: () => void;
  decreaseTestId?: string;
  increaseTestId?: string;
}

export function QuantityControl({
  quantity,
  onDecrease,
  onIncrease,
  decreaseTestId,
  increaseTestId,
}: QuantityControlProps) {
  const buttonStyles = 'w-7 h-7 flex items-center justify-center border border-neutral-300 rounded hover:bg-neutral-100 transition';

  return (
    <div className="flex items-center gap-3">
      <label className="text-sm text-neutral-700">{texts.cart.quantity}:</label>
      <div className="flex items-center gap-2">
        <button
          onClick={onDecrease}
          className={buttonStyles}
          aria-label={texts.cart.decreaseQuantity}
          data-testid={decreaseTestId}
        >
          -
        </button>
        <span className="w-8 text-center">{quantity}</span>
        <button
          onClick={onIncrease}
          className={buttonStyles}
          aria-label={texts.cart.increaseQuantity}
          data-testid={increaseTestId}
        >
          +
        </button>
      </div>
    </div>
  );
}

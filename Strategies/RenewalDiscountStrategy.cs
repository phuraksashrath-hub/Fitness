public class RenewalDiscountStrategy : IDiscountStrategy
{
    public decimal GetDiscount(decimal amount) => amount * 0.15m;
}
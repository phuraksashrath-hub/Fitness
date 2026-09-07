public interface IDiscountStrategy
{
    decimal GetDiscount(decimal amount);
}
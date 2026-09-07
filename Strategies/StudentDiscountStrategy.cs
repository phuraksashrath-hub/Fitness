public class StudentDiscountStrategy : IDiscountStrategy
{
    public decimal GetDiscount(decimal amount) => amount * 0.10m;
}